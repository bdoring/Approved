<template>
  <div class="container">
    <h1>Edit Your Account</h1>
    <v-form v-if="!wasUserEdited" v-model="valid" ref="form">
      <v-text-field
        label="First Name"
        v-model="userEdited.first_name"
        :rules="[v => !!v || 'First Name is required']"
        required
      ></v-text-field>
      <v-text-field
        label="Last Name"
        v-model="userEdited.last_name"
        :rules="[v => !!v || 'Last Name is required']"
        required
      ></v-text-field>
      <v-text-field
        label="E-mail"
        v-model="userEdited.email"
        :rules="emailRules"
        required
      ></v-text-field>
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
              v-model="userEdited.password"
              type="password"
              required
            ></v-text-field>
            <v-text-field
              label="Re-type New Password"
              v-model="retypedNewPassword"
              type="password"
              :rules="passwordRules"
              required
            ></v-text-field>
            <v-btn @click="cancelNewPassword">cancel</v-btn>
          </v-form>
        </div>
      </div>
      <div style="margin-top: 10px">
        <v-btn
          @click="submit"
          :disabled="!valid"
          color="primary"
        >
          submit
        </v-btn>
      </div>
    </v-form>
    <div v-if="wasUserEdited">
      <h3>Your account was updated successfully!</h3>
      <v-btn @click="wasUserEdited = false">Go Back</v-btn>
    </div>
  </div>
</template>

<script>
	export default {
		data() {
			return {
        user: JSON.parse(localStorage.getItem('user')),
        updatePassword: false,
        valid: false,
        userEdited: {},
        wasUserEdited: false,
        emailRules: [
          (v) => !!v || 'E-mail is required',
          (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        ],
        retypedNewPassword: null,
        passwordRules: [
          (v) => v && v == this.userEdited.password || 'Passwords do not match.'
        ],
        userRoles: [
          "Admin", "Approver"
        ],
			}
		},
    methods: {
      cancelNewPassword(){
        this.$refs.newPassword.reset();
        this.updatePassword = false;
      },
      submit(){
        this.axios.patch(`/users/${this.user.id}`, this.userEdited)
          .then(response => {
            console.log('response from edit user:', response.data)
            this.wasUserEdited = true;
            this.axios.get(`/users/${this.user.id}`)
              .then(response => {
                this.userEdited = response.data[0];
                this.userEdited.first_name = this.$options.filters.proper(this.userEdited.first_name);
                this.userEdited.last_name = this.$options.filters.proper(this.userEdited.last_name);
                this.userEdited.email = this.userEdited.email.toLowerCase();
                this.userEdited.password = null;
                console.log('this userEdited:', this.userEdited)
              })
          })

      }
    },
    created(){
      this.axios.get(`/users/${this.user.id}`)
        .then(response => {
          this.userEdited = response.data[0];
          this.userEdited.first_name = this.$options.filters.proper(this.userEdited.first_name);
          this.userEdited.last_name = this.$options.filters.proper(this.userEdited.last_name);
          this.userEdited.email = this.userEdited.email.toLowerCase();
          this.userEdited.password = null;
          console.log('this userEdited:', this.userEdited)
        })
    }
	}
</script>

<style scoped>
.update-password > div {
  padding: 10px;
  border: 1px dotted grey;
  border-radius: 5px;
  width: 400px;
  margin-left: 7px;
}
</style>
