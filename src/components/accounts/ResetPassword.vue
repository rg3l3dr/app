<template lang="html">
  <div class="ui container">
    <div class="ui two column centered grid">
      <div class="row">
        <div class="column">
          <br>
          <br>
          <br>
          <div class="reset">
            <form class='ui form'>
              <h1 class="ui dividing header">Reset your Password</h1>
              <div
                class="field has-feedback"
                :class="{
                  'has-success': password1.isValid,
                  'has-error': password1.isValid == false || password1.hasError
                  }">
                <label for="passwor1dInput" class='control-label'>New Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password1Input"
                  placeholder="Choose a new password"
                  aria-describedby="emailHelp"
                  v-model='password1.data'
                  >
                <span v-if='password1.isValid' class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                <span v-else-if='password1.hasError || password1.isValid == false' class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
               <span
                 v-if='password1.isValid == false'
                 class="help-block"
                 >Password must contain at least 8 characters and include at least one number and one letter
               </span>
               <span
                 v-else-if='password1.hasError'
                 class="help-block"
                 > {{password1.error}}
               </span>
              </div>
              <div
                class="field has-feedback"
                :class="{
                  'has-success': password2.isValid,
                  'has-error': password2.isValid == false || password2.hasError
                  }">
                <label for="passwor2dInput" class='control-label'>Retype New Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password2Input"
                  placeholder="Retype your new password"
                  v-model='password2.data'
                  >
                <span v-if='password2.isValid' class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
                <span v-else-if='password2.hasError || password2.isValid == false' class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
               <span
                 v-if='password2.isValid == false'
                 class="help-block"
                 >Password must contain at least 8 characters and include at least one number and one letter
               </span>
               <span
                 v-else-if='password2.hasError'
                 class="help-block"
                 > {{password2.error}}
               </span>
              </div>
              <button class='ui small button' @click.prevent='forgotPassword'>
                Update Password
              </button>
              <br>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
let token = getParameterByName('token'); // "lorem"
let uid = getParameterByName('uid'); // "lorem"

import { mapGetters } from 'vuex'
export default {
  name: 'ResetPassword',
  data() {
    return {
      password1: {
        isValid: null,
        data: '',
        timer: 0,
        hasError: null,
        error: ''
      },
      password2: {
        isValid: null,
        data: '',
        timer: 0,
        hasError: null,
        error: ''
      },
    }
  },
  computed: {
    ...mapGetters([
      'env',
      'session',
      'profile'
    ]),
  },
  methods: {
    forgotPassword: function () {
      this.password1.data = this.password1.data.trim()
      this.password2.data = this.password2.data.trim()
      if (this.env != 'prod') {
        console.log('Validating password')
      }
      let test = /^(?=.*[A-Za-z]).{8,}/.test(this.password1.data)
      this.password1.isValid = null
      this.password1.hasError = null
      this.password2.isValid = null
      this.password2.hasError = null
      if (test) {
        if (this.env != 'prod') {
          console.log('Password is strong')
        }
        this.password1.isValid = true
        if (this.password1.data === this.password2.data) {
          if (this.env != 'prod') {
            console.log('passwords match')
          }
          this.password2.isValid = true
          let payload = {
            uid: uid,
            token: token,
            new_password1: this.password1.data,
            new_password2: this.password2.data,
          }
          this.$http.post('rest-auth/password/reset/confirm/', payload).then(response => {
            if (this.env != 'prod') {
              console.log('Password updated')
              console.log(response)
            }
            alert('Password successfully updated.  Please log back in with your new password.')
            this.$store.commit('endSession')
            this.$http.post('rest-auth/logout/').then(response => {
              if (this.env != 'prod') {
                console.log('Logout successful')
                console.log(response)
              }
              this.$router.push({ path: '/accounts/login' })
            }, response => {
              if (this.env != 'prod') {
                console.log('Error logging out user')
                console.log(response)
              }
            })
          }, response => {
            if (this.env != 'prod') {
              console.log('Error updating password')
            }
            if (typeof response.body.new_password1 !== 'undefined') {
              this.password1.hasError = true
              this.password1.error = response.body.new_password1[0]
            }
            if (typeof response.body.new_password2 !== 'undefined') {
              this.password2.hasError = true
              this.password2.error = response.body.new_password2[0]
            }
          })

        } else {
          if (this.env != 'prod') {
            console.log('passwords do not match')
          }
          this.password1.hasError = true
          this.password1.error = 'Passwords do not match'
          this.password2.hasError = true
          this.password2.error = 'Passwords do not match'
        }
      } else {
        if (this.env != 'prod') {
          console.log('Password is too weak')
        }
        this.password1.isValid = false
        this.password2.isValid = false
      }
    }
  }
}
</script>

<style lang="css">
.reset {
  padding: 1.5rem;
  margin-right: 0;
  margin-bottom: 0;
  margin-left: 0;
  border-width: .2rem;
  border: solid #f7f7f9;
}
</style>
