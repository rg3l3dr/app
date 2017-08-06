<template lang="html">
  <div>
    <div class='ui small top attached header'>
      <i class="wrench icon" aria-hidden="true"></i>
      <div class="content">
        &nbsp
        Builds
      </div>
    </div>
    <div class="ui bottom attached clearing segment">
      <span v-if='currentConfig[0].build_set.length > 1'>
        <table class="ui table" >
          <thead>
            <th>Name</th>
            <th>Creator</th>
            <th>Created</th>
            <th>Revision</th>
            <th></th>
          </thead>
          <tbody name='fade' is='transition-group'>
            <tr
              v-for='(build, index) in currentConfig[0].build_set'
              :key='index'
              v-if='build.name != "None"'
            >
              <td>
              <!--   <router-link :to='`/${build.owner}/${design.slug}/${build.slug}/parts`'>
                {{ build.name }}
              </router-link> -->
                <a href="" @click='viewBuild(build)'>
                  {{ build.name }}
                </a>

              </td>
              <td>
                <a href="" @click='viewProfile(build)'>
                  {{ build.owner }}
                </a>
              </td>
              <td>{{ build.created_at | moment("MMMM Do YYYY") }}</td>
              <td>
                <a href="" @click='viewRev(build)'>
                  {{ `${build.config.name.letter}${build.rev.number}` }}
                </a>
              </td>
              <td>
                <div class="ui icon top left pointing mini basic dropdown button part">
                  <i class="caret down icon"></i>
                  <div class="menu">
                    <div class="item">Build Options</div>
                    <div
                      class="item"
                      @click='viewBuild(build)'
                    >
                      <i class="wrench icon"></i>
                      View Build
                    </div>
                    <div
                      v-if='$route.params.rev_slug == "latest" && $route.params.config_slug=="alpha"'
                      class="item"
                      @click='deleteModal(build)'
                    >
                      <i class="trash icon"></i>
                      Delete Build
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <br>
        <button class="ui small basic blue button" @click='createBuild'>
          Create a new build
        </button>
        <div style='text-align:center'>
          <br>
          <a href="http://help.omnibuilds.com#builds">
            What is a build?
          </a>
          <br>
        </div>
      </span>
      <div style='text-align:center' v-else-if='$route.params.rev_slug=="latest"' @click='createBuild'>
        <br>
        <h2 class="ui icon header" >
          <i class="wrench icon"></i>
          <br>
          <div class="content">
            Click here to create a build
            <div class="sub header">
              <br>
              <a href="http://help.omnibuilds.com#builds" style='font-size: 17px'>
                What is a build?
              </a>
              <br>
            </div>
          </div>
        </h2>
      </div>
      <div style='text-align:center' v-else>
        <br>
        <h2 class="ui icon header" >
          <i class="wrench icon"></i>
          <br>
          <div class="content">
            You have not created any builds yets
            <div class="sub header">
              <br>
                Switch rev back to latest to add a build
              <br>
            </div>
          </div>
        </h2>
      </div>
    </div>
    <div class='ui modal' id='deleteModal'>
      <div class="header">
        <h3>
         Delete {{ deadBuildName }} Build
       </h3>
      </div>
      <div class="content">
        <div class="ui large error message">
          <div class="header">
            Are you sure you want to delete this build?
          </div>
          <p>
            This build is only a symbolic link to a point in your design's history, you are not actually deleting any content, it will just be harder to find this specific point in the rev log.
          </p>
        </div>
      </div>
      <div class="actions">
        <button type="button" class="ui small basic blue button" @click='hideDeleteModal'>Close</button>
        <button
          class="ui red basic small button"
          @click='deleteBuild'
          data-dismiss="modal"
        >
          Delete Build
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'builds',
  data () {
    return {
      deadBuildName: '',
      deadBuildId: ''
    }
  },
  watch: {
    $route() {
      this.$nextTick(() => {
        $('.ui.dropdown').dropdown({ 'silent': true })
      })
    }
  },
  computed: {
    ...mapGetters([
      'env',
      'session',
      'profile',
      'design',
      'designRefs'
    ]),
    currentConfig: function() {
      return this.design.config_set.filter(
        config => config.slug == this.$route.params.config_slug
      )
    }
  },
  methods: {
    viewBuild(build) {
      this.$router.push(`/${build.owner}/${this.design.slug}/${build.slug}/`, onComplete => { this.$store.commit('setDesignRefs')}, onAbort => {})
    },
    viewProfile(build) {
      this.$router.push(`/${build.owner}`, onComplete => { this.$store.commit('setDesignRefs')}, onAbort => {})
    },
    viewRev(build) {
      this.$router.push(`/${build.owner}/${this.design.slug}/${build.config.slug}/${build.rev.number}`, onComplete => { this.$store.commit('setDesignRefs')}, onAbort => {})
    },
    createBuild() {
      document.getElementById("builds").click()
      this.$nextTick(() => {
        document.getElementById("build-input").focus()
      })
    },
    showDeleteModal: function() {
      $('#deleteModal').modal('show')
    },
    hideDeleteModal: function() {
      $('#deleteModal').modal('hide')
      $('#deleteModal').modal('hide all')
    },
    deleteModal: function(build) {

      this.deadBuildName = build.name
      this.deadBuildId = build.id
      this.showDeleteModal()
    },
    deleteBuild: function() {

      if (this.env != 'prod') {
        console.log('Delete build button clicked')
      }


      this.$http.delete('builds/' + this.deadBuildId).then(response => {
        if (this.env != 'prod') {
          console.log('Build successfully deleted')
          console.log(response)
        }
        this.hideDeleteModal()

        $('#builds').dropdown('set text', 'Latest')
        $('#builds').dropdown('set selected', 'Latest')

        // this.$route.params.config_slug = config.slug
        this.$route.params.rev_slug = 'latest'
        this.$route.params.build_slug = null
        let design_payload = { design_slug: this.$route.params.design_slug }
        this.$store.dispatch('getDesign', design_payload).then(success => {
          $('.ui.dropdown').dropdown({ 'silent': true })
        }, error => { })
      }, error => {
        if (this.env != 'prod') {
          console.log('Error deleting build')
          console.log(error)
        }
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
