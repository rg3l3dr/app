<template lang="html">
  <div>
    <div></div>
    <div class="ui top attached grey header">
      TECHNICAL SPECIFICATIONS &#8212; Document properties of your design or part
    </div>
    <div class="ui bottom attached segment">
      <transition name='fade'>
        <span v-if='specs.data.updated'>
          <form class="ui form">
            <h3 class="ui dividing header">Basic Data</h3>
            <div class="two fields">
              <div class="eleven wide field" id='design-class'>
                <label>Part Class</label>
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
                    Choose a part class
                  </div>
                  <div class="menu">
                      <div
                        v-for='designClass in designClasses'
                        class="item"
                        :data-value='designClass.id'
                        @click.prevent='specs.data.classId = designClass.id'
                        >
                        {{ designClass.code }} : {{ designClass.name }}
                        <span v-if='designClass.description'>
                          -- {{ designClass.description }}
                        </span>
                      </div>
                  </div>
                </div>
              </div>
              <div class="five wide field" id='part-number'>
                <label>Part Number</label>
                <div class="ui left icon input">
                  <i class="hashtag icon"></i>
                  <input
                    type="text"
                    placeholder='Enter the part number'
                    v-model='specs.data.number'
                    @keydown.enter.prevent
                    @keyup.enter.prevent
                  >
                </div>
              </div>
            </div>

            <div class="two fields">
              <div class=" eleven wide field" id='part-description'>
                <label>Part Description</label>
                <div class="ui left icon input">
                  <i class="file text outline icon"></i>
                  <input
                    type="text"
                    placeholder='Add a short description'
                    v-model='specs.data.description'
                    @keydown.enter.prevent='createSupplier'
                    @keyup.enter.prevent
                  >
                </div>
              </div>
              <div class="five wide field" id='part-image-empty'>
                <label>Part Image</label>
                <div class="ui left icon input">
                  <i class="image icon"></i>
                  <label for="file-upload" class="custom-file-upload" v-if='specs.data.images.length==0'>
                      Choose a part image
                  </label>

                  <label for="file-upload" class="update-file-upload" v-else>
                      {{ specs.data.images[0].name }}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    id='file-upload'
                    @click='getToken'
                    @change='uploadImage($event)'
                    style='display:none'
                  >
                </div>
              </div>
              <!-- <div class="five wide field" id='part-image-uploaded' v-else>
                <input
                  type="file"
                  accept="image/*"
                  id='upload-file-input'
                  @click='getToken'
                  @change='uploadImage($event)'
                  style="display:none"
                >
                <span v-if='specs.data.images.length == 0'>
                  <label for='add-image-btn'>&nbsp</label>
                  <button
                    class="ui basic blue button"
                    id='add-image-btn'
                    @click.prevent='selectFilesForUpload'
                  >
                    Add an Image
                  </button>
                </span>
                <span v-else>
                  <a :href="specs.data.images[0].url"></a>
                  {{ specs.data.images[0].name }}
                </span>

              </div> -->
            </div>

            <h3 class="ui dividing header">Supplier Data</h3>
            <transition-group name='fade'>
              <div v-for='(supplier, supplierIndex) in specs.data.suppliers' :key='supplier'>
                <div class="five fields">
                  <div class="four wide field" id='part-manufacturer-name'>
                    <label>Manufacturer</label>
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
                        Select or Add a Manufacturer
                      </div>
                      <div class="menu">
                          <div
                            v-for='supplier in suppliers'
                            class="item"
                            :data-value='supplier.id'
                            @click='specs.data.suppliers[supplierIndex].supplierId = supplier.id'
                            >
                            {{ supplier.name }}
                          </div>
                      </div>
                    </div>
                  </div>
                  <div class="four wide field" id='part-manufacturuer-part-number'>
                    <label>Manufacturer Part Number</label>
                    <div class="ui left icon input">
                      <i class="hashtag icon"></i>
                      <input
                        type="text"
                        id='part-manufacturer-part-number-input'
                        placeholder='Add manufacturer part number'
                        v-model='supplier.partNumber'
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
                        placeholder='Add a link to part page'
                        v-model='supplier.externalUrl'
                        @keydown.enter.prevent
                        @keyup.enter.prevent
                      >
                    </div>
                  </div>
                  <div class="one wide field" id='spacer'></div>
                  <div class="two wide field" id='actions'>
                    <label>&nbsp</label>
                    <span v-if='$route.params.rev_slug=="latest"'>
                      <div class="ui left action input" v-if='supplierIndex == 0'>
                        <button
                          class="ui primary basic icon button"
                          @click.prevent='addSupplier'
                        >
                          Add Another Supplier
                        </button>
                        <input type="hidden">
                      </div>
                      <div class="ui left action input" v-else>
                        <button
                          class="ui secondary basic icon button"
                          @click.prevent='removeSupplier(supplierIndex)'
                        >
                           Remove this Supplier
                        </button>
                        <input type="hidden">
                      </div>
                    </span>
                  </div>
                </div>
                <transition-group name='fade'>
                  <div v-for='(schedule, scheduleIndex) in supplier.partSchedules' :key='schedule'>
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
                            placeholder='Add a lead time'
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
                        <span v-if='$route.params.rev_slug=="latest"'>
                          <div class="ui left action input" v-if='scheduleIndex == 0'>
                            <button
                              class="ui primary basic icon button"
                              @click.prevent='addSchedule(supplierIndex)'
                            >
                              Add Another Schedule
                            </button>
                            <input type="hidden">
                          </div>
                          <div class="ui left action input" v-else>
                            <button
                              class="ui secondary basic icon button"
                              @click.prevent='removeSchedule(supplierIndex, scheduleIndex)'
                            >
                               Remove this Schedule
                            </button>
                            <input type="hidden">
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                </transition-group>

                <div
                  v-if='supplierIndex != (specs.data.suppliers.length - 1)'
                  class="ui dividing header"
                  style='margin-bottom: 15px'
                ></div>
              </div>
            </transition-group>


            <h3 class="ui dividing header">Custom Data</h3>
            <transition-group name='fade'>
              <div v-for='(customSpec, specIndex) in specs.data.customSpecs' :key="customSpec" >
                <div class="five fields">
                  <div class="three wide field" id='specification-name'>
                    <label>Specification Name</label>
                    <div class="ui left icon input">
                      <i class="tag icon"></i>
                      <input
                        type="text"
                        placeholder='Add a name'
                        v-model='customSpec.name'
                        @keydown.enter.prevent
                        @keyup.enter.prevent
                        >
                    </div>
                  </div>
                  <div class="three wide field" id='specification-type'>
                    <label>Specification Type</label>
                    <select class="ui dropdown customValue" v-model='customSpec.dataType'>
                      <option disabled value=""> <i class="database icon"></i> Choose data type</option>
                      <option v-for='dataType in dataTypes' :value='dataType'> {{ dataType }} </option>
                    </select>
                  </div>
                  <div class="three wide field" id='specification-value'>
                    <label>Specification Value</label>
                    <div class="ui left icon input">
                      <i class="info icon"></i>
                      <input
                        type="text"
                        placeholder='Add a value'
                        v-model='customSpec.value'
                        @keydown.enter.prevent
                        @keyup.enter.prevent
                      >
                    </div>
                  </div>
                  <div class="three wide field" id='specification-unit'>
                    <label>Specification Unit of Measure</label>
                    <div class="ui left icon input">
                      <i class="balance scale icon"></i>
                      <input
                        type="text"
                        placeholder='Add a unit'
                        v-model='customSpec.units'
                        @keydown.enter.prevent
                        @keyup.enter.prevent
                      >
                    </div>
                  </div>
                  <div class="one wide field" id='spacer'></div>
                  <div class="three wide field" id='actions'>
                    <label>&nbsp</label>
                    <span v-if='$route.params.rev_slug=="latest"'>
                      <div class="ui left action input" v-if='specIndex == 0'>
                        <button
                          class="ui primary basic icon button"
                          @click.prevent='addCustomSpec'
                          @keydown.enter.prevent
                          @keyup.enter.prevent
                        >
                          Add Another Specification
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
                           Remove this Specification
                        </button>
                        <input type="hidden">
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </transition-group>
          </form>
          <span v-if='$route.params.rev_slug=="latest"'>
            <button
              v-if='!specsUpdated'
              class="ui blue basic button"
              @click='dispatchUpdateSpecs'
            >
              Update Specs
            </button>
            <button
              v-if='specsUpdated'
              class="ui blue basic button"
              @click='dispatchUpdateSpecs'
            >
              Specs Updated
            </button>
            <br>
          </span>
        </span>
        <div style='text-align:center' v-else-if='$route.params.rev_slug=="latest"' @click='showSpecs'>
          <br>
          <h2 class="ui icon header" >
            <i class="list icon"></i>
            <br>
            <div class="content">
              Click here to add technical specs
              <div class="sub header">
                <br>
                <a href="http://help.omnibuilds.com#specs-describe-designs" style='font-size:18px'>
                  How do specs work?
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
              Change rev back to latest to add specs
              <div class="sub header">
                <br>
                You have not added any specs yet<br>
                Your project is read only when rev is not latest
              </div>
            </div>
          </h2>
        </div>
      </transition>



    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
