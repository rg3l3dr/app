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
        <div class="inline field" v-for='(prop, index) in propsArray'>
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
        <button class="ui button" style='margin-left: 15px' @click='dispatchUpdateProps'>Update Specs</button>
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
      propsObject: {},
      propsArray: []
    }
  },
  computed: {
    ...mapGetters([
      'session',
      'profile',
      'design',
      'refs',
      'props'
    ])
  },
  watch: {
    refs: function () {
      console.log('Refs watcher has been called in specs.vue')
      this.dispatchGetProps()
    }
  },
  methods: {
    dispatchGetProps: function() {
      let payload = {
        id: this.design.props.id,
        ref: this.refs.ref,
        ref_type: this.refs.ref_type
      }
      this.$store.dispatch('getProps', payload).then(succes => {
        this.getPropsArray()
      }, error => {

      })
    },
    getPropsArray: function() {
      this.propsArray = []
      for (let propsKey in this.props.data) {
        let propsObject = {
          key: propsKey,
          value: this.props.data[propsKey]
        }
        this.propsArray.push(propsObject)
      }
    },
    dispatchUpdateProps: function() {
      // convert props array back to props object (python dict)
      this.propsObject = {}
      for (let prop of this.propsArray) {
        this.propsObject[prop.key] = prop.value
      }

      let payload = {
        params: this.design.props.id + '/?ref=' + this.refs.config,
        data: {
          editor: this.profile.id,
          data: this.propsObject
        }
      }

      this.$store.dispatch('updateProps', payload).then(succes => {
        this.$router.push(this.refs.path + '/home')
      }, error => {

      })
    },
    addEmptyProp: function() {
      let newProp = {
        key: 'Custom (click to edit)',
        value: ''
      }
      this.propsArray.push(newProp)
    },
    changePropName: function(index) {
      console.log('Changing property name at index: ' + index)
      let newKey = $('#spec-' + index).text().trim()
      if (newKey != 'Custom (click to edit)') {
        this.propsArray[index]['key'] = newKey
      }
    },
    removeProp: function(index) {
      this.propsArray.splice(index, 1)
    }
  },
  created: function() {
    if (this.design.props) {
      console.log('Specs.vue created, design data already loaded, getting props')
      this.dispatchGetProps()
    } else {
      console.log('Specs.vue created, no design data present, waiting on watcher')
    }
  }
}
</script>

<style lang="css">
</style>
