<template lang="html">
  <div>
    <div class="ui small top attached header">
      <i class="share icon" aria-hidden="true"></i>
      <div class="content">
        &nbsp
        Shares
      </div>
    </div>
    <transition name='fade'>
      <div class="ui bottom attached segment">
        <!-- <transition name='fade'> -->
          <div v-if='shares.length > 0'>
            <table class="ui striped selectable table" id='shares-table'>
              <thead>
                <tr>

                  <th>Recipient</th>
                  <th>Sender</th>
                  <th>Revision</th>
                  <th>Date Shared</th>
                  <th>Expiration</th>
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
                v-for='(share, index) in this.shares'
                :key='share.token'
                >

                  <td id='share-recipient' class='collapsing'>
                    <a :href='`mailto:${share.email}`'>
                      {{ share.email }}
                    </a>
                  </td>

                  <td id='share-sender'>
                    <a href="" @click='viewProfile(share)'>
                      {{ share.profile }}
                    </a>
                  </td>

                  <td id='share-rev' class='collapsing'>
                    {{ share.revision }}
                  </td>

                  <td id='share-date'>
                    {{ share.shared_at | moment("MMMM Do YYYY") }}
                  </td>

                  <td id='share-expiry' class='collapsing'>
                    <span v-if='share.expiry_days'>
                      {{ share.expiry_days }}
                    </span>
                    <span v-else>
                      None
                    </span>
                  </td>

                  <!-- <td id='share-menu'>
                    <div class="ui icon top left pointing mini basic dropdown button options">
                      <i class="caret down icon"></i>
                      <div class="menu">
                        <div class="item">Share Options</div>
                        <div class="item" @click=''>
                          <i class="ban icon"></i>
                          Stop Sharing
                        </div>
                        <div
                          class="item"
                          @click=''
                        >
                          <i class="calendar icon"></i>
                          Change Expiration
                        </div>
                      </div>
                    </div>
                  </td> -->

                </tr>
              </tbody>
            </table>
            <br>
            <button
              class="ui small basic blue button"
              @click='showShareModal()'
            >
              Share this Design
            </button>
          </div>

          <div style='text-align:center' v-else>
            <br>
            <h2 class="ui icon header" >
              <i class="share icon"></i>
              <br>
              <div class="content">
                <div class="ui huge blue basic button" @click='showShareModal()'>
                  Click here to share this design
                </div>

                <div class="sub header" >
                  <br>
                  <a href="http://help.omnibuilds.com#files-are-cad-agnostic" style='font-size:18px'>
                    How does sharing work?
                  </a>
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
  name: 'shares',
  data () {
    return {
      shares: [],
    }
  },
  computed: {
    ...mapState([
      'env',
      'session',
      'profile',
      'rootDesign',
      'design',
      'tree',
      'node'
    ]),
    ...mapGetters([
      'designRoute',
    ]),
  },
  watch: {},
  methods: {
    viewProfile(share) {
      this.$router.push(`/${share.profile}`)
    },
    showShareModal() {
      $('.ui.modal').modal()
      $('#share-modal').modal('show')
    },
  },
  created() {
    this.$http.get(`shares/?design_id=${this.design.id}`).then(success => {
      if (this.env != 'prod') {
        console.log('Got shares')
        console.dir(success)
        this.shares = success.body.results
        this.$nextTick(() => {
          $('.ui.dropdown').dropdown()
        })
      }
    }, error => {
      console.log('Error getting shares')
      console.dir(error)
    })
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

.revs {
  padding: 1.5rem;
  margin-right: 0;
  margin-bottom: 0;
  margin-left: 0;
  border-width: .2rem;
  border: solid #f7f7f9;
}
</style>
