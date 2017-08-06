<template lang="html">
  <div>
    <div></div>
    <div class="ui top attached grey header">
      BILL OF MATERIALS &#8212; Add parts and create nested assemblies
    </div>
    <div class="ui bottom attached segment">
    <!--   <div class="ui big breadcrumb">
      <div class="section">
        {{ design.name }}
      </div>
    </div> -->
      <transition name='fade'>
        <table class="ui striped selectable table" id='bomTable' v-if='parts.length > 0'>
          <thead>
            <tr>
              <th></th>
              <th>Part Name</th>
              <th>Part #</th>
              <th>Last Change</th>
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
                  v-if='$route.params.rev_slug == "latest"'
                  class="ui small basic blue button"
                  @click='addEmptyPart'
                  id='add-part-button'
                >
                  Add Another Part
                </button>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td>Total</td>
              <td> $ {{ sumTotal.toFixed(2) }} </td>
            </tr>
          </tfoot>
          <tbody name='fade' is="transition-group">
            <tr v-for='(part, index) in parts' :key='part.design_number'>

              <!-- Part Type Icon & Modal Link -->
              <td class='collapsing'>
                <a href="#">
                  <i v-if='part.parts.length > 0' class="cubes icon"></i>
                  <i v-else class="cube icon"></i>
                </a>
              </td>

              <!-- Part Name -->
              <td v-if='!part.created && $route.params.rev_slug == "latest"'>
                  <div class="ui transparent search input fluid" id='part-name-editable-div'>
                    <input
                      class="prompt compact"
                      type="text"
                      v-model='newPartName.data'
                      id='part-name-editable'
                      placeholder=" Search parts library..."
                      @keydown.enter='getSearchResult(index)'
                      @blur='result ? null : newPartBlurTest(index, $event)'
                      @keydown.tab.prevent='tabOver($event)'
                      @keydown.esc='removePart(index)'
                      @keydown.delete='newPartName.data ? null : removePart(index)'
                    >
                    <div
                      v-if='!newPartName.hasError'
                      class="results"
                      @click='getSearchResult(index)'
                    ></div>
                  </div>
              </td>

              <td v-else-if='part.created && isEditable(index) && $route.params.rev_slug == "latest" '>
                <div id='part-name-editable-div'>
                  <router-link tag='a' to='' @click.native.prevent.once='openPart(index)'
                  id ='part-name-editable'>
                    {{ part.design_name }}
                  </router-link>
                </div>
              </td>

              <!--the old version of the part-name (where name could also be edited) 
              <td v-else-if='part.created && part.editable && $route.params.rev_slug == "latest" '>
                <div class="ui transparent input" id='part-name-editable-div'>
                  <input
                    type="text"
                    v-model='part.design_name'
                    id='part-name-editable'
                    size='25'
                    @keyup.enter='part.design_name ? testEditedPartDesign(index) : partNameError(index)'
                    @keyup.delete='part.design_name ? null : removePart(index)'
                    @keydown.tab.prevent='tabOver($event)'
                    @blur='part.design_name ? updateBlurTest(index, $event) : partNameError(index)'
                  >
                </div>
              </td>
              -->

              <td v-else id='part-name'>
                <router-link tag='a' to='' @click.native.prevent.once='openPart(index)'>
                  {{ part.design_name }}
                </router-link>
              </td>

              <!-- Part # -->
              <td id='part-number' v-if='designRefs.ref_type == "config"'>
                <div class="ui dropdown refs" v-if='part.created'>
                  <div class="text">
                    {{ part.design_number }}
                  </div>
                  <i class="dropdown icon"></i>
                  <div class="menu">
                    <div class="item" v-for='ref in part.refs' @click='setTrackingRef(ref, index, part)'>
                      {{ ref.part_number }}
                    </div>
                  </div>
                </div>
              </td>

              <td v-else class='collapsing'>
                {{ part.design_number }}
              </td>

              <!-- Part Last Change -->
              <td id='part-last-change'>
                <span v-if='part.created'>

                  {{ part.rev_editor_slug }}

                  <a href="">
                    {{ part.rev_action }}
                  </a>

                  {{ part.rev_last_updated | moment("from", "now") }}

                </span>
              </td>

              <!-- Part Quantity -->
              <td
                v-if='!part.created && $route.params.rev_slug == "latest"'
                class='collapsing'
              >
                <div class="ui transparent input" style='width:50px'>
                  <input
                    type="number"
                    style='width:50px'
                    min='1'
                    v-model='part.quantity'
                    id='part-quantity-editable'
                    @keyup.enter='checkNewPartNameOnEnter(index, $event)'
                    @blur='newPartBlurTest(index, $event)'
                  >
                </div
              </td>

              <td
                v-else-if='part.created && isEditable(index) && $route.params.rev_slug == "latest"'
                class='collapsing'
              >
                <div class="ui transparent input" style='width:50px'>
                  <input
                    type="number"
                    style='width:50px'
                    id='part-quantity-editable'
                    v-model='part.quantity'
                    min='1'
                    @keyup.enter='part.design_name ? testEditedPartDesign(index) : partNameError(index)'
                    @blur='part.design_name ? updateBlurTest(index, $event) : partNameError(index)'
                  >
                </div>
              </td>

              <td
                v-else
                id='part-quantity'
                @click='makePartEditable(index, "quantity")'
                class='collapsing'
              >
                {{ part.quantity }}
              </td>

              <!-- Part Cost -->
              <td v-if='!part.created && $route.params.rev_slug == "latest"' class='collapsing'>
                <div class="ui transparent input" style='width:50px'>
                  <input
                    type="number"
                    id='part-cost-editable'
                    min='0'
                    step='.01'
                    v-model='part.cost'
                    @keydown.enter='checkNewPartNameOnEnter(index, $event)'
                    @blur='newPartBlurTest(index, $event)'
                  >
                </div>
              </td>

              <td v-else-if='part.created && isEditable(index) && $route.params.rev_slug == "latest"' class='collapsing' >
                <div class="ui transparent input" style='width:50px'>
                  <input
                    id='part-cost-editable'
                    type="number"
                    min='0'
                    step='.01'
                    size='10'
                    v-model='part.cost'
                    @keydown.enter='part.design_name ? testEditedPartDesign(index) : partNameError(index)'
                    @keydown.tab.prevent='part.design_name ? testEditedPartDesign(index) : partNameError(index)'
                    @blur='part.design_name ? updateBlurTest(index, $event) : partNameError(index)'
                  >
                </div>
              </td>

              <td v-else-if='part.parts.length > 0' class='collapsing'>
                $ {{ part.cost.toFixed(2) }}
              </td>

              <td
                v-else
                id='part-cost'
                @click='makePartEditable(index, "cost")'
                class='collapsing'
              >
                <span v-if='part.cost'>
                  $ {{ part.cost.toFixed(2) }}
                </span>
                <span v-else>
                  $ 0.00
                </span>
              </td>

              <!-- Part Total -->
              <td v-if='part.cost' class='collapsing'>
                $ {{ (part.quantity * part.cost).toFixed(2) }}
              </td>
              <td v-else class='collapsing'>
                $ 0.00
              </td>

              <!-- Part Menu Options -->
              <td v-if='!part.created'>
                <button
                  class="circular ui mini basic icon button"
                  @click='removePart(index)'
                >
                  <i class="icon close"></i>
                </button>
              </td>
              <td v-else >
                <div class="ui icon top left pointing mini basic dropdown button part">
                  <i class="caret down icon"></i>
                  <div class="menu">
                    <div class="item">
                      Part Options
                    </div>
                    <div class="divider"></div>
                    <!-- <div v-if='$route.params.rev_slug == "latest"' class="item" @click='openPart(index)'>
                      <i class="level down icon"></i>
                      Select Part
                    </div> -->
                    <div class="item" @click='viewPart(index)'>
                      <i class="home icon"></i>
                      View Homepage
                    </div>
                    <div v-if='$route.params.rev_slug == "latest"' class="item" @click='removePart(index)'>
                      <i class="trash icon"></i>
                      Remove from BOM
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div style='text-align:center' v-else-if='$route.params.rev_slug=="latest"' @click='showBomTable'>
          <br>
          <h2 class="ui icon header" >
            <i class="cubes icon"></i>
            <br>
            <div class="content">
              Click here to add parts
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
        </div>
      </transition>

      <transition name='fade'>
        <div class="ui success message" v-if='message.active'>
          <i class="close icon"></i>
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

