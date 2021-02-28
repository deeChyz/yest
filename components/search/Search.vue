<template>
  <div class="restaurants-search__block" v-if="searchText && searchText.length > 2 && dishesInfo.length > 0">
    <v-list class="search__wrapper">
      <v-list-item v-for="(item, index) in dishesInfo"
                   :key="'SearchSuggestion'+index"
                   class="search__item"
      >
        <v-list-item-content class="item__wrapper">
          <nuxt-link class="item__link"
                     :to="restaurantUrl({ name: item.name, restaurant_id: item.id })"
          >
            <img class="item__img"
                 :src="restaurantLogo(item.logo)"
                 alt=""
            >
            <div class="item__content">
              <p class="content__title">{{ item.name }}</p>
              <div class="item__categories">
                <span class="category__item"
                      v-for="(tag, index) in item.tags"
                      :key="index"
                >
                  {{ tag.name }}
                </span>
              </div>
            </div>
          </nuxt-link>
          <nuxt-link :to="restaurantUrl({ name: item.name, restaurant_id: item.id, dish_id: dish.id })"
                     class="item__link"
                     v-for="(dish, index) in item.dishes"
                     :key="index"
          >
            <div></div>
            <div class="item__content">
              <p class="content__subtitle">{{ dish.name }}</p>
              <p class="content__price">{{ dish.price }} BYN</p>
            </div>
          </nuxt-link>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
  import DishApi from "../../api/DishApi";
  import { debounce } from "vue-debounce";
  import { translitereteRusToLatin } from "../../utils/functions/transliter";
  import { mapGetters } from "vuex";
  import {
    DEFAULT_SEARCH_MODAL_IMAGE_URL,
    STORE_GET_SELECTED_ZONE
  } from "../../utils/confs/pages/restaurants";

  export default {
    props: {
      searchText: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        dishesInfo: []
      }
    },
    watch: {
      searchText () {
        this.searchRestaurants();
      }
    },
    methods: {
      restaurantUrl (restaurantInfo) {
        return '/' + this.getSelectedZone?.id + '/restaurant/' +
          restaurantInfo.restaurant_id + '-' + translitereteRusToLatin(restaurantInfo.name) +
          (restaurantInfo.dish_id ? '#dish-id-' + restaurantInfo.dish_id : '');
      },
      restaurantLogo (logoUrl) {
        return `${DEFAULT_SEARCH_MODAL_IMAGE_URL}${logoUrl}`;
      },
      searchRestaurants: debounce(async function () {
        this.dishesInfo = await DishApi.search({
          city: this.getSelectedZone?.id,
          location: [],
          search: this.searchText
        });
      }, '500ms')
    },
    computed: {
      ...mapGetters({
        getSelectedZone: STORE_GET_SELECTED_ZONE
      })
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
      top: 70px;
      left: 80px;
      right: 80px;
      z-index: 10;
      height: 400px;
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
    padding: 4px 16px;
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
    margin-bottom: 6px;
  }

  .item__categories {
    display: flex;
    flex-wrap: wrap;
    line-height: 18px;
  }
</style>
