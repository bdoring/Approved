<template>
    <div class="container">
      <h1>Upload New Vendor Invoice</h1>
      <!-- UPLOAD -->
      <v-alert
        color="error"
        icon="warning"
        transition="scale-transition"
        v-model="uploadError"
        outline
        type="warning"
      >
        {{ errorMessage }}
      </v-alert>
      <div style="margin: 10px auto;">
        <v-form v-model="valid" ref="form" enctype="multipart/form-data" v-if="isInitial || isSaving || isFailed">
          <div class="form-container">
            <div class="">
              <v-layout row wrap>
                <v-flex xs11>
                  <p v-if="selectedVendor" style="margin: 20px 0; font-size: 20px;">
                    <v-icon
                      color="primary"
                      style="vertical-align: top; margin-right: 5px;"
                    >fa-user</v-icon>
                    Approval Required from: <b>{{ selectedVendor.first_name | proper }} {{ selectedVendor.last_name | proper }}</b> </p>
                  <v-select
                    label="Vendor"
                    v-model="selectedVendor"
                    :items="vendors"
                    item-text="name"
                    :rules="[(v) => !!v || 'Vendor is required']"
                    required
                  ></v-select>

                    <v-text-field
                      label="Invoice Number"
                      v-model="invoiceNumber"
                      :rules="[(v) => !!v || 'Invoice Number is required']"
                      required
                    ></v-text-field>
                  <v-text-field
                    label="Amount"
                    v-model="amount"
                    placeholder="$0.00"
                    :rules="[(v) => !!v || 'Amount is required']"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <!-- Invoice Date -->
              <v-layout row wrap>
                <v-flex xs11 style="margin-right: 20px;">
                  <v-menu
                    lazy
                    :close-on-content-click="true"
                    transition="scale-transition"
                    offset-y
                    full-width
                    :nudge-right="40"
                    max-width="290px"
                    min-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      label="Invoice Date"
                      v-model="formattedDate"
                      prepend-icon="event"
                      :rules="[(v) => !!v || 'Invoice Date is required']"
                      required
                    ></v-text-field>
                    <v-date-picker v-model="invoiceDate" @input="formattedDate = formatDate($event)" no-title scrollable actions>
                    </v-date-picker>
                  </v-menu>
                </v-flex>

                <!-- Invoice Due Date -->
                <v-flex xs11>
                  <v-menu
                    lazy
                    :close-on-content-click="true"
                    transition="scale-transition"
                    offset-y
                    full-width
                    :nudge-right="40"
                    max-width="290px"
                    min-width="290px"
                    required
                  >
                    <v-text-field
                      slot="activator"
                      label="Invoice Due Date"
                      v-model="formattedDueDate"
                      prepend-icon="event"
                      :rules="[(v) => !!v || 'Invoice Due Date is required']"
                      required
                    ></v-text-field>
                    <v-date-picker v-model="invoiceDueDate" @input="formattedDueDate = formatDate($event)" no-title scrollable actions>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <div style="margin: -20px 0 0 40px">
                  <p
                    v-if="selectedVendor"
                    id="net-terms"
                    style="display:table-cell">
                    Net Terms: {{ selectedVendor.net_terms}}
                  </p>
                </div>
              </v-layout>
            </div>

            <div class="dropbox">
                <input
                  name="upload"
                  type="file"
                  v-bind:disabled="isSaving"
                  v-on:change="uploadInvoice($event.target.files[0])"
                  accept=".jpg, .jpeg, .png, .pdf"
                  class="input-file"
                >
                <p v-if="!uploadedInvoice">
                  Drag the vendor invoice here <br/> or click to browse
                </p>
                <p v-if="uploadedInvoice" style="font-size: 20px;">
                  <v-icon
                  style="font-size: 50px;"
                  color="red"
                  >fa-file-pdf-o</v-icon>
                  <br>
                  {{ invoicePDF.name }}
                </p>
              </input>
            </div>
          </div>
          <div style="margin-top: 10px;">
            <v-btn
              color="primary"
              @click="submit"
              :disabled="!uploadedInvoice"
            >
              submit
            </v-btn>
            <v-btn @click="clear">clear</v-btn>
          </div>
        </v-form>
      </div>
      <p v-if="isSaving">
        Uploading Invoice...
      </p>
      <div v-if="isSuccess">
        <p style="font-size: 20px;">
          File Successfully Uploaded!
        </p>
        <v-btn
        color="primary"
        @click="goBack">Go Back</v-btn>
      </div>
    </div>
</template>

