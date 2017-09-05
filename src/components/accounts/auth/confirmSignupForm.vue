<template lang="html">
  <div class="ui grid">
    <div class="one wide column"></div>
    <div class="fourteen wide column">
      <div class="ui two column centered grid">
        <div class="row">
          <div class="column">
            <br>
            <br>
            <h3>
              Please confirm that <a href="mailto:email">{{ email }}</a> is an email for user {{user}}.
            </h3>
            <button class='ui blue basic button' @click="goToSignup">Confirm Signup</button>
          </div>
        </div>
      </div>
    </div>
    <div class="one wide column"></div>
  </div>
</template>



<script>

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

let email = getParameterByName('email'); // "lorem"
let user = getParameterByName('user'); // "lorem"
import { mapState } from 'vuex'

export default {
  name: 'ConfirmSignup',
  data: function() {
    return {
      email: email,
      user: user
    }
  },
  computed: {
    ...mapState([
      'session'
    ])
  },
  methods: {
    goToSignup: function() {
      this.$store.commit('signUp')
      this.$router.push({ path: '/accounts/auth/login' })
    }
  }
}
</script>

<style lang="css">
</style>
