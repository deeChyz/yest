<template>
  <div class="restaurant__main-container">
    <div class="restaurant__header" v-if="isMobile">
      <div class="header__icon">
        <v-icon class="material-icon" @click="$router.back()">arrow_back</v-icon>
      </div>
      <h1 v-show="showRestaurantName" class="header__title">
        {{ restaurant.name }}
      </h1>
    </div>
    <div class="restaurant__block">
      <Preview class="restaurant__preview"
               :restaurant="restaurant"
               :is-mobile="isMobile"/>
      <Menu class="restaurant__menu"
            :current-tab="currentTab"
            :restaurant="restaurant"/>
      <Offers class="restaurant__offers"
              :sales="restaurant.salesText"/>
      <DishesList class="restaurant__dishes-list"
                  :restaurant="restaurant"
                  @currentTab="currentTabEvent"
                  @cardClicked="onDishCardClicked"/>
    </div>
    <MyOrder :restaurant="restaurant"
             :is-mobile="isMobile"
             :selected-dish="selectedDish"
    />
    <DishShowModal v-if="showDishInfoModal"
                   :dish="selectedDish"
                   @close="toggleDishInfoModal"
                   @addButtonClicked="onAddButtonClick"
    />
  </div>
</template>

<script>
  import Preview from "../../components/restaurant/Preview.vue";
  import Menu from "../../components/restaurant/Menu.vue";
  import Offers from "../../components/restaurant/Offers.vue";
  import DishesList from "../../components/restaurant/DishesList.vue";
  import MyOrder from "../../components/order/MyOrder.vue";
  import DishShowModal from "../../components/restaurant/DishShowModal";

  // need to watch on dishes in basket(vuex) and filter array of dishes every time

  import RestaurantApi from "../../api/RestaurantApi";
  import ZoneApi from "../../api/ZoneApi";
  import {
    mapActions,
    mapGetters
  } from "vuex";
  import { DEFAULT_REDIRECT_URL } from "../../utils/confs/shared";
  import {
    STORE_GET_SELECTED_ZONE,
    STORE_SET_SELECTED_ZONE,
    STORE_SET_ZONES
  } from "../../utils/confs/pages/restaurants";
  import {
    STORE_ADD_TO_BASKET,
    STORE_SET_RESTAURANT_URL,
    STORE_GET_RESTAURANT_URL
  } from "../../utils/confs/pages/restaurant";
  import {
    STORE_GET_DISHES
  } from "../../utils/confs/pages/basket";

  import deviceMixin from "../../utils/mixins/deviceMixin";

  export default {
    mixins: [ deviceMixin ],
    data () {
      return {
        restaurant: null,
        showRestaurantName: false,
        selectedDish: null,
        showDishInfoModal: false,
        currentTab: 0,
      }
    },
    async asyncData ({ store, params, redirect }) {
      const zoneList = await ZoneApi.getZones();
      store.dispatch(STORE_SET_ZONES, zoneList);
      let currentZone = store.getters[STORE_GET_SELECTED_ZONE];

      if (!currentZone || (currentZone && !currentZone.id)) {
        if (zoneList && zoneList.length) {
          currentZone = zoneList.find(zone => zone.alias === params.region);
        } else {
          redirect(DEFAULT_REDIRECT_URL);
        }
      }
      store.dispatch(STORE_SET_SELECTED_ZONE, currentZone);

      const restaurantId = params.restaurantName && params.restaurantName.split('-').length ? params.restaurantName.split('-')[0] : 0;

      if (!restaurantId) {
        redirect(DEFAULT_REDIRECT_URL);
      }

      const restaurant = await RestaurantApi.getRestaurantInfo(restaurantId, { zone_id: currentZone.id });

      return  {
        restaurant
      }
    },
    watch: {
      'getDishes': {
        handler () {
          this.setLastRestaurantUrl();
        },
        deep: true
      }
    },
    mounted() {
      document.documentElement.scrollTop = 0;
      window.addEventListener('scroll', this.handleScroll);
    },
    beforeDestroy() {
      window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
      handleScroll () {
        let lastTopScroll = 0;
        const pageHeight = window.pageYOffset || document.documentElement.scrollTop;

        this.showRestaurantName = pageHeight > 30;
        lastTopScroll = pageHeight <= 0 ? 0 : pageHeight;
      },
      ...mapActions({
        addDishToBasket: STORE_ADD_TO_BASKET,
        setRestaurantUrl: STORE_SET_RESTAURANT_URL
      }),
      onDishCardClicked (dish) {
        this.selectedDish = dish; // u have to pass selected dish to dish info modal
        this.toggleDishInfoModal();
      },
      toggleDishInfoModal () {
        this.showDishInfoModal = !this.showDishInfoModal;
        if (!this.showDishInfoModal) this.resetSelectedDish();
      },
      resetSelectedDish () {
        this.selectedDish = null;
      },
      onAddButtonClick () {
        this.toggleDishInfoModal();
      },
      onAddDishToBasketButtonClick (dish) {  // call this method when button 'add' in modal clicked(eventname: addButtonClicked)
        this.addDishToBasket(dish);
      },
      setLastRestaurantUrl () { // use after dish list was changed
        this.setRestaurantUrl({
          id: this.restaurant.id,
          params: this.$router.currentRoute.params,
          restaurantName: this.restaurant.name,
          delivery: this.restaurant.delivery
        });
      },
      currentTabEvent(event) {
        this.currentTab = event;
      }
    },
    computed: {
      ...mapGetters({
        getRestaurantUrl: STORE_GET_RESTAURANT_URL,
        getDishes: STORE_GET_DISHES
      })
    },
    components: {
      Preview,
      Menu,
      Offers,
      DishesList,
      MyOrder,
      DishShowModal
    }
  }
</script>

<style lang="scss" scoped>
  .restaurant__main-container {
    //padding: 65px 16px 10px;
    height: 100%;
    @include media($lg) {
      max-width: 1500px;
      padding: 100px 40px 20px;
      display: grid;
      grid-template-columns: calc(100% - 320px) 310px;
      grid-column-gap: 10px;
    }
  }

  .restaurant__header {
    height: 60px;
    width: 100%;
    padding: 0 24px;
    position: fixed;
    top: 0;
    z-index: 1;
    background-color: $white;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .header__icon {
    position: absolute;
    top: 20px;
    left: 20px;
  }

  .header__title {
    color: #3f3f3f;
    font-size: 16px;
    line-height: 28px;
    font-weight: 700;
  }

  .restaurant__block {
    flex: 1 1 auto;
    padding: 60px 0 10px;
    background-color: $gray-249;
    height: 100%;
    display: flex;
    flex-direction: column;
    @include media($lg) {
      padding: unset;
      border: 1px solid #d5d5d5;
    }
  }

  .restaurant__preview {
    order: 1;
  }

  .restaurant__menu {
    order: 3;
    @include media($lg) {
      order: 2
    }
  }

  .restaurant__offers {
    order: 2;
    @include media($lg) {
      order: 3
    }
  }

  .restaurant__dishes-list {
    order: 4
  }
</style>
