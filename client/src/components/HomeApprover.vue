<template>
  <div class="container">
    <h1>Hello, {{ user.first_name | proper }}</h1>
    <div class="home-dashboard">
      <div v-if="pendingInvoices.length > 0">
        <h2>The Below Invoices Are Pending Your Approval</h2>
        <div class="searchbar">
          <v-text-field
          prepend-icon="search"
          v-model="searchbar"
          label="Search by invoice number"
          @input="searchInvoices"
          ></v-text-field>
        </div>
        <div v-for="(invoice, index) in invoiceList">
          <div class="vendor-pending" v-bind:class="{myBackground: (index % 2)}">
            <div>
              <p>Vendor: {{invoice.name}}</p>
              <p>Invoice Number: {{invoice.invoice_number}}</p>
              <p>Amount: ${{ invoice.amount | currencyFormat }}</p>
              <p>Due date: {{invoice.invoice_due_date | formatDate }} - <b v-bind:class="{due: invoice.message.includes('past')}">{{invoice.message}}</b></p>
              <p>Payment method: {{ invoice.payment_method}}</p>
              <div style="text-align:left">
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
            <div class="controls">
              <div>
                <v-btn
                  color="primary"
                  dark
                  @click="approveOrRejectInvoice(invoice.id, 'APPROVED')"
                  >Approve
                    <v-icon dark right>check_circle</v-icon>
                </v-btn>
              </div>
              <div>
                <v-btn
                  color="red"
                  dark
                  @click="approveOrRejectInvoice(invoice.id, 'REJECTED')"
                  >Reject
                  <v-icon dark right>block</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
          <hr />
        </div>
      </div>
      <div v-if="!pendingInvoices.length > 0">
        <h2>You don't have any invoices pending approval at this time.</h2>
      </div>
    </div>
  </div>
</template>

<script>
	export default {
		data() {
			return {
          user: JSON.parse(localStorage.getItem('user')),
          pendingInvoices: [],
          invoiceList: [],
          seeInvoice: false,
          searchbar: ""
			}
		},
    methods: {
      dueDate(invoiceDueDate) {
        let milisecondsInADay = 1000 * 60 * 60 * 24;
        let today = new Date().toISOString().slice(0,10);
        let dueDate = (new Date(today) - new Date(invoiceDueDate)) / milisecondsInADay;
        return dueDate < 0 ? `${dueDate * (-1)} days until due date` : `${dueDate} days past due`;
      },
      approveOrRejectInvoice(invoiceID, newStatus){
        let formData = new FormData();
        formData.append('status', newStatus);
        this.axios.patch(`/invoices/status/${invoiceID}`, formData)
          .then(response => {
            console.log('response from approved invoice:', response.data);
            this.pendingInvoices = this.pendingInvoices.filter(invoice => invoice.id !== invoiceID);
            this.invoiceList = this.pendingInvoices;
          })
          .catch(err => {
            console.log('error from approved invoice:', err.response);
          })
      },
      searchInvoices(){
        this.invoiceList = this.pendingInvoices.filter(invoice => invoice.invoice_number.toLowerCase().includes(this.searchbar.toLowerCase()))
      }
    },
    created(){
      this.axios.get('/invoices')
        .then(response => {
          this.pendingInvoices = response.data.filter(invoice => {
            if ((invoice.action_user == this.user.id) && (invoice.status.toLowerCase() === "pending")) {
              let formattedDate = new Date(invoice.invoice_due_date).toISOString().slice(0,10);
              invoice.invoice_due_date = formattedDate;
              invoice.message = this.dueDate(invoice.invoice_due_date);
              return invoice;
            }
          });
          this.invoiceList = this.pendingInvoices;
          console.log("this approvers invoices are:", this.pendingInvoices);
        })
    }
	}
</script>

<style scoped>

.home-dashboard{
  margin-top: 10px;
  text-align: center;
}

.home-dashboard > div{
  margin: 5px;
  border-radius: 5px;
  padding: 10px;
}

.searchbar{
  width: 300px;
  margin: 0 auto;
}

.vendor-pending{
  display: flex;
  justify-content: center;
  margin: 20px;
  font-size: 15px;
  background: #e0e0eb;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid lightgrey;
}

.vendor-pending > div {
  flex: 1;
  max-width: 370px;
  overflow-x: scroll;
}

p{
  font-size: 17px;
  text-align: left;
}

b{
  color: green;
}

.due{
  color: red;
  text-transform: uppercase;
}

.controls{
  padding: 20px;
  text-align: left;
}

.hidden{
  height: 0;
  visibility: hidden;
}

.invoicePDF{
  display: block;
}

.myBackground{
  background-color: #f0f0f5;
}

a{
  text-decoration:none;
}
</style>
