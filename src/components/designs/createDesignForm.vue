<template lang="html">
  <div class="ui grid">
    <div class="one wide column"></div>
    <div class="fourteen wide column">
      <div class="ui two column centered grid">
        <div class="row">
          <div class="column">
            <br>
            <br>
            <br>
            <div class="create_design">
              <div class="ui form">
                <h1 class="ui dividing header">Start a New Design Project</h1>
                <div class="field" :class="{ 'error': name.hasError}" id='design-name'>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Input a name for your design project"
                    v-model='name.data'
                    @keydown.enter='submit()'
                  >
                  <div
                    v-if='name.hasError'
                    class="has-error"
                    > {{name.error}}
                  </div>
                </div>

                <!-- <div class="field" id='design-visbility'>
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
                </div> -->

                <!-- <div class="field" id='design-license'>
                  <label> Optional License </label>
                  <select class="ui dropdown license" v-model='license'>
                    <option disabled value=""> <i class="file text icon"></i> Choose a License (optional)</option>
                    <option v-for='license in licenses' :value='license.id'> {{ license.long_name }} </option>
                  </select>
                </div> -->
                <!-- <div class="field" :class="{ 'error': description.hasError}">
                  <label>Description</label>
                  <textarea
                    name="name"
                    rows="5"
                    cols="80"
                    v-model='description.data'
                    placeholder='Provide an optional description'
                    maxlength='250'
                  >
                  </textarea>
                  <div
                    v-if='name.hasError'
                    class="has-error"
                    > {{description.error}}
                  </div>
                </div> -->
                <button class='ui basic blue button' @click='submit()'>Create Design</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="one wide column"></div>

  </div>

</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'CreateDesign',
  data () {
    return {
      name: {
        data: '',
        hasError: null,
        error: ''
      },
      visibility: 'private',
      license: 1,
      selectedLicense: null,
      licenses: [],
      description: {
        data: '',
        hasError: null,
        error: ''
      }
    }
  },
  computed: {
    ...mapState([
      'env',
      'session',
      'profile',
      'design'
    ]),
    name_slug: function() {
      return this.name.data.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')
    }
  },
  methods: {
    getLicenses() {
      this.$http.get('licenses/').then(success => {
        if (this.env != 'prod') {
          console.log('Got licenses')
          console.log(success)
        }
        this.licenses = success.body.results
      }, error => {
        if (this.env != 'prod') {
          console.log('Error getting licenses')
          console.log(error)
        }
      })
    },
    submit() {

      // reset the form
      this.name.hasError = null
      this.description.hasError = null

      // trim whitespace
      this.name.data = this.name.data.trim()
      this.description.data = this.description.data.trim()

      // name is required
      if (this.name.data === '') {
        if (this.env != 'prod') {
          console.log("Error: did not enter design name")
        }
        this.name.hasError = true
        this.name.error = 'You must enter a design name'
      } else {
        // regex check for legal project name
        let test = /^[A-Za-z0-9-_/\,;:'" ]{1,50}$/.test(this.name.data)
        if (test) {
          if (this.env != 'prod') {
            console.log('Name matches regex')
          }
          // check if this design name is already in use by this user
          let payload = {
            design_slug: this.name_slug,
            owner_slug: this.profile.slug
          }
          this.$http.post('check_design/', payload).then(response => {
            if (response.body.active) {
              if (this.env != 'prod') {
                console.log('Design name is already taken')
                console.log(response)
              }
              this.name.hasError = true
              this.name.error = "You already have a design with the same name"
            } else {
              if (this.env != 'prod') {
                console.log('Design name is available')
                console.log(response)
              }

              let design_payload = {
                name: this.name.data,
                creator: this.profile.id,
                owner: this.profile.id,
                license: 1,
                design_class: 1,
                visibility: 'PRIVATE'
              }

              this.$store.dispatch('createDesign', design_payload).then(success => {
                // this.$store.commit('setDesign', success.body)
                this.$router.push({path: `/${payload.owner_slug}/${payload.design_slug}/`})
              }, error => {
                if (error.body.non_field_errors[0]) {
                  this.name.hasError = true
                  this.name.error = error.body.non_field_errors[0]
                }
              })
            }
          }, response => {
            if (this.env != 'prod') {
              console.log('Error checking new design name')
              console.log(response)
            }
          })
        } else {
          if (this.env != 'prod') {
            console.log("Error: not a valid part name")
          }
          this.name.hasError = true
          this.name.error = 'Not a valid part name: enter a name between 1 and 50 characters, including numbers, letters, _ and - only, spaces are allowed.'
        }
      }
      // cannot be name of an existing project for this user
      // check if data cap has been exceeded
      // use dismissable alerts for error messages

    }
  },
  created() {
    // this.getLicenses()
  },
  mounted() {
    $('.ui.dropdown.visibility').dropdown({'silent': true})
    $('.ui.dropdown.license').dropdown({'silent': true})
    this.$nextTick(() => {
      let vue = this
      $('.ui.dropdown.license').dropdown(
        {
          'silent': true,
          onChange(value, text, $choice) {
            vue.license = value
          }
        }
      )
    })

  }
}
</script>

<style lang="css">
.create_design {
  padding: 1.5rem;
  margin-right: 0;
  margin-bottom: 0;
  margin-left: 0;
  border-width: .2rem;
  border: solid #f7f7f9;
}
</style>
