<template lang="html">
  <div>
    <div class='ui small top attached header'>
      <i class="warning sign icon" aria-hidden="true"></i>
      <div class="content">
        &nbsp
        Advanced
      </div>
    </div>
    <div class="ui bottom attached clearing segment">
      <h2>Delete Design Project</h2>
      <h4>If you delete this project, you will lose all data and files associated with it.  This action cannot be undone.</h4>
      <br>
      <button class="ui small red basic button" @click='showDeleteModal'>Delete Design</button>
    </div>
    <div class='ui modal' id='deleteModal'>
      <div class="header">
        <h3>
         Delete Design Project
       </h3>
      </div>

      <div class="content" v-if='design.imports'>
        <div class="ui large error message">
          <div class="header">
            You cannot delete this design yet...
          </div>
          <p>
            This design has been imported as a part into {{ design.imports }} other designs.  You must remove it from those designs before it can be deleted.
          </p>
        </div>
      </div>
      <div class="content" v-else>
        <div class="ui large error message">
          <div class="header">
            Are you sure you want to delete this design?
          </div>
          <p>
            If you delete this project, you will lose all data and files associated with it.  This action cannot be undone.
          </p>
        </div>
      </div>


      <div class="actions" v-if='design.imports'>
          <button type="button" class="ui small blue basic button" @click.prevent='hideDeleteModal'>Close</button>
      </div>
      <div class="actions" v-else >
        <button type="button" class="ui small blue basic button" @click.prevent='hideDeleteModal'>Close</button>
        <button class="ui red small basic button" @click='deleteDesign'>Delete Design</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'home',
  data () {
    return {
    }
  },
  computed: {
    ...mapState([
      'env',
      'session',
      'profile',
      'design',
      'rootDesign',
    ]),
    ...mapGetters([
      'designRoute',
    ])
  },
  methods: {
    hideDeleteModal: function() {
      if (this.env != 'prod') {
        console.log('Hiding the delete modal')
      }
      $('#deleteModal').modal('hide')
    },
    showDeleteModal: function() {
      $('.ui.modal').modal()
      $('#deleteModal').modal('show')
    },
    deleteDesign: function() {
      // must test to see if these designs are public and if they have been imported into other public boms or forked
      // must test to see if this design is part of any other project
      $('#deleteModal').modal('hide')
      $('body .modals').remove()
      this.$http.delete('designs/' + this.design.slug + '?owner_slug=' + this.design.owner_slug).then(response => {
        if (this.env != 'prod') {
          console.log('Design has been deleted')
          console.log(response)
        }

        if (this.rootDesign.id == this.design.id) {
          this.$router.push('/home')
        } else {
          this.$router.push(`/${this.designRoute}/home`)
          location.reload()
        }


      }, response => {
        if (this.env != 'prod') {
          console.log('Error deleting design')
          console.log(response)
        }
      })
    }

  },
  created: function() {
    // $('.ui.modal').modal()

  },
  mounted: function() {

  }
}
</script>

<style lang="css">
</style>
