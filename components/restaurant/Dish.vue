<template>

</template>

<script>
  import { mapActions } from "vuex";
  import {
    STORE_ADD_TO_BASKET,
    STORE_DECREMENT_DISH_COUNTER,
    STORE_REMOVE_DISH_FROM_BASKET
  } from "../../utils/confs/pages/restaurant";

  export default {
    props: {
      dish: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {}
    },
    methods: {
      ...mapActions({
        addDishToBasket: STORE_ADD_TO_BASKET,
        removeDishFromBasket: STORE_REMOVE_DISH_FROM_BASKET,
        decrementDishCounter: STORE_DECREMENT_DISH_COUNTER
      }),
      onCardClick () {
        this.$emit('cardClicked', this.dish);
      },
      onPlusButtonClick () {
        if (this.dishHasMoreThanOneSize) {
          this.onCardClick();
        } else {
          this.addDishToBasket(this.dish);
        }
      },
      onMinusButtonClick () {
        if (this.overallSizesCounter === 1) {
          this.removeDishFromBasket(this.dish);
        } else {
          this.decrementDishCounter(this.dish);
        }
      }
    },
    computed: {
      overallSizesCounter () {
        return this.dish.sizes.reduce((sizesCount, currentSize) => sizesCount + currentSize.count, 0);
      },
      dishHasMoreThanOneSize () {
        return this.dish.sizes.length > 1;
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
