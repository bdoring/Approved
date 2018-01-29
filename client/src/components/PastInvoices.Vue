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
            <p>Vendor: {{invoice.name}}</p>
            <p>Invoice number: {{invoice.invoice_number}}</p>
            <p>Amount: ${{ invoice.amount | currencyFormat }}</p>
            <p>Due date: {{invoice.invoice_due_date | formatDate }}</p>
            <p>Payment method: {{ invoice.payment_method}}</p>
            <p>Status: <b>{{ invoice.status | proper }}</b></p>
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
        </div>
        <div class="no-invoices" v-if="!approvedInvoices.length > 0">
          <p>No invoices.</p>
        </div>
    </div>
    <h2>Your Rejected Invoices</h2>
    <div class="rejected">
      <div class="rejected-invoices" v-for="invoice in rejectedInvoices" v-if="invoice.status.toLowerCase() === 'rejected'">
        <div>
          <p>Vendor: {{invoice.name}}</p>
          <p>Invoice number: {{invoice.invoice_number}}</p>
          <p>Amount: ${{ invoice.amount | currencyFormat }}</p>
          <p>Due date: {{invoice.invoice_due_date | formatDate }}</p>
          <p>Payment method: {{ invoice.payment_method}}</p>
          <p>Status: <b>{{ invoice.status | proper }}</b></p>
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
              let formattedDate = new Date(invoice.invoice_due_date).toISOString().slice(0,10);
              invoice.invoice_due_date = formattedDate;
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
  margin: 10px 30px;
  font-size: 17px;
  background: #f0f0f5;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid lightgrey;
}

a{
  text-decoration:none;
}
</style>
