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
            <div class='reset'>
              <form class='ui form'>
                <h1 class="ui dividing header">Request password reset</h1>
                <div class="field has-feedback"
                :class="{
                  'has-success': email.isValid && email.isActive,
                  'error': email.isValid == false || email.isActive == false || email.hasError
                  }">
                  <label for="email" class="control-label">Email</label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Enter your email"
                    v-model='email.data'
                    @blur='validateEmail'>
                  <span v-if='email.isActive == false || email.hasError || email.isValid == false' class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
                  <span
                    v-if='email.isValid == false'
                    class="help-block"
                    >Enter a valid email address
                  </span>
                  <span
                    v-else-if='email.isActive == false'
                    class="help-block"
                    >This email address is not associated with a user account
                  </span>
                  <span
                    v-else-if='email.hasError'
                    class="help-block"
                    > {{email.error}}
                  </span>
                </div>
                <button
                  type="submit"
                  class="ui blue basic button"
                  :disabled='email.isValid != true || email.isActive != true'
                  @click.prevent.once='submit'
                  >Reset Password
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
  data () {
    return {
      email: {
        data: null,
        isValid: null,
        isActive: null,
        hasError: null,
        error: ''
      }
    }
  },
  computed: {
    ...mapState([
      'env'
    ]),
  },
  methods: {
    submit: function () {
      if (this.env != 'prod') {
        console.log('submitting password reset form')
      }
      // create the payload object
      let email = {'email': this.email.data}
      this.$http.post('rest-auth/password/reset/', email).then(response => {
        if (this.env != 'prod') {
          console.log('Password reset')
          console.log(response)
        }
        this.$router.push({ path: '/accounts/auth/confirm_reset' })
      }, response => {
        if (this.env != 'prod') {
          console.log('Error resetting password')
          console.log(response)
        }
      })
    },
    validateEmail: function () {
      // check if valid email regex ^[a-zA-Z0-9@.+-_]+$
      this.email.data = this.email.data.trim()
      if (this.env != 'prod') {
        console.log('Validating email')
      }
      let test = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(this.email.data)
      this.email.isValid = null
      this.email.hasError = null
      this.email.isActive = null
      if (test) {
        this.email.isValid = true
        // check if unique by getting from the api with a vue-resource call
        let payload = {email: this.email.data}
        this.$http.post('check_email/', payload).then(response => {
          if (response.body.active) {
            if (this.env != 'prod') {
              console.log('This email is associated with a user')
            }
            this.email.isActive = true
          } else {
            if (this.env != 'prod') {
              console.log('This email is not associated with a user')
            }
            this.email.isActive = false
          }
        }, response => {})
      } else {
        if (this.env != 'prod') {
          console.log('Invalid email')
        }
        // return error message on form
        this.email.isValid = false
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
