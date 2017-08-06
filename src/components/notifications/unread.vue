<template lang="html">
  <div id='unread'>
    <div class='ui small top attached header'>
      <i class="fa fa-envelope text-primary" aria-hidden="true"></i>
      <div class="content">
        &nbsp
        New Notifications
      </div>
    </div>
    <div class="ui bottom attached segment">
        <span v-if='unread_notifications.length > 0'>
          <table class='ui table'>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for='notification in unread_notifications'>
              <td>{{ notification.timestamp | moment("MMMM Do YYYY, h:mm a")  }}</td>
              <td>{{ notification.verb }}</td>
              <td>{{ notification.description }}</td>
            </tr>
          </tbody>
        </table>
        </span>
        <span v-else>
          <p>You do not have any new notifications at this time.</p>
        </span>
      </div>
  </div><!-- /.tab-pane fade in active -->
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      notifications: []
    }
  },
  computed: {
    ...mapGetters([
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
  created: function () {
    this.getNotifications()
  }
}
</script>

<style lang="css">
</style>
