<template lang="html">
  <div>
    <div></div>
    <div class="ui top attached grey header">
      TECHNICAL SPECIFICATIONS &#8212; Document properties of your design
    </div>
    <div class="ui bottom attached segment">
      <transition name='fade'>
        <span>
          <form class="ui form">
            <h3 class="ui dividing header">Basic Data</h3>
            <div class="one field">
              <div class="sixteen wide field" id='design-class'>
                <label>Design Class</label>
                <div
                  class="ui fluid search selection dropdown classes"
                  @keydown.enter.prevent
                  @keyup.enter.prevent
                  id='part-class'
                >
                  <input
                    type="hidden"
                    name="class"
                  >
                  <i class="dropdown icon"></i>
                  <div class="default text">
                    <i class="setting icon"></i>
                    Choose a design class
                  </div>
                  <div class="menu">
                      <div
                        v-for='designClass in designClasses'
                        class="item"
                        :data-value='designClass.id'
                        @click.prevent='design.data["designClass"] = designClass.id'
                        >
                        {{ designClass.code }} : {{ designClass.name }}
                        <span v-if='designClass.description'>
                          -- {{ designClass.description }}
                        </span>
                      </div>
                  </div>
                </div>
              </div>

            </div>

            <div class="two fields">
              <div class=" eleven wide field" id='part-description'>
                <label>Short Description</label>
                <div class="ui left icon input">
                  <i class="file text outline icon"></i>
                  <input
                    type="text"
                    placeholder='Add a short description'
                    v-model='design.data.summary'
                    @keydown.enter.prevent='createSupplier'
                    @keyup.enter.prevent
                  >
                </div>
              </div>
              <div class="five wide field" id='part-number'>
                <label>Internal Part Number</label>
                <div class="ui left icon input">
                  <i class="hashtag icon"></i>
                  <input
                    type="text"
                    placeholder='Enter the part number'
                    v-model='design.data["internalPartNumber"]'
                    @keydown.enter.prevent
                    @keyup.enter.prevent
                  >
                </div>
              </div>
            </div>

            <h3 class="ui dividing header">Supplier Data</h3>
            <transition-group name='fade'>
              <div v-for='(supplier, supplierIndex) in design.data.suppliers' :key='supplierIndex'>
                <div class="five fields">
                  <div class="four wide field" id='part-manufacturer-name'>
                    <label>Supplier</label>
                    <div
                      class="ui fluid search selection dropdown suppliers"
                      @keydown.enter.prevent='createSupplier($event)'
                      @keyup.enter.prevent
                      :id='`supplier-name-${supplierIndex}`'
                    >
                      <input
                        type="hidden"
                        name="manufacturer"
                      >
                      <i class="dropdown icon"></i>
                      <div class="default text">
                        <i class="industry icon"></i>
                        Select Supplier
                      </div>
                      <div class="menu">
                          <div
                            v-for='supplier in suppliers'
                            class="item"
                            :data-value='supplier.id'
                            @click='setSupplier(supplier.id, supplierIndex)'
                            >
                            {{ supplier.name }}
                          </div>
                      </div>
                    </div>
                  </div>
                  <div class="four wide field" id='part-manufacturuer-part-number'>
                    <label>Supplier Part Number</label>
                    <div class="ui left icon input">
                      <i class="hashtag icon"></i>
                      <input
                        type="text"
                        id='part-manufacturer-part-number-input'
                        placeholder='Add part number'
                        v-model='supplier.supplierPartNumber'
                        @keydown.enter.prevent
                        @keyup.enter.prevent
                      >
                    </div>
                  </div>
                  <div class="four wide field" id='part-link'>
                    <label>Part Website</label>
                    <div class="ui left icon input">
                      <i class="linkify icon"></i>
                      <input
                        type="url"
                        placeholder='Add a link'
                        v-model='supplier.externalUrl'
                        @keydown.enter.prevent
                        @keyup.enter.prevent
                      >
                    </div>
                  </div>
                  <div class="one wide field" id='spacer'></div>
                  <div class="two wide field" id='actions'>
                    <label>&nbsp</label>
                    <span v-if='$route.params.revision_slug=="latest"'>
                      <div class="ui left action input" v-if='supplierIndex == 0'>
                        <button
                          class="ui primary basic icon button"
                          @click.prevent='addSupplier'
                        >
                          Add Supplier
                        </button>
                        <input type="hidden">
                      </div>
                      <div class="ui left action input" v-else>
                        <button
                          class="ui secondary basic icon button"
                          @click.prevent='removeSupplier(supplierIndex)'
                        >
                           Remove
                        </button>
                        <input type="hidden">
                      </div>
                    </span>
                  </div>
                </div>
                <transition-group name='fade'>
                  <div v-for='(schedule, scheduleIndex) in supplier.schedules' :key='scheduleIndex'>
                    <div class="five fields">
                      <div class="four wide field" id='part-cost'>
                        <label>Part Unit Cost</label>
                        <div class="ui left icon input">
                          <i class="dollar icon"></i>
                          <input
                            type="number"
                            v-model='schedule.unitCost'
                            placeholder='Add part cost'
                            min="0.00"
                            step="0.01"
                            @keydown.enter.prevent
                            @keyup.enter.prevent
                          >
                        </div>
                      </div>
                      <div class="four wide field" id='part-moq'>
                        <label>Part Min Order Qty</label>
                        <div class="ui left icon input">
                          <i class="cubes icon"></i>
                          <input
                            type="number"
                            v-model='schedule.minOrderQty'
                            placeholder='Add part MOQ'
                            min="1"
                            step="1"
                            @keydown.enter.prevent
                            @keyup.enter.prevent
                          >
                        </div>
                      </div>
                      <div class="four wide field" id='part-lead-time'>
                        <label>Part Lead Time</label>
                        <div class="ui right action left icon input">
                          <i class="calendar icon"></i>
                          <input
                            type="number"
                            v-model='schedule.leadTime'
                            placeholder='Add lead time'
                            min='1'
                            step='1'
                            @keydown.enter.prevent
                            @keyup.enter.prevent
                          >
                          <div class="ui basic floating dropdown button period">
                            <div class="text">{{ schedule.leadTimePeriod }}</div>
                            <i class="dropdown icon"></i>
                            <div class="menu">
                              <div
                                class="item"
                                @click='schedule.leadTimePeriod="Days"'
                                @keydown.enter='schedule.leadTimePeriod="Days"'
                                @keyup.enter='schedule.leadTimePeriod="Days"'
                              >
                                Days
                              </div>
                              <div
                                class="item"
                                @click='schedule.leadTimePeriod="Weeks"'
                                @keydown.enter='schedule.leadTimePeriod="Weeks"'
                                @keyup.enter='schedule.leadTimePeriod="Days"'
                              >
                                Weeks
                            </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="one wide field" id='spacer'></div>
                      <div class="two wide field" id='actions'>
                        <label>&nbsp</label>
                        <span v-if='$route.params.revision_slug=="latest"'>
                          <div class="ui left action input" v-if='scheduleIndex == 0'>
                            <button
                              class="ui primary basic icon button"
                              @click.prevent='addSchedule(supplierIndex)'
                            >
                              Add Schedule
                            </button>
                            <input type="hidden">
                          </div>
                          <div class="ui left action input" v-else>
                            <button
                              class="ui secondary basic icon button"
                              @click.prevent='removeSchedule(supplierIndex, scheduleIndex)'
                            >
                               Remove
                            </button>
                            <input type="hidden">
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                </transition-group>

                <div
                  v-if='supplierIndex != (design.data.suppliers.length - 1)'
                  class="ui dividing header"
                  style='margin-bottom: 15px'
                ></div>
              </div>
            </transition-group>


            <h3 class="ui dividing header">Custom Data</h3>
            <transition-group name='fade'>
              <div v-for='(spec, specIndex) in design.data.specs' :key="specIndex" >
                <div class="four fields">
                  <div class="four wide field" id='specification-name'>
                    <label>Specification Name</label>
                    <div class="ui left icon input">
                      <i class="tag icon"></i>
                      <input
                        type="text"
                        placeholder='Add a name'
                        v-model='spec.name'
                        @keydown.enter.prevent
                        @keyup.enter.prevent
                        >
                    </div>
                  </div>
                  <!-- <div class="three wide field" id='specification-type'>
                    <label>Specification Type</label>
                    <select class="ui dropdown customValue" v-model='spec.dataType'>
                      <option disabled value=""> <i class="database icon"></i> Choose type</option>
                      <option v-for='dataType in dataTypes' :value='dataType'> {{ dataType }} </option>
                    </select>
                  </div> -->
                  <div class="four wide field" id='specification-value'>
                    <label>Specification Value</label>
                    <div class="ui left icon input">
                      <i class="info icon"></i>
                      <input
                        type="text"
                        placeholder='Add a value'
                        v-model='spec.value'
                        @keydown.enter.prevent
                        @keyup.enter.prevent
                      >
                    </div>
                  </div>
                  <div class="four wide field" id='specification-unit'>
                    <label>Specification Units</label>
                    <div class="ui left icon input">
                      <i class="balance scale icon"></i>
                      <input
                        type="text"
                        placeholder='Add a unit'
                        v-model='spec.units'
                        @keydown.enter.prevent
                        @keyup.enter.prevent
                      >
                    </div>
                  </div>
                  <div class="one wide field" id='spacer'></div>
                  <div class="three wide field" id='actions'>
                    <label>&nbsp</label>
                    <span v-if='$route.params.revision_slug=="latest"'>
                      <div class="ui left action input" v-if='specIndex == 0'>
                        <button
                          class="ui primary basic icon button"
                          @click.prevent='addCustomSpec'
                          @keydown.enter.prevent
                          @keyup.enter.prevent
                        >
                          Add Spec
                        </button>
                        <input type="hidden">
                      </div>
                      <div class="ui left action input" v-else>
                        <button
                          class="ui secondary basic icon button"
                          @click.prevent='removeCustomSpec(specIndex)'
                          @keydown.enter.prevent
                          @keyup.enter.prevent
                        >
                           Remove
                        </button>
                        <input type="hidden">
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </transition-group>
          </form>
          <span v-if='$route.params.revision_slug=="latest"'>
            <button
              v-if='!specsUpdated'
              class="ui blue basic button"
              @click='updateSpecs()'
            >
              Update All Specs
            </button>
            <button
              v-if='specsUpdated'
              class="ui blue basic button"
              @click='updateSpecs()'
            >
              Specs Updated
            </button>
            <br>
          </span>
        </span>
      </transition>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'
