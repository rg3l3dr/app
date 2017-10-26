import {store} from './store.js'
import {state} from './state.js'
let _ = require('lodash')

export const getters = {
  designRoute() {
    if (store.state.route.params.token) {
      return `/shares/${store.state.route.params.token}`
    } else if (store.state.route.params) {
      return `/${store.state.route.params.profile_slug}/${store.state.route.params.design_slug}/${store.state.route.params.revision_slug}`
    } else {
      return null
    }

     return store.state.route.params ?  `/${store.state.route.params.profile_slug}/${store.state.route.params.design_slug}/${store.state.route.params.revision_slug}`: null
  },
  // partRoute() {
  //   return store.state.route.params && store.state.part ?
  //   `/${state.part.owner_slug}/${state.part.slug}/${state.part.revision_slug}` : null
  // },
  endpoint() {
    return store.state.route.fullPath ? _.last(store.state.route.fullPath.split('/')) : null
  },
  pre_endpoint() {
    return store.state.route.fullPath ?  _.nth(store.state.route.fullPath.split('/'), -2) : null
  }
}
