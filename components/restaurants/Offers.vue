<template>
  <div class="offers__container" v-if="restaurantsList && restaurantsList.length > 0">
    <div class="offers__title">Акции</div>
    <div class="offers__swiper" v-swiper="swiperOptions" id='swiper'>

      <div class="swiper-wrapper offers__wrapper">
        <div v-for='(item, index) in restaurantsList' :key='index' class="swiper-slide">
          <nuxt-link :to="restaurantRoute(item)" class="restaurant__item">
            <div class="item__block">
              <div class="item__logo" v-if="item.logo !== undefined">
                <img contain :alt="item.name" :src="item.logo" class="item__logo_small">
              </div>
              <img contain :alt="item.name"
                   :src="item.cover"
                   class="item__cover"
                   :class="{'item__cover_disable': !item.is_open }"
              />
              <div class="item__bottom-block">
                <div class="card__time" v-show="checkAddress">
                  <p class="card__time-quantity">{{item.time.min}} &mdash; {{item.time.max}}</p>
                  <p class="card__time-unit">мин</p>
                </div>
                <div class="card__title">
                  <span class="item__name" :class="{'item__name_hidden-time': checkAddress}">
                    {{ item.name }}
                  </span>
                  <v-chip class="item-chip" color="primary" v-show="item.rating !== 0">
                    <v-icon color="#FFFADF">star</v-icon>
                    <div class="item-chip__rating">{{ item.rating }}</div>
                  </v-chip>
                </div>
                <div class="card__options">
                  <img class="options__delivery" src="@/assets/svg/deliveryIcon.svg" alt="deliveryIcon" />
                  <span class="options__free_delivery">
                    Бесплатная доставка
                  </span>
                  <span class="options__rating" v-show="item.rating !== 0">
                    <v-icon class="rating__icon" color="#FFFADF">star</v-icon>
                    <span>{{ item.rating }}</span>
                  </span>
                </div>
              </div>
              <div class="card__sale">
                <span class="sale__img">%</span>
                <span class="sale__text">Скидка 20%</span>
              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
      <div class="custom-btn-prev" slot="button-prev">
        <div class="custom-btn-prev__box"></div>
      </div>
      <div class="custom-btn-next" slot="button-next">
        <div class="custom-btn-next__box"></div>
      </div>
      <div class="swiper-pagination" slot="pagination"></div>
    </div>
  </div>
</template>

