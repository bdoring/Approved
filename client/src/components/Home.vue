<!-- PDF VIEWER -->
<!-- <object data="https://s3-us-west-2.amazonaws.com/approved-capstone/1-003" type="application/pdf" width="600px" height="830px">
</object> -->


<template>
    <div class="container">
      <h1>Hello, {{ user.first_name | proper }}</h1>
        <div class="home-dashboard">
          <div class="searchbar">
            <v-text-field
            prepend-icon="search"
            v-model="searchbar"
            label="Search by invoice number"
            @input="searchInvoices"
            ></v-text-field>
          </div>
          <h2>Invoices Ready To Be Scheduled</h2>
          <div class="approved">
            <div
              class="vendor-approved"
              v-for="invoice in invoicesApproved"
              v-if="invoicesApproved.length > 0"
              >
              <p>Vendor: {{invoice.name}}</p>
              <p>Invoice Number: {{invoice.invoice_number}}</p>
              <p>Amount: ${{ invoice.amount | currencyFormat }}</p>
              <p>Due date: {{invoice.invoice_due_date | formatDate }} - <b>{{dueDate(invoice.invoice_due_date)}}</b></p>
              <p>Payment method: {{ invoice.payment_method}}</p>
              <p>Approved by: {{invoice.first_name | proper }} {{invoice.last_name | proper }}</p>
              <div class="controls">
                <v-btn
                @click="schedulePayment(invoice.id)"
                outline><v-icon left style="font-size: 18px;">fa-calendar</v-icon>Schedule Payment</v-btn>
              </div>
            </div>
            <div class="no-invoices" v-if="invoicesApproved.length === 0">
              <p>No invoices.</p>
            </div>
          </div>
          <br>
          <h2>Invoices Pending Approval</h2>
          <div class="pending">
            <div class="vendor-pending"
              v-if="invoicesPending.length > 0"
              v-for="invoice in invoicesPending">
              <div>
                <p>Vendor: {{invoice.name}}</p>
                <p>Invoice Number: {{invoice.invoice_number}}</p>
                <p>Amount: ${{ invoice.amount | currencyFormat }}</p>
                <p value="hi">Due date: {{invoice.invoice_due_date | formatDate }} - <b>{{dueDate(invoice.invoice_due_date)}}</b></p>
                <p>Payment method: {{ invoice.payment_method}}</p>
                <p>Pending approval from: {{invoice.first_name | proper }} {{invoice.last_name | proper }}</p>
                <div style="text-align: center">
                  <a v-bind:href="invoice.url"
                  target="_blank">
                    <v-btn
                      style="margin-left: 0"
                      color="orange darken-2"
                      outline
                    ><v-icon
                      dark left>insert_drive_file</v-icon>
                      See Invoice PDF
                    </v-btn>
                  </a>
                </div>
              </div>
            </div>
            <div class="no-invoices" v-if="invoicesPending.length === 0">
              <p>No invoices.</p>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user')),
      allInvoices: [],
      searchbar: "",
      invoicesPending: [],
      invoicesApproved: []
    }
  },
  methods: {
    dueDate(invoiceDueDate) {
      let milisecondsInADay = 1000 * 60 * 60 * 24;
      let today = new Date().toISOString().slice(0,10);
      let dueDate = (new Date(today) - new Date(invoiceDueDate)) / milisecondsInADay;
      return dueDate < 0 ? `${dueDate * (-1)} days until due` : `${dueDate} days past due`;
    },
    schedulePayment(invoiceID){
      this.axios.patch(`/invoices/schedule/${invoiceID}`)
        .then(response => {
          console.log('scheduled invoice response:', response.data);
          this.allInvoices = this.allInvoices.filter(invoice => invoice.id != invoiceID);
          this.invoicesApproved = this.allInvoices.filter(invoice => (invoice.status.toLowerCase() === 'approved') && (!invoice.scheduled));
          this.$store.dispatch("updateInvoicesApproved", this.invoicesApproved);
        })
    },
    searchInvoices(){
      this.invoicesPending = this.allInvoices.filter(invoices => invoices.invoice_number.toLowerCase().includes(this.searchbar.toLowerCase()) && invoices.status.toLowerCase() === "pending")
      this.invoicesApproved = this.allInvoices.filter(invoices => invoices.invoice_number.toLowerCase().includes(this.searchbar.toLowerCase()) && invoices.status.toLowerCase() === "approved")
    }
  },
  created(){
    this.axios.get('/invoices')
      .then(response => {
        console.log('response from invoices/home:', response.data);
        this.allInvoices = response.data.filter(invoice => {
          if (invoice.status.toLowerCase() !== "rejected") {
            let formattedDate = new Date(invoice.invoice_due_date).toISOString().slice(0,10);
            invoice.invoice_due_date = formattedDate;
            if (invoice.status.toLowerCase() === 'pending') {
              this.invoicesPending.push(invoice);
            }
            if ((invoice.status.toLowerCase() === 'approved') && (!invoice.scheduled)) {
              this.invoicesApproved.push(invoice);
            }
            return invoice;
          }
        });
        this.$store.dispatch("updateInvoicesApproved", this.invoicesApproved);
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.home-dashboard{
  margin-top: 10px;
}

.searchbar{
  width: 300px;
}

.vendor-pending, .vendor-approved{
  flex: 1;
  text-align: left;
  margin: 10px;
  font-size: 15px;
  padding: 20px;
  border: 1px solid lightgrey;
  border-radius: 5px;
  min-width: 400px;
  max-width: 400px;
}

.vendor-pending{
  background: #e0e0eb;
}

.vendor-approved{
  background-color: #f0f0f5;
}

.pending, .approved{
  display: flex;
  flex-wrap: nowrap;
  overflow-y: scroll;

  border: 1px dotted grey;
  margin: 5px;
  border-radius: 5px;
  padding: 10px;
}

.no-invoices > p{
  display: table-cell;
  padding: 10px;
}

p{
  font-size: 17px;
}

.controls{
  text-align: center;
}

a{
  text-decoration:none;
}

</style>
