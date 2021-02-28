<template>
  <div class="basket__block">
    <div v-if="!false" class="desktop-basket__block">
      <div class="">
        <OrderForm :tableware-items-count-info="tablewareItemsCount"
                   @closeCheckout=''
                   @tablewareItemsCountPlusButtonClick='incrementTablewareItemsCount'
                   @tablewareItemsCountMinusButtonClick='decrementTablewareItemsCount'

        />
      </div>
      <div class="desktop__order-block">
                    <!--add delivery prop-->
        <MyOrder :orderList="getDishes" />
      </div>
    </div>
    <div v-else class="mobile-basket">
      <div class="mobile-basket__top">
        <v-icon class="mobile-basket__header-button material-icon" @click="$router.back()">
          arrow_back
        </v-icon>
        <v-icon class="mobile-basket__header-button material-icon" @click="toggleDeleteBasket" v-if="getDishes.length > 0">
          delete_forever
        </v-icon>
        <v-overlay :dark='false' v-model="showDropBasketModal">
          <v-card class="mobile-basket__close-modal">
            <v-card-title class="modal__title">
              Очистить корзину?
            </v-card-title>
            <v-card-actions class="modal__buttons-block">
              <yest-button class="modal__button" @click="onEmptyBasketButtonClick">
                ОК
              </yest-button>
              <yest-button color="white" class="modal__button" @click="toggleDropBasketModalState">
                Отмена
              </yest-button>
            </v-card-actions>
          </v-card>
        </v-overlay>
      </div>
      <div class="mobile-basket__dishes-block" v-if="getDishes.length > 0">
        <h1 class="mobile-basket__order-text">Заказ</h1>
        <div class="mobile-basket__dishes-list">
          <client-only>
            <div v-for="dish in getDishes" :key="`${dish.id}`" class="mobile-basket__dish-item">
              <img :src="'https://img.eatmealby.com/resize/dish/400/' + dish.image"
                   :alt="dish.name"
                   class="mobile-basket__dish-img"
              />
              <div class="mobile-basket__sizes-block">
                <div class="mobile-basket__dish-size" v-for="size in dish.sizes" v-show="size.count">
                  <div class="mobile-basket__dish-name">
                    {{ dish.name }}
                    <div class="mobile-basket__size-price">
                      {{ size.price }} BYN
                    </div>
                  </div>
                  <div class="mobile-basket__size-name">
                    {{ size.name }}
                  </div>
                  <div class="mobile-basket__dish-interact-block">
                    <v-btn icon
                           @click="onMinusButtonClick(dish, size)"
                           class="mobile-basket__button"
                    >
                      <v-icon class="material-icon">remove</v-icon>
                    </v-btn>
                    <div class="mobile-basket__interact-counter">
                      {{ size.count }}
                    </div>
                    <v-btn icon
                           @click="onPlusButtonClick(dish, size)"
                           class="mobile-basket__button"
                    >
                      <v-icon class="material-icon">add</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
          </client-only>
        </div>
        <div class="mobile-basket__delivery-info" v-if="getDishes.length > 0">
          <span>Доставка yest.by</span>
          <span>{{ (deliveryPrice).toFixed(2) }} BYN</span>
        </div>
        <div class="mobile-basket__tableware-block">
          <div class="mobile-basket__tableware-params">
            <img class="mobile-basket__tableware-img"
                 src="../../assets/svg/order/orderKnifesIcon.svg"
                 alt="knifes"
            >
            <div class="mobile-basket__tableware-interact-block" v-if="addTableware">
              <v-btn icon class="mobile-basket__button" @click="decrementTablewareItemsCount">
                <v-icon class="material-icon">remove</v-icon>
              </v-btn>
              <div class="mobile-basket__tableware-counter">
                {{ tablewareItemsCount }}
              </div>
              <v-btn icon class="mobile-basket__button" @click="incrementTablewareItemsCount">
                <v-icon class="material-icon">add</v-icon>
              </v-btn>
            </div>
            <div class="mobile-basket__tableware-items" v-else>
              Приборы и салфетки
            </div>
          </div>
          <v-switch class="mobile-basket__tableware-switch"
                    v-model="addTableware"
                    inset
          />
        </div>
        <h1 class="mobile-basket__delivery-title">Доставка</h1>
        <div class="mobile-basket__delivery-price">
          <img class="mobile-basket__delivery-img"
               src="../../assets/svg/order/deliverPersonIcon.svg"
               alt="delivery"
          >
          <span class="mobile-basket__delivery-text">Доставка yest.by</span>
        </div>
        <div class="mobile-basket__finish-order" v-if="getDishes.length > 0">
          <div class="mobile-basket__total-price">
            <span class="mobile-basket__total-price-value">
              {{ (parseFloat(getTotalPrice) + deliveryPrice).toFixed(2) }} BYN
            </span>
            <span class="mobile-basket__delivery-time">
              <client-only>
                {{ deliveryTime.min }} - {{ deliveryTime.max }} мин
              </client-only>
            </span>
          </div>
          <yest-button class="mobile-basket__order-button" @click="">Оформить заказ</yest-button>
        </div>
      </div>
      <div v-if="getDishes.length === 0" class="empty-basket__block">
        <div class="empty-basket__img"></div>
        <div class="empty-basket__title">
          Корзина пуста
        </div>
        <div class="empty-basket__text">
          Перейдите к списку мест, чтобы оформить заказ
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import OrderForm from "../../components/order/Form.vue";
  import MyOrder from "../../components/order/MyOrder.vue";
  import deviceMixin from "../../utils/mixins/deviceMixin";
  import basketMixin from "../../utils/mixins/basketMixin";

  import { mapActions, mapGetters } from "vuex";
  import {
    STORE_GET_DISHES,
    STORE_GET_TOTAL_PRICE,
    STORE_GET_RESTAURANT_URL,
    STORE_ADD_TO_BASKET,
    STORE_EMPTY_BASKET,
    STORE_GET_USER_PHONE_NUMBER
  } from "../../utils/confs/pages/basket";

  export default {
    mixins: [ deviceMixin, basketMixin ],
    data () {
      return {
        showDropBasketModal: false,
        addTableware: true, // was add knifes
        tablewareItemsCount: 1,
        deliveryPrice: 0, // may be this take from restaurantUrl
        deliveryTime: { // similarly
          min: 0,
          max: 10,
        },
      }
    },
    mounted() {
      document.documentElement.scrollTop = 0;
    },
    watch: {
      addTableware (value) {
        if (value) this.tablewareItemsCount = 1;
      }
    },
    methods: {
      ...mapActions({
        addToBasket: STORE_ADD_TO_BASKET,
        emptyBasket: STORE_EMPTY_BASKET
      }),
      onEmptyBasketButtonClick () {
        this.emptyBasket();
        this.toggleDropBasketModalState();
      },
      incrementTablewareItemsCount () {
        this.tablewareItemsCount++;
      },
      decrementTablewareItemsCount () {
        this.tablewareItemsCount--;
        if (!this.tablewareItemsCount) this.addTableware = false;
      },
      toggleDeleteBasket () {
        this.showDropBasketModal = !this.showDropBasketModal;
      },
      toggleDropBasketModalState () {
        this.showDropBasketModal = !this.showDropBasketModal;
      },

    },
    computed: {
      ...mapGetters({
        getDishes: STORE_GET_DISHES,
        getTotalPrice: STORE_GET_TOTAL_PRICE,
        getRestaurantUrl: STORE_GET_RESTAURANT_URL,
        getUserPhoneNumber: STORE_GET_USER_PHONE_NUMBER
      })
    },
    components: {
      OrderForm,
      MyOrder
    }
  }
