<template lang="html">
  <div class='container'>
  	<div class='row'>
  		<div class="col-xs-3">
  			<div class='panel panel-default'>
  				<div class="panel-heading">
  					<i class="fa fa-paper-plane-o text-primary" aria-hidden="true"></i>
  					&nbsp
  					Invitations
  				</div>
  				<div class="panel-body">
  					<ul class="nav nav-pills nav-stacked">
  						<li class='active'>
  							<a href="#send" data-toggle="pill">
  								<i class="fa fa-envelope"></i>
  								&nbsp; Send Invitations
  							</a>
  						</li><!-- /.active -->
  						<li>
  							<a href="#pending" data-toggle="pill">
  								<i class="fa fa-ellipsis-h"></i>
  								&nbsp; Pending Invitations
                  <span v-if='pending_invites.length > 0'>
                    <span class='badge'>
  										{{ pending_invites.length }}
  									</span>
                  </span>
  							</a>
  						</li>
  						<li>
  							<a href="#accepted" data-toggle="pill">
  								<i class="fa fa-check"></i>
  								&nbsp; Accepted Invitations
                  <span v-if='accepted_invites.length > 0'>
                    <span class='badge'>
  										{{ accepted_invites.length }}
  									</span>
                  </span>
  							</a>
  						</li>
  					</ul><!-- /.nav nav-pills nav-stacked -->
  				</div>
  			</div>
  		</div><!-- /.col-xs-3 -->
  		<div class="col-xs-9">
  			<div class="tab-content">
  				<div class="tab-pane fade in active" id='send'>
  					<div class='panel panel-default'>
  						<div class="panel-heading">
  							<i class="fa fa-envelope text-primary" aria-hidden="true"></i>
  							&nbsp
  							Send Invitations
  						</div>
  						<div class="panel-body">
  							<div class='col-xs-10' id='invites'>
  								<h1> Invite friends via email</h1>
  								<p class='lead'> Get 100 MB of private storage for each friend who joins </p>
  								<form>
  									<div
                      class='form-group has-feedback'
                      :class="{
                        'has-success': invite.isValid,
                        'has-error': invite.isValid == false || invite.hasError
                        }"
                      v-for='(invite, index) in invites'>
  										<input
                        v-model='invite.email'
                        type='email'
                        class='form-control'
                        placeholder='Enter an email'
                        v-on:keydown='validateInvite(index)'
                      >
                      <span
                        v-if='invite.isValid'
                        class="glyphicon glyphicon-ok form-control-feedback"
                        aria-hidden="true">
                      </span>
                      <span
                        v-else-if='invite.hasError || invite.isValid == false'
                        class="glyphicon glyphicon-remove form-control-feedback"
                        aria-hidden="true">
                      </span>
                      <span
                        v-if='invite.isValid'
                        class="help-block"
                        >Invitation is ready to be sent!
                      </span>
                      <span
                        v-if='invite.isValid == false || invite.hasError'
                        class="help-block"
                        >{{ invite.error }}
                      </span>
  									</div>
  									<input type='button' id='addAnother' value='Add Another' class='btn btn-success' @click.prevent='addInvite'>
  									&nbsp;
								    <input
                      type='submit'
                      value='Send Invites'
                      id='sendInvites'
                      class='btn btn-primary'
                      @click.prevent='submitInvites'
                      :disabled='valid_invites.length === 0 || invalid_invites.length > 0'>
                    <p v-if='hasErrors' style='color:#a94442'><br>
                      One or more of your invitations has errors, please correct and resubmit
                    </p>
  								</form>

                  <!-- Modal -->
                  <div class="modal fade" id="successModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h4 class="modal-title" id="myModalLabel">Invitations Successful!</h4>
                        </div>
                        <div class="modal-body">
                          <p>
                          The following friends have been sent invites to OmniBuilds:
                          <br><br>
                          <span v-for='invite in valid_invites'>
                            <a :href="'mailto:' + invite.email"> {{invite.email}} </a> <br>
                          </span>
                          <hr>
                          For each friend who accepts an invite and creates an account on OmniBuilds, you will receive 100 MB of private storage! <br>
                          <p>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Modal -->
                  <div class="modal fade" id="failureModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h4 class="modal-title" id="myModalLabel">There was a problem...</h4>
                        </div>
                        <div class="modal-body">
                          <p v-if='valid_invites.length > 0'>
                            The following friends have been sent invites to OmniBuilds:
                            <br><br>
                            <span v-for='invite in valid_invites'>
                              <a :href="'mailto:' + invite.email"> {{invite.email}} </a> <br>
                            </span>
                            <hr>
                          </p>

                          <p v-if='invalid_invites.length > 0'>
                            The following friends could not be invited to OmniBuilds:
                            <br><br>
                            <span v-for='invite in valid_invites'>
                              <a :href="'mailto:' + invite.email"> {{invite.email}} </a> <br>
                            </span>
                            <hr>
                          </p>

                          <p>
                          For each friend who accepts an invite and creates an account on OmniBuilds, you will receive 100 MB of private storage! <br>
                          <p>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
                        </div>
                      </div>
                    </div>
                  </div>

  							</div>
  						</div>
  					</div>
  				</div><!-- /.tab-pane fade in active -->
  				<div class="tab-pane fade in" id='pending'>
  					<div class='panel panel-default'>
  						<div class="panel-heading">
  							<i class="fa fa-ellipsis-h text-primary" aria-hidden="true"></i>
  							&nbsp
  							Pending Invitations
  						</div>
  						<div class="panel-body">
                <span v-if='pending_invites.length > 0'>
  							  <table class='table'>
  								<thead>
  									<tr>
  										<th>Email</th>
  										<th>Invited On</th>
  										<th>Expired</th>
  										<th>Resend</th>
  									</tr>
  								</thead>
  								<tbody>
										<tr v-for='invite in pending_invites'>
											<td>{{ invite.email }}</td>
											<td>{{ invite.created | moment("MMMM Do YYYY") }}</td>
                      <span v-if='invite.expired'>
                        <td>Yes</td>
												<td><a href='#'>Resend</a></td>
                      </span>
                      <span v-else>
                        <td>No</td>
												<td></td>
                      </span>
										</tr>
  								</tbody>
  							</table>
                </span>
                <span v-else>
                  <p>You do not have any pending invitations yet.  Invite more friends!</p>
                </span>
  						</div>
  					</div>
  				</div><!-- /.tab-pane fade in  -->
  				<div class="tab-pane fade in" id='accepted'>
  					<div class='panel panel-default'>
  						<div class="panel-heading">
  							<i class="fa fa-check text-primary" aria-hidden="true"></i>
  							&nbsp
  							Accepted Invitations
  						</div>
  						<div class="panel-body">
                <span v-if='accepted_invites.length > 0'>
  						  	<table class='table'>
  								<thead>
  									<tr>
  										<th>Email</th>
  										<th>Invited On</th>
  										<th>Accepted On</th>
  										<th>Joined</th>
  									</tr>
  								</thead>
  								<tbody>
										<tr v-for='invite in accepted_invites'>
											<td>{{ invite.email }}</td>
											<td>{{ invite.sent | moment("MMMM Do YYYY")}}</td>
											<td>{{ invite.created | moment("MMMM Do YYYY") }}</td>
											<td>
                        <span v-if='invite.accepted'>
                          Yes
                        </span>
                        <span v-else>
                          No
                        </span>
											</td>
										</tr>
  								</tbody>
  							</table>
                </span>
                <span v-else>
                  <p> You do not have any accepted invitations yet.  Invite more friends!</p>
                </span>
  						</div>
  					</div>
  				</div><!-- /.tab-pane fade in  -->
  			</div><!-- /.tab-content -->
  		</div><!-- /.col-xs-9 -->
  	</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  created: function() {
    this.$store.commit('getProfile')
  },
  data() {
    return {
      hasErrors: null,
      invites: [
  			{
  				'email': '',
          'isValid': null,
          'hasError': null,
          'error': null,
          'timer': 0
  			},
  			{
          'email': '',
          'isValid': null,
          'hasError': null,
          'error': null,
          'timer': 0
  			},
  			{
          'email': '',
          'isValid': null,
          'hasError': null,
          'error': null,
          'timer': 0
  			}
  		],
    }
  },
  computed: {
    ...mapGetters([
      'session',
      'profile'
    ]),
    pending_invites: function() {
      return this.profile.owner.invitation_set.filter(function (invite) {
        return invite.accepted === false
      })
    },
    accepted_invites: function() {
      return this.profile.owner.invitation_set.filter(function (invite) {
        return invite.accepted === true
      })
    },
    valid_invites: function() {
      return this.invites.filter(function (invite) {
        return invite.isValid === true && invite.hasError === null
      })
    },
    invalid_invites: function() {
      return this.invites.filter(function (invite) {
        return invite.isValid === false || invite.hasError === true
      })
    },

	},
  methods: {
    // user may add up to 6 emails at a time
    addInvite: function() {
      let new_invite = {
        'email': '',
        'isValid': null,
        'hasError': null,
        'error': null,
        'timer': 0
      }
      if (this.invites.length < 6) {
        this.invites.push(new_invite)
        if (this.invites.length === 6) {
          $('#addAnother').prop('disabled', true)
        }
      }
    },

    // ToDo
      // add a loading wheel to let user know input is being validated (fa gear spinner)

    validateInvite: function (index) {
      clearTimeout(this.invites[index].timer)
      var self = this
      this.invites[index].timer = setTimeout(function() {
        var invite = self.invites[index]
        let valid_email = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(invite.email)
        invite.isValid = null
        invite.hasError = null
        invite.error = null
        if (invite.email === "") {
          return
        }
        else if (valid_email) {
          // check if email is tied to an active user
          self.$http.get('emails/' + invite.email + '/').then(response => {
            console.log('Email is already taken')
            invite.isValid = false
            invite.error = 'This email is already associated with a OmniBuilds user'
          }, response => {
            console.log('Email is not being used by a user')
            // check if email is tied to a pending invite
            self.$http.get('invites/' + invite.email + '/').then(response => {
              console.log('Email is already tied to an invite')
              invite.isValid = false
              invite.error = 'This email is already associated with a pending invitation'
            }, response => {
              console.log('Email is not tied to an existing invite')
              invite.isValid = true
            })
          })
        } else {
          invite.isValid = false
          invite.error = 'Not a valid email address'
        }
      }, 1000)
    },
    submitInvites: function () {
      let vue = this
      var payload = {
        user: this.session.user_id,
        emails: []
      }
      for (let invite of this.valid_invites) {
          payload.emails.push(invite.email)
        }
      console.log(payload)

      vue.$http.post('custom_invites/', payload).then(response => {
        console.log('Invitations sent')
        console.log(response)
        $('#successModal').modal('show')
        $('#successModal').on('hidden.bs.modal', function (e) {
          vue.$router.push('/')
        })
      }, response => {
        console.log('Error sending invitations')
        console.log(response)
        for (var failed_invite in response.body.invalid_invites) {
          for (var invite in this.invites) {
            if (invite.email === failed_invite.email) {
              invite.hasError = true
              invite.error = failed_invite.error
            }
          }
        }
        for (var successful_invite in response.body.valid_invites) {
          for (var invite in this.invites) {
            if (invite.email === successful_invite.email) {
              invite.email = ''
              invite.isValid = null
              invite.hasError = null
              invite.error = null
              invite.timer = 0
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="css">
</style>
