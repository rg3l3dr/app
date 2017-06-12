
<template lang="html">
  <div>
    <div class='container'>
  		<div class='row'>
  			<div class='col-xs-12 col-md-3' id='plan'>
  				Plan:  {{profile.plan.name}} &nbsp
          <router-link v-if='profile.plan.name=="Free" || profile.plan.name=="Individual (free)"' to='profile/plan'>
            Upgrade
          </router-link>
  			</div>
  			<div class='col-xs-12 col-md-6' id='data'>
  				 Private Storage:  {{ data_fmt }} / {{data_cap_fmt}} &nbsp;
           <router-link to='invite'>
             Invite friends to add storage
           </router-link>
  				 <div class="progress">
  				 	<div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" :style="{ width: data_percent + '%'}">
  				 		<span class="sr-only">{{data_percent}} % Data Used</span>
  				 	</div>
  				 </div>
  			</div>
  		</div>
  	</div>
    <div class='container'>
  		<div class='row'>
  			<div class='col-md-4'>
  				<div class='row'>
  					<div class='col-xs-12' id='profile'>
  						<div class='panel panel-default'>
  							<div class="panel-heading">
  								<i class="fa fa-user text-primary" aria-hidden="true"></i>
  								&nbsp
  								My Profile
                  <router-link to='/profile/public'>
                    <button class='btn btn-default btn-xs pull-right'>
  										<i class="fa fa-gear" aria-hidden="true"></i>
  										Manage
  									</button>
                  </router-link>
  							</div>
  							<div class="panel-body">
  								<p id='profile-summary'>
  									<div class='row'>
  										<div class='col-xs-2'>
  											<img v-if='profile.picture' :src='profile.picture' style='height:40px'/>
  											<i v-else class="fa fa-user fa-3x" aria-hidden="true"></i>
  										</div>
  										<div class='col-xs-10'>
  											<h2 style='margin:auto'>{{ profile.name }}</h2>
  										</div>
  									</div>
  									<br>
  									<div class='row'>
  										<div class='col-xs-12'>
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

  										</div>
  									</div>
  								</p>
  							</div>
  						</div>
  					</div>
  				</div>
          <div class='row'>
  					<div class='col-xs-12' id='projects'>
  						<div class='panel panel-default'>
  							<div class="panel-heading">
  								<i class="fa fa-folder-open-o text-primary" aria-hidden="true"></i>
  								&nbsp
  								My Projects
                  <router-link to='/project'>
    								<button class='btn btn-default btn-xs pull-right'>
    									<i class="fa fa-plus" aria-hidden="true"> </i>
    									New Project
    								</button>
                  </router-link>
  							</div>
  							<div class="panel-body">
  								You are not a team member for any projects.
  								<br><br>
  							</div>
  						</div>
  					</div>
  				</div>
  				<div class='row'>
  					<div class='col-xs-12' id='organizations'>
  						<div class='panel panel-default'>
  							<div class="panel-heading">
  								<i class="fa fa-users text-primary" aria-hidden="true"></i>
  								&nbsp
  								My Teams
  								<button class='btn btn-default btn-xs pull-right'>
  									<i class="fa fa-plus" aria-hidden="true"> </i>
  									New Team
  								</button>
  							</div>
  							<div class="panel-body">
  								You are not a member of any organizations.
  								<br><br>
  							</div>
  						</div>
  					</div>
  				</div>
  			</div>
  			<div class='col-xs-12 col-md-8'>
  				<div class='row'>
  					<div class='col-xs-12' id='contributions'>
  						<div class='panel panel-default'>
  							<div class="panel-heading">
  								<i class="fa fa-random text-primary" aria-hidden="true"></i>
  								&nbsp
  								My Contributions
  							</div>
  							<div class="panel-body">
  								<div id="cal-heatmap">
  								</div>
  							</div>
  						</div>
  					</div>
  				</div>
  				<div class='row'>
  					<div class='col-xs-12' id='feed'>
  						<div class='panel panel-default'>
  							<div class="panel-heading">
  								<i class="fa fa-feed text-primary" aria-hidden="true"></i>
  								&nbsp
  								My Activity Feed
  							</div>
  							<div class="panel-body">
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
  	</div>
  </div>
</template>

<script>
function formatBytes(bytes,decimals) {
   if(bytes == 0) return '0 Bytes'
   var k = 1000
   var dm = decimals + 1 || 3
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
   var i = Math.floor(Math.log(bytes) / Math.log(k))
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}


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
