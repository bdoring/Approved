<template>
    <div class="container">
        <h1 style="font-size: 35px;">Hello, {{ user.first_name | proper }}</h1>
        <div
          class="searchbar"
          v-if="allInvoices.length > 0"
          >
          <v-text-field
          prepend-icon="search"
          v-model="searchbar"
          label="Search by invoice number"
          @input="searchInvoices"
          style="margin-left:10px; margin-bottom: -10px;"
          ></v-text-field>
        </div>
        <div class="home-dashboard">
          <h2>Invoices Ready To Be Scheduled</h2>
          <div class="approved">
            <div
              class="vendor-approved"
              v-for="invoice in invoicesApproved"
              v-if="invoicesApproved.length > 0"
              >
              <p><b>VENDOR:</b> {{invoice.name}}</p>
              <p><b>INVOICE NUMBER:</b> {{invoice.invoice_number}}</p>
              <p><b>AMOUNT:</b> ${{ invoice.amount | currencyFormat }}</p>
               <p><b>DUE DATE:</b> {{ invoice.invoice_due_date | formatDate }} -
                 <span class="not-due" v-bind:class="{pastDue: invoice.message.includes('past')}">
                  <b><u>{{ invoice.message }}</u></b>
                   <v-icon
                    v-if="invoice.message.includes('past')"
                    style="font-size:20px"
                    color="red"
                    >fa-exclamation</v-icon>
                 </span>
               </p>
              <p><b>PAYMENT METHOD:</b> {{ paymentMethod(invoice.payment_method) }}</p>
              <p><b>APPROVED BY:</b> {{invoice.first_name | proper }} {{invoice.last_name | proper }} on {{ invoice.updated_at | formatDate }}</p>
              <div class="controls">
                <v-btn
                @click="schedulePayment(invoice.id)"
                outline><v-icon left style="font-size: 18px; color:#3276CC">fa-calendar</v-icon>Schedule Payment</v-btn>
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
                <p><b>VENDOR:</b> {{invoice.name}}</p>
                <p><b>INVOICE NUMBER:</b> {{invoice.invoice_number}}</p>
                <p><b>AMOUNT:</b> ${{ invoice.amount | currencyFormat }}</p>
                <p><b>DUE DATE:</b> {{ invoice.invoice_due_date | formatDate }} -
                  <span class="not-due" v-bind:class="{pastDue: invoice.message.includes('past')}">
                   <b><u>{{ invoice.message }}</u></b>
                    <v-icon
                     v-if="invoice.message.includes('past')"
                     style="font-size:20px;"
                     color="red"
                     >fa-exclamation-triangle</v-icon>
                  </span>
                </p>
                <p><b>PAYMENT METHOD:</b> {{ paymentMethod(invoice.payment_method)}}</p>
                <p><b>PENDING APPROVAL FROM:</b> {{invoice.first_name | proper }} {{invoice.last_name | proper }}</p>
                <p><b>APPROVAL REQUEST SENT ON:</b> {{ invoice.created_at | formatDate }}</p>
                <div style="text-align: center">
                  <a v-bind:href="invoice.url"
                  target="_blank">
                    <v-btn
                      style="margin-left: 0"

                      outline
                    ><v-icon
                        dark
                        left
                        color="red"
                        >fa-file-pdf-o</v-icon>
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
    paymentMethod(pmt){
      return pmt.toLowerCase() === 'ach' ? pmt.toUpperCase() : this.$options.filters.proper(pmt);
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
      this.invoicesApproved = this.allInvoices.filter(invoices => invoices.invoice_number.toLowerCase().includes(this.searchbar.toLowerCase()) && (invoices.status.toLowerCase() === "approved" && (!invoices.scheduled)))
    }
  },
  created(){
    this.axios.get('/invoices')
      .then(response => {
        console.log('response from invoices/home:', response.data);
        this.allInvoices = response.data.filter(invoice => {
          if (invoice.status.toLowerCase() !== "rejected") {
            invoice.invoice_due_date = this.toISODateFormat(invoice.invoice_due_date);
            invoice.created_at = this.toISODateFormat(invoice.created_at);
            invoice.updated_at = this.toISODateFormat(invoice.updated_at);
            invoice.message = this.invoiceDueMessage(invoice.invoice_due_date);
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

h1{
  font-size: 35px;
}

h2{
  font-size: 25px;
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
  border: 1px solid #cbd2db;
  border-radius: 5px;
  max-width: 450px;
  min-width: 450px;
  background: #ffffff;
}

.pending, .approved{
  display: flex;
  flex-wrap: nowrap;
  overflow-y: scroll;
  border: 1px dotted grey;
  margin: 5px;
  border-radius: 5px;
  padding: 10px;
  background: #f5f5f5;
}

.approved::after{
  content: "";
  flex: 0 0 10px;
}

.pending::after{
  content: "";
  flex: 0 0 10px;
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

.not-due{
  color: green;
}

.pastDue{
  color: red;
}

</style>
