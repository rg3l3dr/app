<template lang="html">
  <div class="ui large secondary text menu" style='margin-bottom: 0px'>
    <router-link v-if='session.active' class='item' to='/home' style="font-family:Exo, sans-serif;font-size: 26px; padding: 5px 3rem 5px 10px">
      <i class="fa fa-cogs" style='font-size:26px; color:#555'></i>
      &nbsp
      <span style='color:red'>Omni</span><span style='color:blue'>Builds</span>
    </router-link>
    <router-link  v-else class='item' to='/' style="font-family:Exo, sans-serif;font-size: 26px; padding: 5px 3rem 5px 10px">
      <i class="fa fa-cogs" style='font-size:26px; color:#555'></i>
      &nbsp
      <span style='color:red'>Omni</span><span style='color:blue'>Builds</span>
    </router-link>
    <!-- <a href="#" class="item">Features</a>
    <a href="#" class="item">Mission</a>
    <a href="#" class="item">Pricing</a> -->
    <div class="right menu">
      <div class="item" style='padding-right: 5rem'>
        <div class="ui action left icon input small">
          <i class="search icon"></i>
          <input type="text" placeholder="Search projects..." size='35'>
          <button class="ui button small">Submit</button>
        </div>
      </div>
      <router-link class='item' id='nav-inbox' to='/notify/unread' v-if='session.active===true'>
        <span v-if='unread_count > 0' class="fa-stack fa-lg has-badge" :data-count='unread_count'>
          <i class="fa fa-circle fa-stack-2x"></i>
          <i class="fa fa-bell fa-stack-1x fa-inverse"></i>
        </span>
        <span v-else class="fa-stack fa-lg has-badge">
          <i class="fa fa-circle fa-stack-2x"></i>
          <i class="fa fa-bell fa-stack-1x fa-inverse"></i>
        </span>
      </router-link>
      <div class="ui top right pointing dropdown" id='nav-profile' v-if='session.active===true'>
        <span v-if='profile.picture'>
          <img :src='profile.picture' style='height:25px'>
        </span>
        <span v-else>
          <i class='fa fa-user fa-2x'></i>
        </span>
        <i class="dropdown icon"></i>
        <div class="menu">
          <router-link class='item' to='/home'><i class='fa fa-home fa-fw'></i>&nbsp {{session.username}}</router-link>
          <router-link class='item' to='#'><i class='fa fa-folder-o fa-fw'></i>&nbsp Create Project</router-link>
          <router-link class='item' to='#'><i class='fa fa-users fa-fw'></i>&nbsp Create Team</router-link>
          <router-link class='item' to='/profile/public'><i class='fa fa-gear fa-fw'></i>&nbsp My Account</router-link>
          <div class="divider"></div>
          <a class='item' href='http://www.omnibuilds.com' @click='logout'><i class='fa fa-home fa-fw'></i>&nbsp Log Out</a></li>
        </div>
      </div>
      <router-link to="/accounts/login" class="item" v-if='session.active===false'>Login</router-link>
      <router-link to="/accounts/register" v-if='session.active===false' class="item">Signup</router-link>
    </div>
  </div>
</template>

<script>
$(document).ready(function() {
  $('.ui.dropdown').dropdown();
  // $('.ui.menu .item').tab();
  // $('table').tablesort()
  // $('.ui.checkbox').checkbox();
;
});
import { mapGetters } from 'vuex'
export default {
  name: 'app',
  data () {
    return {
      unread_count: null
    }
  },
  computed: {
    ...mapGetters([
      'session',
      'profile'
    ]),
    activeSession() {
      return this.session.active
    }
  },
  watch: {
    activeSession() {
      console.log('Session state changed')
      $('.ui.dropdown').dropdown();
    }
  },
  methods: {
    getUnreadCount() {
      var self = this
      setInterval( function () {
        self.$http.get('notifications/get-unread-count/').then(response => {
          console.log('Got unread count')
          console.log(response)
          self.unread_count = response.body.unread_count
        }, response => {
          console.log('Error getting unread count')
          console.log(response)
        })
      }, 30000)
    },
    logout () {
      console.log('Logging out')
      this.$store.commit('endSession')
      this.$http.post('rest-auth/logout/').then(response => {
        console.log('Logout successful')
        console.log(response)
        // this.$router.go({ path: 'www.omnibuilds.com' })
      }, response => {
        console.log('Error logging out user')
        console.log(response)
      })
    }
  },
  created: function() {
    console.log('vue mounted')
    if (this.session.active) {
      this.$http.get('notifications/get-unread-count/').then(response => {
        console.log('Got unread count')
        console.log(response)
        this.unread_count = response.body.unread_count
      }, response => {
        console.log('Error getting unread count')
        console.log(response)
      })
      console.log('should have gotten unread count')
      this.getUnreadCount()
    } else (
      console.log('No active session detected')
    )
  },
  updated: function() {
    console.log('Vue instance updated')
    if (this.session.active == true) {
      console.log('active session detected')
      $('.ui.dropdown').dropdown();
    }
  }
}
</script>

<style lang="css">

  #nav-profile {
    padding: 12px 5px 0px 5px;
  }

  #nav-inbox {
    padding: 10px 10px 5px 10px;
  }

  .fa-stack[data-count]:after{
    position:absolute;
    right:0%;
    top:1%;
    content: attr(data-count);
    font-size:50%;
    padding:.4em;
    border-radius:750px;
    line-height:.75em;
    color: white;
    background:rgba(255,0,0,.85);
    text-align:center;
    min-width:1.5em;
    font-weight:bold;
  }
</style>
