<template>
  <div>
    <div class="restaurant__header" v-if="isMobile">
      <div class="header__icon">
        <v-icon class="material-icon" @click="$router.back()">arrow_back</v-icon>
      </div>
      <h1 v-show="showRestaurantName" class="header__title">
        {{ restaurant.name }}
      </h1>
    </div>
    <div class="restaurant__block">
      <Preview :restaurant="restaurant" :is-mobile="isMobile"></Preview>
      <Menu></Menu>
      <Offers></Offers>
      <DishesList></DishesList>
    </div>
    <MyOrder></MyOrder>
  </div>
</template>

<script>
  import Preview from "@/components/restaurant/Preview.vue";
  import Menu from "@/components/restaurant/Menu.vue";
  import Offers from "@/components/restaurant/Offers.vue";
  import DishesList from "@/components/restaurant/DishesList.vue";
  import MyOrder from "@/components/order/MyOrder.vue";

  // need to watch on dished in basket(vuex) and filter array of dishes every time

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

  import deviceMixin from "@/utils/mixins/deviceMixin";

  export default {
    mixins: [deviceMixin],
    data () {
      return {
        restaurant: null,
        showRestaurantName: false,
        selectedDish: null,
        showDishInfoModal: false
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
      }
    },
    computed: {
      ...mapGetters({
        getRestaurantUrl: STORE_GET_RESTAURANT_URL
      })
    },
    components: {
      Preview,
      Menu,
      Offers,
      DishesList,
      MyOrder,
    }
  }
</script>

<style lang="scss" scoped>
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
    margin-top: 70px;
  }
</style>
