// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueMoment from 'vue-moment'
import App from './App'
import { routes } from './routes'
import { store } from './store/store'
import { sync } from 'vuex-router-sync'
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';
// let stripe = require('stripe')

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueMoment)
Vue.config.devtools = true

Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    // Focus the element
    el.focus()
  }
})

let my_host = window.location.host
let parts = my_host.split('.')
let sub = parts[0]

console.log('Current subdomain is: ' + sub)

if (sub == 'app') {
  Vue.http.options.root = 'https://www.omnibuilds.com'
  Raven
    .config('https://cc47c177364e4ca59afc07d083c36356@sentry.io/180771')
    .addPlugin(RavenVue, Vue)
    .install();
} else {
  Vue.http.options.root = 'https://stage.omnibuilds.com'
  Raven
    .config('https://3def935f457d4f61888ad45450af3d44@sentry.io/180768')
    .addPlugin(RavenVue, Vue)
    .install();
}

Vue.http.interceptors.push((request, next) => {
  // request.headers.set('Authorization', 'Bearer eyJ0e.....etc')
  if (store.state.session.token) {
    request.headers.set('Authorization', 'JWT ' + store.state.session.token)
    request.headers.set('Accept', 'application/json')
    next()
  } else {
    console.log('No token yet')
    next()
  }
})

// Vue.http.headers.common['Access-Control-Allow-Origin'] = '*'
// Vue.http.headers.common['Access-Control-Request-Method'] = '*'

const router = new VueRouter({
  routes,
  mode: 'history',
  linkActiveClass: 'active'

  // mode: 'history',
  // scrollBehavior(to, from, savedPosition) {
  //   if (savedPosition) {
  //     return savedPosition;
  //   }
  //   if (to.hash) {
  //     return { selector: to.hash };
  //   }
  //   return {x: 0, y: 0};
  // }
})

// Some middleware to help us ensure the user is authenticated.
// router.beforeEach( function() {
//     if (store.state.route.parmas) {
//       store.commit('setRefs')
//     }
//   }
// )
// router.beforeEach((to, from, next) => {
//   if (store.state.route.params) {
//     console.log('Refs set during route navigation')
//     store.commit('setRefs')
//   } else {
//     console.log('Route not detected during navigation ')
//   }
//   next()
// })

router.afterEach(function() {
  if (store.state.route.params) {
    console.log('Refs set during route navigation')
    store.commit('setRefs')
  } else {
    console.log('Route not detected during navigation ')
  }
})

// router.afterEach((to, from, next) => {
//   if(to.params.config_slug && from.params.config_slug) {
//     if (to.params.config_slug != from.params.config_slug)
//   }
// })


router.beforeEach((to, from, next) => {
  // window.console.log('Transition', transition)

  if (to.matched.some(record => record.meta.requiresAuth) && !(store.state.session.token)) {
    console.log('Not authenticated')
    next({
      path: '/home'
      // query: { redirect: to.fullPath }
    })
  } else {
    console.log('user is authenticated')
    // store.commit('setRefs')
    // if (store.state.route.params) {
    //   console.log('Refs set during route navigation')
    //   store.commit('setRefs')
    // } else {
    //   console.log('Route not detected during navigation ')
    //   console.log(store.state.route);
    // }
    next()
  }
})

// initiate the vue-store / vue-router synch plugin
sync(store, router)

/*eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
