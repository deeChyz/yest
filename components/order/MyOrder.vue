<template>
  <div class="my-order__block">
    <div v-if="isMobile" class="mobile-order-container">
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

    <div v-else class="desctop-order-container">
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
            <div v-if="selectedDish && selectedDish.length > 0 && basketListVisible"
                 class="order__items"
            >
              <div v-for="order in selectedDish"
                   :key="order.selectSize.id"
                   class="order__item"
              >
                <div class="item__info">
                  <span class="item__name">{{order.name}}</span>
                  <span class="item__size-wight">
                      {{order.selectSize.weight}}
                  </span>
                  <div class="item__subtitle">
                    {{order.selectSize.name}} • {{order.selectSize.price }} BYN
                  </div>
                  <div v-if="order && order.selectOption && order.selectOption.length > 0"
                       class="item__options"
                  >
                    <span v-for="opt in order.selectOption"
                          :key="opt.selected.id"
                          class="select-option"
                    >
                      <div v-if="opt && opt.selected && opt.selected.length > 1">
                        <div v-for="opti in opt.selected" :key="opti.id" class="options__name">
                          {{opti.name}}
                        </div>
                      </div>
                      <div v-else class="options__name">
                         {{opt.selected[0] ? opt.selected[0].name : opt.selected.name }}
                      </div>
                    </span>
                  </div>
                </div>
                <div class="item__interact"
                     :class="{'item__interact__hide-hover':$route.name === 'checkout'}"
                >
                  <div class="interact__add-item" @click="">
                    <v-icon class="material-icon">
                      add
                    </v-icon>
                  </div>
                  <div class="interact__count">
                    {{order.selectSize.count}}
                  </div>
                  <div class="interact__remove-item"  @click="">
                    <v-icon class="material-icon">
                      {{order.selectSize.count === 1 ? 'close' : 'remove'}}
                    </v-icon>
                  </div>
                </div>
                <div class="item__price">
                  {{(order.selectSize.price * order.selectSize.count).toFixed(2) }}
                  <span class="item__price-text">BYN</span>
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
              <p class="delivery__text" v-if="$route.name !== 'checkout'">
                {{ deliveryText }}
              </p>
            </div>
          </div>
          <div class="order__bottom">
            <div class="total-delivery" v-if="$route.name !== 'checkout'">
              <div class="total-title">Время доставки</div>
              <div class="price">
                {{`${workTime.min} &#8212; ${workTime.max} мин`}}
              </div>
            </div>
            <div class="total-price" v-if="$route.name !== 'checkout'">
              <div class="total-title">Итого</div>
              <div v-if="selectedDish && selectedDish.length > 0 && basketListVisible" class="price">
                {{ (parseFloat(getTotalPrice) + deliveryPrice).toFixed(2) }} BYN</div>
              <div v-else class="price">0.0 BYN</div>
            </div>
          </div>
        </div>
      </client-only>
      <yest-button id="mobile-confirm-order-button"
             :disabled="getTotalPrice <= 0"
             class="order__confirm-button"
             @click=""
      >
        Оформить заказ
      </yest-button>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import {
    STORE_GET_TOTAL_PRICE,
    STORE_GET_TOTAL_PRICE_WITH_DELIVERY
  } from "@/utils/confs/pages/basket";

  export default {
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
        default () {
          return {}
        }
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
        }
      }
    },
    computed: {
      ...mapGetters({
        getTotalPrice: STORE_GET_TOTAL_PRICE,
        getTotalPriceWithDelivery: STORE_GET_TOTAL_PRICE_WITH_DELIVERY,
      }),
      isActiveDeleteButton() {
        return this.selectedDish
            && this.selectedDish.length > 0
            && this.$route.name === 'restik'
            && this.basketListVisible;
      }
    },
    methods: {
      goToTheBasket() {
        this.$router.push({ name: 'basket'});
      }
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
  }

  .desctop-order-container {
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
  }

  .order__confirm-button {
    width: 100%;
    background-color: #4ca647 !important;
    padding: 10px 16px !important;
    color: rgba(0, 0, 0, .26) !important;
    border-radius: 4px !important;
    font-weight: 700;
  }
</style>
