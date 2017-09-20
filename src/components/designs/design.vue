<template lang="html" v-if='rootDesign'>
  <div class="ui grid" style='padding: 0px 25px 0px 25px'>
    <div class="sixteen wide column">
      <div class="ui grid">

        <!-- design header bar -->
        <div class="row" style='padding-bottom: 0px; padding-top: 10px'>
          <div class="sixteen wide column" style='padding-bottom: 0px'>
            <div class="ui text menu" style='margin-top: 0px; margin-bottom:0px'>
              <div class="item">
                <div class="ui massive breadcrumb">
                  <router-link tag='a' to='/home' v-if='profile.slug == $route.params.profile_slug'>
                    {{ profile.name }}
                  </router-link>
                  <router-link tag='a' :to='`/${$route.params.profile_slug}`'  v-else>
                    {{ $route.params.profile_slug }}
                  </router-link>
                  <span  class='divider'>/</span>
                  <router-link tag='a' to='' @click.native='selectRootDesign()'>
                    {{ rootDesign.name }}
                  </router-link>
                  <span v-if='design.name != rootDesign.name' style='font-weight: normal; color: black'>
                   ... {{ design.name }}
                 </span>
                </div>
              </div>
              <div class="right floated item" id='action-buttons' style='padding-top: 10px'>
                <div id="revise-button" >
                  <div class="ui small labeled button" tabindex="0">
                    <div class="ui small basic button">
                      <i class="repeat icon"></i>Revise
                    </div>
                    <a
                      class="ui small basic left pointing label"
                      v-if='design.imports > 0'
                      @click='showImports'
                    >
                      {{ design.imports }}
                    </a>
                    <div class='ui small basic left pointing label' v-else>
                      0
                    </div>
                  </div>
                </div>
                <div id="import-button" >
                  &nbsp&nbsp
                  <div class="ui small labeled button" tabindex="0">
                    <div class="ui small basic button">
                      <i class="upload icon"></i>Export
                    </div>
                    <a
                      class="ui small basic left pointing label"
                      v-if='design.imports > 0'
                      @click='showImports'
                    >
                      {{ design.imports }}
                    </a>
                    <div class='ui small basic left pointing label' v-else>
                      0
                    </div>
                  </div>
                </div>
                <div id='copy-button'>
                  &nbsp&nbsp
                  <div class="ui small labeled button" tabindex="0">
                    <div class="ui small basic button">
                      <i class="clone icon"></i>Clone
                    </div>
                    <a class="ui small basic left pointing label">
                      0
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- spacer -->
        <div class="row" style='padding: 0px'>

          <!-- indented bom navigation pane -->
          <div class="four wide column" style='padding-top: 10px; padding-bottom: 0px'>
            <div class="ui basic segment" style='padding: 0px'>
              <div class="ui sticky">
                <div class="ui small top attached header">
                  <i class="large sitemap icon"></i>
                  <div class="content">
                    Assembly Structure

                  </div>
                </div>

                <div class="ui bottom attached clearing segment">
                  <template v-if='tree[0]'>
                    <div class="ui right floated mini icon buttons">
                      <button class="ui mini basic grey icon button" @click='closeParts(tree)'>
                        <i class="minus icon"></i>
                      </button>
                      <button class="ui basic grey icon button" @click='openParts(tree)'>
                        <i class="plus icon"></i>
                      </button>
                    </div>
                    <app-PartsTree :data='$store.state.tree' :first='true' style='padding-top: 15px'></app-PartsTree>
                  </template>
                  <div v-else>
                    <br>
                    Add parts to your BOM
                    <br>
                    They will appear here
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- main design content -->
          <div class="twelve wide column" style='padding-top: 0px; padding-bottom: 0px' id='context'>
            <!-- tabular menu (records) -->
            <div class="ui large top attached fuild five item tabular menu" style='padding: 8px 0px 0px 0px'>
              <router-link tag='a' class='item' :to='this.designRoute  + "/home"'>
                <a>
                  <i class="home icon"></i>
                  Summary
                </a>
              </router-link>

              <router-link tag='a' class='item' :to='this.designRoute + "/parts"'>
                <a>
                  <i class="cubes icon"></i>
                  Parts
                  <!-- <div class="ui circular mini label"></div> -->
                </a>
              </router-link>
              <router-link tag='a' class='item' :to='this.designRoute + "/files"'>
                <a>
                  <i class="folder open outline icon"></i>
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
              <router-link tag='a' class='item' :to='this.designRoute + "/specs"'>
                <a>
                  <i class="unordered list icon"></i>
                  Specs
                  <!-- <div class="ui circular mini label"></div> -->
                </a>
              </router-link>
              <!-- <router-link tag='a' class='item' :to='this.designRoute + "/revs"'>
                <a>
                  <i class="fa-files-o icon"></i>
                  Revs
                </a>
              </router-link> -->
              <router-link v-if='this.pre_endpoint == "settings"' tag='a' class='item' :to='this.designRoute + "/settings/" + this.endpoint'>
                <a>
                  <i class="fa-cog icon"></i>
                  Settings
                </a>
              </router-link>
              <router-link v-else-if='design.is_collaborator' tag='a' class='item' :to='this.designRoute + "/settings/configs"'>
                <a>
                  <i class="fa-cog icon"></i>
                  Settings
                </a>
              </router-link>
              <router-link v-else tag='a' class='item' :to='this.designRoute + "/settings/basic"'>
                <a>
                  <i class="fa-cog icon"></i>
                  Settings
                </a>
              </router-link>
            </div>
            <!-- tab content (records) -->
            <transition name='fade'>
              <router-view name='designContent'></router-view>
            </transition>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script>

