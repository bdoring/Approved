<template>
  <div class="container">
    <h1>Create User</h1>
    <v-form v-if="!userCreated" v-model="valid" ref="form">
    <v-text-field
      label="First Name"
      v-model="user.first_name"
      :rules="[v => !!v || 'First Name is required']"
      required
    ></v-text-field>
    <v-text-field
      label="Last Name"
      v-model="user.last_name"
      :rules="[v => !!v || 'Last Name is required']"
      required
    ></v-text-field>
    <v-text-field
      label="E-mail"
      v-model="user.email"
      :rules="emailRules"
      required
    ></v-text-field>
    <v-text-field
      label="Password"
      type="password"
      v-model="user.password"
      :rules="[v => !!v || 'Password is required']"
      required
    ></v-text-field>
    <v-text-field
      label="Re-type Password "
      type="password"
      v-model="user.retyped_password"
      :rules="passwordRules"
      required
    ></v-text-field>
    <v-select
      label="User Role"
      v-model="user.role"
      :items="userRoles"
      :rules="[v => !!v || 'Item is required']"
      required
    ></v-select>

    <v-btn
      @click="submit"
      :disabled="!valid"
    >
      submit
    </v-btn>
    <v-btn @click="clear">clear</v-btn>
  </v-form>
  <div v-if="userCreated">
    <h3>User was created successfully!</h3>
    <v-btn
    color="primary"
    @click="userCreated=false">Go Back</v-btn>
  </div>
  </div>
</template>

<script>
	export default {
		data() {
			return {
        userCreated: false,
        valid: false,
        user: {
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          retypedPassword: '',
          role: ''
        },
        emailRules: [
          (v) => !!v || 'E-mail is required',
          (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
        ],
        passwordRules: [
          (v) => v && v == this.user.password || 'Passwords do not match.'
        ],
        userRoles: [
          "Admin", "Approver"
        ]
			}
		},
    methods: {
      clear() {
        this.$refs.form.reset();
      },
      submit() {
        this.axios.post('/users', this.user)
          .then(response => {
            this.$refs.form.reset();
            this.userCreated = true;
            console.log('creating users reponse:', response.data);
          })
      }
    }
	}
</script>

<style scoped>

</style>
