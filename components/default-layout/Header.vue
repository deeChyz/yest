<template>
  <div class="header__block">
    <div class="header__container">
      <div class="header__sidebar-button" v-if="!showSidebar" @click="showSidebar = !showSidebar"></div>
      <sidebar v-if="showSidebar"></sidebar>
      <nuxt-link class="header__link" v-if="!showSidebar" :to="currentRouteName">
        <img v-if="!(getCurrentAddress && getCurrentAddress.length > 0 || showSetAddressButton)"
             class="link__logo"
             src="@/assets/svg/logo.svg"
             alt="logodesktop"
        >
        <yest-button v-if="showSetAddressButton" class="link__button" @click="showMap" :is-map-button="true">
          <template slot="icon">
            <v-icon class="material-icon link__icon">near_me</v-icon>
          </template>
          {{ buttonText }}
        </yest-button>
      </nuxt-link>
      <div v-if="showSidebar && isMobile">
        <yest-button :is-map-button="true">
          {{ buttonText }}
        </yest-button>
      </div>
      <div class="header__main-links">
        <nuxt-link class="main-links__link" :to="{ name: 'partner' }">
          Ресторанам
        </nuxt-link>
        <nuxt-link class="main-links__link" :to="{name: 'rabota'}">
          Курьерам
        </nuxt-link>
        <nuxt-link class="main-links__link" :to="{name: 'business'}">
          Компаниям
        </nuxt-link>
      </div>
      <div class="header__interactive-area">
        <client-only>
          <v-btn v-if="this.getCurrentAddress && this.getCurrentAddress.length > 0"
                 small rounded outlined class="" color="primary"
                 @click="changeDesktopMapStatus(true)"
                 :class="{'btn--rounded' : getTotalPrice === 0}"
          >
            <v-icon>
              near_me
            </v-icon>
            <span class="zone-btn-address">{{getCurrentAddress}}</span>
          </v-btn>
          <v-btn v-if="getTotalPrice > 0"
                 color="primary" green @click='goToLatestReset()'
                 class="header-cart-btn"
                 :class="{'btn--rounded' : getCurrentAddress.length === 0}"
          >
            <v-icon class="header-cart-icon">shopping_cart</v-icon>
            <i class="fas fa-headphones-alt"></i>{{ getTotalPrice }} BYN
          </v-btn>
        </client-only>

        <client-only>
          <div v-model="showAuthForm">
            <sms-form @closeForm='closeAuthForm()' @closeFormShowOrderForm='closeAuthForm()'/>
          </div>
        </client-only>

        <div :class="{'': burgerMenuOverlay}">
          <map-container @closeMap='changeDesktopMapStatus(false)'/>
        </div>

        <v-menu offset-y v-if="getSelectedZone">
          <template v-slot:activator="{ on, attrs }">
            <v-btn small rounded outlined class="menu__selected-item" color="primary" v-on="on" v-bind="attrs">
              {{ getSelectedZone.name }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="zone in getZoneList"
                         :key="zone.alias"
                         v-if="!getSelectedZone || getSelectedZone.id !== zone.id"
                         class="menu__list-item"
                         @click="changeRegion(zone)"
            >
              <v-list-item-title>{{ zone.name }} </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters,
    mapMutations
  } from 'vuex';

  import Sidebar from '../Sidebar.vue';
  import SmsForm from '../forms/Sms.vue';
  import MapContainer from '../map/Container.vue';

  import { ITEMS } from "../../utils/confs/pages/defaultLayout";
  import { SHOW_MAP } from "../../utils/confs/store-actions/map";
  import {
    STORE_SET_EMPTY_BASKET,
    STORE_SET_SELECTED_ZONE,
    STORE_DROP_LOCATION,
    STORE_GET_SELECTED_ZONE,
    STORE_GET_CURRENT_ADDRESS,
    STORE_GET_ZONE_LIST,
    STORE_IS_MAP_VISIBLE,
    STORE_IS_INPUT_ADDRESS_MODE,
    STORE_GET_TOTAL_PRICE,
    STORE_GET_USER_PHONE_NUMBER,
    STORE_GET_RESTAURANT_URL
  } from '../../utils/confs/pages/defaultLayout';

  export default {
    props: {
      isMobile: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        burgerMenuOverlay: false,
        showSetAddressButton: false,
        showSidebar: false,
        showAuthForm: false,
        putAddressString: 'Укажите адрес',
        showBurgerMenu: false
      }
    },
    mounted () {
      if (this.getCurrentAddress && this.getCurrentAddress.length > 0) {
        this.showSetAddressButton = true;
      }
      if (window.innerWidth < 992) {
        window.addEventListener('scroll', this.showSetAddressButtonStatus);
      }
    },
    beforeDestroy() {
      if (window.innerWidth < 992) {
        window.removeEventListener('scroll', this.showSetAddressButtonStatus);
      }
    },
    watch: {
      getCurrentAddress(newValue, oldValue) {
        if (newValue.length > 0) this.showSetAddressButton = true;
      }
    },
    methods: {
      ...mapMutations({
        // setCurrentCoords: SET_CURRENT_COORDS,
        showMap: SHOW_MAP,
      }),
      goToLatestReset () {
        setTimeout(() => {
          this.$router.push(
          Boolean(this.getRestaurantUrl) ?
          {
            name: 'restaurant',
            params: {
              region: this.getRestaurantUrl.params.region,
              restaurantName: this.getRestaurantUrl.params.restaurantName
            }
          } :
          {
            name: 'restaurants',
              params: {
              region: this.getSelectedZone.alias
            }
          }).catch(()=>{});
        }, 100);
      },
      closeAuthForm (){
        this.showAuthForm = false;
      },
      changeDesktopMapStatus (bool) {
        this.burgerMenuOverlay = bool;
      },
      changeRegion (zone) {
        this.showBurgerMenu = false;
        // Очистить корзину //
        this.$store.dispatch(STORE_SET_EMPTY_BASKET);
        // Очистить информацию об адресе //
        this.$store.dispatch(STORE_DROP_LOCATION);

        this.$store.dispatch(STORE_SET_SELECTED_ZONE, zone.id);
        //todo: change this route, use route name!
        this.$router.push({name: 'restaurants', params: {region: zone.alias}})
        // this.$router.push(`/${zone.alias}`);
      },
      showSetAddressButtonStatus () {
        let lastTopScroll = 0;
        const pageHeight = window.pageYOffset || document.documentElement.scrollTop;

        if (pageHeight > 330) {
          this.showSetAddressButton = true;
        } else {
          this.showSetAddressButton = this.getCurrentAddress && this.getCurrentAddress.length > 0;
        }

        lastTopScroll = pageHeight <= 0 ? 0 : pageHeight;
      }
    },
    computed: {
      ...mapGetters({
        getSelectedZone: STORE_GET_SELECTED_ZONE,
        getCurrentAddress: STORE_GET_CURRENT_ADDRESS,
        isMapVisible: STORE_IS_MAP_VISIBLE,
        isInputAddressMode: STORE_IS_INPUT_ADDRESS_MODE,
        getZoneList: STORE_GET_ZONE_LIST,
        getTotalPrice: STORE_GET_TOTAL_PRICE,
        //chto eto???
        getRestaurantUrl: STORE_GET_RESTAURANT_URL,
        getUserPhoneNumber: STORE_GET_USER_PHONE_NUMBER
      }),
      currentRouteName () {
        return this.getSelectedZone && this.getSelectedZone.alias
            ? { name: 'restaurants', params: { region: this.getSelectedZone.alias } }
            : { name: 'home' };
      },
      buttonText () {
        if (!this.getCurrentAddress || this.getCurrentAddress === '') {
          return this.putAddressString;
        }
        return this.getCurrentAddress;
      }
    },
    components: {
      Sidebar,
      SmsForm,
      MapContainer,
    },
  }
