<template>
  <v-app>
    <div class="login">
      <h1 id="logo">Approved</h1>
      <div class="login-form elevation-24">
        <v-form v-model="valid" ref="form" lazy-validation>
          <v-text-field
            label="Email"
            v-model="name"
            :rules="nameRules"
            required
          ></v-text-field>
          <v-text-field
            label="Password"
            v-model="email"
            :rules="emailRules"
            type="password"
            required
          ></v-text-field>

          <v-btn
            @click="submit"
            :disabled="!valid"
          >
            login
          </v-btn>
        </v-form>
      </div>
    </div>
  </v-app>
</template>

<script>
export default {
    data:() => ({
      valid: true,
      name: '',
      nameRules: [
        (v) => !!v || 'Email is required',
        (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Email must be valid'
      ],
      email: '',
      emailRules: [
        (v) => !!v || 'Password is required'
      ],
      select: null,
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4'
      ],
      checkbox: false
    }),
    methods: {
      submit () {
        if (this.$refs.form.validate()) {
          // Native form submission is not yet supported
          axios.post('/api/submit', {
            name: this.name,
            email: this.email,
            select: this.select,
            checkbox: this.checkbox
          })
        }
      },
      clear () {
        this.$refs.form.reset()
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
</style>
