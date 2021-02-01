<template>

</template>

<script>

  import { mapActions, mapGetters } from "vuex";
  import {
    STORE_GET_DISHES,
    STORE_GET_TOTAL_PRICE,
    STORE_GET_RESTAURANT_URL,
    STORE_ADD_TO_BASKET,
    STORE_DECREMENT_DISH_COUNTER,
    STORE_INCREMENT_DISH_COUNTER,
    STORE_EMPTY_BASKET,
    YEST_DELIVERY_COST
  } from "../../utils/confs/pages/basket";

  export default {
    data () {
      return {
        addTableware: true, // was add knifes
        tablewareItemsCount: 1
      }
    },
    methods: {
      ...mapActions({
        addToBasket: STORE_ADD_TO_BASKET,
        emptyBasket: STORE_EMPTY_BASKET,
        incrementDishCounter: STORE_INCREMENT_DISH_COUNTER,
        decrementDishCounter: STORE_DECREMENT_DISH_COUNTER
      }),
      onPlusButtonClick (dish) {
        this.incrementDishCounter(dish);
      },
      onMinusButtonClick (dish) {
        this.decrementDishCounter(dish);
      },
      toggleAddTablewareState () {
        this.addTableware = !this.addTableware;
      },
      incrementTablewareItemsCount () {
        this.tablewareItemsCount++;
      },
      decrementTablewareItemsCount () {
        this.tablewareItemsCount--;
        if (this.tablewareItemsCount) this.addTableware = false;
      }
    },
    computed: {
      ...mapGetters({
        getDishes: STORE_GET_DISHES,
        getTotalPrice: STORE_GET_TOTAL_PRICE,
        getRestaurantUrl: STORE_GET_RESTAURANT_URL // take delivery info from this object
      })
    }
  }
</script>

<style>

</style>
