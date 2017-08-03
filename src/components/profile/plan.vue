<template lang="html">
  <div id='plan'>

    <div class='ui small top attached header'>
      <i class="fa fa-credit-card text-primary" aria-hidden="true"></i>
      <div class="content">
        &nbsp
        Plans & Billing
      </div>
    </div>
    <div class="ui attached segment">
      <strong>Current Plan:</strong> {{ profile.plan.name }} &nbsp;
      <button class="ui tiny basic blue button" v-if='profile.plan.id == 1' @click="openPaymentModal">Upgrade to Freelancer</button>
    </div>
    <div class="ui attached segment" :class="{ bottom : profile.planid == 1 }">
        <strong>Private Storage</strong> &nbsp; {{ data_cap_fmt }} &nbsp;
    </div><!-- /.list-group-item -->
    <div v-if='profile.plan.id != 1' class="ui bottom attached segment">
      <strong>Billing Info: </strong> &nbsp;
      <button class="ui small blue basic button" @click='openPaymentModal'>Update Payment Method</button>
      <br><br>
      {{profile.customer_set[0].card_brand}} **** **** **** {{profile.customer_set[0].card_last4 }} Expiration: {{profile.customer_set[0].card_exp_month}}/{{profile.customer_set[0].card_exp_year}}<br>
      Next payment due: {{profile.customer_set[0].next_payment | moment("MMMM Do YYYY")}} <br>
      Amount: ${{profile.plan.rate}}
    </div><!-- /.list-group-item -->

    <div class='ui small top attached header' v-if='profile.plan.id != 1'>
      <i class="fa fa-minus-square text-primary" aria-hidden="true"></i>
      <div class="content">
        &nbsp Downgrade to Free
      </div>
    </div>
    <div class="ui bottom attached clearing segment" v-if='profile.plan.id != 1'>
      <div class="ui grid">
        <div class="twelve wide column">
          You can downgrade at anytime, but you will no longer be able to access your private repositories created under this plan and your private storage will be adjusted.
        </div>
        <div class="four wide column">
          <button class="ui small basic red button" @click='openCancelModal'>
            <i class="minus square icon"></i>
            Downgrade
          </button>
        </div>
      </div>
    </div>

    <div class='ui top attached small header' v-if='has_invoices'>
      <i class="fa fa-list-ol text-primary" aria-hidden="true"></i>
      <div class="content">
        &nbsp Payment History
      </div>
    </div>
    <div class="ui bottom attached segment" v-if='has_invoices'>
      <table class='ui table'>
        <thead >
          <th></th>
          <th >ID</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Payment Method</th>
        </thead>
        <tbody>
          <tr v-for='invoice in sorted_invoices'>
            <td style='text-align:center'>
              <i v-if='invoice.paid' class="green check icon" aria-hidden="true"></i>
              <i v-else class="fa fa-times text-danger fa-lg" aria-hidden="true"></i>
            </td>
            <td>{{ invoice.id }}</td>
            <td>{{ invoice.date | moment("MMMM Do YYYY") }}</td>
            <td>${{ invoice.amount / 100 }}</td>
            <td>{{ invoice.payment_method }}</td>
            <!-- <td style='text-align:center'>
              <a href="#">
                <i class="fa fa-cloud-download text-primary fa-lg" aria-hidden="true"></i>
              </a>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>

    <div class="ui small modal" id='paymentModal'>
      <div class="header">
        <i class="fa fa-credit-card text-primary" aria-hidden="true"></i>
        &nbsp
        Payment Details
      </div>
      <div class="content">
        <span v-if='is_active_customer'>
          <strong> Current Card Info </strong> <br>
          {{this.profile.customer_set[0].card_brand}} **** **** **** {{this.profile.customer_set[0].card_last4}} Expiration: {{this.profile.customer_set[0].card_exp_month}}/{{this.profile.customer_set[0].card_exp_year}} <br><br>
         </span>
        <form class="ui small form" role="form" id="payment-form">
          <span class="payment-errors"></span>
          <div class="inline field">
            <label >Card Number</label>
            <input v-model='card.number' type="text" size="35" data-stripe="number" id='card-number' placeholder="Your credit or debit card number">
          </div>
          <div class="inline fields">
            <div class="field">
              <label>Expiration</label>
              <select v-model='card.exp_month' class="ui dropdown" id="expiry-month" data-stripe="exp_month" >
                <option value=''>Month</option>
                <option value="01">Jan (01)</option>
                <option value="02">Feb (02)</option>
                <option value="03">Mar (03)</option>
                <option value="04">Apr (04)</option>
                <option value="05">May (05)</option>
                <option value="06">June (06)</option>
                <option value="07">July (07)</option>
                <option value="08">Aug (08)</option>
                <option value="09">Sep (09)</option>
                <option value="10">Oct (10)</option>
                <option value="11">Nov (11)</option>
                <option value="12">Dec (12)</option>
              </select>
            </div>
            <div class="field">
              <select v-model='card.exp_year' class="ui dropdown"  id="expiry-year" data-stripe="exp_year">
                <option value=''>Year</option>
                <option value="17">2017</option>
                <option value="18">2018</option>
                <option value="19">2019</option>
                <option value="20">2020</option>
                <option value="21">2021</option>
                <option value="22">2022</option>
                <option value="23">2023</option>
                <option value="23">2024</option>
                <option value="23">2025</option>
                <option value="23">2026</option>
                <option value="23">2027</option>
              </select>
            </div>
          </div>
          <div class="six wide inline field">
            <label>Card CVC</label>
            <input v-model='card.cvc' type="text" size='5' id="cvv" placeholder="CVC #" data-stripe='cvv'>
           </div>
          <div class="inline field">
             <label>Billing Zip</label>
             <input v-model='card.address_zip' type="text" size="8" class="form-control" id="zip" data-stripe="address_zip" placeholder="Zip Code">
           </div>
        </form>
       </div>
      <div class="actions">
         <button id='closeModal' type="button" class="ui small basic red button" @click='hidePaymentModal'>Cancel</button>
          <button v-if='is_active_customer' type="submit" class="ui button" id='submit-card' @click='submitPayment("update")' data-dismiss="modal">Update Payment Info</button>
          <button v-else type="submit" class="ui small basic blue button" id='submit-card' @click='submitPayment("create")' data-dismiss="modal">Submit Payment</button>
       </div>
    </div>

    <div class='ui modal' id='cancelModal'>
      <div class="header">
        <h3>
         Cancel OmniBuilds Subscription
       </h3>
      </div>
      <div class="content">
        <div class="ui large error message">
          <div class="header">
            Are you sure you want to cancel?
          </div>
          <p>
            You will no longer be able to access any private repositories created under this plan and your private storage will be reduced to normal.
          </p>
        </div>
      </div>
      <div class="actions">
        <button type="button" class="ui small basic blue button" @click='hideCancelModal'>Close</button>
        <button class="ui red small basic button" @click='downgradePlan' data-dismiss="modal">Cancel Plan</button>
      </div>
    </div>
  </div><!-- /.tab-pane fade in  -->
