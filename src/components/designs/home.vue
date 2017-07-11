<template lang="html">
  <div class='ui grid'>
    <div class="row"></div>
    <div class="row">
      <div class="ten wide column">
        <div class="ui small top attached header">
          <i class="fa-bars icon"></i>
          <div class="content">
            Description
          </div>
        </div>
        <div class="ui bottom attached clearing segment">
          {{ design.description }}
          <br>
          <br>
          <br>
        </div>
      </div>
      <div class="six wide column">
        <div class="ui small top attached header">
          <i class="fa-list-ul icon"></i>
          <div class="content">
            Specifications
          </div>
        </div>
        <div class="ui bottom attached clearing segment">
          <div class="ui relaxed divided list">
            <div class='item' v-for='(value, key) in props.data'>
              <div class="content">
                <strong>{{ key }}:</strong> &nbsp &nbsp {{ value }}
              </div>

            </div>
          </div>
          <router-link :to='this.refs.path + "/settings/specs" ' v-if='refs.rev == "latest"'>
            <button class='ui right floated tiny blue button'>
              <i class="fa fa-gear"></i>
              &nbsp Edit Specs
            </button>
          </router-link>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { EventBus } from '../../event-bus.js'
export default {
  name: 'home',
  data () {
    return {
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
    refs: function() {
      console.log('Refs watcher has been called in home.vue')
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
      this.$store.dispatch('getProps', payload)
    }
  },
  created: function() {
    if (this.design.props) {
      console.log('Home.vue created, design data already loaded, getting props')
      this.dispatchGetProps()
    } else {
      console.log('Home.vue created, no design data present, waiting on watcher')
    }
  },
}
</script>

<style lang="css">
div.small.top.attached.header {
  padding: 5px 14px 5px 14px;
}

</style>
