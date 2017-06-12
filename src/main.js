// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueMoment from 'vue-moment'
import App from './App'
import { routes } from './routes'
import { store } from './store/store'
// let stripe = require('stripe')

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueMoment)
Vue.config.devtools = true
Vue.http.options.root = 'https://www.omnibuilds.com'

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

// Vue.http.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:8080'
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
    next()
  }
})

/*eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
