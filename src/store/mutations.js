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
  setRouteParams(state, data) {
    state.route.params = data
    if (state.env != 'prod') {
      console.log('route params set in store')
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
  setRootDesign(state, data) {
    state.rootDesign = data
    if (state.env != 'prod') {
      console.log('root design set in store')
    }
  },
  setDesign(state, data) {
    state.design = data
    if (state.env != 'prod') {
      console.log('design set in store')
    }
  },
  setTree(state, data) {
    // state.tree = null
    // if (state.env != 'prod') {
    //   console.log('tree cleared in store')
    // }
    state.tree = data
    if (state.env != 'prod') {
      console.log('tree set in store')
    }
  },
  setNode(state, data) {
    state.node = data
    if (state.env != 'prod') {
      console.log('selected node set in store')
    }
  },
  setTrail(state, data) {
    state.trail = data
    if (state.env != 'prod') {
      console.log('trail set in store')
    }
  },
  setParts(state, data) {
    state.parts = data
    if (state.env != 'prod') {
      console.log('part parts set in store')
    }
  },
  addPart(state, data) {
    state.parts.push(data)
    if (state.env != 'prod') {
      console.log('part added in store')
    }
  },
  setPart(state, data) {
    state.parts[data.index].part_id = data.part.part_id
    state.parts[data.index].design_id = data.part.design_id
    state.parts[data.index].design_name = data.part.design_name
    state.parts[data.index].design_slug = data.part.design_slug
    state.parts[data.index].design_number = data.part.design_number
    state.parts[data.index].parent_id = data.part.parent_id
    state.parts[data.index].revision_name = data.part.revision_name
    state.parts[data.index].revision_id = data.part.revision_id
    state.parts[data.index].quantity = data.part.quantity
    state.parts[data.index].cost = data.part.cost
    state.parts[data.index].parts = data.part.parts
    state.parts[data.index].revisions = data.part.revisions
    // state.parts[data.index].created = data.part.created
    // state.parts[data.index].editable = data.part.editable
    // state.parts[data.index].creator_slug = data.part.creator_slug
    state.parts[data.index].owner_slug = data.part.owner_slug

    if (state.env != 'prod') {
      console.log('set part in store')
      console.dir(state.parts)
    }
  },
  removePart(state, data) {
    state.parts.splice(data, 1)
    if (state.env != 'prod') {
      console.log('removed part in store')
    }
  },
  clearDesign(state) {
    state.design = null
    state.tree = null
    state.rootDesign = null
    state.trail = null
    state.node = null
    state.parts = null
    if (state.env != 'prod') {
      console.log('All design state cleared in store')
    }
  }
}
