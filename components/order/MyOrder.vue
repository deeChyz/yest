<template>
  <div class="my-order__block">
    <div v-if="isMobile && !isRestaurantsList" class="mobile-order-container">
      <yest-button class="order-button" @click="goToTheBasket">
        <span class="button__work-time">
          {{ restaurant.delivery.time.min }} - {{ restaurant.delivery.time.max }} мин
        </span>
        <span class="button__order">
          Корзина
        </span>
        <span class="button__price">
          {{ getTotalPriceWithDelivery.toFixed(2) }} BYN
        </span>
      </yest-button>
    </div>

    <div v-else-if="isMobile" class="mobile-order-container">
      <yest-button class="order-button" @click="goToTheBasket">
      <span class="button__order">
        {{ restaurant.restaurantName}}
      </span>
      <span class="order__button-price">
        {{ getTotalPriceWithDelivery.toFixed(2) }} BYN
      </span>
      </yest-button>
    </div>

    <div v-else class="desktop-order-container">
      <client-only>
        <div class="order__container">
          <div class="order__top">
            <div class="order__title">
              <p>
                Мой заказ
              </p>
              <v-icon v-if="isActiveDeleteButton"
                      @click=""
                      class="material-icon"
              >
                delete_forever
              </v-icon>
            </div>
            <div v-if="basketListVisible"
                 class="order__items"
            >
              <div v-for="dish in getDishes"
                   :key="dish.id"
                   class="order__item"
              >
                <div v-for="size in dish.sizes"
                     :key="size.id"
                     class="order__size"
                     v-show="size.count"
                >
                  <template>
                    <div class="item__info">
                      <span class="item__name">{{ dish.name }}</span>
                      <span class="item__size-weight">
                          {{ size.weight }}
                      </span>
                      <div class="item__subtitle">
                        {{ size.name }} • {{ size.price }} BYN
                      </div>
                    </div>
                    <div class="item__interact"
                         :class="{'item__interact__hide-hover': $route.name === 'basket'}"
                    >
                      <div class="interact__add-item" @click="onPlusButtonClick(dish, size)">
                        <v-icon class="material-icon">
                          add
                        </v-icon>
                      </div>
                      <div class="interact__count">
                        {{ size.count }}
                      </div>
                      <div class="interact__remove-item" @click="onMinusButtonClick(dish, size)">
                        <v-icon class="material-icon">
                          {{ size.count === 1 ? 'close' : 'remove' }}
                        </v-icon>
                      </div>
                    </div>
                    <div class="item__price">
                      {{ (size.price * size.count).toFixed(2) }}
                      <span class="item__price-text">BYN</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <div v-else class="order__no-dishes">
              <span class="no-dishes__title">
                  Выберите блюда и добавьте их к заказу
              </span>
            </div>
            <v-divider />
            <div class="delivery-options" v-if="getTotalPrice > 0 && !basketListVisible">
              <div v-if="deliveryPrice > 0"
                   class="delivery__info"
              >
                <span class="delivery__title">
                    Доставка
                </span>
                <span class="delivery__price">
                  {{ deliveryPrice }}
                  <span class="delivery__price-text">BYN</span>
                </span>
              </div>
              <p class="delivery__text" v-if="$route.name !== 'basket'">
                {{ deliveryText }}
              </p>
            </div>
          </div>
          <div class="order__bottom">
            <div class="total-delivery" v-if="$route.name !== 'basket'">
              <div class="total-title">Время доставки</div>
              <div class="price">
                {{ `${workTime.min} &#8212; ${workTime.max} мин` }}
              </div>
            </div>
            <div class="total-price" v-if="$route.name !== 'basket'">
              <div class="total-title">Итого</div>
              <div v-if="getDishes && getDishes.length > 0 && basketListVisible" class="price">
                {{ (parseFloat(getTotalPrice) + deliveryPrice).toFixed(2) }} BYN</div>
              <div v-else class="price">0.0 BYN</div>
            </div>
          </div>
        </div>
      </client-only>
      <client-only>
        <yest-button id="mobile-confirm-order-button"
                     :disabled="getTotalPrice <= 0"
                     class="order__confirm-button"
                     @click="toggleSmsForm"
        >
          Оформить заказ
        </yest-button>
      </client-only>
    </div>
    <v-overlay v-model="showSmsForm" opacity="0.5" :dark="false" z-index="999">
      <SmsForm v-if="showSmsForm" @close="toggleSmsForm"/>
    </v-overlay>
  </div>
</template>

