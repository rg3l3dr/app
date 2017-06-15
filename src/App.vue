<template>
  <div class='ui container'>
    <app-navbar></app-navbar>
    <hr style='margin-top: 0px'>
    <router-view></router-view>
    <app-footer></app-footer>
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
</style>