import { mapGetters } from 'vuex'
import { EventBus } from '../../event-bus.js'
export default {
  name: 'newParts',
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
      parts: [],
      bom: null
    }
  },
  computed: {
    ...mapGetters([
      'env',
      'params',
      'session',
      'profile',
      'design',
      'designRefs',
      'trail',
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
    },
  },
  watch: {
    //
    designRefs() {
      console.log('designRefs watcher has been called in parts.vue')
      console.log(`Path endpoint is: ${this.designRefs.endpoint}`)
      this.gettingBom = true
      if (this.designRefs.endpoint == 'parts') {
        let bom_payload = {
          design_id: this.design.id,
          config_slug: this.designRefs.config_slug,
          ref_slug: this.designRefs.ref,
          ref_type: this.designRefs.ref_type
        }
        console.log('getParts has been called from watcher in parts.vue')
        this.getBom().then(success => {
          this.getParts(bom_payload)
        }, error => {})
      }
    },
    trail() {
      console.log('trail watcher has been called in parts.vue')
      let bom_payload = {
        design_id: this.design.id,
        config_slug: this.designRefs.config_slug,
        ref_slug: this.designRefs.ref,
        ref_type: this.designRefs.ref_type
      }

      let vue = this
      this.getBom().then(success => {
        vue.getParts(bom_payload)
      }, error => {})

    }
  },
  methods: {
    isEditable(index){
      return index === this.indexOfEditable;
    },
    formatBytes(bytes, decimals) {
       if(bytes == 0) return '0 Bytes'
       var k = 1000
       var dm = decimals + 1 || 3
       var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
       var i = Math.floor(Math.log(bytes) / Math.log(k))
       return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    },
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
        }
      }, error => {
        console.log(error)
      })
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
    getBom() {
      return new Promise((resolve, reject) => {
        this.$http.get('boms/' + this.design.bom.id + '/?ref=' + this.designRefs.ref + '&type=' + this.designRefs.ref_type + '$config=' + this.designRefs.config_slug).then(response => {
          console.log('got bom')
          console.log(response)
          this.bom = response.data
          resolve()
        }, response => {
          console.log('error getting bom')
          console.log(response)
          reject()
        })
      })

    },
    getParts(payload) {
      return new Promise((resolve, reject) => {
        this.$http.get(`get_bom_parts/?design_id=${payload.design_id}&ref_slug=${payload.ref_slug}&ref_type=${payload.ref_type}&config_slug=${payload.config_slug}`).then(success => {
          console.log('Got Parts')
          console.log(success)
          this.parts = success.data
          console.log('trying to activate drodpdown on parts')

          this.$nextTick(() => {
            var dropdown = document.getElementsByClassName('.ui.dropdown.part')
            if (dropdown) {
              $('.ui.dropdown.part').dropdown(
                { 'silent': true }
              )
              $('.ui.dropdown.refs').dropdown(
                { 'silent': true }
              )
            }
            this.$nextTick(() => {
              if (this.parts.length == 0 && this.$route.params.rev_slug == 'latest' && this.trail.length > 1) {
                this.addEmptyPart()
              }
              resolve(success)
            })
          })
        }, error => {
          console.log('Error getting Parts')
          console.log(error)
          reject(error)
        })
      })
    },
    showBomTable() {
      this.addEmptyPart()
    },

    checkNewPartNameOnEnter(index, $event) {
      this.enterPressed = true
      console.log('Check new part name function started')
      if (this.newPartName.data) {
        console.log('New part has been entered');
        this.testNewPart(index)
      } else {
        console.log('New party input is empty');
        this.partNameError(index, $event)
      }
    },
    newPartBlurTest(index, $event) {
      console.log('New part blur test function started')
      if (!this.enterPressed) {
        if ($event.relatedTarget) {
          var target = $event.relatedTarget.id
        } else { var target = null }
        if (target !== 'part-quantity-editable' && target !== 'part-cost-editable' && target !== 'part-name-editable') {
          console.log('Legit blur event, checking name')
          this.checkNewPartNameonBlur(index, $event) } else {
          console.log('Blur transitioned to another editable div, ignoring')
        }
      } else {
        this.enterPressed = false
        console.log('Blur triggered by keydown.enter, ignoring')
      }
    },
    checkNewPartNameonBlur(index, $event) {
      console.log('Check new part name function started')
      if (this.newPartName.data) {
        console.log('New part has been entered');
        this.testNewPart(index)
      } else {
        console.log('New part input is empty');
        this.partNameError(index, $event)
      }
    },
    partNameError(index, $event) {
      // focus on the input in question
      console.log('Part name error function started')
      console.log($event)
      setTimeout(function() {
          console.log('focusing on name error input')
          document.getElementById("part-name-editable").focus()
      }, 0);
      // change input class to error
      document.getElementById("part-name-editable-div").className = 'ui input error'
      document.getElementById("part-name-editable").placeholder = 'Enter a name'
    },
    getSearchResult(index) {
      let vue = this
      setTimeout(() => {
        if (vue.resultSelected) {
          console.log('Enter pressed to select a part from search results')
          vue.checkIfInBOM(index, vue.result.slug)
        } else {
          console.log('Enter pressed to create a new part')
          if (vue.newPartName.data.trim()) {
            let bc_names = vue.trail.map((bc) => {return bc.name})
            if (bc_names.includes(vue.newPartName.data.trim())) {
              vue.removePart(index)
              vue.message.active = true
              vue.message.title = 'Cannot Add Part to BOM'
              vue.message.body = 'You cannot add a design into its own BOM'
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

              this.newPartName = {
                data: null,
                hasError: null,
                error: null
              }

              this.resultSelected = false
              this.result = {}
              $('.ui.search').search('hide results')

              // add another empty part to the bom and set focus there
              this.addEmptyPart()
              this.$nextTick( function() {
                $('.ui.dropdown.part').dropdown(
                  { 'silent': true }
                );
              })
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
      }, 0)
    },
    checkIfInBOM(index, result) {

      let newPart = this.parts[index]

      // check to see if part is already in BOM
      let part_slugs = this.parts.map((part) => {return part.design_slug})
      part_slugs.pop()
      if (part_slugs.includes(result)) {
        console.log('New part being added is already in the BOM, checking to see if they have the same ref')
        let matched_part_index = part_slugs.indexOf(result)
        let matched_part = this.parts[matched_part_index]
        // check to see if they are being tracked at the same ref
        if (matched_part.ref_slug != 'alpha') {
          console.log('New part is being tracked at a different ref, adding new part')
          this.addExistingDesign(index, result)
        } else {
          console.log('New part is being tracked at the same ref, incrementing orignal party quantity instead of adding new part')

          matched_part.quantity += 1
          this.parts.pop()
          this.bom.data[matched_part_index].quantity += 1
          let action = `changed qty of ${matched_part.design_name} to ${matched_part.quantity} `
          let message = null
          this.updateBOM(action, message)

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
          this.addEmptyPart()
          this.$nextTick( function() {
            $('.ui.dropdown.part').dropdown(
              { 'silent': true }
            );
          })
        }
      } else {
        console.log('New part being added is not in the BOM, adding a new part')
        this.addExistingDesign(index, result)
      }
    },
    addExistingDesign: async function(index, result) {

      // get the design for the existing part by the slug
      let existingPart = this.parts[index]
      let design_payload = {design_slug: result}
      let response = await this.getDesign(design_payload)
      let design = response.data

      // check to see if any parts in the current trail are already inside the full bom of the new design

      let bom_check_payload = {
        imported_design: {
          design_id: design.id,
          ref_slug: existingPart.ref_slug,
          ref_type: existingPart.ref_type,
          config_slug: existingPart.config_slug
        },
        trail_ids: trail_ids
      }

      this.$http.get('bom_check/', payload).then(success => {

      }, error => {

      })



      let parts_payload = {
        design_id: design.id,
        ref_slug: breadcrumb.ref_slug,
        ref_type: breadcrumb.ref_type,
        config_slug: breadcrumb.config_slug
      }
      let parts = this.getParts()

      // append it to the BOM
      let new_item = {
        design_id: design.id,
        ref_slug: 'alpha',
        ref_type: 'config',
        config_slug: 'alpha',
        quantity: existingPart.quantity
      }
      this.bom.data.push(new_item)

      // update the BOM
      let action = `added ${design.name} to BOM`
      let message = null
      let import_id = design.id
      let import_step = 1
      let newBom = await this.updateBOM(action, message, import_id, import_step)
      if (existingPart.cost > 0) {
        this.updateSpecs(index)
      }

      // get the new design record (for the current breadcrumb)
      design_payload = {design_slug: this.design.slug}
      this.getDesign(design_payload)

      // get the parts for just this part
      let breadcrumb = this.trail[this.trail.length - 1]
      let payload = {
        design_id: breadcrumb.design_id,
        ref_slug: breadcrumb.ref_slug,
        ref_type: breadcrumb.ref_type,
        config_slug: breadcrumb.config_slug
      }
      // get bom parts returns
      this.getParts(payload).then(success => {
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
          this.addEmptyPart()
        })
      }, error => {})
    },

    testNewPart(index, $event) {
      console.log($event)
      console.log('Test new part function called');
      this.newPartName.nameHasError = false
      this.newPartName.error = null
      this.newPartName.data = this.newPartName.data.trim()

      // regex check for legal project name
      let test = /^[A-Za-z0-9-_/\,;:'" ]{1,50}$/.test(this.newPartName.data)
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
      console.log('Save new part function called');
      let newPart = this.parts[index]

      // create the actual design
      let payload = {
        name: this.newPartName.data,
        active: true,
        creator: this.profile.id,
        license: 1,
        design_class: 3,
        cost: newPart.cost
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
          // update the part data
          // update the part to reflect the design data and that it is created
          newPart.design_id = response.data.id
          newPart.design_name = response.data.name
          newPart.design_slug = response.data.slug
          newPart.design_number = `${response.data.abbreviation}-${response.data.sequence}-${response.data.design_class.code}-ALPHA`
          newPart.ref_slug = 'alpha'
          newPart.ref_type = 'config'
          newPart.config_slug = 'alpha'
          newPart.rev_editor_slug = response.data.rev_set[0].owner
          newPart.rev_last_updated = response.data.rev_set[0].created_at
          newPart.rev_action = response.data.rev_set[0].action
          newPart.created = true
          newPart.refs = [
            {
              part_number: `${response.data.abbreviation}-${response.data.sequence}-${response.data.design_class.code}-ALPHA`,
              slug: 'alpha'
            },
            {
              part_number: response.data.number,
              slug: '0'
            }
          ]

          // newPart.meta.path = `${newPart.design.creator_slug}/${newPart.design.slug}/alpha/latest/specs`

          // reset the new part
          vue.newPartName = {
            data: null,
            hasError: null,
            error: null
          }

          this.$nextTick(() => {
            $('.ui.dropdown.refs').dropdown(
              { 'silent': true }
            )
          })

          let button = document.getElementById('add-part-button')
          if (button) { button.disabled=true }

          // add another empty part to the bom and set focus there
          vue.addEmptyPart()

          // create a new bom item and insert into the bom.data
          let new_item = {
            design_id: newPart.design_id,
            ref_slug: 'alpha',
            ref_type: 'config',
            config_slug: 'alpha',
            quantity: newPart.quantity
          }

          vue.bom.data.push(new_item)
          let action = `added ${newPart.design_name} to BOM`
          let message = null
          let import_id = newPart.design_id
          let import_step = 1
          vue.updateBOM(action, message, import_id, import_step)
          if (newPart.cost > 0) {
            this.updateSpecs(index)
          }
          console.log('commited part to bom')
        }
      }, response => {
        console.log('Error creating new design')
        console.log(response)
      })
    },
    addEmptyPart() {
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
        'design_number': '123',
        'ref_slug': 'alpha',
        'ref_type': 'config',
        'config_slug': 'alpha',
        'rev_editor_slug': null,
        'rev_last_updated': null,
        'rev_action': null,
        'quantity': 1,
        'cost': 0.00,
        'created': false,
        'editable': false,
        'parts': []
      }
      this.parts.push(part)

      let design_ids = ''
      for (let breadcrumb of this.trail) {
        design_ids += ('&design_id=' + breadcrumb.design_id)
      }

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
                  url: 'https://www.omnibuilds.com/designquery/?q={query}' + design_ids,
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
                console.log('Result selected, set result Selected to true')
              }
            }
          )
        } else {
          $('.ui.search').search(
            {
              apiSettings: {
                  url: 'https://stage.omnibuilds.com/designquery/?q={query}' + design_ids,
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
                console.log('Result selected, set result Selected to true')
              }
            }
          )
        }

        console.log('focusing')
        $('#part-name-editable').focus()
      })
    },

    viewPart(index) {
      let selectedPart = this.parts[index]
      console.log('View part called')
      this.$router.push('/' + selectedPart.path, onComplete => {
        let button = document.getElementById('add-part-button')
        if (button) { button.disabled=true }
      }, onAbort => {

      })
    },
    openPart(index) {
      let selectedPart = this.parts[index]

      // create a new breadrcrumb
      let breadcrumb = {
        name: selectedPart.design_name,
        slug: selectedPart.design_slug,
        design_id: selectedPart.design_id,
        ref_slug: selectedPart.ref_slug,
        ref_type: selectedPart.ref_type,
        config_slug: selectedPart.config_slug,
        // path: selectedPart.path
      }
      // this.trail.push(breadcrumb)
      this.$store.commit('extendTrail', breadcrumb)

      // update the route params
      if (selectedPart.ref_type == 'config') {
        this.$route.params.config_slug = selectedPart.config_slug
        this.$route.params.rev_slug = 'latest'
        this.$route.params.build_slug = null
      } else if (selectedPart.ref_type == 'rev') {
        this.$route.params.config_slug = selectedPart.config_slug
        this.$route.params.rev_slug = selectedPart.ref_slug
        this.$route.params.build_slug = null
      } else if (selectedPart.ref_type == 'build') {
        this.$route.params.config_slug = selectedPart.config_slug
        this.$route.params.rev_slug = null
        this.$route.params.build_slug = selectedPart.ref_slug
      }
      // get updated design and records
      let design_payload = { design_slug: selectedPart.design_slug }
      this.$store.dispatch('getDesign', design_payload).then(success => {
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
    },
    changeBomLevel(index) {
      console.log('Change BOM level clicked')

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

    setTrackingRef(ref, index, part) {
      this.bom.data[index]['config_slug'] = ref.config_slug
      this.bom.data[index]['ref_slug'] = ref.slug
      this.bom.data[index]['ref_type'] = ref.ref_type

      var action = `set ${part.design_name} to ${ref.tracked_at}`
      let message = null

      this.updateBOM(action, message).then(success => {
        let bom_payload = {
          design_id: this.design.id,
          config_slug: this.designRefs.config,
          ref_slug: this.designRefs.ref,
          ref_type: this.designRefs.ref_type
        }
        this.getParts(bom_payload)
      }, error => {})
    },
    makePartEditable(index, target) {
      let revisedPart = this.parts[index]
      this.selectedPart = JSON.parse(JSON.stringify(revisedPart))
      this.changeEditableIndex(index);
      // focus on the name input
      setTimeout(function() {
          console.log('focusing on part edit input -> ', target)
          document.getElementById("part-" + target + "-editable").focus()
      }, 0);
    },
    changeEditableIndex(newIndex){
      this.indexOfEditable = newIndex;
    },
    updateBlurTest(index, event) {
      if (!this.enterPressed) {
        console.log('Update blur test called from ', index)

        if (event.relatedTarget) {
          var target = event.relatedTarget.id
        } else {
          var target = null
        }

        // have to know if the target is wihin the same

        if (target !== 'part-quantity-editable' && target !== 'part-cost-editable' && target !== 'part-name-editable' ) {
          console.log('Not an editable div(', event, '), testing part')
          this.testEditedPartDesign(index)
        } else {
          console.log('Target is an editable div, passing')
        }
      } else {
        this.enterPressed = false
      }
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
        console.log('No change detected for this part update')
        this.changeEditableIndex(null);
      }
    },
    testEditedPartBOM(index) {
      // test if bom (qty or ref) has changed -> update the bom record
      let testPart = this.parts[index]
      if (testPart.quantity != this.selectedPart.quantity || testPart.ref_slug != this.selectedPart.ref_slug) {
        console.log('Bom change detected in update part')

        this.bom.data[index] =  {
          design_id: testPart.design_id,
          ref_slug: testPart.ref_slug,
          ref_type: testPart.ref_type,
          config_slug: testPart.config_slug,
          quantity: testPart.quantity
        }

        console.log('About to call update bom with update part replaced by index')
        console.log(this.bom)

        let action = `changed qty of ${testPart.design_name} to ${testPart.quantity} in BOM`
        let message = null
        this.updateBOM(action, message).then(success => {
          console.log('Updated BOM record after editing an existing part')
          this.changeEditableIndex(null)
          this.editedPartUpdated = true
          this.testEditedPartSpecs(index)
        }, error => {

        })
      } else {
        console.log('No change to BOM in edited part, testing specs')
        this.testEditedPartSpecs(index)
      }
    },
    testEditedPartSpecs(index) {
      // test if specs (cost) have changed -> updae the specs record
      let testPart = this.parts[index]
      if (testPart.cost != testPart.specs.data.suppliers[0].partSchedules[0].unitCost) {
        console.log('Specs changed detected in update part')

        testPart.specs.data.suppliers[0].partSchedules[0].unitCost = testPart.cost
        this.updateSpecs(index).then(success => {
          console.log('Updated Specs record after editing an existing part')
          let breadcrumb = this.trail[this.trail.length - 1]

          let bom_payload = {
            design_id: breadcrumb.design_id,
            config_slug: breadcrumb.config_slug,
            ref_slug: breadcrumb.ref_slug,
            ref_type: breadcrumb.ref_type
          }
          this.getParts(bom_payload)
          this.editedPartUpdated = true
          this.changeEditableIndex(null)
        }, error => {})
      } else {
        if (this.editedPartUpdated = false) {
            console.log('ALERT --- when testing the update for this part, the objects are not equal but no specific change was detected...')
        } else {
          console.log('No change to specs in edited part')
          console.log('Completing part update, un update actually occurred :-)')
          // let design_payload = { design_slug: this.$route.params.design_slug }
          // this.$store.dispatch('getDesign', design_payload)
        }
        this.changeEditableIndex(null)
      }
    },

    updateDesign(index) {
      let updatedPart = this.parts[index]

      let payload = {
        name: updatedPart.design_name,
        creator: updatedPart.design_creator,
      }
      this.$http.put('designs/' + updatedPart.design_slug + '/', payload).then(response => {
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
    updateBOM(action, message, import_id, import_step) {
      return new Promise((resolve, reject) => {
        let payload = {
          editor: this.profile.id,
          data: this.bom.data
        }
        this.$http.put('boms/' + this.bom.id +'/?ref=' + this.$route.params.config_slug + '&action=' + action + '&message=' + message + '&import_id=' + import_id + '&import_step=' + import_step,
        payload).then(success => {
          console.log('BOM updated')
          console.log(success)
          this.bom = success.data
          let design_payload = { design_slug: this.design.slug }
          this.$store.dispatch('getDesign', design_payload).then(success => {
            console.log('Got updated Design after updating BOM')
          }, error => {
            console.log('Error getting updating design after adding part to BOM')
          })
          resolve(success)
        }, error => {
          console.log('Error updating BOM when adding new part')
          console.log(error)
          reject(error)
        })
      })
    },
    updateSpecs(index) {
      return new Promise((resolve, reject) => {
        let updated_part = this.parts[index]
        let payload = {
          editor: this.profile.id,
          data: updated_part.specs.data
        }
        let action = `updated cost for ${updated_part.design_name}`
        let message = null
        this.$http.put('specs/' + updated_part.specs.id + '/?ref=' + updated_part.ref_slug +
        '&action=' + action + '&message=' + message, payload).then(success => {
          console.log('Specs updated')
          console.log(success)
          let design_payload = { design_slug: this.design.slug }
          this.$store.dispatch('getDesign', design_payload).then(success => {
            console.log('Got updated Design after updating Specs')
          }, error => {
            console.log('Error getting updating design after updating Specs')
          })
          resolve(success)
        }, error => {
          console.log('Error updating specs')
          console.log(error)
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
        this.$nextTick(() => {
          this.bom.data.splice(index, 1)
          this.$nextTick(() => {
            let action = `removed ${removed_part.design_name} from BOM`
            let message = null
            let import_id = removed_part.design_id
            let import_step = -1
            this.updateBOM(action, message, import_id, import_step)
            console.log('Existing part has been removed from the BOM')
            // if last part in an assembly, remove the assembly from the bom
          })
        })
      }
    },
    tabOver() {
      console.log('In tabover function')
      let partName = $('#part-name-editable').parent().parent().next().next().children()
      $('#part-name-editable').parent().parent().next().next().children().focus()
      console.log('Part name is: ' + partName)
    },
    tabDown() {
      console.log('In tabdown function')
      let partName = $('#part-name-editable').parent().parent().next().next().children()
      $('#part-name-editable').parent().parent().next().next().children().focus()
      console.log('Part name is: ' + partName)
    },

    indentBom() {
      // client side
      // basically a tree view
      // this is really just a rendering quesiton once you have the full BOM
      // easiest would be to display it as an ordered list
      // there are some packages for making this collapsible

    },
    flattenBom() {
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
    showAllSpecs() {
      // takes all properties from specs and correlate for each part
      // all should be editable as well
    },
  },
  created() {
    // on back from another design this will get the old BOM, since that is still the data context
    // design.vue will clear itself on created but not on, back (updated)
    // have to detect in the design if the route params do not match the store params, if so then clear and get new context
    if (this.designRefs.ref) {
      console.log('Parts.vue created, design data already loaded, getting bom')
      let bom_payload = {
        design_id: this.design.id,
        config_slug: this.designRefs.config,
        ref_slug: this.designRefs.ref,
        ref_type: this.designRefs.ref_type
      }
      console.log('getParts has been called in part.vue created')
      this.getBom().then(success => {
        this.getParts(bom_payload)
      }, error => {})

    } else {
      console.log('Parts.vue created, no design data present, waiting on watcher')
    }
  },
  mounted() {
    $('.ui.dropdown.part').dropdown(
      { 'silent': true }
    )
  },
  updated() {
    $('.modal:not(:first)').remove()
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
