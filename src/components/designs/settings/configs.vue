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
          <th>Creator</th>
          <th>Created</th>
          <th>Builds</th>
          <th>Revs</th>
          <th></th>
        </thead>
        <tbody name='fade' is='transition-group'>
          <tr v-for='(config, index) in this.design.config_set' :key='index'>
            <td id='config-name'>
              <a href="" @click='viewConfig(config)'>
                {{ config.name.name }}
              </a>
            </td>
            <td id='config-owner'>
              <a href="" @click='viewProfile(config)'>
                {{config.owner}}
              </a>
            </td>
            <td id='config-created-at'>{{ config.created_at | moment("MMMM Do YYYY") }}</td>
            <td id='config-builds'>
              <span v-if='(config.build_set.length - 1) == 0'>
                {{ config.build_set.length - 1 }}
              </span>
              <span v-else>
                <a href="" @click='viewBuilds(config)'>
                  {{ config.build_set.length - 1 }}
                </a>
              </span>
            </td>
            <td id='config-revs'>
              <a href="" @click='viewRevs(config)'>
                {{ config.rev_set.length }}
              </a>
            </td>
            <td id='config-options'>
              <div class="ui icon top left pointing mini basic dropdown button part">
                <i class="caret down icon"></i>
                <div class="menu">
                  <div class="item">Config Options</div>
                  <div
                    class="item"
                    @click='viewConfig(config)'
                  >
                    <i class="fork icon"></i>
                    View Config
                  </div>
                  <div
                    v-if='$route.params.rev_slug == "latest" && config.name.name != "Alpha" && $route.params.config_slug=="alpha"'
                    class="item"
                    @click='deleteModal(config)'
                  >
                    <i class="trash icon"></i>
                    Delete Config
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <br>
      <button class="ui small basic blue button" @click='createConfig'>
        Create a new config
      </button>
      <div style='text-align:center'>
        <br>
        <a href="http://help.omnibuilds.com#configurations-configs" style='font-size:17px'>
          What is a config?
        </a>
      </div>
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
  watch: {
    $route() {
      this.$nextTick(() => {
        $('.ui.dropdown').dropdown({ 'silent': true })
      })
    }
  },
  methods: {
    viewConfig(config) {
      this.$router.push(`/${config.owner}/${this.design.slug}/${config.slug}/latest`, onComplete => { this.$store.commit('setDesignRefs')}, onAbort => {})
    },
    viewProfile(config) {
      this.$router.push(`/${config.owner}`, onComplete => { this.$store.commit('setDesignRefs')}, onAbort => {})
    },
    viewBuilds(config) {
      this.$router.push(`/${config.owner}/${this.design.slug}/${config.slug}/latest/settings/builds`, onComplete => { this.$store.commit('setDesignRefs')}, onAbort => {})
    },
    viewRevs(config) {
      this.$router.push(`/${config.owner}/${this.design.slug}/${config.slug}/latest/settings/revs`, onComplete => { this.$store.commit('setDesignRefs')}, onAbort => {})
    },
    createConfig: function() {
      // set payload and create new config
      let payload = {
        design: this.design.id,
        owner: this.profile.id,
        name: 1
      }
      this.$http.post('configs/', payload ).then(success => {
        console.log('New config created')
        console.log(success)
        let design_payload = { design_slug: this.design.slug }
        this.$store.dispatch('getDesign', design_payload).then(success => {
          $('.ui.dropdown').dropdown({ 'silent': true })
        }, error => {})
      }, error => {
        console.log('Error creating new config')
        console.log(error)
      })
    },
    showDeleteModal: function() {
      $('#deleteModal').modal('show')
    },
    hideDeleteModal: function() {
      $('#deleteModal').modal('hide')
      $('#deleteModal').modal('hide all')
    },
    deleteModal: function(config) {

      this.deadConfigName = config.name.name
      this.deadConfigID = config.id
      this.showDeleteModal()
    },
    deleteConfig: function() {

      console.log('Delete config button clicked')

      this.$http.delete('configs/' + this.deadConfigID).then(response => {
        console.log('Config successfully deleted')
        this.hideDeleteModal()
        console.log(response)

        $('#configs').dropdown('set text', 'Alpha')
        $('#configs').dropdown('set selected', 'Alpha')

        $('#revs').dropdown('set text', 'Latest')
        $('#revs').dropdown('set selected', 'Latest')

        // let refs_payload = {
        //   config: 'primary',
        //   rev: 'latest',
        //   change: null
        // }
        // this.$store.commit('setRefs', refs_payload)
        this.$route.params.config_slug = 'alpha'
        this.$route.params.rev_slug = 'latest'
        this.$route.params.build_slug = null
        let design_payload = { design_slug: this.$route.params.design_slug }
        this.$store.dispatch('getDesign', design_payload).then(success => {
          $('.ui.dropdown').dropdown({ 'silent': true })
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
    $('.ui.dropdown').dropdown({ 'silent': true })
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
