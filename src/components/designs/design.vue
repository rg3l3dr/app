<template lang="html">
  <div class="design">
    <div class="ui horizontal middle aligned list">
      <div class="item">
        <i class="fa fa-lock fa-2x"></i>
      </div>
      <div class="item">
        <!-- <img src="images/Rebel_Alliance_logo.png" class="ui circular tiny image"> -->
        <div class="content">
          <div class="ui header large">
            <router-link tag='a' to='/home'>
              {{ profile.name }}
            </router-link>
             / {{ design.name }}
          </div>
            <!-- Created on May 6th 2017<br>
            Licensed as
            <a href="#">CC-BY-SA</a> -->
        </div>
      </div>
      <div class="item">
        &nbsp
        &nbsp
      </div>
      <div class="item">
        <div class="ui selection dropdown" id='configs'>
          <i class='fork icon'></i>
          <input type="hidden" name="config">
          <div class="default text"></div>
          <i class="dropdown icon"></i>
          <div class="menu">
            <div
              class="item"
              v-for='config in design.config_set'
              :data-value='config.slug'
              @click='selectConfig(config)'
            >
              {{ config.name }}
            </div>
            <div class="divider"></div>
            <div
              v-if='new_config.hasError'
              class="header"
              style='color: red'
            >
              {{new_config.error}}
            </div>
            <div  v-else class="header">
              Create a new Config
            </div>
            <div
              class="ui input"
              :class="{'error': new_config.hasError}"
            >
              <input
                type="text"
                placeholder='Choose a name...'
                v-model='new_config.data'
                @keydown.enter.prevent='testConfig'
              >
            </div>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="ui selection dropdown" id='revs'>
          <i class='tags icon'></i>
          <input type="hidden" name="revs">
          <div class="default text"></div>
          <i class="dropdown icon"></i>
          <div class="menu">
            <div
              class="item"
              v-for='rev in current_rev_set'
              :data-value='rev.slug'
              @click='selectRev(rev)'
            >
              {{ rev.name }}
            </div>
            <div class="divider"></div>
            <div v-if='new_rev.hasError' class="header" style='color: red'> {{new_rev.error}} </div>
            <div  v-else-if='refs.rev == "latest"' class="header">Create a new Rev</div>
            <div class="ui input" :class="{'error': new_rev.hasError}" v-if='refs.rev == "latest"'>
              <input type="text" placeholder='Choose a name...' @keydown.enter.prevent='testRev' v-model='new_rev.data'>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="item">
        &nbsp
        &nbsp
      </div>
      <div class="item">
        <div class="ui labeled button tiny" tabindex="0">
          <div class="ui button tiny">
            <i class="clone icon"></i>Clone
          </div>
          <a class="ui basic left pointing label">
            31
          </a>
        </div>
        <div class="ui labeled button tiny" tabindex="0">
          <div class="ui button tiny">
            <i class="plus square o icon medium"></i>Import
          </div>
          <a class="ui basic left pointing label">
            74
          </a>
        </div>
        <div class="ui labeled button tiny" tabindex="0">
          <div class="ui button tiny">
            <i class="balance scale icon"></i>Vote
          </div>
          <a class="ui basic left pointing label">
            112
          </a>
        </div>
      </div> -->
    </div>
    <br>
    <div class="ui top attached fuild four item small tabular menu">
      <router-link tag='a' class='item' :to='this.refs.path  + "/home"'>
        <a>
          <i class="home icon"></i>
          Home
        </a>
      </router-link>
      <router-link tag='a' class='item' :to='this.refs.path + "/parts"'>
        <a>
          <i class="cubes icon"></i>
          Parts
          <!-- <div class="ui circular mini label"></div> -->
        </a>
      </router-link>
      <router-link tag='a' class='item' :to='this.refs.path + "/files"'>
        <a>
          <i class="fa-files-o icon"></i>
          Files
          <!-- <div class="ui circular mini label"></div> -->
        </a>
      </router-link>
      <!-- <router-link tag='a' class='item' to='/project/docs'>
        <a>
          <i class="book icon"></i>
          Docs
          <div class="ui circular mini label"></div>
        </a>
      </router-link> -->
      <router-link v-if='this.refs.pre_endpoint == "settings"' tag='a' class='item' :to='this.refs.path + "/settings/" + this.refs.endpoint'>
        <a>
          <i class="fa-cog icon"></i>
          Settings
        </a>
      </router-link>
      <router-link v-else tag='a' class='item' :to='this.refs.path + "/settings/basic"'>
        <a>
          <i class="fa-cog icon"></i>
          Settings
        </a>
      </router-link>
    </div>
    <router-view name='designContent'></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { EventBus } from '../../event-bus.js'
