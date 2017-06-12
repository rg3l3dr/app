<template lang="html">
  <div class="container">
    <div class="row">
      <div class="col-xs-3">
        <div class='panel panel-default'>
          <div class="panel-heading">
            <i class="fa fa-gear text-primary" aria-hidden="true"></i>
            &nbsp
            Account Management
          </div>
          <div class="panel-body">
            <ul class="nav nav-pills nav-stacked">
              <router-link tag='li' to='/profile/public'>
                <a>
                  <i class="fa fa-user"></i> &nbsp; Public Profile
                </a>
              </router-link>
              <router-link tag='li' to='/profile/account'>
                <a>
                  <i class="fa fa-bars"></i> &nbsp; Account Settings
                </a>
              </router-link>
              <router-link tag='li' to='/profile/plan'>
                <a>
                  <i class="fa fa-credit-card"></i> &nbsp; Plans & Billing
                </a>
              </router-link>
              <router-link tag='li' to='/profile/projects'>
                <a>
                  <i class="fa fa-folder-open-o"></i> &nbsp; Projects Owned
                </a>
              </router-link>
              <router-link tag='li' to='/profile/teams'>
                <a>
                  <i class="fa fa-users"></i> &nbsp; Teams Leading
                </a>
              </router-link>
            </ul><!-- /.nav nav-pills nav-stacked -->
          </div>
        </div>
      </div><!-- /.col-xs-3 -->
      <div class="col-xs-9">
        <div class="tab-content">
          <router-view name='profileContent'></router-view>
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
</style>
