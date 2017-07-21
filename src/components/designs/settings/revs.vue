<template lang="html">
  <div>
    <div class='ui small top attached header'>
      <i class="tags icon" aria-hidden="true"></i>
      <div class="content">
        &nbsp
        Revs
      </div>
    </div>
    <div class="ui bottom attached clearing segment">
      <table class="ui table">
        <thead>
          <th>Name</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Change</th>
          <th></th>
        </thead>
        <tbody name='fade' is='transition-group'>
          <tr v-for='rev in currentConfig[0].rev_set' :key='rev'>
            <td>{{ rev.name }}</td>
            <td> {{rev.owner}} </td>
            <td>{{ rev.created_at | moment("MMMM Do YYYY") }}</td>
            <td></td>
            <td></td>
            <td>
              <span v-if='$route.params.rev_slug=="latest"'>
                <button
                  class="ui red circular basic icon button"
                  @click='deleteModal(rev)'
                  v-if='rev.slug!="latest"'
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
         Delete {{ deadRevName }} Rev
       </h3>
      </div>
      <div class="content">
        <div class="ui large error message">
          <div class="header">
            Are you sure you want to delete this rev?
          </div>
          <p>
            This rev is only a symbolic link to a point in your design's history, you are not actually deleting any content, it will just be harder to find this specific point in the change log.
          </p>
        </div>
      </div>
      <div class="actions">
        <button type="button" class="ui small basic blue button" @click='hideDeleteModal'>Close</button>
        <button
          class="ui red basic small button"
          @click='deleteRev'
          data-dismiss="modal"
        >
          Delete Rev
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'revs',
  data () {
    return {
      deadRevName: '',
      deadRevId: ''
    }
  },
  computed: {
    ...mapGetters([
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
    showDeleteModal: function() {
      $('#deleteModal').modal('show')
    },
    hideDeleteModal: function() {
      $('#deleteModal').modal('hide all')
    },
    deleteModal: function(rev) {

      this.deadRevName = rev.name
      this.deadRevId = rev.id
      this.showDeleteModal()
    },
    deleteRev: function() {

      console.log('Delete rev button clicked')

      this.$http.delete('revs/' + this.deadRevId).then(response => {
        console.log('Rev successfully deleted')
        this.hideDeleteModal()
        console.log(response)

        $('#revs').dropdown('set text', 'Latest')
        $('#revs').dropdown('set selected', 'Latest')

        // this.$route.params.config_slug = config.slug
        this.$route.params.rev_slug = 'latest'
        this.$route.params.change_slug = null

        // let refs_payload = {
        //   config: this.refs.config,
        //   rev: 'latest',
        //   change: null
        // }
        // this.$store.commit('setRefs', refs_payload)
        let design_payload = { design_slug: this.$route.params.design_slug }
        this.$store.dispatch('getDesign', design_payload).then(success => {
          this.$router.push(this.designRefs.path + '/settings/revs')



          // $('#deleteModal').modal('hide all')
        }, error => {

        })
      }, error => {
        console.log('Error deleting rev')
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