export default {
  name: 'newspecs',
  data () {
    return {
      designClasses: null,
      suppliers: [],
      dataTypes: [ 'Text', 'Number', 'True/False'],
      newSupplierName: null,
      specsUpdated: false

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
    designRefs() {
      console.log('designRefs watcher has been called in newspecs.vue')
      this.awaitDropDowns()
    }
  },
  methods: {
    getToken() {
      this.$http.get('get_token').then(success => {
        console.log('Got token')
        let values = success.body
        AWS.config.update({
          region: 'us-west-2',
          accessKeyId: values.value_1,
          secretAccessKey: values.value_2,
          sessionToken: values.value_3
        })
        values = null
      }, error => {
        console.log('Error getting token')
      })
    },
    showSpecs() {
      this.specs.data.updated = true
      this.$nextTick(() => {
        this.setDropDowns()
        $('.ui.dropdown.classes').dropdown({
          'silent': true,
          'fullTextSearch': 'exact'
        })
      })
    },
    awaitDropDowns() {
      let p1 = this.dispatchGetSpecs()
      let p2 = this.getDesignClasses()
      let p3 = this.getSuppliers()

      Promise.all([p1, p2, p3]).then(() => {
        console.log('All promises resolved')
        this.setDropDowns()
      });
    },
    setDropDowns() {
      $('.ui.dropdown.customValue').dropdown({'silent': true})
      $('.ui.dropdown.period').dropdown({'silent': true})

      let currentDesignClass = this.designClasses.filter(designClass => {
        return designClass.id == this.specs.data.classId
      })[0]
      if (currentDesignClass) {
        $('#part-class').dropdown('set text', `${currentDesignClass.code}: ${currentDesignClass.name}`)
        $('#part-class').dropdown('set selected', this.specs.data.classId)
      }
      let index = 0
      for(let currentSupplier of this.specs.data.suppliers) {
        $(`#supplier-name-${index}`).dropdown({'silent': true})
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
    dispatchGetSpecs() {
      return new Promise((resolve, reject) => {
        let payload = {
          id: this.design.specs.id,
          config_slug: this.designRefs.config,
          ref: this.designRefs.ref,
          ref_type: this.designRefs.ref_type
        }
        this.$store.dispatch('getSpecs', payload).then(success => {
          resolve()
        }, error => {
          reject()
        })
      })
    },
    dispatchUpdateSpecs() {
      return new Promise((resolve, reject) => {

        let action = 'Updated specs'
        let message = null

        let payload = {
          params: this.specs.id + '/?ref=' +
                  this.$route.params.config_slug +
                  '&action=' + action +
                  '&message=' + message,
          data: {
            editor: this.profile.id,
            data: this.specs.data
          }
        }
        console.log(this.specs.data)
        this.$store.dispatch('updateSpecs', payload).then(success => {
          // this.$router.push( this.designRefs.design_path + '/specs')
          let design_payload = { design_slug: this.$route.params.design_slug }
          this.$store.dispatch('getDesign', design_payload).then(success => {
            console.log('Got updated Design after adding updating Specs')
          }, error => {
            console.log('Error getting updating design after adding part to Specs')
          })
          this.setDropDowns()
          this.specsUpdated = true
          console.log('Reloaded the page')
          resolve()
          // location.reload()
        }, error => {
          reject()
        })
      })
    },
    getDesignClasses() {
      return new Promise((resolve, reject) => {
        this.$http.get('designclasses/?ordering=code').then(success => {
          console.log('Got design classes')
          console.log(success)
          this.designClasses = success.data.results
          $('.ui.dropdown.classes').dropdown({
            'silent': true,
            'fullTextSearch': 'exact'
          })
          resolve()
        }, error => {
          console.log('Error getting design classes')
          console.log(error)
          reject()
        })
      })
    },
    getSuppliers() {
      return new Promise((resolve, reject) => {
        this.$http.get('suppliers/').then(success => {
          console.log('Got suppliers')
          console.log(success)
          this.suppliers = success.body.results
          $('.ui.dropdown.suppliers').dropdown({
            'allowAdditions': true,
            'hideAdditions': false,
            'fullTextSearch': 'exact'
          })
          resolve()
        }, error => {
          console.log('Error gettings suppliers')
          console.log(error)
          reject()
        })
      })
    },
    selectFilesForUpload() {
      // click the hidden files input button
      let fileElem = document.getElementById("upload-file-input")
      fileElem.click()
    },
    uploadImage($event) {
      let filesInput = event.target.files
      let file = filesInput[0]
      let reader = new FileReader()
      var array_buffer
      let vue = this
      reader.onloadend = function () {
        array_buffer = reader.result
        let s3 = new AWS.S3()
        let s3_path = 'https://s3-us-west-2.amazonaws.com/omni-stage-designs/'
        let s3_key = 'designs/' + vue.design.creator + '/' + vue.design.id + '/' + file.name
        let params = {
          Body: array_buffer,
          Bucket: "omni-stage-designs",
          Key: s3_key
         }
         s3.putObject(params, function(err, data) {
           if (err) {
             console.log(err, err.stack); // an error occurred
           } else {
             console.log(data)

             let image = {
                 name: file.name,
                 type: file.type,
                 size: file.size,
                 url: s3_path + s3_key
               }
              if (vue.specs.data.images.length == 0) {
                vue.specs.data.images.push(image)
              } else{
                vue.specs.data.images.pop()
                vue.specs.data.images.push(image)
              }
             // give feedback to the user ???
             // show the file has been uploaded
           }
        })
      }
      reader.readAsArrayBuffer(file)
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
        console.log('Supplier already exists')
        this.specs.data.suppliers[index].supplierId = existingSupplier.id

        setTimeout(function() {
          $(`#${supplierClass}`).dropdown('set text', existingSupplier.name)
          $(`#${supplierClass}`).dropdown('set selected', existingSupplier.id)
          $(`#${supplierClass}`).click()
        }, 1000)

      }  else {
        let payload = {
          creator: this.profile.id,
          name: event.target.value
        }
        this.$http.post('suppliers/', payload).then(success => {
          console.log('New supplier created')
          console.log(success)
          this.suppliers.push(success.data)
          let newSupplier = success.data

          this.specs.data.suppliers[index].supplierId = newSupplier.id
          setTimeout(function() {
            $(`#${supplierClass}`).dropdown('set text', newSupplier.name)
            $(`#${supplierClass}`).dropdown('set selected', newSupplier.id)
            $(`#${supplierClass}`).click()
          }, 500)
        }, error => {
          console.log('Error creating new supplier')
          console.log(error)
        })
      }
    },
    addSupplier() {
      let newSupplier = {
        supplierId: null,
        partNumber: null,
        partSchedules: [
          {
            unitCost: 0,
            minOrderQty: 1,
            leadTime: 1,
            leadTimePeriod: 'Days',
            externalUrl: null
          }
        ]
      }

      this.specs.data.suppliers.push(newSupplier)

      this.$nextTick(() => {
        $('.ui.dropdown.suppliers').dropdown({
            'allowAdditions': true,
            'hideAdditions': false,
            'fullTextSearch': 'exact'
          })
      })
    },
    removeSupplier(supplierIndex) {
      this.specs.data.suppliers.splice(supplierIndex, 1)
    },
    addSchedule(supplierIndex) {
      let newSchedule = {
        unitCost: 0,
        minOrderQty: 1,
        leadTime: 1,
        leadTimePeriod: 'Days',
        externalUrl: null
      }
      let selectedSupplier = this.specs.data.suppliers[supplierIndex]
      selectedSupplier.partSchedules.push(newSchedule)
      this.$nextTick(() => {
        $('.ui.dropdown.period').dropdown({'silent': true})
      })

    },
    removeSchedule(supplierIndex, scheduleIndex) {
      let selectedSupplier = this.specs.data.suppliers[supplierIndex]
      selectedSupplier.partSchedules.splice(scheduleIndex, 1)
    },
    addCustomSpec() {
      let newSpec = {
        name: null,
        typeId: null,
        value: null,
        unit: null
      }

      this.specs.data.customSpecs.push(newSpec)
      this.$nextTick(() => {
        $('.ui.dropdown.customValue').dropdown({'silent': true})
      })
    },
    removeCustomSpec(specIndex) {
      this.specs.data.customSpecs.splice(specIndex, 1)
    },
  },
  created() {
    if (this.designRefs.ref) {
      console.log('NewSpecs.vue created, design data already loaded, getting specs')
      this.awaitDropDowns()
    } else {
      console.log('NewSpecs.vue created, no design data present, waiting on watcher')
    }
  },
  mounted() {
    $('.ui.dropdown.customValue').dropdown({'silent': true})
    $('.ui.dropdown.period').dropdown({'silent': true})
    $('.ui.dropdown.suppliers').dropdown({'silent': true})
    // $('.ui.dropdown.suppliers').dropdown({'silent': true})
    // $('.ui.dropdown.classes').dropdown({'silent': true})
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
