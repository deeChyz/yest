<template>
  <div class="dish__item" @click="onPlusButtonClick">
    <v-card v-if="dish !== null" class="dish__card">
      <div class="card__block">
        <div class="card__dish-preview-img">
          <span v-if="dish.sizes && dish.sizes[0] && dish.sizes[0].sale === 2" class="card__sale">%</span>
          <img :src="'https://img.eatmealby.com/resize/dish/400/' + dish.image" :alt="dish.name" class="card__image">
          <div v-if="!dish.image" class="no-picture-block"></div>
        </div>
        <div class="card__container">
          <div class="card__top">
            <h3 class="card__dish-name">
              {{ dish.name }}
            </h3>
          </div>
          <div class="card__center">
          <span class="card__price" v-if="!dishInBasket(dish)">
            <span class="card__price-value">
              {{computedPrice(dish.sizes)}} BYN
            </span>
            <span class="card__price-dot">
              &nbsp;•&nbsp;
            </span>
          </span>
            <span class="card__description">
            <span class="description__weight">
              {{ dish.sizes[0] ? dish.sizes[0].weight : '' }}
            </span>
            <span class="description-text">
              {{ dish.description }}
            </span>
          </span>
          </div>
          <div class="card__bottom">
            <div class="card__interact-block">
              <template  v-if="!dishInBasket(dish)">
                <yest-button color="gray">
                  <div class="card__price-box card__button">
                  <span class="current-price">
                    {{ dish.sizes[0] ? dish.sizes[0].price.toFixed(1) : '' }} BYN
                  </span>
                    <span v-if="dish.sizes[0].sale === 2" class="old-price">
                    {{ (dish.sizes[0].price + dish.sizes[0].discount).toFixed(1) }} BYN
                  </span>
                  </div>
                </yest-button>
                <yest-button class="card__add-button-near-price" color="gray" @click="onPlusButtonClick">
                  <template slot="icon">
                    <v-icon class="card__button material-icon">
                      add
                    </v-icon>
                  </template>
                </yest-button>
              </template>
              <div v-else class="card__select-dish-box">
                <yest-button color="gray">
                  <template slot="icon">
                    <v-icon class="card__button material-icon" @click="">
                      remove
                    </v-icon>
                  </template>
                </yest-button>
                <div class="card__dishes-count">
                  {{ dishesCount(dish) }}
                </div>
                <yest-button color="gray">
                  <template slot="icon">
                    <v-icon class="card__button material-icon" @click="">
                      add
                    </v-icon>
                  </template>
                </yest-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-card>
    <v-bottom-sheet
      v-model="showDishModal"
      :light="true"
      overlay-opacity="0.5"
      scrollable
      persistent
      no-click-animation
      z-index="2"
      :eager="true"
    >
      <v-card class="v-card__block">
        <v-card-text class="v-card__text-block">
          <div class="v-card__top">
            <div class="modal__close">
              <v-btn class="close-button" icon color="white" @click="showDishModal = false">
                <v-icon class="material-icon" color="black">close</v-icon>
              </v-btn>
            </div>
            <div class="modal__img-container">
              <img :src="'https://img.eatmealby.com/resize/dish/400/'+dish.image"
                   :alt="dish.name"
                   class="modal__img"
              >
            </div>
            <div class="modal__description">
              {{ dish.description }}
            </div>
            <div class="modal__ingredients">
              <div v-show="dish.sizes.length > 1" class="modal__sizes">
                <div class="modal__section-title">
                  Размер на выбор
                </div>
                <v-radio-group v-model="sizesRadioButtons"
                               :mandatory="false"
                               class="sizes__radio-group"
                >
                  <v-radio v-for="size in dish.sizes"
                           :key="size.id"
                           class="radio-button"
                           :value="size"
                           color="primary"
                  >
                    <template v-slot:label>
                      <p class="section__main-block">
                        <span class="section__title">
                          {{ size.name }}
                          <span v-if="size.weight">
                            ({{ size.weight }})
                          </span>
                        </span>
                        <span class="section__price">
                          {{ size.price-dish.sizes[0].price === 0 ?
                              `` : `+${(size.price-dish.sizes[0].price).toFixed(1)} BYN`
                          }}
                        </span>
                      </p>
                    </template>
                  </v-radio>
                </v-radio-group>
              </div>
              <div v-show="dish.options.length > 0" class="modal__options">
                <div class="modal__section-title">
                  Дополнительниые ингреденеты
                </div>
                <div v-for="(option, index) in dish.options"
                     :key="option.id"
                     class="section__option"
                >
                  {{ option.title }}
                  <div v-if="option.multi_data !== 1" class="section__option-container">
                    <v-radio-group v-model="dishOptionsCounter[index].selected"
                                   :mandatory="false"
                                   class="options__radio-group"
                    >
                      <v-radio v-for="option in option.variants"
                               :key="option.id"
                               :value="option"
                               color="primary"
                      >
                        <template v-slot:label>
                          <p class="section__main-block">
                            <span class="section__title">
                              {{ option.name }}
                            </span>
                            <span v-show="!option.free" class="section__price">
                              {{ option.price[0] !== undefined ?
                                (option.price[0].price == null ?
                                  `0` : option.price[0].price)
                                : 0
                              }} BYN
                            </span>
                          </p>
                        </template>
                      </v-radio>
                    </v-radio-group>
                  </div>
                  <div v-else>
                    <v-checkbox v-for="option in option.variants"
                                :key="option.id"
                                v-model="dishOptionsCounter[index].selected"
                                :value="option"
                    >
                      <template v-slot:label>
                        <p class="section__main-block">
                          <span class="section__title">
                            {{ option.name }}
                          </span>
                          <span class="section__price">
                            {{ option.price[0] !== undefined
                                ? (option.price[0].price == null
                                    ? `0` : ( option.price[0].price > 0
                                        ? `+ ${option.price[0].price}`:`${option.price[0].price}`)
                                )
                                : 0 }} BYN
                          </span>
                        </p>
                      </template>
                    </v-checkbox>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="v-card__bottom">
            <div class="info">
              <div class="info__name">
                {{ dish.name }}
              </div>
              <div class="info__price">
                {{ sizesRadioButtons.price }} BYN
              </div>
            </div>
            <div class="interact-block">
              <div class="interact__buttons">
                <v-icon class="material-icon" @click="">
                  remove
                </v-icon>
                <span class="interact__counter">{{ selectedDishCounter }}</span>
                <v-icon class="material-icon" @click="">
                  add
                </v-icon>
              </div>
              <yest-button class="interact__add-button" @click="">
                Добавить
              </yest-button>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
    <v-bottom-sheet
      v-model="currentAddress"
      :light="true"
      overlay-opacity="0.5"
      scrollable
      persistent
      no-click-animation
      z-index="999"
      :eager="true"
    >
      <v-sheet class="rest-ship-modal">
        <div class="rest-ship-modal__top">
          <p class="rest-ship-modal__title">
            Укажите ваш адрес
          </p>
          <v-icon color="#000" @click="">
            close
          </v-icon>
        </div>
        <div class="rest-ship-modal__wrapper">
          <div class="rest-ship-modal__item">
            Укажите адрес доставки, чтобы начать оформление заказа
          </div>
        </div>
        <div class="rest-ship-modal__map-block" @click="">
          <yest-button :is-map-button="true"/>
        </div>
      </v-sheet>
    </v-bottom-sheet>
    <v-bottom-sheet
      v-model="showPreorderMobileForm"
      :light="true"
      overlay-opacity="0.5"
      scrollable
      persistent
      no-click-animation
      z-index="999"
      :eager="true"
    >
      <v-card class="pa-3">
        <v-card-title class="d-flex flex-row justify-space-between align-start">
          <span>
            Доставка недоступна
          </span>
          <span @click="showPreorderMobileForm = false">
            <v-icon>close</v-icon>
          </span>
        </v-card-title>
        <v-card-text>
          К сожалению, доставка к указанному времени недоступна. Ближайшее время - сегодня в 19:00
        </v-card-text>
        <v-card-actions class="d-flex flex-column">
          <v-btn color="primary" class="mb-2" @click="">
            Доставить в ближайшее время
          </v-btn>
          <v-btn @click="">
            Посмотреть доступные места
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
  import {mapActions, mapGetters} from "vuex";
  import {
    STORE_ADD_TO_BASKET,
    STORE_DECREMENT_DISH_COUNTER,
    STORE_REMOVE_DISH_FROM_BASKET
  } from "../../utils/confs/pages/restaurant";
  import { STORE_GET_DISHES } from "@/utils/confs/pages/basket";

  import deviceMixin from "@/utils/mixins/deviceMixin";

  export default {
    mixins: [ deviceMixin ],
    props: {
      dish: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
        currentAddress: '',
        showPreorderMobileForm: false,
        sizesRadioButtons: '',
        selectedDishCounter: 1,
        dishOptionsCounter: 0,
        showDishModal: false,
      }
    },
    methods: {
      ...mapActions({
        addDishToBasket: STORE_ADD_TO_BASKET,
        removeDishFromBasket: STORE_REMOVE_DISH_FROM_BASKET,
        decrementDishCounter: STORE_DECREMENT_DISH_COUNTER
      }),
      onCardClick () {
        if (this.isMobile) {
          this.showDishModal = !this.showDishModal;
        } else {
          this.$emit('cardClicked', this.dish);
        }
      },
      onPlusButtonClick () {
        if (this.dishHasMoreThanOneSize) {
          this.onCardClick();
        } else {
          this.addDishToBasket(this.dish);
        }
      },
      onMinusButtonClick () {
        if (this.overallSizesCounter === 1) {
          this.removeDishFromBasket(this.dish);
        } else {
          this.decrementDishCounter(this.dish);
        }
      },
      dishInBasket (dish) {
        return false;
      },
      dishesCount (dish) {
        const findItem = this.getDishes.find((item) => {
          return item.id === dish.id
        })
        if (findItem !== undefined) {
          return findItem.selectSize.count
        } else {
          return 0;
        }
      },
      computedPrice (prices) {
        if (prices.length === 0) {
          return 'Нет цены'
        } else if (prices.length > 1) {
          const chekDiffrentPrice = prices.find((dish, index, arr) => {
            return dish.price === arr[index - 1]
          })
          if (chekDiffrentPrice !== undefined) {
            return `От ${prices[0].price}`
          } else {
            return `${prices[0].price}`
          }
        } else {
          return `${prices[0].price}`
        }
      },
    },
    computed: {
      ...mapGetters({
        getDishes: STORE_GET_DISHES,
      }),
      overallSizesCounter () {
        return this.dish.sizes.reduce((sizesCount, currentSize) => sizesCount + currentSize.count, 0);
      },
      dishHasMoreThanOneSize () {
        return this.dish.sizes.length > 1;
      },
    }
  }
