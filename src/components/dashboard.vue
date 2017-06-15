
<template lang="html">
  <div>
    <div class='ui grid'>
  		<div class='row'>
  			<div class='four wide column' id='plan'>
  				Plan:  {{profile.plan.name}} &nbsp
          <router-link v-if='profile.plan.name=="Free" || profile.plan.name=="Individual (free)"' to='profile/plan'>
            Upgrade
          </router-link>
  			</div>
  			<div class='eight wide column' >
  				 Private Storage:  {{ data_fmt }} / {{data_cap_fmt}} &nbsp;
           <router-link to='invite/send'>
             Invite friends to add storage
           </router-link>
  				 <!-- <div class="ui progress" id='privateStorage'>
  				   <div class="bar"></div>
  				               <div class="progress"></div>
  				   <div class="label">{{data_percent}} %</div>
  				 </div> -->

           <!-- <template>
             <progress-bar :type="'success'" :size="'large'" :value="20" :max="100" :show-label="false"></progress-bar>
           </template> -->


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
                    <div class='row'>
                      <div class='four wide column'>
                        <img v-if='profile.picture' :src='profile.picture' style='height:50px'/>
                        <i v-else class="fa fa-user fa-2x" aria-hidden="true"></i>
                      </div>
                      <div class='twelve wide column'>
                        <h1 style='margin:auto'>{{ profile.name }}</h1>
                      </div>
                    </div>
                    <br>
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
                        &nbsp Joined on {{ profile.date_joined | moment("MMMM Do YYYY") }}<br>
                        <span v-if='profile.website'>
                          <i class="fa fa-link"></i>
                          &nbsp <a :href='profile.website'> {{ profile.website }}</a><br>
                        </span>
                        <span v-if='profile.public_email'>
                          <i class="fa fa-envelope-o"></i>
                          &nbsp <a :href='"mailto:" + profile.public_email'> {{profile.public_email}}</a><br>
                        </span>
                        <br>
                        <router-link to='/profile/public'>
                          <button class='ui right floated mini button'>
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
  								<i class="fa fa-folder-open-o text-primary" aria-hidden="true"></i>
                  <div class="content">
                    &nbsp
    								My Projects
                  </div>
  						</div>
  						<div class="ui bottom attached clearing segment">
  								You are not a team member for any projects.
  								<br><br>
                  <router-link to='/project'>
    								<button class='ui right floated mini button'>
    									<i class="fa fa-plus" aria-hidden="true"> </i>
    									&nbsp New Project
    								</button>
                  </router-link>
  							</div>
  					</div>
  				</div>
          <br>
  				<div class='row'>
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
  				</div>
        </div>
  			<div class='eleven wide column'>
  				<div class='row'>
  					<div class='ui small top attached header' id='contributions'>
							<i class="fa fa-random text-primary" aria-hidden="true"></i>
              <div class="content">
                &nbsp
								My Contributions
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
									<ul >
									<!-- 	<li :class="{ 'completed': task.completed }" v-cloak v-for='task in tasks' @click="task.completed = ! task.completed">[[ task.body ]]</li> -->
									</ul>
								</div>
								<br><br>
  						</div>
  					</div>
  				</div>
  			</div>
  		</div>
  </div>
</template>

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


<script>
function formatBytes(bytes,decimals) {
   if(bytes == 0) return '0 Bytes'
   var k = 1000
   var dm = decimals + 1 || 3
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
   var i = Math.floor(Math.log(bytes) / Math.log(k))
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

$(document).ready(function() {
  $('.ui.dropdown').dropdown();
  // $('#privateStorage').progress();

  // $('.ui.menu .item').tab();
  // $('table').tablesort()
  // $('.ui.checkbox').checkbox();
;
});

import { mapGetters } from 'vuex'
export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'session',
      'profile'
    ]),
    data_fmt: function() {
			return formatBytes(this.profile.data)
		},
    data_percent: function() {
			return (this.profile.data / this.profile.data_cap) * 100
		},
		data_cap_fmt: function() {
			return formatBytes(this.profile.data_cap)
		},
  },
  created: function() {
    this.$store.commit('getProfile')


  },
  mounted: function() {
    let cal = new CalHeatMap()
    cal.init({
      start: new Date(2017, 3),
      range: 1,
      domain: 'year',
      subDomain: 'day',
    })
  }
}

</script>
