<template lang="html">
  <div class="ui grid" style='padding-right: 25px; padding-left:25px'>
    <div class="sixteen wide column">
      <div class="ui text menu" style='margin-bottom: 0px; margin-top: 0px'>
        <router-link v-if='session.active' class='item' to='/home' style="font-family:Exo, sans-serif;font-size: 33px; padding: 5px 3rem 0px 10px" id='brand-link'>
          <i class="fa fa-cogs" style='font-size:32px; color:#4c6972'></i>
          &nbsp
          <span style='color:#4c6972'>Omni</span><span style='color:#4c6972'>Builds</span>
        </router-link>
        <a href='https://www.omnibuilds.com' v-else-if='env == "prod"' style="font-family:Exo, sans-serif;font-size: 30px; padding: 5px 3rem 5px 10px" id='brand-link'>
          <i class="fa fa-cogs" style='font-size:32px; color:#4c6972'></i>
          &nbsp
          <span style='color:#4c6972'>Omni</span><span style='color:#4c6972'>Builds</span>
        </a>
        <a href='https://stage.omnibuilds.com' v-else style="font-family:Exo, sans-serif;font-size: 32px; padding: 5px 3rem 5px 10px" id='brand-link'>
          <i class="fa fa-cogs" style='font-size:30px; color:#4c6972'></i>
          &nbsp
          <span style='color:#4c6972'>Omni</span><span style='color:#4c6972'>Builds</span>
        </a>
        <!-- <a href="#" class="item">Features</a>
        <a href="#" class="item">Mission</a>
        <a href="#" class="item">Pricing</a> -->
        <div class="right floated menu">
          <div class="item" style='padding-right: 5rem'>

            <div class="ui fluid search" v-show='session.active'>
              <div class="ui icon input">
                <input
                  class="prompt"
                  type="text"
                  size='35'
                  placeholder=" Search your designs"
                  v-model='inputQuery'
                  @keydown.enter='getResult'
                >
                <i class="search icon"></i>
              </div>
              <div class="results" @click='getResult'></div>
            </div>
          </div>
          <router-link class='item' id='nav-inbox' to='/accounts/notifications/unread' v-if='session.active===true'>
            <span v-if='unread_count > 0' class="fa-stack fa-lg has-badge" :data-count='unread_count'>
              <i class="fa fa-circle fa-stack-2x"></i>
              <i class="fa fa-bell fa-stack-1x fa-inverse"></i>
            </span>
            <span v-else class="fa-stack fa-lg has-badge">
              <i class="fa fa-circle fa-stack-2x"></i>
              <i class="fa fa-bell fa-stack-1x fa-inverse"></i>
            </span>
          </router-link>
          <div class="ui dropdown" id='nav-profile' v-if='session.active' style='padding-top: 12px'>
            <span v-if='profile'>

              <img :src='profile.picture' style='height:30px' v-if='profile.picture'>
              <i class='fa fa-user fa-2x' v-else></i>
            </span>
            <i class="dropdown icon"></i>
            <div class="menu">
              <router-link class='item' to='/home'>
                <i class='fa fa-home fa-fw'></i>
                &nbsp {{session.username}}
              </router-link>
              <router-link class='item' to='/designs/create_design'>
                <i class='fa fa-folder-o fa-fw'></i>
                &nbsp Create Project
              </router-link>
              <router-link class='item' to='/accounts/settings/public'>
                <i class='fa fa-gear fa-fw'></i>
                &nbsp My Account
              </router-link>
              <template v-if='profile.owner'>
                <router-link class='item' to='/profiles/admin' v-if='profile.owner.is_superuser'><i class='dashboard icon'></i>Admin Dashboard
                </router-link>
              </template>
              <div class="divider"></div>
              <router-link class='item' to='/accounts/auth/login' @click.prevent.native='logout()'>
                <i class='sign out icon'></i>&nbsp Log Out
              </router-link>
            </div>
          </div>
          <router-link to="/accounts/auth/login" class="item" v-if='session.active===false'>Login</router-link>
          <router-link to="/accounts/auth/register" v-if='session.active===false' class="item">Signup</router-link>
        </div>
      </div>

    </div>
  </div>

</template>

<script>

