<template>
  <v-app>
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      enable-resize-watcher
      absolute
      app
      style="margin-top: 65px;"
    >
      <v-list style="padding: 0;">
        <template v-for="(item, i) in items"
          >
          <v-list-tile
            v-if="item.action"
            value="true"
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
          <v-divider v-else-if="item.divider"></v-divider>
          <v-subheader v-else-if="item.header" v-text="item.header" ></v-subheader>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      :clipped-left="clipped"
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title id="approved" v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat @click="userLogout">
        <span>Logout</span>
        <v-icon style="margin-left: 10px">input</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <transition name="slide-fade">
          <router-view/>
      </transition>
    </v-content>
    <app-footer></app-footer>
  </v-app>
</template>

<script>
import Footer from './Footer.vue'
export default {
  name: 'Dashboard',
  components: {
    'app-footer': Footer
  },
  data () {
    return {
      clipped: true,
      drawer: true,
      items: [
        {
          icon: 'home',
          title: 'Home',
          action: '/'
        },
        {
          icon: 'attach_file',
          title: 'Upload New Invoice',
          action: '/new-invoice'
        },
        {
          divider: true
        },
        {
          header: 'Maintain Vendors'
        },
        {
          icon: 'group_add',
          title: 'Create Vendor',
          action: '/create-vendor'
        },
        {
          icon: 'group',
          title: 'Edit Vendor',
          action: '/edit-vendor'
        },
        {
          divider: true
        },
        {
          header: 'Maintain Users'
        },
        {
          icon: 'person_add',
          title: 'Create User',
          action: '/create-user'
        },
        {
          icon: 'person',
          title: 'Edit User',
          action: '/edit-user'
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Approved'
    }
  },
  methods: {
    userLogout () {
      this.$auth.logout({
        makeRequest: true,
        data: {},
        success(response) {
          console.log('Logout response:', response);
          localStorage.clear();
        },
        error(err) {
          this.errMsg = true
          console.log(err);
        }
      })
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Poiret+One:400');
#approved{
  font-family: 'Poiret One';
  font-size: 28px;
}

/* TRANSITIONS */
.slide-fade-enter-active {
  transition: all .5s ease;
}
.slide-fade-leave {
  visibility: hidden;
}
.slide-fade-enter
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(15px);
  opacity: 0;
}
</style>
