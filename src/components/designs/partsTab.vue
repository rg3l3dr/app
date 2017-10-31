<template lang="html">
  <div>
    <div></div>
    <div class="ui top attached grey header">
      BILL OF MATERIALS &#8212; Add parts and create nested assemblies
    </div>
    <div class="ui bottom attached clearing segment">
      <!-- <transition name='fade'> -->
        <table class="ui very basic  small compact table" id='bomTable' v-if='parts.length > 0'>
          <thead>
            <tr>
              <th></th>
              <th>Part Name</th>
              <th>Part #</th>
              <th>Revision</th>
              <th>Qty</th>
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
                  v-if='revision.slug == "latest"'
                  class="ui small basic blue button"
                  @click='addNewEmptyPart'
                  id='add-part-button'
                >
                  Add New Part
                </button>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td>Total</td>
              <td> $ {{ sumTotal.toFixed(2) }} </td>
            </tr>
          </tfoot>
            <tr v-for='(part, index) in parts'>

              <!-- Part Type Icon & Modal Link -->
              <td class='collapsing'>
                <router-link tag='a' to='' @click.native.prevent='openParts(index)'>
                  <i v-if='part.parts.length > 0' class="cubes icon"></i>
                  <i v-else class="cube icon"></i>
                </router-link>
              </td>

              <!-- Part Name -->
              <td v-if='!part.created && revision.slug == "latest"'>
                  <div class="ui transparent search input fluid" id='part-name-editable-div'>
                    <input
                      class="prompt compact"
                      type="text"
                      v-model='newPartName.data'
                      id='part-name-editable'
                      placeholder="Find or create a part..."
                      @keydown.enter='testNewPartOnEnter(index)'
                      @blur='result ? null : testNewPartOnBlur(index, $event)'
                      @keydown.tab.prevent='tabOver($event)'
                      @keydown.esc='removePart(index)'
                      @keydown.delete='newPartName.data ? null : removePart(index)'
                      maxlength="50"
                    >
                    <div
                      v-if='!newPartName.hasError'
                      class="results"
                      @click='testNewPartOnClick(index)'
                    ></div>
                  </div>
              </td>

              <td v-else-if='part.created && part.editable && revision.slug == "latest" '>
                <div id='part-name-editable-div'>
                  <router-link tag='a' to='' @click.native.prevent='openPart(index)'
                  id ='part-name-editable'>
                    {{ part.design_name }}
                  </router-link>
                </div>
              </td>

              <td v-else id='part-name'>
                <router-link tag='a' to='' @click.native.prevent='openHome(index)'>
                  {{ part.design_name }}
                </router-link>
              </td>

              <!-- Part # -->
              <td>
                {{ part.design_number }}
              </td>

              <!-- Part Revision -->
              <td id='part-revision' v-if='revision.slug == "latest"'>
                <div class="ui dropdown revision" v-if='part.revision_name'>
                  <div class="text">
                    {{ part.revision_name }}
                  </div>
                  <i class="dropdown icon"></i>
                  <div class="menu" >
                    <div
                      class="item"
                      v-for='part_revision in part.revisions'
                      @click='setTrackingRef(part_revision, index)'
                    >
                      {{ part_revision.name }}
                    </div>
                  </div>
                </div>
              </td>

              <td v-else>
                {{ part.revision_name }}
              </td>


              <!-- <td id='part-revision'>
                <span v-if='part.created'>

                  {{ part.rev_editor_slug }}

                  <a href="">
                    {{ part.rev_action }}
                  </a>

                  {{ part.rev_last_updated | moment("from", "now") }}

                </span>
              </td> -->

              <!-- Part Quantity -->
              <td
                v-if='!part.created && revision.slug == "latest"'
                class='collapsing'
              >
                <div class="ui transparent input" style='width:50px'>
                  <input
                    type="number"
                    style='width:50px'
                    min='1'
                    step='1'
                    v-model='part.quantity'
                    id='part-quantity-editable'
                    @keyup.enter='testNewPartOnEnter(index, $event)'
                    @blur='testNewPartOnBlur(index, $event)'
                  >
                </div
              </td>

              <td
                v-else-if='part.created && part.editable && revision.slug == "latest"'
                class='collapsing'
              >
                <div class="ui transparent input" style='width:50px'>
                  <input
                    type="number"
                    style='width:50px'
                    id='part-quantity-editable'
                    v-model='part.quantity'
                    min='1'
                    step='1'
                    @keyup.enter='part.design_name ? testEditedPart(index) : showPartNameError(index)'
                    @blur='part.design_name ? updateBlurTest(index, $event) : showPartNameError(index)'
                  >
                </div>
              </td>

              <td
                v-else-if="revision.slug=='latest'"
                id='part-quantity'
                @click='makePartEditable(index, "quantity")'
                class='collapsing'
              >
                {{ part.quantity }}
              </td>

              <td v-else class='collapsing'>
                {{ part.quantity }}
              </td>

              <!-- Part Cost -->
              <td v-if='!part.created && revision.slug == "latest" && part.editable' class='collapsing'>
                <div class="ui transparent input" style='width:50px'>
                  <input
                    type="number"
                    id='part-cost-editable'
                    min='0'
                    step='.01'
                    v-model='part.cost'
                    @keydown.enter='testNewPartOnEnter(index, $event)'
                    @blur='testNewPartOnBlur(index, $event)'
                  >
                </div>
              </td>

              <td v-else-if='part.created && part.editable && revision.slug == "latest" && part.parts.length == 0' class='collapsing' >
                <div class="ui transparent input" style='width:50px'>
                  <input
                    id='part-cost-editable'
                    type="number"
                    min='0'
                    step='.01'
                    size='10'
                    v-model='part.cost'
                    @keydown.enter='part.design_name ? testEditedPart(index) : showPartNameError(index)'
                    @keydown.tab.prevent='part.design_name ? testEditedPart(index) : showPartNameError(index)'
                    @blur='part.design_name ? updateBlurTest(index, $event) : showPartNameError(index)'
                  >
                </div>
              </td>

              <td v-else-if='part.parts.length > 0' class='collapsing'>
                $ {{ part.cost.toFixed(2) }}
              </td>

              <td
                v-else-if='revision.slug == "latest"'
                id='part-cost'
                @click='makePartEditable(index, "cost")'
                class='collapsing'
              >
                <!-- <span v-if='part.cost && typeof part.cost != "string"'> -->
                <span v-if='part.cost'>
                  $ {{ Number(part.cost).toFixed(2) }}
                </span>
                <span v-else>
                  $ 0.00
                </span>
              </td>

              <td v-else class='collapsing'>
                $ {{ Number(part.cost).toFixed(2) }}
              </td>

              <!-- Part Total -->
              <td v-if='part.cost' class='collapsing'>
                $ {{ (part.quantity * part.cost).toFixed(2) }}
              </td>

              <td v-else>
                $ 0.00
              </td>

              <!-- Remove Part Button -->

              <!-- Part Menu Options -->
              <!-- <td v-if='!part.created'> -->
              <td v-if='revision.slug == "latest"'>
                <button
                  class="circular ui mini basic icon button"
                  @click='removePart(index)'
                >
                  <i class="icon close"></i>
                </button>
              </td>
              <!-- <td v-else >
                <div class="ui icon top left pointing mini basic dropdown button part">
                  <i class="caret down icon"></i>
                  <div class="menu">
                    <div class="item">
                      Part Options
                    </div>
                    <div class="divider"></div>
                    <div v-if='revision.slug == "latest"' class="item" @click='openPart(index)'>
                      <i class="level down icon"></i>
                      Select Part
                    </div>
                    <div class="item" @click='viewPart(index)'>
                      <i class="home icon"></i>
                      View Homepage
                    </div>
                    <div v-if='revision.slug == "latest"' class="item" @click='removePart(index)'>
                      <i class="trash icon"></i>
                      Remove from BOM
                    </div>
                  </div>
                </div>
              </td> -->
            </tr>
            <tr v-if='!parts[parts.length - 1].created'>
              <td></td>
              <td colspan='3'  style='color: #848f99' class='collapsing'>
               Press enter to add part or tab to input qty and cost
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <!-- <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr> -->
            <br>
          </tbody>
        </table>

        <!-- <div style='text-align:center' v-else-if='revision.slug=="latest"' >
          <br>
          <h2 class="ui icon header" >
            <i class="cubes icon"></i>
            <br>
            <div class="content">
              <button class="ui huge blue basic button" @click='addNewEmptyPart()'>
                Click here to add parts
              </button>
              <div class="sub header">
                <br>
                <a href="http://help.omnibuilds.com#parts-are-the-building-blocks-of-designs" style='font-size:18px'>

                  How do parts work?
                </a>
                <br>
                <br>
                <br>
              </div>
            </div>
          </h2>
        </div>
        <div style='text-align:center' v-else>
          <br>
          <h2 class="ui icon header" >
            <i class="cubes icon"></i>
            <br>
            <div class="content">
              Change rev back to latest to add parts
              <div class="sub header">
                <br>
                You have not added any parts yet<br>
                Your project is read only when rev is not latest
              </div>
            </div>
          </h2>
        </div> -->
      <!-- </transition> -->

      <transition name='fade'>
        <div class="ui success message" v-if='message.active'>
          <i class="close icon"
            @click='clearMessage'
          ></i>
          <div class="header">
            {{ message.title }}
          </div>
          <p> {{ message.body }} </p>
        </div>
      </transition>

    </div>
  </div>
