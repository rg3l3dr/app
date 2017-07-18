
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
import NewSpecs from './components/designs/newspecs.vue'
import Parts from './components/designs/parts.vue'
import Files from './components/designs/files.vue'
import Docs from './components/designs/docs.vue'
import Settings from './components/designs/settings/settings.vue'
import Basic from './components/designs/settings/basic.vue'
import Collaborators from './components/designs/settings/collaborators.vue'
import Specs from './components/designs/settings/specs.vue'
import Advanced from './components/designs/settings/advanced.vue'
import Configs from './components/designs/settings/configs.vue'
import Revs from './components/designs/settings/revs.vue'
import CreateDesign from './components/designs/CreateDesign.vue'

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
      designContent: NewSpecs
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
    path: '/:profile_slug/:design_slug/:change_slug',
    name: 'ChangeFullRoute',
    component: Design,
    meta: { requiresAuth: true },
    children: DesignChildren
  },
  {
    path: '/:profile_slug/:design_slug',
    redirect: '/:profile_slug/:design_slug/primary/latest/specs'
  },
  {
    path: '/:profile_slug/:design_slug/:config_slug',
    redirect: '/:profile_slug/:design_slug/:config_slug/latest/specs'
  },
  {
    path: '/:profile_slug/:design_slug/:config_slug/:rev_slug',
    redirect: '/:profile_slug/:design_slug/:config_slug/:rev_slug/specs'
  },
  {
    path: '/:profile_slug/:design_slug/:config_slug/:rev_slug?',
    name: 'DesignFullRoute',
    component: Design,
    meta: { requiresAuth: true },
    children: DesignChildren
  },

  { path: "*", component: home }
]
