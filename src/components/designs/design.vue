<template lang="html" v-if='profile'>
  <div class="ui grid" style='padding: 0px 25px 0px 25px'>
    <div class="sixteen wide column" v-if='design'>
      <div class="ui grid">
        <div class="modals">
          <div class='ui small modal' id='revision-modal'>
            <div class="header">
              <h3>
               Create a New Revision
             </h3>
            </div>
            <div class="content">
              <form class="ui form">
                <div class="field" :class="{ 'error': new_rev.hasError }">
                  <label>Revision Name</label>
                  <input
                    type="text"
                    v-model='new_rev.name'
                    id='revision-name'
                  >
                  <span
                    v-if='new_rev.hasError'
                    class="help-block"
                    >{{new_rev.error}}
                  </span>
                </div>
                <div class="field">
                  <label>Change Message</label>
                  <input
                    type='text'
                    v-model='new_rev.message'
                    id='change-message'
                  >
                </div>
              </form>

            </div>
            <div class="actions">
              <button class="ui small blue basic button" @click='hideRevModal()'>Close</button>
              <button class="ui green small basic button" @click='revisePart()'>Create Revision</button>
            </div>
          </div>
          <div class='ui modal' id='export-modal'>
            <div class="header">
              <h3>
               Add {{ design.name }} as a part into an existing design
             </h3>
            </div>
            <div class="content">
              <form class="ui form">
                <div class="field" id='parent-design'>
                  <label>Existing Design</label>
                  <div class="ui transparent search input fluid">
                    <input
                      class="prompt compact"
                      type="text"
                      placeholder="Search for an existing design"
                    >
                  </div>
                </div>
                <div class="field" id='part-revision'>
                  <label>Revision for {{ design.name }}</label>
                  <div class="ui selection dropdown" id='revision-dropdown'>
                    <input type="hidden" name="revision">
                    <i class="dropdown icon"></i>
                    <div class="default text">Select a Revision</div>
                    <div class="menu">
                      <div
                        class="item"
                        v-for='revision in design.revisions'
                        @click='importRevision=revision'
                      >
                        {{ revision.name}}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="field" id='part-quantity'>
                  <label>Quantity for {{ design.name }}</label>
                  <input type="number" v-model='importQuantity' step='1' min='1'>
                </div>
              </form>

            </div>
            <div class="actions">
              <button class="ui small blue basic button" @click='hideExportModal()'>Close</button>
              <button
                class="ui green small basic button"
                @click='exportPart()'
                :class="{'disabled' : !result || !importRevision}"
              >Export Part</button>
            </div>
          </div>
          <div class='ui small modal' id='clone-modal'>
            <div class="header">
              <h3>
               Clone this Design
             </h3>
            </div>
            <div class="content">
              <form class="ui form">
                <div class="field" :class="{ 'error': clone.hasError }">
                  <label>Clone Name</label>
                  <input
                    type="text"
                    v-model='clone.name'
                    id='clone-name'
                    maxlength="50"
                  >
                  <span
                    v-if='clone.hasError'
                    class="help-block"
                    >{{ clone.error }}
                  </span>
                </div>
              </form>
            </div>
            <div class="actions">
              <button class="ui small blue basic button" @click='hideCloneModal()'>Close</button>
              <button class="ui green small basic button" @click='clonePart()'>Create Clone</button>
            </div>
          </div>
          <div class='ui small modal' id='share-modal'>
            <div class="header">
              <h3>
               Share this design
             </h3>

            </div>
            <div class="content">

              <form class="ui form">
                <div class="field" :class="{ 'error': share.hasError }">
                  <label>Enter an email</label>
                  <input
                    type="email"
                    v-model='share.email'
                    id='revision-name'
                  >
                  <span
                    v-if='share.hasError'
                    class="help-block"
                    >{{ share.error }}
                  </span>
                </div>
                <div class="field" id='part-revision'>
                  <label>Revision for {{ design.name }}</label>
                  <div class="ui selection dropdown" id='share-dropdown'>
                    <input type="hidden" name="revision">
                    <i class="dropdown icon"></i>
                    <div class="default text">Select a Revision</div>
                    <div class="menu">
                      <div
                        class="item"
                        v-for='revision in design.revisions'
                        @click='shareRevision=revision'
                      >
                        {{ revision.name}}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div class="actions">
              <button class="ui small blue basic button" @click='hideShareModal()'>Close</button>
              <button class="ui green small basic button" @click='shareDesign()'>Share Design</button>
            </div>
          </div>
        </div>
        <!-- design header bar -->
        <div class="row" style='padding-bottom: 0px; padding-top: 10px'>
          <div class="sixteen wide column" style='padding-bottom: 0px'>
            <div class="ui text menu" style='margin-top: 0px; margin-bottom:0px'>
              <div class="item">
                <div class="ui massive breadcrumb" v-if='rootDesign'>
                  <router-link tag='a' to='/home' v-if='profile.slug == design.owner_slug && profile'>
                    {{ profile.name }}
                  </router-link>
                  <router-link tag='a' :to='`/${$route.params.profile_slug}`'  v-else>
                    {{ $route.params.profile_slug }}
                  </router-link>
                  <span  class='divider'>/</span>
                  <router-link tag='a' to='' @click.native='selectRootDesign()' >
                    {{ rootDesign.name }}
                  </router-link>
                  <span v-if='design.name != rootDesign.name' style='font-weight: normal; color: black'>
                   ... {{ design.name }}
                 </span>
                </div>
              </div>
              <div class="right floated item" id='action-buttons' style='padding-top: 10px'>
                <div id="revise-button" >
                  <div class="ui small labeled button" tabindex="0" >
                    <div
                      class="ui small basic button"
                      @click='showRevModal()'
                      :class='{disabled : this.revision.slug != "latest"}'
                    >
                      <i class="repeat icon"></i>Revise
                    </div>
                    <router-link
                      tag='a'
                      class="ui small basic left pointing label"
                      :class='{disabled : this.revision.slug != "latest"}'
                      :to='designRoute + "/settings/revs"'
                    >
                      <a>
                        {{ design.revisions.length - 1 }}
                      </a>
                    </router-link>
                  </div>
                </div>
                <div id="import-button" >
                  &nbsp&nbsp
                  <div
                    class="ui small labeled button"
                    tabindex="0"
                    >
                    <div
                      class="ui small basic button"
                      @click='showExportModal()'
                    >
                      <i class="upload icon"></i>Export
                    </div>
                    <a
                      class="ui small basic left pointing label"
                      v-if='design.imports > 0'
                      @click='viewImports()'
                    >
                      {{ design.imports }}
                    </a>
                    <div class='ui small basic left pointing label' v-else>
                      0
                    </div>
                  </div>
                </div>
                <div id='clone-button'>
                  &nbsp&nbsp
                  <div class="ui small labeled button" tabindex="0">
                    <div class="ui small basic button" @click='showCloneModal()'>
                      <i class="clone icon"></i>Clone
                    </div>
                    <a
                      v-if='design.clones > 0'
                      class="ui small basic left pointing label"
                      @click='viewClones()'
                    >
                      {{ design.clones }}
                    </a>
                    <div
                      v-else
                      class='ui small basic left pointing label'
                    >
                      0
                    </div>
                  </div>
                </div>
                <!-- <div id='share-button'>
                  &nbsp&nbsp
                  <div class="ui small labeled button" tabindex="0">
                    <div class="ui small basic button" @click='showShareModal()'>
                      <i class="share icon"></i>Share
                    </div>
                    <a
                      v-if='design.shares > 0'
                      class="ui small basic left pointing label"
                      @click='viewShares()'
                    >
                      {{ design.shares }}
                    </a>
                    <div
                      v-else
                      class='ui small basic left pointing label'
                    >
                      0
                    </div>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </div>

        <!-- spacer -->
        <div class="row" style='padding: 0px'>

          <!-- indented bom navigation pane -->
          <div class="four wide column" style='padding-top: 10px; padding-bottom: 0px'>
            <div class="ui sticky">
              <div class="ui basic segment" style='padding: 0px'>
                <div class="ui small top attached header">
                  <i class="large sitemap icon"></i>
                  <div class="content">
                    Assembly Structure

                  </div>
                </div>
                <div class="ui bottom attached clearing segment" v-if='tree'>
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
          <div class="twelve wide column" style='padding-top: 0px; padding-bottom: 0px' id='example'>
            <!-- tabular menu (records) -->
            <div class="ui large top attached fluid five item tabular menu" style='padding: 8px 0px 0px 0px'>
              <router-link tag='a' class='item' :to='this.designRoute  + "/home"'>
                <a>
                  <i class="home icon"></i>
                  Overview
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
              <router-link v-else-if='design.is_collaborator' tag='a' class='item' :to='this.designRoute + "/settings/basic"'>
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
              <router-view name='designContent' :key='design.id'></router-view>
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
      new_rev: {
        name: '',
        message: '',
        hasError: null,
        error: ''
      },
      clone: {
        name: '',
        hasError: null,
        error: ''
      },
      share: {
        email: '',
        hasError: null,
        error: ''
      },
      part: null,
      testPath: [],
      results: [],
      result: null,
      resultSelected: false,
      importQuantity: 1,
      importRevision: null,
      shareRevision: null,
      token: null,
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
      'endpoint',
      'pre_endpoint'
    ]),
    new_rev_slug() {
      return this.new_rev.name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')
    },
    clone_slug() {
      return this.clone.name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')
    },
  },
  watch: {
    node () {
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
      if (this.route.params.design_slug != this.rootDesign.slug) {
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
    showRevModal() {
      let new_rev_number = this.design.revisions.length
      this.new_rev.name = `Rev ${new_rev_number}`

      this.$nextTick(() => {
        $('#revision-modal').modal('setting', {
          autofocus: false,
          onVisible: function () {
            setTimeout(function () {
              document.getElementById("change-message").focus();
            }, 0);
          }
        }).modal('show')
      })
    },
    hideRevModal() {
      return new Promise((resolve, reject) => {
        this.new_rev = {
          name: '',
          message: '',
          hasError: null,
          error: ''
        }
        $('#revision-modal').modal('hide')
        this.$nextTick(() => {
          resolve()
        })
      })
    },
    revisePart() {

      this.new_rev.hasError = false
      this.new_rev.error = ''

      let revision_slugs = this.design.revisions.map(revision => revision.slug)

      if (revision_slugs.includes(this.new_rev_slug)) {

        // render the error message in the modal
        this.new_rev.hasError = true
        this.new_rev.error = 'Design already has a revision with this name'

      } else {
        let payload = {
          design_id: this.design.id,
          name: this.new_rev.name,
          message: this.new_rev.message
        }

        this.$http.post('revise_part/', payload).then(success => {
          if (this.env != 'prod') {
            console.log('successfully created revision for part')
            console.dir(success)
          }

          let design_payload = {
            design_slug: this.design.slug,
            owner_slug: this.design.owner_slug,
            revision_slug: this.revision.slug
          }

          this.$store.dispatch('getDesign', design_payload).then(success => {
            this.$store.commit('setDesign', success.body)
          }, error => {})

          this.hideRevModal().then(
            this.$router.push(this.designRoute + "/settings/revs")
          )

        }, error => {
          if (this.env != 'prod') {
            console.log('error creating revision for part')
            console.dir(error)
          }
        })
      }
    },
    showExportModal() {
      $('#export-modal').modal('setting', {
        detachable: false,
      }).modal('show')
      this.$nextTick(() => {
        $('#revision-dropdown').dropdown()
        let vue = this
        if (vue.env == 'prod') {
          $('.ui.search').search(
            {
              apiSettings: {
                  url: 'https://www.omnibuilds.com/shareddesignquery/?q={query}',
                  beforeXHR: function(xhr) {
                    xhr.setRequestHeader ('Authorization', 'JWT ' + vue.session.token)
                    return xhr;
                  }
                },
              fields: {
                title: 'name',
                description: 'number'
              },
              showNoResults: false,
              onSelect: function(result, response) {
                vue.resultSelected = true
                vue.result = result
                if (vue.env != 'prod') {
                  console.log('Result selected, set result Selected to true')
                }
              },
              onResults: function(response) {
                vue.results = response.results
              }
            }
          )
        } else if (vue.env == 'stage') {
          $('.ui.search').search(
            {
              apiSettings: {
                  url: 'https://stage.omnibuilds.com/shareddesignquery/?q={query}',
                  beforeXHR: function(xhr) {
                    xhr.setRequestHeader ('Authorization', 'JWT ' + vue.session.token)
                    return xhr;
                  }
                },
              fields: {
                title: 'name',
                description: 'number'
              },
              showNoResults: false,
              onSelect: function(result, response) {
                vue.resultSelected = true
                vue.result = result
                if (vue.env != 'prod') {
                  console.log('Result selected, set result Selected to true')
                }
              },
              onResults: function(response) {
                vue.results = response.results
              }
            }
          )
        } else {
          $('.ui.search').search(
            {
              apiSettings: {
                  url: 'http://localhost:8000/shareddesignquery/?q={query}',
                  beforeXHR: function(xhr) {
                    xhr.setRequestHeader ('Authorization', 'JWT ' + vue.session.token)
                    return xhr;
                  }
                },
              fields: {
                title: 'name',
                description: 'number'
              },
              showNoResults: false,
              onSelect: function(result, response) {
                vue.resultSelected = true
                vue.result = result
                if (vue.env != 'prod') {
                  console.log('Result selected, set result Selected to true')
                }
              },
              onResults: function(response) {
                vue.results = response.results
              }
            }
          )
        }

      })
    },
    hideExportModal() {
      $('#export-modal').modal('hide')
    },
    exportPart() {
      // call add existing design (will have to replicate logic from parts.vue)
      let export_design_payload = {
        root_design_id: this.result.id,
        quantity: this.importQuantity,
        existing_design_id: this.design.id,
        revision_id: this.importRevision.id,
        trail_ids: []
      }

      this.$store.dispatch('addExistingPart', export_design_payload).then(success => {
        this.hideExportModal()
        this.resultSelected = false
        this.result = {}
        this.importQuantity = 1
        this.importRevision = null

        // present a success messsage

      }, error => {

      })
    },
    viewImports() {
      let payload = {
        query: this.design.name,
        clones: false,
        imports: true

      }
      this.$store.commit('setQuery', payload)
      this.$router.push('/search')
    },
    showCloneModal() {
      this.clone.name = `Clone of ${this.design.name}`
      $('#clone-modal').modal('show')
    },
    hideCloneModal() {
      $('#clone-modal').modal('hide')
      this.clone.name = ''
    },
    clonePart() {

      this.clone.hasError = false
      this.clone.error = ''

      this.clone.name = this.clone.name.trim()

      let payload = {
        design_slug: this.clone_slug,
        owner_slug: this.profile.slug
      }
      this.$http.post('check_design/', payload).then(success => {
        if (success.body.active) {
          if (this.env != 'prod') {
            console.log('Design name is already taken')
            console.log(success)
          }
          this.clone.hasError = true
          this.clone.error = "You already have a design with the same name"
        } else {
          let payload = {
            design_id: this.design.id,
            clone_name: this.clone.name
          }
          this.$http.post('clone_design/', payload).then(success => {
            if (this.env != 'prod') {
              console.log('cloned design')
              console.dir(success)
            }

            this.hideCloneModal()

            // reset the URL to the design
            let clone_slug = success.body.slug

            // this.route.params.design_slug = clone_slug


            this.$router.push(`/${this.profile.slug}/${clone_slug}/latest/home`)
            location.reload()


          }, error => {
            if (this.env != 'prod') {
              console.log('error cloning design')
              console.dir(error)
            }
          })
        }
      }, error => {
        if (this.env != 'prod') {
          console.log('Error checking new design name')
          console.log(error)
        }
        this.hideCloneModal()
      })
    },
    viewClones() {
        let payload = {
          query: this.design.name,
          clones: true,
          imports: false

        }
        this.$store.commit('setQuery', payload)
        this.$router.push('/search')
    },
    showShareModal() {
      // $('#share-modal').modal('show')
      $('#share-modal').modal('setting', {
        detachable: false,
      }).modal('show')
      this.$nextTick(() => {
        $('#share-dropdown').dropdown()
      })
    },
    hideShareModal() {
      $('#share-modal').modal('hide')
    },
    shareDesign() {

      // validate email is correct
      // validate design has not already been shared with email
      // have to create a route to handle the unlisted design

      let share_design_payload = {
        design_id: this.design.id,
        revision_id: this.shareRevision.id,
        email: this.share.email
      }

      this.$http.post('share_design/', share_design_payload).then(success => {
        if (this.env != 'prod') {
          console.log('Shared design')
          console.dir(success)
        }
        this.share.email = ''
        this.hideShareModal()

      }, error => {
        if (this.env != 'prod') {
          console.log('Error sharing design')
          console.dir(error)
        }
      })
    },
    viewShares() {

      let payload = {

      }
      this.$store.commit('setQuery', payload)
      this.$router.push('/search')
    },
  },
  created() {
    this.$store.commit('clearDesign')
    if (this.env != 'prod') {
      console.log('Design.vue has been created')
    }

    if (this.env != 'prod') {
      console.log('Design at created is:')
      console.dir(this.design)
    }

    // console.dir(this.route.params.token)
    //
    // let share_payload = {
    //   token : this.route.params.token
    // }
    //
    // console.log(share_payload)

    // if (this.route.params.token) {
    //
    // } else {
    //
    //
    // }

    // if (this.route.params.token != null) {
    //   this.$http.post('get_shared_design/', share_payload).then(success => {
    //     if (this.env != 'prod') {
    //       console.log('got shared design')
    //       console.dir(success)
    //
    //       this.$store.commit('setDesign', success.body)
    //       this.$store.commit('setRootDesign', this.design)
    //       let tree_payload = {
    //         design_id: this.design.id,
    //         revision_slug: this.design.revisions[0].slug
    //       }
    //       this.$store.dispatch('getTree', tree_payload).then(success => {
    //         this.$store.commit('setTree', success)
    //         this.$store.commit('setNode', this.tree[0])
    //       }, error => {})
    //
    //     }
    //   }, error => {
    //     if (this.env != 'prod') {
    //       console.log('error getting shared design')
    //       console.dir(error)
    //     }
    //   })
    // } else {

    // if (this.route.params.token != null) {
    //   var design_payload = {
    //     token: this.route.params.token
    //   }
    // } else {
    //   var design_payload = {
    //     design_slug: this.route.params.design_slug,
    //     owner_slug: this.route.params.profile_slug,
    //     revision_slug: this.route.params.revision_slug,
    //   }
    // }

    let design_payload = {
      design_slug: this.route.params.design_slug,
      owner_slug: this.route.params.profile_slug,
      revision_slug: this.route.params.revision_slug,
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


  },
  mounted() {

    $('.ui.sticky').sticky({context: '#example'})
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

  .fixedElement {
    background-color: #c0c0c0;
    position:fixed;
    top:0;
    width:100%;
    z-index:100;
  }



</style>
