<template>
  <dashboard v-if="loggedIn"></dashboard>
  <login v-else="loggedIn"></login>
</template>

<script>
import Dashboard from './components/Dashboard.vue'
import Login from './components/Login.vue'
export default {
  name: 'App',
  components: {
    'dashboard': Dashboard,
    'login': Login
  },
  data () {
    return {
      loggedIn: false
    }
  }
}
</script>

<style>
body{
    margin: 0;
    box-sizing: border-box;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>
