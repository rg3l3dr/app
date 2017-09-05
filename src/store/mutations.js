import {state} from './state.js'
import {store} from './store.js'


export const mutations = {
  setEnv (state, payload) {
    state.env = payload
  },
  setBucket (state, payload) {
    state.bucket = payload.data
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
    if (state.env != 'prod') {
      console.log('Session opened in store')
    }
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
    state.profile = null
    state.rootDesign = null
    state.design = null
    state.tree = null
    state.parts = null

    if (state.env != 'prod') {
      console.log('Session closed in store')
    }
  },
  setProfile (state, data) {
    state.profile = data
    if (state.env != 'prod') {
      console.log('profile set in store')
    }
  },
  clearProfile(state) {
    state.profile = {}
    if (state.env != 'prod') {
      console.log('profile cleared in store')
    }
  },
  setQuery (state, data) {
    state.query = data
    if (state.env != 'prod') {
      console.log('query set in store')
    }
  },
  extendTrail(state, breadcrumb) {
    state.trail.push(breadcrumb)
  },
  setRootDesign(state, data) {
    state.rootDesign = data
    if (state.env != 'prod') {
      console.log('root design set in store')
    }
  },
  clearRootDesign(state, data) {
    state.rootDesign = null
    if (state.env != 'prod') {
      console.log('root design cleared in store')
    }
  },
  setDesign(state, data) {
    state.design = data
    if (state.env != 'prod') {
      console.log('design set in store')
    }
  },
  clearDesign (state) {
    state.design = null
    if (state.env != 'prod') {
      console.log('design cleared in store')
    }
  },
  setTree(state, data) {
    state.tree = data
    if (state.env != 'prod') {
      console.log('tree set in store')
    }
  },
  clearTree(state) {
    state.tree = null
    if (state.env != 'prod') {
      console.log('tree cleared in store')
    }
  },
  clearAllDesign(state) {
    state.design = null
    state.tree = null
    state.rootDesign = null
    if (state.env != 'prod') {
      console.log('total design state cleared in store')
    }
  },
  setPart(state, data) {
    state.part = data
    if (state.env != 'prod') {
      console.log('part set in store')
    }
  },
  setHome(state, data) {
    state.home = data
    if (state.env != 'prod') {
      console.log('part home data set in store')
    }
  },
  setBom(state, data) {
    state.bom = data
    if (state.env != 'prod') {
      console.log('part bom set in store')
    }
  },
  setParts(state, data) {
    state.parts = data
    if (state.env != 'prod') {
      console.log('part parts set in store')
    }
  },
  setFiles(state, data) {
    state.files = data
    if (state.env != 'prod') {
      console.log('part files set in store')
    }
  },
  setSpecs(state, data) {
    state.specs = data
    if (state.env != 'prod') {
      console.log('part specs set in store')
    }
  }
}
