import TagManagerHelper from "../utils/helpers/TagManagerHelper";
import * as types from "../utils/confs/store-actions/basket";

export const state = () => ({
  restaurantUrl: null,
  dishes: [],
  totalPrice: 0,
  orderId: 0
})

export const getters = {
  getLatestRestInfoWithOrder (state) {
    return state.restaurantUrl;
  },
  getDishes (state) {
    state.dishes.forEach((dish, key) => {
      if (!dish) {
        delete state.dishes[key];
      }
    }) // что бля ?
    return state.dishes;
  },
  getRestaurantUrl (state) {
    return state.restaurantUrl;
  },
  getTotalPrice (state) {
    const dl = state.dishes;
    const totalPrice = 2;

    // Проверить работу дальнейшего кода

    // if (dl !== null && dl.length > 0) {
    //   dl.forEach((element) => {
    //     let info = (element).selectedSize
    //     console.log('info:', info)
    //     totalPrice += info.price * info.count
    //     //   if (element.selectOption.length > 0) {
    //     //     element.selectOption.forEach(option => {
    //     //       if (option.selected.length > 1) {
    //     //         option.selected.forEach(opti => {
    //     //           totalPrice += opti.price == null ? 0 : opti.price[0].price
    //     //         })
    //     //       } else {
    //     //         totalPrice += option.selected.price == null ? 0 : option.selected.price[0].price
    //     //       }
    //     //     })
    //     //     console.error(totalPrice);
    //     //   }
    //   })
    // }

    return totalPrice
  },
  getTotalPriceWithDelivery (state) {
    let [totalPrice, mass, addDeliveryPrice] = [
      0, !state.restuarantUrl ? 0 : state.restuarantUrl.delivery.fee, 0
    ];
    state.dishes.forEach(element => {
      totalPrice += element.selectedSize.price * element.selectedSize.count;
    });
    // TODO: переписать эту хуйню c 63 gj 78 cnhjxrb
    if (mass) {
      function la(mass) {
        let finded = mass.find((cost) => {
          return cost.min < totalPrice && totalPrice < cost.max;
        })
        if (finded !== undefined) {
          return parseInt(finded.delivery);
        } else {
          return parseInt(mass[mass.length - 1].delivery);
        }
      }
      addDeliveryPrice = la(mass);
    } else {
      addDeliveryPrice = 0;
    }
    return parseFloat(totalPrice) + addDeliveryPrice;
  }
};

export const mutations = {
  [types.INCREMENT_DISH_COUNTER] (state, { id }) {
    const dishToAddIndex = state.dishes.findIndex(dish => dish.id === id);
    if (dishToAddIndex !== -1) state.dishes[dishToAddIndex].selectedSize.count++;
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
  [types.DECREMENT_DISH_COUNTER] (state, { id }) {
    const dishToDeleteIndex = state.dishes.findIndex((dish) => dish.id === id);
    if (dishToDeleteIndex !== -1) state.dishes[dishToDeleteIndex].selectedSize.count--;
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
      commit(types.ADD_DISH_TO_BASKET, payload);
    } else {
      // const dishSizesEquals = existingDish.selectedSize.id === payload.selectedSize.id;
      // if (!dishSizesEquals) {
      //   commit(types.ADD_DISH_TO_BASKET, payload);
      // } else {
      //   commit(types.INCREMENT_DISH_COUNTER, payload);
      // }
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
    state.dishes.forEach(function (data) {
      TagManagerHelper.modifyEcommerceObject(
        TagManagerHelper.createProductInstance(
          data.selectedSize.id,
          data.name,
          data.selectedSize.price,
          '',
          '',
          data.selectedSize.count
        ),
        'remove',
        'products',
        'DROP_BASKET', // was DROP_BASKETt
        'False'
      );
    });
    commit(types.EMPTY_BASKET);
    commit(types.SET_RESTAURANT_URL, { url: '' });
  },
  [types.INCREMENT_DISH_COUNTER] ({ commit }, id) {
    commit(types.INCREMENT_DISH_COUNTER, { id });
  },
  [types.DECREMENT_DISH_COUNTER] ({ commit }, payload) {
    const [existingDish, existingDishIndex] = [
      state.dishes.find(dish => dish.id === payload.id),
      state.dishes.findIndex(dish => dish.id === payload.id)
    ];

    if (existingDish) {
      const [dishSize, dishSizesEquals] = [
        state.dishes[existingDishIndex].selectedSize,
        dishSize.id === payload.selectedSize.id
      ];

      if (dishSizesEquals) {
        if (state.dishes[existingDishIndex].selectedSize.count - 1 < 1) {
          //todo: removeFromBasket?
          commit('removeFromBasket', existingDish);
        } else {
          commit(types.DECREMENT_DISH_COUNTER, payload);
        }
      }
      if (!state.dishes.length) {
        commit(types.SET_RESTAURANT_URL, { url: '' });
      }
    }

    TagManagerHelper.modifyEcommerceObject({
        id: payload.selectedSize.id,
        name: payload.name,
        price: payload.selectedSize.price,
        brand: '',
        category: '',
        quantity: 1
      },
      'add',
      'products',
      'delete a Product from Shopping Cart',
      false
    );
  },
  [types.REMOVE_DISH_FROM_BASKET] ({ commit }, id) {
    commit(types.REMOVE_DISH_FROM_BASKET, { id });
  },
  [types.SET_RESTAURANT_URL] ({ commit }, url) {
    commit(types.SET_RESTAURANT_URL, { url });
  },
};
