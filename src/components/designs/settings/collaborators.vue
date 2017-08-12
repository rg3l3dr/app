<template lang="html">
  <div>

    <!-- Current Collaborators == 0 -->
    <span v-if='design.collaborators.length == 0 && !showCollaborators'>
      <div class='ui small top attached header'>
        <i class="users icon" aria-hidden="true"></i>
        <div class="content">
          &nbsp
          Current Collaborators
        </div>
      </div>
      <div class="ui bottom attached clearing segment">
        <div style='text-align:center'>
          <br>
          <h2 class="ui icon header" >
            <i class="users icon"></i>
            <br>
            <div class="content">
              <button class="ui large blue basic button" @click='showCollaborators = true'>
                Click here to add collaborators
              </button>
              <div class="sub header">
                <br>
                <a href="http://help.omnibuilds.com#builds" style='font-size: 16px'>
                  What are collaborators?
                </a>
                <br>
              </div>
            </div>
          </h2>
        </div>
      </div>
    </span>

    <!-- Current Collaborators > 0 -->
    <span v-if='design.collaborators.length > 0'>
      <div class='ui small top attached header'>
        <i class="users icon" aria-hidden="true"></i>
        <div class="content">
          &nbsp
          Current Collaborators
        </div>
      </div>
      <div class="ui bottom attached clearing segment">
        <div class="ui relaxed middle aligned divided list">
          <div class="item" v-for='(collaborator, index) in design.collaborators'>
            <div class="right floated content" style='padding-left:50px'>
              <div
                class="ui red basic button"
                @click='removeCollaborator(index)'
              >
                Remove
              </div>
            </div>
            <div class="ui right floated selection dropdown" :id='`collab-${index}`'>
              <input type="hidden" name="gender">
              <i class="dropdown icon"></i>
              <div class="default text">Permissions</div>
              <div class="menu">
                <div class="item" data-value="0">Can view design</div>
                <div class="item" data-value="1">Can edit design</div>
                <div class="item" data-value="2">Is a design admin</div>
              </div>
            </div>
            <img
              v-if='collaborator.picture'
              class="ui large avatar image"
              :src='collaborator.picture'
              style='max-height:30px;max-width:30px'
            >
            <i class="big user icon" v-else></i>
            <div class="content">
              <router-link tag='a' :to='`/${collaborator.slug}`'>
                <a href="" class="header"> {{ collaborator.owner.first_name }} </a>
              </router-link>
              <div class="description"> {{ collaborator.name }} </div>
            </div>
          </div>
        </div>
      </div>
      <br>
    </span>

    <!-- Add Internal Collaborators -->
    <span v-if='design.collaborators.length > 0 || showCollaborators '>
      <div class='ui small top attached header' >
        <i class="plus square outline icon" aria-hidden="true"></i>
        <div class="content">
          &nbsp
          Add Collaborators
        </div>
      </div>
      <div class="ui bottom attached clearing segment">
        <div class="ui left icon input" :class="{'error' : invite.isValid == false}">
          <i class="user icon"></i>
          <input
            type="email"
            placeholder='Find or invite a collaborator by email address'
            size='50'
            v-model='invite.email'
            @keydown='validateInvite()'
            @keydown.enter='forceInvite()'
          >
        </div>
        &nbsp&nbsp
        <button
          class="ui green basic button"
          :disabled='!invite.isValid'
          @click='invite.isUser ? addCollaborator() : sendInvite()'
        >
          Invite Collaborator
        </button>
        <span
          v-if='invite.isValid'
          class="help-block"
        >
          <br>
          &nbsp
          {{ invite.message }}
        </span>
        <span
          v-else-if='!invite.isValid && invite.hasMessage'
          class="help-block"
        >
          <br>
          &nbsp
          {{ invite.message }}
        </span>
      </div>
    </span>


    <!-- Add External Collaborators -->
    <!-- <div class='ui small top attached header'>
      <i class="share icon" aria-hidden="true"></i>
      <div class="content">
        &nbsp
        Share a Private Link
      </div>
    </div>
    <div class="ui bottom attached clearing segment">
      <div class="content">
        Share a private link with an external collaborator.  They may access a read only copy of this design without a user account.
      </div>
      <br>
      <div class="ui left icon input">
        <i class="mail icon"></i>
        <input
          type="email"
          placeholder='Enter an email address'
          size='50'
          v-model='linkEmail'
        >
      </div>
      &nbsp&nbsp
      <button
        class="ui green basic button"
        @click='sendPrivateLink'
      >
        Send Link
      </button>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Collaborators',
  data () {
    return {
      invite: {
        email: null,
        isValid: null,
        isUser: null,
        hasMessage: null,
        message: null,
        timer: 0
      },
      invitee: null,
      linkEmail: null,
      showCollaborators: false,
    }
  },
  computed: {
    ...mapGetters([
      'env',
      'session',
      'profile',
      'design'
    ]),
    collaborators() {
      return this.design.collaborators.map(collaborator => {return collaborator.id})
    }
  },
  methods: {
    validateInvite() {
      return new Promise((resolve, reject) => {
        clearTimeout(this.invite.timer)
        var self = this
        this.invite.timer = setTimeout(function() {
          var invite = self.invite
          let valid_email = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(invite.email)
          invite.isValid = null
          invite.hasMessage = null
          invite.message = null
          if (!invite.email) {
            return
            if (self.env != 'prod') {
              console.log('No email has been input')
            }
          } else if (valid_email) {
            // check if email is tied to an active user
            self.$http.get('emails/' + invite.email + '/').then(success => {
              self.invitee = success.body
              if (self.env != 'prod') {console.log(success)}
              if (self.invitee.id == self.profile.id) {
                if (self.env != 'prod') {console.log('User tried to add themselves as a collaborator')}
                self.invite.isValid = false
                self.invite.hasMessage = true
                self.invite.message = `You cannot add yourself as a collaborator to your own project...`
                // change input class to error
              } else if (self.collaborators.includes(self.invitee.id)) {
                if (self.env != 'prod') {console.log('Email belongs to an existing user')}
                self.invite.isValid = false
                self.invite.hasMessage = true
                self.invite.message = `This user is already a collaborator for this project`
              } else {
                if (this.env != 'prod') {console.log('Email belongs to an existing user')}
                self.invite.isUser = true
                self.invite.isValid = true
                self.invite.hasMessage = true
                self.invite.message = `This email belongs to user ${self.invitee.username}.  Click invite to add them to this project.`
                resolve()
              }
            }, error => {
              if (self.env != 'prod') {console.log('Email does not belong to an existing user')}
              self.invite.isUser = false
              self.invite.isValid = true
              self.invite.hasMessage = true
              self.invite.message = 'This email does not belong to a current user, click invite to send them an invitation email.'
              // check if email is tied to a pending invite?
            })
          } else {
            self.invite.isValid = false
            self.invite.hasMessage = true
            self.invite.message = 'Not a valid email address'
          }
        }, 1000)
      })
    },
    addCollaborator() {
      this.collaborators.push(this.invitee.id)
      if (this.env == 'prod') {
        console.log('Add collaborator clicked')
        console.log(newCollaborators)
      }

      let payload = { collaborators: this.collaborators }

      this.$store.dispatch('updateDesign', payload).then(success => {
        if (this.env == 'prod') {
          console.log('Added new collaborator to design')
        }
        // clear out the new inivitee
        this.invite = {
          email: null,
          isValid: null,
          isUser: null,
          hasMessage: null,
          message: null,
          timer: 0
        }
        this.invitee = null

        // activate the dropdown
        $('.ui.dropdown.right.floated').dropdown({ 'silent': true })
        // set the dropdown with the correct permission
        let index = this.collaborators.length - 1
        $(`#collab-${index}`).dropdown('set text', 'Can edit design')
        $(`#collab-${index}`).dropdown('set selected', 1)

        // update the user profile with the new permisssions

      }, error => {})
    },
    sendInvite() {
      let payload = {
        user: this.session.user_id,
        emails: [ this.invite.email ]
      }
        // invite the collaborator to OB and this project via email
      this.$http.post('custom_invites/', payload).then(response => {
        if (this.env != 'prod') {
          console.log('Invitations sent')
          console.log(response)
        }
        this.invite = {
          email: null,
          isValid: null,
          isUser: null,
          hasMessage: null,
          message: null,
          timer: 0
        }
      }, response => {
        if (this.env != 'prod') {
          console.log('Error sending invitations')
          console.log(response)
        }
      })
    },
    forceInvite() {
      this.validateInvite().then(success => {
        this.invite.isUser ? this.addCollaborator() : this.sendInvite()
      }, error => {})
    },
    updatePermissions(index) {
      // update the user profile with the correct permissions

    },
    removeCollaborator(index) {
      this.collaborators.splice(index, 1)
      let payload = { collaborators: this.collaborators }
      this.$store.dispatch('updateDesign', payload).then(success => {
        if (this.env != 'prod') {
          console.log('Removed collaborator from design')
        }
      }, error => {})
    },
    sendPrivateLink() {
      // get the current path
      // send to custom api method endpoint
        // send an email with the link
    },
  },
  created: function() {

    // on page refresh the dom is mounted before the design context is fetched

  },
  mounted: function() {
    $('.ui.dropdown.right.floated').dropdown({ 'silent': true })
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
