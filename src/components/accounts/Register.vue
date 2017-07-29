<template lang="html">
  <div class="ui container">
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
                  v-on:keydown='setUsernameTimer'>
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
                  type="text"
                  id="emailInput"
                  placeholder="Enter your email"
                  aria-describedby="emailHelp"
                  v-model='email.data'
                  v-on:keydown='setEmailTimer'
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
                  v-on:keydown='setPasswordTimer'
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
              <div class='field'>
                <label for="codeInput">Code</label>
                <input type="text" v-model='code' class='form-control' placeholder='Type in your registration code'>

              </div>
              <button
                type="submit"
                class="ui button primary"
                @click.prevent='submit'
                :disabled='username.isValid != true || email.isValid != true || password.isValid != true || code != "2017"'
                >Signup
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data () {
    return {
      username: {
        isValid: null,
        isTaken: null,
        data: '',
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
        data: '',
        timer: 0,
        hasError: null,
        error: ''
      },
      code: '',
      user: {
        id: null,
        token: null,
        username: null
      }
    }
  },
  methods: {
    setUsernameTimer: function (event) {
      if (event.key === 'Tab' || event.key === 'Enter') {
        return
      } else {
        clearTimeout(this.username.timer)
        this.username.timer = setTimeout(this.validateUsername, 750)
      }
    },
    validateUsername: function () {
      this.username.data = this.username.data.trim()
      // check if valid username regex ^[a-zA-Z0-9@.+-_]+$
      console.log('Validating Username')
      let test = /^[a-zA-Z0-9@.+-_]+$/.test(this.username.data)
      this.username.isValid = null
      this.username.isTaken = null
      this.username.hasError = null

      if (test) {
        // check if unique by getting from the api with a vue-resource call
        this.$http.get('profiles/' + this.username.data + '/').then(response => {
          console.log('Username is already taken')
          this.username.isTaken = true
        }, response => {
          console.log('Username is available')
          this.username.isTaken = false
          console.log('Valid Username')
          this.username.isValid = true
        })
      } else {
        // return error message on form
        console.log('Invalid username')
        this.username.isValid = false
      }
    },
    setEmailTimer: function (event) {
      if (event.key === 'Tab' || event.key === 'Enter') {
        return
      } else {
        clearTimeout(this.email.timer)
        this.email.timer = setTimeout(this.validateEmail, 750)
      }
    },
    validateEmail: function () {
      this.email.data = this.email.data.trim()
      // check if valid email regex ^[a-zA-Z0-9@.+-_]+$
      console.log('Validating email')
      let test = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(this.email.data)
      this.email.isValid = null
      this.email.isTaken = null
      this.email.hasError = null
      if (test) {
        // check if unique by getting from the api with a vue-resource call
        this.$http.get('emails/' + this.email.data + '/').then(response => {
          console.log('Email is already taken')
          this.email.isTaken = true
        }, response => {
          console.log('Email is not being used')
          this.email.isTaken = false
          console.log('Valid email')
          this.email.isValid = true
        })
      } else {
        // return error message on form
        console.log('Invalid email')
        this.email.isValid = false
      }
    },
    setPasswordTimer: function (event) {
      if (event.key === 'Tab' || event.key === 'Enter') {
        return
      } else {
        clearTimeout(this.password.timer)
        this.password.timer = setTimeout(this.validatePassword, 750)
      }
    },
    validatePassword: function () {
      this.password.data = this.password.data.trim()
      console.log('Validating password')
      let test = /^(?=.*[A-Za-z]).{8,}/.test(this.password.data)
      this.password.isValid = null
      this.password.hasError = null
      if (test) {
        console.log('Password is strong')
        this.password.isValid = true
      } else {
        console.log('Password is too weak')
        this.password.isValid = false
      }
    },
    submit: function () {
      console.log('submitting registraiton form')
      // create the payload object
      let user = {
        username: this.username.data,
        email: this.email.data,
        password1: this.password.data,
        password2: this.password.data
      }
      this.$http.post('rest-auth/registration/', user).then(response => {
        console.log('New user created')
        this.$store.commit('signUp')
        this.$router.push({ path: '/accounts/login' })
      }, response => {
        console.log('Error creating new user')
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
