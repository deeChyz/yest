<template>
  <div class="desctop-preview__container">
    <div class="restaurant-preview__top" :style="{backgroundImage:'url(https://img.eatmealby.com/resize/restaurant/900/'+restaurant.background_image+')'}">
      <v-chip v-if="restaurant.rating !== 0" color="primary" class="rating__block">
        <v-icon class="material-icon">star</v-icon>
        <div>{{ restaurant.rating ? restaurant.rating: 'Мало оценок' }}</div>
      </v-chip>
      <nuxt-link class="preview__title"
                 :to="{name: 'restaurants', params: {region: currentZone.alias}}"
      >
        <span class="preview__delivery">
          Доставка еды • {{ currentZone.name }}
        </span>
      </nuxt-link>
      <div class="preview__restaurant-name">
        {{ restaurant.name }}
      </div>
      <div class="preview__delivery-info">
        <v-menu
          content-class="delivery__modal-wrapper"
          min-width="356"
          bottom
          origin="center center"
          z-index="999"
          transition="scale-transition"
          nudge-bottom="65"
        >
          <template v-slot:activator="{ on, attrs }">
            <div class="preview__restaurant-delivery" v-bind="attrs" v-on="on">
              <div class="moped__block">
                <div class="moped__body" />
                <div class="moped__item" />
              </div>
              <div class="restaurant-description pl-2">
                <div class="description__delivery">
                  Доставка Yest.by
                </div>
                <div class="description__delivery-price ">
                  Доставка {{ delivery[1].delivery === 0 ? '' : `${delivery[1].delivery} -` }}
                  {{ delivery[0].delivery }} BYN.
                  Бесплатно при заказе от {{ delivery[delivery.length-1].min }} BYN
                </div>
              </div>
            </div>
            <div class="price__text">
              <p>
                Заказ от
              </p>
              <p>
                {{ delivery[0].min }} BYN
              </p>
            </div>
          </template>
          <div class="delivery-modal">
            <v-card max-width="356" class="restaurant__legal-info">
              <v-card-title class="modal__title">
                Доставка Yest.by
              </v-card-title>
              <v-card-subtitle class="modal_text-gray">
                Доставку выполнят партнёры Yest.by
              </v-card-subtitle>
              <div v-for="fee in restaurant.delivery.fee" :key="`deliveryFee${fee.min}`" class="d-flex flex-column">
                <div class="delivery-modal__info">
                  <v-icon class="material-icon">directions_run</v-icon>
                  <div v-if="fee.delivery">
                    {{ fee.delivery }} BYN
                    <span>
                      на заказ от {{ fee.min }} BYN
                    </span>
                  </div>
                  <div v-else>
                    Бесплатная доставка при заказе от {{ fee.min }} BYN
                  </div>
                </div>
                <v-divider width="100%" class="mx-auto" />
              </div>
            </v-card>
          </div>
        </v-menu>
        <div class="restaurant__info">
          <v-menu
            content-class="restaurant__info-wrapper"
            bottom
            origin="center center"
            z-index="999"
            transition="scale-transition"
            nudge-left="100"
            nudge-bottom="50"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="transparent" class="restaurant__info-button" large v-bind="attrs" v-on="on">
                <p class="info__button-text">
                  Информация <br> о ресторане
                </p>
                <img class="info__img" src="@/assets/svg/restaurant/restaurantInfoIcon.svg" alt="restaurant info">
              </v-btn>
            </template>
            <div class="restaurant__info-modal">
              <v-card max-width="460" class="restaurant__card">
                <ModalInfo :restaurant="restaurant"/>
              </v-card>
            </div>
          </v-menu>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import ModalInfo from '../ModalInfo.vue';
  import { mapGetters } from 'vuex';

  import {STORE_GET_SELECTED_ZONE} from "~/utils/confs/pages/restaurants";

  export default {
    props: {
      restaurant: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    computed: {
      ...mapGetters({
        currentZone: STORE_GET_SELECTED_ZONE
      }),
      delivery () {
        return this.restaurant && this.restaurant.delivery
          && this.restaurant.delivery.fee
          && this.restaurant.delivery.fee.length
          && this.restaurant.delivery.fee.sort((a, b) => {
            return a.min > b.min;
          })
      }
    },
    components: {
      ModalInfo
    }
  }
</script>
<style lang="scss" scoped>
  .desctop-preview__container {
    border: 1px solid #d5d5d5;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    height: 398px;
  }

  .restaurant-preview__top {
    background-blend-mode: multiply;
    background-repeat: no-repeat;
    background-color: rgba(0, 0, 0, .3);
    background-position: center;
    background-size: cover;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0 40px 28px;
    height: 100%;
    @include media($xl) {
      padding: 0 80px 28px;
    }
  }

  .preview__title {
    opacity: .8;
    margin-top: 15px;
    color: $white;
    text-decoration: none;
  }

  .preview__restaurant-name {
    margin: 2px 0 8px;
    font-size: 60px;
    font-weight: bold;
    line-height: 1.08;
    padding-bottom: 12px;
    color: $white;
  }

  .preview__delivery-info {
    padding: 10px 0 11px;
    border-top: 1px solid hsla(0, 0%, 100%, .2);
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .preview__restaurant-delivery {
    display: flex;
    flex-direction: row;
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
    color: $white;
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  .moped__block {
    width: 28px;
    height: 42px;
    position: relative;
    padding-left: 5px;
    margin-right: 16px;
    background-color: $green;
    border-radius: 4px;
  }

  .moped__body {
    background-color: $green;
    border-radius: 3px;
    width: 24px;
    height: 24px;
    padding: 9px 0;
    z-index: 1;
    position: relative;
    box-sizing: content-box;
    background-size: 100%;
    background-image: url("../../../assets/svg/restaurant/deliveryRestIcon.svg");
    background-repeat: no-repeat;
    background-position: center;
  }

  .moped__item {
    top: 6px;
    right: -15px;
    width: 30px;
    height: 30px;
    position: absolute;
    transform: scaleX(0.4) rotate(45deg);
    background-color: $green;
    border-top-right-radius: 4px;
  }

  .restaurant-description {
    font-size: 14px;
  }

  .price__text {
    padding-top: 10px;
    color: $white;
    p:first-child {
      font-size: 14px;
      margin-bottom: 0;
    }
    p:last-child {
      font-size: 16px;
      line-height: 21px;
      padding-top: 6px;
      margin-bottom: 0;
    }
  }

  .delivery__modal-wrapper, .restaurant__info-wrapper {
    overflow-y: visible !important;
    overflow-x: visible;
    contain: none;
    z-index: 10 !important;
    box-shadow: none !important;
  }

  .restaurant__info {
    padding-top: 10px;
  }

  .restaurant__info-button {
    background-color: transparent;
    border: none;
    box-shadow: none;
    margin-right: -20px;
  }

  .info__button-text {
    text-align: left;
    color: #fff;
    text-transform: initial;
    font-size: 14px;
    line-height: 17px;
    margin-bottom: 0;
    margin-right: 6px;
  }

  .restaurant__info-modal,
  .delivery-modal {
    position: relative;
    overflow: visible;
  }
  .restaurant__info-modal:before,
  .delivery-modal:before {
    content: "";
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;
    border-bottom: 17px solid #fff;
    width: 10%;
    margin: auto;
    z-index: 200;
  }

  .modal__title {
    font-size: 20px;
    font-weight: 600;
    padding: 20px 20px 0;
  }

  .modal_text-gray {
    padding: 3px 20px;
    font-size: 14px;
    color: $gray-a0;
    line-height: 1.4rem;
    margin-top: 0 !important;
  }

  .delivery-modal__info div {
    padding-left: 10px;
    width: 100%;
    font-size: 14px;
    margin: 9px 0;
  }
  .delivery-modal__info {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: flex-start;
    padding: 2px 20px 4px;
  }
</style>
