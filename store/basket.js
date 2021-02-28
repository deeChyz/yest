import TagManagerHelper from "../utils/helpers/TagManagerHelper";
import * as types from "../utils/confs/store-actions/basket";

export const state = () => ({
  restaurantUrl: null,
  dishes: [],
  totalPrice: 0,
  orderId: 0
});

export const getters = {
  getDishes (state) {
    state.dishes.forEach((dish, key) => {
      if (!dish) {
        delete state.dishes[key];
      }
    });
    return state.dishes;
  },
  getRestaurantUrl (state) {
    return state.restaurantUrl;
  },
  getTotalPrice (state, getters) {
    if (!getters.getRestaurantUrl) {
      return 0;
    }

    let totalPrice = 0;

    if (state.dishes.length) {
      state.dishes.forEach(dish => {
        dish.sizes.forEach(size => {
          if (Boolean(size.count)) {
            totalPrice += parseInt(size.count * size.price);
          }
        })
      })
    }

    return totalPrice
  },
  getTotalPriceWithDelivery (state, getters) {
    if (!getters.getRestaurantUrl) {
      return 0;
    }

    const
      feeObject = getters.getRestaurantUrl.delivery.fee,
      foundedFee = feeObject.find(cost => {
        return cost.min < getters.getTotalPrice && getters.getTotalPrice < cost.max;
      });

    const additionalCost = foundedFee ?
      parseInt(foundedFee.delivery) :
      parseInt(feeObject[feeObject.length - 1].delivery);

    return getters.getTotalPrice + additionalCost;
  }
};

export const mutations = {
  [types.INCREMENT_DISH_COUNTER] (state, { id, selectedSize, selectedSizeCount }) {
    const dishToAdd = state.dishes.find(dish => dish.id === id),
      selectedDishSize = dishToAdd.sizes.find(size => size.id === selectedSize.id);

    if (dishToAdd) selectedDishSize.count = selectedDishSize.count + (selectedSizeCount ? selectedSizeCount : 1);
  },
  [types.SET_RESTAURANT_URL] (state, { url }) {
    state.restaurantUrl = url;
  },
  [types.ADD_DISH_TO_BASKET] (state, payload) { // Добавление товара в корзину в первый раз
    state.dishes.push(payload);
  },
  [types.EMPTY_BASKET] (state) {
    state.dishes = [];
  },
  [types.DECREMENT_DISH_COUNTER] (state, { id, selectedSizeIndex }) {
    const dishToDeleteIndex = state.dishes.findIndex((dish) => dish.id === id);
    if (dishToDeleteIndex !== -1) state.dishes[dishToDeleteIndex].sizes[selectedSizeIndex].count--;
  },
  [types.REMOVE_DISH_FROM_BASKET] (state, { id }) {
    const dishToDeleteIndex = state.dishes.findIndex(dish => dish.id === id);
    if (dishToDeleteIndex !== -1) state.dishes.splice(dishToDeleteIndex, 1);
  }
};

export const actions = {
  async [types.ADD_TO_BASKET] ({ commit, state }, payload) {
    const existingDish = state.dishes.find(dish => dish.id === payload.id);

    if (!existingDish) {
      const currentSelectedSize = payload.sizes.find(size => size.id === payload.selectedSize.id);

      if (currentSelectedSize) {
        currentSelectedSize.count = payload.selectedSizeCount ? payload.selectedSizeCount : 1;
        delete payload.selectedSize;
        delete payload.selectedSizeCount;
        commit(types.ADD_DISH_TO_BASKET, payload);
      }
    } else {
      const existingDishSize = existingDish.sizes.find(size => size.id === payload.selectedSize.id);
      if (existingDishSize) commit(types.INCREMENT_DISH_COUNTER, payload);
    }
    // TagManagerHelper.modifyEcommerceObject({
    //     id: payload.selectedSize.id,
    //     name: payload.name,
    //     price: payload.selectedSize.price,
    //     brand: '',
    //     category: '',
    //     quantity: 1
    //   },
    //   'add',
    //   'products',
    //   'Adding a Product to a Shopping Cart',
    //   false
    // );
  },
  [types.EMPTY_BASKET] ({ commit, state }) {
    // state.dishes.forEach(function (data) {
    //   TagManagerHelper.modifyEcommerceObject(
    //     TagManagerHelper.createProductInstance(
    //       data.selectedSize.id,
    //       data.name,
    //       data.selectedSize.price,
    //       '',
    //       '',
    //       data.selectedSize.count
    //     ),
    //     'remove',
    //     'products',
    //     'DROP_BASKET', // was DROP_BASKETt
    //     'False'
    //   );
    // });
    commit(types.EMPTY_BASKET);
    commit(types.SET_RESTAURANT_URL, { url: '' });
  },
  [types.INCREMENT_DISH_COUNTER] ({ commit }, id) {
    commit(types.INCREMENT_DISH_COUNTER, { id });
  },
  [types.DECREMENT_DISH_COUNTER] ({ commit, state }, payload) {
    const existingDish = state.dishes.find(dish => dish.id === payload.id);

    if (existingDish) {
      let existingDishSize;

      if (payload.selectedSize) {
        existingDishSize = existingDish.sizes.find(size => size.id === payload.selectedSize.id);
      } else {
        existingDishSize = existingDish.sizes.find(size => size.count > 0);
      }

      const existingDishSizeIndex = existingDish.sizes.findIndex(size => size.id === existingDishSize.id);
      delete existingDish.selectedSize;
      delete existingDish.selectedSizeCount;

      if (existingDishSize) commit(types.DECREMENT_DISH_COUNTER, Object.assign(existingDish, { selectedSizeIndex: existingDishSizeIndex }));

      if (!existingDish.sizes.reduce((sizesCount, currentSize) => sizesCount + currentSize.count, 0)) {
        commit(types.REMOVE_DISH_FROM_BASKET, existingDish);
      }

      if (!state.dishes.length) {
        commit(types.SET_RESTAURANT_URL, { url: '' });
      }
    }

    // TagManagerHelper.modifyEcommerceObject({
    //     id: payload.selectedSize.id,
    //     name: payload.name,
    //     price: payload.selectedSize.price,
    //     brand: '',
    //     category: '',
    //     quantity: 1
    //   },
    //   'add',
    //   'products',
    //   'delete a Product from Shopping Cart',
    //   false
    // );
  },
  [types.REMOVE_DISH_FROM_BASKET] ({ commit }, { id }) {
    commit(types.REMOVE_DISH_FROM_BASKET, { id });
    if (!state.dishes.length) {
      commit(types.SET_RESTAURANT_URL, { url: '' });
    }
  },
  [types.SET_RESTAURANT_URL] ({ commit }, url) {
    commit(types.SET_RESTAURANT_URL, { url });
  },
};
