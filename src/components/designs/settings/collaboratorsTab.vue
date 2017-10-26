<template lang="html">
  <div v-if='design.collaborators'>

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

            <img
              v-if='collaborator.picture'
              class="ui large avatar image"
              :src='collaborator.picture'
              style='max-height:30px;max-width:30px'
            >
            <i class="big user icon" v-else></i>
            <div class="content">
              <router-link tag='a' :to='`/${collaborator.slug}`'>
                <a href="" class="header" v-if='collaborator.owner.first_name'> {{ collaborator.owner.first_name }} </a>
                <a href="" class="header" v-else> {{ collaborator.owner.email }} </a>
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
import { mapState } from 'vuex'
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
      isActive: false,
    }
  },
  computed: {
    ...mapState([
      'env',
      'session',
      'profile',
      'design',
      'node'

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
            let payload = {email: invite.email}
            self.$http.post('check_email/', payload).then(success => {
              if (success.body.active) {
                // this is a current user, get their profile info
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
                  if (self.env != 'prod') {
                    console.log('Error getting email for existing user')
                    console.log(error)
                  }
                })
              } else {
                // this is not a current user, they will have to be invited
                if (self.env != 'prod') {console.log('Email does not belong to an existing user')}
                self.invite.isUser = false
                self.invite.isValid = true
                self.invite.hasMessage = true
                self.invite.message = 'This email does not belong to a current user, click invite to send them an invitation email.'
                // check if email is tied to a pending invite?
              }
            }, error => {
              if (self.env != 'prod') {
                console.log('Error checking email for collaborator')
                console.log(error)
              }
            })
          } else {
            self.invite.isValid = false
            self.invite.hasMessage = true
            self.invite.message = 'Not a valid email address'
          }
        }, 1000)
      })
    },
    updatePerms(payload) {
      return new Promise((resolve, reject) => {
        this.$http.post('update_perms/', payload).then(success => {
          if (this.env != 'prod') {
            console.log('successfully updated perms')
            console.log(success)
          }
          resolve()
        }, error => {
          if (this.env != 'prod') {
            console.log('error updating perms')
            console.log(error)
          }
          reject()
        })
      })
    },
    shareParts(design_id, part_ids) {
      return new Promise ((resolve, reject) => {
        let payload = {
          design_id: design_id,
          part_ids: part_ids
        }
        this.$http.post('share_parts/', payload).then(success => {
          if (this.env != 'prod') {
            console.log('Shared parts with collaborators')
            console.log(success)
            resolve()
          }
        }, error => {
          if (this.env != 'prod') {
            console.log('Error sharing parts with collaborators')
            console.log(error)
            reject()
          }
        })
      })
    },
    unshareParts(design_id, profile_id) {
      return new Promise ((resolve, reject) => {
        let payload = {
          design_id: design_id,
          profile_id: profile_id
        }
        this.$http.post('unshare_parts/', payload).then(success => {
          if (this.env != 'prod') {
            console.log('Unshared parts with collaborators')
            console.log(success)
            resolve()
          }
        }, error => {
          if (this.env != 'prod') {
            console.log('Error unsharing parts with collaborators')
            console.log(error)
            reject()
          }
        })
      })
    },
    addCollaborator: async function() {
      this.collaborators.push(this.invitee.id)
      if (this.env != 'prod') {
        console.log('Add collaborator clicked')
      }

      let perms_payload = {
        user_id: this.invitee.id,
        design_id: this.design.id,
        action: 'add',
        perm: 'edit'
      }

      // await this.updatePerms(perms_payload)

      let payload = {
        slug: this.design.slug,
        owner_slug: this.design.owner_slug,
        data: {
          collaborators: this.collaborators
        }
      }

      if (this.env != 'prod') {
        console.log(payload)
      }

      this.$store.dispatch('updateDesign', payload).then(success => {
        if (this.env != 'prod') {
          console.log('Added new collaborator to design')
        }
        let design_payload = {
          design_slug: this.design.slug,
          owner_slug: this.design.owner_slug,
          revision_slug: 'latest'
        }
        this.$store.dispatch('getDesign', design_payload).then(success => {
          this.$store.commit('setDesign', success.body)
        }, error => {})

        // have to get the ids for all the top leve parts
        let part_ids = this.node.parts.map(part => {return part.design_id})
        this.shareParts(this.design.id, part_ids)
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

      // this will send an invite but we still have to add the user to the project ...
      // this can only be done once they create an account, meaning it would have to be a hook inside create or update user profile

      let payload = {
        design_id: this.design.id,
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
    removeCollaborator(index) {
      let collaborator_id = this.collaborators[index]
      this.collaborators.splice(index, 1)
      let payload = {
        slug: this.design.slug,
        owner_slug: this.design.owner_slug,
        data: {
          collaborators: this.collaborators
        }
      }
      this.$store.dispatch('updateDesign', payload).then(success => {
        if (this.env != 'prod') {
          console.log('Removed collaborator from design')
          console.log('Collaborator ID is ' + collaborator_id)
        }

        let design_payload = {
          design_slug: this.design.slug,
          owner_slug: this.design.owner_slug,
          revision_slug: 'latest'
        }
        this.$store.dispatch('getDesign', design_payload).then(success => {
          this.$store.commit('setDesign', success.body)
        }, error => {})


        this.unshareParts(this.design.id, collaborator_id)
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
