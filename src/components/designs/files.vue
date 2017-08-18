<template lang="html">
  <div>
    <div></div>
    <div class="ui top attached grey header">
      DESIGN FILES &#8212; Upload any CAD files, renderings, or drawings and retain the full version history
    </div>
    <transition name='fade'>
      <div class="ui bottom attached segment" v-if='!selectedFile'>
        <!-- <transition name='fade'> -->
          <div v-if='files.data && files.data.length > 0'>
            <table class="ui striped selectable table" id='files-table'>
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Last Change</th>
                  <th>Size</th>
                  <th>Versions</th>
                  <th></th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tfoot>
              <tbody name='fade' is='transition-group'>
                <tr v-for='(file, index) in this.files.data' :key='file.name'>

                  <td id='file-name'>
                    <a href='#' @click='getFileFromS3(index)'>
                      {{ file.name }}
                    </a>
                  </td>

                  <td id='file-last-change'>

                    <router-link
                      v-if='file.uploaded'
                      :to='"/" + file.versions[file.versions.length - 1].editor_slug'
                      tag='a'
                    >
                      {{ file.versions[file.versions.length - 1].editor_slug }}
                    </router-link>

                    <span>
                      {{ file.versions[file.versions.length - 1].message }}
                      <span v-if='file.versions[file.versions.length - 1].message == "Uploading"'>
                        &nbsp &nbsp
                        <i class="fa fa-spinner fa-pulse"></i>
                        <span class="sr-only">Loading...</span>
                      </span>
                    </span>

                    <span v-if='file.uploaded'>
                      {{ file.versions[file.versions.length - 1].updated_at | moment("from", "now") }}
                    </span>

                  </td>

                  <td id='file-size'>
                    {{ formatBytes(file.versions[file.versions.length - 1].size, 0) }}
                  </td>

                  <td id='file-versions'>
                    <router-link to='' tag='a' @click.native='showVersions(index)'>
                      <span v-if='file.versions'>
                        {{ file.versions.length }}
                      </span>
                      <span v-else>
                        1
                      </span>
                    </router-link>
                  </td>

                  <td id='file-menu'>
                    <div class="ui icon top left pointing mini basic dropdown button options">
                      <i class="caret down icon"></i>
                      <div class="menu">
                        <div class="item">File Options</div>
                        <div class="item" @click='getFileFromS3(index)'>
                          <i class="download icon"></i>
                          Download File
                        </div>
                        <div
                          v-if='$route.params.rev_slug == "latest"'
                          class="item"
                          @click='selectFilesForUpload'
                        >
                          <i class="upload icon"></i>
                          Upload New Version
                        </div>
                        <div class="item" @click='showVersions(index)'>
                          <i class="history icon"></i>
                          See Version History
                        </div>
                        <div
                          v-if='$route.params.rev_slug == "latest"'
                          class="item"
                          @click='deleteFileAndFileRecord(index)'
                        >
                          <i class="trash icon"></i>
                          Delete File
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="ui success message" v-if='status.ready'>
              <i class="close icon"></i>
              <div class="header">
                File Upload Complete
              </div>
              <ul class="list">
                <li v-if='status.new == 1'> {{ status.new }} new file has been uploaded </li>
                <li v-if='status.new > 1'> {{ status.new }} new files have been uploaded </li>
                <li v-if='status.updated == 1'> {{ status.updated }} existing file has been updated to a new version </li>
                <li v-if='status.updated > 1'> {{ status.updated }} existing files have been updated to a new version </li>
                <li v-if='status.empty == 1'> {{ status.empty }} file has not changed and was not updated </li>
                <li v-if='status.empty > 1'> {{ status.empty }} files have not changed and were not updated </li>
              </ul>

            </div>
            <br>
            <button
              v-if='$route.params.rev_slug == "latest"'
              class="ui small basic blue button"
              @click='selectFilesForUpload'
              id='upload-file-button'
            >
              Upload New Files or Versions
            </button>
          </div>

          <div style='text-align:center' v-else-if="$route.params.rev_slug=='latest'" >
            <br>
            <h2 class="ui icon header" >
              <i class="fa-files-o icon"></i>
              <br>
              <div class="content">
                <div class="ui huge blue basic button" @click='selectFilesForUpload'>
                  Click here to add files
                </div>

                <div class="sub header" >
                  <br>
                  <a href="http://help.omnibuilds.com#files-are-cad-agnostic" style='font-size:18px'>
                    How do files work?
                  </a>
                </div>
              </div>
            </h2>
          </div>
          <div v-else style='text-align:center' @click='selectFilesForUpload'>
            <br>
            <h2 class="ui icon header" >
              <i class="fa-files-o icon"></i>
              <br>
              <div class="content">
                Change rev back to latest to add files
                <div class="sub header">
                  <br>
                  You have not added any files yet
                  <br>
                  Your project is read only when rev is not latest
                </div>
              </div>
            </h2>
          </div>
        <!-- </transition> -->

        <br> <br>

        <input
          type="file"
          multiple
          id='upload-file-input'
          style="display:none"
          @change='uploadFiles($event)'
        >

      </div>
      <div class="ui bottom attached segment" v-else>
        <a href="#" @click='returnToFiles'> Return to Files List</a>
        <table class="ui striped selectable table" id='versions-table' >
            <thead>
              <tr>
                <th>File Name</th>
                <th>Last Update</th>
                <th>Change</th>
                <th>Size</th>
                <th></th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <td></td>
                <td></td>
                <td>Total Size</td>
                <td> {{ this.total_size }} </td>
                <td></td>
              </tr>
            </tfoot>
            <tbody>
              <tr v-for='(version, index) in selectedFile.versions'>

                <td id='version-name'>
                  <a href='#' @click='getVersionFromS3(index)'>
                    {{ selectedFile.name }}
                  </a>
                </td>

                <td id='version-last-update'>

                  <router-link
                    :to='"/" + version.editor_slug'
                    tag='a'
                  >
                    {{ version.editor_slug }}
                  </router-link>

                  <span>
                    {{ version.message }}
                  </span>

                  <span>
                    {{ version.updated_at | moment("from", "now") }}
                  </span>

                </td>



                <td id='version-change'>
                  {{ version.change_message }}
                </td>

                <td id='version-size'>
                  {{ formatBytes(version.size, 0) }}
                </td>

                <td id='version-menu'>
                  <div class="ui icon top left pointing mini basic dropdown button versions">
                    <i class="caret down icon"></i>
                    <div class="menu">
                      <div class="item">Version Options</div>
                      <div class="item" @click='getVersionFromS3(index)'>
                        <i class="download icon"></i>
                        Download Version
                      </div>
                      <div
                        class="item"
                        @click='selectFilesForUpload'
                        v-if='$route.params.rev_slug == "latest"'
                      >
                        <i class="upload icon"></i>
                        Upload New Version
                      </div>
                      <div
                        v-if='$route.params.rev_slug == "latest" && selectedFile.versions.length > 1'
                        class="item"
                        @click='deleteVersionAndVersionRecord(index)'
                      >
                        <i class="trash icon"></i>
                        Delete Version
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

        <br>

        <!-- <button
          v-if='$route.params.rev_slug == "latest"'
          class="ui small basic blue button"
          @click='selectFilesForUpload'
          id='upload-file-button'
        >
          Upload New Files or Versions
        </button> -->

        <br> <br>

        <input
          type="file"
          multiple
          id='upload-file-input'
          style="display:none"
          @change='uploadFiles($event)'
        >

      </div>
    </transition>

  </div>
