<template>
  <div>
    <div class="dish-options__background"></div>
    <v-card width="50vw" class="dish__options">
      <div class="options__header">
        <div class="options__title">
          Выберите опции
        </div>
        <div class="options__close-button" @click="$emit('close')">
          <v-icon class="material-icon" color="black">
            close
          </v-icon>
        </div>
      </div>
      <div class="options__list">
        <div v-show="dish.sizes.length > 1" class="options__sizes">
          <div class="sizes__title">
            Размер на выбор
          </div>
          <v-radio-group v-model="sizesRadioButtons"
                         :mandatory="false"
                         class="size__radio-group"
          >
            <v-radio v-for="size in dish.sizes"
                     :key="size.id"
                     :value="size"
                     color="primary"
            >
              <template v-slot:label>
                <div class="size__text">
                  <span class="size__name">
                    {{ size.name }}
                  </span>
                  <span v-if="size.weight" class="size__weight">
                    ({{ size.weight }})
                  </span>
                </div>
                <span class="size__price">
                  {{ countDiffPrice(size) }}
                </span>
              </template>
            </v-radio>
          </v-radio-group>
        </div>
        <div v-show="dish.options.length > 0"
             class="options__additional-ingredients"
        >
          <div class="additional-ingredient__title">
            Дополнительниые ингреденеты
            <!-- {{this.selectedDish.options}} -->
          </div>
          <div v-for="(option, index) in dish.options"
               :key="option.id"
               class="ingredients__list"
          >
            <div class="ingredient__title">
              {{ option.title }}
            </div>
            <div v-if="option.multi_data !==1" class="ingredients-options">
              <v-radio-group v-model="dishOptionsCounter[index].selected"
                             :mandatory="false"
                             class="ingredient-options__radio-group"
              >
                <v-radio v-for="option in option.variants"
                         :key="option.id"
                         :value="option"
                         color="primary"
                >
                  <template v-slot:label>
                    <p class="option__text">
                      <span class="option__name">
                        {{ option.name }}
                      </span>
                      <span v-show="!option.free" class="option__price">
                        {{ option.price[0] !== undefined
                            ? (option.price[0].price == null ? `0`
                            : option.price[0].price) : 0
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
                  <p class="option__text">
                    <span class="option__name">
                      {{ option.name }}
                    </span>
                    <span class="option__price">
                      {{ option.price[0] !== undefined
                          ? (option.price[0].price == null
                              ? `0` :( option.price[0].price > 0
                                  ? `+ ${option.price[0].price}` :`${option.price[0].price}`))
                              : 0
                      }} BYN
                    </span>
                  </p>
                </template>
              </v-checkbox>
            </div>
          </div>
        </div>
      </div>
      <div class="options__bottom">
        <div class="options__interact-area">
          <yest-button class="options__button" @click="onAddButtonClick">
            Добавить
          </yest-button>
          <div class="options__buttons-block">
            <v-icon color="black" @click="decrementSelectedDishCounter">
              remove
            </v-icon>
            <span class="options__dish-count">
              {{ selectedDishCounter }}
            </span>
            <v-icon color="black" @click="incrementSelectedDishCounter">
              add
            </v-icon>
          </div>
        </div>
        <div class="final-price__block">
          <div class="final-price__text">
            Сумма
          </div>
          <div class="final-price__price-value">
            {{ getTotalPrice }} BYN
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
  import dishModalMixin from "../../utils/mixins/dishModalMixin";

  export default {
    mixins: [ dishModalMixin ],
    props: {
      dish: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
        dishOptionsCounter: 0
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dish-options__background {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    z-index: 4;
    background-color: rgba(33, 33, 33, .3);
  }

  .dish__options {
    position: fixed !important;
    top: 35%;
    left: calc((100% - 500px)/2);
    background-color: $white;
    border-radius: 10px !important;
    z-index: 5;
  }

  .options__header {
    display: flex;
    justify-content: space-between;
    padding: 14px 20px 0;
    margin-bottom: 12px;
  }

  .options__title {
    font-size: 24px;
    font-weight: 700;
    line-height: 36px;
  }

  .options__list {
    background: #fafafa;
    border-bottom: 1px solid #ececec;
    padding: 14px 20px 0;
  }

  .sizes__title {
    color: $gray-b0;
    font-size: 12px;
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  .size__text {
    font-size: 14px;
    color: $black;
    margin-right: 15px;
  }

  .options__bottom {
    display: flex;
    justify-content: space-between;
    padding: 20px;
  }

  .options__interact-area {
    display: flex;
    align-items: center;
  }

  .options__button {
    border-radius: 4px !important;
    padding: 12px 70px !important;
    margin-right: 20px;
  }

  .options__buttons-block {
    border: .1px solid rgba(0,0,0,.15);
    border-radius: 3px;
    padding: 10px 10px;
  }

  .options__dish-count {
    padding: 0 15px;
  }

  .final-price__block {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .final-price__text {
    color: $gray-b0;
    font-size: 14px;
    margin-bottom: 3px;
  }
</style>