</template>

<script>

import { mapState, mapGetters } from 'vuex'
import { EventBus } from '../../event-bus.js'
let _ = require('lodash')

export default {
  name: 'PartsTab',
  data() {
    return {
      newPartName: {
        data: null,
        hasError: false,
        error: null,
      },
      enterPressed: false,
      test: false,
      editedPartUpdated: false,
      indexOfEditable: null,
      results: [],
      result: {},
      resultSelected: false,
      gettingBom: false,
      message: {
        active: false,
        title: null,
        body: null
      },
      selectedPart: null,
    }
  },
  computed: {
    ...mapState([
      'env',
      'route',
      'session',
      'profile',
      'rootDesign',
      'design',
      'bom',
      'parts',
      'revision',
      'trail',
      'tree',
      'node'
    ]),
    ...mapGetters([
      'designRoute'
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
        if (part.cost) {
          total += (part.quantity * part.cost)
        }
      }
      return total
    }
  },
  watch: {
    node() {
      // get parts for the node
      if (this.env != 'prod') {
        console.log('node change detected in partsTab, getting new parts context')
      }

      let payload = {
        design_id: this.node.design_id,
        revision_slug: this.node.revision_slug,
      }

      if (this.env != 'prod') {
        console.log('Node is:')
        console.dir(this.node)
        console.log('Payload is:')
        console.dir(payload)
      }
      // this.$store.dispatch('getBom', payload)
      this.$store.dispatch('getParts', payload).then(success => {
        $('.ui.dropdown.part').dropdown({ 'silent': true })
        $('.ui.dropdown.revision').dropdown({ 'silent': true })
      }, error => {})
    },
    parts() {
      if (this.parts.length == 0) {
        this.addNewEmptyPart()
      }
    }
  },
  methods: {
    clearMessage() {
      this.message = {
        active: false,
        title: null,
        body: null
      }
    },
    formatBytes(bytes, decimals) {
       if(bytes == 0) return '0 Bytes'
       var k = 1000
       var dm = decimals + 1 || 3
       var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
       var i = Math.floor(Math.log(bytes) / Math.log(k))
       return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    },

    // can create a new part name from scratch (without any search results)
    // can select a part from search results on click to add an existing part
    // can select a part from search results on arrow down and enter to add an existing part
    // can create a new part from input even if it returns search results
    // can type in the same name of part that shows in search results if only one result

    // manually creating the result object is failing (id is not defined)
    // have to test for an existing design that does not show up in the results


    testNewPartOnEnter(index, $event) {
      this.enterPressed = true

      if (this.env != 'prod') { console.log('testNewPartOnEnter function started')}
      if (this.newPartName.data) {
        if (this.env != 'prod') {console.log('New part name has been entered')}
        if (this.results.length > 0) {
          this.testNewPartOnClick(index)
        } else {
          this.checkIfPartIsValid(index)
        }
      } else {
        if (this.env != 'prod') {console.log('New party input is empty')}
        this.showPartNameError(index, $event)
      }
    },
    testNewPartOnBlur(index, $event) {
      if (this.env != 'prod') {console.log('New part blur test function started')}
      if (!this.enterPressed) {
        if ($event.relatedTarget) {
          var target = $event.relatedTarget.id
        } else { var target = null }
        if (target !== 'part-quantity-editable' && target !== 'part-cost-editable' && target !== 'part-name-editable') {
          if (this.env != 'prod') {
            console.log('Legit blur event, checking name')
            console.log('Blur transitioned to another editable div, ignoring')
          }
          if (this.newPartName.data) {
            if (this.env != 'prod') {console.log('New part has been entered')}
            this.checkIfPartIsValid(index)
          } else {
            if (this.env != 'prod') {console.log('New part input is empty')}
            this.showPartNameError(index, $event)
          }
        }
      } else {
        this.enterPressed = false
        if (this.env != 'prod') {console.log('Blur triggered by keydown.enter, ignoring')}
      }
    },
    testNewPartOnClick(index) {


      // user clicked on a search result
        // resultSelected will be true

      // or user toggled down and pressed enter to select a search result
        // enterPressed will be true
        // will resultSelected be true?

      setTimeout(() => {
        if (this.env != 'prod') {
          console.log('testNewPartOnClick function called')
        }

        if (this.resultSelected) {
          if (this.env != 'prod') {
            console.log('In testNewPartOnClick, a result has been selected, checking if it is in the BOM')
          }
          // call checkIfPartIsInBom (adding an exisitng part)
          this.checkIfPartIsInBom(index, this.result)
        } else {
          // else
          if (this.env != 'prod') {
            console.log('In testNewPartOnClick, no result has been selected...')
          }
          if (this.enterPressed) {
            if (this.env != 'prod') {
              console.log('In testNewPartOnClick, a result was not selcted, but enter was pressed')
            }
          }
          if (this.results.length > 0) {
            for (let result of this.results) {
              if (result.slug == this.name_slug) {
                if (this.env != 'prod') {
                  console.log('Name input matches a part in the results list, checking if it is the BOM')
                }
                this.checkIfPartIsInBom(index, result)
                return
              }
            }
            if (this.env != 'prod') {
              console.log('Name input is not in search results, creating a new part')
            }

            this.checkIfPartIsValid(index)

          }
        }


      }, 0)

      // this.$nextTick(() => {
      //
      //   if (this.env != 'prod') {
      //     console.log('testNewPartOnClick function called')
      //
      //   }
      //
      //
      // })

      // if results.length == 0
        // check if the name exists
          // if it exists, add to the project
          // else, create a new project
      // if results.length == 1
        // did the user click the result -> add existing part
        // did the user type in a different name and press enter -> check part name
          // if new then create
          // if existing then add
        // did the user type in the same name and press enter -> add existing part
        // can they arrow select and click enter? -> add existing part
      // if results.length > 1
        // was the result clicked -> add existing part
        // was the result arrow selected and enter pressed -> add existing part
        // did the user input a partial name to create a new part -> check part name
          // if it exists, add part to project
          // else, create a new project

      // if you type in the part name before the results have been return, it will attempt to create a new part isntead of adding the existing part, which will cause a dupliate key error on the server side

      // if you type in the part name and there is only one result, it will create the substring instead of selecting the only result
      // if you type in the substring and try to manually select the part from results then it will instead create the part substring (check this on both enter and click) -> failing on both

      // let vue = this
      // setTimeout(() => {
      //   if (vue.resultSelected || vue.results.length == 1) {
      //     if (vue.results.length == 1) {
      //       vue.result = vue.results[0]
      //     }
      //     if (vue.env != 'prod') {
      //       console.log('Enter pressed to select a part from search results')
      //     }
      //     if (vue.result.slug == this.name_slug) {
      //       vue.checkIfPartIsInBom(index, vue.result)
      //     } else {
      //       vue.checkIfPartIsValid(index)
      //     }
      //
      //   } else {
      //
      //     // check if the typed in name is in the list of search results
      //     let result_slugs = vue.results.map((result) => {return result.slug})
      //     let slug_input = vue.name_slug
      //
      //     if (result_slugs.includes(slug_input)) {
      //       if (vue.env != 'prod') {
      //         console.log('Typed in name matches a search result, checking if in BOM')
      //       }
      //       // type in the name of  part with multiple search results
      //       let result = vue.results.filter((result) => {return result.slug == slug_input})[0]
      //       vue.checkIfPartIsInBom(index, result)
      //     } else {
      //       // type in a new part name and presssd enter
      //       // this should not even be a poosible case here
      //       if (vue.env != 'prod') {
      //         console.log('A new part is being created, and is not in the bom')
      //
      //         // have to check the part
      //         vue.checkIfPartIsValid(index)
      //       }
      //     }
      //   }
      // }, 0)
    },

    checkIfPartIsValid(index) {
      this.newPartName.nameHasError = false
      this.newPartName.error = null
      this.newPartName.data = this.newPartName.data.trim()

      // regex check for legal project name
      let test = /^[A-Za-z0-9-_/\,;:'" ]{1,50}$/.test(this.newPartName.data)
      if (test) {
        if (this.env != 'prod') {
          console.log('Name matches regex')
        }
        // optimistically add the new part before first asynch method
        // this.addNewEmptyPart()

        let trail_slugs = this.trail.map((part) => {return part.slug})

        if (trail_slugs.includes(this.name_slug)) {
          if (this.env != 'prod') {
            console.log('design slug in trail, checking to see if the same design')
          }

          // check design to get id and compare to
          let design_payload = {
            design_slug: this.name_slug,
            owner_slug: this.route.params.profile_slug,
            revision_slug: 'latest'
          }


          this.$store.dispatch('getDesign', design_payload).then(success => {
            let design = success.body
            let trail_ids = this.trail.map((part) => {return part.id})

            if (trail_ids.includes(design.id)) {
              if (this.env != 'prod') {
                console.log('cannot add design, already in trail')
              }

              this.$store.commit('removePart', index)

              let button = document.getElementById('add-part-button')
              if (button) { button.disabled=false }

              // reset the new part
              this.newPartName = {
                data: null,
                hasError: null,
                error: null
              }

              this.resultSelected = false
              this.result = {}
              $('.ui.search').search('hide results')

              // display an error message
              this.message.active = true
              this.message.title = "Cannot add a part to its own BOM"
              this.message.body = 'You cannot add a part to its own bom!'
              let vue = this
              setTimeout(function() {
                $('.message .close').on('click', function() {
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
            } else {
              if (this.env != 'prod') {
                console.log('adding an existing design')
              }
              // call add existing design
              let result = this.trail.filter(part => {return part.design_slug == this.name_slug})[0]
              if (this.env != 'prod') {
                console.log(result)
              }
              this.addExistingPart(index, result)
            }
          }, error => {})

        } else {
          this.checkIfPartExists(index, null)
        }
      } else {
        if (this.env != 'prod') {
          console.log("Error: not a valid part name")
        }
        this.newPartName.hasError = true
        this.newPartName.error = 'Not a valid part name: enter a name between 1 and 50 characters, including numbers, letters, _ and - only, spaces are allowed.'
        this.newPartName.data = null

        let vue = this
        setTimeout(function() {
          if (vue.env != 'prod') {
            console.log('focusing on name error input')
          }
            document.getElementById("part-name-editable").focus()
        }, 0);
        // change input class to error
        document.getElementById("part-name-editable-div").className = 'ui input error'
        document.getElementById("part-name-editable").placeholder = 'Name is invalid'
      }
    },
    checkIfPartExists(index, result) {

      let payload = {
        design_slug: this.name_slug,
        owner_slug: this.profile.slug
      }

      this.$store.dispatch('checkDesign', payload).then(success => {
        // this part does not exist, part name has already been tested
        this.createNewPart(index)
      }, error => {

        // this is an existing part, check if it is in the bom before adding
        this.checkIfPartIsInBom(index, result)
      })
    },
    checkIfPartIsInBom: async function(index, result) {

      let newPart = this.parts[index]

      // optimistically add the empty part before first asynch method
      this.addNewEmptyPart()

      // get create a similar result object if it does not exist
      if (!result) {
        if (this.env != 'prod') {
          console.log('An existing part name was input but not caught in the search results, gettting the design to simulate the result data')
        }
        // user typed in a part name that was not in the search results but existed, very edge case
        // call get design from actions for slug and owner, and add to the part
        let design_payload = {
          design_slug: this.name_slug,
          owner_slug: this.rootDesign.owner_slug,
          revision_slug: 'latest'
        }
        let getResult = await this.$store.dispatch('getDesign', design_payload).then(success => {

          let design = success.body
          let result = {
            cost: design.data.cost,
            creator:design.creator_slug,
            id: design.id,
            name: design.name,
            number: design.data.autoPartNumber,
            owner: design.owner_slug,
            slug: design.slug
          }
        }, error => {})
      }

      // check to see if part is already in BOM
      let part_ids = this.parts.map((part) => {return part.design_id})
      part_ids.pop()
      if (part_ids.includes(result.id)) {
        if (this.env != 'prod') {
          console.log('New part being added is already in the BOM, checking to see if they have the same ref')
        }
        let matched_part_index = part_ids.indexOf(result.id)
        let matched_part = this.parts[matched_part_index]
        // check to see if they are being tracked at the same ref
        if (matched_part.revision_name != 'Latest') {
          if (this.env != 'prod') {
            console.log('New part is being tracked at a different revision, adding new part')
          }
          this.addExistingPart(index, result)
        } else {
          if (this.env != 'prod') {
            console.log('New part is being tracked at the same ref, incrementing orignal party quantity instead of adding new part')
          }

          // change quantity in store (and UI)
          matched_part.quantity += 1
          let set_part_payload = {
            index: matched_part_index,
            part: matched_part
          }

          this.$store.commit('setPart', set_part_payload)

          // update teh part on the backend
          let update_part_payload = {
            design_id: this.design.id,
            part_id: matched_part.part_id,
            part_qty: matched_part.quantity,
            part_revision: matched_part.revision_id
          }

          // add once updte part is working
          // this.$store.dispatch('updatePart', update_part_payload)

          this.parts.pop()

          // Notify the user with an alert
          this.message.active = true
          this.message.title = "Part is already in BOM"
          this.message.body = 'The part you just added is already in your BOM, instead of adding it again, the quanity has been increased by one.'
          let vue = this
          setTimeout(function() {
            $('.message .close').on('click', function() {
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
          // this.addNewEmptyPart()
          this.$nextTick( function() {
            $('.ui.dropdown.part').dropdown({ 'silent': true });
          })
        }
      } else {
        if (this.env != 'prod') {
          console.log('New part being added is not in the BOM, adding a new part')
        }
        this.addExistingPart(index, result)
      }
    },
    showPartNameError(index, $event) {
      if (this.env != 'prod') {
        console.log('Part name error function started')
        console.log($event)
      }
      let vue = this
      setTimeout(function() {
        if (vue.env != 'prod') {
          console.log('focusing on name error input')
        }
          document.getElementById("part-name-editable").focus()
      }, 0);
      // change input class to error
      document.getElementById("part-name-editable-div").className = 'ui input error'
      document.getElementById("part-name-editable").placeholder = 'Enter a name'
    },

    addNewEmptyPart() {
      // adds a new empty part to the BOM
      this.$nextTick(() => {
        // document.getElementById('add-part-button').disabled=true
        let button = document.getElementById('add-part-button')
        if (button) { button.disabled=true }
      })

      let part = {
        'design_id': null,
        'design_name': null,
        'design_slug': null,
        'design_number': '         ',
        'parent_id': null,
        'revision_name': null,
        'revision_id': null,
        'quantity': 1,
        'cost': 0.00,
        'created': false,
        'editable': true,
        'parts': [],
        'revisions': [],
      }

      this.$store.commit('addPart', part)

      let design_ids = ''
      for (let design of this.trail) {
        design_ids += ('&design_id=' + design.id)
      }
      let owner_id = `&owner_id=${this.design.owner}`

      this.$nextTick(() => {
        $('.ui.dropdown.part').dropdown({ 'silent': true })
        if (this.parts.length == 1) {
          let button = document.getElementById('add-part-button')
          if (button) { button.disabled=true }
        }
        let vue = this
        if (this.env == 'prod') {
          $('.ui.search').search(
            {
              apiSettings: {
                  url: 'https://www.omnibuilds.com/shareddesignquery/?q={query}' + owner_id + design_ids,
                  beforeXHR: function(xhr) {
                    xhr.setRequestHeader ('Authorization', 'JWT ' + vue.session.token)
                    return xhr;
                  }
                },
              fields: {
                title: 'name',
                description: 'number'
              },
              showNoResults: false,
              onSelect: function(result, response) {
                vue.resultSelected = true
                vue.result = result
                if (vue.env != 'prod') {
                  console.log('Result selected, set result Selected to true')
                }
              },
              onResults: function(response) {
                vue.results = response.results
              }
            }
          )
        } else {
          $('.ui.search').search(
            {
              apiSettings: {
                  url: 'https://stage.omnibuilds.com/shareddesignquery/?q={query}' + owner_id + design_ids,
                  beforeXHR: function(xhr) {
                    xhr.setRequestHeader ('Authorization', 'JWT ' + vue.session.token)
                    return xhr;
                  }
                },
              fields: {
                title: 'name',
                description: 'number'
              },
              showNoResults: false,
              onSelect: function(result, response) {
                vue.resultSelected = true
                vue.result = result
                if (vue.env != 'prod') {
                  console.log('Result selected, set result Selected to true')
                }
              },
              onResults: function(response) {
                vue.results = response.results
              }
            }
          )
        }

        $('#part-name-editable').focus()
      })
    },
    addExistingPart(index, result) {

      // get the design for the existing part by the slug
      let existingPart = this.parts[index]

      // optimistiacally add the part and continue, must update in the store
      existingPart.created = true
      existingPart.editable = false
      existingPart.design_name = result.name
      existingPart.design_number = result.number
      existingPart.cost = result.cost
      existingPart.revision_name = 'Latest'

      let new_node = {
        isOpen: true,
			  design_id: result.id,
				design_name: result.name,
				design_slug: result.slug,
				owner_slug: result.owner,
				revision_slug: 'latest',
				parent_id: null,
				unique_id: null,
				parts: []
      }

      this.addNode(this.tree, this.node.unique_id, new_node)

      // reset the part
      this.newPartName = {
        data: null,
        hasError: null,
        error: null
      }

      let trail_ids = this.trail.map((part) => {return part.id})

      let add_design_payload = {
        root_design_id: this.design.id,
        quantity: existingPart.quantity,
        existing_design_id: result.id,
        trail_ids: trail_ids,
        revision_id: null
      }

      this.resultSelected = false
      this.result = {}
      $('.ui.search').search('hide results')
      this.$nextTick(() => {
        // let button = document.getElementById('add-part-button')
        // if (button) { button.disabled=false }
        // this.addNewEmptyPart()
      })

      // add the part to the BOM
      this.$store.dispatch('addExistingPart', add_design_payload).then(success => {
        // part successfully added
        let part_payload = {
          index: index,
          part: success.body.part
        }
        this.$store.commit('setPart', part_payload)

        // map the part tree to the acutual tree, but once you remove the nested parts this won't work anymore
        // call the tree endpoint with different arguments

        let tree_payload = {
          design_id: success.body.part.design_id,
          revision_slug: 'latest'
        }

        this.$store.dispatch('getTree', tree_payload).then(success => {
          if (this.env != 'prod') {
            console.log('New tree to splice into tree is:')
            console.dir(success)
          }

          let updated_node = success[0]
          updated_node.parent_id = this.node.unique_id
          updated_node.unique_id = part_payload.part.part_id

          if (this.env != 'prod') {
            console.log(this.node.unique_id)
            console.log(part_payload.part.part_id)
            console.dir(updated_node)
          }

          this.updateNode(this.tree, updated_node)
          // have to manually update the root node with the correct unique_id and parent_id
          // then update the node in the tree
        }, error => {})

        // share the new design with collaborators
        // let part_ids = [success.body.part.id]
        // this.shareParts(this.design.id, part_ids)

        // how to handle cost updates?
        // if (existingPart.cost > 0) {
        //   this.updateSpecs(index)
        // }

      }, error => {
        if (error.body.inBom) {
          // trail is in parts bom
          this.$store.commit('removePart', index)

          let button = document.getElementById('add-part-button')
          if (button) { button.disabled=false }

          // reset the new part
          this.newPartName = {
            data: null,
            hasError: null,
            error: null
          }

          this.resultSelected = false
          this.result = {}
          $('.ui.search').search('hide results')

          this.message.active = true
          this.message.title = "Cannot add a part to its own BOM"
          this.message.body = 'A nested part in the part you are tying to add is already a part in this assembly, and sits above it in the assembly tree.  You cannot add a part to its own bom!'
          let vue = this
          setTimeout(function() {
            $('.message .close').on('click', function() {
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
          //
        } else {
          // some other error, should already be logged from the store

        }
      })
    },
    createNewPart(index) {

      // use cases
        // add an existing part
          // add the part by name to the parts tree (add node)
          // wait to get the new part data and update the node to include any child parts (need to create a new endpoint)
          // do not fetch the tree

      this.addNewEmptyPart()
      let newPart = this.parts[index]

      // optimistically create the new part...
      newPart.created = true
      newPart.editable = false
      newPart.design_name = this.newPartName.data
      newPart.design_number = ''
      newPart.cost = newPart.cost
      newPart.quantity = newPart.quantity
      newPart.revision_name = 'Latest'

      let new_node = {
        isOpen: true,
			  design_id: null,
				design_name: newPart.design_name,
				design_slug: null,
				owner_slug: null,
				revision_slug: 'latest',
				parent_id: null,
				unique_id: null,
				parts: []
      }

      this.addNode(this.tree, this.node.unique_id, new_node)

      let part_payload = {
        root_design_id: this.design.id,
        name: this.newPartName.data,
        creator_id: this.profile.owner.id,
        owner_id: this.design.owner_user_id,
        visibility: 'PRIVATE',
        license: 1,
        design_class: 3,
        cost: newPart.cost,
        quantity: newPart.quantity
      }

      // reset the new part
      this.newPartName = {
        data: null,
        hasError: null,
        error: null
      }

      this.resultSelected = false
      this.result = {}
      $('.ui.search').search('hide results')
      this.$nextTick(() => {
        let button = document.getElementById('add-part-button')
        if (button) { button.disabled=false }

      })

      this.$store.dispatch('addNewPart', part_payload).then(success => {
        if (typeof success.body.non_field_errors !== 'undefined') {
          if (this.env != 'prod') {
            console.log('Error creating new design: non-field error')
          }
          this.name.hasError = true
          this.name.error = success.body.non_field_errors[0]
        } else {
          // update the part data with response data
          // newPart.design_id = response.data.id
          // console.log('created new design')

          console.log(success.boy)
          part_payload = {
            index: index,
            part: success.body.part
          }

          let new_part = success.body.part
          this.$store.commit('setPart', part_payload)

          let tree_payload = {
            design_id: this.rootDesign.id,
            revision_slug: this.route.params.revision_slug
          }

          let updated_node = {
            isOpen: true,
    				design_id: new_part.design_id,
    				design_name: new_part.design_name,
    				design_slug: new_part.design_slug,
    				owner_slug: new_part.owner_slug,
    				revision_slug: 'latest',
    				parent_id: new_part.parent_id,
    				unique_id: new_part.part_id,
    				parts: []
          }

          this.updateNode(this.tree, updated_node)
        }
      }, error => {})
    },

    addNode(nodes, parent_id, new_node) {
      for (let node of nodes) {
        if (node.unique_id == parent_id) {
          if (this.env != 'prod') {
            console.log('added new empty node to tree')
          }
          node.parts.push(new_node)
        }
        if (node.parts.length > 0) {
          this.addNode(node.parts, parent_id, new_node)
        }
      }
    },
    findNode(tree, part_id) {
      for (let part of tree) {
        if (part.unique_id == part_id) {
          if (this.env != 'prod') {
            console.log('Node in findNode(partsTab) is:')
            console.dir(part)
          }
          this.$store.commit('setNode', part)
          return part
        }
        if (part.parts.length > 0) {
          this.findNode(part.parts, part_id)

        }
      }
    },
    updateNode(nodes, updated_node) {
      for (let node of nodes) {
        if (node.design_name == updated_node.design_name && !node.unique_id) {
          let index = nodes.indexOf(node)
          nodes.splice(index, 1, updated_node)
          if (this.env != 'prod') {
            console.log('updated node in tree after getting part data')
          }
        }
        if (node.parts.length > 0) {
          this.updateNode(node.parts, updated_node)
        }
      }
    },
    removeNode(parts, part_id) {
      for (let part of parts) {
        if (part.unique_id == part_id) {
          if (this.env != 'prod') {
            console.log('removing node from tree')
          }
          let index = parts.indexOf(part)
          parts.splice(index, 1)
        }
        if (part.parts.length > 0) {
          this.removeNode(part.parts, part_id)
        }
      }
    },

    viewPart(index) {
      let selectedPart = this.parts[index]
      let path = `${selectedPart.owner_slug}/${selectedPart.design_slug}/${selectedPart.revision.name}/home`
      this.$router.push('/' + path, onComplete => {
        this.$store.commit('clearDesignRefs')
        this.$store.commit('clearDesign')
        let payload = {
          design_slug: selectedPart.design_slug,
          owner_slug: selectedPart.owner_slug,
          revision_slug: selectedPart.revision_slug
        }
        this.$store.dispatch('getDesign', payload).then(success => {

          let bom_payload = {
            design_id: selectedPart.design_id,
            ref_slug: selectedPart.ref_slug,
            ref_type: selectedPart.ref_type,
            config_slug: selectedPart.config_slug
          }
          this.getBom().then(success => {
            this.getParts(bom_payload)
            let button = document.getElementById('add-part-button')
            if (button) { button.disabled=false }
          }, error => {})
        }, error => {})
      }, onAbort => {})
    },
    openHome(index){
      if (this.env != 'prod') {
        console.log('Open home clicked')
      }
      let selectedPart = this.parts[index]

      console.log(selectedPart)

      let design_payload = {
        design_slug: selectedPart.design_slug,
        owner_slug: selectedPart.owner_slug,
        revision_slug: selectedPart.revision_slug
      }

      this.$store.dispatch('getDesign', design_payload).then(succes => {
        this.$router.push(`${this.designRoute}/home`)
        let payload = {
          design_id: selectedPart.design_id,
          revision_slug: 'latest',
        }
        this.$store.dispatch('getParts', payload).then(success => {
          $('.ui.dropdown.part').dropdown({ 'silent': true })
          $('.ui.dropdown.revision').dropdown({ 'silent': true })
        }, error => {})
      }, error => {})

      if (selectedPart.design_id == this.rootDesign.id) {
        if (this.env != 'prod') {
          console.log('getting root node')
        }
        var part_id = 0
      } else {
        if (this.env != 'prod') {
          console.log('getting a child node')
        }
        var part_id = selectedPart.part_id
      }

      this.findNode(this.tree, part_id)

    },
    openParts(index) {
      if (this.env != 'prod') {
        console.log('Open parts clicked')
        console.dir(this.parts)
      }
      let selectedPart = this.parts[index]

      let design_payload = {
        design_slug: selectedPart.design_slug,
        owner_slug: selectedPart.owner_slug,
        revision_slug: selectedPart.revision_slug
      }

      this.$store.dispatch('getDesign', design_payload)

      let payload = {
        design_id: selectedPart.design_id,
        revision_slug: 'latest',
      }
      this.$store.dispatch('getParts', payload).then(success => {
        $('.ui.dropdown.part').dropdown({ 'silent': true })
        $('.ui.dropdown.revision').dropdown({ 'silent': true })
      }, error => {})

      if (selectedPart.design_id == this.rootDesign.id) {
        if (this.env != 'prod') {
          console.log('getting root node')
        }
        var part_id = 0
      } else {
        if (this.env != 'prod') {
          console.log('getting a child node')
        }
        var part_id = selectedPart.part_id
      }

      this.findNode(this.tree, part_id)
    },
    changeBomLevel(index) {
      if (this.env != 'prod') {
        console.log('Change BOM level clicked')

      }

      // change the trail
      this.trail = this.trail.slice(0, index + 1)
      let breadcrumb = this.trail[index]
      let bom_payload = {
        design_id: breadcrumb.design_id,
        ref_slug: breadcrumb.ref_slug,
        ref_type: breadcrumb.ref_type,
        config_slug: breadcrumb.config_slug
      }
      this.getBomParts(bom_payload)
    },

    setTrackingRef(part_revision, index) {

      console.log(part_revision)

      let part = this.parts[index]
      let trail_ids = this.trail.map((part) => {return part.id})

      let update_part_payload = {
        parent_design_id: this.design.id,
        part_id: part.part_id,
        revision_id: part_revision.id,
        quantity: part.quantity,
        trail_ids: trail_ids
      }

      console.log(update_part_payload)

      this.$store.dispatch('updatePart', update_part_payload).then(success => {
        let part_payload = {
          index: index,
          part: success.body
        }

        this.$store.commit('setPart', part_payload)

        let tree_payload = {
          design_id: this.rootDesign.id,
          revision_slug: this.$route.params.revision_slug
        }

        this.$store.dispatch('getTree', tree_payload).then(success => {
          this.$store.commit('setTree', success.body)
        }, error => {})
      }, error => {})
    },
    makePartEditable(index, target) {
      this.enterPressed = false
      this.parts[index].editable = true
      let revisedPart = this.parts[index]
      this.selectedPart = JSON.parse(JSON.stringify(revisedPart))
      // revisedPart.editable = true
      // focus on the name input
      let vue = this
      setTimeout(function() {
        if (vue.env != 'prod') {
          console.log('focusing on part edit input -> ', target)
        }
          document.getElementById("part-" + target + "-editable").focus()
      }, 0);
    },
    updateBlurTest(index, event) {
      if (!this.enterPressed) {

        document.activeElement.blur();
        console.log('made part uneditable in update blur test')
        if (this.env != 'prod') {console.log('Update blur test called from ', index)}
        if (event.relatedTarget) {
          var target = event.relatedTarget.id
        } else {
          var target = null
        }
        if (target !== 'part-quantity-editable' && target !== 'part-cost-editable' && target !== 'part-name-editable' ) {
          if (this.env != 'prod') {
            console.log('Not an editable div(', event, '), testing part')
          }
          this.testEditedPart(index)
        } else {
          if (this.env != 'prod') {console.log('Target is an editable div, passing')}
        }
      } else {
        console.log('enter was pressed')
        this.enterPressed = false
      }
    },
    testEditedPart(index) {
      this.enterPressed = true
      this.parts[index].editable = false
      document.activeElement.blur();
      console.log('part should not be editable')
      let updated = false
      // check if part data has changed
      let original_part_data = JSON.stringify({
        quantity: this.selectedPart.quantity,
        revision_id: this.selectedPart.revision_id
      })
      let new_part_data = JSON.stringify({
        quantity: this.parts[index].quantity,
        revision_id: this.parts[index].revision_id
      })

      if (original_part_data !== new_part_data) {
        let updated = true
        if (this.env != 'prod') {
          console.log('Part data has changed, updating')
        }

        let trail_ids = this.trail.map((part) => {return part.id})

        let update_part_payload = {
          parent_design_id: this.design.id,
          part_id: this.parts[index].part_id,
          revision_id: this.parts[index].revision_id,
          quantity: this.parts[index].quantity,
          trail_ids: trail_ids
        }
        this.$store.dispatch('updatePart', update_part_payload)
      } else { console.log('Part data has not changed') }

      // check if design data has changed
      let original_design_data = JSON.stringify({
        name: this.selectedPart.design_name,
        cost: this.selectedPart.cost
      })

      let new_design_data = JSON.stringify({
        name: this.parts[index].design_name,
        cost: this.parts[index].cost
      })

      if (original_design_data != new_design_data) {
        let updated = true
        if (this.env != 'prod') {
          console.log('Design data has changed, updating')
        }

        let update_design_payload = {
          design_id: this.selectedPart.design_id,
          name: this.parts[index].design_name,
          cost: this.parts[index].cost
        }
        console.log(update_design_payload)
        this.$store.dispatch('updateDesignData', update_design_payload)

      } else { console.log('Design data has not changed') }

      let part = {
        design_id: this.parts[index].design_id,
        design_name: this.parts[index].design_name,
        design_slug: this.parts[index].design_slug,
        design_number: this.parts[index].design_number,
        parent_id: this.parts[index].parent_id,
        revision_name: this.parts[index].revision_name,
        revision_id: this.parts[index].revision_id,
        quantity: this.parts[index].quantity,
        parts: this.parts[index].parts,
        revisions: this.parts[index].revisions,
        created: true,
        editable: false,
        cost: this.parts[index].cost,
        parts: [],
        revisions: [],
        owner_slug:  this.parts[index].owner_slug,
        part_id: this.parts[index].part_id,
        revision_id: this.parts[index].revision_id,
        revision_name: this.parts[index].revision_name
      }

      let part_payload = {
        index: index,
        part: part
      }
      this.$store.commit('setPart', part_payload)


      this.parts[index].editable = false
      console.log(this.indexOfEditable)



      // let set_part_payload = {
      //
      // }

      // if (updated) {
      //   this.$store.commit('setPart', set_part_payload)
      // }
    },
    testEditedPartDesign(index) {
      // test if design (name) has changed -> update the design record
      let testPart = this.parts[index]
      if (testPart != this.selectedPart) {
        /**Part names are currently not allowed to be changed, so this section is unecessary
        if (testPart.design_name != this.selectedPart.design_name.trim()) {
          console.log('Design change detected in update part')

          let test = /^[A-Za-z0-9-_/\,;:'" ] ]{1,50}$/.test(testPart.design_name)
          if (test) {
            console.log('Name matches regex')
            // check if this design name is already in use by this user
            let test_slug = testPart.design_name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')
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
        }*/

        this.testEditedPartBOM(index);
      } else {
        if (this.env != 'prod') {
          console.log('No change detected for this part update')
        }
        this.parts[index].editable = false
      }
    },
    testEditedPartBOM(index) {
      // test if bom (qty or ref) has changed -> update the bom record
      let testPart = this.parts[index]
      if (testPart.quantity != this.selectedPart.quantity || testPart.ref_slug != this.selectedPart.ref_slug) {
        if (this.env != 'prod') {
          console.log('Bom change detected in update part')
        }

        this.bom.data[index] =  {
          design_id: testPart.design_id,
          ref_slug: testPart.ref_slug,
          ref_type: testPart.ref_type,
          config_slug: testPart.config_slug,
          quantity: testPart.quantity
        }

        if (this.env != 'prod') {
          console.log('About to call update bom with update part replaced by index')
          console.log(this.bom)
        }

        let action = `changed qty of ${testPart.design_name} to ${testPart.quantity} in BOM`
        let message = null
        this.updateBOM(action, message).then(success => {
          if (this.env != 'prod') {
            console.log('Updated BOM record after editing an existing part')
          }
          this.parts[index].editable = null
          this.editedPartUpdated = true
          this.testEditedPartSpecs(index)
        }, error => {

        })
      } else {
        if (this.env != 'prod') {
          console.log('No change to BOM in edited part, testing specs')
        }
        this.testEditedPartSpecs(index)
      }
    },
    testEditedPartSpecs(index) {
      // test if specs (cost) have changed -> updae the specs record
      let testPart = this.parts[index]
      if (testPart.cost != testPart.specs.data.suppliers[0].partSchedules[0].unitCost) {
        if (this.env != 'prod') {
          console.log('Specs changed detected in update part')
        }

        testPart.specs.data.suppliers[0].partSchedules[0].unitCost = testPart.cost
        this.updateSpecs(index).then(success => {
          if (this.env != 'prod') {
            console.log('Updated Specs record after editing an existing part')
          }
          let breadcrumb = this.trail[this.trail.length - 1]

          let bom_payload = {
            design_id: breadcrumb.design_id,
            config_slug: breadcrumb.config_slug,
            ref_slug: breadcrumb.ref_slug,
            ref_type: breadcrumb.ref_type
          }
          this.getParts(bom_payload)
          this.editedPartUpdated = true
          this.parts[index].editable = false
        }, error => {})
      } else {
        if (this.editedPartUpdated = false) {
          if (this.env != 'prod') {
            console.log('ALERT --- when testing the update for this part, the objects are not equal but no specific change was detected...')
          }

        } else {
          if (this.env != 'prod') {
            console.log('No change to specs in edited part')
            console.log('Completing part update, un update actually occurred :-)')
          }

          // let design_payload = { design_slug: this.$route.params.design_slug }
          // this.$store.dispatch('getDesign', design_payload)
        }
        this.parts[index].editable = false
      }
    },
    shareParts(design_id, part_ids) {
      return new Promise ((resolve, reject) => {
        let payload = {
          design_id: design_id,
          part_ids: part_ids
        }
        this.$http.post('share_parts/', payload).then(success => {
          if (this.env != 'prod') {
            console.log('Shared parts with collaborators')
            console.log(success)
            resolve()
          }
        }, error => {
          if (this.env != 'prod') {
            console.log('Error sharing parts with collaborators')
            console.log(error)
            reject()
          }
        })
      })
    },
    updateSpecs(index) {
      return new Promise((resolve, reject) => {
        let updated_part = this.parts[index]
        if (this.env != 'prod') {
          console.dir(updated_part)
        }

        let payload = {
          editor: this.profile.id,
          data: updated_part.specs.data
        }
        let action = `updated cost for ${updated_part.design_name}`
        let message = null
        this.$http.put('specs/' + updated_part.specs.id + '/?ref=' + updated_part.ref_slug +
        '&action=' + action + '&message=' + message, payload).then(success => {
          if (this.env != 'prod') {
            console.log('Specs updated')
            console.log(success)
          }
          let design_payload = {
            design_slug: this.design.slug,
            owner_slug: this.design.owner_slug,
            revision_slug: 'latest'
          }
          this.$store.dispatch('getDesign', design_payload).then(success => {
            if (this.env != 'prod') {
              console.log('Got updated Design after updating Specs')
            }
          }, error => {
            if (this.env != 'prod') {
              console.log('Error getting updating design after updating Specs')
            }
          })
          resolve(success)
        }, error => {
          if (this.env != 'prod') {
            console.log('Error updating specs')
            console.log(error)
          }
          reject(error)
        })
      })
    },
    removePart(index) {
      // dont commit back to git if the this is a new part that has not been added yet
      let removed_part = this.parts[index]
      if (removed_part.created == false) {
          this.parts.pop()
          let button = document.getElementById('add-part-button')
          if (button) { button.disabled=false }
          if (this.env != 'prod') {
            console.log('New unsaved part has been removed from the BOM')
          }
          this.newPartName = {
            data: null,
            hasError: null,
            error: null
          }

          this.resultSelected = false
          this.result = {}
          $('.ui.search').search('hide results')

      } else {
        this.removeNode(this.tree, removed_part.part_id)

        let part_payload = {
          parent_design_id: this.design.id,
          part_id: removed_part.part_id
        }

        this.$store.commit('removePart', index)
        this.$store.dispatch('deletePart', part_payload).then(succes => {
          let tree_payload = {
            design_id: this.rootDesign.id,
            revision_slug: this.route.params.revision_slug
          }
        }, error => {})

      }
    },
    tabOver(event) {
      console.dir(event)
      // let partName = $('#part-name-editable').parent().parent().next().next().next().children()
      let partName = event.srcElement

      // if (this.env != 'prod') {
      //   console.log('In tabover function')
      //   console.log('Part name is: ' + partName)
      //   console.dir(partName)
      // }

      let tabbedLocation = $('#part-name-editable').parent().parent().next().next().next().children().children().focus()
      console.dir(tabbedLocation)
      // event.srcElement.parent().parent().next().next().next().next().children().focus()
    },
    tabDown() {
      if (this.env != 'prod') {
        console.log('In tabdown function')
        console.log('Part name is: ' + partName)
      }
      let partName = $('#part-name-editable').parent().parent().next().next().children()
      $('#part-name-editable').parent().parent().next().next().children().focus()
    },

    showRegularBom() {},
    showFlatBom() {
      // client side
      // traverse the full bom tree and collect the parts into a single list
      // you at least know there cannot be any duplicates within the same parent and parents and children cannot be duplicates
      // each time you find a duplicate remove it from the list and increment the quantity
      // then just render the list/quantity
    },
    importBom() {
      // upload the csv to server, parse into a python object
      // traverse the tree and create a part for each item, and recursively add sub parts to the BOM, also parse any data out into specs
      // once complete it would then return the full BOM in response
    },
    exportBom() {
      // client side (already have the full BOM)
      // take the BOM and convert to CSV
      // could be indented BOM, flat BOM, or just top level BOM
      // should be good js library for parsing json into a csv
      // mapping full properties list will be tricky

    },
    viewAllSpecs() {
      // takes all properties from specs and correlate for each part
      // all should be editable as well
    },
  },
  created() {
    // may enter parts directly (have to wait for design to load)

    // or may come at parts from home (design has already loaded)
      // check if design

    if (this.design) {
      if (this.env != 'prod') {
        console.log('Parts.vue created, design data already loaded, getting bom')
        console.log('getParts has been called in part.vue created')
      }
      let payload = {
        design_id: this.design.id,
        revision_slug: this.revision.slug,
      }
      // this.$store.dispatch('getBom', payload)
      this.$store.dispatch('getParts', payload).then(success => {
        $('.ui.dropdown.part').dropdown({ 'silent': true })
        $('.ui.dropdown.revision').dropdown({ 'silent': true })
      }, error => {})
    } else {
      if (this.env != 'prod') {
        console.log('Parts.vue created, no design data present, waiting on watcher')
      }
    }
  },
  mounted() {
  },
  updated() {
    // $('.modal:not(:first)').remove()
  }
}
</script>

<style lang="css">

  .fade-enter-active, .fade-leave-active {
    transition-property: opacity;
    transition-duration: .25s;
  }

  .fade-enter-active {
    transition-delay: .25s;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }
</style>