<script>
  import SmsForm from "../restaurant/sms/Form"
  import basketMixin from "../../utils/mixins/basketMixin";
  import {
    mapGetters
  } from 'vuex';
  import {
    STORE_GET_TOTAL_PRICE,
    STORE_GET_TOTAL_PRICE_WITH_DELIVERY
  } from "../../utils/confs/pages/basket";
  import {
    STORE_GET_DISHES
  } from "../../utils/confs/pages/basket";

  export default {
    mixins: [ basketMixin ],
    props: {
      restaurant: {
        type: Object,
        default: () => {}
      },
      isMobile: {
        type: Boolean,
        default: false
      },
      selectedDish: {
        type: Object,
        default: () => {}
      },
      isRestaurantsList: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        basketListVisible: true,
        deliveryPrice: 10,
        deliveryText: 'Delivery',
        workTime: {
          min: 10,
          max: 20
        },
        showSmsForm: false
      }
    },
    methods: {
      toggleSmsForm () {
        this.showSmsForm = !this.showSmsForm;
      },
      incrementDishCount (dish) {

      },
      decrementDishCount (dish) {

      },
      goToTheBasket() {
        this.$router.push({ name: 'basket'});
      }
    },
    computed: {
      ...mapGetters({
        getDishes: STORE_GET_DISHES,
        getTotalPrice: STORE_GET_TOTAL_PRICE,
        getTotalPriceWithDelivery: STORE_GET_TOTAL_PRICE_WITH_DELIVERY,
      }),
      isActiveDeleteButton() {
        return this.selectedDish
            && this.selectedDish.length > 0
            && this.$route.name === 'restaurant'
            && this.basketListVisible;
      }
    },
    components: {
      SmsForm
    }
  }
</script>

<style lang="scss" scoped>
  .mobile-order-container {
    position: fixed;
    bottom: 0;
    background-color: $white;
    padding: 15px 15px 25px;
    box-shadow: 0 -4px 8px 0 rgb(0 0 0 / 5%);
    width: 100%;
    z-index: 2;

    .yest-button {
      width: 100% !important;
      height: 56px;
      border-radius: 16px !important;
      display: flex;
      justify-content: space-between;
      transition: all .3s ease;
      &:hover {
        opacity: .8;
      }
    }

    .button__work-time, .button__price{
      background-color: rgba(0,0,0,.03);
      padding: 7px;
      border-radius: 5px;
    }

    .button__order {
      font-size: 16px;
    }

    .order__button-price {
      font-size: 16px;
    }
  }

  .desktop-order-container {
    @include media($lg) {
      position: sticky;
      top: 90px;
      width: 310px;
      height: calc(100vh - 107px);
    }
  }

  .order__container {
    height: calc(100vh - 162px);
    background-color: #f2f2f2;
    border-radius: 5px;
    margin-bottom: 10px;
    padding: 20px 20px 0;
  }

  .order__top {
    display: flex;
    flex-direction: column;
    overflow: auto;
    height: calc(100% - 70px);
  }

  .order__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    font-weight: 700;
    padding-bottom: 20px;
    p {
      margin-bottom: 0;
    }
  }

  .order__size {
    display: flex;
    padding: 10px 0;
  }

  .item__info {
    display: flex;
    flex: 1 1 70%;
    flex-direction: column;
  }

  .item__size-weight, .item__subtitle {
    color: $gray-b0;
    font-size: 12px;
    white-space: nowrap;
  }

  .item__interact {
    min-width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    position: relative;
    flex: 0 1 10%;
  }

  .interact__add-item, .interact__remove-item {
    display: none;
    cursor: pointer;
    width: 100%;
    align-items: center;
    justify-content: center;
    height: 35px;
    background-color: $white !important;
    z-index: 1;
  }

  .interact__count {
    min-width: 35px;
    height: 35px;
    min-height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $gray-b0;
    font-weight: 300;
    font-size: 14px;
    line-height: 35px;
  }

  .interact__add-item {
    position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;
    border-bottom: none !important;
  }

  .interact__remove-item {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    border-top: none !important;
  }

  .item__interact:hover .interact__count,
  .item__interact:hover .interact__add-item,
  .item__interact:hover .interact__remove-item {
    display: flex;
    border: .5px solid $gray-b0;
    cursor: pointer;
    background-color: $white !important;
  }

  .item__price {
    display: flex;
    flex-direction: column;
    line-height: 1em;
    align-items: center;
    flex: 0 1 20%;
    font-size: 14px;
    text-align: right;
    padding: 5px 0 0 10px;
  }

  .item__price-text {
    font-size: 10px;
    line-height: 1em;
    margin-top: 2px;
  }

  .order__no-dishes {
    display: flex;
    flex-direction: column;
    flex: auto;
  }

  .no-dishes__title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 85%;
    margin: auto;
    text-align: center;
    color: $gray-b0;
  }

  .order__bottom {
    display: flex;
  }

  .total-delivery, .total-price {

  }

  .total-delivery {
    width: 60%;
    padding: 10px 5px 10px 0;
  }

  .total-price  {
    width: 40%;
    padding: 10px 5px 10px 20px;
  }

  .total-title {
    color: $gray-b0;
    font-size: 14px;
  }

  .price {
    font-size: 18px;
    display: flex;
    align-items: center;
    white-space: nowrap;
  }

  .order__confirm-button {
    width: 100%;
    background-color: #4ca647 !important;
    padding: 10px 16px !important;
    border-radius: 4px !important;
    font-weight: 700;
  }
</style>
