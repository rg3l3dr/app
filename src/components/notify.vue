<template lang="html">
  <div class='container'>
	  <div class='row'>
				<div class="col-xs-3">
			<div class='panel panel-default'>
				<div class="panel-heading">
					<i class="fa fa-bell text-primary" aria-hidden="true"></i>
					&nbsp
					Notifications
				</div>
				<div class="panel-body">
					<ul class="nav nav-pills nav-stacked">
						<li class='active'><a href="#unread" data-toggle="pill"><i class="fa fa-envelope"></i> &nbsp; New Notifications
              <span v-if='unread_notifications.length > 0' class='badge'>
                {{ unread_notifications.length }}
              </span>
            </a></li><!-- /.active -->
						<li><a href="#read" data-toggle="pill"><i class="fa fa-bars"></i> &nbsp; Old Notifications
              <span v-if='read_notifications.length > 0' class='badge'>
                {{ read_notifications.length }}
              </span>
            </a></li>
					</ul><!-- /.nav nav-pills nav-stacked -->
				</div>
			</div>
		</div><!-- /.col-xs-3 -->
		<div class="col-xs-9">
			<div class="tab-content">
				<div class="tab-pane fade in active" id='unread'>
					<div class='panel panel-default'>
						<div class="panel-heading">
							<i class="fa fa-envelope text-primary" aria-hidden="true"></i>
							&nbsp
							New Notifications
						</div>
						<div class="panel-body">
              <span v-if='unread_notifications.length > 0'>
                <table class='table'>
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
					</div>
				</div><!-- /.tab-pane fade in active -->
				<div class="tab-pane fade in " id='read'>
					<div class='panel panel-default'>
						<div class="panel-heading">
							<i class="fa fa-bars text-primary" aria-hidden="true"></i>
							&nbsp
							Old Notifications
						</div>
						<div class="panel-body">
              <span v-if='read_notifications.length > 0'>
                <table class='table'>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for='notification in read_notifications'>
                    <td>{{ notification.timestamp | moment("MMMM Do YYYY h:mm a")  }}</td>
                    <td>{{ notification.verb }}</td>
                    <td>{{ notification.description }}</td>
                  </tr>
                </tbody>
              </table>
              </span>
              <span v-else>
                <p>You do not have any old notifications at this time.</p>
              </span>
						</div>
					</div>
				</div><!-- /.tab-pane fade in  -->
			</div><!-- /.tab-content -->
		</div><!-- /.col-xs-9 -->
	</div>
</div>

</template>

<script>

// create new notifications for specific events
  // billing action (new subscription, invoice, or card declined)


export default {
  created: function() {
    this.$store.commit('getProfile')
  },
  data() {
    return {
      notifications: []
    }
  },
  computed: {
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
        console.log('Got notifications')
        console.log(response)
        this.notifications = response.body.results
        console.log('reading notifications')
        var new_notifications = this.notifications.filter(function (notification) {
          return notification.unread === true
        })
        console.log(new_notifications)
        for (var notification of new_notifications) {
          console.log(notification)
          let payload = { unread: false}
          this.$http.patch('notifications/' + notification.id + '/', payload).then(response => {
            console.log('Updated notificaiton to read')
            console.log(response)
          }, response => {
            console.log('Error updating notifications')
            console.log(response)
          })
        }
      }, response => {
        console.log('Error getting notifications')
        console.log(response)
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
