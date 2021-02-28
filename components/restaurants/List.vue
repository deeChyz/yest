<template>
  <v-card class="restaurants-list__container">
    <h2 class="restaurants-list__title" id="restTitle" v-show='isFound'>Рестораны</h2>
    <v-flex cols-12 wrap class="restaurants__list" v-if="restaurantsList && restaurantsList.length">
      <v-flex cols-12 md4 sm6 xs12
              v-for="(item, index) in restaurantsList"
              v-if="index < restaurantsShowLimit"
              :key="index"
              class="restaurant__item"
              @click="restOverlay = !restOverlay"
      >
        <nuxt-link :to="restaurantUrl(item)" class="restaurant__link">
          <div class="item__block">
            <div class="item__logo" v-if="item.logo !== undefined">
              <img :alt="item.name" :src="item.logo" class="item__img">
            </div>
            <img class="item__cover"
                 :alt="item.name"
                 :src="item.cover"
                 :class="{ closeRestorane: !item.is_open }"
            />
            <div class="item__bottom-block">
              <div class="card__time" v-show="isCurrentAddress">
                <p class="card__time-quantity">{{ item.time.min }} &mdash; {{ item.time.max }}</p>
                <p class="card__time-unit">мин</p>
              </div>
              <div class="card__title">
                <span class="item__name"
                      :class="{ hidetime: isCurrentAddress }"
                >
                  {{ item.name }}
                </span>
                <v-chip class="item-chip"
                        color="primary"
                        v-show="Boolean(item.rating)"
                >
                  <v-icon color="#FFFADF">star</v-icon>
                  <div class="item-chip__rating">{{ item.rating }}</div>
                </v-chip>
              </div>
              <div class="card__options">
                <img class="options__delivery"
                     src="../../assets/svg/deliveryIcon.svg"
                     alt="deliveryIcon"
                />
                <span class="options__free-delivery">
                  Бесплатная доставка
                </span>
                <span class="options__rating" v-show="item.rating !== 0">
                  <v-icon class="rating__icon" color="#FFFADF">star</v-icon>
                  <span>{{ item.rating }}</span>
                </span>
              </div>
            </div>
          </div>
        </nuxt-link>
      </v-flex>
    </v-flex>
    <div v-show="!isFound" class="restaurants-list__not-found">
      <div class="not-found__title">Нас тут ещё нет :(</div>
      <div class="not-found__description pa-4">
        Но мы подключаем десятки новых мест каждую неделю.
        Может быть, и здесь окажемся! Если оставите свою почту, сразу вам сообщим.
        Обещаем не спамить.
      </div>
      <div class="d-flex justify-center align-center pb-4">
        <v-btn color="primary" class="call-me-btn">Сообщить мне</v-btn>
      </div>
    </div>
    <div class="restaurants-list__button">
      <v-btn color="primary"
             class="show-more__button"
             @click="increaseRestaurantsShowLimit"
             v-show="restaurantsList.length > restaurantsShowLimit"
             :loading="isLoading"
      >
        Показать ещё
      </v-btn>
    </div>
    <v-overlay :value="restOverlay" z-index="100">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-card>
</template>

<script>
  import { translitereteRusToLatin } from "../../utils/functions/transliter";
  import { DEFAULT_RESTAURANTS_SHOW_LIMIT } from "../../utils/confs/pages/restaurants";

  export default {
    props: {
      restaurantsList: {
        type: Array,
        default: () => []
      },
      currentCategory: {
        type: Object,
        default: () => {}
      },
      currentZone: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
        isFound: true,
        restaurantsShowLimit: DEFAULT_RESTAURANTS_SHOW_LIMIT,
        isLoading: false,
        restOverlay: false,
      }
    },
    computed: {
      isCurrentAddress () {
        return true;
      }
    },
    methods: {
      restaurantUrl (restaurant) {
        return {
          name: 'restaurant',
          params: {
            restaurantName: `${restaurant.restaurant_id}-${translitereteRusToLatin(restaurant.name)}`
          }
        };
      },
      increaseRestaurantsShowLimit () {
        this.restaurantsShowLimit += 12;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .restaurants-list__container {
    margin: auto auto 0;
    border-top: none;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 1420px;
    border-top: none;
    border-radius: 0 0 4px 4px;
    box-shadow: none;
    @include media($lg) {
    border: 1px solid rgba(0, 0, 0, 0.1);
      margin: auto auto .5rem;
    }
  }

  .restaurants-list__title {
    padding: 16px 30px;
    font-size: 20px;
    font-weight: bold;
    color: black;
    @include media($lg) {
      font-size: 28px;
      padding: 20px 90px 0;
    }
  }

  .restaurants__list {
    padding: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 20px;
    @include media($lg) {
      justify-content: flex-start;
      padding: 20px 70px;
    }
  }

  .restaurant__item, .restaurant__link {
    border-radius: 20px;
    min-width: 300px;
    text-decoration: none;
    color: $black !important;
    @include media($lg) {
      min-width: unset;
    }
    &:hover {
      transition: none;
      transform: none;
      @include media($lg) {
        transition: 0.5s;
        transform: scale(1.05);
      }
    }
  }

  .restaurant__item-tags, .restaurant__link-tags {
    font-size: 11px;
    color: rgba(0, 0, 0, 0.5);
    width: 100%;
    margin-bottom: 10px !important;
  }

  .item__block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-radius: 20px;
    cursor: pointer;
    box-shadow: 0 4px 20px rgb(240, 240, 240);
    position: relative;
    min-height: 273px;
    margin: 10px 20px;
    @include media($lg) {
      margin: 15px;
    }
  }

  .item__logo {
    width: 60px;
    height: 60px;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    padding: 6px;
    margin: 108px 20px 20px 20px;
    background: $white;
    border-radius: 10px;
  }

  .item__img {
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

  .item__bottom-block {
    width: 100%;
    padding: 16px 20px 20px;
    height: 85px;
    @include media($lg) {
      height: 100%;
      position: relative;
    }
  }

  .card__time {
    position: absolute;
    bottom: 105px;
    right: 20px;
    background-color: $white;
    border-radius: 23px;
    padding: 10px 17px;
    @include media($lg) {
      bottom: 107px;
      right: 15px;
    }
    @include media($xl) {
      bottom: 109px;
      right: 20px;
    }
    &:before, &:after {
      content: "";
      position: absolute;
      top: calc(100% - 35px);
      display: block;
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
    text-align: center;
    font-weight: 600;
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
      width: unset;
      height: unset;
      margin-bottom: unset;
    }
  }

  .item__name {
    min-height: 50px;
    padding-bottom: 0;
    overflow: hidden;
    font-size: 20px;
    line-height: 1.2;
    font-weight: bold;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
    text-align: left;
    z-index: 2;
    position: relative;
    text-decoration: none;
    @include media($lg) {
      min-height: 30px;
    }
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

  .options__free-delivery {
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

  .show-more__button {
    font-size: 16px !important;
    width: calc(100% - 32px);
    margin: 0 16px 16px;
    @include media($lg) {
      width: calc(100% - 140px);
      margin: 20px 70px;
    }
  }

</style>