</script>

<style lang="scss" scoped>
  .header-cart-icon {
    font-size: 20px;
    margin-left: 6px;
    font-family:  $material-icons;
  }
  .header-cart-btn {
    background-color: $green !important;
    font-size: 14px !important;
    letter-spacing: 0.1px;
    border-radius: 0 28px 28px 0;
    padding-left: 4px !important;
    height: 28px !important;
    box-shadow: none !important;
  }
  .header-cart-btn:before {
    content: none !important;
  }
  .header-cart-btn i {
    font-size: 20px !important;
  }
  .btn--rounded {
    border-radius: 28px !important;
  }

  .header__block {
    display: flex;
    justify-content: center;
    flex: 1 1 auto;
    height: 65px;
    width: 100vw;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
    position: fixed;
    top: 0;
    left: 0;
    background: #fff;
    z-index: 4;
    @include media($lg) {
      height: 80px;
    }
  }

  .header__container {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    @include media($lg) {
      justify-content: space-between;
      margin: auto;
      max-width: 1500px;
      padding: 10px 40px;
      width: 100%;
      height: 100%;
    }
  }

  .header__sidebar-button {
    display: flex;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiLz48ZyBmaWxsPSIjMDAwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzIDQpIj48cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMiIgcng9IjEiLz48cmVjdCB3aWR0aD0iMTMiIGhlaWdodD0iMiIgeT0iMTQiIHJ4PSIxIi8+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjIiIHk9IjciIHJ4PSIxIi8+PC9nPjwvZz48L3N2Zz4=');
    width: 25px;
    height: 25px;
    position: absolute;
    left: 25px;
    top: 20px;
    @include media($lg) {
      display: none;
    }
  }

  .header__link, .link__logo {
    max-height: 40px;
    text-decoration: none;
    @include media($lg) {
      max-height: 60px;
    }
  }

  .link__button {
    letter-spacing: 1.50px;
    padding: 8px 45px;
    @include media($lg) {
      padding: unset;
    }
  }

  .link__icon {
    color: $white;
  }

  .header__main-links {
    display: none;
    @include media($lg) {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      flex: 1 0 auto;
    }
  }

  .main-links__link {
    font-weight: 400;
    font-size: 16px ;
    font-family: Arial, sans-serif;
    color: black ;
    padding: 0 20px;
    text-decoration: none ;
    line-height: 1em;
    &:hover {
      text-decoration: underline;
    }
  }

  .header__interactive-area {
    display: none;
    @include media($lg) {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      min-width: 228px;
    }
  }

  .burger-menu {
    margin-left: 20px;
    position: relative;
  }

  .menu__selected-item {
    padding: 0 13px;
    width: 90px;
    height: 28px;
    display: flex;
    align-items: center;
    border: .5px solid rgba(0,0,0,.1);
    border-radius: 28px;
    margin-left: 20px;
  }

  .menu__selected-item_is-active {

  }

  .menu__list {
    height: auto;
    box-shadow: 0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12);
    background-color: $white;
    border-radius: 4px;
    min-width: 80px;
    position: absolute;
    top: 28px;
    left: 0;
    z-index: 2;
    overflow-y: auto;
    overflow-x: hidden;
    display: inline-block;
  }

  .menu__list-item {
    min-height: 48px;
    padding: 10px 16px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    border-bottom: .5px solid rgba(0,0,0,.1);
    z-index: 3;
  }
</style>
