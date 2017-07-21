<template lang="html">
  <div>
    <div class='ui small top attached header'>
      <i class="history icon" aria-hidden="true"></i>
      <div class="content">
        &nbsp
        Changes
      </div>
    </div>
    <div class="ui bottom attached clearing segment">
      <table class="ui table">
        <thead>
          <th>View Change</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Message</th>
        </thead>
        <tbody name='fade' is='transition-group'>
          <tr v-for='change in currentConfig[0].change_set' :key='change'>
            <td>
              <a href="#" @click='selectChange(change)'>
                {{change.sha1}}
              </a>
            </td>
            <td> {{change.owner}} </td>
            <td> {{ change.created_at | moment("MMMM Do YYYY") }} </td>
            <td> {{ change.message }} </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { EventBus } from '../../../event-bus.js'
import { mapGetters } from 'vuex'
export default {
  name: 'changes',
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
      )
    }
  },
  methods: {
    selectChange(change) {
      this.$router.push(`/${this.profile.slug}/${this.design.slug}/${change.sha1}`, onComplete => { this.$store.commit('setDesignRefs')}, onAbort => {})
    }
  },
  created() {},
  mounted() {}
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
