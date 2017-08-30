<template>

    <div class='ui fluid container'>

      <transition appear name='fade'>
        <app-navbar></app-navbar>
      </transition>
      <hr style='margin-top: 0px'>
      <transition appear name='fade'>
        <router-view style='min-height:85vh'></router-view>
      </transition>
      <transition appear name='fade'>
        <app-footer></app-footer>
      </transition>
    </div>



</template>
<script>

import navbar from './components/navbar.vue'
import footer from './components/footer.vue'
export default {
  name: 'app',
  components: {
    appNavbar: navbar,
    appFooter: footer
  },
  created() {
    let my_host = window.location.host
    let parts = my_host.split('.')
    let sub = parts[0]

    if (sub == 'app') {
      let payload = 'prod'
      this.$store.commit('setEnv', payload)
    } else {
      let payload = 'dev'
      this.$store.commit('setEnv', payload)
      console.log(sub)
    }

    window.Intercom("boot", {
      app_id: "k7ou8jph"
    });

  }
}
</script>

<style >
a {
  color: #337ab7;
}

.omni {
  color: #337ab7;
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
