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
              <router-link :to='`/${profile.slug}/${design.slug}/latest/home`' tag='a'>
                {{ design.name }}
              </router-link>
            </td>

            <td id='project-last-updated'>
              {{ design.edited_at | moment("from", "now") }}
            </td>

            <td id='project-parts'>
              {{ design.parts }}
            </td>

            <td id='project-files'>
              {{ design.files }}
            </td>

            <td id='project-revs'>
              {{ design.revs }}
            </td>

            <td id='project-data'>
              {{ formatBytes(design.storage + 100000, 1) }}
            </td>

          </tr>
        </tbody>
      </table>
      <div class="ui pagination menu" v-if='pages.length > 1'>
        <a
          class="item"
          :class='{disabled: !previous}'
          @click='selectPage(pageIndex - 1)'
        >
          Previous
        </a>
        <a
          class="item"
          v-for='page in pages'
          :class='{active: page === pageIndex}'
          @click='selectPage(page)'
        >
          {{ page }}
        </a>
      <!--   <a class="disabled item" v-else>
        ...
      </a> -->
        <a
          class="item"
          :class='{disabled: !next}'
          @click='selectPage(pageIndex + 1)'
        >
          Next
        </a>
      </div>
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
      pages: [],
      previous: null,
      next: null,
      pageIndex: null,
      pageRange: null,
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
    getDesigns(page) {
      this.$http.get('designs/?page=' + page).then(success => {
        if (this.env != 'prod') {
          console.log('Got designs')
          console.log(success)
        }
        this.designs = success.body.results

        this.previous = success.body.previous
        this.next = success.body.next
        if (this.pages.length == 0) {
          this.pages = []
          this.pageIndex = 1
          let count = Math.ceil(success.body.count / 25)
          for (let i = 1; i <= count; i++) {
            this.pages.push(i)
          }
          this.pageRange = 10
        }
      }, error => {
        if (this.env != 'prod') {
          console.log('Error getting designs')
          console.log(error)
        }
      })
    },
    selectPage(index) {
      this.getDesigns(index)
      this.pageIndex = index
    },
  },
  created() {
    this.getDesigns(1)
  },
  mounted() {},
  updated() {}
}
</script>

<style lang="css">
</style>