</template>

<script>
function formatBytes(bytes,decimals) {
   if(bytes == 0) return '0 Byte'
   var k = 1000
   var dm = decimals + 1 || 3
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
   var i = Math.floor(Math.log(bytes) / Math.log(k))
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// import stripe from 'stripe'


import { mapGetters } from 'vuex'

export default {
  created: function() {
    if (this.env == 'prod') {
      Stripe.setPublishableKey('pk_live_3SeBO3EpdY6OGGjbtcHdyG1j')
    } else {
      Stripe.setPublishableKey('pk_test_C0HvFMtbYemrQX7BxBWBSVQw')
    }
  },
  data() {
    return {
  		card: {
  			number: '',
  			cvc: '',
  			exp_month: '',
  			exp_year: '',
  			address_zip: '',
  		}
    }
  },
	computed: {
    ...mapGetters([
      'env',
      'session',
      'profile'
    ]),
		data_percent: function() {
			return (this.profile.data / this.profile.data_cap) * 100
		},
		data_cap_fmt: function() {
			return formatBytes(this.profile.data_cap)
		},
    is_active_customer: function() {
      if (this.profile.customer_set[0]) {
        if (this.profile.customer_set[0].active) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    has_invoices: function() {
      if (this.profile.customer_set[0]) {
        if (this.profile.customer_set[0].invoice_set.length > 0) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }

    },
    sorted_invoices: function() {
      return this.profile.customer_set[0].invoice_set.reverse()
    }
	},
	methods: {
    openPaymentModal: function() {
      $('#paymentModal').modal('show')
    },
    hidePaymentModal: function() {
      $('#paymentModal').modal('hide')
    },
    openCancelModal: function() {
      $('#cancelModal').modal('show')
    },
    hideCancelModal: function() {
      $('#cancelModal').modal('hide')
    },
		downgradePlan: function() {
			console.log('Downgrading plan')
      // change the profile plan
      // change the customer plan
      // change the plan with stripe
      let payload = {action: 'downgrade'}
			this.$http.put('customers/' + this.profile.customer_set[0].id + '/', payload).then(function(response) {
				// on success
        console.log('downgrade succeeded')
        $('#cancelModal').modal('hide')

        this.$store.dispatch('getProfile').then(success => {
          this.$router.push('/profile/plan')
        }, error => {

        })


      }, function(response) {
				// on error
        console.log('downgrade failed')
				console.log(response)
			})
		},
		submitPayment: function(action) {
      let vue = this
			let $modal = $('#paymentModal')
			// Disable the submit button to prevent repeated clicks:
			$modal.find('#submit-card').prop('disabled', true)
			// Request a token from Stripe:
			Stripe.card.createToken(this.card, stripeResponseHandler)
			function stripeResponseHandler(status, response) {
				// Grab the form:
				let $modal = $('#paymentModal')
				let $form = $('#payment-form')
				if (response.error) { // Problem!
				    // Show the errors on the form:
				    $form.find('.payment-errors').text(response.error.message)
				    $modal.find('#submit-card').prop('disabled', false) // Re-enable submission
				} else {
          // Token was created!
			    // Get the token ID:
			    let token = response.id
          let formData = new FormData()
          formData.append('stripeToken', token)
          formData.append('profile_slug', vue.profile.slug)

          // create a new customer object
          if (action === 'create') {
            vue.$http.post('customers/', formData).then(function(response) {
              // on success
              console.log(response)


              this.$store.dispatch('getProfile').then(success => {
                // $modal.find('#submit-card').prop('disabled', false) // Re-enable submission
                $('#paymentModal').modal('hide')

                vue.card = {
            			number: '',
            			cvc: '',
            			exp_month: '',
            			exp_year: '',
            			address_zip: '',
            		}
                vue.$router.push('/profile/plan')
              }, error => {

              })

            }, function(response) {
              console.log(response)
              // on error
            })

          } else if (action === 'update') {
            // detect if this is an individual or team account with an if statement, need to pass this in somehow, for now just use individual
            formData.append('action', 'update_card')
            vue.$http.put('customers/' + vue.profile.customer_set[0].id + '/', formData).then(function(response) {
                console.log(response)
                this.$store.dispatch('getProfile').then(success => {
                  // $modal.find('#submit-card').prop('disabled', false) // Re-enable submission
                  $('#paymentModal').modal('hide')
                  vue.card = {
                    number: '',
                    cvc: '',
                    exp_month: '',
                    exp_year: '',
                    address_zip: '',
                  }
                  vue.$router.push('/profile/plan')
                }, error => {

                })
            }, function(response) {
              //on error
              console.log('error')
              console.log(response)

            })
          }


				}
			}
		}
	}
}
</script>

<style lang="css">
</style>
