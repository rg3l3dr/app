<template lang="html">
  <div>
    <div class='ui small top attached header'>
      <i class="fa fa-list-ul text-primary" aria-hidden="true"></i>
      <div class="content">
        &nbsp
        Specs
      </div>
    </div>
    <div class="ui bottom attached clearing segment">
      <div class="ui form">
        <div class="inline field" v-for='(prop, index) in specsArray'>
          <div class="ui grid">
            <div class="four wide column" style='padding: 0px 0px 0px 25px'>
              <label  :contenteditable='prop.key == "Custom (click to edit)"' @blur='changePropName(index)'>
                <strong :id='"spec-" + index' >
                  {{ prop.key }}
                </strong>
              </label>
            </div>
            <div class="six wide column" style='padding: 0px 0px 0px 0px'>
              <input type="text" v-model='prop.value'>
            </div>
            <div class="two wide column"></div>
            <div class="one wide column">
              <button class="ui circular mini button" @click='removeProp(index)'>X</button>
            </div>
          </div>
        </div>
        <button class="ui button" style='margin-left: 15px' @click='addEmptyProp'>Add Spec</button>
        <button class="ui button" style='margin-left: 15px' @click='dispatchUpdateSpecs'>Update Specs</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { EventBus } from '../../../event-bus.js'

export default {
  name: 'home',
  data () {
    return {
      specsObject: {},
      specsArray: []
    }
  },
  computed: {
    ...mapGetters([
      'session',
      'profile',
      'design',
      'designRefs',
      'specs'
    ])
  },
  watch: {
    designRefs: function () {
      console.log('designRefs watcher has been called in specs.vue')
      this.dispatchGetSpecs()
    }
  },
  methods: {
    dispatchGetSpecs: function() {
      let payload = {
        id: this.design.specs.id,
        ref: this.designRefs.ref,
        ref_type: this.designRefs.ref_type
      }
      this.$store.dispatch('getSpecs', payload).then(succes => {
        this.getSpecsArray()
      }, error => {

      })
    },
    getSpecsArray: function() {
      this.specsArray = []
      for (let specsKey in this.specs.data) {
        let specsObject = {
          key: specsKey,
          value: this.specs.data[specsKey]
        }
        this.specsArray.push(specsObject)
      }
    },
    dispatchUpdateSpecs: function() {
      // convert specs array back to specs object (python dict)
      this.specsObject = {}
      for (let prop of this.specsArray) {
        this.specsObject[prop.key] = prop.value
      }

      let payload = {
        params: this.design.specs.id + '/?ref=' + this.$route.params.config_slug,
        data: {
          editor: this.profile.id,
          data: this.specsObject
        }
      }

      this.$store.dispatch('updateSpecs', payload).then(succes => {
        this.$router.push(this.designRefs.path + '/home')
      }, error => {

      })
    },
    addEmptyProp: function() {
      let newProp = {
        key: 'Custom (click to edit)',
        value: ''
      }
      this.specsArray.push(newProp)
    },
    changePropName: function(index) {
      console.log('Changing property name at index: ' + index)
      let newKey = $('#spec-' + index).text().trim()
      if (newKey != 'Custom (click to edit)') {
        this.specsArray[index]['key'] = newKey
      }
    },
    removeProp: function(index) {
      this.specsArray.splice(index, 1)
    }
  },
  created: function() {
    if (this.design.specs) {
      console.log('Specs.vue created, design data already loaded, getting specs')
      this.dispatchGetSpecs()
    } else {
      console.log('Specs.vue created, no design data present, waiting on watcher')
    }
  }
}
</script>

<style lang="css">
</style>
