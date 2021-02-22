<template>
  <div class="">
    <div class="">
      <v-icon class="material-icon" @click="$router.back()">
        arrow_back
      </v-icon>
      <v-icon class="material-icon" @click="" v-if="selectedDishes.length > 0">
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
    <div class="" v-if="selectedDishes.length > 0">
      <h1 class="">Заказ</h1>
      <div class="">
        <client-only>
          <div v-for="order in selectedDishes" :key="`${order.id}`" class="">
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
      <div class="" v-if="selectedDishes.length > 0">
        <span>Доставка yest.by</span>
        <span>{{ (deliveryPrice).toFixed(2) }} BYN</span>
      </div>
      <div class="">
        <div class="">
          <img class=""
               src="@/assets/svg/order/orderKnifesIcon.svg"
               alt="knifes"
          >
          <div class="" v-if="cutlery">
            <v-btn icon class="" @click="">
              <v-icon class="material-icon">remove</v-icon>
            </v-btn>
            <div class="">
              {{ cutleryCounter }}
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
                  v-model="cutlery"
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
      <div class="" v-if="selectedDishes.length > 0">
        <div class="">
          <span class="">
            {{ (parseFloat(totalPrice) + deliveryPrice).toFixed(2) }} BYN
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
    <div v-if="selectedDishes.length === 0" class="">
      <div class=""></div>
      <div class="">
        Корзина пуста
      </div>
      <div class="">
        Перейдите к списку мест, чтобы оформить заказ
      </div>
    </div>
  </div>
</template>

<script>
  const lazySrc = 'https://yastatic.net/s3/eda-front/prod-www/assets/fallback-pattern-9d2103a870e23618a16bcf4f8b5efa54.svg';
  import { mapGetters } from 'vuex';
  import { STORE_GET_TOTAL_PRICE } from "@/utils/confs/pages/basket";


  export default {
    data() {
      return {
        showDropBasketModal: false,
        deliveryPrice: 0,
        deliveryTime: {
          min: 0,
          max: 10,
        },
        cutlery: null
      }
    },
    computed: {
      ...mapGetters({
        selectedDishes: null,
        totalPrice: STORE_GET_TOTAL_PRICE
      }),
      cutleryCounter() {
        return 1;
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
