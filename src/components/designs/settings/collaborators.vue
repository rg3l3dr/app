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

  },
  created: function() {

  },
  mounted: function() {

  }
}
</script>

<style lang="css">
</style>
