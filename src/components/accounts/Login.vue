<template lang="html">
  <div class="container">
    <div class="row">
      <div class="col-xs-6 col-xs-offset-3">
        <div class='login'>
          <h1 class='text-center'>Login to OmniBuilds</h1>
          <form>
            <div
              class="form-group has-feedback"
              :class="{
                'has-error': password.hasError || username.hasError
              }">
              <label for="username" class="control-label">Username</label>
              <input
                type="text"
                class="form-control"
                id="username"
                placeholder="Enter your username"
                v-model='username.data'
                >
                <span v-if='password.hasError || username.hasError' class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
                <span
                <span
                  v-if='username.hasError'
                  class="help-block"
                  >{{username.error}}
                </span>
            </div>
            <div
              class="form-group has-feedback"
              :class="{
                'has-error': password.hasError
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
                class="btn btn-primary"
                @click.prevent='submit'
                >Login
              </button>
          </form>
          <br>
          <router-link to='/accounts/reset'>Forgot Password</router-link>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
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
  methods: {
    submit: function () {
      this.username.hasError = null
      this.password.hasError = null

      if (this.username.data === '') {
        this.username.hasError = true
        this.username.error = 'You must enter a username'
      }

      if (this.password.data === '') {
        this.password.hasError = true
        this.password.error = 'You must enter a password'
      }

      if (this.username.hasError === null && this.password.hasError === null) {
        console.log('submitting login form')
        // create the payload object
        let login = {
          username: this.username.data,
          password: this.password.data
        }
        this.$http.post('rest-auth/login/', login).then(response => {
          console.log('Login successful')
          console.log(response)
          // get the token and user
          let payload = {
            user_id: response.body.user.pk,
            username: response.body.user.username,
            token: response.body.token,
            active: true
          }
          // store user in vuex store
          this.$store.commit('startSession', payload)
          // redirect to dashboard
          this.$router.push({ path: '/home' })
        }, response => {
          console.log('Error logging in user')
          console.log(response)
          if (typeof response.body.non_field_errors !== 'undefined') {
            this.password.hasError = true
            this.password.error = response.body.non_field_errors[0]
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
