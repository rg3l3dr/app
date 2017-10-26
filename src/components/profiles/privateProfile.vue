
<template lang="html">
  <div class='ui grid'>
      <div class="one wide column"></div>
      <div class="fourteen wide column">
        <div class="ui grid">
          <div class='row'>
      			<div class='four wide column' id='plan'>
              <span style='font-size:15px'>
                Plan:  {{ profile.plan.name }} &nbsp
                <router-link v-if='profile.plan.name=="Starter"' to='accounts/settings/plan'>
                  Upgrade
                </router-link>
              </span>
      			</div>
      			<div class='eight wide column' >
      				 Private Storage:  {{ data_fmt }} / {{data_cap_fmt}} &nbsp; &nbsp;
               <router-link to='accounts/invitations/send'>
                 Invite friends to add storage
               </router-link>
               <div id="myProgress">
                 <div id="myBar" :style="{width: data_percent + '%'  }">
                 </div>
               </div>
      			</div>
      		</div>
      		<div class='row'>
      			<div class='five wide column'>
      				<div class='row'>
      					<div class='sixteen wide column' id='profile'>
                  <div class="ui small top attached header">
                    <i class="fa-user icon"></i>
                    <div class="content">
                      &nbsp My Profile
                    </div>
                  </div>
                  <div class="ui bottom attached clearing segment">
                    <p id='profile-summary'>
                      <div class="ui grid">
                        <div class='row' style='padding: 0px 0px 0px 0px'>
                          <div class='four wide column'>
                            <img class='ui image' v-if='profile.picture' :src='profile.picture' style='height:40px'/>
                            <i v-else class="fa fa-user fa-2x" aria-hidden="true"></i>
                          </div>
                          <div class='twelve wide column'>
                            <h2 style='margin:auto'>{{ profile.name }}</h2>
                          </div>
                        </div>
                        <div class='row'>
                          <div class='sixteen wide column'>
                            <span v-if='profile.public_name'>
                              <i class="fa fa-user"></i>
                              &nbsp {{ profile.public_name }}<br>
                            </span>
                            <span v-if='profile.location'>
                              <i class="fa fa-globe"></i>
                              &nbsp Lives in {{ profile.location }}<br>
                            </span>
                            <i class="fa fa-calendar"></i>
                            &nbsp Joined on {{ profile.created_at | moment("MMMM Do YYYY") }}<br>
                            <span v-if='profile.website'>
                              <i class="fa fa-link"></i>
                              &nbsp <a :href='profile.website'> {{ profile.website }}</a><br>
                            </span>
                            <span v-if='profile.public_email'>
                              <i class="fa fa-envelope-o"></i>
                              &nbsp <a :href='"mailto:" + profile.public_email'> {{profile.public_email}}</a><br>
                            </span>
                            <br>
                            <router-link to='/accounts/settings/public'>
                              <button class='ui right floated small compact basic black button'>
                                <i class="fa fa-gear" aria-hidden="true"></i>
                                Manage
                              </button>
                            </router-link>
                          </div>
                        </div>
                      </div>
                    </p>
                  </div>
      					</div>
      				</div>
              <br>
              <div class='row'>
      					<div class='sixteen wide column' id='projects'>
      						<div class='ui small top attached header'>
      								<i class="fa fa-folder-open text-primary" aria-hidden="true"></i>
                      <div class="content">
                        &nbsp
        								My Projects
                      </div>
      						</div>
      						<div class="ui bottom attached clearing segment">
                    <div class="ui relaxed divided list">
                      <div class="item" v-if='projects.length == 0'>
                        You have not created any design projects yet
                      </div>
                      <div v-else class="item" v-for='project in projects'>
                        <i class="folder open outline icon"></i>
                        <div class="content" v-if='project.owner == profile.name'>
                          <router-link tag='a' :to=' "/" + project.owner + "/" + project.slug + "/latest/home" '>
                            {{ project.name }}
                          </router-link>
                        </div>
                        <div v-else class="content">
                          <router-link tag='a' :to=' "/" + project.owner'>
                            {{ project.owner }}
                          </router-link>
                          /
                          <router-link tag='a' :to=' "/" + project.owner + "/" + project.slug + "/latest/home" '>
                            {{ project.name }}
                          </router-link>
                        </div>
                      </div>
                    </div>
                    <div class="ui tiny pagination menu" v-if='projectsPages.length > 1'>
                      <a
                        class="item"
                        :class='{disabled: !previousProjects}'
                        @click='selectProjectsPage(projectsPageIndex - 1)'
                      >
                        Previous
                      </a>
                      <a
                        class="item"
                        v-for='page in projectsPages'
                        :class='{active: page === projectsPageIndex}'
                        @click='selectProjectsPage(page)'
                      >
                        {{ page }}
                      </a>
                    <!--   <a class="disabled item" v-else>
                      ...
                    </a> -->
                      <a
                        class="item"
                        :class='{disabled: !nextProjects}'
                        @click='selectProjectsPage(projectsPageIndex + 1)'
                      >
                        Next
                      </a>
                    </div>
                    <br><br>
                    <router-link to='/designs/create_design'>
      								<button class='ui right floated small compact basic black button'>
      									<i class="fa fa-plus" aria-hidden="true"> </i>
      									&nbsp New Project
      								</button>
                    </router-link>
    							</div>
      					</div>
      				</div>
              <br>
      				<!-- <div class='row'>
      				  <div class='sixteen wide column' id='organizations'>
      				    <div class='ui small top attached header'>
      				                <i class="fa fa-users text-primary" aria-hidden="true"></i>
      				                <div class="content">
      				                  &nbsp
      				        My Teams
      				                </div>
      				              </div>
      				              <div class="ui bottom attached clearing segment">
      				                You are not a member of any organizations.
      				                <br><br>
      				                <button class='ui right floated mini button'>
      				                  <i class="fa fa-plus" aria-hidden="true"> </i>
      				                  New Team
      				                </button>
      				    </div>
      				  </div>
      				</div> -->
            </div>
      			<div class='eleven wide column'>
              <div class="sixteen wide column" id='welcome-message' v-if='parts.length == 0'>
                <div class="ui small top attached header">
                  <i class="cogs icon text-primary"></i>
                  <div class="content">
                    &nbsp
                    Welcome!
                  </div>
                </div>
                <div class="ui bottom attached clearing segment">
                  <div style='text-align:center'>
                    <br>
                    <h2 class="ui icon header">
                      <i class="fa-cogs icon"></i>
                      <br>
                      <div class="content">
                        Welcome to OmniBuilds!
                        <div class="sub header" >
                          <br>
                          <a href="http://help.omnibuilds.com" style='font-size:18px'>
                            Learn how OmniBuilds tracks designs
                          </a>
                          <br>
                          <br>
                          <i>then</i>
                          <br>
                          <br>
                          <router-link to='/designs/create_design' style='font-size:18px'>
                            Start your first design project
                          </router-link>
                          <br>
                        </div>
                      </div>
                    </h2>
                  </div>
                </div>
              </div>
              <div class="sixteen wide column" id='welcome-message' v-else>
                <div class="ui small top attached header">
                  <i class="cubes icon text-primary"></i>
                  <div class="content">
                    &nbsp
                    My Parts & Assemblies
                  </div>
                </div>
                <div class="ui bottom attached clearing segment">
                  <div>
                    <!-- <div class="ui relaxed divided list"> -->
                      <div class='ui relaxed divided list'>
                        <div class="item" v-for='part in parts'>
                          <i class="large cubes middle aligned icon" v-if='part.parts > 0'></i>
                          <i class="large cube middle aligned icon" v-else></i>
                          <div class="content" v-if='part.owner == profile.name'>
                            <router-link tag='a' :to=' "/" + part.owner + "/" + part.slug + "/latest/home" '>
                              {{ part.name }}
                            </router-link>
                            <div class="description">
                              {{ part.number }}
                            </div>
                          </div>
                          <div v-else class="content">
                            <router-link tag='a' :to=' "/" + part.owner'>
                              {{ part.owner }}
                            </router-link>
                            /
                            <router-link tag='a' :to=' "/" + part.owner + "/" + part.slug + "/latest/home" '>
                              {{ part.name }}
                            </router-link>
                            <div class="description">
                              {{ part.number }}
                            </div>
                          </div>
                          <!-- <div class="content">
                            <router-link tag='a' class='header' :to=' "/" + part.creator + "/" + part.slug + "/alpha/latest/parts" '> {{ part.name }}
                            </router-link>
                            <div class="description">
                              {{ part.number }}
                            </div>
                          </div> -->
                        </div>
                      </div>

                    <!-- </div> -->
                    <div class="ui tiny pagination menu" v-if='partsPages.length > 1'>
                      <a
                        class="item"
                        :class='{disabled: !previousParts}'
                        @click='selectPartsPage(partsPageIndex - 1)'
                      >
                        Previous
                      </a>
                      <a
                        class="item"
                        v-for='page in partsPages'
                        :class='{active: page === partsPageIndex}'
                        @click='selectPartsPage(page)'
                      >
                        {{ page }}
                      </a>
                    <!--   <a class="disabled item" v-else>
                      ...
                    </a> -->
                      <a
                        class="item"
                        :class='{disabled: !nextParts}'
                        @click='selectPartsPage(partsPageIndex + 1)'
                      >
                        Next
                      </a>
                    </div>
                  </div>
                </div>
              </div>
      			  <!-- <div class='row'>
      			    <div class='ui small top attached header' id='contributions'>
      			              <i class="fa fa-random text-primary" aria-hidden="true"></i>
      			              <div class="content">
      			                &nbsp
      			                My Contributions (wip)
      			              </div>
      			            </div>
      			            <div class="ui bottom attached clearing segment">
      			              <div id="cal-heatmap">
      			              </div>
      			            </div>
      			  </div>
      			          <br>
      			  <div class='row'>
      			      <div class="ui small top attached header" id='feed'>
      			        <i class="fa fa-feed text-primary" aria-hidden="true"></i>
      			                <div class="content">
      			                  &nbsp
      			          My Activity Feed
      			                </div>
      			      </div>
      			      <div class="ui bottom attached clearing segment">
      			                <div id='app'>
      			                  Coming Soon!
      			                </div>
      			                <br><br>
      			      </div>
      			    </div>
      			  </div> -->
      			</div>
      		</div>
        </div>

      </div>
      <div class="one wide column"></div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import gql from 'graphql-tag'

