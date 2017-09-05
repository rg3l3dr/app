<template lang="html">
  <div class="ui grid">
    <div class="one wide columm"></div>
    <div class="fourteen wide column">
      <div class="ui two column centered grid">
        <div class="row">
          <div class="column">
            <br>
            <br>
            <br>
            <div class='register'>
              <form class='ui form'>
                <h1 class="ui dividing header">Signup for OmniBuilds</h1>
                <h4 class="ui header">Starter accounts are free and include 100 MB of private storage</h4>
                <div
                  class="field has-feedback"
                  :class="{
                    'has-success': username.isValid,
                    'error': username.isValid == false || username.isTaken || username.hasError
                    }"
                  >
                  <label for="username" class="control-label">Username</label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Choose a username"
                    v-model='username.data'
                    @blur='validateUsername'
                    >
                  <span v-if='username.isValid' class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                  <span v-else-if='username.isTaken || username.hasError || username.isValid == false' class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
                  <div
                    v-if='username.isValid == false'
                    class="help-block"
                    >Enter a valid username. This value may contain only English letters, numbers, and @/./+/-/_ characters
                  </div>
                  <div
                    v-else-if='username.isTaken'
                    class="help-block"
                    >This username has already been taken, please choose another
                  </div>
                  <div
                    v-else-if='username.hasError'
                    class="ui error message"
                    > {{username.error}}
                  </div>
                </div>
                <div
                  class="field has-feedback"
                  :class="{
                    'has-success': email.isValid,
                    'error': email.isValid == false || email.isTaken || email.hasError
                    }"
                  >
                  <label for="emailInput" class="control-label">Email address</label>
                  <input
                    type="email"
                    id="emailInput"
                    placeholder="Enter your email"
                    aria-describedby="emailHelp"
                    v-model='email.data'
                    @blur='validateEmail'
                  >
                  <span v-if='email.isValid' class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                  <span v-else-if='email.isTaken || email.hasError || email.isValid == false' class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
                  <div
                    v-if='email.isValid == false'
                    class="help-block"
                    >Enter a valid email address
                  </div>
                  <div
                    v-else-if='email.isTaken'
                    class="help-block"
                    >This email address is already being used by a member of this site.
                  </div>
                  <div
                    v-else-if='email.hasError'
                    class="help-block"
                    > {{email.error}}
                  </div>
                </div>
                <div
                  class="field has-feedback"
                  :class="{
                    'has-success': password.isValid,
                    'error': password.isValid == false || password.hasError
                    }">
                  <label for="passwordInput" class='control-label'>Password</label>
                  <input
                    type="password"
                    id="passwordInput"
                    placeholder="Choose a password"
                    aria-describedby="emailHelp"
                    v-model='password.data'
                    @blur='validatePassword'
                    >
                  <span v-if='password.isValid' class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                  <span v-else-if='password.hasError || password.isValid == false' class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
                 <div
                   v-if='password.isValid == false'
                   class="has-error"
                   >Password must contain at least 8 characters and include at least one number and one letter
                 </div>
                 <div
                   v-else-if='password.hasError'
                   class="has-error"
                   > {{password.error}}
                 </div>
                </div>
              <!--   <div class='field'>
                <label for="codeInput">Code</label>
                <input type="text" v-model='code' class='form-control' placeholder='Type in your registration code'>

              </div> -->
                <button
                  type="submit"
                  class="ui basic blue button"
                  @click.prevent='submit'

                  >Signup
                  <!-- :disabled='username.isValid != true || email.isValid != true || password.isValid != true' -->
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="one wide column"></div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Register',
  data () {
    return {
      username: {
        isValid: null,
        isTaken: null,
        data: null,
        timer: 0,
        hasError: null,
        error: ''
      },
      email: {
        isValid: null,
        isTaken: null,
        data: '',
        timer: 0,
        hasError: null,
        error: ''

      },
      password: {
        isValid: null,
        data: null,
        timer: 0,
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
    ...mapState([
      'env',
    ]),
  },
  methods: {
    validateUsername: function () {
      if (this.username.data != '' && this.username.data != null) {
        this.username.data = this.username.data.trim()
        // check if valid username regex ^[a-zA-Z0-9@.+-_]+$
        if (this.env != 'prod') {
          console.log('Validating Username')
        }
        let test = /^[a-zA-Z0-9@.+-_]+$/.test(this.username.data)
        this.username.isValid = null
        this.username.isTaken = null
        this.username.hasError = null

        if (test) {
          // check if unique by getting from the api with a vue-resource call
          let payload = {username: this.username.data}
          this.$http.post('check_username/', payload).then(response => {
            if (response.body.active) {
              if (this.env != 'prod') {
                console.log('Username is already taken')
                console.log(response)
              }
              this.username.isTaken = true
            } else {
              if (this.env != 'prod') {
                console.log('Username is available')
                console.log('Valid Username')
                console.log(response)
              }
              this.username.isTaken = false
              this.username.isValid = true
            }
          }, response => {})
        } else {
          if (this.env != 'prod') {
            console.log('Invalid username')
          }
          // return error message on form
          this.username.isValid = false
        }
      } else {
        this.username.isValid = null
        this.username.isTaken = null
        this.username.hasError = null
      }
    },
    validateEmail: function () {
      if (this.email.data != '' && this.email.data != null) {
        this.email.data = this.email.data.trim()
        // check if valid email regex ^[a-zA-Z0-9@.+-_]+$
        if (this.env != 'prod') {
          console.log('Validating email')
        }
        let test = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(this.email.data)
        this.email.isValid = null
        this.email.isTaken = null
        this.email.hasError = null
        if (test) {
          // check if unique by getting from the api with a vue-resource call
          let payload = {email: this.email.data}
          this.$http.post('check_email/', payload).then(response => {
            if (response.body.active) {
              if (this.env != 'prod') {
                console.log('Email is already taken')
                console.log(response)
              }
              this.email.isTaken = true
            } else {
              if (this.env != 'prod') {
                console.log('Email is not being used')
                console.log('Valid email')
                console.log(response)
              }
              this.email.isTaken = false
              this.email.isValid = true
            }
          }, response => {
            if (this.env != 'prod') {
              console.log('Invalid email')
            }
            // return error message on form
            this.email.isValid = false
          })
        } else {
          this.email.isValid = null
          this.email.isTaken = null
          this.email.hasError = null
        }
      }
    },
    validatePassword: function () {
      if (this.password.data != null && this.password.data != '' ) {
        this.password.data = this.password.data.trim()
        if (this.env != 'prod') {
          console.log('Validating password')
        }
        let test = /^(?=.*[A-Za-z]).{8,}/.test(this.password.data)
        this.password.isValid = null
        this.password.hasError = null
        if (test) {
          if (this.env != 'prod') {
            console.log('Password is strong')
          }
          this.password.isValid = true
        } else {
          if (this.env != 'prod') {
            console.log('Password is too weak')
          }
          this.password.isValid = false
        }
      } else {
        this.password.isValid = null
        this.password.hasError = null
      }
    },
    submit: function () {
      if (this.env != 'prod') {
        console.log('submitting registraiton form')
      }
      // create the payload object
      let user = {
        username: this.username.data,
        email: this.email.data,
        password1: this.password.data,
        password2: this.password.data
      }
      this.$http.post('rest-auth/registration/', user).then(response => {
        if (this.env != 'prod') {
          console.log('New user created')
        }
        this.$store.commit('signUp')
        this.$router.push({ path: '/accounts/auth/login' })
      }, response => {
        if (this.env != 'prod') {
          console.log('Error creating new user')
        }
        if (typeof response.body.username !== 'undefined') {
          this.username.hasError = true
          this.username.error = response.body.username[0]
        }
        if (typeof response.body.email !== 'undefined') {
          this.email.hasError = true
          this.email.error = response.body.email[0]
        }
        if (typeof response.body.password1 !== 'undefined') {
          this.password.hasError = true
          this.password.error = response.body.password1[0]
        }
      })
    }
  }
}
</script>

<style lang="css">
  .register {
    padding: 1.5rem;
    margin-right: 0;
    margin-bottom: 0;
    margin-left: 0;
    border-width: .2rem;
    border: solid #f7f7f9;
  }
</style>
