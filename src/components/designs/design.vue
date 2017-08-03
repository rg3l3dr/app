<template lang="html">
  <div class="design">

<!--     <div class="sixteen wide column">
  <div class="ui horizontal middle aligned list">
    <div class="item">
      <i class="fa fa-lock fa-2x"></i>
    </div>
    <div class="item">
      <img src="images/Rebel_Alliance_logo.png" class="ui circular tiny image">
      <div class="content">
        <div class="ui header" style='font-size:22px'>
          <router-link tag='a' to='/home'>
            {{ profile.name }}
          </router-link>
           / {{ design.name }} / Assembly / SubAssembly / Final Part
        </div>
      </div>
    </div>
  </div>
</div> -->

    <div class="sixteen wide column">
      <div class="ui horizontal middle aligned list">
        <div class="item">
          <i class="fa fa-lock fa-2x"></i>
        </div>
        <div class="item">
          <transition name='fade'>
            <div class="ui massive breadcrumb" style='padding: 0px 0px 10px 0px 'v-if='trail.length > 0'>
              <router-link tag='a' to='/home'>
                {{ profile.name }}
              </router-link>
              <span  class='divider'>/</span>
              <span v-for='(breadcrumb, index) in trail'>
                <span v-if='(trail.length - 1) != index'>
                  <router-link tag='a' to='' @click.native='selectPart(index)'>
                    {{ breadcrumb.name }}
                  </router-link>
                  <span  class='divider'>/</span>
                </span>
                <span v-else>
                  <div class="active section">{{ breadcrumb.name }}</div>
                </span>
              </span>
            </div>
          </transition>
        </div>
      </div>


    </div>
    <div class="ui three item large text menu" style='margin: -5px 0px 5px 0px'>
      <div class="item" id='ref-selectors'>
        <div id="config-selector">
          <div style='font-size: 13px; padding: 5px; text-align: left'>
             CONFIG
          </div>
          <div class="ui selection dropdown" id='configs' style='font-size:13px'>
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
                {{ config.name.name }}
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
                ADD ANOTHER CONFIG
              </div>
              <!-- <div class='item' @click.prevent='createConfig'>
                <i class="plus icon"></i>
                Add A Config
              </div> -->
              <div class="ui input">
                <div
                  class="ui small basic compact grey button"
                  @click.prevent='createConfig'
                  style='line-height: 1px; font-size: 14px'
                >
                  <i class="plus icon"></i>
                  Add Conifg
                </div>
              </div>

              <div class="header">
                <a href="http://help.omnibuilds.com#configurations-configs">
                  WHAT IS A CONFIG?
                </a>

              </div>


              <!-- <button class="ui button">
              Create New Config
            </button> -->
              <!-- <div
                class="ui input"
                :class="{'error': new_config.hasError}"
              >
                <input
                  type="text"
                  placeholder='Choose a name...'
                  v-model='new_config.data'
                  @keydown.enter.prevent='testConfig'
                >
              </div> -->
            </div>
          </div>
        </div>
        &nbsp&nbsp&nbsp&nbsp
        <div id="build-selector">
          <div style='font-size: 13px; padding: 3px; text-align: left'>
            BUILD
          </div>
          <div class="ui selection dropdown" id='builds' style='font-size:13px'>
            <i class='wrench icon'></i>
            <input type="hidden" name="builds">
            <div class="default text"></div>
            <i class="dropdown icon"></i>
            <div class="menu">
              <div
                class="item"
                v-for='build in current_build_set'
                :data-value='build.slug'
                @click='selectBuild(build)'
              >
                {{ build.name }}
              </div>
              <div class="divider"></div>
              <div v-if='new_build.hasError' class="header" style='color: red'> {{new_build.error}} </div>
              <div  v-else-if='$route.params.rev_slug == "latest"' class="header">Create a new Build</div>
              <div class="ui input" :class="{'error': new_build.hasError}" v-if='$route.params.rev_slug == "latest"'>
                <input
                  type="text"
                  placeholder='Choose a name...'
                  @keydown.enter.prevent='testBuild'
                  v-model='new_build.data'
                  id='build-input'
                >
              </div>
              <div class="header">
                <a href="http://help.omnibuilds.com#builds">
                  WHAT IS A BUILD?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="item" id='part-number' v-if='design.design_class'>
        <div style='padding: 15px 0px 0px 0px'>
          <div class="ui basic icon buttons">
            <button
              class="ui button"
              @click='toggleRev(-1)'
              :disabled='current_rev_index==0'
            >
              <i class="left chevron icon"></i>
            </button>
            <button class="ui button" @click='selectRev'>
              <span v-if='$route.params.build_slug'>
                {{ `${design.abbreviation}-${design.sequence}-${design.design_class.code}-${current_config.name.letter}${current_rev.number}: ${current_build.name}` }}
              </span>
              <span v-else style='color:#337ab7; font-size:15px'>
                {{ `${design.abbreviation}-${design.sequence}-${design.design_class.code}-${current_config.name.letter}${current_rev.number}`
                }}
              </span>
            </button>
            <button
              class="ui button"
              @click='toggleRev(+1)'
              :disabled='current_rev_index == (current_rev_set.length - 1)'
            >
              <i class="right chevron icon"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="item" id='action-buttons'>
        <!-- <div id="import-button" style='padding: 20px 0px 0px 0px'>
          <div class="ui labeled button" tabindex="0">
            <div class="ui basic button">
              <i class="plus square o icon medium"></i>Import
            </div>
            <a
              class="ui basic left pointing label"
              v-if='design.imports > 0'
              @click='showImports'
            >
              {{ design.imports }}
            </a>
            <div class='ui basic left pointing label' v-else>
              0
            </div>
          </div>
        </div>
        <div id='copy-button' style='padding: 20px 0px 0px 0px'>
          &nbsp&nbsp
          <div class="ui labeled button" tabindex="0">
            <div class="ui basic button">
              <i class="clone icon"></i>Copy
            </div>
            <a class="ui basic left pointing label">
              {{ design.copys }}
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
    </div>
    <div class="ui top attached fuild four item tabular menu" style='padding: 8px 0px 0px 0px'>
      <!-- <router-link tag='a' class='item' :to='this.designRefs.design_path  + "/home"'>
        <a>
          <i class="home icon"></i>
          Home
        </a>
      </router-link> -->

      <router-link tag='a' class='item' :to='this.designRefs.design_path + "/parts"'>
        <a>
          <i class="cubes icon"></i>
          Parts
          <!-- <div class="ui circular mini label"></div> -->
        </a>
      </router-link>
      <router-link tag='a' class='item' :to='this.designRefs.design_path + "/files"'>
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
      <router-link tag='a' class='item' :to='this.designRefs.design_path + "/specs"'>
        <a>
          <i class="list icon"></i>
          Specs
          <!-- <div class="ui circular mini label"></div> -->
        </a>
      </router-link>
      <router-link v-if='this.endpoints.pre_endpoint == "settings"' tag='a' class='item' :to='this.designRefs.design_path + "/settings/" + this.endpoints.endpoint'>
        <a>
          <i class="fa-cog icon"></i>
          Settings
        </a>
      </router-link>
      <router-link v-else tag='a' class='item' :to='this.designRefs.design_path + "/settings/basic"'>
        <a>
          <i class="fa-cog icon"></i>
          Settings
        </a>
      </router-link>
    </div>
    <transition name='fade'>
      <router-view name='designContent'></router-view>
    </transition>

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
      new_build: {
        data: '',
        hasError: null,
        error: ''
      },
      current_config: {},
      current_build_set: [],
      current_build: {},
      current_rev_set: [],
      current_rev_index: 0,
      current_rev: {}
    }
  },
  computed: {
    ...mapGetters([
      'session',
      'profile',
      'design',
      'designRefs',
      'params',
      'path',
      'trail',
    ]),
    new_build_slug: function() {
      if (this.new_build.data != null) {
        return this.new_build.data.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')
      }
    },
    endpoints() {
      let splits = this.$store.state.route.fullPath.split('/')
      let endpoint = splits[splits.length - 1]
      let pre_endpoint = splits[splits.length - 2]
      let endpoints_object = {
        endpoint: endpoint,
        pre_endpoint: pre_endpoint
      }
      return endpoints_object
    },
  },
  watch: {
    design() {
      console.log('Design watcher called in design.vue')
      if (this.design.config_set) {
        console.log('watch function activiated in design.vue')

        this.updateDesignRefs()
        this.updateRefSelectors()
      }
    },
    params: function () {
      // console.log('Params watcher has been called in design.vue')
      // if (this.params.design_slug != this.design.slug) {
      //   this.$store.commit('clearDesign')
      //   console.log('Design slug has changed, getting new design')
      //   // this.$store.commit('setDesignRefs')
      //   let design_payload = { design_slug: this.$route.params.design_slug }
      //   this.$store.dispatch('getDesign', design_payload).then(success => {
      //     this.updateDesignRefs()
      //     this.$store.commit('setDesignRefs')
      //     this.updateRefSelectors()
      //   }, error => {
      //
      //   })
      // } else if (this.params.rev_slug) {
      //   this.updateDesignRefs()
      //   this.$store.commit('setDesignRefs')
      //   this.updateRefSelectors()
      // }
      // else { console.log('No change to design slug, passing...') }
    }
  },
  methods: {
    updateDesignRefs() {
      if (this.$route.params.config_slug) {
        console.log('Design refs being set at config or rev');
        this.current_config = this.design.config_set.filter(
          config => config.slug == this.$route.params.config_slug
        )[0]
        this.current_build_set = this.current_config.build_set
        if (this.$route.params.build_slug) {
          this.current_build = this.current_build_set.filter(
            build => build.slug == this.$route.params.build_slug
          )[0]
        } else {
          this.current_build = {
            slug: null,
            name: 'None'
          }
        }
        this.current_rev_set = this.current_config.rev_set
        if (this.$route.params.rev_slug && this.$route.params.rev_slug != 'latest') {
          this.current_rev = this.current_rev_set.filter(
            rev => rev.number == this.$route.params.rev_slug
          )[0]
        } else {
          this.current_rev = this.current_rev_set[this.current_rev_set.length - 1]
        }

      } else {
        console.log('Design refs being set at a build')
        this.current_build_set = this.design.build_set
        this.current_build = this.current_build_set.filter(
          build => build.slug == this.$route.params.build_slug
        )[0]
        this.current_config = this.design.config_set.filter(
          config => config.id == this.current_build.config.id
        )[0]
        this.current_rev = this.design.rev_set.filter(
          rev => rev.sha1 == this.current_build.sha1
        )[0]
        this.current_rev_set = this.current_config.rev_set
      }
      this.current_rev_index = this.current_rev_set.indexOf(this.current_rev)
      EventBus.$emit('design-refs-updated')
      console.log('Design Refs have been updated in design.vue')
    },
    updateRefSelectors() {
      if (this.current_config != null) {
        $('#configs').dropdown('set text', this.current_config.name.name)
        $('#configs').dropdown('set selected', this.current_config.name.name)
        $('#builds').dropdown('set text', this.current_build.name)
        $('#builds').dropdown('set selected', this.current_build.name)
      } else {
        $('#configs').dropdown('set text', 'None')
        $('#builds').dropdown('set text', 'None')
      }
      console.log('Ref selectors have been updated in design.vue')
    },
    selectConfig(config) {
      this.$route.params.config_slug = config.slug
      this.$route.params.rev_slug = 'latest'
      this.$route.params.build_slug = null
      this.$store.commit('setDesignRefs')
      this.updateDesignRefs()
      this.updateRefSelectors()

      let breadcrumb = {
        name: this.design.name,
        slug: this.design.slug,
        design_id: this.design.id,
        ref_slug: this.designRefs.ref,
        ref_type: this.designRefs.ref_type,
        config_slug: this.designRefs.config_slug,
      }

      let index = this.trail.length - 1
      let payload = {
        breadcrumb: breadcrumb,
        index: index
      }
      this.$store.commit('editTrail', payload)

      let settings_ref
      if (this.designRefs.pre_endpoint == 'settings') {
        settings_ref = 'settings/'
      } else { settings_ref = ''}
      this.$router.push(`${this.designRefs.design_path}/${settings_ref}${this.designRefs.endpoint}`)
      let button = document.getElementById('add-part-button')
      if (button) { button.disabled=false }
    },
    selectBuild(build) {
      // handle none
      if (build.name == 'None') {
        this.$route.params.config_slug = 'alpha'
        this.$route.params.build_slug = null
        this.$route.params.rev_slug = 'latest'
      } else {
        this.$route.params.config_slug = build.config.slug
        this.$route.params.build_slug = build.slug
        this.$route.params.rev_slug = null
      }
      this.$store.commit('setDesignRefs')
      this.updateDesignRefs()
      this.updateRefSelectors()
      // this.$router.push(this.designRefs.design_path + '/' + this.designRefs.endpoint)

      let breadcrumb = {
        name: this.design.name,
        slug: this.design.slug,
        design_id: this.design.id,
        ref_slug: this.designRefs.ref,
        ref_type: this.designRefs.ref_type,
        config_slug: this.designRefs.config_slug,
      }

      let index = this.trail.length - 1
      let payload = {
        breadcrumb: breadcrumb,
        index: index
      }
      this.$store.commit('editTrail', payload)

      let settings_ref
      if (this.designRefs.pre_endpoint == 'settings') {
        settings_ref = 'settings/'
      } else { settings_ref = ''}
      this.$router.push(`${this.designRefs.design_path}/${settings_ref}${this.designRefs.endpoint}`)
      let button = document.getElementById('add-part-button')
      if (button) { button.disabled=false }
    },
    selectPart(index) {

      let breadcrumb = this.trail[index]
      console.log(breadcrumb)
      if (breadcrumb.ref_type == 'config') {
        this.$route.params.config_slug = breadcrumb.config_slug
        this.$route.params.rev_slug = 'latest'
        this.$route.params.build_slug = null
      } else if (breadcrumb.ref_type == 'rev') {
        this.$route.params.config_slug = breadcrumb.config_slug
        this.$route.params.rev_slug = breadcrumb.ref_slug
        this.$route.params.build_slug = null
      } else if (breadcrumb.ref_type == 'build') {
        this.$route.params.config_slug = breadcrumb.config_slug
        this.$route.params.rev_slug = null
        this.$route.params.build_slug = breadcrumb.ref_slug
      }

      let payload = { design_slug: breadcrumb.slug }
      this.$store.dispatch('getDesign', payload).then(success => {
        this.$store.commit('resetTrail', index)
        this.$store.commit('setDesignRefs')
        // this.updateDesignRefs()
        // this.updateRefSelectors()

        let settings_ref
        if (this.designRefs.pre_endpoint == 'settings') {
          settings_ref = 'settings/'
        } else { settings_ref = ''}
        this.$router.push(`${this.designRefs.design_path}/${settings_ref}${this.designRefs.endpoint}`)
        console.log('updated route after selecting part')
        let button = document.getElementById('add-part-button')
        if (button) { button.disabled=false }
      }, error => {})
    },
    testBuild() {
      if (this.new_build.data == '') {
        console.log('Error: did not enter a build name')
        this.new_build.hasError = true
        this.new_build.error = "You must enter a name"
        $('#builds').dropdown('toggle')
        $('#builds').dropdown('toggle')
      } else {
        let regexTest = /^[A-Za-z0-9-_ ]{1,50}$/.test(this.new_build.data)
        if (regexTest) {
          console.log('Build name passes regex test')
          // see if config name is in config_set.name
          let config_names = [
            'Alpha',
            'Beta',
            'Charlie',
            'Delta',
            'Echo',
            'Fox',
            'Golf',
            'Hotel',
            'India',
            'Juliet',
            'Kilo',
            'Lima',
            'Mike',
            'Oscar',
            'November',
            'Papa',
            'Quebec',
            'Romeo',
            'Sierra',
            'Tango',
            'Uniform',
            'Victor',
            'Whiskey',
            'X-ray',
            'Yankee',
            'Zulu'
          ]
          let vue = this
          // compare to list of legal configs
          let uniqueConfigTest = config_names.filter(function(config) {
            return name.toLowerCase() == vue.new_build.data.toLowerCase()
          })
          if (uniqueConfigTest.length == 0) {
            console.log('Build name is unique for configs')
            let uniqueBuildTest = this.design.build_set.filter(function(build) {
              return build.name.toLowerCase() == vue.new_build.data.toLowerCase()
            })
            if (uniqueBuildTest.length == 0) {
              console.log('Build name is unique for builds')
              this.createBuild()
            } else {
              console.log('This name is already being used as a build')
              this.new_build.hasError = true
              this.new_build.error = 'Name in taken (build)'
              $('#builds').dropdown('toggle')
              $('#builds').dropdown('toggle')
            }
          } else {
            console.log('This build name is aleady being used')
            this.new_build.hasError = true
            this.new_build.error = 'Name is taken (config)'
            $('#builds').dropdown('toggle')
            $('#builds').dropdown('toggle')
          }
        } else {
          console.log('This is not a vaild build name')
          this.new_build.hasError = true
          this.new_build.error = 'Invalid Characters'
          $('#builds').dropdown('toggle')
          $('#builds').dropdown('toggle')
        }
      }
    },
    createConfig() {
      // set payload and create new config
      let payload = {
        design: this.design.id,
        owner: this.profile.id,
        name: 1
        //name: this.new_config.data
      }
      this.$http.post('configs/', payload ).then(success => {
        console.log('New config created')
        console.log(success)

        // set new route params and reset the refs
        this.$route.params.config_slug = success.body.name.slug
        this.$route.params.rev_slug = 'latest'
        this.$route.params.build_slug = null

        // get the updated design with new config_set
        let design_payload = { design_slug: this.design.slug}
        this.$store.commit('setDesignRefs')
        this.$store.dispatch('getDesign', design_payload).then(success => {

          $('#configs').dropdown('hide')
          // this.updateDesignRefs()
          // this.updateRefSelectors()

          // reset the form
          this.new_config = {
            data: '',
            hasError: null,
            error: '',
          }
          // reload the page at new path with new config
          // this.$router.push(this.designRefs.design_path + '/' + this.designRefs.endpoint)
          let breadcrumb = {
            name: this.design.name,
            slug: this.design.slug,
            design_id: this.design.id,
            ref_slug: this.designRefs.ref,
            ref_type: this.designRefs.ref_type,
            config_slug: this.designRefs.config_slug,
          }

          let index = this.trail.length - 1
          let payload = {
            breadcrumb: breadcrumb,
            index: index
          }
          this.$store.commit('editTrail', payload)
          let settings_ref
          if (this.designRefs.pre_endpoint == 'settings') {
            settings_ref = 'settings/'
          } else { settings_ref = ''}
          this.$router.push(`${this.designRefs.design_path}/${settings_ref}${this.designRefs.endpoint}`)
        }, error => {

        })
      }, error => {
        console.log('Error creating new config')
        console.log(error)
      })
    },
    createBuild() {
      // set payload and create the new Rev
      let payload = {
        design: this.design.id,
        owner: this.profile.id,
        config: this.current_config.id,
        name: this.new_build.data
      }
      this.$http.post('builds/', payload ).then(success => {
        console.log('New build created')
        console.log(success)

        // set new route params and reset the refs
        // this.$route.params.config_slug = this.designRefs.params.config_slug
        console.log('Config slug after creating new build is:')
        console.log(this.$route.params.config_slug)
        this.$route.params.build_slug = this.new_build_slug
        this.$route.params.rev_slug = null

        // set payload and get updated design with new rev_set
        let design_payload = { design_slug: this.design.slug }
        this.$store.commit('setDesignRefs')
        this.$store.dispatch('getDesign', design_payload).then(success => {
          $('#builds').dropdown('hide')
          // this.updateDesignRefs()
          // this.updateRefSelectors()

          // reset the form
          this.new_build = {
            data: '',
            hasError: null,
            error: '',
          }

          let breadcrumb = {
            name: this.design.name,
            slug: this.design.slug,
            design_id: this.design.id,
            ref_slug: this.designRefs.ref,
            ref_type: this.designRefs.ref_type,
            config_slug: this.designRefs.config_slug,
          }

          let index = this.trail.length - 1
          let payload = {
            breadcrumb: breadcrumb,
            index: index
          }

          // this.$router.push(this.designRefs.design_path + '/' + this.designRefs.endpoint)
          let settings_ref
          if (this.designRefs.pre_endpoint == 'settings') {
            settings_ref = 'settings/'
          } else { settings_ref = ''}
          this.$router.push(`${this.designRefs.design_path}/${settings_ref}${this.designRefs.endpoint}`)
        }, error => {

        })
      }, error => {
        console.log('Error creating new build')
        console.log(error)
      })
    },
    selectRev() {
      if (this.current_rev_index == (this.current_rev_set.length - 1)) {
        var path = `/${this.design.creator_slug}/${this.design.slug}/${this.current_config.slug}/latest/parts`
      } else {
        var path = `/${this.design.creator_slug}/${this.design.slug}/${this.current_config.slug}/${this.current_rev.slug}/parts`
      }

      this.$router.push('/' + path, onComplete => {
        let button = document.getElementById('add-part-button')
        if (button) { button.disabled=true }
      }, onAbort => {

      })
    },
    toggleRev(step) {
      this.current_rev_index += step
      this.current_rev = this.current_rev_set[this.current_rev_index]

      if (this.current_rev_index == (this.current_rev_set.length - 1)) {
        this.$route.params.config_slug = this.current_config.slug
        this.$route.params.rev_slug = 'latest'
        this.$route.params.build_slug = null
      } else {
        this.$route.params.config_slug = this.current_config.slug
        this.$route.params.rev_slug = this.current_rev.slug
        this.$route.params.build_slug = null
      }
      // adjust the route params and desing refs

      this.$store.commit('setDesignRefs')

      // set the breadcrumb
      let breadcrumb = {
        name: this.design.name,
        slug: this.design.slug,
        design_id: this.design.id,
        ref_slug: this.designRefs.ref,
        ref_type: this.designRefs.ref_type,
        config_slug: this.designRefs.config_slug,
      }

      let index = this.trail.length - 1
      let payload = {
        breadcrumb: breadcrumb,
        index: index
      }
      this.$store.commit('editTrail', payload)

      let settings_ref
      if (this.designRefs.pre_endpoint == 'settings') {
        settings_ref = 'settings/'
      } else { settings_ref = ''}
      this.$router.push(`${this.designRefs.design_path}/${settings_ref}${this.designRefs.endpoint}`)
      let button = document.getElementById('add-part-button')
      if (button) { button.disabled=false }
    },
    showImports() {},
    importDesign() {},
    showCopies() {},
    copyDesign() {}
  },
  created() {
    console.log('Design.vue has been created')

    // clear the design context, in case coming from another design
    this.$store.commit('clearDesignRefs')
    this.$store.commit('clearDesign')
    this.$store.commit('clearTrail')

    // set the new design refs based on the $route
    // this.$store.commit('setDesignRefs')
    $('.ui.dropdown').dropdown({'silent': true})

    console.log('Design at created is:')
    console.log(this.design)

    // get the design instance from route params
    let design_payload = { design_slug: this.$route.params.design_slug }
    this.$store.dispatch('getDesign', design_payload).then(success => {


      // this.updateDesignRefs()
      this.$store.commit('setDesignRefs')
      EventBus.$emit('design-refs-updated')

      let breadcrumb = {
        name: this.design.name,
        slug: this.design.slug,
        design_id: this.design.id,
        ref_slug: this.designRefs.ref,
        ref_type: this.designRefs.ref_type,
        config_slug: this.designRefs.config_slug,
      }
      this.$store.commit('extendTrail', breadcrumb)

    }, error => {

    })
  },
  mounted() {
    let vue = this
    EventBus.$once('design-refs-updated', function() {
      this.$nextTick(() => {
        vue.updateRefSelectors()

      })
    })
  },
  updated() {}
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
