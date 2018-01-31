<template>
  <div class="container">
    <h1>Edit Vendor</h1>
    <div v-if="!vendorUpdated">
      <v-card color="grey lighten-4" flat>
       <v-card-text style="border: 1px dotted grey; margin-top: 10px;">
         <v-container fluid>
           <v-layout row wrap>
             <v-flex xs12 sm6>
               <v-subheader v-text="'Please select vendor to be edited:'" style="font-size:20px; padding-left: 60px;"></v-subheader>
             </v-flex>
             <v-flex xs12 sm6>
               <v-select
                 v-bind:items="vendors"
                 v-model="vendorSelected"
                 item-text="companyName"
                 label="Select Vendor"
                 autocomplete
               ></v-select>
             </v-flex>
           </v-layout>
         </v-container>
       </v-card-text>
     </v-card>

     <v-form v-model="valid" ref="form" v-if="vendorSelected">
       <div class="approver" >
         <v-flex>
           <h2>Current Approver: {{ vendorSelected.first_name | proper }} {{ vendorSelected.last_name | proper }}
             <v-btn outline @click="changeApprover = true" ><v-icon left color="primary">person</v-icon>Change Approver</v-btn>
           </h2>
           <div class="changeApprover" v-if="changeApprover">
             <v-select
               label="New Approver"
               v-model="newApprover"
               :items="approvers"
               item-text="fullName"
               :rules="[v => !!v || 'Approver is required']"
               autocomplete
               required
             ></v-select>
             <v-btn @click="cancel">Cancel</v-btn>
           </div>
         </v-flex>
       </div>
       <v-text-field
         label="Name"
         v-model="vendorSelected.name"
         :rules="[(v) => !!v || 'Name is required']"
         required
       ></v-text-field>
       <v-text-field
         label="Street Address"
         v-model="vendorSelected.street_address"
         :rules="[(v) => !!v || 'Street Address is required']"
         required
       ></v-text-field>
       <v-text-field
         label="City"
         v-model="vendorSelected.city"
         :rules="[(v) => !!v || 'City Address is required']"
         required
       ></v-text-field>
       <v-select
         label="State"
         v-model="vendorSelected.state"
         :items="states"
         :rules="[v => !!v || 'State is required']"
         required
       ></v-select>
       <v-text-field
         label="Zipcode"
         v-model="vendorSelected.zipcode"
         :rules="[(v) => !!v || 'Zipcode is required']"
         required
       ></v-text-field>
       <v-text-field
         label="Phone Number"
         v-model="vendorSelected.phone_number"
         :rules="[(v) => !!v || 'Phone Number is required']"
         required
       ></v-text-field>
       <v-text-field
         label="E-mail"
         v-model="vendorSelected.email"
         :rules="emailRules"
         required
       ></v-text-field>
       <v-text-field
         label="TIN"
         v-model="vendorSelected.tin"
         :rules="[v => !!v || 'TIN is required']"
         required
       ></v-text-field>
       <v-select
         label="TIN Type"
         v-model="vendorSelected.tin_type"
         :items="types"
         :rules="[v => !!v || 'TIN Type is required']"
         required
       ></v-select>
       <v-text-field
         label="NET Terms"
         v-model="vendorSelected.net_terms"
         :rules="[v => !!v || 'NET Terms value is required']"
         placeholder="ex: 15"
         required
       ></v-text-field>
       <v-select
         label="Payment Method"
         v-model="vendorSelected.payment_method"
         :items="paymentOptions"
         :rules="[v => !!v || 'Payment method is required']"
         required
       ></v-select>
       <v-text-field
         label="GL Code"
         v-model="vendorSelected.gl_code"
         :rules="[v => !!v || 'GL code is required']"
         required
       ></v-text-field>
       <v-btn
         @click="submit"
         :disabled="!valid"
         color="primary">
         submit
       </v-btn>
       <v-btn @click="vendorSelected=null">cancel</v-btn>
     </v-form>
    </div>
   <div v-if="vendorUpdated">
     <h3>Vendor was updated successfully!</h3>
     <v-btn @click="vendorUpdated = false">Go Back</v-btn>
   </div>
 </div>
</template>

<script>

	export default {
		data() {
			return {
        vendorUpdated: false,
        changeApprover: false,
        listOfApprovers: [],
        newApprover: {},
        valid: false,
        vendorSelected: null,
        vendors: [],
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
          "ACH", "CREDIT CARD", "CHECK"
        ],
        stateRules: [
          (v) => !!v || 'State is required',
          (v) => (v && ((v.length <= 2) && (v.length > 1))) || 'State abbreviation must be 2 characters'
        ],
        emailRules: [
          (v) => !!v || 'E-mail is required',
          (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        ],
			}
		},
    methods: {
      submit() {
        console.log('this.vendorSelected:', this.vendorSelected.id);
        if (this.changeApprover) {
          this.vendorSelected.user_id = this.newApprover.id;
          this.vendorSelected.approverChanged = true;
        }
        this.axios.patch(`/vendors/${this.vendorSelected.id}`, this.vendorSelected)
          .then(response => {
            console.log('response from edit vendor:', response.data);
            this.$refs.form.reset();
            this.vendorUpdated = true;
            this.vendorSelected = false;
            this.axios.get('/vendors')
              .then(response => {
                console.log('Your vendors are:', response.data);
                this.vendors = response.data.map(vendor => {
                  vendor.companyName = vendor.name;
                  return vendor;
                });
              });
            this.axios.get('/users')
              .then(response => {
                this.listOfApprovers = response.data.filter(user => {
                  if (user.role.toLowerCase() === 'approver') {
                    user.fullName = `${user.first_name[0] + user.first_name.slice(1).toLowerCase()} ${user.last_name[0] + user.last_name.slice(1).toLowerCase()}`;
                    return user;
                  }
                })
              })
            // DELETE IN CASE OF ERRORS
          })
      },
      cancel(){
        this.changeApprover = false;
        this.newApprover = null;
      }
    },
    computed:{
      approvers() {
        return this.listOfApprovers.filter(approver => approver.id != this.vendorSelected.user_id)
      }
    },
    created() {
      this.axios.get('/vendors')
        .then(response => {
          console.log('Your vendors are:', response.data);
          this.vendors = response.data.map(vendor => {
            vendor.companyName = vendor.name;
            return vendor;
          });
        });
      this.axios.get('/users')
        .then(response => {
          this.listOfApprovers = response.data.filter(user => {
            if (user.role.toLowerCase() === 'approver') {
              user.fullName = `${user.first_name[0] + user.first_name.slice(1).toLowerCase()} ${user.last_name[0] + user.last_name.slice(1).toLowerCase()}`;
              return user;
            }
          })
        })
    }
	}
</script>

<style scoped>
.approver{
  margin: 10px 0;
}

.changeApprover{
  width: 350px;
  margin: 5px 0 30px 10px;
  padding: 10px;
  border: 1px solid lightgrey;
  border-radius: 5px;
}
</style>