export default {
  name: 'design',
  data () {
    return {
      new_config: {
        data: '',
        hasError: null,
        error: '',
      },
      new_rev: {
        data: '',
        hasError: null,
        error: ''
      },
      current_config: {},
      current_rev_set: {},
      current_rev: {},
      current_change_set: {},
      current_change: {}
    }
  },
  computed: {
    ...mapGetters([
      'session',
      'profile',
      'design',
      'refs',
      'params'
    ]),
    new_config_slug: function() {
      if (this.new_config.data != null) {
        return this.new_config.data.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')
      }
    },
    new_rev_slug: function() {
      if (this.new_rev.data != null) {
        return this.new_rev.data.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')
      }
    }
  },
  watch: {
    params: function () {
      console.log('Params watcher has been called in design.vue')
      if (this.params.design_slug != this.design.slug) {
        let design_payload = { design_slug: this.$route.params.design_slug }
        this.$store.dispatch('getDesign', design_payload).then(success => {
          this.updateDesignRefs()
        }, error => {

        })
      }
    }
  },
  methods: {
    updateDesignRefs: function() {
      this.current_config = this.design.config_set.filter(
        config => config.slug == this.refs.config
      )[0]
      this.current_rev_set = this.current_config.rev_set
      this.current_rev = this.current_rev_set.filter(
        rev => rev.slug == this.refs.rev
      )[0]
      this.current_change_set = this.current_config.change_set
      this.current_change = this.current_change_set.filter(
        change => change.sha1 == this.refs.change
      )[0]

    },
    updateRefSelectors() {
      $('#configs').dropdown('set text', this.current_config.name)
      $('#configs').dropdown('set selected', this.current_config.name)
      $('#revs').dropdown('set text', this.current_rev.name)
      $('#revs').dropdown('set selected', this.current_rev.name)
    },
    selectConfig: function(config) {
      this.$route.params.config_slug = config.slug
      this.$route.params.rev_slug = 'latest'
      this.$route.params.change_slug = null
      this.$store.commit('setRefs')
      this.updateDesignRefs()
      this.updateRefSelectors()
      this.$router.push(this.refs.path + '/' + this.refs.endpoint)
    },
    selectRev: function(rev) {
      this.$route.params.config_slug = rev.config.slug
      this.$route.params.rev_slug = rev.slug
      this.$route.params.change_slug = null
      this.$store.commit('setRefs')
      this.updateDesignRefs()
      this.updateRefSelectors()
      this.$router.push(this.refs.path + '/' + this.refs.endpoint)
    },
    testConfig: function() {
      if (this.new_config.data == '') {
        console.log('Error: did not enter a config name')
        this.new_config.hasError = true
        this.new_config.error = "You must enter a name"
        $('#configs').dropdown('toggle')
        $('#configs').dropdown('toggle')
      } else {
        let regexTest = /^[A-Za-z0-9-_ ]{1,50}$/.test(this.new_config.data)
        if (regexTest) {
          console.log('Config name passes regex test')
          // see if config name is in config_set.name
          let vue = this
          let uniqueConfigTest = this.design.config_set.filter(function(config) {
            return config.name.toLowerCase() == vue.new_config.data.toLowerCase()
          })
          if (uniqueConfigTest.length == 0) {
            console.log('Config name is unique for configs')
            let uniqueRevTest = this.design.rev_set.filter(function(rev) {
              return rev.name.toLowerCase() == vue.new_config.data.toLowerCase()
            })
            if (uniqueRevTest.length == 0) {
              console.log('Config name is unique for revs')
              this.createConfig()
            } else {
              console.log('This name is already being used as a rev')
              this.new_config.hasError = true
              this.new_config.error = 'Name in taksen (rev)'
              $('#configs').dropdown('toggle')
              $('#configs').dropdown('toggle')
            }
          } else {
            console.log('This config name is aleady being used')
            this.new_config.hasError = true
            this.new_config.error = 'Name is taken (config)'
            $('#configs').dropdown('toggle')
            $('#configs').dropdown('toggle')
          }
        } else {
          console.log('This is not a vaild config name')
          this.new_config.hasError = true
          this.new_config.error = 'Invalid Characters'
          $('#configs').dropdown('toggle')
          $('#configs').dropdown('toggle')
        }
      }
    },
    testRev: function() {
      if (this.new_rev.data == '') {
        console.log('Error: did not enter a rev name')
        this.new_rev.hasError = true
        this.new_rev.error = "You must enter a name"
        $('#revs').dropdown('toggle')
        $('#revs').dropdown('toggle')
      } else {
        let regexTest = /^[A-Za-z0-9-_ ]{1,50}$/.test(this.new_rev.data)
        if (regexTest) {
          console.log('Rev name passes regex test')
          // see if config name is in config_set.name
          let vue = this
          let uniqueConfigTest = this.design.config_set.filter(function(config) {
            return config.name.toLowerCase() == vue.new_rev.data.toLowerCase()
          })
          if (uniqueConfigTest.length == 0) {
            console.log('Rev name is unique for configs')
            let uniqueRevTest = this.design.rev_set.filter(function(rev) {
              return rev.name.toLowerCase() == vue.new_rev.data.toLowerCase()
            })
            if (uniqueRevTest.length == 0) {
              console.log('Rev name is unique for revs')
              this.createRev()
            } else {
              console.log('This name is already being used as a rev')
              this.new_rev.hasError = true
              this.new_rev.error = 'Name in taken (rev)'
              $('#revs').dropdown('toggle')
              $('#revs').dropdown('toggle')
            }
          } else {
            console.log('This rev name is aleady being used')
            this.new_rev.hasError = true
            this.new_rev.error = 'Name is taken (config)'
            $('#revs').dropdown('toggle')
            $('#revs').dropdown('toggle')
          }
        } else {
          console.log('This is not a vaild rev name')
          this.new_rev.hasError = true
          this.new_rev.error = 'Invalid Characters'
          $('#revs').dropdown('toggle')
          $('#revs').dropdown('toggle')
        }
      }
    },
    createConfig: function() {
      // set payload and create new config
      let payload = {
        design: this.design.id,
        owner: this.profile.id,
        name: this.new_config.data
      }
      this.$http.post('configs/', payload ).then(success => {
        console.log('New config created')
        console.log(success)

        // set new route params and reset the refs
        this.$route.params.config_slug = this.new_config_slug
        this.$route.params.rev_slug = 'latest'
        this.$route.params.change_slug = null

        // get the updated design with new config_set
        let design_payload = { design_slug: this.design.slug}
        this.$store.dispatch('getDesign', design_payload).then(success => {

          $('#configs').dropdown('hide')
          this.updateDesignRefs()
          this.updateRefSelectors()

          // reset the form
          this.new_config = {
            data: '',
            hasError: null,
            error: '',
          }
          // reload the page at new path with new config
          this.$router.push(this.refs.path + '/' + this.refs.endpoint)
        }, error => {

        })
      }, error => {
        console.log('Error creating new config')
        console.log(error)
      })
    },
    createRev: function() {
      // set payload and create the new Rev
      let payload = {
        design: this.design.id,
        owner: this.profile.id,
        config: this.current_config.id,
        name: this.new_rev.data
      }
      this.$http.post('revs/', payload ).then(success => {
        console.log('New rev created')
        console.log(success)

        // set new route params and reset the refs
        this.$route.params.config_slug = this.refs.config
        this.$route.params.rev_slug = this.new_rev_slug
        this.$route.params.change_slug = null

        // set payload and get updated design with new rev_set
        let design_payload = { design_slug: this.design.slug }
        this.$store.dispatch('getDesign', design_payload).then(success => {
          $('#revs').dropdown('hide')
          this.updateDesignRefs()
          this.updateRefSelectors()

          // reset the form
          this.new_rev = {
            data: '',
            hasError: null,
            error: '',
          }
          this.$router.push(this.refs.path + '/' + this.refs.endpoint)
        }, error => {

        })
      }, error => {
        console.log('Error creating new rev')
        console.log(error)
      })
    },
  },
  created: function() {
    console.log('Design.vue has been created')
    // ??? conditionally check if design already exists (page entry vs transition)
    // initialize the ref selector dropdowns
    $('.ui.dropdown').dropdown({'silent': true})

    // clear the design context, in case coming from another design
    this.$store.commit('clearRefs')
    this.$store.commit('clearDesign')

    // get the design instance from route params
    let design_payload = { design_slug: this.$route.params.design_slug }
    this.$store.dispatch('getDesign', design_payload).then(success => {
      this.updateDesignRefs()
      EventBus.$emit('design-refs-updated')
    }, error => {

    })
  },
  mounted: function() {
    let vue = this
    EventBus.$once('design-refs-updated', function() {
      vue.updateRefSelectors()
    })
  },
}
</script>

<style lang="css">
</style>