</script>

<style lang="scss" scoped>
  .dish__item {
    background-color: $white;
    box-shadow: 0 5px 30px rgb(117 115 111 / 20%);
    border-radius: 24px;
    width: 47%;
    margin-right: 3%;
    margin-bottom: 15px;
    padding: 0 10px 10px;
    text-align: center;
    @include media($sm) {
      width: 30%;
      margin-right: 3.33%;
    }
    @include media($md) {
      width: 23%;
      margin-right: 2%;
    }
    @include media($lg) {
      width: calc((100% - 40px) / 2);
      border-radius: 0;
      box-shadow: none;
      margin: 0 0 40px;
      padding: 18px 20px;
      cursor: pointer;
      &:nth-child(2n - 1) {
        margin-right: 40px;
      }
    }
  }
  .dish__card {
    overflow: hidden;
    box-shadow: none !important;
    border-radius: 0 !important;
    background-color: unset !important;
    @include media($lg) {
      height: 100%;
    }
  }

  .card__block {
    @include media($lg) {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }

  .card__container {
    display: flex;
    flex-direction: column;
    padding-bottom: 14px;
    @include media($lg) {
      order: 1;
    }
  }

  .card__top {
    height: 40px;
    margin: 8px 0 2px;
    padding: 0 14px;
    font-size: 14px;
    @include media($lg) {
      padding: 0;
    }
  }

  .card__dish-name {
    color: #21201F;
    display: -webkit-box;
    overflow: hidden;
    font-size: 14px;
    word-break: break-word;
    font-weight: 400;
    line-height: 19px;
    margin-bottom: 4px;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    @include media($lg) {
      font-size: 18px;
      line-height: 1.39;
      font-weight: bold;
      text-align: left;
    }
  }

  .card__center {
    display: flex;
    justify-content: center;
    padding: 0 14px 16px;
    color: #c2c0be;
    font-size: 13px;
    text-align: left;
    @include media($lg) {
      flex-direction: column;
      padding: 0;
      margin-top: 15px;
    }
    @include media($xxl) {
      margin-top: 10px;
    }
  }

  .card__price-value {
    @include media($lg) {
      font-size: 16px;
      font-weight: bold;
      color: $black;
    }
  }

  .card__price-dot {
    @include media($lg) {
      display: none;
    }
  }

  .card__description {
    @include media($lg) {
      margin-top: 10px;
    }
  }

  .description__weight {
    @include media($lg) {
      font-size: 16px;
    }
  }

  .description-text {
    display: none;
    @include media($lg) {
      display: block;
      font-size: 15px;
    }
  }

  .card__bottom {
    display: flex;
    justify-content: center;
    @include media($lg) {
      display: none;
    }
  }

  .card__interact-block {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    .card__add-button-near-price {
      margin-left: 10px;
    }
  }

  .card__add-button {
    color: #7d7d7d !important;
    font-size: 17px;
    font-weight: 400;
    letter-spacing: -0.5px;
    height: 30px;
    width: 30px;
    background-color: #F1F0ED;
    border-radius: 4px;
  }

  .card__select-dish-box {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    padding: 0;
  }

  .yest-button {
    padding: 13px !important;
    border-radius: 16px !important;
  }

  .card__button {
    font-size: 17px;
    font-weight: 400;
    letter-spacing: -0.5px;
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    margin: 0;
    white-space: nowrap;
  }

  .card__dishes-count {
    font-size: 20px;
    color: $black;
  }

  .card__price-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .current-price {
    font-size: 14px;
  }

  .old-price {
    color: #9E9B98;
    font-size: 11px;
    margin-top: 2px;
    text-decoration: line-through;
  }

  .card__dish-preview-img {
    padding-top: 10px;
    position: relative;
    @include media($lg) {
      order: 2;
      height: 100%;
      display: flex;
      align-items: flex-end;
    }
  }

  .card__sale {
    position: absolute;
    top: 25px;
    left: 5px;
    background-color: #f44336;
    width: 30px;
    height: 23px;
    display: flex;
    justify-content: center;
    color: #fff;
    font-weight: 400;
    font-size: 16px;
    border-radius: 16px;
  }

  .card__image {
    width: 100%;
    object-fit: cover;
    border-radius: 4px;
    overflow: hidden;
    font-size: 14px;
    color: $gray-b0;
  }

  .no-picture-block {
    height: 90px;
  }

  .v-card__top {
    padding-bottom: 145px;
  }

  .v-bottom-sheet__block {
    height: 65% !important;
  }

  .v-card__text-block {
    padding: 0 !important;
  }

  .card__top {
    background: #fafafa;
  }

  .modal__close {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .close-button {
    background-color: $white;
    border-radius: 50%;
  }

  .modal__img-container {
    height: 280px;
    overflow: hidden;
  }

  .modal__img {
    width: 100%;
  }

  .modal__description {
    padding: 12px 16px 16px;
    font-size: 14px;
    line-height: 22px;
    color: $black;
  }

  .modal__ingredients {
    padding: 0 12px;
  }

  .modal__section-title {
    color: $gray-b0;
    font-size: 12px;
    padding-top: 8px;
    text-transform: uppercase;
  }

  .sizes__radio-group {
    margin-top: 20px !important;
  }

  .section__main-block {
    padding: 10px 0 !important;
    border-bottom: 1px solid $x-light-gray;
    margin-bottom: 0 !important;
    width: 100% !important;
    color: $black !important;
  }

  .section__title {
    font-size: 14px;
  }

  .section__price {
    color: $gray-b0;
    font-size: 14px;
    margin-left: 10px;
    white-space: nowrap;
  }

  .v-card__bottom {
    padding: 16px 16px 26px;
    width: 100%;
    background-color: $white;
    flex: 0 0 auto;
    border-top: 1px solid #ececec;
    box-shadow: 0 -2px 10px 0 #ececec;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    background-color: unset !important;
    border-color: unset !important;
    color: $black;
    line-height: 1.25;
    font-size: 16px;
  }

  .interact-block {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .interact__buttons {
    border: 1px solid $x-light-gray;
    display: flex;
    padding: 15px 20px;
    height: 56px;
    align-items: center;
    margin-right: 10px;
    justify-content: center;
    background-color: $white;
    border-radius: 16px;
  }

  .interact__counter {
    min-width: 24px;
    margin: 0 10px;
    text-align: center;
  }

  .interact__add-button {
    width: 100%;
    border-radius: 16px !important;
    font-size: 17px;
    padding: 15px 0 !important;
  }
</style>
