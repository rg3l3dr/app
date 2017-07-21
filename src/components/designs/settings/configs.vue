<template lang="html">
  <div>
    <div class='ui small top attached header'>
      <i class="fork icon" aria-hidden="true"></i>
      <div class="content">
        &nbsp
        Configs
      </div>
    </div>
    <div class="ui bottom attached clearing segment">
      <table class="ui table">
        <thead>
          <th>Name</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Revs</th>
          <th>Changes</th>
          <th></th>
        </thead>
        <tbody name='fade' is='transition-group'>
          <tr v-for='config in this.design.config_set' :key='config'>
            <td>{{ config.name }}</td>
            <td> {{config.owner}} </td>
            <td>{{ config.created_at | moment("MMMM Do YYYY") }}</td>
            <td>{{ config.rev_set.length }}</td>
            <td>{{ config.change_set.length }}</td>
            <td>
              <span v-if='$route.params.config_slug=="primary" && $route.params.rev_slug=="latest"'>
                <button
                  class="ui red circular basic icon button"
                  @click='deleteModal(config)'
                  v-if='config.name != "Primary"'
                >
                  <i class="remove icon"></i>
                </button>
              </span>

            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class='ui modal' id='deleteModal'>
      <div class="header">
        <h3>
         Delete {{ deadConfigName }} Config
       </h3>
      </div>
      <div class="content">
        <div class="ui large error message">
          <div class="header">
            Are you sure you want to delete this config?
          </div>
          <p>
            All specs, parts, and files associated with this config will be deleted and cannot be recovered.
          </p>
        </div>
      </div>
      <div class="actions">
        <button type="button" class="ui small basic blue button" @click='hideDeleteModal'>Close</button>
        <button class="ui red small basic button" @click='deleteConfig' data-dismiss="modal">Delete Config</button>
      </div>
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
      deadConfigName: '',
      deadConfigID: ''
    }
  },
  computed: {
    ...mapGetters([
      'session',
      'profile',
      'design',
      'designRefs'
    ])
  },
  methods: {
    showDeleteModal: function() {
      $('#deleteModal').modal('show')
    },
    hideDeleteModal: function() {
      $('#deleteModal').modal('hide all')
    },
    deleteModal: function(config) {

      this.deadConfigName = config.name
      this.deadConfigID = config.id
      this.showDeleteModal()
    },
    deleteConfig: function() {

      console.log('Delete config button clicked')

      this.$http.delete('configs/' + this.deadConfigID).then(response => {
        console.log('Config successfully deleted')
        this.hideDeleteModal()
        console.log(response)

        $('#configs').dropdown('set text', 'Primary')
        $('#configs').dropdown('set selected', 'Primary')

        $('#revs').dropdown('set text', 'Latest')
        $('#revs').dropdown('set selected', 'Latest')

        // let refs_payload = {
        //   config: 'primary',
        //   rev: 'latest',
        //   change: null
        // }
        // this.$store.commit('setRefs', refs_payload)
        this.$route.params.config_slug = 'primary'
        this.$route.params.rev_slug = 'latest'
        this.$route.params.change_slug = null
        let design_payload = { design_slug: this.$route.params.design_slug }
        this.$store.dispatch('getDesign', design_payload).then(success => {
          this.$router.push(this.designRefs.path + '/settings/configs')
        }, error => {

        })
      }, error => {
        console.log('Error deleting config')
        console.log(error)
      })
    }
  },
  created: function() {

  },
  mounted: function() {

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
</style>