var gotProfile
export default {
  name: 'dashboard',
  beforeRouteEnter (to, from, next) {
    // prevent getting profile twice if coming from login page, else we want to refresh the profile when navigating to dashboard
    if (from.path == '/accounts/login') {
      gotProfile = true
    } else {
      gotProfile = false
    }
    next()
  },
  // apollo: {
  //  profiles: gql`{
  //    profiles {
  //      id,
  //      name,
  //      slug,
  //      storage,
  //      storageCap
  //    }
  //  }`
  // },
  data() {
    return {
      projects: [],
      projectsPages: [],
      previousProjects: null,
      nextProjects: null,
      projectsPageIndex: null,
      projectsPageRange: null,
      parts: [],
      partsPages: [],
      previousParts: null,
      nextParts: null,
      partsPageIndex: null,
      partsPageRange: null,
      profiles: null,
    }
  },
  computed: {
    ...mapState([
      'env',
      'session',
      'profile',
    ]),
    data_fmt: function() {
			return this.formatBytes(this.profile.storage, 0)
		},
    data_percent: function() {
			return (this.profile.storage / this.profile.storage_cap) * 100
		},
		data_cap_fmt: function() {
			return this.formatBytes(this.profile.storage_cap)
		},
  },
  methods: {
    getDesigns(page) {
      return new Promise ((resolve, reject) => {
        this.$http.get(`privateprojects/?page=${page}&profile_slug=${this.profile.slug.toLowerCase()}`).then(success => {
          if (this.env != 'prod') {
            console.log('Got design list')
            console.log(success)
          }
          this.projects = success.body.results
          this.previousProjects = success.body.previous
          this.nextProjects = success.body.next
          if (this.projectsPages.length == 0) {
            this.projectsPageIndex = 1
            let count = Math.ceil(success.body.count / 10)
            console.log(count)
            for (let i = 1; i <= count; i++) {
              this.projectsPages.push(i)
            }
            this.projectsPageRange = 5
          }
          resolve()
        }, error => {
          if (this.env != 'prod') {
            console.log('Error getting design list')
            console.log(error)
          }
          reject()
        })
      })
    },
    getParts(page) {
      return new Promise((resolve, reject) => {
        this.$http.get(`privateparts/?page=${page}&profile_slug=${this.profile.slug.toLowerCase()}`).then(success => {
          if (this.env != 'prod') {
            console.log('Got users private parts')
            console.log(success)
          }
          this.parts = success.body.results
          this.previousParts = success.body.previous
          this.nextParts = success.body.next
          if (this.partsPages.length == 0) {
            this.partsPageIndex = 1
            let count = Math.ceil(success.body.count / 10)
            for (let i = 1; i <= count; i++) {
              this.partsPages.push(i)
            }
            this.partsPageRange = 5
          }
          resolve(success)
        }, error => {
          if (this.env != 'prod') {
            console.log('Error getting users private parts')
            console.log(error)
          }
          reject(error)
        })
      })
    },
    selectPartsPage(index) {
      this.getParts(index)
      this.partsPageIndex = index
    },
    selectProjectsPage(index) {
      this.getDesigns(index)
      this.projectsPageIndex = index
    },
    startCalHeatMap() {
      var cal = new CalHeatMap()
      cal.init({
        start: new Date(2017, 7),
        range: 1,
        domain: 'year',
        subDomain: 'day',
      })
    },
    formatBytes(bytes,decimals) {
       if(bytes == 0) return '0 Bytes'
       var k = 1000
       var dm = decimals + 1 || 3
       var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
       var i = Math.floor(Math.log(bytes) / Math.log(k))
       return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    }
  },
  created() {
    if (!gotProfile) {
      this.$store.dispatch('getProfile')
    }
  },
  mounted() {
    this.getDesigns(1).then( () => {
      // this.startCalHeatMap()
    })
    this.getParts(1)
  },
}

</script>

<style>
  #myProgress {
      width: 100%;
      background-color: #eee;
      border-radius: 5px;
  }
  #myBar {
      height: 20px;
      background-color: #337ab7;
      border-radius: 5px 0px 0px 5px;
  }
</style>
