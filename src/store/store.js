// require('../main.js')
import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'

import createPersistedState from 'vuex-persistedstate'
import { EventBus } from '../event-bus.js'

Vue.use(Vuex)
Vue.use(VueResource)
Vue.use(VueRouter)

export const store = new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    env: null,
    session: {
      active: false,
      signed_up: false,
      token: null,
      username: null,
      user_id: null,
      time_left: null,
    },
    query: null,
    profile: {},
    design: null,
    designRefs: {
      ref: '',
      ref_type: '',
      design_path: '',
      endpoint: '',
      pre_endpoint: ''
    },
    trail: [],
    // parts: [],
    bom: {},
    specs: {},
    files: null,

  },
  getters: {
    env: state => {
      return state.env
    },
    path: state => {
      return state.route.path
    },
    params: state => {
      return state.route.params
    },
    query: state => {
      return state.query
    },
    session: state => {
      return state.session
    },
    profile: state => {
      return state.profile
    },
    design: state => {
      return state.design
    },
    designRefs: state => {
      return state.designRefs
    },
    trail: state => {
      return state.trail
    },
    // parts: state => {
    //   return state.parts
    // },
    bom: state => {
      return state.bom
    },
    specs: state => {
      return state.specs
    },
    // files: state => {
    //   return state.files
    // }
  },
  mutations: {
    setEnv (state, payload) {
      state.env = payload
    },
    signUp (state) {
      state.session.signed_up = true
    },
    startSession (state, payload) {
      state.session.active = true
      state.session.signed_up = false
      state.session.token = payload.token
      state.session.username = payload.username
      state.session.user_id = payload.user_id
      console.log('Session opened in store')

      // Set a timer and assign to new session variable

    },
    refreshSession(state) {
      // call refresh token API endpoint with current token
      // set new token in store
      // reset the timer
    },
    expireSession(state) {
      // set token to 'expired'
    },
    endSession (state) {
      state.session = {
        active: false,
        signed_up: false,
        token: null,
        username: null,
        user_id: null,
        time_left: null,
      }
      state.profile = {},
      state.designs = {},
      state.design = {},
      state.designRefs = {},
      state.specs = {},
      state.bom = {},
      state.files = {}
      state.parts = null
      state.part = null
      state.partRefs = null
      console.log('Session closed in store')
    },
    setQuery (state, data) {
      state.query = data
    },
    setDesignRefs (state) {
      console.log('Set Design refs has been called in store')
      let config = store.state.route.params.config_slug ? store.state.route.params.config_slug : null
      let build = store.state.route.params.build_slug ? store.state.route.params.build_slug : null
      let rev = store.state.route.params.rev_slug ? store.state.route.params.rev_slug : null

      let ref, ref_type, design_path, splits, endpoint, pre_endpoint

      if (build) {
        ref = build
        ref_type = 'build'
        console.log('set ref to build')
      } else if (rev && (rev != 'latest' && rev != 'Latest')) {
        ref = rev
        ref_type = 'rev'
        console.log('set ref to rev')
      } else if (config && (config != 'alpha' && config != 'Alpha')) {
        ref = config
        ref_type = 'config'
        console.log('set ref to config')
      } else {
        ref = 'alpha'
        ref_type = 'config'
        console.log('set ref to Alpha (default)')
      }
      if (ref_type == 'config' || ref_type == 'rev') {
         design_path =
          '/' + state.route.params.profile_slug
          + '/' + state.route.params.design_slug
          + '/' + config
          + '/' + rev
      } else {
        design_path =
          '/' + state.route.params.profile_slug
          + '/' + state.route.params.design_slug
          + '/' + build
      }
      splits = store.state.route.fullPath.split('/')
      endpoint = splits[splits.length - 1]
      pre_endpoint = splits[splits.length - 2]

      state.designRefs = {
        ref: ref,
        ref_type: ref_type,
        config_slug: config,
        design_path: design_path,
        pre_endpoint: pre_endpoint,
        endpoint: endpoint,
      }
      console.log('Design Refs set in store')
    },
    clearDesignRefs (state) {
      state.designRefs = {
        ref: null,
        ref_type: null,
        design_path: null,
        pre_endpoint: null,
        endpoint: null
      }
      console.log('refs cleared in store')
    },
    clearDesign (state) {
      state.design = {}
      console.log('design cleared in store')
    },
    extendTrail(state, breadcrumb) {
      state.trail.push(breadcrumb)
    },
    clearTrail(state) {
      state.trail = []
    },
    resetTrail(state, index) {
      state.trail = state.trail.slice(0, index + 1)
    },
    editTrail(state, payload) {
      console.log(payload)
      state.trail[payload.index] = payload.breadcrumb
    },
    setProfile (state, data) {
      state.profile = data
      console.log('profile set in store')
    },
    setDesign(state, data) {
      state.design = data
      console.log('design set in store')
    },
    // setParts(state, data) {
    //   state.parts = data
    //   console.log('bom parts set in store')
    // },
    // addPart(state, part) {
    //   state.parts.push(part)
    // },
    // clearParts(state) {
    //   state.parts = []
    // },
    setSpecs(state, data) {
      state.specs = data
      console.log('specs set in store')
    },
    setBom(state, data) {
      state.bom = data
      console.log('bom set in store')
    },
    // setFiles(state, data) {
    //   state.files = data
    //   console.log('files set in store')
    // }
  },
  actions: {
    getProfile ({commit, state}) {
      return new Promise((resolve, reject) => {
        Vue.http.get('profiles/' + state.session.username + '/').then(success => {
          console.log(success)
          commit('setProfile', success.data)
          resolve(success)
        }, error => {
          console.log(error)
          reject(error)
        })
      })
    },
    getDesign ({commit}, payload) {
      return new Promise((resolve, reject) => {
        Vue.http.get('designs/' + payload.design_slug).then(success => {
          console.log('Got design')
          console.log(success)
          commit('setDesign', success.data)
          // commit('setDesignRefs')
          resolve(success)
        }, error => {
          console.log('Error getting design')
          console.log(error)
          reject(error)
        })
      })
    },
    updateDesign ({commit}, payload) {
      return new Promise((resolve, reject) => {
        Vue.http.put('designs/' + payload.params, payload.data).then(success => {
          console.log('updated design')
          console.log(success)
          commit('setDesign', success.data)
          resolve(success)
        }, error => {
          console.log('error updating design')
          console.log(error)
          reject(error)
        })
      })
    },
    // getParts({commit}, payload) {
    //   return new Promise((resolve, reject) => {
    //
    //   })
    // },
    getSpecs ({commit}, payload) {
      return new Promise((resolve, reject) => {
        Vue.http.get('specs/' + payload.id + '/?ref=' + payload.ref + '&type=' + payload.ref_type + '&config=' + payload.config_slug).then(success => {
          console.log('got specs')
          console.log(success)
          commit('setSpecs', success.data)
          resolve(success)
        }, error => {
          console.log('error getting specs')
          console.log(error)
          reject(error)
        })
      })
    },
    updateSpecs ({commit}, payload) {
      return new Promise((resolve, reject) => {
        Vue.http.put('specs/' + payload.params, payload.data).then(success => {
          console.log('Specs updated')
          console.log(success)
          commit('setSpecs', success.data)
          resolve(success)
        }, error => {
          console.log('Error updating specs')
          console.log(error)
          reject(error)
        })
      })
    },
    getBom ({commit}, payload) {
      Vue.http.get('boms/' + payload.id + '/?ref=' + payload.ref + '&type=' + payload.ref_type).then(success => {
        console.log('got BOM')
        console.log(success)
        commit('setBom', success.data)
      }, error => {
        console.log('error getting BOM')
        console.log(error)
      })
    },
    updateBom ({commit}, payload) {
      Vue.http.put('boms/' + payload.params, payload.data).then(response => {
        console.log('BOM updated')
        console.log(success)
        commit('setBom', success.data)
      }, error => {
        console.log('Error updating BOM')
        console.log(error)
      })
    },
    // getFiles ({commit}, payload) {
    //   Vue.http.get('files/' + payload.id + '/?ref=' + payload.ref + '&type=' + payload.ref_type).then(success => {
    //     console.log('got files')
    //     console.log(success)
    //     commit('setFiles', success.data)
    //   }, error => {
    //     console.log('error getting files')
    //     console.log(error)
    //   })
    // },
    // updateFiles ({commit}, payload) {
    //   Vue.http.put('files/' + payload.params, payload.data).then(success => {
    //     console.log('Files updated')
    //     console.log(success)
    //     commit('setFiles', success.data)
    //   }, error => {
    //     console.log('Error updating files')
    //     console.log(error)
    //   })
    // },
  }
})
