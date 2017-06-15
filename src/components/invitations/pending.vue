<template lang="html">
  <div id='pending'>
    <div class='ui small top attached header'>
      <i class="fa fa-ellipsis-h text-primary" aria-hidden="true"></i>
      <div class="content">
        &nbsp
        Pending Invitations
      </div>
    </div>
    <div class="ui bottom attached segment">
        <span v-if='pending_invites.length > 0'>
          <table class='ui table'>
          <thead>
            <tr>
              <th>Email</th>
              <th>Invited On</th>
              <th>Expired</th>
              <th>Resend</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for='invite in pending_invites'>
              <td>{{ invite.email }}</td>
              <td>{{ invite.created | moment("MMMM Do YYYY") }}</td>
              <span v-if='invite.expired'>
                <td>Yes</td>
                <td><a href='#'>Resend</a></td>
              </span>
              <span v-else>
                <td>No</td>
                <td></td>
              </span>
            </tr>
          </tbody>
        </table>
        </span>
        <span v-else>
          <p>You do not have any pending invitations yet.  Invite more friends!</p>
        </span>
      </div>
    </div>
  </div>

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
	}
}
</script>

<style lang="css">
</style>
