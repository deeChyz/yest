import { SET_CATEGORIES, SET_CATEGORY_INFO, SET_CATEGORY } from "../utils/confs/store-actions/restaurant";

export const state = () => ({
  categories: [],
  categoryInfo: null,
  category: null
});

export const getters = {
  getCategories(state) {
    return state.categories;
  },
  getCategoryInfo(state) {
    return state.categoryInfo;
  }
};

export const mutations = {
  [ SET_CATEGORIES ](state, payload) {
    state.categories = payload;
  },
  [ SET_CATEGORY_INFO ](state, payload) {
    state.categoryInfo = payload;
  }
};

export const actions = {
  [ SET_CATEGORIES ]({ commit }, payload) {
    commit(SET_CATEGORIES, payload);
  },
  [ SET_CATEGORY_INFO ]({ commit }, payload) {
    commit(SET_CATEGORY_INFO, payload);
  }
};

