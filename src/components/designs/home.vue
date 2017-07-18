<template lang="html">
  <div class='ui grid'>
    <div class="row">
      <br>
      <h3>
        &nbsp &nbsp
        {{ design.description }}
      </h3>
    </div>
    <div class="row">
      <div class="eight wide column" id='images'>
        <div class="ui small top attached header">
          <i class="fa-picture-o icon"></i>
          <div class="content">
            Images
          </div>
        </div>
        <div class="ui bottom attached clearing segment">
          <div class="ui fluid rounded image">
            <img src="https://semantic-ui.com/images/wireframe/image.png">
          </div>
        </div>
      </div>
      <div class="eight wide column" id='specs'>
        <div class="ui small top attached header">
          <i class="fa-list-ul icon"></i>
          <div class="content">
            Specifications
          </div>
        </div>
        <div class="ui bottom attached clearing segment">
          <div class="ui relaxed divided list">
            <div class='item' v-for='(value, key) in specs.data'>
              <div class="content">
                <strong>{{ key }}:</strong> &nbsp &nbsp {{ value }}
              </div>

            </div>
          </div>
          <router-link :to='this.designRefs.path + "/settings/specs" ' v-if='$route.params.rev_slug == "latest"'>
            <button class='ui right floated tiny blue button'>
              <i class="fa fa-gear"></i>
              &nbsp Edit Specs
            </button>
          </router-link>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="sixteen wide column">
        <div class="ui small top attached header">
          <i class="fa-file-text-o icon"></i>
          <div class="content">
            Readme
          </div>
        </div>
        <div class="ui bottom attached segment">
         <div class="myEditableDiv">
           <h2>TinyMCE Inline Mode</h2>
           <p>
             This is an editable div element.
           </p>
           <p>
             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tincidunt est ac dolor condimentum vitae laoreet ante accumsan. Nullam tincidunt tincidunt ante tempus commodo. Duis rutrum, magna non lacinia tincidunt, risus lacus tempus ipsum, sit amet euismod justo metus ut metus. Donec feugiat urna non leo laoreet in tincidunt lectus gravida. Sed semper ante sed dui consectetur eget commodo eros imperdiet. Mauris magna diam, scelerisque at ornare vel, dignissim ac sem. Fusce id congue lacus. Duis sit amet tellus erat. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Phasellus mattis facilisis pretium. In in nibh eu urna ornare semper. Sed imperdiet felis vitae nibh sagittis eu pulvinar metus facilisis. Sed dolor orci, aliquet sagittis auctor id, faucibus at justo.
           </p>
           <p>
             Vestibulum vestibulum velit nec magna lobortis elementum. Ut egestas ultrices tincidunt. Sed vestibulum mi vitae dui interdum eget rhoncus neque faucibus. Ut nec leo tellus. Nunc in metus sit amet purus bibendum dignissim pulvinar quis erat. Quisque vel ultricies nisi. Vestibulum eu ante risus. In ultrices dignissim massa, vel luctus dui consequat quis. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
           </p>
         </div>
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
      'designRefs',
      'specs'
    ])
  },
  // on full page load / refresh
    // get the design first
      // get the specs next -- based on ref

  // on page transition
    // just get the specs -- based on ref

  // on params change
    // just get the specs -- based on ref

  watch: {
    designRefs: function() {
      console.log('DesignRefs watcher has been called in home.vue')
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
      this.$store.dispatch('getSpecs', payload)
    }
  },
  created: function() {

    if (this.design.specs) {
      console.log('Home.vue created, design data already loaded, getting specs')
      this.dispatchGetSpecs()
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
