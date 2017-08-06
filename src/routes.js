
import home from './components/home.vue'
import Search from './components/search.vue'
import dashboard from './components/dashboard.vue'
import Register from './components/accounts/Register.vue'
import Login from './components/accounts/Login.vue'
import Logout from './components/accounts/Logout.vue'
import RequestPasswordReset from './components/accounts/RequestPasswordReset.vue'
import ResetPassword from './components/accounts/ResetPassword'
import ConfirmReset from './components/accounts/ConfirmReset.vue'
import ConfirmSignup from './components/accounts/ConfirmSignup.vue'
import MyProfile from './components/profiles/MyProfile.vue'
import Public from './components/profile/public.vue'
import Account from './components/profile/account.vue'
import Plan from './components/profile/plan.vue'
import Teams from './components/profile/teams.vue'
import Designs from './components/profile/designs.vue'
import ListProfiles from './components/profiles/ListProfiles.vue'
import RetrieveProfile from './components/profiles/RetrieveProfile.vue'
import Invite from './components/invitations/invite.vue'
import Notify from './components/notifications/notify.vue'
import Unread from './components/notifications/unread.vue'
import Read from './components/notifications/read.vue'
import Send from './components/invitations/send.vue'
import Accepted from './components/invitations/accepted.vue'
import Pending from './components/invitations/pending.vue'
import Design from './components/designs/design.vue'
import Home from './components/designs/home.vue'
import Specs from './components/designs/specs.vue'
import Parts from './components/designs/newParts.vue'
import Files from './components/designs/files.vue'
import Docs from './components/designs/docs.vue'
import Settings from './components/designs/settings/settings.vue'
import Basic from './components/designs/settings/basic.vue'
import Collaborators from './components/designs/settings/collaborators.vue'
import Advanced from './components/designs/settings/advanced.vue'
import Configs from './components/designs/settings/configs.vue'
import Revs from './components/designs/settings/revs.vue'
import Builds from './components/designs/settings/builds.vue'
import CreateDesign from './components/designs/CreateDesign.vue'

let config_names = [
  'alpha',
  'beta',
  'charlie',
  'delta',
  'echo',
  'fox',
  'golf',
  'hotel',
  'india',
  'juliet',
  'kilo',
  'lima',
  'mike',
  'oscar',
  'november',
  'papa',
  'quebec',
  'romeo',
  'sierra',
  'tango',
  'uniform',
  'victor',
  'whiskey',
  'x-ray',
  'yankee',
  'zulu'
]

let DesignChildren =
[
  {
    path: 'home',
    components: {
      designContent: Home
    }
  },
  {
    path: 'specs',
    components: {
      designContent: Specs
    }
  },
  {
    path: 'parts',
    components: {
      designContent: Parts
    }
  },
  {
    path: 'files',
    components: {
      designContent: Files
    }
  },
  {
    path: 'settings',
    components: {
      designContent: Settings
    },
    children: [
      {
        path: 'basic',
        components: {
          settingsContent: Basic
        }
      },
      {
        path: 'specs',
        components: {
          settingsContent: Specs
        }
      },
      {
        path: 'collaborators',
        components: {
          settingsContent: Collaborators
        }
      },
      {
        path: 'configs',
        components: {
          settingsContent: Configs
        }
      },
      {
        path: 'builds',
        components: {
          settingsContent: Builds
        }
      },
      {
        path: 'revs',
        components: {
          settingsContent: Revs
        }
      },
      {
        path: 'advanced',
        components: {
          settingsContent: Advanced
        }
      },
    ]
  }
]

export const routes = [
  {
    path: '/',
    component: home,
  },
  {
    path: '/search',
    component: Search,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    component: MyProfile,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'public',
        components: {
          profileContent: Public
        }
      },
      {
        path: 'account',
        components: {
          profileContent: Account
        }
      },
      {
        path: 'plan',
        components: {
          profileContent: Plan
        }
      },
      {
        path: 'teams',
        components: {
          profileContent: Teams
        }
      },
      {
        path: 'designs',
        components: {
          profileContent: Designs
          }
      }
    ]
  },
  {
    path: '/invite',
    component: Invite,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'send',
        components: {
          inviteContent: Send
        }
      },
      {
        path: 'accepted',
        components: {
          inviteContent: Accepted
        }
      },
      {
        path: 'pending',
        components: {
          inviteContent: Pending
        }
      }
    ]
  },
  {
    path: '/notify',
    component: Notify,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'unread',
        components: {
          notifyContent: Unread
        }
      },
      {
        path: 'read',
        components: {
          notifyContent: Read
        }
      },
    ]
  },
  {path: '/home', component: dashboard, meta: { requiresAuth: true }},
  // {path: '/design', component: design},
  {path: '/create_design', component: CreateDesign, meta: { requiresAuth: true }},
  {path: '/accounts/register', component: Register},
  {path: '/accounts/login', component: Login},
  {path: '/accounts/logout', component: Logout},
  {path: '/accounts/request_reset', component: RequestPasswordReset},
  {path: '/accounts/reset', component: ResetPassword},
  {path: '/accounts/confirm_reset', component: ConfirmReset},
  {path: '/accounts/confirm_signup', component: ConfirmSignup},
  {path: '/accounts/profiles', component: ListProfiles},
  {
    path: '/:profile_slug',
    component: RetrieveProfile,
    meta: { requiresAuth: true },
  },
  {
    path: '/:profile_slug/:design_slug/:build_slug',
    // redirect: '/:profile_slug/:design_slug/:build_slug/parts',
    redirect: to => {
      const { hash, params, query } = to
      if (config_names.includes(params.build_slug)) {
        // on a config
        params.config_slug = params.build_slug
        return '/:profile_slug/:design_slug/:config_slug/latest/parts'
      } else {
        // on a build
        return '/:profile_slug/:design_slug/:build_slug/parts'
      }
    },
    name: 'BuildFullRoute',
    component: Design,
    meta: { requiresAuth: true },
    children: DesignChildren
  },
  {
    path: '/:profile_slug/:design_slug',
    redirect: '/:profile_slug/:design_slug/alpha/latest/parts',
    meta: { requiresAuth: true },
  },
  {
    path: '/:profile_slug/:design_slug/:config_slug/:rev_slug',
    redirect: '/:profile_slug/:design_slug/:config_slug/:rev_slug/parts',
    meta: { requiresAuth: true }
  },
  {
    path: '/:profile_slug/:design_slug/:config_slug/:rev_slug',
    name: 'DesignFullRoute',
    component: Design,
    meta: { requiresAuth: true },
    children: DesignChildren
  },


  { path: "*", component: home }
]
