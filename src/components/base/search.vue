<template lang="html">
  <div>
    <div class='ui grid'>
      <div class="one wide column"></div>
      <div class="fourteen wide column">
        <div class="row">
          <div class="eight wide column">
            Your search for {{ query }} returned {{ results.length }} results
          </div>
        </div>
        <div class="row">
          <div class="twelve wide column">
            <div class="ui relaxed divided list">
              <br>
              <div class="item" v-for='(result, index) in results'>
                <i class="big folder open middle aligned icon"></i>
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
    }
  },
  computed: {
    ...mapState([
      'env',
      'session',
      'profile',
      'query'
    ])
  },
  watch: {
    query() {
      this.getResults()
    }
  },
  methods: {
    getResults: function() {
      this.$http.get('designquery/?q=' + this.query).then(success => {
        if (this.env != 'prod') {
          console.log('Got query results')
          console.log(success)
        }
        this.results = success.body.results
      }, error => {
        if (this.env != 'prod') {
          console.log('Error getting query results')
          console.log(error)
        }
      })
    },
    viewResult: function(index) {
      let result = this.results[index]
      let path = '/' + result.creator + '/' + result.slug 
      this.$router.push(path)
    }
  },
  created: function() {
    this.getResults()

  }
}
</script>

<style lang="css">
</style>
