import Vue from 'vue'
import VueResource from 'vue-resource'
import {state} from './state.js'
import {store} from './store.js'


Vue.use(VueResource)

export const actions = {
  getProfile ({commit, state}) {
    // Gets and sets the user profile using the DRF profile ViewSet
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
  getTree({commit, state}, payload) {
    // gets the tree (simple indented BOM) from function based API view but does not set it
    return new Promise((resolve, reject) => {
      Vue.http.post('get_tree/', payload).then(success => {
        if (state.env != 'prod') {
          console.log('Got design tree')
          console.dir(success)
        }
        resolve(success.body)
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
    return new Promise((resolve, reject) => {
      // gets the AWS temporary token from function based API view and updates the global AWS config
      Vue.http.get('get_token/').then(success => {
        if (state.env != 'prod') {
          console.log('Got token from S3')
        }
        let values = success.body
        AWS.config.update({
          region: 'us-west-2',
          accessKeyId: values.value_1,
          secretAccessKey: values.value_2,
          sessionToken: values.value_3
        })
        values = null
        resolve()
      }, error => {
        if (state.env != 'prod') {
          console.log('Error getting token')
        }
        reject()
      })
    })
  },
  checkDesign({state}, payload) {
    // Checks if a design exists by slug and owner slug, returns a boolean, DRF function based api view
    return new Promise((resolve, reject) => {
      Vue.http.post('check_design/', payload).then(success => {

        if (!success.body.active) {
          if (state.env != 'prod') {
            console.log('this design name is available')
            console.dir(success)
          }
          resolve(success)
        } else {
          if (state.env != 'prod') {
            console.log('design name is already in use')
            console.dir(success)
          }
          reject(success)
        }
      }, error => {
        if (state.env != 'prod') {
          console.log('error checking if design exists')
          console.dir(error)
        }
        reject(error)
      })
    })
  },
  createDesign({state}, payload) {
    // creates a new design using DRF function based API view
    return new Promise((resolve, reject) => {
      Vue.http.post('create_design/', payload).then(success => {
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
    // gets and sets a design from the DRF design viewset
    return new Promise((resolve, reject) => {
      if (!payload.design_slug) {
        var design_path = `designs/shared_design/?token=${payload.token}`
      } else {
        if (payload.token != undefined) {
          var design_path = `designs/${payload.design_slug}/?owner_slug=${payload.owner_slug}&revision_slug=${payload.revision_slug}&token=${payload.token}`
        } else {
          var design_path = `designs/${payload.design_slug}/?owner_slug=${payload.owner_slug}&revision_slug=${payload.revision_slug}`
        }

      }

      // let design_path = `designs/${payload.design_slug}/?owner_slug=${payload.owner_slug}&revision_slug=${payload.revision_slug}&token=${payload.token}`
      Vue.http.get(design_path).then(success => {
        if (state.env != 'prod') {
          console.log('Got design')
          console.dir(success)
        }

        if (payload.revision_slug) {
          success.body.revisions.forEach(rev => {
            if (rev.slug == payload.revision_slug) {
              commit('setRevision', rev)
            }
          })
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
  updateDesign({commit, state}, payload) {
    // updates a design via DRF design view set, only updates the fields that are passed, must pass the entire data object, else it will overwrite with single property
    return new Promise((resolve, reject) => {
        Vue.http.patch(`designs/${payload.slug}/?owner_slug=${payload.owner_slug}`, payload.data).then(success => {
          if (state.env != 'prod') {
            console.log('updated design')
            console.dir(success)
          }
          resolve(success)
        }, error => {
          if (state.enve != 'prod') {
            console.log('error updating design')
            console.dir(error)
          }
          reject(error)
        })
    })
  },
  updateDesignData ({commit, state}, payload) {
    // used to update specific fields within the data field (JSON field) without overwriting the entire object, generally from specs or settings, vs from the BOM
    return new Promise((resolve, reject) => {
      Vue.http.post('update_design_data/', payload).then(success => {
        if (success) {
          if (state.env != 'prod') {
            console.log('updated existing design (part)')
            console.dir(success)
          }
          resolve(success)
        }
      }, error => {
        if (state.env != 'prod') {
          console.log('error updating existing design (part)')
          console.dir(error)
        }
        reject(error)
      })
    })
  },
  addNewPart({state}, payload) {
    // creates a new part and adds it to the BOM, function based API view
    return new Promise((resolve, reject) => {
      Vue.http.post('add_new_part/', payload).then(success => {
        if (success) {
          if (state.env != 'prod') {
            console.log('created new part and added to BOM')
            console.dir(success)
          }
          resolve(success)
        }
      }, error => {
        if (state.env != 'prod') {
          console.log('error creating new part and adding to BOM')
          console.dir(error)
        }
        reject(error)
      })
    })
  },
  addExistingPart({state}, payload) {
    // adds an existing part to the BOM, function based API view
    return new Promise((resolve, reject) => {
      Vue.http.post('add_existing_part/', payload).then(success => {
        if (success) {
          if (success.body.inBom) {
            if (state.env != 'prod') {
              console.log("cannot add part to bom, a parent design is in this part's bom")
              console.dir(success)
            }
            reject(success)
          } else {
            // else return success
            if (state.env != 'prod') {
              console.log('added existing part to BOM')
              console.dir(success)
            }
            resolve(success)
          }
        }
      }, error => {
        if (state.env != 'prod') {
          console.log('error adding existing part to bom')
          console.dir(error)
        }
        reject(error)
      })
    })
  },
  getParts({commit, state}, payload) {
    // gets the BOM for a given level in a design project, funciton based API view
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
  updatePart({state}, payload) {
    // updates an existing part within a BOM, changing either the qty or revision, function based API view
    return new Promise((resolve, reject) => {
      Vue.http.post('update_part/', payload).then(success => {
        if (success.body.updated) {
          if (state.env != 'prod') {
            console.log('updated part in BOM')
            console.dir(success)
          }
          resolve(success)
        } else {
          if (state.env != 'prod') {
            console.log('error updating part in BOM with successful response')
            console.dir(success)
          }
          reject(success)
        }
      }, error => {
        if (state.env != 'prod') {
          console.log('error updating part in BOM')
          console.dir(error)
        }
        reject(error)
      })
    })
  },
  deletePart({state}, payload) {
    // removes a part from the BOM, function based API view
    return new Promise((resolve, reject) => {
      Vue.http.post('delete_part/', payload).then(success => {
        if (success) {
          if (state.env != 'prod') {
            console.log('deleted part from BOM')
            console.dir(success)
          }
          resolve(success)
        }
      }, error => {
        if (state.env != 'prod') {
          console.log('error deleting part from BOM')
          console.dir(error)
        }
        reject(error)
      })
    })
  },
}
