// require('../main.js')
import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import createPersistedState from 'vuex-persistedstate'
import { EventBus } from '../event-bus.js'

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
    query: null,
    profile: {},
    design: null,
    refs: {
      config: '',
      rev: '',
      change: '',
      ref: '',
      type: '',
      path: ''
    },
    props: {},
    bom: {},
    files: null
  },
  getters: {
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
    refs: state => {
      return state.refs
    },
    props: state => {
      return state.props
    },
    bom: state => {
      return state.bom
    },
    // files: state => {
    //   return state.files
    // }
  },
  mutations: {
    startSession (state, payload) {
      state.session.active = true
      state.session.token = payload.token
      state.session.username = payload.username
      state.session.user_id = payload.user_id
      console.log('Session opened in store')
    },
    endSession (state) {
      state.session = {
        active: false,
        token: null,
        'username': null,
        'user_id': null
      }
      state.profile = {},
      state.designs = {},
      state.design = {},
      state.refs = {
        config: null,
        rev: null,
        change: null,
        ref: null,
        type: null,
        path: null
      },
      state.props = {},
      state.bom = {},
      state.files = {}
      console.log('Session closed in store')
    },
    setQuery (state, data) {
      state.query = data
    },
    setRefs (state) {
      let config = store.state.route.params.config_slug ? store.state.route.params.config_slug : null
      let rev = store.state.route.params.rev_slug ? store.state.route.params.rev_slug : null
      let change = store.state.route.params.change_slug ? store.staee.route.params.change_slug : null

      let ref, ref_type, path, splits, endpoint, pre_endpoint

      if (change) {
        ref = change
        ref_type = 'change'
        console.log('set ref to change')
      } else if (rev && (rev != 'latest' && rev != 'Latest')) {
        ref = rev
        ref_type = 'rev'
        console.log('set ref to rev')
      } else if (config && (config != 'primary' && config != 'Primary')) {
        ref = config
        ref_type = 'config'
        console.log('set ref to config')
      } else {
        ref = 'primary'
        ref_type = 'config'
        console.log('set ref to Primary (default)')
      }
      if (ref_type == 'config' || ref_type == 'rev') {
         path =
          '/' + state.profile.slug
          + '/' + state.design.slug
          + '/' + config
          + '/' + rev
      } else {
        path =
          '/' + state.profile.slug
          + '/' + state.design.slug
          + '/' + change
      }
      splits = store.state.route.fullPath.split('/')
      endpoint = splits[splits.length - 1]
      pre_endpoint = splits[splits.length - 2]

      state.refs = {
        config: config,
        rev: rev,
        change: change,
        ref: ref,
        ref_type: ref_type,
        endpoint: endpoint,
        pre_endpoint: pre_endpoint,
        path: path
      }
      console.log('Refs set in store')
    },
    clearRefs (state) {
      state.refs = {
        config: null,
        rev: null,
        change: null,
        ref: null,
        type: null,
        path: null
      }
      console.log('refs cleared in store')
    },
    clearDesign (state) {
      state.design = {}
      console.log('design cleared in store')
    },
    setProfile (state, data) {
      state.profile = data
      console.log('profile set in store')
    },
    setDesign(state, data) {
      state.design = data
      console.log('design set in store')
    },
    setProps(state, data) {
      state.props = data
      console.log('props set in store')
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
      Vue.http.get('profiles/' + state.session.username + '/').then(success => {
        console.log(success)
        commit('setProfile', success.data)
      }, error => {
        console.log(error)
      })
    },
    getDesign ({commit}, payload) {
      return new Promise((resolve, reject) => {
        Vue.http.get('designs/' + payload.design_slug).then(success => {
          console.log('Got design')
          console.log(success)
          commit('setDesign', success.data)
          commit('setRefs')
          resolve(success)
        }, error => {
          console.log('Error getting design')
          console.log(error)
          reject(error)
        })
      })
    },
    updateDesign ({commit}, payload) {
      Vue.http.put('designs/' + payload.params, payload.data).then(success => {
        console.log('updated design')
        console.log(success)
        commit('setDesign', success.data)
      }, error => {
        console.log('error updating design')
        console.log(error)
      })
    },
    getProps ({commit}, payload) {
      Vue.http.get('props/' + payload.id + '/?ref=' + payload.ref + '&type=' + payload.ref_type).then(success => {
        console.log('got props')
        console.log(success)
        commit('setProps', success.data)
      }, error => {
        console.log('error getting props')
        console.log(error)
      })
    },
    updateProps ({commit}, payload) {
      Vue.http.put('props/' + payload.params, payload.data).then(success => {
        console.log('Props updated')
        console.log(success)
        commit('setProps', success.data)
      }, error => {
        console.log('Error updating props')
        console.log(error)
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
