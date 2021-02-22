<template>
  <div class="basket__block">
    <div v-if="!isMobile" class=''>
      <div class="">
        <v-card class="">
          <OrderForm @closeCheckout='' />
        </v-card>
      </div>
      <div class="">
                    <!--add delivery prop-->
        <MyOrder :orderList="getDishes" />
      </div>
    </div>
    <div class="">
      <div class="">
        <v-icon class="material-icon" @click="$router.back()">
          arrow_back
        </v-icon>
        <v-icon class="material-icon" @click="toggleDeleteBasket" v-if="getDishes.length > 0">
          delete_forever
        </v-icon>
        <v-overlay :dark='false' v-model="showDropBasketModal">
          <v-card class="">
            <v-card-title class="">
              Очистить корзину?
            </v-card-title>
            <v-card-actions class="">
              <v-btn class="material-icon" color="primary" @click="">
                Ок
              </v-btn>
              <v-btn class="material-icon" @click="">
                Отмена
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-overlay>
      </div>
      <div class="" v-if="getDishes.length > 0">
        <h1 class="">Заказ</h1>
        <div class="">
          <client-only>
            <div v-for="order in getDishes" :key="`${order.id}`" class="">
              <div class=''>
                <v-img cover
                       :src="'https://img.eatmealby.com/resize/dish/400/' + order.image"
                       :lazy-src="lazySrc"
                       :alt="order.name"
                       class=""
                ></v-img>
              </div>
              <div class="">
                <div class="">
                  {{order.name}}
                  <div class="">
                    {{order.selectSize.price}} BYN
                  </div>
                </div>
                <div class="">
                  <div class="">
                    {{order.selectSize.name}}
                  </div>
                  <div v-show="order.selectOption.length > 0" class="">
                  <span v-for="opt in order.selectOption"
                        :key="opt.selected.id"
                        class=""
                  >
                    {{opt.selected.name}}
                  </span>
                  </div>
                </div>
                <div class="">
                  <v-btn icon
                         @click=""
                         class="material-icon"
                  >
                    <v-icon>remove</v-icon>
                  </v-btn>
                  <div class="">
                    {{order.selectSize.count}}
                  </div>
                  <v-btn icon
                         @click=""
                         class="material-icon"
                  >
                    <v-icon>add</v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
          </client-only>
        </div>
        <div class="" v-if="getDishes.length > 0">
          <span>Доставка yest.by</span>
          <span>{{ (deliveryPrice).toFixed(2) }} BYN</span>
        </div>
        <div class="">
          <div class="">
            <img class=""
                 src="@/assets/svg/order/orderKnifesIcon.svg"
                 alt="knifes"
            >
            <div class="" v-if="addTableware">
              <v-btn icon class="" @click="">
                <v-icon class="material-icon">remove</v-icon>
              </v-btn>
              <div class="">
                {{ tablewareItemsCount }}
              </div>
              <v-btn icon class="" @click="">
                <v-icon class="material-icon">add</v-icon>
              </v-btn>
            </div>
            <div v-else>
              Приборы и салфетки
            </div>
          </div>
          <v-switch class=""
                    v-model="toggleAddTablewareState"
                    inset
          ></v-switch>
        </div>
        <h1 class="">Доставка</h1>
        <div class="">
          <img class=""
               src="@/assets/svg/order/deliverPersonIcon.svg"
               alt="delivery"
          >
          <span class="">Доставка yest.by</span>
        </div>
        <div class="" v-if="getDishes.length > 0">
          <div class="">
          <span class="">
            {{ (parseFloat(getTotalPrice) + deliveryPrice).toFixed(2) }} BYN
          </span>
            <span class="">
            <client-only>
              {{ deliveryTime.min }} - {{ deliveryTime.max }} мин
            </client-only>
          </span>
          </div>
          <div class="">
            <v-btn block color="primary" @click="">Оформить заказ</v-btn>
          </div>
        </div>
      </div>
      <div v-if="getDishes.length === 0" class="">
        <div class=""></div>
        <div class="">
          Корзина пуста
        </div>
        <div class="">
          Перейдите к списку мест, чтобы оформить заказ
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import OrderForm from "@/components/order/Form.vue";
  import MyOrder from "@/components/order/MyOrder.vue";
  import deviceMixin from "@/utils/mixins/deviceMixin";

  import { mapActions, mapGetters } from "vuex";
  import {
    STORE_GET_DISHES,
    STORE_GET_TOTAL_PRICE,
    STORE_GET_RESTAURANT_URL,
    STORE_ADD_TO_BASKET,
    STORE_DECREMENT_DISH_COUNTER,
    STORE_INCREMENT_DISH_COUNTER,
    STORE_EMPTY_BASKET,
    YEST_DELIVERY_COST
  } from "../../utils/confs/pages/basket";

  export default {
    mixins: [ deviceMixin ],
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
    methods: {
      ...mapActions({
        addToBasket: STORE_ADD_TO_BASKET,
        emptyBasket: STORE_EMPTY_BASKET,
        incrementDishCounter: STORE_INCREMENT_DISH_COUNTER,
        decrementDishCounter: STORE_DECREMENT_DISH_COUNTER
      }),

      onPlusButtonClick (dish) {
        this.incrementDishCounter(dish);
      },
      onMinusButtonClick (dish) {
        this.decrementDishCounter(dish);
      },
      toggleAddTablewareState () {
        this.addTableware = !this.addTableware;
      },
      incrementTablewareItemsCount () {
        this.tablewareItemsCount++;
      },
      decrementTablewareItemsCount () {
        this.tablewareItemsCount--;
        if (this.tablewareItemsCount) this.addTableware = false;
      },
      toggleDeleteBasket() {
        this.showDropBasketModal = !this.showDropBasketModal;
      }
    },
    computed: {
      ...mapGetters({
        getDishes: STORE_GET_DISHES,
        getTotalPrice: STORE_GET_TOTAL_PRICE,
        getRestaurantUrl: STORE_GET_RESTAURANT_URL // take delivery info from this object
      })
    },
    components: {
      OrderForm,
      MyOrder,
    }
  }
</script>

<style>
  .basket__block {
    padding-top: 40px;
  }
</style>
