<template lang="html">
  <div class='ui grid'>
    <div class="row"></div>
    <div class="row" >


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
          <div v-if='design.data.images[0]' style='height:225px'>
            <!-- <span v-for='image in displayDefaultImage(design.data.images)' :key='image.url'> -->
              <img  class="ui centered rounded image" :src='selectedImage.url' style='height: 100%'>
            <!-- </span> -->
            <br>
            <div class="carousel" >
              <i class="caret left icon"></i>
              <div class="ui middle aligned horizontal selection list tiny images" style='height: 40px !important'>
                <div class="ui grid">
                  <span v-for='(designImage, index) in design.data.images'  >
                    <div class='column'>
                      <img class="ui tiny image" :src='designImage.url' @click='selectImage(index)' style='height:100%'>
                    </div>
                  </span>

                </div>


              </div>
              <i class="caret right icon"></i>
            </div>
            <br>
            <button class="ui tiny basic left floated blue button" @click='setDefaultImage()'>
              Set As Default Picture <!-- only display when not default -->
            </button>
            <button class="ui tiny basic right floated blue button" @click='selectFilesForUpload()'>
              Upload Picture
            </button>
          </div>
          <div style='text-align:center' v-else-if="revision.slug=='latest'" >
            <br><br><br><br>
            <h2 class="ui icon header" style='height: 230px'>
              <i class="camera retro icon"></i>
              <br>
              <div class="content">
                <div
                  class="ui large blue basic button"
                  @click='selectFilesForUpload()'
                >
                  Upload an image
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
          <div style='height: 320px' >
            <span v-if='design.data.summary'>
              {{ design.data.summary }}
            </span>

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
                <i class="factory icon"></i>
                <div class="content">
                  {{ design.supplier ? design.supplier.name : 'No supplier designated' }}
                </div>
              </div>
              <div class="item">
                <i class="dollar icon"></i>
                <div class="content" v-if='design.data.suppliers[0].schedules[0].unitCost != 0'>
                  {{ design.data.suppliers[0].schedules[0].unitCost }} at quantity {{ design.data.suppliers[0].schedules[0].minOrderQty }} in {{ design.data.suppliers[0].schedules[0].leadTime }} {{ design.data.suppliers[0].schedules[0].leadTimePeriod }}
                </div>
                <div class="content" v-else>
                  No cost schedule has been provided
                </div>
              </div>
              <div class="item">
                <i class="linkify icon"></i>
                <div class="content" v-if='design.data.suppliers[0].externalUrl'>
                  <a :href="design.data.suppliers[0].externalUrl">  {{ design.data.suppliers[0].externalUrl }}</a>
                </div>
                <div class="content" v-else>
                  No external url provided
                </div>
              </div>
              <div class="item">
                <i class="hashtag icon"></i>
                <div class="content">
                  {{ design.data.suppliers[0].supplierPartNumber ? design.data.suppliers[0].supplierPartNumber : 'No supplier part number provided' }}
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
          </div>
          <router-link :to='this.designRoute + "/specs" ' v-if='revision.slug == "latest"'>
            <button class='ui tiny basic grey button'>
              &nbsp Edit Specs
            </button>
          </router-link>

        </div>
      </div>
    </div>
    <div class="row">
      <div class="sixteen wide column">
        <!-- <div class="ui small top attached header">
          <i class="fa-file-text-o icon"></i>
          <div class="content">
            Tiny MCE Description
          </div>
        </div>
        <div class="ui bottom attached segment">
          <div class="tinymce" v-html='design.data.description' v-if='revision.slug == "latest"'>

          </div>
          <div v-html='design.data.description' v-else>

          </div>
          <br>
          <button
            class="ui small blue basic button"
            @click='updateDescription()'
            v-if='revision.slug == "latest"'
          >
            Update Description
          </button>
        </div>
        <br> -->
        <div class="ui small top attached header">
          <i class="fa-file-text-o icon"></i>
          <div class="content">
            Description &nbsp
          </div>
        </div>

        <div
          class="ui bottom attached segment"
          v-if='descriptionIsEditable'>
          <textarea id='summary-simple-mde' v-model='design.data.description'></textarea>
          <br>
          <button
            class="ui tiny grey basic button"
            @click='updateDescription()'
          >
            Update Description
          </button>
        </div>

        <div
          v-else
          class="ui bottom attached segment"
        >
            <div
              v-if='design.data.description'
              v-html='marked(design.data.description)'
            >
            </div>

            <div v-else>
              Click the button below to add a description for this design
            </div>
            <br>
            <button
              class="ui tiny grey basic button"
              v-if='revision.slug == "latest"'
              @click='editDescription()'
            >
              Edit Description
            </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { EventBus } from '../../event-bus.js'