import { mapState } from 'vuex'
export default {
  name: 'navbar',
  data () {
    return {
      unread_count: null,
      checkUnread: false,
      resultSelected: false,
      inputQuery: null,
      result: {},
    }
  },
  computed: {
    ...mapState([
      'env',
      'session',
      'profile',
      'query',
    ]),
  },
  methods: {
    getResult() {
      let vue = this
      setTimeout(function() {
          if (vue.resultSelected) {
            if (vue.env != 'prod') {
              console.log('Result selected, redirecting to result detail page')
            }
            let path = vue.result.creator + '/' + vue.result.slug
            vue.inputQuery = null
            vue.resultSelected = false
            vue.result = {}
            $('.ui.search').search('hide results')
            vue.$router.push('/' + path)
            location.reload()
          } else {
            if (vue.env != 'prod') {
              console.log('No result selected, redirecting to results list page')
              console.log(vue.inputQuery)
            }
            let payload = {
              query: vue.inputQuery,
              clones: false,
              imports: false
            }
            vue.$store.commit('setQuery', payload)
            vue.inputQuery = null
            vue.resultSelected = false
            vue.result = {}
            $('.ui.search').search('hide results')
            vue.$router.push('/search')
          }
      }, 0);
    },
    getUnreadCount() {
      if (this.session.active) {
        this.$http.get('notifications/get-unread-count/').then(response => {
          if (this.env != 'prod') {
            console.log('Got unread count')
            console.log(response)
          }
          self.unread_count = response.body.unread_count
        }, response => {
          if (this.env != 'prod') {
            console.log('Error getting unread count')
            console.log(response)
          }
        })

        var self = this
        setInterval( function () {
          self.$http.get('notifications/get-unread-count/').then(response => {
            if (self.env != 'prod') {
              console.log('Got unread count')
              console.log(response)
            }
            self.unread_count = response.body.unread_count
          }, response => {
            if (self.env != 'prod') {
              console.log('Error getting unread count')
              console.log(response)
            }
          })
        }, 30000)
      }

    },
    logout () {
      if (this.env != 'prod') {
        console.log('clicked logout')
      }
      let path = '/accounts/auth/login'
      this.$http.post('rest-auth/logout/').then(response => {
        if (this.env != 'prod') {
          console.log('Logout successful')
          console.log(response)
        }
        this.$store.commit('endSession')
        this.$router.push(path)
      }, response => {
        if (this.env != 'prod') {
          console.log('Error logging out user')
          console.log(response)
        }
        this.$store.commit('endSession')
      })
    },
    setSearch() {
      let vue = this
      if (this.env == 'prod') {
        $('.ui.search').search(
          {
            apiSettings: {
                url: 'https://www.omnibuilds.com/designquery/?q={query}',
                beforeXHR: function(xhr) {
                  xhr.setRequestHeader ('Authorization', 'JWT ' + vue.session.token)
                  return xhr;
                }
              },
            fields: {
              title: 'name',
              description: 'number',
              price: 'design_type'
            },
            onSelect: function(result, response) {
              vue.resultSelected = true
              vue.result = result
            }
          }
        )
      } else {
        $('.ui.search').search(
          {
            apiSettings: {
              searchFullText: true,
              url: 'https://stage.omnibuilds.com/designquery/?q={query}',
              beforeXHR: function(xhr) {
                xhr.setRequestHeader ('Authorization', 'JWT ' + vue.session.token)
                return xhr;
              }
            },
            fields: {
              title: 'name',
              description: 'number',
              price: 'design_type'
            },
            onSelect: function(result, response) {
              vue.resultSelected = true
              vue.result = result
            }
          }
        )
      }
    }
  },
  created() {
    this.getUnreadCount()
  },
  mounted() {
    $('.ui.dropdown').dropdown({ 'silent': true })
    this.setSearch()
  },
  updated() {
    $('.ui.dropdown').dropdown({ 'silent': true })
    // if (this.session.active == true) {
    //   if (this.checkUnread == false) {
    //     this.getUnreadCount()
    //     this.checkUnread = true
    //   }
    // }
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

  .ui.search .prompt {
    border-radius: 1.25em;
  }

  .ui.input.input {
    padding: .5em 0em;
  }


</style>