<script>
  const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3;

  export default {
    name: 'UploadNewInvoice',
    data () {
      return {
        show: false,
        uploadError: false,
        errorMessage: "",
        currentStatus: STATUS_INITIAL,
        valid: false,
        selectedVendor: null,
        vendors: [],
        invoiceNumber: '',
        amount: '',
        formattedDate: null,
        formattedDueDate: null,
        invoiceDate: null,
        invoiceDueDate: null,
        menu: false,
        invoiceUploaded: false,
        invoicePDF: null
      }
    },
    computed: {
      isInitial(){
        return this.currentStatus === STATUS_INITIAL;
      },
      isSaving() {
        return this.currentStatus === STATUS_SAVING;
      },
      isSuccess() {
        return this.currentStatus === STATUS_SUCCESS;
      },
      isFailed() {
        return this.currentStatus === STATUS_FAILED;
      },
      uploadedInvoice(){
        return this.invoiceUploaded;
      },
    },
    methods: {
      clear() {
        this.currentStatus = STATUS_INITIAL;
        // if (this.$refs.form) {
        //   this.$refs.form.reset();
        //   console.log('resetting...', this.selectedVendor)
        // }
        this.$refs.form.reset();
          this.show = false;
          this.uploadError = false;
          this.errorMessage = "",
          this.currentStatus = STATUS_INITIAL;
          this.valid = false;
          this.selectedVendor = null;
          this.invoiceNumber = '';
          this.amount = '';
          this.formattedDate = null;
          this.formattedDueDate = null;
          this.invoiceDate = null;
          this.invoiceDueDate = null;
          this.menu = false;
          this.invoiceUploaded = false;
          this.invoicePDF = null;
      },
      goBack(){
        this.currentStatus = STATUS_INITIAL;
      },
      uploadInvoice(filePath) {
        console.log('uploaded!');
        this.invoiceUploaded = true;
        this.invoicePDF = filePath;
      },
      formatDate (date) {
        console.log("Invoice Date", this.invoiceDate)
        if (this.invoiceDate && this.selectedVendor && !this.formattedDueDate) {
          console.log('here')
          let date = new Date(this.invoiceDate);
          this.invoiceDueDate = new Date(date.setDate(date.getDate() + Number(this.selectedVendor.net_terms))).toISOString().slice(0,10);
          let [year, month, day] = this.invoiceDueDate.split('-');
          this.formattedDueDate = `${month.padStart(2, '0')}-${day.padStart(2, '0')}-${year}`;
        }
        const [year, month, day] = date.split('-')
        return `${month.padStart(2, '0')}-${day.padStart(2, '0')}-${year}`
      },
      submit() {
        this.currentStatus = STATUS_SAVING;

        let formData = new FormData();
        formData.append('vendor_id', this.selectedVendor.id);
        formData.append('invoice_number', this.invoiceNumber);
        formData.append('amount', this.amount);
        formData.append('invoice_date', this.invoiceDate);
        formData.append('invoice_due_date', this.invoiceDueDate);
        formData.append('invoicePDF', this.invoicePDF);
        formData.append('action_user', this.selectedVendor.user_id);
        this.axios.post('/invoices', formData)
          .then(response => {
            console.log('File upload response:', response);
            this.currentStatus = STATUS_SUCCESS;
            this.uploadError = false;
            this.error = "";
            this.$refs.form.reset();
            this.invoicePDF = null;
            this.invoiceUploaded = false;
          })
          .catch(err => {
            console.log('File upload catch/err:', err.response);
            this.currentStatus = STATUS_FAILED;
            this.uploadError = true;
            this.errorMessage = err.response.data.error;
            this.invoiceNumber = "";
          })
      }
    },
    created() {
      this.axios.get('/vendors')
        .then(response => {
          console.log('Vendors response:', response);
          this.vendors = response.data.map(vendor => vendor);
          console.log(this.vendors);
        })
        .catch(err => {
          console.log('Retrieving vendors err:', err);
        })
    }
  }
</script>

<style scoped>

.form-container{
  display: flex;
}

.form-container > div {
  flex: 1;
}

.dropbox {
    border: 1px dotted grey;
    color: dimgray;
    padding: 120px 0;
    min-height: 200px;
    position: relative;
    cursor: pointer;
    border-radius: 5px;
  }

  .input-file {
    opacity: 0;
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }

  .dropbox:hover {
    background: #f0f0f5;
  }

  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }

  p{
    font-size: 17px;

  }

  b{
    font-weight: 700;
  }

  #net-terms{
    margin: 20px;
  }

</style>
