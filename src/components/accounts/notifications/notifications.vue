<template lang="html">
  <div class='ui grid'>
	  <div class='row' style='margin: 20px 0px 0px 0px'>
			<div class="four wide column">
			  <div class='ui small top attached header'>
				<i class="fa fa-bell text-primary" aria-hidden="true"></i>
        <div class="content">
          &nbsp
					Notifications
        </div>
			</div>
			  <div class="ui bottom attached clearing segment">
					<div class="ui secondary vertical menu">
            <router-link class="item" tag='a' to='/accounts/notifications/unread'>
              <a>
                <i class="fa fa-envelope"></i> &nbsp; New Notifications
                <div v-if='unread_notifications.length > 0' class='ui circular label'>
                  {{ unread_notifications.length }}
                </div>
              </a>
            </router-link>
            <router-link class="item" tag='a' to='/accounts/notifications/read'>
              <a>
                <i class="fa fa-bars"></i> &nbsp; Old Notifications
                <div v-if='read_notifications.length > 0' class='ui circular label'>
                  {{ read_notifications.length }}
                </div>
              </a>
            </router-link>
					</div><!-- /.nav nav-pills nav-stacked -->
				</div>
			</div>
      <div class="twelve wide column">
  			<div class="tab-content">
          <transition name='fade'>
            <router-view name='notifyContent'></router-view>
          </transition>
  			</div><!-- /.tab-content -->
  		</div><!-- /.col-xs-9 -->
    </div>
	</div>
</template>

<script>

// create new notifications for specific events
// billing action (new subscription, invoice, or card declined)

import { mapState } from 'vuex'
export default {
  created: function() {
    this.getNotifications()
  },
  watch: {
    $route() {
      this.getNotifications()
    }
  },
  data() {
    return {
      notifications: []
    }
  },
  computed: {
    ...mapState([
      'env',
      'session',
      'profile',
    ]),
    unread_notifications: function() {
      return this.notifications.filter(function (notification) {
        return notification.unread === true
      })
    },
    read_notifications: function() {
      return this.notifications.filter(function (notification) {
        return notification.unread === false
      })
    },
  },
  methods: {
    getNotifications() {
      this.$http.get('notifications/').then(response => {
        if (this.env != 'prod') {
          console.log('Got notifications')
          console.log(response)
        }
        this.notifications = response.body.results
        var new_notifications = this.notifications.filter(function (notification) {
          return notification.unread === true
        })
        for (var notification of new_notifications) {
          let payload = { unread: false}
          this.$http.patch('notifications/' + notification.id + '/', payload).then(response => {
            if (this.env != 'prod') {
              console.log('Updated notificaiton to read')
              console.log(response)
            }
          }, response => {
            if (this.env != 'prod') {
              console.log('Error updating notifications')
              console.log(response)
            }
          })
        }
      }, response => {
        if (this.env != 'prod') {
          console.log('Error getting notifications')
          console.log(response)
        }
      })
    }
  },
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
