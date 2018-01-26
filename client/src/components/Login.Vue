<template>
  <v-app>
    <div class="login">
      <h1 id="logo">Approved</h1>
      <div class="login-form elevation-24">
        <v-form v-model="valid" ref="form">
          <v-text-field
            label="Email"
            v-model="email"
            :rules="emailRules"
            required
          ></v-text-field>
          <v-text-field
            label="Password"
            v-model="password"
            :rules="passwordRules"
            type="password"
            required
          ></v-text-field>

          <v-btn
            @click="userLogin"
            :disabled="!valid"
          >
            login
          </v-btn>
        </v-form>
      </div>
    </div>
    <div class="error-box">
      <v-alert
        color="error"
        icon="warning"
        transition="scale-transition"
        v-model="alert"
        outline
        type="warning"
      >
        Invalid credentials. Please try again.
      </v-alert>
    </div>
    <app-footer></app-footer>
  </v-app>
</template>

<script>
import Footer from './Footer.vue'

export default {
    components: {
      'app-footer': Footer
    },
    data:() => ({
      alert: false,
      valid: false,
      email: null,
      emailRules: [
        (v) => !!v || 'Email is required',
        (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Email must be valid'
      ],
      password: null,
      passwordRules: [
        (v) => !!v || 'Password is required'
      ]
    }),
    methods: {
      clear () {
        this.$refs.form.reset()
      },
      userLogin () {
        this.$auth.login({
          data: {
            email: this.email,
            password: this.password
          },
          success(response) {
            console.log('response', response);
            this.$auth.token(null, response.data.token)
            this.$auth.user(response.data.user[0])
            let user = {
              first_name: response.data.user[0].first_name,
              role: response.data.user[0].role,

            }
            localStorage.setItem('user', JSON.stringify(user));
          },
          error(err) {
            this.errMsg = true
            this.alert = true
          }
        })
      }
    }
  }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Poiret+One:400');
  .login-form{
    padding: 30px;
    width: 600px;
    margin: 0 auto;
    text-align: center;
    border: 1px solid grey;
    border-radius: 3px;
  }
  #logo{
    font-family: 'Poiret One';
    font-weight: normal;
    font-size: 100px;
    text-align: center;
    color: #2c3e50;
    margin: 30px;
  }
  .error-box{
    margin: 20px auto;
    width: 300px;
  }

</style>
