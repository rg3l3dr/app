<template lang="html">
  <div id='accepted'>
    <div class='ui small top attached header'>
      <i class="fa fa-check text-primary" aria-hidden="true"></i>
      <div class="content">
        &nbsp
        Accepted Invitations
      </div>
    </div>
      <div class="ui bottom attached segment">
        <span v-if='accepted_invites.length > 0'>
          <table class='ui table'>
          <thead>
            <tr>
              <th>Email</th>
              <th>Invited On</th>
              <th>Accepted On</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for='invite in accepted_invites'>
              <td>{{ invite.email }}</td>
              <td>{{ invite.sent | moment("MMMM Do YYYY")}}</td>
              <td>{{ invite.created | moment("MMMM Do YYYY") }}</td>
              <td>
                <span v-if='invite.accepted'>
                  Yes
                </span>
                <span v-else>
                  No
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        </span>
        <span v-else>
          <p> You do not have any accepted invitations yet.  Invite more friends!</p>
        </span>
      </div>
    </div>
  </div>/.tab-pane fade in
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  created: function() {
    this.$store.commit('getProfile')
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
	}
}
</script>

<style lang="css">
</style>
