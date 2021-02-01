import { SET_ZONES, SET_SELECTED_ZONE } from "../utils/confs/store-actions/zone";
import ZoneApi from "../api/ZoneApi";

export const state = () => ({
  zones: [],
  selectedZone: {},
  status: 0
});

export const getters = {
  getSelectedZone(state) {
    return state.selectedZone;
  },
  getZoneList(state) {
    return state.zones;
  }
};

export const mutations = {
  [ SET_ZONES ](state, payload) {
    state.zones = payload;
  },
  [ SET_SELECTED_ZONE ](state, payload) {
    state.selectedZone = payload;
  }
};

export const actions = {
  async [ SET_ZONES ]({ commit }, payload) {
    commit(SET_ZONES, payload);
  },
  [ SET_SELECTED_ZONE ]({ commit }, payload) {
    commit(SET_SELECTED_ZONE, payload)
  },

  // Вынести отсюда этот метод
  // async checkDeliveryAddress(context, payload) {
  //     await ApiService.post('/check_delivery_address', payload).then((res)=>{
  //         console.log('checkDeliveryAddress -> res', res)
  //
  //         }).catch((err)=>{
  //           console.error(err);
  //         })
  //     }
};
