import * as Cookie from 'js-cookie';
import {SET_SMS_TIMER, SET_USER_PHONE_NUMBER} from "../utils/confs/store-actions/user";

export const state = () => ({
  name: null,
  userPhoneNumber: null,
  smsTimer: 0,
});

export const actions = {
  // checkUserPhoneNumber(context) {
  //   return new Promise((resolve, reject) => {
  //     resolve(context.state.data.userPhoneNumber)
  //   });
  // },
  [SET_SMS_TIMER]({ commit }, time) {
    commit(SET_SMS_TIMER, time);
  },
  [SET_USER_PHONE_NUMBER]({ commit }, phoneNumber) {
    Cookie.set('phone', phoneNumber);
    commit(SET_USER_PHONE_NUMBER, phoneNumber);
  },
};

export const mutations = {
  [SET_SMS_TIMER](state, { time }) {
    state.smsTimer = time;
  },
  [SET_USER_PHONE_NUMBER](state, { phoneNumber }) {
    state.userPhoneNumber = phoneNumber;
  },
};

export const getters = {
  getSmsTimer(state) {
    return state.smsTimer;
  },
  getUserPhoneNumber(state) {
    return state.userPhoneNumber;
  }
};
