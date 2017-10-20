<template lang="html">
  <div id='account'>
    <div class='ui small top attached header'>
      <i class="fa fa-bars text-primary" aria-hidden="true"></i>
      <div class="content">
        &nbsp
        Account Settings
      </div>
    </div>
    <div class="ui bottom attached clearing segment">
      <h4>Change your account email address</h4>
      <form class='ui form'>
        <div
          class="field has-feedback"
          :class="{
            'has-success': email.isValid,
            'has-error': email.isValid == false || email.isTaken || email.hasError
            }"
          >
          <label for="emailInput" class="control-label">Email address</label>
          <input
            type="text"
            class="form-control"
            id="emailInput"
            placeholder="Type in a new email address"
            v-model='email.data'
          >
          <span v-if='email.isValid' class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
          <span v-else-if='email.isTaken || email.hasError || email.isValid == false' class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
          <span
            v-if='email.isValid == false'
            class="help-block"
            >Enter a valid email address
          </span>
          <span
            v-else-if='email.isTaken'
            class="help-block"
            >This email address is already being used by a member of this site.
          </span>
          <span
            v-else-if='email.hasError'
            class="help-block"
            > {{email.error}}
          </span>
          <span
            v-else-if='email.hasError===null && email.isTaken===false && email.isValid ===true'
            class="help-block"
            >Successfully updated email address
          </span>
        </div>
        <button class='ui small basic blue button' @click.prevent.once='changeEmail'>
          Change Email
        </button>
      </form>
      <hr>
      <h4>Change your account password</h4>
      <form class='ui form'>
        <div
          class="field has-feedback"
          :class="{
            'has-success': oldPassword.isValid,
            'has-error': oldPassword.isValid == false || oldPassword.hasError
            }">
          <label for="oldPasswordInput" class='control-label'>Current Password</label>
          <input
            type="password"
            class="form-control"
            id="oldPasswordInput"
            placeholder="Type in your current password"
            v-model='oldPassword.data'
            >
          <span v-if='oldPassword.isValid' class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
          <span v-else-if='oldPassword.hasError || oldPassword.isValid == false' class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
         <span
           v-if='oldPassword.isValid == false'
           class="help-block"
           >Password must contain at least 8 characters
         </span>
         <span
           v-else-if='oldPassword.hasError'
           class="help-block"
           > {{oldPassword.error}}
         </span>
        </div>
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
        <button class='ui small basic blue button' @click.prevent.once='changePassword'>
          Change Password
        </button>
        <br><br>
      </form>
      <!-- <hr>
      <h4>Change your account username</h4>
      <form class='ui form'>
        <div
          class="field has-feedback"
          :class="{
            'has-success': username.isValid,
            'has-error': username.isValid == false || username.isTaken || username.hasError
            }"
          >
          <label for="username" class="control-label">Username</label>
          <input
            type="text"
            class="form-control"
            id="username"
            placeholder="Type in a new username"
            v-model='username.data'
            >
          <span v-if='username.isValid' class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
          <span v-else-if='username.isTaken || username.hasError || username.isValid == false' class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
          <span
            v-if='username.isValid == false'
            class="help-block"
            >Enter a valid username. This value may contain only English letters, numbers, and @/./+/-/_ characters
          </span>
          <span
            v-else-if='username.isTaken'
            class="help-block"
            >This username has already been taken, please choose another
          </span>
          <span
            v-else-if='username.hasError'
            class="help-block"
            > {{username.error}}
          </span>
        </div>
        <button class='ui button' @click.prevent.once='changeUsername'>
          Change Username
        </button>
      </form> -->
    </div>
  </div><!-- /.tab-pane fade in  -->
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Account',
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
      oldPassword: {
        isValid: null,
        data: '',
        timer: 0,
        hasError: null,
        error: ''
      },
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
      'session',
      'profile'
    ]),
  },
  created: function() {
    this.username.data = this.session.username
    this.email.data = this.profile.owner.email
  },
  methods: {
    changeUsername: function () {
      this.username.data = this.username.data.trim()
      if (this.env != 'prod') {
        console.log('Validating Username')
      }
      let test = /^[a-zA-Z0-9@.+-_]+$/.test(this.username.data)
      this.username.isValid = null
      this.username.isTaken = null
      this.username.hasError = null
      if (test) {
        this.$http.get('profiles/' + this.username.data + '/').then(response => {
          this.username.isTaken = true
        }, response => {
          this.username.isTaken = false
          this.username.isValid = true
          let payload = { username: this.username.data }
          this.$http.put('users/' + this.session.user_id + '/', payload).then(response => {
            if (this.env != 'prod') {
              console.log('Username updated')
            }
            alert('Username successfully updated.  Please log back in with your new username.')
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
              console.log('Error updating username')
            }
            if (typeof response.body.username !== 'undefined') {
              this.username.hasError = true
              this.username.error = response.body.username[0]
            }
          })
        })
      } else {
        if (this.env != 'prod') {
          console.log('Invalid username')
        }
        this.username.isValid = false
      }
    },
    changeEmail: function () {
      this.email.data = this.email.data.trim()
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
            }
            this.email.isTaken = true
          } else {
            if (this.env != 'prod') {
              console.log('Email is not being used')
              console.log('Valid email')
            }
            this.email.isTaken = false
            this.email.isValid = true
            let payload = {
              username: this.username.data,
              email: this.email.data
            }
            this.$http.put('users/' + this.session.user_id + '/', payload).then(response => {
              if (this.env != 'prod') {
                console.log('Email updated')
              }
              this.$store.dispatch('getProfile')
              }, response => {
                if (this.env != 'prod') {
                  console.log('Error updating email')
                  console.log(response)
                }
                if (typeof response.body.email !== 'undefined') {
                  this.email.hasError = true
                  this.email.error = response.body.username[0]
                }
              }
            )
          }
        }, response => {})
      } else {
        // return error message on form
        if (this.env != 'prod') {
          console.log('Invalid email')
        }
        this.email.isValid = false
      }
    },
    changePassword: function () {
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
      this.oldPassword.isValid = null
      this.oldPassword.hasError = null
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
            new_password1: this.password1.data,
            new_password2: this.password2.data,
            old_password: this.oldPassword.data
          }
          this.$http.post('rest-auth/password/change/', payload).then(response => {
            if (this.env != 'prod') {
              console.log('Password updated')
              console.log(response)
            }
            this.oldPassword.isValid = true
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
            if (typeof response.body.old_password !== 'undefined') {
              this.oldPassword.hasError = true
              this.oldPassword.error = response.body.old_password[0]
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
</style>
