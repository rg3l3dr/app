import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import {state} from './state.js'
import {getters} from './getters.js'
import {mutations} from './mutations.js'
import {actions} from './actions.js'

Vue.use(Vuex)


export const store = new Vuex.Store({
  plugins: [createPersistedState()],
  state,
  getters,
  mutations,
  actions
})
