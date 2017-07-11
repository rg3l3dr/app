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
        <div class="field" :class="{ 'error': design_errors.description.hasError}">
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
            <!-- <option value='2'>Protected</option>
            <option value='3'>Public</option> -->
          </select>
        </div>
        <div class="field">
          <label>License</label>
          <select class="ui dropdown" v-model='design.license'>
            <option value=''>Choose License Type</option>
            <option value='1'>None</option>
            <!-- <option value='2'>Protected</option>
            <option value='3'>Public</option> -->
          </select>
        </div>
        <button class='ui button' @click='submit'>
          Update Design
        </button>
      </div>
    </div>
  </div>
</template>

<script>
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
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'session',
      'profile',
      'design',
      'refs'
    ]),
    name_slug: function() {
      return this.design.name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')
    }
  },
  methods: {
    submit: function() {

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
            if (response.body.id !=  this.design.id) {
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
          description: this.design.description
        }
        this.$http.put('designs/' + this.design.slug + '/', payload).then(response => {
          console.log(response)
          if (typeof response.body.non_field_errors !== 'undefined') {
            console.log('Error updating new design: non-field error')
            this.design_errors.name.hasError = true
            this.design_errors.name.error = response.body.non_field_errors[0]
          } else {
            console.log('Design info updated')
            this.$router.push( this.refs.path + '/home')
          }
        }, response => {
          console.log('Error creating new design')
          console.log(response)
        })
      }
    },
    created: function() {
      $('select.dropdown').dropdown()
    },
    mounted: function() {

    }
  }
}
</script>

<style lang="css">
</style>
