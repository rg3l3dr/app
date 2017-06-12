<template lang="html">
  <nav class="navbar navbar-default">
    <div class="container">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <router-link class="navbar-brand" to='/home' style="font-family:Exo, sans-serif;font-size: 26px;">
          <i class="fa fa-cogs" style='font-size:24px; color:#555'></i>
          <span style='color:red'>Omni</span><span style='color:blue'>Builds</span>
        </router-link>
      </div>
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul class="nav navbar-nav navbar-center">
         <!--  <li><a href="#">Features</a></li>
          <li><a href="#">Pricing</a></li>
          <li><a href="#">About</a></li> -->
   <!--  -->
        </ul>

        <ul class="nav navbar-nav navbar-right" v-if='session.active===true'>
          <li>
            <router-link id='nav-inbox' to='/notify'>
              <span v-if='unread_count > 0' class="fa-stack fa-lg has-badge" :data-count='unread_count'>
                <i class="fa fa-circle fa-stack-2x"></i>
                <i class="fa fa-bell fa-stack-1x fa-inverse"></i>
              </span>
              <span v-else class="fa-stack fa-lg has-badge">
                <i class="fa fa-circle fa-stack-2x"></i>
                <i class="fa fa-bell fa-stack-1x fa-inverse"></i>
              </span>
            </router-link>
          </li>
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" id='nav-profile'>
              <span v-if='profile.picture'>
                <img :src='profile.picture' style='height:25px'>
              </span>
              <span v-else>
                <i class='fa fa-user fa-lg'></i>
              </span>
              <span class="caret"></span>
            </a>
            <ul class="dropdown-menu">
              <li><router-link to='/'><i class='fa fa-home fa-fw'></i>&nbsp {{session.username}}</router-link></li>
              <li><router-link to='#'><i class='fa fa-folder-o fa-fw'></i>&nbsp Create Project</router-link></li>
              <li><router-link to='#'><i class='fa fa-users fa-fw'></i>&nbsp Create Team</router-link></li>
              <li><router-link to='/profile/public'><i class='fa fa-gear fa-fw'></i>&nbsp My Account</router-link></li>
              <li role="separator" class="divider"></li>
              <li><a href='#' @click.prevent='logout'><i class='fa fa-home fa-fw'></i>&nbsp Log Out</a></li>
            </ul>
          </li>
        </ul>
        <ul class="nav navbar-nav navbar-right" v-else>
          <li><router-link class="nav-item nav-link" to='/accounts/register'>Register</router-link></li>
          <li><router-link class="nav-item nav-link" to='/accounts/login'>Login</router-link></li>
        </ul>
      </div><!-- /.navbar-collapse -->
    </div><!-- /.container-fluid -->
  </nav>
</template>

<script>
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
        this.$router.push({ path: '/accounts/login' })
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
}
</script>

<style lang="css">

  #nav-profile {
    padding: 15px 5px 0px 5px;
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
    border-radius:999px;
    line-height:.75em;
    color: white;
    background:rgba(255,0,0,.85);
    text-align:center;
    min-width:1.5em;
    font-weight:bold;
  }
</style>
