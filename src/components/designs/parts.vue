<template lang="html">
  <div>
    <div></div>
    <div class="ui top attached grey header">
      BILL OF MATERIALS &#8212; Add parts and create nested assemblies
    </div>
    <div class="ui bottom attached segment">
      <transition name='fade'>
        <div class="ui grid" v-if='parts.length > 0 || trail.length != 1'>
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
                    <!-- <div v-if='index != 0' class="ui icon top left pointing mini basic dropdown button part">
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
                        <div class="item">
                          <i class="compress icon"></i>
                          Collapse Assembly
                        </div>
                        <div class="item">
                          <i class="level up icon"></i>
                          Move Up in BOM
                        </div>
                        <div v-if='$route.params.rev_slug == "latest"' class="item" @click='removePart(index)'>
                          <i class="trash icon"></i>
                          Remove from BOM
                        </div>
                      </div>
                    </div> -->
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <transition name='fade'>
        <table class="ui striped selectable table" id='bomTable' v-if='parts.length > 0 || trail.length != 1'>
          <thead>
            <tr>
              <th></th>
              <th>Part Name</th>
              <th>Part #</th>
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
              <td>Total</td>
              <td> $ {{ sumTotal.toFixed(2) }} </td>
            </tr>
          </tfoot>
          <tbody name='fade' is="transition-group">
            <tr v-for='(part, index) in parts' :key='part'>

              <!-- Part Type Icon & Modal Link -->
              <td>
                <a href="#" @click='showModal(index)'>
                  <i v-if='part.bom.data.length > 0' class="cubes icon"></i>
                  <i v-else-if='part.files.data.length > 0' class="fa-files-o icon"></i>
                  <i v-else class="fa-list-ul icon"></i>
                </a>
              </td>

              <td v-if='!part.meta.created && $route.params.rev_slug == "latest"'>
                  <div class="ui transparent search input" id='part-name-editable-div'>
                    <input
                      class="prompt"
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

              <td v-else-if='part.meta.created && part.meta.editable && $route.params.rev_slug == "latest" '>
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

              <td v-else id='part-name'>
                <span v-if='part.bom.data.length == 0'>
                  <router-link tag='a' to='' @click.native.prevent='showModal(index)'>
                    {{ part.design.name }}
                  </router-link>
                </span>
                <span v-else>
                  <router-link tag='a' to='' @click.native.prevent='openAssembly(index)'>
                    {{ part.design.name }}
                  </router-link>
                </span>
              </td>

              <!-- Last Change for Part -->
              <td>
                <div v-if='part.meta.created'>
                  {{ part.design.number }}
                </div>
              </td>

              <!-- Part Quantity -->
              <td
                v-if='!part.meta.created && $route.params.rev_slug == "latest"'
                class='ui transparent input'
              >
                <input
                  type="number"
                  min='1'
                  v-model='part.meta.quantity'
                  id='part-quantity-editable'
                  @keyup.enter='checkNewPartNameOnEnter(index, $event)'
                  @blur='newPartBlurTest(index, $event)'
                >
              </td>

              <td
                v-else-if='part.meta.created && part.meta.editable && $route.params.rev_slug == "latest"'
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
              <td v-if='!part.meta.created && $route.params.rev_slug == "latest"'>
                <div class="ui transparent input">
                  <input
                    type="number"
                    id='part-cost-editable'
                    min='0'
                    step='.01'
                    v-model='part.specs.data.suppliers[0].partSchedules[0].unitCost'
                    @keydown.enter='checkNewPartNameOnEnter(index, $event)'
                    @blur='newPartBlurTest(index, $event)'
                  >
                </div>
              </td>

              <td v-else-if='part.meta.created && part.meta.editable && $route.params.rev_slug == "latest"'>
                <div class="ui transparent input">
                  <input
                    id='part-cost-editable'
                    type="number"
                    min='0'
                    step='.01'
                    v-model='part.specs.data.suppliers[0].partSchedules[0].unitCost'
                    @keydown.enter='part.design.name ? testEditedPartDesign(index) : partNameError(index)'
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
                <span v-if='part.specs.data.suppliers[0].partSchedules[0].unitCost'>
                  $ {{ part.specs.data.suppliers[0].partSchedules[0].unitCost.toFixed(2) }}
                </span>
                <span v-else>
                  $ 0.00
                </span>
              </td>

              <!-- Part Total -->
              <td v-if='part.specs.data.suppliers[0].partSchedules[0].unitCost'>
                $ {{ (part.meta.quantity * part.specs.data.suppliers[0].partSchedules[0].unitCost).toFixed(2) }}
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
                  class="ui icon top left pointing mini basic dropdown button part"
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
                      v-if='$route.params.rev_slug == "latest"'
                      class="item"
                      @click='removePart(index)'
                    >
                      <i class="trash icon"></i>
                      Remove from BOM
                    </div>
                  </div>
                </div>
                <div class="ui icon top left pointing mini basic dropdown button part" v-else>
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
                    <!-- <div class="item" v-if='$route.params.rev_slug == "latest"'>
                      <i class="level up icon"></i>
                      Move Up in BOM
                    </div> -->
                    <div v-if='$route.params.rev_slug == "latest"' class="item" @click='openAssembly(index)'>
                      <i class="level down icon"></i>
                      Make Assembly
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
      <div class="ui modal" v-if='modalPart' style='width: 80em; margin: -24em -38em'>
        <div class="header" style='padding: 10px'>
          <div class="ui grid">
            <div class="five wide column" style='padding: 20px 0px 0px 20px'>
              <div
                class="ui large fluid transparent input"
                style='margin: -5px 0px 0px 0px; padding: 0px'
                :class='$route.params.rev_slug == "latest" ? null : "disabled"'
              >
                <input
                  type="text"
                  v-model='modalPart.design.name'
                  style='margin: -5px 0px 0px 0px'
                  @blur='editDesignNameInModal(modalIndex)'
                >
              </div>
              <div style='font-size:18px'>
                {{ modalPart.design.number }}
              </div>
              <!-- <div
                class="ui mini fluid transparent input"
                style='font-size: 15px'
                :class='$route.params.rev_slug == "latest" ? null : "disabled"'
              >
                <input
                  type="text"
                  placeholder='Add a short description'
                  v-model='modalPart.specs.data.description'
                  @blur='updateSpecs(modalIndex)'
                >
              </div> -->
            </div>
            <div class="four wide column">
              <div class="ui basic icon buttons">
                <button
                  class="ui button"
                  data-tooltip='Add an Image'
                  :class='$route.params.rev_slug == "latest" ? null : "disabled"'
                ><i class="image icon"></i></button>
                <button
                  class="ui button"
                  data-tooltip='Add Design Files'
                  :class='$route.params.rev_slug == "latest" ? null : "disabled"'
                ><i class="fa fa-paperclip"></i></button>
                <!-- <button class="ui button"><i class="clone icon"></i></button>
                <button class="ui button"><i class="plus square icon"></i></button>
                <button class="ui button"><i class="balance scales icon"></i></button> -->
                <div class="ui icon top left pointing dropdown button options">
                  <i class="fa fa-ellipsis-h"></i>
                  <div class="menu">
                    <div class="item" @click='viewModalPartHome'>
                      <i class="home icon"></i>
                      Visit homepage
                    </div>
                    <div class="item" :class='$route.params.rev_slug == "latest" ? null : "disabled"'>
                      <i class="level down icon"></i>
                      Make Assembly
                    </div>
                    <div class="item" :class='$route.params.rev_slug == "latest" ? null : "disabled"'>
                      <i class="level up icon"></i>
                      Move Up in BOM
                    </div>
                    <div class="item" :class='$route.params.rev_slug == "latest" ? null : "disabled"'>
                      <i class="trash icon"></i>
                      Remove from BOM
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="six wide column">
              <div
                class="ui basic labeled input"
                style='font-size: 13.5px'
                :class='$route.params.rev_slug == "latest" ? null : "disabled"'
              >
                <div class="ui label"> Quantity </div>
                <input
                  type="number"
                  v-model='modalPart.meta.quantity'
                  min='1'
                  step='1'
                  style='width: 75px'
                  @blur='editDesignBomInModal(modalIndex)'
                > &nbsp &nbsp
              </div>
              <div
                class="ui basic dropdown labeled icon button tracking"
                :class='$route.params.rev_slug == "latest" ? null : "disabled"'
              >
                <i class="crosshairs icon"></i>
                <span class="text">Current Ref</span>
                <div class="menu">
                  <div class="ui icon search input">
                    <i class="search icon"></i>
                    <input type="text" placeholder="Search configs and builds">
                  </div>
                  <div class="divider"></div>
                  <div class="header">
                    <i class="crosshairs icon"></i>
                    Tracking Point
                  </div>
                  <div class="scrolling menu">
                    <div
                      class="item"
                      v-for='config in modalPart.configs'
                      :data-value='config.slug'
                    >
                      <i class="fa-code-fork icon"></i>
                      {{ config.name }}
                    </div>
                    <div
                      class="item"
                      v-for='build in modalPart.builds'
                      v-if='build.name!="None"'
                      :data-value='build.slug'
                    >
                      <i class="tags icon"></i>
                      {{ build.name }}
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
        <div class="content" style='min-height: 40em'>
          <div class="ui grid">
            <div class="seven wide column">
              <div class="image content" id='image'>
                <div class="ui fluid image">
                  <img
                    v-if='modalPart.specs.data.images[0]' :src="modalPart.specs.data.images[0].url"
                  >
                  <img v-else src="https://semantic-ui.com/images/wireframe/image.png" >
                </div>
                <div id='thumbnails'>

                </div>
              </div>
            </div>
            <div class="nine wide column">
              <div class="ui top attached tabular menu">
                <a class="item active" data-tab='part-specs'>
                  <i class="unordered list icon"></i>
                  Specs
                </a>
                <a class="item" data-tab='part-bom'>
                  <i class="cubes icon"></i>
                  Parts
                </a>
                <a class="item" data-tab='part-files'>
                  <i class="fa-files-o icon"></i>
                  Files
                </a>
                <a class="item" data-tab='part-changes'>
                  <i class="history icon"></i>
                  Changes
                </a>
              </div>
              <div class="ui bottom attached active tab segment scrolling content" data-tab='part-specs' style='max-height: 33em'>
                <h4 class='ui horizontal divider header'>
                  <i class="fa fa-info"></i>
                  &nbsp
                  Basic Data
                </h4>
                <table class="ui small definition table">
                  <tbody>
                    <tr>
                      <td class='six wide column'>
                        <i class="setting icon"></i>
                        &nbsp
                        Part Class
                      </td>
                      <td> {{ modalPart.specs.data.className }} </td>
                    </tr>
                    <tr>
                      <td>
                        <i class="hashtag icon"></i>
                        &nbsp
                        Part Number
                      </td>
                      <td> {{ modalPart.specs.data.number }} </td>
                    </tr>

                  </tbody>
                </table>
                <h4 class='ui horizontal divider header'>
                  <i class="fa fa-industry"></i>
                  &nbsp
                  Supplier Data
                </h4>
                <table class="ui small definition table">
                  <tbody>
                    <span v-for='supplier in modalPart.specs.data.suppliers'>
                      <tr>
                        <td class='six wide column'>
                          <i class="factory icon"></i>
                          &nbsp
                          Supplier
                        </td>
                        <td> {{ supplier.supplierName }} </td>
                      </tr>
                      <tr>
                        <td>
                          <i class="hashtag icon"></i>
                          &nbsp
                          Supplier Part Number
                        </td>
                        <td> {{ supplier.partNumber }} </td>
                      </tr>
                      <span v-for='schedule in supplier.partSchedules'>
                        <tr>
                          <td class='six wide column'>
                            <i class="dollar icon"></i>
                            &nbsp
                            Unit Cost
                          </td>
                          <td> {{ schedule.unitCost }} </td>
                        </tr>
                        <tr>
                          <td>
                            <i class="cubes icon"></i>
                            &nbsp
                            Min Order Qty
                          </td>
                          <td> {{ schedule.minOrderQty }} </td>
                        </tr>
                        <tr>
                          <td>
                            <i class="calendar icon"></i>
                            &nbsp
                            Lead Time
                          </td>
                          <td> {{schedule.leadTime }} {{ schedule.leadTimePeriod }} </td>
                        </tr>
                      </span>
                    </span>
                  </tbody>
                </table>
                <h4 class='ui horizontal divider header' v-if='modalPart.specs.data.customSpecs[0].name'>
                  <i class="fa fa-bars"></i>
                  &nbsp
                  Custom Data
                </h4>
                <table class="ui small definition table">
                  <tbody>
                    <tr v-for='spec in modalPart.specs.data.customSpecs'>
                      <td class='six wide column' v-if='spec.name'>
                        <i class="asterik icon"></i>
                        &nbsp
                        {{ spec.name }}
                      </td>
                      <td v-if='spec.name'>
                        {{ spec.value }}
                        {{ spec.units }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button
                  v-if='$route.params.rev_slug=="latest"'
                  class="ui small blue basic button"
                  @click='editModalPartSpecs'
                >Edit Specs</button>
              </div>
              <div class="ui bottom attached tab segment scorlling content" data-tab='part-bom' style='max-height: 33em'>
                <table class="ui small striped selectable table">
                  <thead>
                    <th>Name</th>
                    <th>Qty</th>
                    <th>Cost</th>
                    <th>Subtotal</th>
                  </thead>
                  <tfoot>

                  </tfoot>
                  <tbody>
                    <tr v-for='(part, index) in this.modalBom'>
                      <td> {{ part.design.name }} </td>
                      <td> {{ part.specs.data.suppliers[0].partSchedules[0].minOrderQty }} </td>
                      <td> {{ part.specs.data.suppliers[0].partSchedules[0].unitCost }} </td>
                      <td> {{ (part.specs.data.suppliers[0].partSchedules[0].minOrderQty * part.specs.data.suppliers[0].partSchedules[0].unitCost).toFixed(2)  }} </td>
                    </tr>
                  </tbody>
                </table>
                <button
                  v-if='$route.params.rev_slug=="latest"'
                  class="ui small blue basic button"
                  @click='editModalPartBom'
                >
                  Edit BOM
                </button>
              </div>
              <div class="ui bottom attached tab segment scrolling content" data-tab='part-files' style='max-height: 33em'>
                <table class="ui basic table">
                  <thead>
                    <th>File Name</th>
                    <th>Change</th>
                    <th>Size</th>
                    <th>Versions</th>
                  </thead>
                  <tbody v-if='this.modalPart.files.data.length > 0'>
                    <tr v-for='file in this.modalPart.files.data'>

                      <td id='file-name'>
                        <a href='#' @click='getFileFromS3(index)'>
                          {{ file.name }}
                        </a>
                      </td>

                      <td id='file-last-change'>
                        <router-link
                          v-if='file.uploaded'
                          :to='"/" + file.versions[file.versions.length - 1].editor_slug'
                          tag='a'
                        >
                          {{ file.versions[file.versions.length - 1].editor_slug }}
                        </router-link>

                        <span>
                          {{ file.versions[file.versions.length - 1].message }}
                          <span v-if='file.versions[file.versions.length - 1].message == "Uploading"'>
                            &nbsp &nbsp
                            <i class="fa fa-spinner fa-pulse"></i>
                            <span class="sr-only">Loading...</span>
                          </span>
                        </span>

                        <span v-if='file.uploaded'>
                          {{ file.versions[file.versions.length - 1].updated_at | moment("from", "now") }}
                        </span>
                      </td>

                      <td id='file-size'>
                        {{ formatBytes(file.versions[file.versions.length - 1].size, 0) }}
                      </td>

                      <td id='file-versions'>
                        <router-link to='' tag='a' @click.native='showVersions(index)'>
                          <span v-if='file.versions'>
                            {{ file.versions.length }}
                          </span>
                          <span v-else>
                            1
                          </span>
                        </router-link>
                      </td>

                    </tr>
                  </tbody>
                </table>
                <button
                  v-if='$route.params.rev_slug=="latest"'
                  class="ui small blue basic button"
                  @click='editModalPartFiles'
                >Upload new file or version</button>
              </div>
              <div class="ui bottom attached tab segment scrolling content" data-tab='part-changes' style='max-height: 33em'>
                <table class="ui basic table">
                  <thead>
                    <th>Editor</th>
                    <th>Change</th>
                    <th>Date</th>
                  </thead>
                  <tbody v-if='this.modalPart.revs'>
                    <tr v-for='rev in this.modalPart.revs'>
                      <td><img src="" class="ui circular avatar image"></td>
                      <td>
                        <a href="#">{{ rev.message }}</a>
                      </td>
                      <td>
                        {{ rev.created_at | moment("MMMM Do YYYY") }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button class="ui small blue basic button">Show Full History</button>
              </div>
            </div>
          </div>
        </div>
        <div class="actions">
          <div class="ui grid">
            <div class="row">
              <div class="five wide column" style='text-align:left'>
                <div class="row">
                  &nbsp
                </div>
                <div class="row">
                  <span v-if='modalPart.design.license.id==1'>
                    Not Licensed
                  </span>
                  <span v-else>
                    Licensed as
                    <a :href='modalPart.design.license.url'>
                      {{ modalPart.design.license.short_name }}
                    </a>
                  </span>
                </div>
              </div>
              <div class="six wide column" style='text-align: center'>
                <div class="row">
                  &nbsp
                </div>
                <div class="row">
                  Created by <a href="/home"> {{ modalPart.design.creator_slug }} </a>
                   on {{ modalPart.created_at | moment("MMMM Do YYYY") }}
                </div>
              </div>
              <div class="five wide column">
                <div
                  v-if='modalIndex != 0'
                  class="ui left labeled basic icon button"
                  @click='switchModalPart(-1)'
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
                  @click='switchModalPart(1)'
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
      modalIndex: null,
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
      },
      modal: {
        nameEditable: false,
        descEditable: false
      },
      modalBom: [],
      enterPressed: false,
      modalPart: null
    }
  },
  computed: {
    ...mapGetters([
      'session',
      'profile',
      'design',
      'designRefs',
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
        if (part.specs.data.suppliers[0].partSchedules[0].unitCost) {
          total += (part.meta.quantity * part.specs.data.suppliers[0].partSchedules[0].unitCost)
        }
      }
      return total
    },
    partsLength() {
      return this.parts.length
    },
  },
  watch: {
    designRefs () {
      console.log('designRefs watcher has been called in parts.vue')
      console.log(`Path endpoint is: ${this.designRefs.endpoint}`)
      if (this.designRefs.endpoint == 'parts') {
        let bom_payload = {
          design_id: this.design.id,
          config_slug: this.designRefs.config_slug,
          ref_slug: this.designRefs.ref,
          ref_type: this.designRefs.ref_type
        }
        console.log('getBomParts has been called from watcher in parts.vue')
        this.getBomParts(bom_payload)
      }
    },
  },
  methods: {
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

          // $('.ui.search').search(
          //   { source: this.results }
          // )
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
      this.http.get('boms/' + this.design.bom.id + '/?ref=' + this.designRefs.ref + '&type=' + this.designRefs.ref_type + '$config=' + this.designRefs.config_slug).then(response => {
        console.log('got bom')
        console.log(response)
        this.bom = response.data
      }, response => {
        console.log('error getting bom')
        console.log(response)
      })
    },
    getBomParts(payload) {
      return new Promise((resolve, reject) => {

        let design_id = payload.design_id
        let ref_slug = payload.ref_slug
        let ref_type = payload.ref_type
        let config_slug = payload.config_slug

        this.$http.get(`bom_parts/?design_id=${design_id}&ref_slug=${ref_slug}&ref_type=${ref_type}&config_slug=${config_slug}`).then(success => {
          console.log('Got bom and parts')
          console.log(success)
          this.$nextTick(() => {
            console.log('setting bom');
            this.bom = success.body.bom
            console.log('set bom');
            this.$nextTick(() => {
              console.log('setting parts');
              this.parts = success.body.parts
              console.log('set parts');

              this.$nextTick(() => {
                console.log('trying to activate drodpdown on parts')
                var dropdown = document.getElementsByClassName('.ui.dropdown.part')
                if (dropdown) {
                  $('.ui.dropdown.part').dropdown(
                    { 'silent': true }
                  )
                }
                this.$nextTick(() => {
                  if (this.trail.length == 0) {
                    let breadcrumb = {
                      name: this.design.name,
                      design_id: this.design.id,
                      ref_slug: this.designRefs.ref,
                      ref_type: this.designRefs.ref_type,
                      config_slug: this.designRefs.config_slug,
                      path: this.designRefs.path
                    }
                    this.trail.push(breadcrumb)
                  }
                  this.$nextTick(() => {
                    if (this.parts.length == 0 && this.$route.params.rev_slug == 'latest' && this.trail.length > 1) {
                      this.addEmptyPart()
                      resolve()
                    } else {
                      resolve()
                    }
                })
                })
              })
            })
          })
        }, error => {
          console.log('Errror getting bom and parts')
          console.log(error)
          reject()
        })
      })
    },
    getModalPartandBom(index) {
      return new Promise((resolve, reject) => {
        this.modalPart = this.parts[index]

        let design_id = this.modalPart.design.id
        let ref_slug = this.modalPart.meta.ref_slug
        let ref_type = this.modalPart.meta.ref_type
        let config_slug = this.modalPart.meta.config_slug

        this.$http.get(`bom_parts/?design_id=${design_id}&ref_slug=${ref_slug}&ref_type=${ref_type}&config_slug=${config_slug}`).then(success => {
          console.log('Got BOM for modal part')
          console.log(success)
          this.modalBom = success.body.parts
          resolve(success)
        }, error => {
          console.log('Error getting BOM')
          console.log(error)
          this.modalBom = []
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
      let part_slugs = this.parts.map((part) => {return part.design.slug})
      part_slugs.pop()
      if (part_slugs.includes(result)) {
        console.log('New part being added is already in the BOM, checking to see if they have the same ref')
        let matched_part_index = part_slugs.indexOf(result)
        let matched_part = this.parts[matched_part_index]
        // check to see if they are being tracked at the same ref
        if (matched_part.meta.ref_slug != 'alpha') {
          console.log('New part is being tracked at a different ref, adding new part')
          this.addExistingDesign(index, result)
        } else {
          console.log('New part is being tracked at the same ref, incrementing orignal party quantity instead of adding new part')

          matched_part.meta.quantity += 1
          this.parts.pop()
          this.bom.data[matched_part_index].quantity += 1
          let action = `Changed quantity of ${matched_part.design.name} to ${matched_part.meta.quantity} `
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
      let newPart = this.parts[index]
      // get the design for this part
      let payload = {design_slug: result}
      let response = await this.getDesign(payload)

      // update the BOM and commit
      newPart.meta.quantity = 1
      newPart.meta.cost = response.data.specs.data.suppliers[0].partSchedules[0].unitCost
      newPart.meta.created = true
      newPart.meta.editable = false
      newPart.design = response.data
      newPart.bom = response.data.bom
      newPart.files = response.data.files
      newPart.specs = response.data.specs
      newPart.configs = response.data.config_set
      newPart.builds = response.data.build_set,
      newPart.revs = response.data.rev_set
      newPart.meta.path = `${newPart.design.creator_slug}/${newPart.design.slug}/alpha/latest/specs`

      // reset the new part
      this.newPartName = {
        data: null,
        hasError: null,
        error: null
      }

      this.resultSelected = false
      this.result = {}
      $('.ui.search').search('hide results')

      document.getElementById('add-part-button').disabled=true

      // add another empty part to the bom and set focus there
      this.addEmptyPart()
      this.$nextTick( function() {
        $('.ui.dropdown.part').dropdown(
          { 'silent': true }
        );
      })

      // create a new bom item and insert into the bom.data
      let new_item = {
        design_id: newPart.design.id,
        ref_slug: 'alpha',
        ref_type: 'config',
        config_slug: 'alpha',
        quantity: newPart.meta.quantity
      }

      this.bom.data.push(new_item)
      let action = `Added ${newPart.design.name} to BOM`
      let message = null
      this.updateBOM(action, message)
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
        cost: newPart.specs.data.suppliers[0].partSchedules[0].unitCost
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
          let cost = newPart.specs.data.suppliers[0].partSchedules[0].unitCost
          // update the part to reflect the design data and that it is created
          newPart.meta.created = true
          newPart.meta.editable = false
          newPart.design = response.data
          newPart.bom = response.data.bom
          newPart.files = response.data.files
          newPart.specs = response.data.specs
          newPart.configs = response.data.config_set
          newPart.builds = response.data.build_set
          newPart.revs = response.data.rev_set
          newPart.meta.path = `${newPart.design.creator_slug}/${newPart.design.slug}/alpha/latest/specs`
          newPart.specs.data.suppliers[0].partSchedules[0].unitCost = cost

          // reset the new part
          vue.newPartName = {
            data: null,
            hasError: null,
            error: null
          }

          document.getElementById('add-part-button').disabled=true

          // add another empty part to the bom and set focus there
          vue.addEmptyPart()

          // create a new bom item and insert into the bom.data
          let new_item = {
            design_id: newPart.design.id,
            ref_slug: 'alpha',
            ref_type: 'config',
            config_slug: 'alpha',
            quantity: newPart.meta.quantity
          }

          vue.bom.data.push(new_item)
          let action = `Created and added ${newPart.design.name} to BOM`
          let message = null
          vue.updateBOM(action, message)
          if (cost > 0) {
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
        meta: {
          created: false,
          editable: false,
          ref_slug: 'alpha',
          ref_type: 'config',
          config_slug: 'alpha',
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
        specs: {
          data: {
            suppliers: [
              {
                partSchedules: [
                  {
                    unitCost: 0.00
                  }
                ]
              }
            ]
          }
        },
        configs: {},
        builds: {},
        revs: {}
      }
      this.parts.push(part)

      let design_ids = ''
      for (let breadcrumb of this.trail) {
        design_ids += ('&design_id=' + breadcrumb.design_id)
      }

      this.$nextTick(() => {
        $('.ui.dropdown.part').dropdown({ 'silent': true })
        if (this.parts.length == 1) {
          document.getElementById('add-part-button').disabled=true
        }
        let vue = this
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
        console.log('focusing')
        $('#part-name-editable').focus()
      })
    },

    viewPart(index) {
      let selectedPart = this.parts[index]
      console.log('View part called')
      this.$router.push('/' + selectedPart.meta.path, onComplete => {
        document.getElementById('add-part-button').disabled=true
      }, onAbort => {

      })
    },
    openAssembly(index) {
      // drills down on an assembly
      console.log('Open Assembly clicked')
      let selectedPart = this.parts[index]

      console.log(selectedPart)
      // create a new breadrcrumb
      let breadcrumb = {
        name: selectedPart.design.name,
        design_id: selectedPart.design.id,
        ref_slug: selectedPart.meta.ref_slug,
        ref_type: selectedPart.meta.ref_type,
        config_slug: selectedPart.meta.config_slug,
        path: selectedPart.meta.path
      }

      this.trail.push(breadcrumb)
      console.log('pushed new breadcrumb')

      // reset the bom to the new breadcrumb
      let bom_payload = {
        design_id: selectedPart.design.id,
        ref_slug: selectedPart.meta.ref_slug,
        ref_type: selectedPart.meta.ref_type,
        config_slug: selectedPart.meta.config_slug
      }

      console.log(bom_payload)
      this.$nextTick(() => {
        this.getBomParts(bom_payload)
      })
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
    viewModalPartHome() {
      this.hideModal()
      this.$router.push(`/${this.modalPart.meta.path}`)
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

      if (!this.enterPressed) {
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
      } else {
        this.enterPressed = false
      }
    },
    testEditedPartDesign(index) {
      // test if design (name) has changed -> update the design record
      this.enterPressed = true
      let testPart = this.parts[index]
      if (testPart != this.selectedPart) {
        if (testPart.design.name != this.selectedPart.design.name.trim()) {
          console.log('Design change detected in update part')

          let test = /^[A-Za-z0-9-_/\,;:'" ] ]{1,50}$/.test(testPart.design.name)
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
          config: testPart.meta.config_slug,
          quantity: testPart.meta.quantity
        }

        console.log('About to call update bom with update part replaced by index')
        console.log(this.bom)

        let action = `Changed quantity of ${testPart.design.name} to ${testPart.meta.quantity} in BOM`
        let message = null
        this.updateBOM(action, message).then(success => {
          console.log('Updated BOM record after editing an existing part')
          testPart.meta.editable = false
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
      if (testPart.specs.data.suppliers[0].partSchedules[0].unitCost != this.selectedPart.specs.data.suppliers[0].partSchedules[0].unitCost) {
        console.log('Specs changed detected in update part')
        testPart.specs.data.suppliers[0].partSchedules[0].unitCost = Number(testPart.specs.data.suppliers[0].partSchedules[0].unitCost)
        this.updateSpecs(index).then(success => {
          console.log('Updated Specs record after editing an existing part')
          this.editedPartUpdated = true
          testPart.meta.editable = false
        testPart.meta.editable = false
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
        testPart.meta.editable = false
      }
    },

    editDesignNameInModal(index) {
      let test = /^[A-Za-z0-9-_/\,;:'" ]{1,50}$/.test(this.modalPart.design.name)
      if (test) {
        console.log('Name matches regex')
        // check if this design name is already in use by this user
        let test_slug = this.modalPart.design.name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-')
        this.$http.get('designs/' + test_slug + '/').then(response => {
          console.log('Design name is already taken')
        }, response => {
          console.log('Part/Design name  is available')
          this.updateDesign(index)
        })
      }
    },
    editDesignBomInModal(index) {
      return new Promise((resolve, reject) => {
        this.bom.data[index] =  {
          design_id: this.modalPart.design.id,
          ref_slug: this.modalPart.meta.ref_slug,
          ref_type: this.modalPart.meta.ref_type,
          quantity: this.modalPart.meta.quantity
        }
        this.updateBOM().then(success => {
          console.log('Updated modal part bom attributes')
          console.log(success)
          resolve(success)
        }, error => {
          console.log('Error updating modal part bom attributes')
          console.log(error)
          reject(error)
        })
      })
    },
    editTrackingPointInModal: async function(ref_slug) {

      console.log(ref_slug)
      let tracking_slug = ref_slug

      // check if tracking slug is equal to current ref_slug
      if (ref_slug != this.modalPart.meta.ref_slug) {
        let new_ref = null

        for(let config of this.modalPart.configs) {
          if (!new_ref && config.slug == ref_slug ) {
            new_ref = config
            this.modalPart.meta.ref_slug = config.slug
            this.modalPart.ref_type = 'config'
          }
        }

        if (!new_ref) {
          for(let build of this.modalPart.builds) {
            if(!new_ref && build.slug == ref_slug) {
              new_ref = build
              this.modalPart.ref_slug = build.slug
              this.modalPart.ref_type = 'build'
            }
          }
        }

        let p1 = await this.editDesignBomInModal(this.modalIndex)
        // get new bom context since part will have changed

        let payload = {
          design_id: this.design.id,
          ref_slug: this.designRefs.ref,
          ref_type: this.designRefs.ref_type,
          config_slug: this.designRefs.config_slug
        }

        this.getBomParts(payload)

      }
    },

    editModalPartSpecs() {
      this.hideModal()
      this.$router.push(`/${this.modalPart.meta.path}/specs`)
    },
    editModalPartBom() {
      this.hideModal()
      // how does the app know we have a new design context
        // design will not be recreated
        // parts will not be recreated
      this.$router.push(`/${this.modalPart.meta.path}/parts`, onComplete => {
        this.$store.commit('setDesignRefs')
      }, onAbort => {})
    },
    editModalPartFiles() {
      this.hideModal()
      this.$router.push(`/${this.modalPart.meta.path}/files`)
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
    updateBOM(action, message) {
      return new Promise((resolve, reject) => {
        let payload = {
          editor: this.profile.id,
          data: this.bom.data
        }
        this.$http.put('boms/' + this.bom.id +'/?ref=' + this.$route.params.config_slug + '&action=' + action + '&message=' + message,
        payload).then(success => {
          console.log('BOM updated')
          console.log(success)
          this.bom = success.data
          let design_payload = { design_slug: this.$route.params.design_slug }
          this.$store.dispatch('getDesign', design_payload).then(success => {
            console.log('Got updated Design after adding updating BOM')
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
        let action = `Updated cost for ${updated_part.design.name}`
        let message = null
        this.$http.put('specs/' + updated_part.specs.id + '/?ref=' + updated_part.meta.ref_slug +
        '&action=' + action + '&message=' + message, payload).then(success => {
          console.log('Specs updated')
          console.log(success)
          let design_payload = { design_slug: this.$route.params.design_slug }
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
        this.$nextTick(() => {
          this.bom.data.splice(index, 1)
          this.$nextTick(() => {
            let action = `Removed ${removed_part.design.name} from BOM`
            let message = null
            vue.updateBOM(action, message)
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
    showModal: async function(index) {
      this.modalIndex = index
      this.modalPart = this.parts[this.modalIndex]
      console.log('show modal clicked')
      // this.modalIndex = index
      await this.getModalPartandBom(index)
      this.$nextTick(() => {
        if (this.parts[this.parts.length - 1].meta.created == false) {
          this.parts.pop()
          document.getElementById('add-part-button').disabled=false
        }
        $('.ui.modal').modal('show', {
          autofocus: false
        })
        this.$nextTick(() => {
          $('.ui.modal').modal('setting', {
            'autofocus': false
          })
          $('.ui.modal').modal('show')
          // $('.ui.modal').modal({
          //    transition: 'slide left',
          // }).modal('show');
          this.$nextTick(() => {
            $('.ui.dropdown.tracking').dropdown(
              { 'silent': true }
            )
            let vue = this
            $('.ui.dropdown.tracking').dropdown(
              {
                'silent': true,
                onChange(value, text, $choice) {
                  vue.editTrackingPointInModal(value)
                }
              }
            )
            // set ref for for trakcing dropdown to current value of bom
            let ref = null

            if (this.modalPart.meta.ref_type == 'config') {
              for (let config of this.modalPart.configs) {
                if (config.slug == this.modalPart.meta.ref_slug) {
                  ref = config
                  console.log('Modal tracking point set to config')
                }
              }
            } else if (this.modalPart.meta.ref_tye == 'build') {
              for (let build of this.modalPart.builds) {
                if (build.slug == this.modalPart.meta.ref_slug) {
                  ref = build
                  console.log('Modal tracking point set to build')
                }
              }
            } else {
              console.log('Modal tracking point is a change, not setting tracking point')
            }

            if (ref) {
              $('.tracking').dropdown('set text', ref.name)
              $('.tracking').dropdown('set selected', ref.slug)
            }

            $('.ui.dropdown.options').dropdown(
              { 'silent': true }
            )
            $('.menu .item').tab()
          })
        })

      })

    },
    hideModal() {
      // this.modalPart = null
      this.modalBom = null

      $('.ui.modal').modal('toggle')
      // this.$nextTick(() => {
      //   // this.modalIndex = null
      //   this.modalPart = null
      //   this.modalBom = null
      // })
    },
    switchModalPart(value) {
      this.modalIndex += value
      this.modalPart = this.parts[this.modalIndex]
    },

    getFullBom() {
      // server side
      // change server side getBOM to do this every time
      // need this for price calculations and other metadata
      // call getBom recursively on server side
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
    this.getDesigns()
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
      console.log('getBOMParts has been called in part.vue created')
      this.getBomParts(bom_payload)
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
