// store.js
import { createStore } from 'vuex';
import UserService from '@/services/auth.service';

export default createStore({
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    clearUser(state) {
      state.user = null;
    },
  },
  actions: {
    async fetchUser({ commit }) {
      const token = localStorage.getItem('token');
      if(!token){
        commit('setUser', null);
      }
      else {
        const user = await UserService.getCurrentUser();
        commit('setUser', user);
      }
    },
    signOut({ commit }) {
      localStorage.removeItem('token');
      commit('clearUser');
      commit('setUser', null);
    },
  },
});
