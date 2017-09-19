<template lang="html">
  <div class='ui grid'>
    <div class="row"></div>
    <div class="row">


      <div class="eight wide column" id='images'>
        <div class="ui small top attached header">
          <i class="fa-picture-o icon"></i>
          <div class="content">
            Images
          </div>
        </div>
        <div class="ui bottom attached clearing segment">
          <input
            type="file"
            accept="image/*"
            id='upload-file-input'
            @click="$store.dispatch('getToken')"
            @change='uploadImage($event)'
            style='display:none'
          >
          <div class="ui fluid rounded image" v-if='design.data.images[0]'>
            <img :src='design.data.images[0].url'>
            <br>
            <div class="carousel">
              <i class="caret left icon"></i>
              <div class="ui middle aligned horizontal selection list tiny images">
                <span class ="" v-for='designImage in design.data.images'>
                  <img class="ui image carousel-thumbnail" :src='designImage.url'>
                </span>
              </div>
              <i class="caret right icon"></i>
            </div>
            <br>
            <button class="ui small basic left floated blue button" @click='selectFilesForUpload()'>
              Set As Default Image <!-- only display when not default -->
            </button>
            <button class="ui small basic right floated blue button" @click='selectFilesForUpload()'>
              Upload Image
            </button>
          </div>
          <div style='text-align:center' v-else-if="$route.params.revision_slug=='latest'" >
            <br>
            <h2 class="ui icon header" >
              <i class="camera retro icon"></i>
              <br>
              <div class="content">
                <div class="ui large blue basic button" @click='selectFilesForUpload()'>
                  Click here to add a picture
                </div>
              </div>
            </h2>
          </div>
          <div v-else style='text-align:center' @click='selectFilesForUpload'>
            <br>
            <h2 class="ui icon header" >
              <i class="camera retro icon"></i>
              <br>
              <div class="content">
                Change rev back to latest to add a picture
                <div class="sub header">
                  <br>
                  Your project is read only when you are not on the latest revision
                </div>
              </div>
            </h2>
          </div>
        </div>
      </div>
      <div class="eight wide column" id='specs'>
        <div class="ui small top attached header">
          <i class="fa-list-ul icon"></i>
          <div class="content">
            Specifications
          </div>
        </div>
        <div class="ui bottom attached clearing segment">
          <div class="ui relaxed divided list">
            <div class="item">
              <i class="folder open outline icon"></i>
              <div class="content">
                {{ design.name }}
              </div>
            </div>
            <div class="item">
              <i class="hashtag icon"></i>
              <div class="content">
                {{ design.data.autoPartNumber }}
              </div>
            </div>
            <div class="item">
              <i class="tag icon"></i>
              <div class="content">
                {{ design.design_class.code }}: {{ design.design_class.name }}
              </div>
            </div>
            <div class="item">
              <i class="dollar icon"></i>
              <div class="content">
                {{ design.data.suppliers[0].schedules[0].unitCost }}
              </div>
            </div>
            <div class="item" v-if='design.defaultSupplier'>
              <i class="factory icon"></i>
              <div class="content">
                {{ design.defaultSupplier.name }}
              </div>
            </div>
            <div class="item" v-if='design.defaultURL'>
              <i class="linkify icon"></i>
              <div class="content">
                {{ design.defaultURL }}
              </div>
            </div>
            <div class="item">
              <i class="edit icon"></i>
              <div class="content">
                <span v-if='design.edited_at'>
                  Last updated by
                  <router-link :to="`/${design.editor_slug}`" tag='a'>
                    {{ design.editor_slug }}
                  </router-link>
                    on {{ design.edited_at | moment("MMMM Do YYYY") }}
                </span>
                <span v-else>
                  No updates yet
                </span>
              </div>
            </div>

          </div>



          <router-link :to='this.designRoute + "/specs" ' v-if='$route.params.revision_slug == "latest"'>
            <button class='ui right floated small basic blue button'>
              &nbsp Edit Specs
            </button>
          </router-link>

        </div>
      </div>
    </div>
    <div class="row">
      <div class="sixteen wide column">
        <div class="ui small top attached header">
          <i class="fa-file-text-o icon"></i>
          <div class="content">
            Description
          </div>
        </div>
        <div class="ui bottom attached segment">
         <div v-if='!descriptionIsEditable'>
           {{ design.data.description }}
           <br><br>
           <button
             class="ui small blue basic button"
             @click='descriptionIsEditable=true'
           >
             Edit Description
           </button>
         </div>
         <div v-else>
           <textarea rows="12" cols="120" v-model='design.data.description'>
           </textarea>
           <br><br>

           <button
             class="ui small blue basic button"
             @click='updateDescription'
           >
             Update Description
           </button>
         </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { EventBus } from '../../event-bus.js'
export default {
  name: 'home',
  data () {
    return {
      specs: null,
      descriptionIsEditable: false,
    }
  },
  computed: {
    ...mapState([
      'session',
      'bucket',
      'profile',
      'design',
    ]),
    ...mapGetters([
      'designRoute'
    ])
  },
  watch: {

  },
  methods: {


    selectFilesForUpload() {
      // click the hidden files input button
      let fileElem = document.getElementById("upload-file-input")
      fileElem.click()
    },
    uploadImage($event) {
      let filesInput = event.target.files
      let file = filesInput[0]
      let reader = new FileReader()
      var array_buffer
      let vue = this
      reader.onloadend = function () {
        array_buffer = reader.result
        let s3 = new AWS.S3()
        let s3_path = `https://s3-us-west-2.amazonaws.com/${vue.bucket}/`
        let s3_key = 'designs/' + vue.design.owner + '/' + vue.design.id + '/' + file.name
        let params = {
          Body: array_buffer,
          Bucket: vue.bucket,
          Key: s3_key
         }
         s3.putObject(params, function(err, data) {
           if (err) {
             if (vue.env != 'prod') {
               console.log(err, err.stack); // an error occurred

             }
           } else {
             if (vue.env != 'prod') {
               console.log(data)

             }
             let image = {
                 name: file.name,
                 type: file.type,
                 size: file.size,
                 url: s3_path + s3_key
               }

              vue.design.data.images.push(image)

              let payload = {
                slug: vue.design.slug,
                owner_slug: vue.design.owner_slug,
                data: {
                  data: vue.design.data
                }
              }
              vue.$store.dispatch('updateDesign', payload)
           }
        })
      }
      reader.readAsArrayBuffer(file)
    },
    updateDescription() {

      let payload = {
        slug: this.design.slug,
        owner_slug: this.design.owner_slug,
        data: {
          data: this.design.data
        }
      }
      this.$store.dispatch('updateDesign', payload).then(success => {
        this.descriptionIsEditable = false
      }, error => {})
    },
  },
  created: function() {

  },
}
</script>

<style lang="css">
div.small.top.attached.header {
  padding: 5px 14px 5px 14px;
}

</style>
