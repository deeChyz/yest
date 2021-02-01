<template>
  <div class="restaurants-search__block" v-if="searchText && searchText.length > 2 && showData.length > 0">
    <v-list class="search__wrapper">
      <v-list-item v-for="(item, index) in showData"
                   :key="'SearchSuggestion'+index"
                   class="search__item"
      >
        <v-list-item-content class="item__wrapper">
          <nuxt-link :to="restaurantUrl({name: item.name, restaurant_id: item.id})"
                     class="item__link"
          >
            <img class="item__img"
                 :src="restaurantLogo(item)"
                 alt=""
            >
            <div class="item__content">
              <p class="content__title">{{item.name}}</p>
              <div class="item__categories">
                <span class="category__item"
                      v-for="(tag, index) in item.tags"
                      :key="index"
                >
                  {{tag.name}}
                </span>
              </div>
            </div>
          </nuxt-link>
          <nuxt-link :to="restaurantUrl({name: item.name, restaurant_id: item.id, dish_id: dish.id})"
                     class="item__link"
                     v-for="(dish, index) in item.dishes"
                     :key="index"
          >
            <div class="item__content">
              <p class="content__subtitle">{{dish.name}}</p>
              <p class="content__price">{{dish.price}} BYN</p>
            </div>
          </nuxt-link>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
  export default {
    props: {
      searchText: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        showData: []
      }
    },
    methods: {
      restaurantUrl (obj) {

      },
      restaurantLogo (item) {

      }
    }
  }
</script>
<style lang="scss" scoped>
  .restaurants-search__block {
    position: fixed;
    top: 53px;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    z-index: 10;
    overflow: auto;
    max-height: initial;
    box-shadow: none;
    @include media($lg) {
      position: absolute;
      top: 46px;
      left: 80px;
      right: 80px;
      z-index: 10;
      max-height: 400px;
      box-shadow: 0 0 40px 0 rgba(0, 0, 0, 0.1);
      background: $white;
      border-radius: 4px;
    }
  }
  .search__wrapper {
    padding: 0;
  }

  .search__item {
    padding: 6px 0;
    border-bottom: 1px solid $gray-dd;
  }

  .item__wrapper {
    padding: 0;
  }

  .item__link {
    display: grid;
    grid-template-columns: 36px 1fr;
    grid-column-gap: 16px;
    padding: 6px 16px;
    text-decoration: none;

    &:hover {
      background-color: #efefef;
    }
  }

  .item__img {
    width: 36px;
    border-radius: 8px;
    overflow: hidden;
  }

  .content__title {
    font-size: 20px;
    line-height: 18px;
    font-weight: bold;
    color: #262626;
    margin-bottom: 1px !important;
  }

  .category__item {
    color: $gray-b0;
    font-size: 14px;
    margin-right: 10px;
    position: relative;

    &:after {
      content: "";
      position: absolute;
      top: 50%;
      left: calc(100% + 6px);
      transform: translateY(-50%);
      display: block;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background-color: $gray-dd;
    }

    &:last-child {
      &:after {
        display: none;
      }
    }
  }

  .content__subtitle {
    line-height: 18px;
    color: #262626;
    margin-bottom: 1px !important;
  }

  .content__price {
    color: $gray-b0;
    font-size: 14px;
  }
</style>
