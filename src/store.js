import Vuex from 'vuex';
import Vue from "vue";

import socketActions from './socketActions';

Vue.use(Vuex);

const ws = new WebSocket("ws://192.168.0.142:8000/ws");


const userModule = {
  state: {
    username: 'Meow',
    coins: 500,
    avatar: 'https://avatars2.githubusercontent.com/u/22221382?s=460&v=4',
  },

  actions: {
    setUser({commit}, userData) {
      commit('SET_USER_DATA', userData)
    }
  },
  mutations: {
    SET_USER_DATA(state, {username, avatarURL}) {
      state.username = username;
      state.avatar = avatarURL;
    },
  },
  getters: {
    username(state) {
      return state.username
    },
    coins(state) {
      return state.coins
    },
    avatar(state) {
      return state.avatar
    },
  },
  modules: {}
};

const gameModule = {
  state: {
    currentLeft: {
      id: undefined,
      likeCount: undefined,
      url: 'https://placekitten.com/380/200',
      text: '',
    },
    currentRight: {
      id: undefined,
      likeCount: undefined,
      url: 'https://placekitten.com/380/200',
      text: 'sdas',
    },
    raund: undefined, /* 1=1/16, 2=1/8, 3=1/4, 4=1/2, 5=final */
    stage: true, /* 1 - mozhem, 0 - ne mozhem */
    winners_id: [],
    memes_img: [],
  },
  actions: {
    socket_chooseMem: (context, mem) => {
      ws.send(socketActions.chooseMem(mem));
      context.commit('CHOOSE_MEM', mem);
    }
  },
  mutations: {
    CHOOSE_MEM(state, {id, likeCount}) {
      if (state.currentLeft.id = id)
        state.currentLeft.likeCount = likeCount;
      if (state.currentRight.id = id)
        state.currentRight.likeCount = likeCount;
    }
  },
  getters: {
    currentLeft(state) {
      return state.currentLeft;
    },
    currentRight(state) {
      return state.currentRight;
    },
    stage(state) {
      return state.stage;
    },
    raund(state) {
      return state.raund;
    },
    winners_id(winners_id) {
      return state.winners_id;
    },
    winners_img(winners_id) {
      return state.winners_img;
    },
  },
  modules: {}
};

const appModule = {
  state: {
    lastWinner: {}
  },
  actions: {},
  mutations: {},
  getters: {},
  modules: {}
};

const store = new Vuex.Store({
  state: {},
  actions: {},
  mutations: {},
  getters: {},
  modules: {
    app: appModule,
    game: gameModule,
    user: userModule
  }
});


ws.onmessage = async function ({data: msg}) {
  const action = JSON.parse(msg);
  const {type, ...data} = action;

  await store.commit(type, data);
};

export default store;
