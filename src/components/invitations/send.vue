<template lang="html">
  <div id='send'>
    <div class='ui small top attached header'>
      <i class="fa fa-envelope exo" aria-hidden="true"></i>
      <div class="content">
        &nbsp
        Send Invitations
      </div>
    </div>
    <div class="ui bottom attached segment">
      <div class='twelve wide column' id='invites'>
        <h2> Invite friends via email</h2>
        <p> Get 100 MB of private storage for each friend who joins </p>
        <form class='ui form'>
          <transition-group name='fade'>
            <div
              class='field has-feedback'
              :class="{
                'has-success': invite.isValid,
                'error': invite.isValid == false || invite.hasError
                }"
              v-for='(invite, index) in invites' :key='invite'>
              <input
                v-model='invite.email'
                type='email'
                class='form-control'
                placeholder='Enter an email'
                v-on:keydown='validateInvite(index)'
              >
              <span
                v-if='invite.isValid'
                class="glyphicon glyphicon-ok form-control-feedback"
                aria-hidden="true">
              </span>
              <span
                v-else-if='invite.hasError || invite.isValid == false'
                class="glyphicon glyphicon-remove form-control-feedback"
                aria-hidden="true">
              </span>
              <span
                v-if='invite.isValid'
                class="help-block"
                >Invitation is ready to be sent!
              </span>
              <span
                v-if='invite.isValid == false || invite.hasError'
                class="help-block"
                >{{ invite.error }}
              </span>
            </div>
          </transition-group>
          <br>
          <input type='button' id='addAnother' value='Add Another' class='ui small basic blue button' @click.prevent='addInvite'>
          &nbsp;
          <input
            type='submit'
            value='Send Invites'
            id='sendInvites'
            class='ui small basic blue button'
            @click.prevent='submitInvites'
            :disabled='valid_invites.length === 0 || invalid_invites.length > 0'>


          <p v-if='hasErrors' style='color:#a94442'><br>
            One or more of your invitations has errors, please correct and resubmit
          </p>
        </form>

        <div class="ui small modal" id="successModal">
          <div class="header">
            <h4>Invitations Successful!</h4>
          </div>
          <div class="content">
            <p>
            The following friends have been sent invites to OmniBuilds:
            <br><br>
            <span v-for='invite in valid_invites'>
              <a :href="'mailto:' + invite.email"> {{invite.email}} </a> <br>
            </span>
            <hr>
            For each friend who accepts an invite and creates an account on OmniBuilds, you will receive 100 MB of private storage! <br>
            <p>
          </div>
          <div class="actions">
            <button type="button" class="ui small basic bluebutton" @click='toggleSuccessModal'>Close</button>
          </div>
        </div>

        <div class="ui small modal" id='failureModal'>
          <div class="header">
            <h4>There was a problem...</h4>
          </div>
          <div class="content">
            <p v-if='valid_invites.length > 0'>
              The following friends have been sent invites to OmniBuilds:
              <br><br>
              <span v-for='invite in valid_invites'>
                <a :href="'mailto:' + invite.email"> {{invite.email}} </a> <br>
              </span>
              <hr>
            </p>

            <p v-if='invalid_invites.length > 0'>
              The following friends could not be invited to OmniBuilds:
              <br><br>
              <span v-for='invite in valid_invites'>
                <a :href="'mailto:' + invite.email"> {{invite.email}} </a> <br>
              </span>
              <hr>
            </p>

            <p>
            For each friend who accepts an invite and creates an account on OmniBuilds, you will receive 100 MB of private storage! <br>
            <p>
          </div>
          <div class="actions">
            <button type="button" class="ui small basic blue button" @click='toggleFailureModal'>Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  created: function() {},
  data() {
    return {
      hasErrors: null,
      invites: [
  			{
  				'email': '',
          'isValid': null,
          'hasError': null,
          'error': null,
          'timer': 0
  			},
  			{
          'email': '',
          'isValid': null,
          'hasError': null,
          'error': null,
          'timer': 0
  			},
  			{
          'email': '',
          'isValid': null,
          'hasError': null,
          'error': null,
          'timer': 0
  			}
  		],
    }
  },
  computed: {
    ...mapGetters([
      'session',
      'profile'
    ]),
    pending_invites: function() {
      return this.profile.owner.invitation_set.filter(function (invite) {
        return invite.accepted === false
      })
    },
    accepted_invites: function() {
      return this.profile.owner.invitation_set.filter(function (invite) {
        return invite.accepted === true
      })
    },
    valid_invites: function() {
      return this.invites.filter(function (invite) {
        return invite.isValid === true && invite.hasError === null
      })
    },
    invalid_invites: function() {
      return this.invites.filter(function (invite) {
        return invite.isValid === false || invite.hasError === true
      })
    },

	},
  methods: {
    toggleSuccessModal: function() {
      $('#successModal').modal('toggle')
      this.$router.push({ path: '/home' })
    },
    toggleFailureModal: function() {
      $('#failureModal').modal('toggle')
    },
    // user may add up to 6 emails at a time
    addInvite: function() {
      let new_invite = {
        'email': '',
        'isValid': null,
        'hasError': null,
        'error': null,
        'timer': 0
      }
      if (this.invites.length < 6) {
        this.invites.push(new_invite)
        if (this.invites.length === 6) {
          $('#addAnother').prop('disabled', true)
        }
      }
    },

    // ToDo
      // add a loading wheel to let user know input is being validated (fa gear spinner)

    validateInvite: function (index) {
      clearTimeout(this.invites[index].timer)
      var self = this
      this.invites[index].timer = setTimeout(function() {
        var invite = self.invites[index]
        let valid_email = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(invite.email)
        invite.isValid = null
        invite.hasError = null
        invite.error = null
        if (invite.email === "") {
          return
        }
        else if (valid_email) {
          // check if email is tied to an active user
          self.$http.get('emails/' + invite.email + '/').then(response => {
            console.log('Email is already taken')
            invite.isValid = false
            invite.error = 'This email is already associated with a OmniBuilds user'
          }, response => {
            console.log('Email is not being used by a user')
            // check if email is tied to a pending invite
            self.$http.get('invites/' + invite.email + '/').then(response => {
              console.log('Email is already tied to an invite')
              invite.isValid = false
              invite.error = 'This email is already associated with a pending invitation'
            }, response => {
              console.log('Email is not tied to an existing invite')
              invite.isValid = true
            })
          })
        } else {
          invite.isValid = false
          invite.error = 'Not a valid email address'
        }
      }, 1000)
    },
    submitInvites: function () {
      let vue = this
      var payload = {
        user: this.session.user_id,
        emails: []
      }
      for (let invite of this.valid_invites) {
          payload.emails.push(invite.email)
        }
      console.log(payload)

      vue.$http.post('custom_invites/', payload).then(response => {
        console.log('Invitations sent')
        console.log(response)
        this.$store.dispatch('getProfile').then(success => {
          $('#successModal').modal('show')
          $('#successModal').on('hidden.bs.modal', function (e) {
            vue.$router.push('/')
          })
        }, error => {

        })

      }, response => {
        console.log('Error sending invitations')
        console.log(response)
        for (var failed_invite in response.body.invalid_invites) {
          for (var invite in this.invites) {
            if (invite.email === failed_invite.email) {
              invite.hasError = true
              invite.error = failed_invite.error
            }
          }
        }
        for (var successful_invite in response.body.valid_invites) {
          for (var invite in this.invites) {
            if (invite.email === successful_invite.email) {
              invite.email = ''
              invite.isValid = null
              invite.hasError = null
              invite.error = null
              invite.timer = 0
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="css">
.fade-enter-active, .fade-leave-active {
  transition-property: opacity;
  transition-duration: .25s;
}

.fade-enter-active {
  transition-delay: .25s;
}

.fade-enter, .fade-leave-active {
  opacity: 0
}
</style>
