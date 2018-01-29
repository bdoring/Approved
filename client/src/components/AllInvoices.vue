<template>
  <div class="container">
    <h1>All Invoices</h1>
    <v-card color="grey lighten-4" flat>
      <v-card-text style="border: 1px dotted grey; margin-top: 10px;">
        <v-container fluid>
          <v-layout row wrap>
            <v-flex xs12 sm6>
              <v-subheader v-text="'Please select vendor:'" style="font-size:20px; padding-left: 60px;"></v-subheader>
            </v-flex>
            <v-flex xs12 sm6>
              <v-select
              v-bind:items="vendorList"
              v-model="vendor"
              item-text="name"
              label="Select Vendor"
              validate-on-blur
              @input="vendorSelected"
              autocomplete
              ></v-select>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>

    <!-- SEARCH BAR -->
    <div v-if="vendor">
      <div v-if="invoiceList.length > 0 || allInvoices.length > 0">
        <div class="searchbar">
          <v-text-field
          prepend-icon="search"
          v-model="searchbar"
          label="Search by invoice number"
          @input="searchInvoices"
          ></v-text-field>
        </div>
        <div class="all-invoices">
          <div class="invoices"
            v-for="invoice in invoiceList"
            >
            <div>
              <p>Vendor: {{invoice.name}}</p>
              <p>Invoice Number: {{invoice.invoice_number}}</p>
              <p>Amount: ${{ invoice.amount | currencyFormat }}</p>
              <p value="hi">Due date: {{invoice.invoice_due_date | formatDate }}</p>
              <p>Payment method: {{ invoice.payment_method}}</p>
              <div v-if="invoice.status.toLowerCase() === 'pending'">
                <p>Pending approval from: {{invoice.first_name | proper }} {{invoice.last_name | proper }}</p>
              </div>
              <div v-else-if="invoice.status.toLowerCase() === 'approved'">
                <p>Approved by: {{invoice.first_name | proper }} {{invoice.last_name | proper }}</p>
              </div>
              <div v-else-if="invoice.status.toLowerCase() === 'rejected'">
                <p>Rejected by: {{invoice.first_name | proper }} {{invoice.last_name | proper }}</p>
              </div>
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
        </div>
      </div>
      <div class="no-invoices" v-if="(!invoiceList.length > 0) && (allInvoices.length !== 0)">
        <p>No invoices found.</p>
      </div>
      <div class="no-invoices" v-if="allInvoices.length === 0">
        <p>No invoices from this vendor have been received yet.</p>
      </div>
    </div>

  </div>
</template>

<script>
	export default {
		data() {
			return {
        vendorList: [],
        vendor: null,
        allInvoices: [],
        invoiceList: [],
        searchbar: ""
			}
		},
    methods:{
      vendorSelected(){
        console.log('vendor id:', this.vendor);
        this.axios.get('/invoices')
          .then(response => {
            this.allInvoices = response.data.filter(invoice => {
              if (invoice.vendor_id == this.vendor.id) {
                let formattedDate = new Date(invoice.invoice_due_date).toISOString().slice(0,10);
                invoice.invoice_due_date = formattedDate;
                return invoice;
              }
            });
            this.invoiceList = this.allInvoices;
            console.log('invoice list:', this.invoiceList)
          })
      },
      searchInvoices(){
        this.invoiceList = this.allInvoices.filter(invoice => invoice.invoice_number.toLocaleLowerCase().includes(this.searchbar.toLowerCase()))
      }
    },
    created(){
      this.axios.get('/vendors')
        .then(response => {
          this.vendorList = response.data;
        })
    }
	}
</script>

<style scoped>

.searchbar{
  width: 300px;
  margin: 0 auto;
}

.all-invoices{
  display: flex;
  overflow-y: scroll;
  flex-wrap: wrap;
  flex-direction: row;
  margin: 30px auto;
  justify-content: center;

}

.invoices > div {
  min-width: 300px;
  font-size: 17px;
  flex: 1;
  background: #f0f0f5;
  border-radius: 5px;
  border: 1px solid lightgrey;
  padding: 20px;
  margin: 5px;
}

.no-invoices{
  font-size: 20px;
  text-align: center;
  margin: 10px;
}

a{
  text-decoration:none;
}

</style>
