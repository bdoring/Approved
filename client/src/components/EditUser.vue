<template>
  <div class="container">
      <h1>Edit User</h1>
      <div v-if="!userUpdated">
        <v-card color="grey lighten-4" flat style="margin-bottom: 20px;">
         <v-card-text style="border: 1px dotted grey; margin-top: 10px;">
           <v-container fluid>
             <v-layout row wrap>
               <v-flex xs12 sm6>
                 <v-subheader v-text="'Please select user to be edited:'" style="font-size:20px; padding-left: 60px;"></v-subheader>
               </v-flex>
               <v-flex xs12 sm6>
                 <v-select
                   v-bind:items="users"
                   v-model="userSelected"
                   item-text="fullName"
                   label="Select User"
                   autocomplete
                 ></v-select>
               </v-flex>
             </v-layout>
           </v-container>
         </v-card-text>
       </v-card>

       <v-form v-if="userSelected" v-model="valid" ref="form">
         <v-text-field
           label="First Name"
           v-model="userSelected.first_name"
           :rules="[v => !!v || 'First Name is required']"
           required
         ></v-text-field>
         <v-text-field
           label="Last Name"
           v-model="userSelected.last_name"
           :rules="[v => !!v || 'Last Name is required']"
           required
         ></v-text-field>
         <v-text-field
           label="E-mail"
           v-model="userSelected.email"
           :rules="emailRules"
           required
         ></v-text-field>
         <v-select
           label="User Role"
           v-model="userSelected.role"
           :items="userRoles"
           :rules="[v => !!v || 'Role is required']"
           required
         ></v-select>
         <div class="update-password">
           <v-btn
           outline
           @click="updatePassword = true"
           >
           <v-icon left style="color: #FF9000">fa-lock</v-icon>
           Update Password?</v-btn>
           <div v-if="updatePassword">
             <v-form ref="newPassword">
               <v-text-field
                 label="New Password"
                 v-model="userSelected.password"
                 required
               ></v-text-field>
               <v-text-field
                 label="Re-type New Password"
                 v-model="retypedNewPassword"
                 :rules="passwordRules"
                 required
               ></v-text-field>
               <v-btn @click="cancelNewPassword">cancel</v-btn>
             </v-form>
           </div>
         </div>
         <v-btn
           @click="submit"
           :disabled="!valid"
           color="primary"
         >
           submit
         </v-btn>
         <v-btn @click="userSelected=null">cancel</v-btn>
       </v-form>
      </div>
     <div v-if="userUpdated">
       <h3>User was updated successfully!</h3>
       <v-btn @click="userUpdated = false">Go back</v-btn>
     </div>
  </div>
</template>

<script>
	export default {
		data() {
			return {
        valid: false,
        users: [],
        userSelected: null,
        userUpdated: false,
        updatePassword: false,
        userRoles: [
          "Admin", "Approver"
        ],
        emailRules: [
          (v) => !!v || 'E-mail is required',
          (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        ],
        retypedNewPassword: null,
        passwordRules: [
          (v) => v && v == this.userSelected.password || 'Passwords do not match.'
        ],
			}
		},
    methods: {
      cancelNewPassword(){
        this.$refs.newPassword.reset();
        this.updatePassword = false;
      },
      submit(){
        this.axios.patch(`/users/${this.userSelected.id}`, this.userSelected)
          .then(response => {
            console.log('response from edit users', response.data);
            this.$refs.form.reset();
            this.userUpdated = true;
            this.userSelected = false;
            this.axios.get('/users')
              .then(response => {
                this.users = response.data.map(user => {
                  user.role = `${user.role[0] + user.role.slice(1).toLocaleLowerCase()}`
                  user.fullName = `${user.first_name[0] + user.first_name.slice(1).toLowerCase()} ${user.last_name[0] + user.last_name.slice(1).toLowerCase()}`;
                  user.password = null;
                  this.$options.filters.proper(user.first_name);
                  user.last_name = this.$options.filters.proper(user.last_name);
                  user.email = user.email.toLowerCase();
                  return user;
                })
                console.log("this.users:", this.users)
              })
          })
      }
    },
    created(){
      this.axios.get('/users')
        .then(response => {
          this.users = response.data.map(user => {
            user.role = `${user.role[0] + user.role.slice(1).toLocaleLowerCase()}`
            user.fullName = `${user.first_name[0] + user.first_name.slice(1).toLowerCase()} ${user.last_name[0] + user.last_name.slice(1).toLowerCase()}`;
            user.password = null;
            user.first_name = this.$options.filters.proper(user.first_name);
            user.last_name = this.$options.filters.proper(user.last_name);
            user.email = user.email.toLowerCase();
            return user;
          })
          console.log("this.users:", this.users)
        })
    }
	}
</script>

<style scoped>
.update-password{
  margin-bottom: 10px;
}
.update-password > div {
  padding: 10px;
  border: 1px dotted grey;
  border-radius: 5px;
  width: 400px;
  margin-left: 7px;
}
</style>
