<template>
  <div class="container">
    <h1>Past Invoices</h1>

    <h2>Your Approved Invoices</h2>
    <div class="approved">
        <div class="approved-invoices" v-for="invoice in invoices" v-if="invoice.status.toLowerCase() === 'approved'">
          <div>
            <p>Vendor: {{invoice.name}}</p>
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
    </div>
    <h2>Your Rejected Invoices</h2>
    <div class="rejected">
      <div class="rejected-invoices" v-for="invoice in invoices" v-if="invoice.status.toLowerCase() === 'rejected'">
        <div>
          <p>Vendor: {{invoice.name}}</p>
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
    </div>
  </div>
</template>

<script>
	export default {
		data() {
			return {
        user: JSON.parse(localStorage.getItem('user')),
        invoices: [],
			}
		},
    created(){
      this.axios.get('/invoices')
        .then(response => {
          this.invoices = response.data.filter(invoice => {
            if ((invoice.action_user == this.user.id) && (invoice.status.toLowerCase() !== "pending")) {
              let formattedDate = new Date(invoice.invoice_due_date).toISOString().slice(0,10);
              invoice.invoice_due_date = formattedDate;
              return invoice;
            }
          });
          console.log('invoices:', this.invoices)
        })
    }
	}
</script>

<style scoped>
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
