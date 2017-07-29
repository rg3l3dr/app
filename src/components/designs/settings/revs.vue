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
          <th>Number</th>
          <th>Editor</th>
          <th>Action</th>
          <th>Date</th>
        </thead>
        <div>
        </div>
        <tbody name='fade' is='transition-group'>
          <tr v-for='rev in currentConfig.rev_set' :key='rev'>
            <td if='rev-number'>
              <a href='' @click='viewRev(rev)'>
              {{ currentConfig.name.letter }}{{ rev.number }}
              </a>
            </td>
            <td id='rev-editor'>
              <a href="" @click='viewProfile(rev)'>
                {{ rev.owner }}
              </a>
            </td>
            <td id='rev-action'>
              {{ rev.action }}
            </td>
            <td id='rev-date'>
              {{ rev.created_at | moment("LLL") }}
            </td>
          <!--   <td id='rev-remarks'>
            <span v-if='rev.remarks'>
              {{ rev.message }}
            </span>
            <span v-else>
              None
            </span>
          </td> -->
          </tr>
        </tbody>
      </table>
      <div style='text-align:center'>
        <br>
        <a href="http://help.omnibuilds.com#revisions-revs" style='font-size:17px'>
          What is a rev?
        </a>
        <br>
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from '../../../event-bus.js'
import { mapGetters } from 'vuex'
export default {
  name: 'revs',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'session',
      'profile',
      'design',
      'designRefs'
    ]),

    currentConfig() {
      return this.design.config_set.filter(
        config => config.slug == this.$route.params.config_slug
      )[0]
    }
  },
  methods: {
    viewRev(rev) {
      this.$router.push(`/${rev.owner}/${this.design.slug}/${this.currentConfig.slug}/${rev.number}`, onComplete => { this.$store.commit('setDesignRefs')}, onAbort => {})
    },
    viewProfile(rev) {
      this.$router.push(`/${rev.owner}`, onComplete => { this.$store.commit('setDesignRefs')}, onAbort => {})
    }
  },
  created() {},
  mounted() {}
}
</script>

<style lang="css">

.truncate {
  width: 50px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

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
