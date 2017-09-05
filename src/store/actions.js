import Vue from 'vue'
import VueResource from 'vue-resource'
import {state} from './state.js'
import {store} from './store.js'


Vue.use(VueResource)

export const actions = {
  getProfile ({commit, state}) {
    return new Promise((resolve, reject) => {
      Vue.http.get('profiles/' + state.session.username.toLowerCase() + '/').then(success => {
        if (state.env != 'prod') {
          console.log('Got profile')
          console.dir(success)
        }
        commit('setProfile', success.data)
        resolve(success)
      }, error => {
        if (state.env != 'prod') {
          console.log('Error getting profile')
          console.dir(error)
        }
        reject(error)
      })
    })
  },
  createDesign({state}, payload) {
    return new Promise((resolve, reject) => {
      Vue.http.post('create_design', payload).then(success => {
        // if (typeof success.body.non_field_errors !== 'undefined') {
        //   if (state.env != 'prod') {
        //     console.log('Error creating new design: non-field error')
        //   }
        //   reject(success)
        // } else {
        //   if (state.env != 'prod') {
        //     console.log('created new design')
        //     console.log(success)
        //   }
        //   resolve(success)
        // }
        if (success) {
          if (state.env != 'prod') {
            console.log('created new design')
            console.dir(success)
          }
          resolve(success)
        }
      }, error => {
        if (state.env != 'prod') {
          console.log('error creating new design')
          console.dir(error)
        }
        reject(error)
      })
    })
  },
  getDesign ({commit, state}, payload) {
    return new Promise((resolve, reject) => {
      Vue.http.get('designs/' + payload.design_slug + '?owner_slug=' + payload.owner_slug.toLowerCase()).then(success => {
        if (state.env != 'prod') {
          console.log('Got design')
          console.dir(success)
        }
        commit('setDesign', success.data)
        resolve(success)
      }, error => {
        if (state.env != 'prod') {
          console.log('Error getting design')
          console.dir(error)
        }
        if (error.body == 'Unauthorized') {
          this.$router.push('/unauthorized')
        } else if (error.body.detail == 'Not f.') {
          this.$router.push('/404')
        }
        reject(error)
      })
    })
  },
  updateDesign ({commit, state}, payload) {
    return new Promise((resolve, reject) => {
      Vue.http.patch(`designs/${state.design.slug}/?owner_slug=${state.design.owner_slug}`, payload).then(success => {
        if (state.env != 'prod') {
          console.log('updated design')
          console.dir(success)
        }
        let payload = {
          design_slug: success.body.slug,
          owner_slug: state.design.owner_slug
        }
        console.log('getting design after updating design')
        store.dispatch('getDesign', payload).then(
          success => {
            console.log('got design')
            console.dir(success)
            resolve(success)
          },
          error => {
            console.log('error getting design')
            console.dir(error)
            reject(error)
          }
        )
      }, error => {
        if (state.env != 'prod') {
          console.log('error updating design')
          console.dir(error)
        }
        reject(error)
      })
    })
  },
  getTree({commit, state}, payload) {
    return new Promise((resolve, reject) => {
      Vue.http.post('get_tree/', payload).then(success => {
        if (state.env != 'prod') {
          console.log('Got design tree')
          console.dir(success)
        }
        commit('setTree', success.data)
        console.log(state.tree)
        resolve()
      }, error => {
        if (state.env != 'prod') {
          console.log('Error getting design tree')
          console.dir(error)
        }
        if (error.body == 'Unauthorized') {
          this.$router.push('/unauthorized')
        } else if (error.body.detail == 'Not f.') {
          this.$router.push('/404')
        }
        reject()
      })
    })
  },
  getToken({commit, state}, payload) {
    Vue.http.get('get_token').then(success => {
      if (state.env != 'prod') {
        console.log('Got token')
      }
      let values = success.body
      AWS.config.update({
        region: 'us-west-2',
        accessKeyId: values.value_1,
        secretAccessKey: values.value_2,
        sessionToken: values.value_3
      })
      values = null
    }, error => {
      if (state.env != 'prod') {
        console.log('Error getting token')
      }
    })
  },
  getSpecs ({commit, state}, payload) {
    return new Promise((resolve, reject) => {
      Vue.http.get('specs/' + payload.id + '/?ref=' + payload.ref + '&type=' + payload.ref_type + '&config=' + payload.config_slug).then(success => {
        if (state.env != 'prod') {
          console.log('got specs')
          console.log(success)
        }
        commit('setSpecs', success.data)
        resolve(success)
      }, error => {
        if (state.env != 'prod') {
          console.log('error getting specs')
          console.log(error)
        }
        reject(error)
      })
    })
  },
  updateSpecs ({commit, state}, payload) {
    return new Promise((resolve, reject) => {
      Vue.http.put('specs/' + payload.params, payload.data).then(success => {
        if (state.env != 'prod') {
          console.log('Specs updated')
          console.log(success)
        }
        commit('setSpecs', success.data)
        resolve(success)
      }, error => {
        if (state.env != 'prod') {
          console.log('Error updating specs')
          console.log(error)
        }
        reject(error)
      })
    })
  },
  getBom ({commit, state}, payload) {
    return new Promise((resolve, reject) => {
      Vue.http.get(`boms/${payload.design_id}/?revision_slug=${payload.revision_slug}`).then(success => {
        if (state.env != 'prod') {
          console.log('got BOM')
          console.dir(success)
        }
        commit('setBom', success.data)
        resolve()
      }, error => {
        if (state.env != 'prod') {
          console.log('error getting BOM')
          console.dir(error)
        }
        reject()
      })
    })
  },
  updateBom ({commit, state}, payload) {
    return new Promise((resolve, reject) => {
      Vue.http.put(`boms/${payload.design_id}`, payload.data).then(response => {
        if (state.env != 'prod') {
          console.log('BOM updated')
          console.log(success)
        }
        commit('setBom', success.data)
        resolve()
      }, error => {
        if (state.env != 'prod') {
          console.log('Error updating BOM')
          console.log(error)
        }
        reject()
      })
    })
  },
  getParts({commit, state}, payload) {
    return new Promise((resolve, reject) => {
      Vue.http.post('get_bom_parts/', payload).then(success => {
        if (state.env != 'prod') {
          console.log('Got Parts')
          console.log(success)
        }
        commit('setParts', success.data)
        resolve(success)
      }, error => {
        if (state.env != 'prod') {
          console.log('Error getting Parts')
          console.log(error)
        }
        reject(error)
      })
    })

  },
}

/*
  Profile
  Design
  Part
  Parts
  Home
  BOM
  Files

*/
