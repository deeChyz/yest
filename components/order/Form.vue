<template>
  <div class="desktop-form">
    <div class="desktop-form__wrapper">
      <div class="user-info__block">
        <p class="user-info__title">Ваш телефон:</p>
        <p class="user-info__number">{{ getUserPhoneNumber ? `+${getUserPhoneNumber}` : '\n\n' }}</p>
      </div>
      <div class="address-info__block">
        <v-card-title class="address-info__title">
          Адрес доставки
        </v-card-title>
        <div class="address-info__top">
          <p class="top__item-label">Адрес</p>
          <input class="address__input" type="text" v-model="delivery.address">
        </div>
        <div class="address-info__middle">
          <div class="middle-item__block">
            <p class="middle__item-label">Кв./офис</p>
            <input class="address__input" type="text" v-model="delivery.room">
          </div>
          <div class="middle-item__block">
            <p class="middle__item-label">Домофон</p>
            <input class="address__input" type="text" v-model="delivery.intercom">
          </div>
          <div class="middle-item__block">
            <p class="middle__item-label">Этаж</p>
            <input class="address__input" type="text" v-model="delivery.floor">
          </div>
          <div class="middle-item__block">
            <p class="middle__item-label">Подъезд</p>
            <input class="address__input" type="text" v-model="delivery.enterence">
          </div>
        </div>
        <div class="address-info__bottom">
          <p class="bottom__item-label">Комментарий к заказу</p>
          <textarea class="address__input address__input_high" v-model="comment"></textarea>
        </div>
        <div class="payment__block">
          <h3 class="payment__title">Способ оплаты</h3>
          <v-radio-group class="payment__radio-group" v-model="paymentService" :mandatory="false">
            <v-radio class="payment__radio-item" :value=0>
              <span slot="label" class="payment__label">Наличными</span>
            </v-radio>
            <v-radio class="payment__radio-item" :value=1>
              <span slot="label" class="payment__label">Банковской картой на сайте</span>
            </v-radio>
          </v-radio-group>
        </div>
      </div>
      <div class="delivery__block">
        <div class="delivery__params">
          <div class="moped-block">
            <div class="moped"></div>
            <div class="triangle"></div>
          </div>
          <div class="delivery__time">
            <p class="time__title">Время доставки</p>
            <p class="time__value">{{ `${time.min} - ${this.time.max} мин` }}</p>
          </div>
          <div class="delivery__full-price">
            <p class="full-price__title">Итого</p>
            <p class="full-price__value">
              {{ getTotalPriceWithDelivery }}
              <span class="full-price__currency">BYN</span>
            </p>
          </div>
        </div>
        <div class="tableware__block">
          <span class="tableware__title">Количество приборов</span>
          <div class="tableware__interact">
            <div class="tableware__button" @click="$emit('tablewareItemsCountMinusButtonClick')">
              <v-icon class="material-icon">remove</v-icon>
            </div>
            <span class="tableware__counter">
                {{ tablewareItemsCount }}
            </span>
            <div class="tableware__button" @click="$emit('tablewareItemsCountPlusButtonClick')">
              <v-icon class="material-icon">add</v-icon>
            </div>
          </div>
        </div>
      </div>
    </div>

    <v-btn class="desktop-form__button" color="primary" @click="proceedOrder" :loading="isLoading">
      {{ paymentService === 0 ? 'Оформить заказ' : 'Перейти к оплате' }}
    </v-btn>
  </div>
</template>

