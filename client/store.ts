import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: null, // Username to filter shown freets by (null = show all)
    myfreets:[],
    freets: [], // All freets created in the app
    username: null, // Username of the logged in user
    userId: null,
    groupId: null,
    searching: false,
    alerts: {}, // global success/error messages encountered during submissions to non-visible forms
    groups: [], // all groups of a user
    isSearch: false,
    isInAccount: false,
    searchedWord: null,
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    setGroupId(state, groupId) {
      state.groupId = groupId;
    },
    updateMyFreets(state, myfreets) {
      state.myfreets = myfreets;
    },
    async refreshMyFreets(state) {
      const url = `/api/freets?author=${state.username}`
      const res = await fetch(url).then(async r => r.json());
      console.log(res);
      state.myfreets = res;
      
    },
    setUserId(state, userId) {
      state.groupId = userId;
    },
    updateGroups(state, groups) {
      state.groups = groups;
    },
    updateIsSearch(state, isSearch){
      state.isSearch = isSearch;
    },
    updateIsInAccount(state, isInAccount){
      state.isInAccount = isInAccount;
    },
    updateSearchedWord(state, word){
      state.searchedWord = word;
    },
    async refreshGroups(state){
      const url = `/api/groups`;
      const r = await fetch(url);
      const res = await r.json();
      if(!r.ok){
          throw new Error(res.error);
      }
      state.groups = res;
      
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? `/api/users/${state.filter}/freets` : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      state.freets = res;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
