<template lang="html">
  <div>
    <div class='ui small top attached header'>
      <i class="fa fa-info-circle text-primary" aria-hidden="true"></i>
      <div class="content">
        &nbsp
        Info
      </div>
    </div>
    <div class="ui bottom attached clearing segment">
      <div class="ui form">
        <div class="field" :class="{ 'error': design_errors.name.hasError}">
          <label>Design Name</label>
          <input v-model='design.name' type='text' maxlength='50'>
          <div v-if='design_errors.name.hasError' class="has-error"> {{design_errors.name.error}} </div>
        </div>
        <div class="field" id='design-visbility'>
          <label>Visibility Level</label>
          <div class="ui selection dropdown visibility">
            <input type="hidden" name="visibility">
            <i class="dropdown icon"></i>
            <div class="default text">
              <i class="lock icon"></i>
              Choose a Visibility Level
            </div>
            <div class="menu">
              <div class="item" data-value="1">Private</div>
              <div class="disabled item" data-value="2">Public (coming soon)</div>
            </div>
          </div>
        </div>

        <!-- <div class="field" id='design-license'>
          <label> Optional License </label>
          <select class="ui dropdown license" v-model='license'>
            <option disabled value=""> <i class="file text icon"></i> Choose a License (optional)</option>
            <option v-for='license in licenses' :value='license.id'> {{ license.long_name }} </option>
          </select>
        </div> -->
        <!-- <div class="field" :class="{ 'error': design_errors.description.hasError}">
          <label>Description</label>
          <textarea name='description' cols="8" rows="5" maxlength='250' v-model='design.description'></textarea>
          <div v-if='design_errors.description.hasError' class="has-error"> {{design_errors.description.error}} </div>
        </div>
        <div class="field">
          <label for="picture" class='control-label'>Project Image</label>
          <span v-if='design.picture'>
            <br>
            <img :src='design.picture' style='height:40px'/>
            <br><br>
          </span>
          <input class="form-control" id="picture" name="picture" type="file">
        </div>
        <div class="field">
          <label>Visibility</label>
          <select class="ui dropdown" v-model='design.visibility'>
            <option value=''>Choose Visibility Level</option>
            <option value='1'>Private</option>
            <option value='2'>Protected</option>
            <option value='3'>Public</option>
          </select>
        </div>
        <div class="field">
          <label>License</label>
          <select class="ui dropdown" v-model='design.license'>
            <option value=''>Choose License Type</option>
            <option value='1'>None</option>
            <option value='2'>Protected</option>
            <option value='3'>Public</option>
          </select>
        </div> -->
        <button class='ui small basic blue button' @click='submit'>
          Update Design
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from '../../../event-bus.js'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'home',
  data () {
    return {
      design_errors: {
        name: {
          hasError: null,
          error: '',
        },
        picture: {
          hasError: null,
          error: ''
        },
      },
      visibility: 'private',
      license: 1,
      licenses: [],
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
      'trail',
      'tree',
      'route',
      'node'
    ]),
    ...mapGetters([
      'designRoute',
    ]),
    name_slug: function() {
      return this.design.name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')
    }
  },
  watch: {
    // design() {
    //   this.setLicense()
    // }
  },
  methods: {
    // getLicenses() {
    //   return new Promise((resolve, reject) => {
    //     this.$http.get('licenses/').then(success => {
    //       if (this.env != 'prod') {
    //         console.log('Got licenses')
    //         console.log(success)
    //       }
    //       this.licenses = success.body.results
    //       resolve()
    //     }, error => {
    //       if (this.env != 'prod') {
    //         console.log('Error getting licenses')
    //         console.log(error)
    //       }
    //       reject()
    //     })
    //   })
    // },
    // setLicense() {
    //   if (this.env != 'prod') {
    //     console.log('Filtering through licenses for design license')
    //   }
    //
    //   let selectedLicense = this.licenses.filter(license => {
    //     return license.id == this.design.license
    //   })[0]
    //
    //   if (this.env != 'prod') {
    //     console.log(selectedLicense)
    //   }
    //
    //   $('.ui.dropdown.license').dropdown({'silent': true})
    //   $('.license').dropdown('set text', selectedLicense.long_name)
    //   $('.license').dropdown('set selected', selectedLicense.id)
    //
    //   this.$nextTick(() => {
    //     $('.ui.dropdown.license').dropdown(
    //       {
    //         'silent': true,
    //         onChange(value, text, $choice) {
    //           if (this.env != 'prod') {
    //             console.log('Value is:')
    //             console.log(value)
    //           }
    //           this.license = value
    //         }
    //       }
    //     )
    //   })
    // },
    updatePartandNode(tree, part_id) {
      let index = 0
      for (let part of tree) {
        if (part.unique_id == part_id) {
          let updated_part = {
            isOpen: part.isOpen,
            design_id: part.design_id,
            design_name: this.design.name,
            design_slug: this.name_slug,
            owner_slug: part.owner_slug,
            revision_slug: part.revision_slug,
            parent_id: part.parent_id,
            unique_id: part.unique_id,
            parts: part.parts
          }

          tree.splice(index, 1, updated_part)
          this.$store.commit('setNode', updated_part)
        }
        if (part.parts.length > 0) {
          this.updatePartandNode(part.parts, part_id)
        }
        index += 1
      }
    },
    submit() {

      this.design_errors.name.hasError = null
      this.design.name = this.design.name.trim()

      if(this.design.name == '') {
        if (this.env != 'prod') {
          console.log("Error: did not enter design name")
        }
        this.design_errors.name.hasError = true
        this.design_errors.name.error = 'You must enter a design name'
      } else {
        let test = /^[A-Za-z0-9-_ ]{1,50}$/.test(this.design.name)
        if (test) {
          if (this.env != 'prod') {
            console.log('Name matches regex')
          }

          let payload = {
            design_slug: this.name_slug,
            owner_slug: this.profile.slug
          }

          if (this.env != 'prod') {
            console.dir(payload)
          }

          this.$http.post('check_design/', payload).then(success => {
            if (success.body.active) {
              if (this.env != 'prod') {
                console.log('Design name is already taken')
                console.log(success)
              }
              this.design_errors.name.hasError = true
              this.design_errors.name.error = "You already have a design with the same name"
            } else {
              let payload = {
                slug: this.design.slug,
                owner_slug: this.design.owner_slug,
                data: {
                  name: this.design.name,
                  license: this.license,
                  visibility: 'PRIVATE',
                  // design_class: this.design.design_class
                }
              }

              if (this.env != 'prod') {
                console.log(payload)
              }

              this.$store.dispatch('updateDesign', payload).then(success => {
                if (typeof success.body.non_field_errors !== 'undefined') {
                  if (this.env != 'prod') {
                    console.log('Error updating new design: non-field error')
                  }
                  this.design_errors.name.hasError = true
                  this.design_errors.name.error = success.body.non_field_errors[0]
                } else {
                  if (this.rootDesign.id == this.design.id) {
                    if (this.env != 'prod') {
                      console.log('Updating root design, reloading the page to trigger updates')
                    }

                    // let params_payload = {
                    //   profile_slug: this.profile.slug,
                    //   design_slug: this.name_slug,
                    //   revision_slug: 'latest'
                    // }
                    //
                    // this.$store.commit('setRouteParams', params_payload)
                    // this.$router.push(`/${this.designRoute}/settings/basic`)

                    this.$router.push(`/${this.profile.slug}/${this.name_slug}/latest/settings/basic`)
                    location.reload()



                    // in design.vue created the following should occur
                      // gets the root design
                      // sets design equal to root design
                      // gets the tree
                      // sets the node
                      // creates the trail
                  } else {
                    // fetch the updated design
                    // manually update the tree
                    // manually update the node
                    // the trail should update automatically
                    if (this.env != 'prod') {
                      console.log('Updating a child node, modifying the objects manually')
                    }
                    let design_payload = {
                      design_slug: this.name_slug,
                      owner_slug: this.design.owner_slug,
                      revision_slug: 'latest'
                    }
                    this.$store.dispatch('getDesign', design_payload).then(success => {
                      this.$store.commit('setDesign', success.body)
                    }, error => {})
                    this.updatePartandNode(this.tree, this.node.unique_id)
                  }
                }
              }, error => {})
            }
          }, error => {})
        }
      }
    }
  },
  created() {
    // this.getLicenses().then(success => {
    //   if (this.env != 'prod') {
    //     console.log('Got licenses at created')
    //   }
    //   EventBus.$emit('got-licenses')
    // }, error => {
    //   if (this.env != 'prod') {
    //     console.log('Error getting licenses at created')
    //   }
    // })
  },
  mounted: async function() {
    $('.ui.dropdown.visibility').dropdown({'silent': true})
    $('.visibility').dropdown('set text', 'Private')
    $('.visibility').dropdown('set selected', 1)

    // let vue = this
    // EventBus.$once('got-licenses', function() {
      // console.log('Filtering through licenses for design license')
      //
      // let selectedLicense = vue.licenses.filter(license => {
      //   console.log(license.id)
      //   console.log(vue.design.license)
      //   return license.id == vue.design.license
      // })[0]
      //
      // console.log(selectedLicense)
      //
      // $('.ui.dropdown.license').dropdown({'silent': true})
      // $('.license').dropdown('set text', selectedLicense.long_name)
      // $('.license').dropdown('set selected', selectedLicense.id)
      //
      // this.$nextTick(() => {
      //   let vue = this
      //   $('.ui.dropdown.license').dropdown(
      //     {
      //       'silent': true,
      //       onChange(value, text, $choice) {
      //         console.log('Value is:')
      //         console.log(value)
      //         vue.license = value
      //       }
      //     }
      //   )
      // })
    // })
  }
}
</script>

<style lang="css">
</style>