<script>
  import OrderApi from "../../api/OrderApi";
  import { mapGetters } from 'vuex';

  import {
    STORE_GET_USER_PHONE_NUMBER,
    STORE_GET_CURRENT_ADDRESS,
    STORE_GET_TOTAL_PRICE_WITH_DELIVERY,
    STORE_GET_DISHES
  } from "../../utils/confs/pages/basket";

  export default {
    props: {
      tablewareItemsCountInfo: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        isLoading: false,
        delivery: {
          address: '',
          room: '',
          enterence: '',
          intercom: '',
          floor: '',
        },
        comment: '',
        paymentService: 0,
        time: {
          min: 0,
          max: 20
        },
        tablewareItemsCount: 0
      }
    },
    watch: {
      tablewareItemsCountInfo (value) {
        this.tablewareItemsCount = value;
      }
    },
    methods: {
      proceedOrder () {
        this.isLoading = true;
        OrderApi.create({
          phone: this.getUserPhoneNumber,
          delivery: {
            address: this.delivery.address,
            room: this.delivery.room,
            enterence: this.delivery.enterence,
            intercom: this.delivery.intercom,
            flor: this.delivery.floor
          },
          comment: this.comment,
          payment_method: this.paymentService,
          promocode: '',
          used_bonuses: 0,
          order: this.filteredOrders
        })
          .then(response => {
            if (response.data.hasOwnProperty('checkout')) {
              window.location = response.data.checkout.redirect_url;
            }
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    },
    computed: {
      ...mapGetters({
        getUserPhoneNumber: STORE_GET_USER_PHONE_NUMBER,
        getCurrentAddress: STORE_GET_CURRENT_ADDRESS,
        getTotalPriceWithDelivery: STORE_GET_TOTAL_PRICE_WITH_DELIVERY,
        getDishes: STORE_GET_DISHES
      }),
      filteredOrders () {
        return this.getDishes.map(dish => {
          return dish.sizes.map(size => {
            if (size.count) {
              return {
                id: size.id,
                count: size.count
              }
            }
          })
        })[0].filter(order => order);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .desktop-form__wrapper {
    @include media($lg) {
      border-radius: 4px;
      background-color: #f2f2f2;
      margin-bottom: 10px;
    }
  }

  .user-info__block {
    @include media($lg) {
      padding: 10px 40px 10px;
      margin-bottom: 10px;
      border-bottom: 1px solid $gray-dd;
    }
  }

  .user-info__title {
    @include media($lg) {
      font-size: 14px;
      font-weight: 600;
    }
  }

  .user-info__number {
    @include media($lg) {
      font-size: 14px;
    }
  }

  .address-info__block {
    @include media($lg) {
      padding: 0 40px;
      display: flex;
      flex-direction: column;
      max-width: 470px;
    }
  }

  .address-info__title {

    @include media($lg) {
      margin-bottom: 8px;
      font-size: 20px;
      font-weight: 600;
    }
  }

  .top__item-label, .middle__item-label, .bottom__item-label {
    @include media($lg) {
      font-size: 14px;
      color: $gray-b0;
      margin-bottom: 0;
    }
  }

  .address__input {
    @include media($lg) {
      background-color: $white;
      width: 100%;
      height: 32px;
      margin-bottom: 4px;
      padding: 0 10px;
      box-shadow: 0 0 2px $gray-b0;
      border-radius: 4px;
      &:focus {
        border: 1px solid $green;
        outline: 0;
      }
    }
  }

  .address__input_high {
    @include media($lg) {
      height: 88px;
      padding: 10px;
      resize: none;
    }
  }

  .address-info__middle {
    @include media($lg) {
      display: flex;
      margin: 8px 0;
    }
  }

  .middle-item__block {
    @include media($lg) {
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
    }
  }

  .payment__title {
    @include media($lg) {
      margin-bottom: 12px;
      font-size: 20px;
      font-weight: 600;
    }
  }

  .payment__label {
    color: black;
  }

  .delivery__block {
    @include media($lg) {
      display: flex;
      width: 100%;
      border-top: 1px solid $gray-dd;
    }
  }

  .delivery__params, .tableware__block {
    @include media($lg) {
      display: flex;
      align-items: center;
      padding: 16px 40px;
      border-right: 1px solid $gray-dd;
    }
  }

  .delivery__params {
    @include media($lg) {
      width: 67%;
    }
  }

  .tableware__block {
    @include media($lg) {
      width: 43%;
    }
  }

  .moped-block {
    width: 28px;
    height: 42px;
    position: relative;
    padding-left: 5px;
    margin-right: 30px;
    background-color: $green;
    border-radius: 4px;
  }

  .moped {
    background-color: $green;
    border-radius: 3px;
    width: 24px;
    height: 24px;
    padding: 9px 0;
    z-index: 1;
    position: relative;
    box-sizing: content-box;
    background-size: 100%;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoMjB2MjBIMHoiLz48ZyBzdHJva2U9IiMwMDAiPjxwYXRoIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik04Ljg1NyA5LjE0M2MwIC43Ni0xLjE0MyAxLjQ1NS0xLjE0MyAyLjU0NyAwIC42Mi40OTkuODEgMS4xNDMuODFIMTBjMS4xMjYgMCA2LjA4LTQuNTQyIDUuMTQyLTYuOTkiLz48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGQ9Ik0xNi4xODkgMTMuNDFhMS43MTQgMS43MTQgMCAxIDEtMy4xODkuODc1YzAtLjE4Mi4xMzItLjYxNy4zMzMtLjc5OCIvPjxwYXRoIGQ9Ik0xMy4wMTUgNC4wMDVjMi43NzQuMDM1IDQuODI1IDcuNDg5IDQuODI1IDkuMDgxIDAgLjI5Ni0uMTg4LjU3NC0uNTYzLjgzNS0uNjcyLS42MTQtLjg3My0uNTA5LTEuMTYyLS41MDltLTMuMS42OTRjLS4yODIuNDYyLTIuODI1LjM5My0zLjI1Mi4zOTRNOC42ODYgOS42MDVMNC40NSA5LjQ4N2EuNzM2LjczNiAwIDAgMS0uNzM3LS43MzZ2LS4xOTRjMC0uNDI1LjM5LTEuMTA2LjgxNC0xLjA4bDMuOTY5LjU1MWMuMzg4LjAyNS40NzcuMzguNDc3Ljc3IDAgLjQwNy4xMTkuODA3LS4yODguODA3eiIvPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgZD0iTTMuNTI1IDEyLjcyOWMtLjA5MS4wNS0uMjEyLjE0NC0uMzYuMjgyLS4xNi4xNjItLjI0OC4yNTQtLjI2My4yNzZhMS42OCAxLjY4IDAgMCAwLS4zMy45OTkgMS43MTQgMS43MTQgMCAxIDAgMy40MjggMCIvPjxwYXRoIGQ9Ik00LjI4NiA5LjE0M0M0LjI4NiAxMC4yODYgMiAxMC43OSAyIDEyLjc5OGMwIDAgLjQyOC4yOTIuOTQ2LjUybTMuMDY2Ljk3N2MuNTM4LjEyNSAxLjA2Ny4yMDUgMS41NDIuMjA1aDMuMjA1TTEzLjA0MyA0SDExIi8+PC9nPjwvZz48L3N2Zz4=);
    background-repeat: no-repeat;
    background-position: center;
  }

  .triangle {
    top: 6px;
    right: -15px;
    width: 30px;
    height: 30px;
    position: absolute;
    transform: scaleX(0.4) rotate(45deg);
    background-color: #00a646;
    border-top-right-radius: 4px;
  }

  .delivery__time, .delivery__full-price {
    @include media($lg) {
      margin-right: 40px;
    }
  }

  .time__title, .full-price__title {
    @include media($lg) {
      height: 30px;
      color: $gray-b0;
      font-size: 14px;
      line-height: 16px;
      padding-bottom: 8px;
    }
  }

  .time__value, .full-price__value {
    @include media($lg) {
      font-size: 25px;
      line-height: 25px;
    }
  }

  .full-price__currency {
    @include media($lg) {
      font-size: 16px;
    }
  }

  .tableware__interact {
    @include media($lg) {
      display: flex;
      border: 1px solid $gray-dd;
      border-radius: 4px;
      margin-left: 10px;
    }
  }

  .tableware__button {
    @include media($lg) {
      padding: 6px;
    }
  }

  .tableware__counter {
    @include media($lg) {
      padding: 6px 15px;
      background-color: $white;
      box-shadow: inset 0 1px 4px 0 rgb(0 0 0 / 20%);
    }
  }

  .desktop-form__button {
    @include media($lg) {
      width: 100%;
    }
  }
</style>