import { mapState, mapGetters } from 'vuex'
import { EventBus } from '../../event-bus.js'
import partsTree from './partsTree.vue'
export default {
  name: 'design',
  components: {
    appPartsTree: partsTree,
  },
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
      current_rev: {},
      part: null,
      testPath: [],
    }
  },
  computed: {
    ...mapState([
      'env',
      'session',
      'profile',
      'rootDesign',
      'design',
      'designRefs',
      'route',
      'node',
      'tree',
      'trail',
      'revision'
    ]),
    ...mapGetters([
      'designRoute',
      // 'partRoute',
      'endpoint',
      'pre_endpoint'
    ]),
  },
  watch: {
    node() {
      if (this.env != 'prod') {
        console.log('node watcher called in design.vue')
        console.dir(this.node)
      }
      if (this.node) {
        if (this.node.parent_id) {
          let path = []
           this.testPath = this.getTrail(this.node.unique_id, this.tree, path)
        }
        this.testPath.push({
          id: this.node.design_id,
          slug: this.node.design_slug
        })
        this.$store.commit('setTrail', this.testPath)
      }
    },
    route () {
      if (this.env != 'prod') {
        console.log('Route watcher has been called in design.vue')
      }
      if (this.route.params.design_slug != this.rootDesign.slug || this.route.params.revision_slug != this.revision.slug) {
        if (this.env != 'prod') {
          console.log('Root design or revision has changed, getting new data')
        }
        this.$store.commit('clearDesign')

        let design_payload = {
          design_slug: this.route.params.design_slug,
          owner_slug: this.route.params.profile_slug,
          revision_slug: this.route.params.revision_slug
        }

        this.$store.dispatch('getDesign', design_payload).then(success => {
          this.$store.commit('setRootDesign', this.design)
          let tree_payload = {
            design_id: this.design.id,
            revision_slug: this.route.params.revision_slug
          }
          this.$store.dispatch('getTree', tree_payload).then(success => {
              this.$store.commit('setTree', success)
          }, error => {})
        }, error => {})
      }
      else {
        if (this.env != 'prod') {
          console.log('No change to route parameters, passing...')
        }
      }
    },
  },
  methods: {
    getTrail(unique_id, tree, path) {
      if (this.env != 'prod') {
        console.log('getTrail function called')
      }
      for (let part of tree) {
        if (part.unique_id === unique_id) {
          if (this.env != 'prod') {
            console.log('Found node in trail')
            console.dir(path)
          }
          path.push({
            slug: part.design_slug,
            id: part.design_id
          })
          console.log(path)
          return path
        } else {
          if (part.parts.length > 0) {
            path.push({
              slug: part.design_slug,
              id: part.design_id
            })
            this.getTrail(unique_id, part.parts, path)
          }
        }
      }
    },
    selectRootDesign() {
      // set design as root design
      let design_payload = {
        design_slug: this.route.params.design_slug,
        owner_slug: this.route.params.profile_slug,
        revision_slug: this.route.params.revision_slug
      }

      this.$store.dispatch('getDesign', design_payload).then()

      // reset the node -> trail
      this.$store.commit('setNode', this.tree[0])
      // reset the record context

    },
    openParts(parts) {
      for (let part of parts) {
        part.isOpen = true
        if (part.parts.length > 0) {
          this.openParts(part.parts)
        }
      }
    },
    closeParts(parts) {
      for (let part of parts) {
        part.isOpen = false
        if (part.parts.length > 0) {
          this.closeParts(part.parts)
        }
      }
    },
    revisePart() {},
    exportPart() {
      // open a modal with a search box
      // search your design library
      // set the quantity and tracking point
      // add the part to that designs bom
      // present a success message

      // on click imports link, submit a search request for all designs this has been imported into


    },
    clonePart() {

      // create a new API endpoint called clone_part
      // on success switch the URL to the new design

      // on click clones link, submit a search request for all clones for this design (if > 0)

    }
  },
  created() {
    this.$store.commit('clearDesign')
    if (this.env != 'prod') {
      console.log('Design.vue has been created')
    }

    let design_payload = {
      design_slug: this.route.params.design_slug,
      owner_slug: this.route.params.profile_slug,
      revision_slug: this.route.params.revision_slug
    }

    this.$store.dispatch('getDesign', design_payload).then(success => {
      this.$store.commit('setRootDesign', this.design)
      let tree_payload = {
        design_id: this.design.id,
        revision_slug: this.route.params.revision_slug
      }
      this.$store.dispatch('getTree', tree_payload).then(success => {
        this.$store.commit('setTree', success)
        this.$store.commit('setNode', this.tree[0])
      }, error => {})
    }, error => {})

    if (this.env != 'prod') {
      console.log('Design at created is:')
      console.dir(this.design)
    }
  },
  mounted() {
    // let vue = this
    // EventBus.$once('design-refs-updated', function() {
    //   this.$nextTick(() => {
    //     vue.updateRefSelectors()
    //
    //   })
    // })
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

  div.item {
    padding-top: 0;
    padding-bottom: 0;
  }
</style>
