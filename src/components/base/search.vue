<template lang="html">
  <div>
    <div class='ui grid'>
      <div class="one wide column"></div>
      <div class="fourteen wide column">
        <div class="row">
          <div class="eight wide column">
            Your search for {{ query.query }} returned {{ results.length }} results
          </div>
        </div>
        <div class="row">
          <div class="twelve wide column">
            <div class="ui relaxed divided list">
              <br>
              <div class="item" v-for='(result, index) in results'>
                <i class="big folder open middle aligned icon" v-if='result.design_type == "project"'></i>
                <i class="big cubes open middle aligned icon" v-else-if='result.design_type == "assembly"'></i>
                <i class="big cube open middle aligned icon" v-else></i>
                <div class="content">
                  <a class='header' @click='viewResult(index)'>
                    <h3>
                      {{ result.name }}
                    </h3>

                  </a>
                  <div class="description" >
                    <h4>
                      {{ result.number }}
                    </h4>

                  </div>
                </div>
              </div>
            </div>
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
      </div>
      <div class="one wide column"></div>

    </div>
  </div>

</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'search',
  data () {
    return {
      results: [],
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
      'profile',
      'query',
    ])
  },
  watch: {
    query() {
      this.getResults(1, true)
    }
  },
  methods: {
    getResults(page, newQuery) {
      this.$http.get(`designquery/?q=${this.query.query}&clones=${this.query.clones}&imports=${this.query.imports}&page=${page}`).then(success => {
        if (this.env != 'prod') {
          console.log('Got query results')
          console.log(success)
        }
        this.results = success.body.results

        this.previous = success.body.previous
        this.next = success.body.next
        if (this.pages.length == 0 || newQuery) {
          this.pages = []
          this.pageIndex = 1
          let count = Math.ceil(success.body.count / 10)
          for (let i = 1; i <= count; i++) {
            this.pages.push(i)
          }
          this.pageRange = 10
        }

      }, error => {
        if (this.env != 'prod') {
          console.log('Error getting query results')
          console.log(error)
        }
      })
    },
    selectPage(index) {
      this.getResults(index, false)
      this.pageIndex = index
    },
    viewResult: function(index) {
      let result = this.results[index]
      let path = '/' + result.creator + '/' + result.slug
      this.$router.push(path)
    }
  },
  created: function() {
    this.getResults(1, true)
  }
}
</script>

<style lang="css">
</style>
