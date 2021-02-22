<template>
  <div class="restaurant-offers__block">
    <div class="restaurant-offers__list">
      <div class="offers__item" v-for="sale in sales" :key="sale.id">
        <span class="item__logo">%</span>
        <p class="item__text-block">
          <span class="item__title">{{sale.header}}</span>
          <span class="item__text">{{sale.text}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      sales: {
        type: Array,
        default () {
          return []
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .restaurant-offers__block {
    padding: 0 16px 16px;
    background-color: $white;
    margin-bottom: 10px;
    @include media($lg) {
      padding: 0 0 10px;
      margin-bottom: 0;
      background-color: #f2f2f2;
    }
  }

  .restaurant-offers__list {
    padding: 0;
    @include media($lg) {
      padding: 40px 80px 20px;
    }
  }

  .offers__item {
    display: flex;
    align-items: center;
    border-bottom: 1px solid $x-light-gray;
    padding: 10px 0;
    box-shadow: none;
    margin-bottom: 0;
    overflow: hidden;
    background: $white;
    border-radius: 4px;
    &:last-child {
      border-bottom: none;
    }
    @include media($lg) {
      padding: 10px;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.05);
      margin-bottom: 20px;
    }
  }

  .item__logo {
    color: $white;
    font-size: 20px;
    font-weight: 600;
    line-height: 42px;
    flex: 0 0 auto;
    width: 42px;
    height: 42px;
    border: 5px solid $white;
    display: flex;
    background: #F44336;
    box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.07);
    box-sizing: content-box;
    align-items: center;
    margin-right: 12px;
    border-radius: 50%;
    justify-content: center;
    @include media($lg) {
      font-size: 30px;
      line-height: 70px;
      width: 70px;
      height: 70px;
      margin-right: 20px;
      border-radius: 4px;
      border: none;
    }
  }

  .item__text-block {
    display: flex;
    flex-direction: column;
    margin-bottom: 0;
  }

  .item__title {
    font-size: 14px;
    line-height: 1.43;
    @include media($lg) {
      font-size: 18px;
      line-height: 1.3;
    }
  }

  .item__text {
    color: $gray-b0;
    font-size: 12px;
    line-height: 1.16;
    @include media($lg) {
      font-size: 14px;
      line-height: 1.43;
    }
  }
</style>