</template>

<script>
var Rusha = require('Rusha')
import { mapGetters } from 'vuex'
export default {
  name: 'home',
  data () {
    return {
      filesInput: [],
      files: [],
      selectedFile: null,
      sha1: null,
      status: {
        new: 0,
        updated: 0,
        empty: 0,
        ready: false,
        data: 0
      },
      mode: 'files',
      bucket: null
    }
  },
  computed: {
    ...mapGetters([
      'env',
      'session',
      'profile',
      'design',
      'designRefs',
    ]),
    file_names() {
      if (this.files) {
        return this.files.data.map((file) => {return file.name})
      } else {
        return null
      }
    },
    total_size() {
      let total = 0
      if (this.selectedFile) {
        this.selectedFile.versions.forEach((version) => {
          total += version.size
        })
        return this.formatBytes(total, 0)
      }
    }
  },
  watch: {
    designRefs () {
      if (this.env != 'prod') {
        console.log('designRefs watcher has been called in files.vue')
      }
      this.getFilesRecord()
      this.getToken()

    }
  },
  methods: {
    /*

    Update design data
      New file/s uploaded
      New version/s uploaded
      File deleted
      Version deleted
    */
    formatBytes(bytes, decimals) {
       if(bytes == 0) return '0 Bytes'
       var k = 1000
       var dm = decimals + 1 || 3
       var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
       var i = Math.floor(Math.log(bytes) / Math.log(k))
       return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    },
    getToken() {
      this.$http.get('get_token').then(success => {
        if (this.env != 'prod') {
          console.log('Got token')
        }
        let values = success.body
        AWS.config.update({
          region: 'us-west-2',
          accessKeyId: values.value_1,
          secretAccessKey: values.value_2,
          sessionToken: values.value_3
        })
        values = null
      }, error => {
        if (this.env != 'prod') {
          console.log('Error getting token')
        }
      })
    },
    getFilesRecord() {
      this.$http.get('files/' + this.design.files.id + '/?ref=' + this.designRefs.ref + '&type=' + this.designRefs.ref_type + '&config=' + this.designRefs.config_slug).then(success => {
        if (this.env != 'prod') {
          console.log('got files')
          console.log(success)
        }
        this.files = success.data

        let vue = this
        setTimeout(function() {
          if (vue.env != 'prod') {
            console.log('trying to activate drodpdown on files')
          }
          $('.ui.dropdown.options').dropdown(
            { 'silent': true }
            );
        }, 0);
      }, error => {
        if (vue.env != 'prod') {
          console.log('error getting files')
          console.log(error)
        }
      })
    },
    putFilesRecord(payload) {
      this.$http.put('files/' + payload.params, payload.data).then(success => {
        if (this.env != 'prod') {
          console.log('Files updated')
          console.log(success)
        }
        let design_payload = {
          design_slug: this.design.slug,
          creator_slug: this.design.creator_slug
        }
        this.$store.dispatch('getDesign', design_payload).then(success => {
          if (this.env != 'prod') {
            console.log('Got updated Design after updating Files')
          }
        }, error => {
          if (this.env != 'prod') {
            console.log('Error getting updating design after updating Files')
          }
        })
      }, error => {
        if (this.env != 'prod') {
          console.log('Error updating files')
          console.log(error)
        }
      })
    },
    selectFilesForUpload() {
      // click the hidden files input button
      let fileElem = document.getElementById("upload-file-input")
      fileElem.click()
    },
    readFile(index) {
      return new Promise((resolve,reject) => {
        let file = this.filesInput[index]
        // have to get the fileInput from index
        let rusha = new Rusha()
        let reader = new FileReader()
        var array_buffer

        let vue = this
        reader.onloadend = function () {
          array_buffer = reader.result
          vue.sha1 = rusha.digest(array_buffer)
          console.log(vue.sha1)
          resolve(array_buffer)
        }

        reader.readAsArrayBuffer(file)
      })
    },
    uploadFiles: async function(event) {
      this.status = {
        new: 0,
        updated: 0,
        empty: 0,
        ready: false,
        data: 0
      }
      this.filesInput = event.target.files
      let s3_path = `https://s3-us-west-2.amazonaws.com/${this.bucket}/Designs`

      // update the files record to reflect files input
      for (let file of this.filesInput) {
        if (this.env != 'prod') {
          console.log('In first for of loop')
        }
        let s3_key = this.design.creator + '/' + this.design.id + '/' + file.name
        if (this.file_names.includes(file.name)) {
          if (this.env != 'prod') {
            console.log('Detected an existing file, checking if the file should be updated')
          }
          // edit existing file record
          let index = this.file_names.indexOf(file.name)
          let file_record = this.files.data[index]
          file_record['commited'] = false
          file_record['uploaded'] = false

          let version = {
            editor: this.profile.id,
            editor_slug: this.profile.slug,
            sha1: null,
            s3_version_id: null,
            size: file.size,
            message: 'Waiting to upload new version of file',
            updated_at: Date.now()
          }

          file_record.versions.push(version)

        } else {
          // create a new file record
          file.splits = file.name.split('.')
          file.format = file.splits[file.splits.length -1]

          let file_record = {
            name: file.name,
            format: file.format,
            uploaded: false,
            commited: false,
            created_at: Date.now(),
            creator: this.profile.id,
            creator_slug: this.profile.slug,
            s3_url:  s3_path + s3_key,
            total_size: 0,
            versions: []
          }

          let version = {
            editor: this.profile.id,
            editor_slug: this.profile.slug,
            sha1: null,
            s3_version_id: null,
            size: file.size,
            message: 'Waiting to upload file',
            updated_at: Date.now()
          }

          file_record.versions.push(version)
          this.files.data.push(file_record)
        }
      }

      var index = 0
      for (let file of this.filesInput) {
        if (this.env != 'prod') {
          console.log('In second for of loop')
        }
        // get file record for this input
        let file_index = this.file_names.indexOf(file.name)
        let file_record = this.files.data[file_index]
        let version_index = file_record.versions.length - 1
        var s3_key = 'designs/' + this.design.creator + '/' + this.design.id + '/' + file.name

        // this is where you would add the progress spinner
        file_record.versions[version_index].message = 'Uploading'

        let array_buffer = await this.readFile(index)
        index +=1


        if (file_record.versions.length == 1) {
          if (this.env != 'prod') {
            console.log('Uploading a brand new file')
          }
          // uploaidng a new file or versioning an existing file
          let data = await this.putFileToS3(array_buffer, s3_key )

          file_record.versions[version_index].s3_version_id = data.VersionId
          file_record.versions[version_index].etag = data.ETag
          file_record.versions[version_index].sha1 = this.sha1
          // update the file object
          file_record.uploaded = true
          file_record.versions[version_index].message = 'added'
          file_record.total_size += file_record.versions[version_index].size
          this.status.new += 1
          this.status.data += file_record.versions[version_index].size

          // display success or error message
        } else if (file_record.versions[version_index - 1].sha1 != this.sha1) {
          let data = await this.putFileToS3(array_buffer, s3_key )
          if (this.env != 'prod') {
            console.log('Updating an existing file')
          }

          file_record.versions[version_index].s3_version_id = data.VersionId
          file_record.versions[version_index].etag = data.ETag
          file_record.versions[version_index].sha1 = this.sha1
          // update the file object
          file_record.uploaded = true
          file_record.versions[version_index].message = 'added a new version'
          file_record.total_size += file_record.versions[version_index].size
          this.status.updated += 1
          this.status.data += file_record.versions[version_index].size

        } else {
          if (this.env != 'prod') {
            console.log('Empty commit to an existing file')
            console.log(file.name + ' already exists and has not changed since the last version')
          }
          // no change to the file, skip the upload
          // get the file record and remove the last version
          file_record.uploaded = true
          file_record.commited = true
          file_record.versions.pop()
          this.status.empty += 1
        }
      }

      let vue = this
      setTimeout(function() {
        if (vue.env != 'prod') {
          console.log('trying to activate drodpdown on files')
        }
        $('.ui.dropdown.options').dropdown(
          { 'silent': true }
          );
      }, 0);

      for (let file_record of this.files.data) {
        if (this.env != 'prod') {
          console.log('In third for of loop')
        }
        file_record.commited = true
        if(!file_record.uploaded) {
          if (this.env != 'prod') {
            console.log('Warning, trying to commit files and a file has not been uploaded to S3 for filename: ' + file_record.name)
          }
        }
        file_record.uploaded = true
      }

      var action, message

      if (this.status.updated > 0 && this.status.new > 0) {
        action = `added ${this.status.new} new files and updated ${this.status.updated} existing files`
        message = null
      } else if (this.status.new > 0) {
        action = `added ${this.status.new} new files`
        message = null
      } else if (this.status.updated > 0) {
        action = `updated ${this.status.updated} existing files`
        message = null
      } else {
        action = 'no updates'
        message = null
      }

      // put new file record to S3
      let payload = {
        params: this.design.files.id +
                '/?ref=' + this.$route.params.config_slug +
                '&action=' + action +
                '&message=' + message +
                '&data=' + this.status.data,
        data: {
          editor: this.profile.id,
          data: this.files.data
        }
      }

      this.putFilesRecord(payload)

      this.status.ready = true

      // update the status message data
      setTimeout(function() {
        $('.message .close').on('click', function() {
          $(this)
          .closest('.message')
          .transition('fade')
          vue.status = {
            new: 0,
            updated: 0,
            empty: 0,
            ready: false,
            data: 0
          }
        })
      }, 0);
    },
    putFileToS3(array_buffer, s3_key) {
      return new Promise((resolve, reject) => {
        let s3 = new AWS.S3()
        let params = {
          Body: array_buffer,
          Bucket: this.bucket,
          Key: s3_key
         }
         s3.putObject(params, function(err, data) {
           if (err) {
             if (this.env != 'prod') {
               console.log(err, err.stack); // an error occurred
             }
           } else {
             if (this.env != 'prod') {
               console.log(data)
             }
             resolve(data)
           }
        })
      })
    },
    getFileFromS3(index) {

      let file = this.files.data[index]
      let s3 = new AWS.S3()
      let s3_key = 'designs/' + this.design.creator + '/' + this.design.id + '/' + file.name

      var params = {Bucket: this.bucket, Key: s3_key}
      var url = s3.getSignedUrl('getObject', params)
      window.location = url
    },
    getVersionFromS3(index) {
      let version = this.selectedFile.versions[index]
      let s3 = new AWS.S3()
      let s3_key = 'designs/' + this.design.creator + '/' + this.design.id + '/' + this.selectedFile.name

      var params = {
        Bucket: this.bucket,
        Key: s3_key,
        VersionId: version.s3_version_id
      }
      var url = s3.getSignedUrl('getObject', params)
      window.location = url
    },
    deleteFileFromS3(index, version_id) {
      return new Promise((resolve, reject) => {
        let file = this.files.data[index]
        let s3 = new AWS.S3()
        let s3_key = 'designs/' + this.design.creator + '/' + this.design.id + '/' + file.name

        let params = {
          Bucket: this.bucket,
          Key: s3_key
        }

        if (version_id) {
          params['VersionId'] = version_id
        }

        s3.deleteObject(params, function(err, data) {
          if (err) {
            if (this.env != 'prod') {
              console.log('Error');
              console.log(err, err.stack);  // an error occurred
            }
            reject(err)
          } else {
            if (this.env != 'prod') {
              console.log('Success');
              console.log(data);           // successful response
            }
            resolve(data)
          }
        })

      })
    },
    deleteFileAndFileRecord:  async function (index) {
      // check to make sure files are not a dependency
      let file = this.files.data[index]
      // let deleteFile = await this.deleteFileFromS3(index)
      this.files.data.splice(index, 1)

      let action = `removed ${file.name} from files`
      let message = null

      // update the files and POST to API
      let payload = {
        params:
          this.design.files.id +
          '/?ref=' + this.$route.params.config_slug +
          '&action=' + action +
          '&message=' + message,
        data: {
          editor: this.profile.id,
          data: this.files.data
        }
      }

      this.putFilesRecord(payload)

    },
    deleteVersionAndVersionRecord: async function (index) {
      let file_index = this.file_names.indexOf(this.selectedFile.name)
      let version = this.selectedFile.versions[index]
      // let deleteVersion = await this.deleteFileFromS3(file_index, version.s3_version_id)

      this.selectedFile.versions.splice(index, 1)

      let action = `removed version ${index + 1} from ${this.selectedFile.name} in files`
      let message = null

      // update the files and POST to API
      let payload = {
        params: this.design.files.id + '/?ref=' +
                this.$route.params.config_slug +
                '&action=' + action +
                '&message=' + message,
        data: {
          editor: this.profile.id,
          data: this.files.data
        }
      }

      this.putFilesRecord(payload)

    },
    showVersions(index) {
      this.selectedFile = this.files.data[index]
      this.mode = 'versions'
      this.$nextTick(() => {
        $('.ui.dropdown.versions').dropdown(
          { 'silent': true }
          );
      })
      if (this.env != 'prod') {
        console.log('Show versions has been selected')
      }

    },
    returnToFiles() {
      this.selectedFile = null
      this.$nextTick(() => {
        $('.ui.dropdown.options').dropdown({ 'silent': true })
      })
    }
  },
  // how can we await the receipt of the new design
  // since we already have a design this
  created() {
    if (this.designRefs.ref) {
      if (this.env != 'prod') {
        console.log('Files.vue created, design data already loaded, getting files')
      }
      this.getFilesRecord()
      this.getToken()

    } else {
      if (this.env != 'prod') {
        console.log('Files.vue created, no design data present, waiting on watcher')
      }
    }
    if (this.env == 'prod') {
      this.bucket='omni-prod-designs'

    } else {
      this.bucket='omni-stage-designs'
    }
  }
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

.files {
  padding: 1.5rem;
  margin-right: 0;
  margin-bottom: 0;
  margin-left: 0;
  border-width: .2rem;
  border: solid #f7f7f9;
}
</style>
