<template>
  <v-footer :fixed="fixed" app color="blue-grey lighten-4" style="height: 50px">
    <span>&copy; Bárbara Doring {{new Date().getFullYear()}}</span>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      fixed: true
    }
  }
}
</script>

<style scoped>
span{
  font-size: 15px;
}
</style>