import marked from 'marked'

export default {
  name: 'home',
  data () {
    return {
      specs: null,
      descriptionIsEditable: false,
      selectedImage: null,
    }
  },
  computed: {
    ...mapState([
      'session',
      'bucket',
      'profile',
      'design',
      'revision',
      'node'
    ]),
    ...mapGetters([
      'designRoute'
    ])
  },
  watch: {
    node() {
      // console.log('images are: ');
      // console.dir(this.design.data.images);
      // console.dir(this.design.id)
      this.selectedImage = null;
      // if(this.design.data.images.length > 0) {
      //   this.selectedImage = design.data.images[0];
      // }
      if (this.design.data.images.length > 0) {
        this.selectedImage = this.design.data.images[0]
      }
    }
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
                 url: s3_path + s3_key,
                 isDefault: false
               }

              // if (vue.design.data.images[0]) {
              //   vue.design.data.images.pop()
              //   vue.design.data.images.push(image)
              // } else{
              //   vue.design.data.images.push(image)
              // }

              vue.design.data.images.push(image)
              // if(!this.selectedImage) {
                console.log('image: ')
                console.dir(image)
                vue.selectedImage = image;
                console.log(vue.selectedImage)
              // }

              let payload = {
                slug: vue.design.slug,
                owner_slug: vue.design.owner_slug,
                data: {
                  data: vue.design.data
                }
              }
              vue.$store.dispatch('updateDesign', payload).then(success => {
                // vue.$store.commit('setDesign', success.body)
              }, error => {})

           }
        })
      }
      reader.readAsArrayBuffer(file)
    },
    marked(input) {
      return marked(input);
    },
    editDescription() {
      console.log('edit desc clicked')
      this.descriptionIsEditable = true
      this.$nextTick(() => {
         this.mde = new SimpleMDE({
          element: document.getElementById('summary-simple-mde'),
          status: false,
          toolbar: [
            'bold', 'italic', 'heading', '|',
            'quote', 'unordered-list', 'ordered-list', '|',
            'link', 'image', 'code', 'table', '|',
            'preview', 'side-by-side', 'fullscreen', '|',
            'guide'
          ]
        })
      })
    },
    selectImage(index) {
      console.log(index)
      this.selectedImage = this.design.data.images[index];
    },
    setDefaultImage() {
      for(let image of this.design.data.images){
        if(image.isDefault) {
          image.isDefault = false;
          break;
        }
      }
      this.selectedImage.isDefault = true;

      let payload = {
        slug: this.design.slug,
        owner_slug: this.design.owner_slug,
        data: { data: this.design.data }
      }
        this.$store.dispatch('updateDesign', payload).then(success => {

          let design_payload = {
            design_slug: this.design.slug,
            owner_slug: this.design.owner_slug,
            revision_slug: this.revision.slug
          }

          this.$store.dispatch('getDesign', design_payload)
        }, error => {})
      },
      updateDescription() {
        console.log('update desc clicked')
        this.design.data.description = this.mde.value()
        this.mde.toTextArea()
        this.descriptionIsEditable = false

        let payload = {
            slug: this.design.slug,
            owner_slug: this.design.owner_slug,
            data: {
              data: this.design.data
            }
          }
          this.$store.dispatch('updateDesign', payload).then(success => {

            let design_payload = {
              design_slug: this.design.slug,
              owner_slug: this.design.owner_slug,
              revision_slug: this.revision.slug
            }

            this.$store.dispatch('getDesign', design_payload)
          }, error => {})
      },
    },

  created() {},
  mounted() {
    this.selectedImage = this.design.data.images[0]
  },
}
</script>

<style lang="css">

  div.small.top.attached.header {
    padding: 5px 14px 5px 14px;
  }

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
