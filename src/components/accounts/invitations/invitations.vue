<template lang="html">
  <div class='ui grid'>
    <div class="one wide column"></div>
    <div class="fourteen wide column">
      <div class="ui grid">
        <div class='row' style='margin: 20px 0px 0px 0px'>
      		<div class="four wide grid">
      			<div class='ui small top attached header'>
    					<i class="fa fa-paper-plane-o omni" aria-hidden="true"></i>
              <div class="content">
                &nbsp
      					Invitations
              </div>
    				</div>
            <div class="ui bottom attached clearing segment">
              <div class="ui secondary vertical menu">
                <router-link class="item" tag='a' to='/accounts/invitations/send'>
                  <a>
                    <i class="fa fa-envelope"></i>
                    &nbsp; Send Invitations
                  </a>
                </router-link>
                <router-link class="item" tag='a' to='/accounts/invitations/pending'>
                  <a>
                    <i class="fa fa-ellipsis-h"></i>
                    &nbsp; Pending Invitations
                    <span v-if='pending_invites.length > 0'>
                      <div class='ui circular label'>
                        {{ pending_invites.length }}
                      </div>
                    </span>
                  </a>
                </router-link>
                <router-link class="item" tag='a' to='/accounts/invitations/accepted'>
                  <a>
                    <i class="fa fa-check"></i>
                    &nbsp; Accepted Invitations
                    <span v-if='accepted_invites.length > 0'>
                      <div class='ui circular label'>
                        {{ accepted_invites.length }}
                      </div>
                    </span>
                  </a>
                </router-link>
              </div>
            </div>
      		</div><!-- /.col-xs-3 -->
      		<div class="twelve wide column">
            <div class="tab-content">
              <transition name='fade'>
                <router-view name='inviteContent'></router-view>
              </transition>
            </div>
      		</div><!-- /.col-xs-9 -->
      	</div>
      </div>
    </div>
    <div class="one wide column"></div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  created: function() { },
  computed: {
    ...mapState([
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
