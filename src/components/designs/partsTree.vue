<template lang="html">
  <div :class='first ? "ui list" : "list"' style='padding-top:4px'>
    <div class="item" v-for='(part, index) in data'>
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
export default {
  name: 'appPartsTree',
  props: ['data', 'first'],
  data() {
    return {
      parts: this.data,
    }
  },
  computed: {
  },
  methods: {
    toggle(index) {
      if (this.parts.length > 0) {
        this.parts[index].isOpen = !this.parts[index].isOpen
        if (this.env != 'prod') {
          console.log('Toggled part new')
          console.log(this.parts[index])
        }
      }
    },
    // setBomTrail(part) {
    //   let breadcrumb = {
    //     name: part.design_name,
    //     slug: part.design_slug,
    //     design_id: part.design_id,
    //     ref_slug: part.ref_slug,
    //     ref_type: part.ref_type,
    //     config_slug: part.config_slug,
    //     owner_slug: part.owner_slug
    //   }
    //   // this.newBomTrail.push(breadcrumb)
    //   return this.newBomTrail
    // },
    selectPart(part) {
      // console.log('Selected Part')
      // console.log(this.setBomTrail(part))
    }
  }
}
</script>

<style lang="css">
  .ui.list {
    margin-top: 15px;
    padding-top: 0px;
  }

  div.item {
    padding-top: 0;
    padding-bottom: 0;
  }
</style>
