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
import { mapGetters } from 'vuex'
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
    ...mapGetters([
      'env',
      'session',
      'profile',
      'design',
      'designRefs',
      'trail'
    ]),
    name_slug: function() {
      return this.design.name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')
    }
  },
  watch: {
    design() {
      this.setLicense()
    }
  },
  methods: {
    getLicenses() {
      return new Promise((resolve, reject) => {
        this.$http.get('licenses/').then(success => {
          if (this.env != 'prod') {
            console.log('Got licenses')
            console.log(success)
          }
          this.licenses = success.body.results
          resolve()
        }, error => {
          if (this.env != 'prod') {
            console.log('Error getting licenses')
            console.log(error)
          }
          reject()
        })
      })
    },
    setLicense() {
      if (this.env != 'prod') {
        console.log('Filtering through licenses for design license')
      }

      let selectedLicense = this.licenses.filter(license => {
        return license.id == this.design.license
      })[0]

      if (this.env != 'prod') {
        console.log(selectedLicense)
      }

      $('.ui.dropdown.license').dropdown({'silent': true})
      $('.license').dropdown('set text', selectedLicense.long_name)
      $('.license').dropdown('set selected', selectedLicense.id)

      this.$nextTick(() => {
        $('.ui.dropdown.license').dropdown(
          {
            'silent': true,
            onChange(value, text, $choice) {
              if (this.env != 'prod') {
                console.log('Value is:')
                console.log(value)
              }
              this.license = value
            }
          }
        )
      })
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
          // must exclude the current name for this design
          // check if this design name is already in use by this user
          this.$http.get('designs/' + this.name_slug + '/').then(response => {
            if (this.env != 'prod') {
              console.log(response)
            }
            if (response.body.id != this.design.id) {
              if (this.env != 'prod') {
                console.log('Design name is already taken')
              }
              this.design_errors.name.hasError = true
              this.design_errors.name.error = "You already have a design with the same name"
            } else {
              if (this.env != 'prod') {
                console.log('Design name has not changed')
              }
            }
          }, response => {
            if (this.env != 'prod') {
              console.log('Design name  is available')
            }
          }
        )} else {
          if (this.env != 'prod') {
            console.log("Error: not a valid part name")
          }
          this.design_errors.name.hasError = true
          this.design_errors.name.error = 'Not a valid part name: enter a name between 1 and 50 characters, including numbers, letters, _ and - only, spaces are allowed.'
        }
      }

      if (this.design_errors.name.hasError == null) {
        let payload = {
          name: this.design.name,
          license: this.license,
          visibility: 'PRIVATE',
          // design_class: this.design.design_class
        }

        this.$store.dispatch('updateDesign', payload).then(success => {
          if (typeof success.body.non_field_errors !== 'undefined') {
            if (this.env != 'prod') {
              console.log('Error updating new design: non-field error')
            }
            this.design_errors.name.hasError = true
            this.design_errors.name.error = success.body.non_field_errors[0]
          } else {
            // have to update the breadcrumb for this design
            // filter through the trail until you get the breadcrumb with the same id as the current design
            let trail_ids = this.trail.map(breadcrumb => { return breadcrumb.design_id})
            let index = trail_ids.indexOf(this.design.id)
            let breadcrumb = this.trail[index]
            breadcrumb.name = this.design.name
            breadcrumb.slug = this.design.slug
            let payload = {
              index: index,
              breadcrumb: breadcrumb
            }
            this.$store.commit('editTrail', breadcrumb)

            // commit editTrail with the new part refs



            // if (this.env != 'prod') {
            //   console.log('Design info updated')
            //   console.log(success)
            // }
            // this.$router.push(this.designRefs.design_path + '/specs')
          }
        }, error => {})

        // this.$http.put('designs/' + this.design.slug + '/', payload).then(response => {
        //   if (this.env != 'prod') {
        //     console.log(response)
        //   }
        //   if (typeof response.body.non_field_errors !== 'undefined') {
        //     if (this.env != 'prod') {
        //       console.log('Error updating new design: non-field error')
        //     }
        //     this.design_errors.name.hasError = true
        //     this.design_errors.name.error = response.body.non_field_errors[0]
        //   } else {
        //     if (this.env != 'prod') {
        //       console.log('Design info updated')
        //       console.log(response)
        //     }
        //     this.$router.push(this.designRefs.design_path + '/specs')
        //   }
        // }, response => {
        //   if (this.env != 'prod') {
        //     console.log('Error creating new design')
        //     console.log(response)
        //   }
        // })
      }
    },

  },
  created() {
    this.getLicenses().then(success => {
      if (this.env != 'prod') {
        console.log('Got licenses at created')
      }
      EventBus.$emit('got-licenses')
    }, error => {
      if (this.env != 'prod') {
        console.log('Error getting licenses at created')
      }
    })
  },
  mounted: async function() {
    $('.ui.dropdown.visibility').dropdown({'silent': true})
    $('.visibility').dropdown('set text', 'Private')
    $('.visibility').dropdown('set selected', 1)

    let vue = this
    EventBus.$once('got-licenses', function() {
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
    })
  }
}
</script>

<style lang="css">
</style>
