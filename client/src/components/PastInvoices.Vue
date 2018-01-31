<template>
  <div class="container">
    <h1>Past Invoices</h1>

    <div class="searchbar" v-if="allInvoices.length > 0">
      <v-text-field
      prepend-icon="search"
      v-model="searchbar"
      label="Search by invoice number"
      @input="searchInvoices"
      ></v-text-field>
    </div>
    <h2>Your Approved Invoices</h2>
    <div class="approved">
        <div class="approved-invoices" v-for="invoice in approvedInvoices" v-if="invoice.status.toLowerCase() === 'approved'">
          <div>
            <p><b>VENDOR:</b> {{invoice.name}}</p>
            <p><b>INVOICE NUMBER:</b> {{invoice.invoice_number}}</p>
            <p><b>AMOUNT:</b> ${{ invoice.amount | currencyFormat }}</p>
            <p><b>DUE DATE:</b> {{invoice.invoice_due_date | formatDate }}</p>
            <p><b>PAYMENT METHOD:</b> {{ invoice.payment_method}}</p>
            <p><b>STATUS:</b> {{ invoice.status | proper }} on {{ invoice.updated_at | formatDate}}</p>
            <div v-if="invoice.scheduled">
              <p style="text-align: center">
                <v-icon
                  color="green"
                  style="font-size: 20px; vertical-align: top; margin-right: 5px;"
                  >fa-calendar-check-o</v-icon>
                Payment has been scheduled.</p>
            </div>
            <div v-if="!invoice.scheduled">
              <p style="text-align: center">
                <v-icon
                  style="font-size: 20px; vertical-align: top; margin-right: 5px; color: #FF9000"
                  >fa-calendar-times-o</v-icon>
                Payment has not yet been schedule.</p>
            </div>
            <div style="text-align:center">
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
        <div class="no-invoices" v-if="!approvedInvoices.length > 0">
          <p>No invoices.</p>
        </div>
    </div>
    <h2>Your Rejected Invoices</h2>
    <div class="rejected">
      <div class="rejected-invoices" v-for="invoice in rejectedInvoices" v-if="invoice.status.toLowerCase() === 'rejected'">
        <div>
          <p><b>VENDOR:</b> {{invoice.name}}</p>
          <p><b>INVOICE NUMBER:</b> {{invoice.invoice_number}}</p>
          <p><b>AMOUNT:</b> ${{ invoice.amount | currencyFormat }}</p>
          <p style="text-align: center">
            <v-icon
              color="red"
              style="font-size: 20px; vertical-align: top; margin-right: 5px;"
              >fa-user-times</v-icon>
            {{ invoice.status | proper }} on {{ invoice.updated_at | formatDate}}</p>
          <div style="text-align:center">
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
      <div class="no-invoices" v-if="!rejectedInvoices.length > 0">
        <p>No invoices.</p>
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
        approvedInvoices: [],
        rejectedInvoices: [],
        searchbar: ""
			}
		},
    methods: {
      searchInvoices(){
        this.rejectedInvoices = this.allInvoices.filter(invoices => invoices.invoice_number.toLowerCase().includes(this.searchbar.toLowerCase()) && invoices.status.toLowerCase() === "rejected")
        this.approvedInvoices = this.allInvoices.filter(invoices => invoices.invoice_number.toLowerCase().includes(this.searchbar.toLowerCase()) && invoices.status.toLowerCase() === "approved")
      }
    },
    created(){
      this.axios.get('/invoices')
        .then(response => {
          this.allInvoices = response.data.filter(invoice => {
            if ((invoice.action_user == this.user.id) && (invoice.status.toLowerCase() !== "pending")) {
              invoice.invoice_due_date = this.toISODateFormat(invoice.invoice_due_date);
              invoice.updated_at = this.toISODateFormat(invoice.updated_at);
              invoice.status.toLowerCase() === 'approved' ? this.approvedInvoices.push(invoice) : this.rejectedInvoices.push(invoice)
              return invoice;
            }
          });
          console.log('invoices:', this.allInvoices)
        })
    }
	}
</script>

<style scoped>

.searchbar{
  width: 300px;
}

.no-invoices > p{
  display: table-cell;
  padding: 10px;
  font-size: 17px;
}

.approved, .rejected{
  display: flex;
  flex-wrap: nowrap;
  overflow-y: scroll;
  border: 1px dotted grey;
  border-radius: 5px;
  margin-bottom: 20px;
}

.approved-invoices, .rejected-invoices{
  flex: 1;
  margin: 10px;
  font-size: 17px;
  background: #f0f0f5;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid lightgrey;
  max-width: 450px;
  min-width: 450px;
}

.approved::after{
  content: "";
  flex: 0 0 10px;
}

a{
  text-decoration:none;
}
</style>
