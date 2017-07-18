<template lang="html">
  <div class="ui grid">
    <div class="row" style='margin: 20px 0px 0px 0px'>
      <div class="four wide column">
        <div class='ui small top attached header'>
          <i class="fa fa-gear primary"></i>
          <div class="content">
            &nbsp
            Account Management
          </div>
        </div>
        <div class="ui bottom attached clearing segment">
          <div class="ui secondary vertical menu">
            <router-link tag='a' class='item' to='/profile/public'>
              <a>
                <i class="fa fa-user"></i> &nbsp; Public Profile
              </a>
            </router-link>
            <router-link tag='a' class='item' to='/profile/account'>
              <a>
                <i class="fa fa-bars"></i> &nbsp; Account Settings
              </a>
            </router-link>
            <router-link tag='a' class='item' to='/profile/plan'>
              <a>
                <i class="fa fa-credit-card"></i> &nbsp; Plans & Billing
              </a>
            </router-link>
            <router-link tag='a' class='item' to='/profile/designs'>
              <a>
                <i class="fa fa-folder-open-o"></i> &nbsp; Projects Owned
              </a>
            </router-link>
            <!-- <router-link tag='a' class='item' to='/profile/teams'>
              <a>
                <i class="fa fa-users"></i> &nbsp; Teams Leading
              </a>
            </router-link> -->
          </div>
        </div>
      </div><!-- /.col-xs-3 -->
      <div class="twelve wide column">
        <div class="tab-content">
          <transition name='fade'>
            <router-view name='profileContent'></router-view>
          </transition>
        </div><!-- /.tab-content -->
      </div><!-- /.col-xs-9 -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
    }
  },
	computed: {
    ...mapGetters([
      'session',
      'profile'
    ])
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