</script>

<style lang="scss" scoped>
  .basket__block {
    //height: 100%;
  }

  .desktop-basket__block {
    @include media($lg) {
      height: 100%;
      max-width: 1500px;
      padding: 80px 40px 20px;
      display: grid;
      grid-template-columns: calc(100% - 320px) 310px;
      grid-column-gap: 10px;
    }
  }

  .desktop__order-block {
    @include media($lg) {
      width: 310px;
      height: 100%;
    }

    //TODO: check this styles

    .my-order__block {
      height: 100% !important;
    }

    .desktop-order-container {
      height: 100% !important;
    }

    //.order__container {
    //  height: 100% !important;
    //}

    //.order__top {
    //  height: 100% !important;
    //}
  }

  .mobile-basket__top {
    display: flex;
    justify-content: space-between;

    .mobile-basket__header-button {
      margin: 20px;
    }
  }

  .mobile-basket__close-modal {
    max-width: 420px;
    min-width: 280px;
    padding: 20px;
  }

  .modal__title {
    font-size: 16px;
    line-height: 22px;
    font-weight: 700;
  }

  .modal__buttons-block {
    display: flex;
    flex: 1 0 auto;
    margin-top: 24px;
    flex-direction: row;
    justify-content: space-between;
  }

  .modal__button {
    border-radius: 16px !important;
    padding: 16px 0;
    width: 112px;
    font-size: 16px;
  }

  .mobile-basket__order-text {
    margin: 10px 0 14px 16px;
    font-size: 32px;
    font-weight: 600;
  }

  .mobile-basket__dish-item {
    width: 100%;
    display: flex;
    padding: 15px 16px;
    font-size: 14px;
    border-bottom: 1px solid $x-light-gray;
    justify-content: flex-start;
    background-color: $white;
  }

  .mobile-basket__dish-img {
    width: 30%;
    max-width: 105px;
    max-height: 105px;
    border-radius: 20px;
  }

  .mobile-basket__sizes-block {
    width: 100%;
    margin-left: 16px;
  }

  .mobile-basket__dish-size {
    padding: 0 0 15px;
    margin-bottom: 8px;
    border-bottom: 1px solid $x-light-gray;
    &:last-child {
      border-bottom: none;
      margin-bottom: unset;
    }
  }

  .mobile-basket__dish-name {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 16px;
  }

  .mobile-basket__size-name {
    line-height: 14px;
    margin-bottom: 8px;
  }

  .mobile-basket__dish-interact-block {
    display: flex;
  }

  .mobile-basket__button {
    width: 48px !important;
    height: 48px !important;
    display: flex;
    align-items: center;
    border-radius: 16px;
    justify-content: center;
    background-color: $gray-f1;
  }

  .mobile-basket__interact-counter, .mobile-basket__tableware-counter {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 12px;
    font-size: 20px;
  }

  .mobile-basket__delivery-info {
    display: flex;
    justify-content: space-between;
    padding: 14px 18px 15px;
    border-bottom: 1px solid #f5f5f5;
    font-size: 17px;
  }

  .mobile-basket__tableware-block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
  }

  .mobile-basket__tableware-img {
    margin-right: 10px;
  }

  .mobile-basket__tableware-params, .mobile-basket__tableware-interact-block {
    display: flex;
    align-items: center;
  }

  .mobile-basket__tableware-switch {
    margin-top: 20px;
  }

  .mobile-basket__delivery-title {
    padding: 20px 20px 0;
    font-size: 26px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .mobile-basket__delivery-price {
    display: flex;
    align-items: center;
    padding: 0 20px 10px;
  }

  .mobile-basket__delivery-img {
    margin-right: 10px;
  }

  .mobile-basket__finish-order {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    background: $white;
    box-shadow: 0 -4px 20px rgb(117 115 111 / 20%);
    height: 84px;
    display: flex;
    padding: 8px 16px 20px;
    z-index: 1;
  }

  .mobile-basket__total-price {
    display: flex;
    flex-direction: column;
    margin-right: 16px;
  }

  .mobile-basket__total-price-value {
    font-size: 24px;
    line-height: 1em;
    margin-bottom: 4px;
    white-space: nowrap;
  }

  .mobile-basket__delivery-time {
    font-size: 13px;
    font-weight: 600;
    line-height: 1em;
  }

  .mobile-basket__order-button {
    width: 100% !important;
    border-radius: 16px !important;
    font-size: 16px;
  }

  .empty-basket__block {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 70px;
  }

  .empty-basket__img {
    height: 100%;
    width: 100%;
    min-width: 153px;
    min-height: 153px;
    background-position: center;
    margin-bottom: 10px;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNDMiIGhlaWdodD0iMTU0IiB2aWV3Qm94PSIwIDAgMTQzIDE1NCI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjRUVFIiBkPSJNMTEuNzY0IDI5aDEwOC45NTRhMiAyIDAgMCAxIDEuOTkgMS44MDFMMTM1IDE1NEgyLjYyNGEyIDIgMCAwIDEtMS45MjgtMi41M2wzLjc5Ni0xMy44MDdhMiAyIDAgMCAwIC4wNjktLjQzMkw5Ljc2NyAzMC45MDJBMiAyIDAgMCAxIDExLjc2NCAyOXoiLz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMTYuMjk0IDI2aDEwOS4wNGEyIDIgMCAwIDEgMS45ODggMS43NzlsMTIuMDU0IDEwOC4yNzZhMiAyIDAgMCAwIC4wMjguMTc1bDMuMTEgMTUuMzczYTIgMiAwIDAgMS0xLjk2IDIuMzk3SDE4LjMzNGEyIDIgMCAwIDEtMS45OC0xLjcxMmwtMi4zMzItMTUuOTk4YTIgMiAwIDAgMS0uMDItLjI5NGwuMjkzLTEwOC4wMDFhMiAyIDAgMCAxIDItMS45OTV6Ii8+PGcgZmlsbD0iIzAwMCIgdHJhbnNmb3JtPSJyb3RhdGUoLTQ1IDE0Ny4wNjkgLTcyLjAxOCkiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjEzIiB4PSI2IiByeD0iMSIvPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjEzIiB4PSI2IiByeD0iMSIgdHJhbnNmb3JtPSJyb3RhdGUoOTAgNyA2LjUpIi8+PC9nPjxnIGZpbGw9IiMwMDAiIHRyYW5zZm9ybT0icm90YXRlKC00NSAxMjAuNTY5IC04LjA0MikiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjEzIiB4PSI2IiByeD0iMSIvPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjEzIiB4PSI2IiByeD0iMSIgdHJhbnNmb3JtPSJyb3RhdGUoOTAgNyA2LjUpIi8+PC9nPjxwYXRoIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNjUuNDQ0IDEwOGgyMy4xMTIiLz48cGF0aCBzdHJva2U9IiNCMEIwQjAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNNDggMjV2LTIuODcxYzAtOS43NTYgNy4wNjktMTcuODkgMTYuNDUxLTE5LjczNkEyMC45NjQgMjAuOTY0IDAgMCAxIDY4LjUgMmM4LjE3NCAwIDE1LjIzMSA0LjY5OCAxOC41MjMgMTEuNDk0QTE5Ljc1IDE5Ljc1IDAgMCAxIDg5IDIyLjEzVjI1Ii8+PHBhdGggc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTU1IDQyVjIxLjVDNTUgMTAuMTc4IDY0LjE3OCAxIDc1LjUgMVM5NiAxMC4xNzggOTYgMjEuNVY0MiIvPjwvZz48L3N2Zz4=");
  }

  .empty-basket__title {
    font-size: 20px;
    text-align: center;
    margin-top: 36px;
    font-weight: 700;
  }

  .empty-basket__text {
    color: $gray-b0;
    font-size: 12px;
    text-align: center;
    margin-top: 12px;
    line-height: 1.67;
  }
</style>
