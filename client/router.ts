import Vue from 'vue';
import VueRouter from 'vue-router';
import FreetsPage from './components/Freet/FreetsPage.vue';
import AccountPage from './components/Account/AccountPage.vue';
import LoginPage from './components/Login/LoginPage.vue';
import NotFound from './NotFound.vue';
import GroupsPage from './components/Groups/GroupsPage.vue';
import FeedPage from './components/multifeed/feedPage.vue';

Vue.use(VueRouter);

const routes = [
  // {path: '/', name: 'Home', component: LoginPage},
  {path: '/account', name: 'Account', component: AccountPage},
  {path: '/', name: 'Login', component: LoginPage},
  {path: '/groups', name: 'Groups', component: GroupsPage},
  {path: '/feed', name: 'Feed', component: FeedPage},
  {path: '*', name: 'Not Found', component: NotFound}
];

const router = new VueRouter({routes});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from, next) => {
  if (router.app.$store) {
    if (to.name === 'Login' && router.app.$store.state.username) {
      next({name: 'Groups'}); // Go to Account page if user navigates to Login and are signed in
      return;
    }
    if (to.name === 'Account' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to Login page if user navigates to Account and are not signed in
      return;
    }
    if (to.name == 'Groups' && !router.app.$store.state.username) {
      next({name: 'Login'}); // Go to `Login page i user navigate to Groups and are not signed in
      return;
    }
    if(to.name == 'Login'  && router.app.$store.state.username) {
      next({name:'Groups'});
    }
  }

  next();
});

export default router;
