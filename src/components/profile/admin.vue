<template lang="html">
  <div class="ui grid">
    <div class="one wide column"></div>
    <div class="fourteen wide column">
      <div id='users'>
        <br>
        <div class="ui small top attached header">
          <i class="dashboard icon" aria-hidden="true"></i>
          <div class="content">
            &nbsp
            Admin Dashboard
          </div>
        </div>
        <div class="ui bottom attached segment">
          <div class="ui small statistics">
            <div class="statistic">
              <div class="value"></div>
              <div class="label"></div>
            </div>
            <div class="statistic">
              <div class="value"></div>
              <div class="label"></div>
            </div>
            <div class="statistic">
              <div class="value">{{ profiles.length }}</div>
              <div class="label">User Accounts</div>
            </div>
            <!-- <div class="statistic">
              <div class="value">{{ team_members }}</div>
              <div class="label">Team Members</div>
            </div> -->
            <div class="statistic">
              <div class="value">{{ last_24 }}</div>
              <div class="label">Active 24 Hours</div>
            </div>
            <div class="statistic">
              <div class="value">{{ last_7 }}</div>
              <div class="label">Active 7 Days</div>
            </div>

            <div class="statistic">
              <div class="value">{{ freelancers }}</div>
              <div class="label">Freelancers</div>
            </div>
            <div class="statistic">
              <div class="value">{{ invites }}</div>
              <div class="label">Invites</div>
            </div>

            <div class="statistic">
              <div class="value">{{ designs }}</div>
              <div class="label">Designs</div>
            </div>
            <div class="statistic">
              <div class="value">{{ formatBytes(data, 1) }}</div>
              <div class="label">Data</div>
            </div>

          </div>

          <table class="ui striped selectable table">
            <thead>
              <tr>
                <th></th>
                <th @click='sortBy("user")'>User</th>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Last Active</th>
                <th>Invites</th>
                <th>Designs</th>
                <th>Data</th>
                <th>Plan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for='profile in profiles'>

                <td id='profile-avatar'>
                  <img
                    v-if='profile.picture'
                    class="ui large avatar image"
                    :src='profile.picture'
                    style='max-height:30px;max-width:30px'
                  >
                  <i class="big user icon" v-else></i>
                </td>

                <td id='profile-username'>
                  <router-link :to="'/' + profile.owner.username">
                    {{ profile.owner.username }}
                  </router-link>

                </td>

                <td id='profile-full-name'>
                  {{ profile.owner.first_name }}
                </td>

                <td id='profile-email'>
                  <a :href="'mailto:' + profile.owner.email">
                    {{ profile.owner.email }}
                  </a>
                </td>

                <td id='project-joined'>
                  {{ profile.owner.date_joined | moment("from", "now") }}
                </td>

                <td id='profile-last-active'>
                  <span v-if='profile.owner.last_login'>
                    {{ profile.owner.last_login | moment("from", "now") }}
                  </span>
                  <span v-else>
                    Never
                  </span>
                </td>

                <td id='profile-invites'>
                  {{ profile.owner.invitation_set.length }}
                </td>

                <td id='profile-designs'>
                  {{ profile.design_count }}
                </td>

                <td id='project-data'>
                  {{ formatBytes(profile.data, 1) }}
                </td>

                <td id='project-plan'>
                  <span v-if='profile.plan'>
                    {{ profile.plan.name }}
                  </span>
                  <span v-else>
                    Starter
                  </span>
                </td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="one wide column"></div>
  </div>


</template>

<script>
import { mapGetters } from 'vuex'
var moment = require('moment')
export default {
  name: 'admin',
  data() {
    return {
      profiles: [],
      designs: 0,
      data: 0,
      freelancers: 0,
      team_members: 0,
      last_24: 0,
      last_7: 0,
      invites: 0,
      reverseSort: false,
      sortKey: 'user',
    }
  },
  computed: {
    ...mapGetters([
      'env',
      'session',
    ]),
  },
  watch: {},
  methods: {
    formatBytes(bytes,decimals) {
       if(bytes == 0) return '0 Bytes'
       var k = 1000
       var dm = decimals + 1 || 3
       var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
       var i = Math.floor(Math.log(bytes) / Math.log(k))
       return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    },
    getProfiles() {
      this.$http.get('auth-profiles').then(success => {
        if (this.env != 'prod') {
          console.log('Got profiles')
          console.log(success)
        }
        this.profiles = success.body.results
        this.getStats()
      }, error => {
        if (this.env != 'prod') {
          console.log('Error getting profiles')
          console.log(error)
        }
      })
    },
    getStats() {
      let index = 0
      let test_users = ['AnonymousUser', 'jwagstaff']
      for (let profile of this.profiles) {
        if (test_users.includes(profile.name)) {
          console.log('found a test user')
          console.log(profile.name)
          this.profiles.splice(index, 1)
        } else {
          this.designs += profile.design_count
          this.data += profile.data
          this.invites += profile.owner.invitation_set.length
          if (profile.plan) {
            if (profile.plan.name == 'Freelancer') {
              this.freelancers += 1
            }
          }
          // convert time
          let ref = moment()
          let yesterday = ref.clone().subtract(1, 'days').startOf('day')
          let last_week = ref.clone().subtract(7, 'days').startOf('day')
          if (moment(profile.owner.last_login).isAfter(yesterday)) {
            this.last_24 += 1
          } else if (moment(profile.owner.last_login).isAfter(last_week)) {
            this.last_7 += 1
          }
        }
        index ++
      }
    },
    sortBy(sortKey) {
      this.reverseSort = (this.sortKey === sortKey) ? !this.reverseSort : false
      this.sortKey = sortKey

    },
    getDesigns() {
      this.$http.get('designs').then(success => {
        if (this.env != 'prod') {
          console.log('Got designs')
          console.log(success)
        }
        this.designs = success.body.results
      }, error => {
        if (this.env != 'prod') {
          console.log('Error getting designs')
          console.log(error)
        }
      })
    }
  },
  created() {
    this.getProfiles()
  },
  mounted() {},
  updated() {}
}
</script>

<style lang="css">
</style>