export default {
  name: 'newspecs',
  data () {
    return {
      designClasses: null,
      suppliers: [],
      dataTypes: [ 'Text', 'Number', 'True/False'],
      newSupplierName: null,
      specsUpdated: false,
    }
  },
  computed: {
    ...mapState([
      'env',
      'bucket',
      'session',
      'profile',
      'design'
    ])
  },
  watch: {
  },
  methods: {
    getDesignClasses() {
      return new Promise((resolve, reject) => {
        this.$http.get('designclasses/?ordering=code').then(success => {
          if (this.env != 'prod') {
            console.log('Got design classes')
            console.log(success)
          }

          this.designClasses = success.data.results
          $('.ui.dropdown.classes').dropdown({
            'silent': true,
            'fullTextSearch': 'exact'
          })
          resolve()
        }, error => {
          if (this.env != 'prod') {
            console.log('Error getting design classes')
            console.log(error)
          }
          reject()
        })
      })
    },
    getSuppliers() {
      return new Promise((resolve, reject) => {
        this.$http.get('suppliers/').then(success => {
          if (this.env != 'prod') {
            console.log('Got suppliers')
            console.log(success)
          }
          this.suppliers = success.body.results
          $('.ui.dropdown.suppliers').dropdown({
            'allowAdditions': true,
            'hideAdditions': false,
            'fullTextSearch': 'exact'
          })
          resolve()
        }, error => {
          if (this.env != 'prod') {
            console.log('Error gettings suppliers')
            console.log(error)
          }
          reject()
        })
      })
    },
    awaitDropDowns() {
      // let p1 = this.dispatchGetSpecs()
      let p2 = this.getDesignClasses()
      let p3 = this.getSuppliers()

      Promise.all([p2, p3]).then(() => {
        if (this.env != 'prod') {
          console.log('All promises resolved')
        }
        this.setDropDowns()
      });
    },
    setDropDowns() {
      $('.ui.dropdown.customValue').dropdown({'silent': true})
      $('.ui.dropdown.period').dropdown({'silent': true})

      let currentDesignClass = this.designClasses.filter(designClass => {
        return designClass.id == this.design.data.designClass
      })[0]
      if (currentDesignClass) {
        $('#part-class').dropdown('set text', `${currentDesignClass.code}: ${currentDesignClass.name}`)
        $('#part-class').dropdown('set selected', this.design.data.designClass)
      }
      let index = 0
      for(let currentSupplier of this.design.data.suppliers) {
        $(`#supplier-name-${index}`).dropdown(
          {
            'silent': true,
            'message': {
              addResult     : 'Add <b>{term}</b>',
              count         : '{count} selected',
              maxSelections : 'Max {maxCount} selections',
              noResults     : 'Press enter to create supplier.'
            }
          }

        )
        let supplierRecord = this.suppliers.filter(supplier => {
          return supplier.id == currentSupplier.supplierId
        })[0]
        if (supplierRecord) {

          $(`#supplier-name-${index}`).dropdown('set text', supplierRecord.name)
          $(`#supplier-name-${index}`).dropdown('set selected', supplierRecord.id)
        }
        index += 1
      }
    },
    createSupplier($event) {

      let supplierClass = $event.path[1].id
      let splits = supplierClass.split('-')
      let index = splits[2]
      let supplierName = event.target.value.trim().toLowerCase()
      let supplierNames = this.suppliers.map((supplier) => {return supplier.name.toLowerCase()})
      if (supplierNames.includes(supplierName)) {
        let existingSupplier = this.suppliers.filter(supplier => {
          return supplier.name.toLowerCase() == supplierName
        })[0]
        if (this.env != 'prod') {
          console.log('Supplier already exists')
        }
        this.design.data.suppliers[index].supplierId = existingSupplier.id

        setTimeout(function() {
          $(`#${supplierClass}`).dropdown('set text', existingSupplier.name)
          $(`#${supplierClass}`).dropdown('set selected', existingSupplier.id)
          $(`#${supplierClass}`).click()
        }, 1000)

      }  else {
        let payload = {
          creator: this.design.owner,
          name: event.target.value
        }
        this.$http.post('suppliers/', payload).then(success => {
          if (this.env != 'prod') {
            console.log('New supplier created')
            console.log(success)
          }
          this.suppliers.push(success.data)
          let newSupplier = success.data

          this.design.data.suppliers[index].supplierId = newSupplier.id
          setTimeout(function() {
            $(`#${supplierClass}`).dropdown('set text', newSupplier.name)
            $(`#${supplierClass}`).dropdown('set selected', newSupplier.id)
            $(`#${supplierClass}`).click()
          }, 500)
        }, error => {
          if (this.env != 'prod') {
            console.log('Error creating new supplier')
            console.log(error)
          }
        })
      }
    },
    setSupplier(supplierId, supplierIndex) {
      this.design.data.suppliers[supplierIndex].supplierId = supplierId
    },
    addSupplier() {
      let newSupplier = {
        default: false,
        supplierId: null,
        supplierPartNumber: null,
        externalUrl: null,
        partSchedules: [
          {
            unitCost: 0,
            minOrderQty: 1,
            leadTime: 1,
            leadTimePeriod: 'Days',
            default: true
          }
        ]
      }

      this.design.data.suppliers.push(newSupplier)

      this.$nextTick(() => {
        $('.ui.dropdown.suppliers').dropdown({
            'allowAdditions': true,
            'hideAdditions': false,
            'fullTextSearch': 'exact'
          })
      })
    },
    removeSupplier(supplierIndex) {
      this.design.data.suppliers.splice(supplierIndex, 1)
    },
    addSchedule(supplierIndex) {
      let newSchedule = {
        unitCost: 0,
        minOrderQty: 1,
        leadTime: 1,
        leadTimePeriod: 'Days',
        default: false
      }
      let selectedSupplier = this.design.data.suppliers[supplierIndex]
      selectedSupplier.schedules.push(newSchedule)
      this.$nextTick(() => {
        $('.ui.dropdown.period').dropdown({'silent': true})
      })

    },
    removeSchedule(supplierIndex, scheduleIndex) {
      let selectedSupplier = this.design.data.suppliers[supplierIndex]
      selectedSupplier.schedules.splice(scheduleIndex, 1)
    },
    addCustomSpec() {
      let newSpec = {
        name: null,
        typeId: null,
        value: null,
        units: null
      }

      this.design.data.specs.push(newSpec)
      this.$nextTick(() => {
        $('.ui.dropdown.customValue').dropdown({'silent': true})
      })
    },
    removeCustomSpec(specIndex) {
      this.design.data.specs.splice(specIndex, 1)
    },
    updateSpecs() {
      let payload = {
        slug: this.design.slug,
        owner_slug: this.design.owner_slug,
        data: {
          data: this.design.data
        }
      }

      this.$store.dispatch('updateDesign', payload).then(success => {
        let payload = success.body
        this.$store.commit('setDesign', payload)
      }, error => {})
    },
  },
  created() {
    this.awaitDropDowns()
  },
  mounted() {
    // $('.ui.dropdown.customValue').dropdown({'silent': true})
    $('.ui.dropdown.period').dropdown({'silent': true})
    $('.ui.dropdown.suppliers').dropdown({'silent': true})
    $('.ui.dropdown.classes').dropdown({'silent': true})

    if (this.design.data.specs.length == 0) {
      this.addCustomSpec()
    }
  },
  updated() {}
}
</script>

<style lang="css">
  .custom-file-upload {
      border: 1px solid rgba(34,36,38,.15);
      color: rgba(0,0,0,.87);
      border-radius: .28571429rem;
      display: inline-block;
      padding: 9px 35px;
      cursor: pointer;
  }

  .update-file-upload {
      border: 1px solid rgba(34,36,38,.15);
      color: rgba(0,0,0,.87);
      border-radius: .28571429rem;
      display: inline-block;
      padding: 9px 35px;
      cursor: pointer;
  }

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
