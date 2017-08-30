<template lang="html">
  <div class="ui grid">
    <div class="one wide column"></div>
    <div class="fourteen wide column">
      <div class="ui two column centered grid">
        <div class="row">
          <div class="column">
            <br>
            <br>
            <br>
            <div class='login'>
              <form class='ui form'>
                <h1 class="ui dividing header">Login to OmniBuilds</h1>
                <div class='ui info icon message' style='text-align:center' v-if='session.signed_up'>
                  <i class="mail icon"></i>
                  <div class="content">
                    An activation email has been sent to the address provided.
                    <br>
                    Please confirm your email and login below.
                  </div>
                </div>
                <div
                  class="field"
                  :class="{
                    'error': password.hasError || username.hasError
                  }">
                  <label for="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Enter your username"
                    v-model='username.data'
                    >
                    <span v-if='password.hasError || username.hasError' class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
                    <span
                      v-if='username.hasError'
                      class="help-block"
                      >{{username.error}}
                    </span>
                </div>
                <div
                  class="field has-feedback"
                  :class="{
                    'error': password.hasError
                    }"
                  >
                  <label for="password" class="control-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    placeholder="Enter your password"
                    v-model='password.data'
                    >
                    <span v-if='username.hasError || password.hasError' class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
                    <span
                    <span
                      v-if='password.hasError'
                      class="help-block"
                      >{{password.error}}
                    </span>
                  </div>
                  <button
                    type="submit"
                    class="ui button primary"
                    @click.prevent='submit'
                    >Login
                  </button>
              </form>
              <br>
              <router-link to='/accounts/request_reset'>Forgot Password</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="one wide column"></div>

  </div>

</template>

<script>
import { EventBus } from '../../event-bus.js'
import { mapGetters } from 'vuex'

export default {
  name: 'Login',
  data () {
    return {
      username: {
        data: '',
        hasError: null,
        error: ''
      },
      password: {
        data: '',
        hasError: null,
        error: ''
      },
      user: {
        id: null,
        token: null,
        username: null
      }
    }
  },
  computed: {
    ...mapGetters([
      'env',
      'session'
    ])
  },
  methods: {
    submit: function () {
      this.username.hasError = null
      this.username.data = this.username.data.trim()
      this.password.hasError = null
      this.password.data = this.password.data.trim()

      if (this.username.data === '') {
        this.username.hasError = true
        this.username.error = 'You must enter a username'
      }

      if (this.password.data === '') {
        this.password.hasError = true
        this.password.error = 'You must enter a password'
      }

      if (this.username.hasError === null && this.password.hasError === null) {
        if (this.env != 'prod') {
          console.log('submitting login form')
        }
        // create the payload object
        let login = {
          username: this.username.data,
          password: this.password.data
        }
        this.$http.post('rest-auth/login/', login).then(success => {
          if (this.env != 'prod') {
            console.log('Login successful')
            console.log(success)
          }
          // get the token and user
          let payload = {
            user_id: success.body.user.pk,
            username: success.body.user.username,
            token: success.body.token,
            active: true
          }
          // store user in vuex store
          this.$store.commit('startSession', payload)
          this.$store.dispatch('getProfile').then(success => {
            if (this.env != 'prod') {
              console.log('Got profile at login')
            }
            this.$router.push({ path: '/home' })
          }, error => {

          })
        }, error => {
          if (this.env != 'prod') {
            console.log('Error logging in user')
            console.log(error)
          }
          if (typeof error.body.non_field_errors !== 'undefined') {
            this.password.hasError = true
            this.password.error = error.body.non_field_errors[0]
          }
        })
      }
    }
  }
}
</script>

<style lang="css">
.login {
  padding: 1.5rem;
  margin-right: 0;
  margin-bottom: 0;
  margin-left: 0;
  border-width: .2rem;
  border: solid #f7f7f9;
}
</style>
