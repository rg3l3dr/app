// require('../main.js')
import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import createPersistedState from 'vuex-persistedstate'


// import counter from './modules/counter';
// import actions from './actions';
// import getters from './getters';
// import mutations from './mutations';

Vue.use(Vuex)
Vue.use(VueResource)

export const store = new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    session: {
      active: false,
      token: null,
      username: null,
      user_id: null
    },
    profile: {}
  },
  getters: {
    session: state => {
      return state.session
    },
    profile: state => {
      return state.profile
    }
  },
  mutations: {
    startSession (state, payload) {
      state.session.active = true
      state.session.token = payload.token
      state.session.username = payload.username
      state.session.user_id = payload.user_id
    },
    endSession (state) {
      state.session = {
        active: false,
        token: null,
        'username': null,
        'user_id': null
      }
      // state.profile = {
      //   plan: {},
      //   customer: {},
      //   invoices: []
      // }
    },
    getProfile (state) {
      Vue.http.get('profiles/' + state.session.username + '/').then(function(response) {
        console.log(response)
        state.profile = response.data
      },
      function(response) {
        console.log(response)
      })
    }
  }
})
