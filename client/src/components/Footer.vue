<template>
  <v-footer :fixed="fixed" app color="blue-grey lighten-4" style="position: absolute; z-index:10; height: 50px;">
    <span>&copy; Bárbara Doring - {{new Date().getFullYear()}}</span>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      fixed: true,
      absolute: false
    }
  }
}
</script>

<style scoped>
span{
  font-size: 17px;
  font-weight: bold;
  position: absolute;
  left: 0;
}
</style>
