<template lang="html">
  <div>
    <div></div>
    <div class="ui top attached grey header">
      BILL OF MATERIALS &#8212; Add parts and create nested assemblies
    </div>
    <div class="ui bottom attached segment">
      <div class="ui grid">
        <div class="row">
          <div class="ten wide column">
            <div class="ui large breadcrumb" style='padding: 0px'>
              <span v-for='(breadcrumb, index) in trail'>
                <span v-if='(trail.length - 1) != index'>
                  <router-link tag='a' to='' @click.native='changeBomLevel(index)'>
                    {{ breadcrumb.name }}
                  </router-link>
                  <span  class='divider'>/</span>
                </span>
                <span v-else>
                  <div class="active section">{{ breadcrumb.name }}</div>
                  &nbsp
                  <div v-if='index != 0' class="ui icon top left pointing mini basic dropdown button">
                    <i class="caret down icon"></i>
                    <div class="menu">
                      <div class="item">Assembly Options</div>
                      <div class="item" @click='viewPart(index)'>
                        <i class="home icon"></i>
                        View Homepage
                      </div>
                      <div class="item">
                        <i class="edit icon"></i>
                        Edit Assembly
                      </div>
                      <!-- <div class="item">
                        <i class="compress icon"></i>
                        Collapse Assembly
                      </div>
                      <div class="item">
                        <i class="level up icon"></i>
                        Move Up in BOM
                      </div> -->
                      <div v-if='refs.rev == "latest"' class="item" @click='removePart(index)'>
                        <i class="trash icon"></i>
                        Remove from BOM
                      </div>
                    </div>
                  </div>
                </span>
              </span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="six wide column">
          <!-- <div class="ui transparent search input">
            <input class="prompt" type="text" placeholder=" Search parts library...">
            <div class="results"></div>
          </div> -->
          </div>
        </div>
      </div>
      <table class="ui striped selectable table" id='bomTable'>
        <thead>
          <tr>
            <th></th>
            <th>Part Name</th>
            <th>Latest Change</th>
            <th>Quantity</th>
            <th>Cost</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <button
                v-if='refs.rev == "latest"'
                class="ui small primary button"
                @click='addNewPart'
                id='add-part-button'
              >
                Add a New Part
              </button>
            </td>
            <td></td>
            <td></td>
            <td>Total</td>
            <td> $ {{ sumTotal.toFixed(2) }} </td>
          </tr>
        </tfoot>
        <tbody>
          <tr v-for='(part, index, key) in parts'>

            <!-- Part Type Icon & Modal Link -->
            <td>
              <a href="#" @click='showModal(index)'>
                <i v-if='part.bom.data.length > 0' class="cubes icon"></i>
                <i v-else-if='part.files.data.length > 0' class="fa-files-o icon"></i>
                <i v-else class="fa-list-ul icon"></i>
              </a>
            </td>

            <!-- Part Name -->
          <!--   <td v-if='!part.meta.created && refs.rev == "latest"' >
            <div class="ui transparent input" id='part-name-editable-div'>
              <input
                type="text"
                v-model='newPartName.data'
                id='part-name-editable'
                size='25'
                @keyup.enter='newPartName.data ? testNewPart(index) : partNameError(index)'
                @keydown.esc='removePart(index)'
                @keydown.delete='newPartName.data ? null : removePart(index)'
                @blur='newPartName.data ? newBlurTest(index, $event) : partNameError(index)'
              >
            </div>
          </td> -->

            <td v-if='!part.meta.created && refs.rev == "latest"'>
                <div class="ui transparent search input" id='part-name-editable-div'>
                  <input
                    class="prompt"
                    type="text"
                    v-model='newPartName.data'
                    id='part-name-editable'
                    placeholder=" Search parts library..."
                    @keydown.enter='getResult(index)'
                    @blur='result ? null : newBlurTest(index, $event)'
                    @keydown.tab='getResult(index)'
                    @keydown.esc='removePart(index)'
                    @keydown.delete='newPartName.data ? null : removePart(index)'
                  >
                <!--   @keyup.enter='newPartName.data ? testNewPart(index) : partNameError(index)'
                @blur='newPartName.data ? newBlurTest(index, $event) : partNameError(index)' -->
                  <div class="results" @click='getResult(index)'></div>
                </div>
            </td>



            <td v-else-if='part.meta.created && part.meta.editable && refs.rev == "latest" '>
              <div class="ui transparent input" id='part-name-editable-div'>
                <input
                  type="text"
                  v-model='part.design.name'
                  id='part-name-editable'
                  size='25'
                  @keyup.enter='part.design.name ? testEditedPartDesign(index) : partNameError(index)'
                  @keyup.delete='part.design.name ? null : removePart(index)'
                  @keydown.tab.prevent='tabOver($event)'
                  @blur='part.design.name ? updateBlurTest(index, $event) : partNameError(index)'
                >
              </div>
            </td>

          <!--   <td v-else @click='makePartEditable(index, "name")' id='part-name'>
            {{ part.design.name }}
          </td> -->

            <td v-else id='part-name'>
              <span v-if='part.bom.data.length == 0'>
                <router-link tag='a' to='' @click.native='openPart(index)'>
                  {{ part.design.name }}
                </router-link>
              </span>
              <span v-else>
                <router-link tag='a' to='' @click.native='openAssembly(index)'>
                  {{ part.design.name }}
                </router-link>
              </span>
            </td>

            <!-- Last Change for Part -->
            <td>
              <!-- <div v-if='!part.meta.created'>
                <a href="#">{{ part.changes[-1].owner }}</a> <a href="#">{{ part.changes[-1].message }}</a>  {{ part.changes[-1].created_at }}
              </div> -->
            </td>

            <!-- Part Quantity -->
            <td
              v-if='!part.meta.created && refs.rev == "latest"'
              class='ui transparent input'
            >
              <input
                type="number"
                min='1'
                v-model='part.meta.quantity'
                id='part-quantity-editable'
                @keyup.enter='newPartName.data ? testNewPart(index) : partNameError(index)'
                @blur='newPartName.data ? newBlurTest(index, $event) : partNameError(index)'
              >
            </td>

            <td
              v-else-if='part.meta.created && part.meta.editable && refs.rev == "latest"'
              class='ui transparent input'
            >
              <input
                type="number"
                id='part-quantity-editable'
                v-model='part.meta.quantity'
                min='1'
                @keyup.enter='part.design.name ? testEditedPartDesign(index) : partNameError(index)'
                @blur='part.design.name ? updateBlurTest(index, $event) : partNameError(index)'
              >
            </td>

            <td
              v-else
              id='part-quantity'
              @click='makePartEditable(index, "quantity")'
            >
              {{ part.meta.quantity }}
            </td>

            <!-- Part Cost -->
            <td v-if='!part.meta.created && refs.rev == "latest"'>
              <div class="ui transparent input">
                <input
                  type="number"
                  id='part-cost-editable'
                  min='0'
                  step='.01'
                  v-model='part.props.data["Cost"]'
                  @keyup.enter='newPartName.data ? testNewPart(index) : partNameError(index)'
                  @keydown.tab='newPartName.data ? testNewPart(index) : partNameError(index)'
                  @blur='newPartName.data ? newBlurTest(index, $event) : partNameError(index)'
                >
              </div>
            </td>

            <td v-else-if='part.meta.created && part.meta.editable && refs.rev == "latest"'>
              <div class="ui transparent input">
                <input
                  id='part-cost-editable'
                  type="number"
                  min='0'
                  step='.01'
                  v-model='part.props.data["Cost"]'
                  @keyup.enter='part.design.name ? testEditedPartDesign(index) : partNameError(index)'
                  @keydown.tab.prevent='part.design.name ? testEditedPartDesign(index) : partNameError(index)'
                  @blur='part.design.name ? updateBlurTest(index, $event) : partNameError(index)'
                >
              </div>
            </td>

            <td
              v-else
              id='part-cost'
              @click='makePartEditable(index, "cost")'
            >
              <span v-if='part.props.data["Cost"]'>
                $ {{ part.props.data['Cost'].toFixed(2) }}
              </span>
              <span v-else>
                $ 0.00
              </span>
            </td>

            <!-- Part Total -->
            <td v-if='part.props.data["Cost"]'>
              $ {{ (part.meta.quantity * part.props.data['Cost']).toFixed(2) }}
            </td>
            <td v-else>
              $ 0.00
            </td>


            <!-- Part Menu Options -->
            <td v-if='!part.meta.created'>
              <button
                class="circular ui mini basic icon button"
                @click='removePart(index)'
              >
                <i class="icon close"></i>
              </button>
            </td>
            <td v-else >
              <div
                class="ui icon top left pointing mini basic dropdown button"
                v-if='part.bom.data.length > 0'
              >
                <i class="caret down icon"></i>
                <div class="menu">
                  <div class="item">Assembly Options</div>
                  <div class="item" @click='viewPart(index)'>
                    <i class="home icon"></i>
                    View Homepage
                  </div>
                  <div class="item" @click='showModal(index)'>
                    <i class="edit icon"></i>
                    Edit Assembly
                  </div>
                  <!-- <div class="item">
                    <i class="compress icon"></i>
                    Collapse Assembly
                  </div>
                  <div class="item">
                    <i class="level up icon"></i>
                    Move Up in BOM
                  </div> -->
                  <div
                    v-if='refs.rev == "latest"'
                    class="item"
                    @click='removePart(index)'
                  >
                    <i class="trash icon"></i>
                    Remove from BOM
                  </div>
                </div>
              </div>
              <div class="ui icon top left pointing mini basic dropdown button" v-else>
                <i class="caret down icon"></i>
                <div class="menu">
                  <div class="item">
                    Part Options
                  </div>
                  <div class="divider"></div>
                  <div class="item" @click='viewPart(index)'>
                    <i class="home icon"></i>
                    View Homepage
                  </div>
                  <div class="item" @click='showModal(index)'>
                    <i class="edit icon"></i>
                    Edit Part
                  </div>
                  <div class="item" v-if='refs.rev == "latest"'>
                    <i class="level up icon"></i>
                    Move Up in BOM
                  </div>
                  <div v-if='refs.rev == "latest"' class="item" @click='openAssembly(index)'>
                    <i class="level down icon"></i>
                    Make Assembly
                  </div>
                  <div v-if='refs.rev == "latest"' class="item" @click='removePart(index)'>
                    <i class="trash icon"></i>
                    Remove from BOM
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="ui success message" v-if='message.active'>
        <i class="close icon"></i>
        <div class="header">
          {{ message.title }}
        </div>
        <p> {{ message.body }} </p>
      </div>
    </div>

    <div class="ui large modal" v-if='modalPart'>
      <div class="ui segment">
        <div class="ui grid">
          <div class="six wide column">
            <div v-if='test===true' class="ui big transparent input">
              <input type="text" v-model='modalPart.design.name' @blur='test="false"'>
            </div>
            <div class="ui header" v-else @click='test=true' style='margin: -5px 0px 0px 0px'>
              {{ modalPart.design.name }}
            </div>
            <div class="ui fluid transparent input">
              <input type="text" placeholder='Add a short description'>
            </div>
          </div>
          <div class="four wide column">
            <div class="ui basic icon buttons">
              <button class="ui button"><i class="fa fa-paperclip"></i></button>
              <button class="ui button"><i class="clone icon"></i></button>
              <button class="ui button"><i class="plus square icon"></i></button>
              <button class="ui button"><i class="balance scales icon"></i></button>
              <div class="ui icon top left pointing dropdown button">
                <i class="fa fa-ellipsis-h"></i>
                <div class="menu">
                  <div class="item">
                    <i class="home icon"></i>
                    Visit homepage
                  </div>
                  <div class="item">
                    <i class="level down icon"></i>
                    Make Assembly
                  </div>
                  <div class="item">
                    <i class="level up icon"></i>
                    Move Up in BOM
                  </div>
                  <div class="item">
                    <i class="trash icon"></i>
                    Remove from BOM
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="five wide column">
            <div class="ui mini labeled input">
              <div class="ui label">
                QTY
              </div>
              <input
                type="number"
                min='1'
                v-model='modalPart.meta.quantity'
                size='10'
              >
            </div>
            &nbsp &nbsp
            <div class="ui tiny basic labeled icon dropdown button">
              <i class="crosshairs icon"></i>
              <span class="text">Current Ref</span>
              <div class="menu">
                <div class="ui icon search input">
                  <i class="search icon"></i>
                  <input type="text" placeholder="Search configs and revs">
                </div>
                <div class="divider"></div>
                <div class="header">
                  <i class="crosshairs icon"></i>
                  Tracking Point
                </div>
                <div class="scrolling menu" v-if='modalPart.refs'>
                  <div class="item" v-for='ref in modalPart.refs'>
                    <i v-if='ref.type=="config"' class="fa-code-fork icon"></i>
                    <i v-else-if='ref.type=="rev"' class="tags icon"></i>
                    {{ ref.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="one wide column">
            <button class='circular ui right floated small basic icon button' @click='hideModal'>
              <i class="icon close"></i>
            </button>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="ui grid">
          <div class="seven wide column">
            <div class="image content">
              <div class="ui big image">
                <img :src="modalPart.design.picture">
              </div>
            </div>
          </div>
          <div class="nine wide column">
            <div class="ui top attached tabular menu">
              <a class="item active" data-tab='part-specs'>
                <i class="unordered list icon"></i>
                Specs
              </a>
              <a class="item" data-tab='part-changes'>
                <i class="history icon"></i>
                Changes
              </a>
              <a class="item" data-tab='part-files'>
                <i class="fa-files-o icon"></i>
                Files
              </a>
            </div>
            <div class="ui bottom attached active tab segment" data-tab='part-specs'>
              <table class="ui basic table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for='(value, key) in modalPart.props.data'>
                    <td>
                      {{ key }}
                    </td>
                    <td>
                      {{ value }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <button class="ui small blue basic button">Edit Properties</button>
            </div>
            <div class="ui bottom attached tab segment" data-tab='part-changes'>
              <table class="ui basic table">
                <thead>
                  <th>Editor</th>
                  <th>Change</th>
                  <th>Date</th>
                </thead>
                <tbody v-if='this.modalPart.changes'>
                  <tr v-for='change in this.modalPart.changes'>
                    <td><img src="" class="ui circular avatar image"></td>
                    <td>
                      <a href="#">{{ change.message }}</a>
                    </td>
                    <td>
                      {{ change.created_at | moment("MMMM Do YYYY") }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <button class="ui small blue basic button">Show Full History</button>
            </div>
            <div class="ui bottom attached tab segment" data-tab='part-files'>
              <table class="ui basic table">
                <thead>
                  <th>Editor</th>
                  <th>File Name</th>
                  <th>Change</th>
                  <th>Date</th>
                </thead>
                <tbody v-if='this.modalPart.files.length > 0'>
                  <tr v-for='file in this.modalPart.files'>
                    <td><img :src="file.editor.image" class="ui circular avatar image"></td>
                    <td>
                      <a :href="file.s3_url"> {{ file.name }} </a>
                    </td>
                    <td>{{ file.change }}</td>
                    <td>{{ file.last_updated }}</td>
                  </tr>
                </tbody>
              </table>
              <button class="ui small blue basic button">Upload new file or version</button>
            </div>
          </div>
        </div>
      </div>
      <div class="actions">
        <div
          v-if='modalIndex != 0'
          class="ui left labeled basic icon button"
          @click='modalIndex -= 1'
        >
          Previous Part
          <i class="left arrow icon"></i>
        </div>
        <div
          v-else
          class="ui left labeled disabled basic icon button"
        >
          Previous Part
          <i class="left arrow icon"></i>
        </div>
        <div
          v-if='modalIndex != (partsLength - 1)'
          class="ui right labeled basic icon button"
          @click='modalIndex += 1'
        >
          Next Part
          <i class="right arrow icon"></i>
        </div>
        <div
          v-else
          class="ui right labeled disabled basic icon button"
        >
          Next Part
          <i class="right arrow icon"></i>
        </div>
      </div>
    </div>
  </div>

</template>

<script>

import { mapGetters } from 'vuex'
import { EventBus } from '../../event-bus.js'
export default {
  name: 'parts',
  data() {
    return {
      newPartName: {
        data: null,
        hasError: false,
        error: null,
      },
      selectedPart: {},
      modalIndex: 0,
      test: false,
      trail: [],
      bom: [],
      parts: [],
      editedPartUpdated: false,
      results: [],
      result: {},
      resultSelected: false,
      message: {
        active: false,
        title: null,
        body: null
      }
    }
  },
  computed: {
    ...mapGetters([
      'session',
      'profile',
      'design',
      'refs',
      'params'
    ]),
    name_slug() {
      if (this.newPartName.data) {
        return this.newPartName.data.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')
      } else {
        return null
      }
    },
    sumTotal() {
      let total = 0
      for (let part of this.parts) {
        if (part.props.data['Cost']) {
          total += (part.meta.quantity * part.props.data['Cost'])
        }
      }
      return total
    },
    modalPart() {
      return this.parts[this.modalIndex]
    },
    partsLength() {
      return this.parts.length
    },
  },
  watch: {
    refs () {
      console.log('Refs watcher has been called in parts.vue')
      let bom_payload = {
        design_id: this.design.id,
        ref_slug: this.refs.ref,
        ref_type: this.refs.ref_type
      }
      this.getBomParts(bom_payload)
    }
  },
  methods: {

    /*
    -- Standard Pattern for asynch methods local to a component

      1. Define generic methods for vue-resource (ajax) calls to API
      2. On resolve, return a promise or emit an event on the EventBus
      3. Call the generic method from within a specific methods, and wait for promise to resolve or listen for event on the EventBus
        a. If this method is only being called once, you can emit an event
        b. If this method is being called multiple times, you will need to use a promise
      4. If using events, listen with .once (not .on) and create a unqiue name for each emit -> listen chain, else all listeners will fire on any emit

    -- Standard Pattern for asynch methods global to app

      1. Define store actions for generic vue-resource API calls
      2. Dispatch those methods from component A
      3. On resolve, the store action will call a store mutation
      4. The mutation will change store state, which is global to the app
      5. In component A/B, state change can be detected in three ways
        a. Wait for dispatch to resolve (standard pattern if same coponent)
        b. Watch the computed property mapped to store state for a change (for nested components, dependent on an asynch method in a parent)
        c. Emit an event in store, and listen for that event in component (edge cases for component B)


    -- Final ToDo BOM --

    1. Handle blur with event.relatedTarget
    2. Autocomplete on part name when adding a new part
    3. Clean up the modal UI

      */
    getDesigns() {
      this.$http.get('designlist/').then(success => {
        console.log(success)
        let designs = success.body.results
        for (let design of designs) {
          let result = {
            title: design.name,
            id: design.id,
            slug: design.slug,
            profile: design.creator
          }
          this.results.push(result)

          // $('.ui.search').search(
          //   { source: this.results }
          // )
        }
      }, error => {
        console.log(error)
      })
    },
    openPart(index) {
      console.log('Open part clicked')
      this.modalIndex = index

      // open the part modal
      $('.ui.modal').modal('show')
      $('.ui.dropdown').dropdown()
      $('.menu .item').tab()
    },
    openAssembly(index) {
      console.log('Open Assembly clicked')
      this.modalIndex = index

      // create a new breadrcrumb
      let breadcrumb = {
        name: this.modalPart.design.name,
        design_id: this.modalPart.design.id,
        ref_slug: this.modalPart.meta.ref_slug,
        ref_type: this.modalPart.meta.ref_type,
        path: this.modalPart.meta.path
      }

      this.trail.push(breadcrumb)

      // reset the bom to the new breadcrumb
      let bom_payload = {
        design_id: this.modalPart.design.id,
        ref_slug: this.modalPart.meta.ref_slug,
        ref_type: this.modalPart.meta.ref_type
      }

      this.getBomParts(bom_payload)
    },
    changeBomLevel(index) {
      console.log('Change BOM level clicked')

      // change the trail
      this.trail = this.trail.slice(0, index + 1)
      let breadcrumb = this.trail[index]
      let bom_payload = {
        design_id: breadcrumb.design_id,
        ref_slug: breadcrumb.ref_slug,
        ref_type: breadcrumb.ref_type
      }
      this.getBomParts(bom_payload)

    },
    getBomParts(payload) {
      this.$http.get('bom_parts/?design_id=' + payload.design_id + '&ref_slug=' + payload.ref_slug + '&ref_type=' + payload.ref_type).then(success => {
        console.log('Got bom and parts')
        console.log(success)
        this.bom = success.body.bom
        this.parts = success.body.parts
        setTimeout(function() {
            console.log('trying to activate drodpdown on parts')
            $('.ui.dropdown').dropdown(
              { 'silent': true }
            );
        }, 0);

        if (this.trail.length == 0) {
          let breadcrumb = {
            name: this.design.name,
            design_id: this.design.id,
            ref_slug: this.refs.ref,
            ref_type: this.refs.ref_type,
            path: this.refs.path
          }
          this.trail.push(breadcrumb)
        }

        if (this.parts.length == 0) {
          this.addNewPart()
        }

      }, error => {
        console.log('Errror getting bom and parts')
        console.log(error)
      })
    },
    viewPart(index) {
      let selectedPart = this.parts[index]
      // reset the design in the store
      let design_payload = { design_slug: selectedPart.design.slug}
      this.$store.dispatch('getDesign', design_payload).then(success => {
        this.$router.push('/' + selectedPart.meta.path , success => {
          console.log('Completed navigation from parts list in parent design')
          // let refs_payload = {
          //   config: this.$route.params.config_slug ? this.$route.params.config_slug : null,
          //   rev: this.$route.params.rev_slug ? this.$route.params.rev_slug : null,
          //   change: this.$route.params.change ? this.$route.params.change : null
          // }
          // this.$store.commit('setRefs', refs_payload)
        }, error => {
          console.log('Failed navigation from part parts list in parent design')
        })
      }, error => {
      })
    },
    getBom() {
      this.http.get('boms/' + this.design.bom.id + '/?ref=' + this.refs.ref + '&type=' + this.refs.ref_type).then(response => {
        console.log('got bom')
        console.log(response)
        this.bom = response.data
      }, response => {
        console.log('error getting bom')
        console.log(response)
      })
    },
    updateDesign(index) {
      let updatedPart = this.parts[index]

      let payload = {
        name: updatedPart.design.name,
        creator: updatedPart.design.creator,
        description: updatedPart.design.description
      }
      this.$http.put('designs/' + updatedPart.design.slug + '/', payload).then(response => {
        console.log(response)
        if (typeof response.body.non_field_errors !== 'undefined') {
          console.log('Error updating new design: non-field error')

        } else {
          console.log('Design info updated')
          updatedPart.design = response.data
          EventBus.$emit('part-design-updated')
        }
      }, response => {
        console.log('Error updating design')
        console.log(response)
      })
    },
    updateBOM() {
      return new Promise((resolve, reject) => {
        let payload = {
          editor: this.profile.id,
          data: this.bom.data
        }
        this.$http.put('boms/' + this.bom.id +'/?ref=' + this.refs.config,
        payload).then(success => {
          console.log('BOM updated')
          console.log(success)
          this.bom = success.data
          resolve(success)
        }, error => {
          console.log('Error updating BOM when adding new part')
          console.log(error)
          reject(error)
        })
      })
    },
    updateProps(index) {
      return new Promise((resolve, reject) => {
        let updated_part = this.parts[index]
        let payload = {
          editor: this.profile.id,
          data: updated_part.props.data
        }
        this.$http.put('props/' + updated_part.props.id + '/?ref=' + updated_part.meta.ref_slug, payload).then(success => {
          console.log('Props updated')
          console.log(success)
          resolve(success)
        }, error => {
          console.log('Error updating props')
          console.log(error)
          reject(error)
        })
      })
    },
    addNewPart() {
      // adds a new empty part to the BOM
      document.getElementById('add-part-button').disabled=true
      let part = {
        meta: {
          created: false,
          editable: false,
          ref_slug: 'primary',
          ref_type: 'config',
          quantity: 1
        },
        design: {
          name: null
        },
        bom: {
          data: []
        },
        files: {
          data: []
        },
        props: {
          data: {
            Cost: null
          }
        },
        configs: {},
        revs: {},
        changes: {}
      }
      this.parts.push(part)

      let design_ids = ''
      for (let breadcrumb of this.trail) {
        design_ids += ('&design_id=' + breadcrumb.design_id)
      }
      let vue = this
      setTimeout(function() {
          console.log('focusing')
          $('#part-name-editable').focus()

          $('.ui.search').search(
            {
              apiSettings: {
                  url: 'https://stage.omnibuilds.com/designquery/?q={query}' + design_ids,
                },
              fields: {
                title: 'name'
              },
              showNoResults: false,
              onSelect: function(result, response) {
                console.log(result)
                vue.resultSelected = true
                console.log('Result selected, set result Selected to true')
                vue.result = result
              }
            }
          )
      }, 0);
    },
    getDesign(payload) {
      return new Promise ((resolve, reject ) => {
        this.$http.get('designs/' + payload.design_slug).then(success => {
          console.log('Got design')
          console.log(success)
          resolve(success)
        }, error => {
          console.log('Error getting design')
          console.log(error)
          reject(error)
        })
      })
    },

    // trail is sent with server query as slugs
    // server parses querystring and excludes any slugs from queryset
    // now only parts outside the trail can be included in results


    // Cannot include design in its own BOM or any part BOMs
      // User selects a result from autocomplete
        // exclude all parts in the trail from the search results
          // server side?
            // have to send the exclusion as part of the query
            // send a list of slugs as the trail names
            // read this in the view and fitter out of queryset
          // client side?
            // filter out once they are received (in autocomplete)
            // return an error if the part name is typed in manually
      // User types in an existing part name that is selected
        // check when seeing if an existing part, compare agains the trail
        //
        // return an error message
      // User creates a new part -- this can be ignored
    addExistingDesign: async function(index, result) {
      let newPart = this.parts[index]
      // get the design for this part
      let payload = {design_slug: result}
      let response = await this.getDesign(payload)

      // update the BOM and commit
      newPart.meta.quantity = 1
      newPart.meta.cost = response.data.props.data['Cost']
      newPart.meta.created = true
      newPart.meta.editable = false
      newPart.design = response.data
      newPart.bom = response.data.bom
      newPart.files = response.data.files
      newPart.props = response.data.props
      newPart.configs = response.data.config_set
      newPart.revs = response.data.rev_set

      // reset the new part
      this.newPartName = {
        data: null,
        hasError: null,
        error: null
      }

      this.resultSelected = false
      this.result = {}
      $('.ui.search').search('hide results')

      // add another empty part to the bom and set focus there
      this.addNewPart()
      this.$nextTick( function() {
        $('.ui.dropdown').dropdown(
          { 'silent': true }
        );
      })

      // create a new bom item and insert into the bom.data
      let new_item = {
        design_id: newPart.design.id,
        ref_slug: 'primary',
        ref_type: 'config',
        quantity: newPart.meta.quantity
      }

      this.bom.data.push(new_item)
      this.updateBOM()
    },
    checkIfInBOM(index, result) {

      let newPart = this.parts[index]

      // check to see if part is already in BOM
      let part_slugs = this.parts.map((part) => {return part.design.slug})
      part_slugs.pop()
      if (part_slugs.includes(result)) {
        console.log('New part being added is already in the BOM, checking to see if they have the same ref')
        let matched_part_index = part_slugs.indexOf(result)
        let matched_part = this.parts[matched_part_index]
        // check to see if they are being tracked at the same ref
        if (matched_part.meta.ref_slug != 'primary') {
          console.log('New part is being tracked at a different ref, adding new part')
          this.addExistingDesign(index, result)
        } else {
          console.log('New part is being tracked at the same ref, incrementing orignal party quantity instead of adding new part')

          matched_part.meta.quantity += 1
          this.parts.pop()
          this.bom.data[matched_part_index].quantity += 1
          this.updateBOM()

          // Notify the user with an alert
          this.message.active = true
          this.message.title = "Part is already in BOM"
          this.message.body = 'The part you just added is already in your BOM, instead of adding it again, the quanity has been increased by one.'
          let vue = this
          setTimeout(function() {
            $('.message .close').on('click', function() {
              console.log('Close message clicked')
              $(this)
              .closest('.message')
              .transition('fade')
              vue.message = {
                active: false,
                title: null,
                body: null
              }
            })
          }, 0);

          // reset the new part
          this.newPartName = {
            data: null,
            hasError: null,
            error: null
          }

          this.resultSelected = false
          this.result = {}
          $('.ui.search').search('hide results')

          // add another empty part to the bom and set focus there
          this.addNewPart()
          this.$nextTick( function() {
            $('.ui.dropdown').dropdown(
              { 'silent': true }
            );
          })
        }
      } else {
        console.log('New part being added is not in the BOM, adding a new part')
        this.addExistingDesign(index, result)
      }
    },
    getResult(index) {
      let newPart = this.parts[index]
      let vue = this

      setTimeout(async function() {
        if (vue.resultSelected) {
          // user has selected a result from the dropdown list
          console.log('Result selected, adding part to BOM')
          vue.checkIfInBOM(index, vue.result.slug)
        } else {
          // user has typed in the part name manually and pressed enter, tab, or blur
          // test if a name has been typed in, else return name error
          console.log('User pressed enter, checking to see if existing part')
          if (vue.newPartName.data.trim()) {

            let bc_names = vue.trail.map((bc) => {return bc.name})


            if (bc_names.includes(vue.newPartName.data.trim())) {
              // if so then remove the part from files list

              vue.removePart(index)
              vue.message.active = true
              vue.message.title = 'Cannot Add Part to BOM'
              vue.message.body = 'You cannot add a design into its own BOM'
              // send a message to the user

              setTimeout(function() {
                let vue = this
                $('.message .close').on('click', function() {
                  console.log('Close message clicked')
                  $(this)
                  .closest('.message')
                  .transition('fade')
                  vue.message = {
                    active: false,
                    title: null,
                    body: null
                  }
                })
              }, 0);

              return


            }



            // test if it is an exisiting name,
            console.log(vue.newPartName.data)
            console.log(vue.name_slug)
            console.log('A name has been entered')
            vue.$http.get('designs/' + vue.name_slug + '/').then(success => {
              console.log('Name refers to an existing design')
              console.log(success)
              // they have typed in an existing part
              vue.checkIfInBOM(index, vue.name_slug)
            }, error => {
              // need to create a new design
              console.log('This name is not in use, creating a new part')
              console.log(error)

              vue.testNewPart(index)
            })
          } else {
            console.log('Part name not typed in')
            vue.partNameError(index)
          }

          console.log('No result selected, adding new part (if not existing part)')
          vue.resultSelected = false
          vue.result = {}
          $('.ui.search').search('hide results')
        }
      }, 0);
    },
    newBlurTest(index, $event) {
      if (event.relatedTarget) {
        var target = event.relatedTarget.id
      } else {
        var target = null
      }

      if (target !== 'part-quantity-editable' && target !== 'part-cost-editable' && target !== 'part-name-editable' ) {
        this.testNewPart(index)
      }
    },
    testNewPart(index) {
      this.newPartName.nameHasError = false
      this.newPartName.error = null
      this.newPartName.data = this.newPartName.data.trim()

      // regex check for legal project name
      let test = /^[A-Za-z0-9-_ ]{1,50}$/.test(this.newPartName.data)
      if (test) {
        console.log('Name matches regex')
        // check if this design name is already in use by this user
        this.$http.get('designs/' + this.name_slug + '/').then(response => {
          console.log('Design name is already taken')
          this.newPartName.hasError = true
          this.newPartName.error = "You already have a design with the same name"
          this.newPartName.data = null

          setTimeout(function() {
              console.log('focusing on name error input')
              document.getElementById("part-name-editable").focus()
          }, 0);
          // change input class to error
          document.getElementById("part-name-editable-div").className = 'ui input error'
          document.getElementById("part-name-editable").placeholder = 'Part name already exists'
        }, response => {
          console.log('Part/Design name  is available')
          this.saveNewPart(index)
        })
      } else {
        console.log("Error: not a valid part name")
        this.newPartName.hasError = true
        this.newPartName.error = 'Not a valid part name: enter a name between 1 and 50 characters, including numbers, letters, _ and - only, spaces are allowed.'
        this.newPartName.data = null

        setTimeout(function() {
            console.log('focusing on name error input')
            document.getElementById("part-name-editable").focus()
        }, 0);
        // change input class to error
        document.getElementById("part-name-editable-div").className = 'ui input error'
        document.getElementById("part-name-editable").placeholder = 'Name is invalid'
      }
    },
    saveNewPart(index) {
      // saves a new part that has been added to BOM
      let newPart = this.parts[index]

      // create the actual design
      let payload = {
        name: this.newPartName.data,
        description: null,
        active: true,
        creator: this.profile.id
      }
      let vue = this
      this.$http.post('designs/', payload).then(response => {
        console.log(response)
        if (typeof response.body.non_field_errors !== 'undefined') {
          console.log('Error creating new design: non-field error')
          this.name.hasError = true
          this.name.error = response.body.non_field_errors[0]
        } else {
          console.log('New design created')
          let cost = newPart.props.data['Cost']
          // update the part to reflect the design data and that it is created
          newPart.meta.created = true
          newPart.meta.editable = false
          newPart.design = response.data
          newPart.bom = response.data.bom
          newPart.files = response.data.files
          newPart.props = response.data.props
          newPart.configs = response.data.config_set
          newPart.revs = response.data.rev_set

          newPart.props.data['Cost'] = cost

          // reset the new part
          vue.newPartName = {
            data: null,
            hasError: null,
            error: null
          }

          // add another empty part to the bom and set focus there
          vue.addNewPart()
          vue.$nextTick( function() {
            $('.ui.dropdown').dropdown(
              { 'silent': true }
            );
          })

          // create a new bom item and insert into the bom.data
          let new_item = {
            design_id: newPart.design.id,
            ref_slug: 'primary',
            ref_type: 'config',
            quantity: newPart.meta.quantity
          }

          vue.bom.data.push(new_item)
          vue.updateBOM()
          this.updateProps(index)
          console.log('commited part to bom')
        }
      }, response => {
        console.log('Error creating new design')
        console.log(response)
      })
    },
    makePartEditable(index, target) {
      let revisedPart = this.parts[index]
      this.selectedPart = JSON.parse(JSON.stringify(revisedPart))
      revisedPart.meta.editable = true
      // focus on the name input
      setTimeout(function() {
          console.log('focusing on part edit input')
          document.getElementById("part-" + target + "-editable").focus()
      }, 0);
    },
    updateBlurTest(index, event) {

      console.log('Update blur test called')

      if (event.relatedTarget) {
        var target = event.relatedTarget.id
      } else {
        var target = null
      }

      // have to know if the target is wihin the same

      if (target !== 'part-quantity-editable' && target !== 'part-cost-editable' && target !== 'part-name-editable' ) {
        console.log('Not an editable div, testing part')
        this.testEditedPartDesign(index)
      } else {
        console.log('Target is an editable div, passing')
      }
    },
    testEditedPartDesign(index) {
      // test if design (name) has changed -> update the design record
      let testPart = this.parts[index]
      if (testPart != this.selectedPart) {
        if (testPart.design.name != this.selectedPart.design.name.trim()) {
          console.log('Design change detected in update part')

          let test = /^[A-Za-z0-9-_ ]{1,50}$/.test(testPart.design.name)
          if (test) {
            console.log('Name matches regex')
            // check if this design name is already in use by this user
            let test_slug = testPart.design.name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')
            this.$http.get('designs/' + test_slug + '/').then(response => {
              console.log('Design name is already taken')

              setTimeout(function() {
                  console.log('focusing on name error input')
                  document.getElementById("part-name-editable").focus()
              }, 0);
              // change input class to error
              document.getElementById("part-name-editable-div").className = 'ui input error'
              document.getElementById("part-name-editable").placeholder = 'Part name already exists'
            }, response => {
              console.log('Part/Design name  is available')
              this.updateDesign(index)
              let vue = this
              EventBus.$once('part-design-updated', function () {
                console.log('Updated design record after editing an existing part')
                vue.editedPartUpdated = true
                vue.testEditedPartBOM(index)
              })
            })
          } else {
            console.log("Error: not a valid part name")
            setTimeout(function() {
                console.log('focusing on name error input')
                document.getElementById("part-name-editable").focus()
            }, 0);
            // change input class to error
            document.getElementById("part-name-editable-div").className = 'ui input error'
            document.getElementById("part-name-editable").placeholder = 'Name is invalid'
          }
        } else {
          console.log('No change to design in edited part, testing BOM')
          this.testEditedPartBOM(index)
        }
      } else {
        console.log('No change detected for this part update')
        testPart.meta.editable = false
      }
    },
    testEditedPartBOM(index) {
      // test if bom (qty or ref) has changed -> update the bom record
      let testPart = this.parts[index]
      if (testPart.meta.quantity != this.selectedPart.meta.quantity || testPart.meta.ref_slug != this.selectedPart.meta.ref_slug) {
        console.log('Bom change detected in update part')

        this.bom.data[index] =  {
          design_id: testPart.design.id,
          ref_slug: testPart.meta.ref_slug,
          ref_type: testPart.meta.ref_type,
          quantity: testPart.meta.quantity
        }

        console.log('About to call update bom with update part replaced by index')
        console.log(this.bom)

        this.updateBOM().then(success => {
          console.log('Updated BOM record after editing an existing part')
          testPart.meta.editable = false
          this.editedPartUpdated = true
          this.testEditedPartProps(index)
        }, error => {

        })
      } else {
        console.log('No change to BOM in edited part, testing props')
        this.testEditedPartProps(index)
      }
    },
    testEditedPartProps(index) {
      // test if props (cost) have changed -> updae the props record
      let testPart = this.parts[index]
      if (testPart.props.data['Cost'] != this.selectedPart.props.data['Cost']) {
        console.log('Props changed detected in update part')
        testPart.props.data['Cost'] = Number(testPart.props.data['Cost'])
        this.updateProps(index).then(success => {
          console.log('Updated Props record after editing an existing part')
          this.editedPartUpdated = true
          testPart.meta.editable = false
        }, error => {

        })
        console.log('Updated Props record after editing an existing part')
        testPart.meta.editable = false
      } else {
        if (this.editedPartUpdated = false) {
            console.log('ALERT --- when testing the update for this part, the objects are not equal but no specific change was detected...')
        } else {
          console.log('No change to props in edited part')
          console.log('Completing part update, un update actually occurred :-)')
        }
        testPart.meta.editable = false
      }
    },
    partNameError(index) {
      // focus on the input in question
      console.log('name error function started')
      setTimeout(function() {
          console.log('focusing on name error input')
          document.getElementById("part-name-editable").focus()
      }, 0);
      // change input class to error
      document.getElementById("part-name-editable-div").className = 'ui input error'
      document.getElementById("part-name-editable").placeholder = 'Enter a name'
    },
    removePart(index) {
      // dont commit back to git if the this is a new part that has not been added yet
      let removed_part = this.parts[index]
      if (removed_part.meta.created == false) {
          this.parts.pop()
          document.getElementById('add-part-button').disabled=false
          console.log('New unsaved part has been removed from the BOM')

          this.newPartName = {
            data: null,
            hasError: null,
            error: null
          }

          this.resultSelected = false
          this.result = {}
          $('.ui.search').search('hide results')

      } else {
        this.parts.splice(index, 1)
        this.bom.data.splice(index, 1)
        this.updateBOM()
        console.log('Existing part has been removed from the BOM')
      }
    },
    tabOver(event) {
      console.log('In tabover function')
      let partName = $('#part-name-editable').parent().parent().next().next().children()
      $('#part-name-editable').parent().parent().next().next().children().focus()
      console.log('Part name is: ' + partName)
    },
    tabDown(event) {
      console.log('In tabdown function')
      let partName = $('#part-name-editable').parent().parent().next().next().children()
      $('#part-name-editable').parent().parent().next().next().children().focus()
      console.log('Part name is: ' + partName)
    },
    showModal(index) {
      this.modalIndex = index
      // $('.ui.modal').modal('hide all')
      // $('.ui.modal').modal('hide')
      // $('.ui.modal').modal('show')
      // $('.modal:not(:first)').remove()
      $('.ui.modal').modal('toggle')
      $('.ui.dropdown').dropdown()
      $('.menu .item').tab()
    },
    hideModal() {
      $('.ui.modal').modal('toggle')
      // $('.ui.modal').modal('toggle')
      // $('.modal:not(:first)').remove()
    },
  },
  created() {
    this.getDesigns()
    if (this.design.bom) {
      console.log('Parts.vue created, design data already loaded, getting bom')
      let bom_payload = {
        design_id: this.design.id,
        ref_slug: this.refs.ref,
        ref_type: this.refs.ref_type
      }
      this.getBomParts(bom_payload)
    } else {
      console.log('Parts.vue created, no design data present, waiting on watcher')
    }
  },
  mounted() {},
  updated() {
    $('.modal:not(:first)').remove()
  }
}
</script>

<style lang="css">
</style>
