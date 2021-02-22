<template>
  <div class="set-address__container" id="bgImg">
    <div class="set-address__info">
      <div class="info__pre-title">
        <nuxt-link to="/" class="info__link">
          Yest.by
        </nuxt-link>
        •
        <nuxt-link :to="`/${getSelectedZone.alias}`" class="info__link">
          {{ getSelectedZone.name }}
        </nuxt-link>
        <nuxt-link v-if="currentCategory.id !== 0"
                   :to="`/${getSelectedZone.alias}/restaurants/category/${currentCategory.alias}`"
                   class="info__link"
        >
          • {{ currentCategory.name }}
        </nuxt-link>
      </div>
      <div class="info__delivery">
        {{categoryInfo.header }} <br /> в {{ getSelectedZone.accusative }}
      </div>
      <span class="info__set-address-text">
            Укажите ваше местоположение, чтобы мы смогли предложить вам список доступных ресторанов
      </span>
      <div class="set-address__block">
        <v-text-field class='search__input' @input="" autocomplete="off" max-width='500px' prepend-inner-icon="near_me" @click:prepend-inner="" label="Укажите адрес доставки..." v-model='searchAddress' solo clearable @click:clear="">
          <template v-slot:append-outer>
            <v-btn class="input__button" color='primary' @click="">Показать рестораны</v-btn>
          </template>
        </v-text-field>
        <div class="address-list__block" v-if="showAddressList && searchAddress.length > 2 && suggestions.length > 0">
          <v-list>
            <v-list-item class="address-list__item"
                         v-for="(item, index) in suggestions"
                         :key="'address' + index"
                         @click=""
            >
              <v-list-item-content>
                <v-list-item-title>{{item.geoobjectText}}</v-list-item-title>
                <v-list-item-subtitle class="address-list__subtitle">{{item.geoobject[1]}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
      </div>
      <yest-button class="set-address__button"
                   v-if="isMobile"
                   :is-map-button="true"
                   :color="'green'"
                   @click="toggleShowDesktopMap"
      >Укажите адрес</yest-button>
    </div>

    <v-overlay z-index="999" :dark='false' :value="showDesktopMap" :opacity=".5">
      <mapContainer @closeMap='toggleShowDesktopMap'></mapContainer>
    </v-overlay>
  </div>
</template>

<script>
  import mobileMixin from "../../utils/mixins/deviceMixin";
  import MapContainer from "../../components/map/Container.vue";
  import { mapGetters } from "vuex";
  import {
    STORE_GET_SELECTED_ZONE
  } from "../../utils/confs/pages/restaurants";

  export default {
    mixins: [mobileMixin],
    props: {
      currentCategory: {
        type: Object,
        default: () => {}
      },
      categoryInfo: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        showDesktopMap: false,
        searchAddress: '',
        suggestions: [],
        showAddressList: false
      }
    },
    methods: {
      toggleShowDesktopMap() {
        this.showDesktopMap = !this.showDesktopMap;
      }
    },
    computed: {
      ...mapGetters({
        getSelectedZone: STORE_GET_SELECTED_ZONE
      })
    },
    components: {
      MapContainer,
    }
  }
</script>

<style lang="scss" scoped>

  .set-address__container {
    background-size: auto 250px;
    background-repeat: no-repeat;
    background-position: top right;
    margin-top: 0;
    background-color: #fff;
    z-index: 2;
    position: relative;
    @include media($lg){
      background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.4))), url('https://yastatic.net/s3/eda-front/prod-www/assets/default-d3a889e26c9ac9089ce5b007da1ac51b.png');
      background-color: rgba(0, 0, 0, 0.4);
      background-size: cover;
      background-position: center;
      min-height: 250px;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      margin: 2.5rem auto 0;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      max-width: 1420px;
    }
  }

  .set-address__info {
    padding: 35px 16px 0;
    @include media($lg) {
      padding: 55px 80px 40px;
      min-width: 100%;
    }
  }

  .info__pre-title {
    display: flex;
    margin-bottom: 4px;
    margin-left: -4px;
    color: $gray-b0;
    font-size: 12px;
    @include media($lg) {
      color: $white;
      opacity: 0.8;
      font-size: 16px;
    }
  }

  .info__link {
    text-decoration: none;
    color: $black;
    margin: 0 4px;
    font-size: 12px;
    @include media($lg) {
      color: $white;
      font-size: 16px;
    }
  }

  .info__delivery {
    color: $black;
    width: 95%;
    font-size: 24px;
    min-height: 60px;
    line-height: 1.2;
    align-items: center;
    margin: 0 0 14px;
    @include media($lg) {
      margin: 0 0 30px;
      font-size: 50px;
      line-height: 1.2;
      font-weight: 400;
      padding-right: 25%;
      color: $white;
    }
  }

  .info__set-address-text {
    display: flex;
    color: $gray-b0;
    padding-bottom: 25px;
    font-size: 12px;
    line-height: 1.67;
    width: 60%;
    @include media($lg) {
      display: none;
    }
  }

  .set-address__block {
    position: relative;
    max-width: 80%;
  }

  .search__input {
    display: none;
    @include media($lg) {
      display: unset;
      height: 50px;
    }
  }

  .input__button {
    position: absolute;
    top: 0;
    right: 0;
    height: 48px !important;
    font-weight: bold;
    text-transform: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    font-size: 16px !important;
    width: 220px;
    letter-spacing: 0.5px;
    background-color: $green !important;
  }

  .address-list__block {
    background-color: $white;
    position: absolute;
    top: 46px;
    left: 0;
    right: 0;
    max-width: 100%;
    width: calc(100% - 220px);
    z-index: 10;
    box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.15);
    border: none;
  }

  .address-list__item {
    padding: 6px 0;
    cursor: pointer;
    border: 1px solid rgba(238, 0, 0 , 0.4);
  }

  .address-list__item:hover {
    background: rgba(128, 128, 128, 0.2);
  }

  .address-list__subtitle {
    color: #aaaaaa;
  }

  .set-address__button {
    margin: 0 auto 20px;
    padding: 12px 70px !important;
    letter-spacing: 1.22px;
    @include media($lg) {
      display: none;
    }
  }
</style>
