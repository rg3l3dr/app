<template lang="html">
  <div id='projects'>
    <div class="ui small top attached header">
      <i class="fa fa-folder-open-o text-primary" aria-hidden="true"></i>
      <div class="content">
        &nbsp
        My Designs
      </div>
    </div>
    <div class="ui bottom attached segment">
      <table class="ui striped selectable table">
        <thead>
          <td>Design Name</td>
          <td>Last Updated</td>
          <td>Parts</td>
          <td>Files</td>
          <td>Revs</td>
          <td>Data</td>
        </thead>
        <tbody>
          <tr v-for='design in designs'>
            <td id='project-name'>
              {{ design.name }}
            </td>

            <td id='project-last-updated'>
              {{ design.edited_at | moment("from", "now") }}
            </td>

            <td id='project-parts'>
              NA
            </td>

            <td id='project-files'>
              NA
            </td>

            <td id='project-revs'>
              {{ design.revisions.length }}
            </td>

            <td id='project-data'>
              {{ formatBytes(design.storage + 100000, 1) }}
            </td>

          </tr>
        </tbody>
      </table>
    </div>
  </div>

</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'designs',
  data() {
    return {
      designs: [],
    }
  },
  computed: {
    ...mapState([
      'env',
      'session',
      'profile'
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
    getDesigns() {
      this.$http.get('designs/').then(success => {
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
    this.getDesigns()
  },
  mounted() {},
  updated() {}
}
</script>

<style lang="css">
</style>
