<template lang="html">
  <div>
    <div class="ui small top attached header">
      <i class="fa-files-o icon" aria-hidden="true"></i>
      <div class="content">
        &nbsp
        Revisions
      </div>
    </div>
    <transition name='fade'>
      <div class="ui bottom attached segment">
        <!-- <transition name='fade'> -->
          <div v-if='design.revisions.length > 0'>
            <table class="ui striped selectable table" id='revs-table'>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Message</th>
                  <th>Creator</th>
                  <th>Created</th>
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
                  <td></td>
                </tr>
              </tfoot>
              <tbody name='fade' is='transition-group'>
                <tr
                v-for='(rev, index) in this.design.revisions'
                :key='rev.name'
                :class='{active : revision.slug == rev.slug}'
                >

                  <td id='rev-number' class='collapsing'>
                    {{ index }}
                  </td>

                  <td id='rev-name' class='collapsing'>
                    <a href='#' @click='loadRev(index)'>
                      {{ rev.name }}
                    </a>
                  </td>

                  <td id='rev-message' v-if='index==0'>
                    This is your working copy
                  </td>

                  <td id='rev-message' v-else>
                    {{ rev.message }}
                  </td>

                  <td id='rev-creator' class='collapsing'>
                    <a href="" @click='viewProfile(rev)'>
                      {{ rev.creator }}
                    </a>

                  </td>

                  <td id='rev-created' class='collapsing'>
                    {{ rev.created_at | moment("MMMM Do YYYY") }}
                  </td>



                  <td id='rev-menu'>
                    <!-- <div class="ui icon top left pointing mini basic dropdown button options">
                      <i class="caret down icon"></i>
                      <div class="menu">
                        <div class="item">File Options</div>
                        <div class="item" @click='getFileFromS3(index)'>
                          <i class="download icon"></i>
                          Download File
                        </div>
                        <div
                          v-if='revision.slug == "latest"'
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
                          v-if='revision.slug == "latest"'
                          class="item"
                          @click='deleteFileAndFileRecord(index)'
                        >
                          <i class="trash icon"></i>
                          Delete File
                        </div>
                      </div>
                    </div> -->
                  </td>
                </tr>
              </tbody>
            </table>
            <br>
            <button
              v-if='revision.slug == "latest"'
              class="ui small basic blue button"
              @click='showRevModal()'
            >
              Create New Revision
            </button>
          </div>

          <div style='text-align:center' v-else-if="revision.slug=='latest'" >
            <br>
            <h2 class="ui icon header" >
              <i class="fa-files-o icon"></i>
              <br>
              <div class="content">
                <div class="ui huge blue basic button">
                  Click here to create a new revision
                </div>

                <div class="sub header" >
                  <br>
                  <a href="http://help.omnibuilds.com#files-are-cad-agnostic" style='font-size:18px'>
                    What is a revision?
                  </a>
                </div>
              </div>
            </h2>
          </div>
          <div v-else style='text-align:center'>
            <br>
            <h2 class="ui icon header" >
              <i class="fa-files-o icon"></i>
              <br>
              <div class="content">
                Change rev back to latest to create a new revision
                <div class="sub header">
                  <br>
                  You have not created any revisions yet
                  <br>
                  Your project is read only when rev is not latest
                </div>
              </div>
            </h2>
          </div>
        <!-- </transition> -->
      </div>
    </transition>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'revs',
  data () {
    return {

    }
  },
  computed: {
    ...mapState([
      'env',
      'session',
      'profile',
      'rootDesign',
      'design',
      'revision',
      'tree',
      'node'
    ]),
    ...mapGetters([
      'designRoute',
    ]),
  },
  watch: {},
  methods: {
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
    loadRev(index) {
      if (this.env != 'prod') {
        console.log('loading a new revision')
      }

      let selectedRev = this.design.revisions[index]
      this.$store.commit('setRevision', selectedRev)

      if (this.rootDesign.id == this.design.id) {
        this.$router.push(`/${this.design.owner_slug}/${this.design.slug}/${this.revision.slug}/home`)
        location.reload()
      } else {
        let design_payload = {
          design_slug: this.design.slug,
          owner_slug: this.design.owner_slug,
          revision_slug: this.revision.slug
        }
        this.$store.dispatch('getDesign', design_payload)
        this.updatePartandNode(this.tree, this.node.unique_id)
        this.$router.push(`/${this.designRoute}/home`)
      }

    },
    createRev() {

    },
    viewProfile(rev) {
      this.$router.push(`/${rev.creator}`)
    },
    showRevModal() {
      $('.ui.modal').modal()
      $('#revision-modal').modal('show')
    },
  },
  created() {}
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

.revs {
  padding: 1.5rem;
  margin-right: 0;
  margin-bottom: 0;
  margin-left: 0;
  border-width: .2rem;
  border: solid #f7f7f9;
}
</style>
