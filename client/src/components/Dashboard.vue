<template>
  <v-app>
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
      style="margin-top: 65px;"
    >
      <v-list style="padding: 0;">
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
          @click=""
          v-bind:to="item.action"
          exact
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      :clipped-left="clipped"
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'Dashboard',
  data () {
    return {
      clipped: true,
      drawer: true,
      fixed: true,
      items: [{
        icon: 'bubble_chart',
        title: 'Home',
        action: '/helloworld'
      }, {
        icon: 'bubble_chart',
        title: 'About',
        action: 'about'
      }],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'My Amazing App'
    }
  }
}
</script>
