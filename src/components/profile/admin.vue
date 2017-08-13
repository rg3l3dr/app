<template lang="html">
  <div id='users'>
    <div class="ui small top attached header">
      <i class="dashboard icon" aria-hidden="true"></i>
      <div class="content">
        &nbsp
        Admin Dashboard
      </div>
    </div>
    <div class="ui bottom attached segment">
      <table class="ui striped selectable table">
        <thead>
          <td @click='sortBy("user")'>User</td>
          <td>Name</td>
          <td>Email</td>
          <td>Joined</td>
          <td>Last Active</td>
          <td>Invites</td>
          <td>Designs</td>
          <td>Data</td>
          <td>Plan</td>
        </thead>
        <tbody>
          <tr v-for='profile in profiles' v-if='profile.owner.username != "AnonymousUser"'>

            <td id='profile-username'>
              <img
                v-if='profile.picture'
                class="ui large avatar image"
                :src='profile.picture'
                style='max-height:30px;max-width:30px'
              >
              <i class="big user icon" v-else></i>
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

</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'admin',
  data() {
    return {
      profiles: [],
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
      }, error => {
        if (this.env != 'prod') {
          console.log('Error getting profiles')
          console.log(error)
        }
      })
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
