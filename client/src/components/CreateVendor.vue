<template>
  <div class="container">
    <h1>Create New Vendor</h1>
    <v-form v-model="valid" ref="form" v-if="!vendorCreated">
      <div class="approver" >
        <v-flex>
          <p>Please select the approver for this vendor's invoices:
          </p>
        </v-flex>
          <v-flex sm10>
            <v-select
              label="Approver"
              v-model="vendorForm.user"
              :items="approvers"
              item-text="fullName"
              :rules="[v => !!v || 'Approver is required']"
              required
            ></v-select>
          </v-flex>
      </div>
      <v-text-field
        label="Name"
        v-model="vendorForm.name"
        :rules="[(v) => !!v || 'Name is required']"
        required
      ></v-text-field>
      <v-text-field
        label="Street Address"
        v-model="vendorForm.street_address"
        :rules="[(v) => !!v || 'Street Address is required']"
        required
      ></v-text-field>
      <v-text-field
        label="City"
        v-model="vendorForm.city"
        :rules="[(v) => !!v || 'City Address is required']"
        required
      ></v-text-field>
      <v-select
        label="State"
        v-model="vendorForm.state"
        :items="states"
        :rules="[v => !!v || 'State is required']"
        required
      ></v-select>
      <v-text-field
        label="Zipcode"
        v-model="vendorForm.zipcode"
        :rules="[(v) => !!v || 'Zipcode is required']"
        required
      ></v-text-field>
      <v-text-field
        label="Phone Number"
        v-model="vendorForm.phone_number"
        :rules="[(v) => !!v || 'Phone Number is required']"
        required
      ></v-text-field>
      <v-text-field
        label="E-mail"
        v-model="vendorForm.email"
        :rules="emailRules"
        required
      ></v-text-field>
      <v-text-field
        label="Tin"
        v-model="vendorForm.tin"
        :rules="[v => !!v || 'TIN Type is required']"
        required
      ></v-text-field>
      <v-select
        label="TIN Type"
        v-model="vendorForm.tin_type"
        :items="types"
        :rules="[v => !!v || 'TIN Type is required']"
        required
      ></v-select>
      <v-text-field
        label="NET Terms"
        v-model="vendorForm.net_terms"
        :rules="[v => !!v || 'NET Terms value is required']"
        placeholder="ex: 15"
        required
      ></v-text-field>
      <v-select
        label="Payment Method"
        v-model="vendorForm.payment_method"
        :items="paymentOptions"
        :rules="[v => !!v || 'Payment method is required']"
        required
      ></v-select>
      <v-text-field
        label="GL Code"
        v-model="vendorForm.gl_code"
        :rules="[v => !!v || 'GL code is required']"
        required
      ></v-text-field>
      <v-btn
        @click="submit"
        :disabled="!valid" >
        submit
      </v-btn>
      <v-btn @click="clear">clear</v-btn>
    </v-form>
    <div v-if="vendorCreated">
      <p>Vendor was created successfully!</p>
      <v-btn
      color="primary"
      @click="vendorCreated=false">Go Back</v-btn>
    </div>
  </div>
</template>

<script>
	export default {
		data() {
			return {
        valid: false,
        vendorCreated: false,
        vendorForm: {
          user: {},
          name: '',
          street_address: '',
          city: '',
          state: '',
          zipcode: '',
          phone_number: '',
          email: '',
          tin: '',
          tin_type: '',
          net_terms: '',
          payment_method: '',
          gl_code: ''
        },
        approvers: [],
        stateRules: [
          (v) => !!v || 'State is required',
          (v) => (v && ((v.length <= 2) && (v.length > 1))) || 'State abbreviation must be 2 characters'
        ],
        emailRules: [
          (v) => !!v || 'E-mail is required',
          (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        ],
        states: [
          "AK",
          "AL",
          "AR",
          "AS",
          "AZ",
          "CA",
          "CO",
          "CT",
          "DC",
          "DE",
          "FL",
          "GA",
          "GU",
          "HI",
          "IA",
          "ID",
          "IL",
          "IN",
          "KS",
          "KY",
          "LA",
          "MA",
          "MD",
          "ME",
          "MI",
          "MN",
          "MO",
          "MS",
          "MT",
          "NC",
          "ND",
          "NE",
          "NH",
          "NJ",
          "NM",
          "NV",
          "NY",
          "OH",
          "OK",
          "OR",
          "PA",
          "PR",
          "RI",
          "SC",
          "SD",
          "TN",
          "TX",
          "UT",
          "VA",
          "VI",
          "VT",
          "WA",
          "WI",
          "WV",
          "WY"
        ],
        types: ["SSN", "EIN"],
        paymentOptions: [
          "ACH", "Credit Card", "Check"
        ]
			}
		},
    methods: {
      clear(){
        this.$refs.form.reset();
      },
      submit() {
        this.axios.post('/vendors', this.vendorForm)
          .then(response => {
            console.log("vendor creation response:", response);
            this.$refs.form.reset();
            this.vendorCreated = true;
          })
          .catch(err => {
            console.log("vendor creation error:", err.response);
          })
      }
    },
    created() {
      this.axios.get('/users')
        .then(response => {
          console.log('users retrieved:', response.data);
          this.approvers = response.data.filter(user => {
            if (user.type.toLowerCase() === "approver") {
              user.fullName = `${user.first_name[0] + user.first_name.slice(1).toLowerCase()} ${user.last_name[0] + user.last_name.slice(1).toLowerCase()}`;
              return user;
            }
          });
          console.log("Your approvers are:", this.approvers);
        })
    }
	}
</script>

<style scoped>

.approver{
  margin: 20px 10px;
  border: 1px dotted grey;
  border-radius: 5px;
  width: 600px;
  padding: 20px 20px 0 20px;
}

p {
  margin-bottom: 20px;
  font-size: 20px;
}



</style>
