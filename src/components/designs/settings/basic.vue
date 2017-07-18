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

        <div class="field" id='design-license'>
          <label> Optional License </label>
          <select class="ui dropdown license" v-model='license'>
            <option disabled value=""> <i class="file text icon"></i> Choose a License (optional)</option>
            <option v-for='license in licenses' :value='license.id'> {{ license.long_name }} </option>
          </select>
        </div>
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
        <button class='ui button' @click='submit'>
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
        description: {
          hasError: null,
          error: ''
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
      'session',
      'profile',
      'design',
      'designRefs'
    ]),
    name_slug: function() {
      return this.design.name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')
    }
  },
  methods: {
    getLicenses() {
      return new Promise((resolve, reject) => {
        this.$http.get('licenses/').then(success => {
          console.log('Got licenses')
          console.log(success)
          this.licenses = success.body.results
          resolve()
        }, error => {
          console.log('Error getting licenses')
          console.log(error)
          reject()
        })
      })
    },
    submit() {

      this.design_errors.name.hasError = null
      this.design_errors.description.hasError = null

      this.design.name = this.design.name.trim()
      this.design.description = this.design.description.trim()

      if(this.design.name == '') {
        console.log("Error: did not enter design name")
        this.design_errors.name.hasError = true
        this.design_errors.name.error = 'You must enter a design name'
      } else {
        let test = /^[A-Za-z0-9-_ ]{1,50}$/.test(this.design.name)
        if (test) {
          console.log('Name matches regex')
          // must exclude the current name for this design
          // check if this design name is already in use by this user
          this.$http.get('designs/' + this.name_slug + '/').then(response => {
            console.log(response)
            if (response.body.id != this.design.id) {
              console.log('Design name is already taken')
              this.design_errors.name.hasError = true
              this.design_errors.name.error = "You already have a design with the same name"
            } else {
              console.log('Design name has not changed')
            }
          }, response => {
            console.log('Design name  is available')
          }
        )} else {
          console.log("Error: not a valid part name")
          this.design_errors.name.hasError = true
          this.design_errors.name.error = 'Not a valid part name: enter a name between 1 and 50 characters, including numbers, letters, _ and - only, spaces are allowed.'
        }
      }

      if (this.design_errors.name.hasError == null) {
        let payload = {
          name: this.design.name,
          creator: this.design.creator,
          license: this.license,
          visibility: 'PRIVATE'
        }
        console.log(payload)
        this.$http.put('designs/' + this.design.slug + '/', payload).then(response => {
          console.log(response)
          if (typeof response.body.non_field_errors !== 'undefined') {
            console.log('Error updating new design: non-field error')
            this.design_errors.name.hasError = true
            this.design_errors.name.error = response.body.non_field_errors[0]
          } else {
            console.log('Design info updated')
            console.log(response)
            this.$router.push(this.designRefs.design_path + '/specs')
          }
        }, response => {
          console.log('Error creating new design')
          console.log(response)
        })
      }
    },

  },
  created() {
    this.getLicenses().then(success => {
      console.log('Got licenses at created')
      EventBus.$emit('got-licenses')
    }, error => {
      console.log('Error getting licenses at created')
    })
  },
  mounted() {
    $('.ui.dropdown.visibility').dropdown({'silent': true})
    $('.visibility').dropdown('set text', 'Private')
    $('.visibility').dropdown('set selected', 1)

    let vue = this
    EventBus.$once('got-licenses', function() {
      console.log('Filtering through licenses for design license')

      let selectedLicense = vue.licenses.filter(license => {
        return license.id == vue.design.license
      })[0]

      $('.ui.dropdown.license').dropdown({'silent': true})
      $('.license').dropdown('set text', selectedLicense.long_name)
      $('.license').dropdown('set selected', selectedLicense.id)

      this.$nextTick(() => {
        let vue = this
        $('.ui.dropdown.license').dropdown(
          {
            'silent': true,
            onChange(value, text, $choice) {
              console.log('Value is:')
              console.log(value)
              vue.license = value
            }
          }
        )
      })
    })
  }
}
</script>

<style lang="css">
</style>
