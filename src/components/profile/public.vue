<template lang="html">
  <div id='profile'>
    <div class='ui small top attached header'>
      <i class="fa fa-user text-primary" aria-hidden="true"></i>
      <div class="content">
        &nbsp
        Public Profile
      </div>
    </div>
    <div class="ui bottom attached clearing segment">
      <form class='ui form' id='profileForm' enctype="multipart/form-data">

        <div class="field has-feedback"
          :class="{
            'has-success': errors.profile.public_name.isValid,
            'error': errors.profile.public_name.isValid == false || errors.profile.public_name.hasError
            }">
          <label for="public_name" class='control-label'>Public Name</label>
          <input v-model='profile.public_name' type="text" class="form-control" id="public_name" placeholder="">
          <span v-if='errors.profile.public_name.isValid' class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
          <span v-else-if='errors.profile.public_name.hasError || errors.profile.public_name.isValid == false' class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
          <span
            v-if='errors.profile.public_name.isValid == false'
            class="help-block"
            >Enter a valid name
          </span>
          <span
            v-else-if='errors.profile.public_name.hasError'
            class="help-block"
            > {{errors.profile.public_name.error}}
          </span>
        </div>

        <div class="field has-feedback"
          :class="{
            'has-success': errors.profile.public_email.isValid,
            'error': errors.profile.public_email.isValid == false || errors.profile.public_email.hasError
            }">
          <label for="public_email" class='control-label'>Public Email</label>
          <input v-model='profile.public_email' type="email" class="form-control" id="public_email" placeholder="">
          <span v-if='errors.profile.public_email.isValid' class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
          <span v-else-if='errors.profile.public_email.hasError || errors.profile.public_email.isValid == false' class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
          <span
            v-if='errors.profile.public_email.isValid == false'
            class="help-block"
            >Enter a valid email address
          </span>
          <span
            v-else-if='errors.profile.public_email.hasError'
            class="help-block"
            > {{errors.profile.public_email.error}}
          </span>
        </div>

        <div class="field has-feedback"
          :class="{
            'has-success': errors.profile.website.isValid,
            'error': errors.profile.website.isValid == false || errors.profile.website.hasError
            }">
          <label for="website" class='control-label'>Website</label>
          <input v-model='profile.website' type="text" class="form-control" id="website" placeholder="">
          <span v-if='errors.profile.website.isValid' class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
          <span v-else-if='errors.profile.website.hasError || errors.profile.website.isValid == false' class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
          <span
            v-if='errors.profile.website.isValid == false'
            class="help-block"
            >Enter a valid url
          </span>
          <span
            v-else-if='errors.profile.website.hasError'
            class="help-block"
            > {{errors.profile.website.error}}
          </span>
        </div>

        <div class="field has-feedback"
          :class="{
            'has-success': errors.profile.location.isValid,
            'error': errors.profile.location.isValid == false || errors.profile.location.hasError
            }">
          <label for="location" class='control-label'>Location</label>
          <input v-model='profile.location' type="email" class="form-control" id="location" placeholder="">
          <span v-if='errors.profile.location.isValid' class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
          <span v-else-if='errors.profile.location.hasError || errors.profile.location.isValid == false' class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
          <span
            v-if='errors.profile.location.isValid == false'
            class="help-block"
            >Enter a location
          </span>
          <span
            v-else-if='errors.profile.location.hasError'
            class="help-block"
            > {{errors.profile.location.error}}
          </span>
        </div>

        <div class="field has-feedback"
          :class="{
            'has-success': errors.profile.picture.isValid,
            'error': errors.profile.picture.isValid == false || errors.profile.picture.hasError
            }">
          <label for="picture" class='control-label'>Picture</label>
          <span v-if='profile.picture'>
            <br>
            <img :src='profile.picture' style='height:40px'/>
            <br><br>
          </span>
          <input class="form-control" id="picture" name="picture" type="file">
        </div>

        <div class="field has-feedback"
          :class="{
            'has-success': errors.profile.about.isValid,
            'error': errors.profile.about.isValid == false || errors.profile.about.hasError
            }">
          <label for="about" class='control-label'>About</label>
          <textarea v-model='profile.about' rows='5' class="form-control" id="about" placeholder=""></textarea>
          <span v-if='errors.profile.about.isValid' class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
          <span v-else-if='errors.profile.about.hasError || errors.profile.about.isValid == false' class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
          <span
            v-if='errors.profile.about.isValid == false'
            class="help-block"
            >Enter a valid description
          </span>
          <span
            v-else-if='errors.profile.about.hasError'
            class="help-block"
            > {{errors.profile.about.error}}
          </span>
        </div>

        <h4 v-if='errors.profile.updated===true' style='color:#468847;'>
          Successfully updated profile
        </h4>
        <h4 v-else-if='errors.profile.updated===false' style='color:#b94a48;'>
          Unable to update profile, please correct the noted fields
        </h4>
        <button class='ui button ' id='update_profile_btn' @click.prevent='updateProfile'>
      Update Profile
        </button>
      </form>

    </div>
  </div><!-- /.tab-pane fade in active -->
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  created: function() {
    this.$store.commit('getProfile')
    this.errors.profile.updated = null
  },
  data() {
    return {
      errors: {
        profile: {
          updated: null,
          public_name: {
            isValid: null,
            hasError: null,
            error: null
          },
          public_email: {
            isValid: null,
            hasError: null,
            error: null
          },
          website: {
            isValid: null,
            hasError: null,
            error: null
          },
          location: {
            isValid: null,
            hasError: null,
            error: null
          },
          about: {
            isValid: null,
            hasError: null,
            error: null
          },
          picture: {
            isValid: null,
            hasError: null,
            error: null
          }
        }
      },
      image: null
    }
  },
	computed: {
    ...mapGetters([
      'session',
      'profile'
    ])
	},
	methods: {
    updateProfile() {
      // validate name
      if (this.profile.public_name) {
        this.profile.public_name = this.profile.public_name.trim()
      }
      if (this.profile.public_email) {
        this.profile.public_email = this.profile.public_email.trim()
      }
      if (this.profile.website) {
        this.profile.website = this.profile.website.trim()
      }
      if (this.profile.location) {
        this.profile.location = this.profile.location.trim()
      }
      if (this.profile.about) {
        this.profile.about = this.profile.about.trim()
      }


      this.errors.profile.public_name.isValid = true
      this.errors.profile.public_name.hasError = null
      this.errors.profile.public_name.error = null
      // validate email
      let test = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(this.profile.public_email)
      if (test) {
        this.errors.profile.public_email.isValid = true
        this.errors.profile.public_email.hasError = null
        this.errors.profile.public_email.error = null
      } else {
        this.errors.profile.public_email.isValid = false
      }
      // validate website
      this.errors.profile.website.isValid = true
      this.errors.profile.website.hasError = null
      this.errors.profile.website.error = null

      // validate location
      this.errors.profile.location.isValid = true
      this.errors.profile.location.hasError = null
      this.errors.profile.location.error = null

      // validate about
      this.errors.profile.about.isValid = true
      this.errors.profile.about.hasError = null
      this.errors.profile.about.error = null

      let formData = new FormData()
      if (this.profile.public_name) {
        formData.append('public_name', this.profile.public_name)
      }
      if (this.profile.public_email) {
        formData.append('public_email', this.profile.public_email)
      }
      if (this.profile.website) {
        formData.append('website', this.profile.website)
      }
      if (this.profile.location) {
        formData.append('location', this.profile.location)
      }
      if (this.profile.about) {
        formData.append('about', this.profile.about)
      }
      if ($('input[type=file]')[0].files[0]) {
        formData.append('picture', $('input[type=file]')[0].files[0]);
      }

      this.$http.put('profiles/' + this.profile.name + '/', formData, { headers: { 'Content-Type': 'multipart/form-data'}}).then(response => {

        console.log(response)

        if (typeof response.body.plan === 'undefined') {
          if (typeof response.body.public_email !== 'undefined') {
            this.errors.profile.public_email.isValid = null
            this.errors.profile.public_email.hasError = true
            this.errors.profile.public_email.error = response.body.public_email[0]
            this.errors.profile.updated = false
          }
          if (typeof response.body.public_name !== 'undefined') {
            this.errors.profile.public_name.isValid = null
            this.errors.profile.public_name.hasError = true
            this.errors.profile.public_name.error = response.body.public_name[0]
            this.errors.profile.updated = false
          }
          if (typeof response.body.website !== 'undefined') {
            this.errors.profile.website.isValid = null
            this.errors.profile.website.hasError = true
            this.errors.profile.website.error = response.body.website[0]
            this.errors.profile.updated = false
          }
          if (typeof response.body.location !== 'undefined') {
            this.errors.profile.location.isValid = null
            this.errors.profile.location.hasError = true
            this.errors.profile.location.error = response.body.location[0]
            this.errors.profile.updated = false
          }
          if (typeof response.body.about !== 'undefined') {
            this.errors.profile.about.isValid = null
            this.errors.profile.about.hasError = true
            this.errors.profile.about.error = response.body.about[0]
            this.errors.profile.updated = false
          }
        } else {
          this.errors.profile.updated = true
        }

        if (this.errors.profile.updated === false) {
          console.log('Error updating profile')
        } else {
          console.log('Update profile successful')
          this.$router.push('/home')
        }


        // get the token and user
      }, response => {
        console.log('Error updating profile')
        console.log(response)
        this.errors.profile.updated = false
        if (typeof response.body.public_email !== 'undefined') {
          this.errors.profile.public_email.isValid = null
          this.errors.profile.public_email.hasError = true
          this.errors.profile.public_email.error = response.body.public_email[0]
          this.errors.profile.updated = false
        }
        if (typeof response.body.public_name !== 'undefined') {
          this.errors.profile.public_name.isValid = null
          this.errors.profile.public_name.hasError = true
          this.errors.profile.public_name.error = response.body.public_name[0]
          this.errors.profile.updated = false
        }
        if (typeof response.body.website !== 'undefined') {
          this.errors.profile.website.isValid = null
          this.errors.profile.website.hasError = true
          this.errors.profile.website.error = response.body.website[0]
          this.errors.profile.updated = false
        }
        if (typeof response.body.location !== 'undefined') {
          this.errors.profile.location.isValid = null
          this.errors.profile.location.hasError = true
          this.errors.profile.location.error = response.body.location[0]
          this.errors.profile.updated = false
        }
        if (typeof response.body.about !== 'undefined') {
          this.errors.profile.about.isValid = null
          this.errors.profile.about.hasError = true
          this.errors.profile.about.error = response.body.about[0]
          this.errors.profile.updated = false
        }
      })
    },
	}
}
</script>

<style lang="css">
</style>
