<template lang="html">
  <div :class='first ? "ui list" : "list"' style='padding-top:4px'>
    <div class="item" v-for='(part, index) in data' :style='getStyle(part)'>
      <!-- <i
        v-if='part.parts.length > 0'
        :class="part.isOpen ? 'left floated angle down icon' : 'left floated angle right icon'"
        @click='toggle(index)'
      ></i> -->
      <i
        v-if='part.parts.length > 0'
        :class="part.isOpen ? 'blue folder outline open icon' : 'blue folder outline icon'"
        @click='toggle(index)'
      ></i>
      <i
        v-else
        class="blue file outline icon"
        style='padding-left: 0px'
      ></i>
      <div class="content" style='padding: 0px'>
        <a
          href='#'
          @click.prevent='selectPart(part)'
        >
          {{ part.design_name }}
        </a>
        <app-PartsTree :data='part.parts' :first='false' v-if='part.parts.length > 0 && part.isOpen'></app-PartsTree>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'appPartsTree',
  props: ['data', 'first'],
  data() {
    return {
      parts: this.data,
    }
  },
  computed: {
    ...mapState([
      'rootDesign',
      'node',
      'tree',
    ])
  },
  methods: {
    toggle(index) {
      if (this.parts.length > 0) {
        if (this.env != 'prod') {
          console.log(this.parts[index].isOpen)
        }
        // find the part in the tree and commit the state change
          // search the tree and modify the part
          // set the new Tree

        // right now you are just changing the local state
        this.parts[index].isOpen = !this.parts[index].isOpen

        if (this.env != 'prod') {
          console.log('Toggled assembly open/close')
        }
      }
    },
    getStyle(part) {
      if (part.design_id == this.node.design_id) {
        return {
          'font-weight': 'bold',
          'background-color': '#e9e9e9',
          'border-radius': '5px',
          'padding': '5px'

        }
      } else {
        return {
          'font-weight': 'normal'
        }
      }
    },
    findNode(tree, part_id) {
      for (let part of tree) {
        if (part.unique_id == part_id) {
          this.$store.commit('setNode', part)
        }
        if (part.parts.length > 0) {
          this.findNode(part.parts, part_id)
        }
      }
    },
    selectPart(part) {
      if (this.env != 'prod') {
        console.log('Open part clicked from tree')
      }

      let design_payload = {
        design_slug: part.design_slug,
        owner_slug: part.owner_slug,
        revision_slug: part.revision_slug
      }

      this.$store.dispatch('getDesign', design_payload)

      let payload = {
        design_id: part.design_id,
        revision_slug: part.revision_slug,
      }

      this.$store.dispatch('getParts', payload).then(success => {
        $('.ui.dropdown.part').dropdown({ 'silent': true })
        $('.ui.dropdown.revision').dropdown({ 'silent': true })
      }, error => {})

      if (part.design_id == this.rootDesign.id) {
        var part_id = 0
      } else {
        var part_id = part.unique_id
      }

      this.findNode(this.tree, part_id)
    },
  }
}
</script>

<style lang="css">
  .ui.list {
    margin-top: 15px;
    padding-top: 0px;
  }

  #bold {
    font-weight: bold;
  }

  div.item {
    padding-top: 0;
    padding-bottom: 0;
  }
</style>