<script>
  import { directive } from "vue-awesome-swiper";
  import { Swiper, Navigation, Autoplay } from "swiper";
  import { translitereteRusToLatin } from "../../utils/functions/transliter";

  Swiper.use(Navigation);
  Swiper.use(Autoplay);

  export default {
    directives: {
      swiper: directive
    },
    props: {
      restaurantsList: {
        type: Array,
        default () {
          return []
        }
      },
      currentCategory: {
        type: Object,
        default () {
          return {}
        }
      },
      currentZone: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        checkAddress: true,
        swiperOptions: {
          observer: true,
          observeParents: false,
          slidesPerView: 4,
          spaceBetween: 40,
          navigation: {
            nextEl: '.custom-btn-next',
            prevEl: '.custom-btn-prev',
          },
          autoplay: {
            delay: 5000,
          },
          breakpoints: {
            1200: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
            992: {
              slidesPerView: 3,
            },
            865: {
              slidesPerView: 3.2,
            },
            720: {
              slidesPerView: 2.7,
            },
            600: {
              slidesPerView: 2.4,
            },
            500: {
              slidesPerView: 1.9,
            },
            440: {
              slidesPerView: 1.7,
            },
            320: {
              slidesPerView: 1.2,
              spaceBetween: 20,
            }
          }
        }
      }
    },
    methods: {
      restaurantRoute(restaurant){
        return {
          name: 'restaurant',
          params: {
            restaurantName: `${restaurant.restaurant_id}-${translitereteRusToLatin(restaurant.name)}`
          }
        };
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/scss/specialOffers";
  .offers__container {
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom: 4px solid rgba(245, 245, 245, 0.6);
  }

  .offers__title {
    padding: 16px 30px 0;
    font-size: 20px;
    font-weight: bold;
    color: $black;
    @include media($lg) {
      font-size: 28px;
      padding: 20px 90px 0;
    }
  }

  .offers__swiper {
    padding: 0 20px;
    @include media($lg) {
      padding: 0 90px;
      overflow: hidden;
    }
  }

  .restaurant__item {
    border-radius: 20px;
    min-width: 300px;
    transition: none;
    text-decoration: none;
    color: $black;
    @include media($lg) {
      color: $white !important;
    }
  }

  .item__block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin: 20px 0;
    border-radius: 20px;
    cursor: pointer;
    box-shadow: 0 4px 20px rgb(240, 240, 240);
    position: relative;
  }

  .item__logo {
    width: 48px;
    height: 48px;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    padding: 6px;
    margin: 108px 20px 20px 20px;
    background: $white;
    border-radius: 10px;
    @include media($lg) {
      width: 60px;
      height: 60px;
    }
  }

  .item__logo_small {
    height: 100%;
    width: 100%;
    background-size: cover;
  }

  .item__cover {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    height: 100%;
    width: 100%;
    min-height: 188px;
    max-height: 188px;
    object-fit: cover;
    background: $black;
    @include media($lg) {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
  }

  .item__cover_disable {
    filter: grayscale(100%);
  }

  .item__bottom-block {
    width: 100%;
    padding: 16px 20px 20px;
    position: relative;
    color: $black;
  }

  .card__time {
    position: absolute;
    bottom: 117px;
    right: 20px;
    background-color: $white;
    border-radius: 23px;
    padding: 10px 17px;
    @include media($lg) {
      bottom: 127px;
    }
    @include media($xl) {
      bottom: 109px;
    }
    &:before, &:after {
      content: "";
      position: absolute;
      top: calc(100% - 35px);
      width: 10px;
      height: 10px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }

    &:before {
      left: -7px;
      background-image: url("../../assets/svg/timeLeftPath.svg");
    }

    &:after {
      right: -7px;
      background-image: url("../../assets/svg/timeRightPath.svg");
    }
  }

  .card__time-quantity, .card__time-unit {
    font-weight: 600;
    text-align: center;
    margin-bottom: 0 !important;
  }

  .card__time-quantity {
    font-size: 16px;
    color: $black;
  }

  .card__time-unit {
    font-size: 12px;
    color: $dark-gray;
    margin-top: -5px;
  }

  .card__title {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 25px;
    margin-bottom: 6px;
    @include media($lg) {
      height: unset;
      margin-bottom: unset;
    }
  }

  .item__name {
    padding-bottom: 0;
    overflow: hidden;
    font-size: 20px;
    line-height: 1.2;
    font-weight: bold;
    white-space: nowrap;
    width: 100%;
    text-align: left;
    z-index: 2;
    position: relative;
    text-decoration: none;
    @include media($lg) {
      min-height: 30px;
    }
  }

  .item__name_hidden-time {
    padding-top: 0;
  }

  .item-chip {
    display: flex;
    position: relative;
    right: 1rem;
    bottom: 3rem;
    @include media($lg) {
      display: none;
    }
  }

  .item-chip__rating {
    color: $black !important;
    margin-left: 5px;
  }

  .card__options {
    display: flex;
    align-items: center;
  }

  .options__delivery {
    margin-right: 10px;
  }

  .options__free_delivery {
    font-size: 14px;
  }

  .options__rating {
    display: flex;
    align-items: center;
    font-size: 14px;
    background-color: $green;
    height: 22px;
    padding: 2px 10px 2px 2px;
    margin-right: 10px;
    border-radius: 100px;
    color: $white;
  }

  .rating__icon {
    font-size: 18px;
    margin-right: 5px;
  }

  .card__sale {
    display: flex;
    margin-top: 14px;
    position: absolute;
    top: 0;
    left: 6px;
  }

  .sale__img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 32px;
    font-size: 16px;
    font-weight: 600;
    background-color: #4ca648;
    color: $white;
    margin-top: -8px;
    position: relative;
  }

  .sale__text {
    padding: 8px 12px 8px 18px;
    font-size: 13px;
    background: $gray-f1;
    line-height: 16px;
    flex-shrink: 0;
    border-radius: 999px;
    margin-left: -12px;
    color: $black;
  }

  .custom-btn-prev,
  .custom-btn-next {
    display: none;
    @include media($lg) {
      position: absolute;
      top: 0;
      background: #fff;
      z-index: 1;
      overflow: hidden;
      width: 80px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .custom-btn-prev {
    @include media($lg) {
      left: -1px;
    }
  }

  .custom-btn-next {
    @include media($lg) {
      right: -1px;
    };
  }

  .custom-btn-next__box, .custom-btn-prev__box {
    z-index: 10;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    height: 40px;
    width: 40px;
    background-position: center;
    background-color: $green;
  }

  .custom-btn-next__box {
    background-image: url("../../assets/svg/nextArrowIcon.svg");
  }

  .custom-btn-prev__box {
    background-image: url("../../assets/svg/prevArrowIcon.svg");
  }

  .custom-btn-prev.swiper-button-disabled .custom-btn-prev__box,
  .custom-btn-next.swiper-button-disabled .custom-btn-next__box {
    display: none;
  }
</style>
