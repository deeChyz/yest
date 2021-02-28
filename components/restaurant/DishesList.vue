<template>
  <div class="restaurant-dishes__block">
    <div v-for="(category, index) in restaurant.menu" :key="category.id">
      <div class="category__title" :id="category.cat_id">
        <h2 :id="`category_${index}`" v-intersect="categoryNameIntersect">
          {{ category.name }} &nbsp;
        </h2>
        <span class="title-dishes-count">
          {{ category.dishes.length }}
        </span>
      </div>
      <div class="restaurant-dishes__list">
        <dish v-for="(dish, index) in category.dishes"
              :dish-info="dish"
              v-show="dish !== null ? dish.status : false"
              :key="`dish_${index}`"
              @cardClicked="onCardClick(dish)"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import Dish from "../../components/restaurant/Dish.vue";

  export default {
    props: {
      restaurant: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
        tab: 0,
      }
    },
    methods: {
      onCardClick (dish) {
        this.$emit('cardClicked', dish);
      },
      categoryNameIntersect (entries, observer, isIntersecting) {
        if (isIntersecting) {
          const visibleCategory = entries[0].target.id.split('_')
          this.tab = parseInt(visibleCategory[1])
          this.$emit('currentTab', this.tab);
        }
      },
    },
    components: {
      Dish,
    }
  }
</script>

<style lang="scss" scoped>
  .restaurant-dishes__block {
    background-color: $white;
    @include media($lg) {
      background-color: #f2f2f2;
    }
  }

  .category__title {
    color: #3F3F3F;
    font-size: 24px;
    line-height: 33px;
    font-weight: bold;
    display: flex;
    padding: 20px 0 14px 20px;
    align-items: center;
    flex-direction: row;
    @include media($lg) {
      padding: 20px 60px 0;
    }
  }

  .title-dishes-count {
    font-size: 22px;
    color: $gray-b0;
  }

  .restaurant-dishes__list {
    padding-top: 10px;
    margin-left: 10px;
    display: flex;
    flex-wrap: wrap;
    @include media($lg) {
      padding: 20px 60px;
      margin-left: 0;
    }
  }
</style>
