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
          style="margin-top: 10px; margin-bottom: -10px;"
          ></v-text-field>
        </div>
        <div class="all-invoices">
          <div class="invoices"
            v-for="invoice in invoiceList"
            >
            <div>
              <p><b>VENDOR: </b> {{invoice.name}}</p>
              <p><b>INVOICE NUMBER:</b> {{invoice.invoice_number}}</p>
              <p><b>AMOUNT:</b> ${{ invoice.amount | currencyFormat }}</p>
              <p><b>DUE DATE:</b> {{invoice.invoice_due_date | formatDate }}</p>
              <p><b>PAYMENT METHOD:</b> {{ invoice.payment_method}}</p>
              <div v-if="invoice.status.toLowerCase() === 'pending'">
                <p><b>APPROVAL REQUEST SENT ON:</b> {{ invoice.created_at | formatDate }}</p>
                <div style="text-align: center">
                  <p>
                    <v-icon
                      style="font-size: 20px; vertical-align: top; margin-right: 5px; color: #FF9000"
                      >fa-clock-o</v-icon>
                    Pending approval from {{invoice.first_name | proper }} {{invoice.last_name | proper }}</p>
                </div>
              </div>
              <div v-else-if="invoice.status.toLowerCase() === 'approved'">
                <p><b>APPROVED BY:</b> {{invoice.first_name | proper }} {{invoice.last_name | proper }} on {{ invoice.updated_at | formatDate }}</p>
                <div v-if="invoice.scheduled" style="text-align: center">
                  <p><v-icon
                    color="green"
                    style="font-size: 20px; vertical-align: top; margin-right: 5px;"
                    >fa-calendar-check-o</v-icon>Payment has been scheduled.</p>
                </div>
                <div v-if="!invoice.scheduled" style="text-align: center">
                  <p><v-icon
                    style="font-size: 20px; vertical-align: top; margin-right: 5px; color: #FF9000"
                    >fa-calendar-times-o</v-icon>Payment has not yet been scheduled.</p>
                </div>
              </div>
              <div v-else-if="invoice.status.toLowerCase() === 'rejected'">
                <p><b>APPROVAL REQUEST SENT ON:</b> {{ invoice.created_at | formatDate }}</p>
                <div style="text-align: center">
                  <p>
                    <v-icon
                      color="red"
                      style="font-size: 20px; vertical-align: top; margin-right: 5px;"
                      >fa-user-times</v-icon>
                    Rejected by {{invoice.first_name | proper }} {{invoice.last_name | proper }} on {{ invoice.updated_at | formatDate }} </p>
                </div>
              </div>
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
                invoice.invoice_due_date = this.toISODateFormat(invoice.invoice_due_date);
                invoice.updated_at = this.toISODateFormat(invoice.updated_at);
                invoice.created_at = this.toISODateFormat(invoice.created_at);
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
  flex-wrap: wrap;
  flex-direction: row;
  margin: 0 auto;
  justify-content: center;
  /* background: #f0f0f5; */
}

.all-invoices > div {
  min-width: 300px;
  font-size: 17px;
  flex: 1;
  border-radius: 5px;
  border: 1px solid #cbd2db;
  padding: 20px;
  margin: 5px;
  background: #FFFFFF;
  max-width: 400px;
  min-width: 400px;
}

.no-invoices{
  font-size: 20px;
  text-align: center;
  margin: 30px;
}

a{
  text-decoration:none;
}

</style>
