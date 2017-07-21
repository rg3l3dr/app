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
      <div class="content">
        <div class="ui large error message">
          <div class="header">
            Are you sure you want to delete this design?
          </div>
          <p>
            If you delete this project, you will lose all data and files associated with it.  This action cannot be undone.
          </p>
        </div>
      </div>
      <div class="actions">
        <button type="button" class="ui small blue basic button" @click.prevent='hideDeleteModal'>Close</button>
        <button class="ui red small basic button" @click='deleteDesign'>Delete Design</button>
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
    }
  },
  computed: {
    ...mapGetters([
      'session',
      'profile',
      'design'
    ])
  },
  methods: {
    hideDeleteModal: function() {
      console.log('Hiding the delete modal')
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
      this.$http.delete('designs/' + this.design.slug).then(response => {
        console.log('Design has been deleted')
        console.log(response)
        this.$router.push('/home')
      }, response => {
        console.log('Error deleting design')
        console.log(response)
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
