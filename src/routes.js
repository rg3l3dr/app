
import home from './components/home.vue'
import dashboard from './components/dashboard.vue'
import Register from './components/accounts/Register.vue'
import Login from './components/accounts/Login.vue'
import Logout from './components/accounts/Logout.vue'
import ResetPassword from './components/accounts/ResetPassword.vue'
import MyProfile from './components/profiles/MyProfile.vue'
import Public from './components/profile/public.vue'
import Account from './components/profile/account.vue'
import Plan from './components/profile/plan.vue'
import Teams from './components/profile/teams.vue'
import Projects from './components/profile/projects.vue'
import ListProfiles from './components/profiles/ListProfiles.vue'
import RetrieveProfile from './components/profiles/RetrieveProfile.vue'
import Invite from './components/invitations/invite.vue'
import Notify from './components/notifications/notify.vue'
import Unread from './components/notifications/unread.vue'
import Read from './components/notifications/read.vue'
import Project from './components/project.vue'
import Send from './components/invitations/send.vue'
import Accepted from './components/invitations/accepted.vue'
import Pending from './components/invitations/pending.vue'
// import { store } from './store/store'

export const routes = [
  {
    path: '/',
    component: home,
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
        path: 'projects',
        components: {
          profileContent: Projects
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
  {path: '/project', component: Project},
  {path: '/accounts/register', component: Register},
  {path: '/accounts/login', component: Login},
  {path: '/accounts/logout', component: Logout},
  {path: '/accounts/reset', component: ResetPassword},
  {path: '/accounts/profiles', component: ListProfiles},
  {path: '/:profile_name', component: RetrieveProfile}


    // {path: '*', redirect: '/'}
]
