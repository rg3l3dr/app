<template lang="html">
  <div>
    <div class='ui small top attached header'>
      <i class="users icon" aria-hidden="true"></i>
      <div class="content">
        &nbsp
        Collaborators
      </div>
    </div>
    <div class="ui bottom attached clearing segment">
      <span v-if='collaborators.length != 0'>
        <table class="ui striped selectable table">
          <thead>
            <tr>
              <th>User</th>
              <th>View Design</th>
              <th>Edit Design</th>
              <th>Design Admin</th>
              <th></th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <td>
                <button class="ui small basic blue button">
                  Add Another Collaborator
                </button>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tfoot>
          <tbody name='fade' is='transition-group'>
            <tr
              v-for='(collaborator, index) in collaborators'
              :key='index'
            >
              <!-- Collaborator Name -->
              <td>
                {{ collaborator.username }}
              </td>

              <!-- View Design -->
              <td>
                <div class="ui toggle checkbox" @click='toggleCanView(collaborator)'>
                  <input
                    type="checkbox"
                    tabindex='0'
                    class="hidden"
                    v-model='collaborator.canView'
                  >
                  <label></label>
                </div>
              </td>

              <!-- Edit Design -->
              <td>
                <div class="ui toggle checkbox">
                  <input
                    type="checkbox"
                    tabindex='0'
                    class="hidden"
                    v-model='collaborator.canEdit'
                    @click='toggleCanEdit(collaborator)'
                  >
                  <label></label>
                </div>

              </td>

              <!-- Design Admin -->
              <td>
                <div class="ui toggle checkbox">
                  <input
                    type="checkbox"
                    tabindex='0'
                    class="hidden"
                    v-model='collaborator.isAdmin'
                    @click='toggleIsAdmin(collaborator)'
                  >
                  <label></label>
                </div>

              </td>

              <!-- Collaborator Options -->
              <td>
                <div class="ui icon top left pointing mini basic dropdown button">
                  <i class="caret down icon"></i>
                  <div class="menu">
                    <div class="item">Collaborator Options</div>
                    <div
                      class="item"
                    >
                      <i class="wrench icon"></i>
                      View Profile
                    </div>
                    <div
                      class="item"
                      @click='removeCollaborator(collaborator)'
                    >
                      <i class="trash icon"></i>
                      Remove Collaborator
                    </div>
                  </div>
                </div>
              </td>

            </tr>
          </tbody>
        </table>
      </span>
      <div v-else style='text-align:center' @click='showCollaborators'>
        <br>
        <h2 class="ui icon header" >
          <i class="users icon"></i>
          <br>
          <div class="content">
            Click here to add collaborators
            <div class="sub header">
              <br>
              <a href="http://help.omnibuilds.com#builds" style='font-size: 17px'>
                What are collaborators?
              </a>
              <br>
            </div>
          </div>
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Collaborators',
  data () {
    return {
      collaborators: [
        {
          username: 'awag',
          canView: true,
          canEdit: true,
          isAdmin: false
        }
      ]
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
    showCollaborators() {},
    addCollaborator() {},
    removeCollaborator() {},
    toggleCanView(collaborator) {
      'canView toggled'
      if (collaborator.canView) {

      } else {
        collaborator.isAdmin = false
        collaborator.canEdit = false
      }

    },
    toggleCanEdit(collaborator) {
      if (collaborator.canEdit) {
        collaborator.canView = true
      } else {
        collaborator.isAdmin = false
      }

    },
    toggleIsAdmin(collaborator) {
      if (collaborator.isAdmin) {
        collaborator.canView = true
        collaborator.canEdit = true
      } else {

      }

    }
  },
  created: function() {


  },
  mounted: function() {
    $('.ui.dropdown').dropdown({ 'silent': true })
    $('.ui.checkbox').checkbox()
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
