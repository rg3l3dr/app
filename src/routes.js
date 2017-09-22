import ConfirmResetForm from './components/accounts/auth/confirmResetForm.vue'
import ConfirmSignupForm from './components/accounts/auth/confirmSignupForm.vue'
import LoginForm from './components/accounts/auth/loginForm.vue'
import LogoutForm from './components/accounts/auth/logoutForm.vue'
import RegistrationForm from './components/accounts/auth/registrationForm.vue'
import RequestPasswordResetForm from './components/accounts/auth/requestPasswordResetForm.vue'
import ResetPasswordForm from './components/accounts/auth/resetPasswordForm.vue'

import Invitations from './components/accounts/invitations/invitations.vue'
import AcceptedInvitesTab from './components/accounts/invitations/acceptedInvitesTab.vue'
import PendingInvitesTab from './components/accounts/invitations/pendingInvitesTab.vue'
import SendInvitesTab from './components/accounts/invitations/sendInvitesTab.vue'

import Notifications from './components/accounts/notifications/notifications.vue'
import ReadNotificationsTab from './components/accounts/notifications/readNotificationsTab.vue'
import UnreadNotificationsTab from './components/accounts/notifications/unreadNotificationsTab.vue'

import ProfileSettings from './components/accounts/settings/profileSettings.vue'
import AccountTab from './components/accounts/settings/accountTab.vue'
import DesignsTab from './components/accounts/settings/designsTab.vue'
import PlanTab from './components/accounts/settings/planTab.vue'
import PublicProfileTab from './components/accounts/settings/publicProfileTab.vue'
import TeamsTab from './components/accounts/settings/teamsTab.vue'

import Search from './components/base/search.vue'
import PageNotFound from './components/base/pageNotFound.vue'
import Unauthorized from './components/base/unauthorized.vue'

import CreateDesignForm from './components/designs/createDesignForm.vue'
import Design from './components/designs/design.vue'
import HomeTab from './components/designs/homeTab.vue'
import PartsTab from './components/designs/partsTab.vue'
import FilesTab from './components/designs/filesTab.vue'
import DocsTab from './components/designs/docsTab.vue'
import SpecsTab from './components/designs/specsTab.vue'
import RevsTab from './components/designs/revsTab.vue'
import SettingsTab from './components/designs/settingsTab.vue'
import AdvancedTab from './components/designs/settings/advancedTab.vue'
import BasicTab from './components/designs/settings/BasicTab.vue'
import CollaboratorsTab from './components/designs/settings/collaboratorsTab.vue'
import RevisionsTab from './components/designs/settings/revisionsTab.vue'

import AdminDashboard from './components/profiles/adminDashboard.vue'
import PrivateProfile from './components/profiles/privateProfile.vue'
import PublicProfile from './components/profiles/publicProfile.vue'

import { store } from './store/store'

export const routes = [
  {
    path: '/',
    redirect: to => {
      if (store.state.session.active) {
        return {path: '/home'}
      } else {
        return {path: '/accounts/auth/login', component: LoginForm}
      }
    }
  },
  {path: '/accounts/auth/register', component: RegistrationForm},
  {path: '/accounts/auth/login', component: LoginForm},
  {path: '/accounts/auth/logout', component: LogoutForm},
  {path: '/accounts/auth/request_reset', component: RequestPasswordResetForm},
  {path: '/accounts/auth/reset', component: ResetPasswordForm},
  {path: '/accounts/auth/confirm_reset', component: ConfirmResetForm},
  {path: '/accounts/auth/confirm_signup', component: ConfirmSignupForm},
  {path: '/home', component: PrivateProfile, meta: { requiresAuth: true }},
  {path: '/unauthorized', component: Unauthorized},
  {path: "/404", component: PageNotFound },
  {path: '/designs/create_design', component: CreateDesignForm, meta: { requiresAuth: true }},
  {path: '/search', component: Search, meta: { requiresAuth: true }},
  {path: '/profiles/admin', component: AdminDashboard, meta: { requiresAuth: true }},
  {path: '/accounts/settings', component: ProfileSettings, meta: { requiresAuth: true },
    children: [
      {path: 'public', components: {profileContent: PublicProfileTab}},
      {path: 'account', components: {profileContent: AccountTab}},
      {path: 'plan', components: {profileContent: PlanTab}},
      {path: 'teams', components: {profileContent: TeamsTab}},
      {path: 'designs', components: {profileContent: DesignsTab}}
    ]
  },
  {path: '/accounts/invitations', component: Invitations, meta: { requiresAuth: true },
    children: [
      {path: 'send', components: {inviteContent: SendInvitesTab}},
      {path: 'accepted', components: {inviteContent: AcceptedInvitesTab}},
      {path: 'pending', components: {inviteContent: PendingInvitesTab}}
    ]
  },
  {path: '/accounts/notifications', component: Notifications, meta: { requiresAuth: true },
    children: [
      {path: 'unread', components: {notifyContent: UnreadNotificationsTab}},
      {path: 'read', components: {notifyContent: ReadNotificationsTab}},
    ]
  },
  {path: '/:profile_slug', component: PublicProfile, meta: { requiresAuth: true },
  },
  {
    path: '/:profile_slug/:design_slug',
    redirect: '/:profile_slug/:design_slug/latest/home',
    meta: { requiresAuth: true },
  },
  {
    path: '/:profile_slug/:design_slug/:revision_slug',
    redirect: '/:profile_slug/:design_slug/latest/home',
    name: 'DesignFullRoute',
    component: Design,
    meta: { requiresAuth: true },
    children: [
      {path: 'home', components: {designContent: HomeTab}},
      {path: 'parts', components: {designContent: PartsTab}},
      {path: 'files', components: {designContent: FilesTab}},
      {path: 'specs', components: {designContent: SpecsTab}},
      {path: 'revs', components: {designContent: RevsTab}},
      {path: 'settings', components: {designContent: SettingsTab},
        children: [
          {path: 'basic', components: {settingsContent: BasicTab}},
          {path: 'collaborators', components: {settingsContent: CollaboratorsTab}},
          {path: 'revisions', components: {settingsContent: RevisionsTab}},
          {path: 'advanced', components: {settingsContent: AdvancedTab}},
        ]
      }
    ]
  }
]
