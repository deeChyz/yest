<template>
  <div class="restaurant-menu__block">
    <div class="restaurant-catalog__list">
      <div class="catalog__item" v-for="category in restaurant.menu"
           :key="category.cat_id"
           :class="{'catalog__item_active': category.cat_id === 1450}"
           @click="handleClickCategory(category.id)"
      >
        {{ category.name }}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      restaurant: {
        type: Object,
        default () {
          return {}
        }
      },
      selectedCategoryId: {
        type: [Number, String],
        default: 0
      }
    },
    data () {
      return {
        tab: 0,
      }
    },
    methods: {
      handleClickCategory (id) {
        this.$emit('catalogId', id);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .restaurant-menu__block {
    position: sticky;
    top: 60px;
    background-color: $white;
    z-index: 1;
    @include media($lg) {
      padding: 0 80px;
      top: 80px;
    }
  }

  .restaurant-catalog__list {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    height: 50px;
    margin-left: 12px;
    overflow-y: hidden;
    overflow-x: scroll;
    &::-webkit-scrollbar-track {
      background: $light-gray;
    }
    &::-webkit-scrollbar {
      background-color: $light-gray;
      height: 3px;
      width: 10px;
    }
    &::-webkit-scrollbar-thumb {
      height: 3px;
      background: #bfbfbf;
    }

    @include media($lg) {
      height: 70px;
      &::-webkit-scrollbar {
        height: 0;
      }
      &::-webkit-scrollbar-thumb {
        height: 0;
      }
    }
  }

  .catalog__item {
    display: flex;
    align-items: center;
    height: 32px;
    border-radius: 14px;
    line-height: 20px;
    letter-spacing: 0.5px;
    font-family: sans-serif;
    color: #a3a3a3;
    white-space: nowrap;
    cursor: pointer;
    margin-right: 10px;
    padding: 0 12px;
    &:last-child {
      margin-right: unset;
    }
    @include media($lg) {
      height: 70px;
      font-size: 16px;
      letter-spacing: 0.8px;
      border-radius: unset;
      padding: 0 16px;
    }
  }

  .catalog__item_active {
    background-color: #f1f0ed;
    color: $black;
    @include media($lg) {
      background-color: unset;
      border-bottom: 4px solid $green;
    }
  }
</style>
