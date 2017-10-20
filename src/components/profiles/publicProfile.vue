<template lang="html">
  <div>
    <div class="ui grid">
      <div class="one wide column"></div>
      <div class="fourteen wide column">
        <div class="ui grid">
          <div class="row"></div>
          <div class="row">
            <div class="five wide column">
              <div class="row">
                <div class="sixteen wide column">
                  <div class="ui small top attached header">
                    <i class="user icon"></i>
                    <div class="content">
                      &nbsp Profile
                    </div>
                  </div>
                  <div class="ui bottom attached clearing segment">
                    <p id="profile-summary">
                      <div class="ui grid">
                        <div class="row" style='padding: 0px 0px 0px 0px'>
                          <div class="four wide column">
                            <img class="ui image" v-if='profile.picture' :src='profile.picture' style='height:40px'/>
                            <i v-else class="fa fa-user fa-2x" aria-hidden="true"></i>
                          </div>
                          <div class="twelve wide column">
                            <h2 style='margin:auto'>
                              {{ profile.name }}
                            </h2>
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
                          </div>
                        </div>
                      </div>
                    </p>
                  </div>
                </div>
              </div>
              <br>
              <div class="row">
                <div class="sixteen wide column" id='projects'>
                  <div class='ui small top attached header'>
      								<i class="fa fa-folder-open-o text-primary" aria-hidden="true"></i>
                      <div class="content">
                        &nbsp
        								Shared Projects
                      </div>
      						</div>
      						<div class="ui bottom attached clearing segment">
                    <div class="ui relaxed divided list">
                      <div class="item" v-if='projects.length == 0'>
                        <div class="sixteen wide column">
                          <p>{{ profile.name }} has not shared any projects with you yet.</p>
                        </div>
                      </div>
                      <div v-else class="item" v-for='project in projects'>
                        <i class="folder icon"></i>
                        <div class="content">
                          <router-link tag='a' :to=' "/" + project.creator + "/" + project.slug + "/latest/home" '>
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
    							</div>
                </div>
              </div>
            </div>
            <div class="eleven wide column">
              <div class="sixteen wide column">
                <div class="ui small top attached header">
                  <i class="cubes icon text-primary"></i>
                  <div class="content">
                    Shared Parts & Assemblies
                  </div>
                </div>
                <div class="ui bottom attached clearing segment">
                  <div>
                    <span v-if='parts.length == 0'>
                      <br><br>
                      <p>{{ profile.name }} have not shared any parts or assemblies with you</p>
                      <br><br><br>
                    </span>
                    <span v-else>
                      <div class="ui relaxed divided list">
                        <div class="item" v-for='part in parts'>
                          <i class="large cubes middle aligned icon" v-if='part.parts > 0'></i>
                          <i class="large cube middle aligned icon" v-else></i>
                          <div class="content">
                            <router-link tag='a' class='header' :to=' "/" + part.creator + "/" + part.slug + "/latest/home" '> {{ part.name }}
                            </router-link>
                            <div class="description">
                              {{ part.number }}
                            </div>
                          </div>
                        </div>
                      </div>
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
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div class="one wide column"></div>
    </div>
  </div>

</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'profile',
  data() {
    return {
      profile: {},
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
    }
  },
  computed: {
    ...mapState([
      'env',
      'session',
    ]),
  },
  methods: {
    getPublicProfile() {
      return new Promise((resolve, reject) => {
        this.$http.get('profiles/' + this.$route.params.profile_slug.toLowerCase() + '/').then(success => {
          if (this.env != 'prod') {
            console.log('Got users public profile')
            console.log(success)
          }
          this.profile = success.data
          resolve(success)
        }, error => {
          if (this.env != 'prod') {
            console.log('Error getting users public profile')
            console.log(error)
          }
          reject(error)
        })
      })
    },
    getPublicProjects(page) {
      return new Promise((resolve, reject) => {
        this.$http.get(`privateprojects/?page=${page}&profile_slug=${this.profile.slug.toLowerCase()}`).then(success => {
          if (this.env != 'prod') {
            console.log('Got users public projects')
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
          resolve(success)
        }, error => {
          if (this.env != 'prod') {
            console.log('Error getting users public projects')
            console.log(error)
          }
          reject(error)
        })
      })
    },
    getPublicParts(page) {
      return new Promise((resolve, reject) => {
        this.$http.get(`privateparts/?page=${page}&profile_slug=${this.profile.slug.toLowerCase()}`).then(success => {
          if (this.env != 'prod') {
            console.log('Got users public parts')
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
            console.log('Error getting users public parts')
            console.log(error)
          }
          reject(error)
        })
      })
    },
    selectPartsPage(index) {
      this.getPublicParts(index)
      this.partsPageIndex = index
    },
    selectProjectsPage(index) {
      this.getPublicProjects(index)
      this.projectsPageIndex = index
    },
  },
  created() {
    this.getPublicProfile().then(success => {
      this.getPublicProjects(1)
      this.getPublicParts(1)
    }, error => {
      if (error.body.detail == 'Not found.') {
        this.$router.push('/404')
      }
    })

  },
  mounted() {

  }
}
</script>

<style lang="css">
</style>
