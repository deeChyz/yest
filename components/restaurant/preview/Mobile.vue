<template>
  <div class="mobile-preview__container">
    <div class="restaurant-preview__top">
      <h1 class="preview__title">
        {{ restaurant.name }}
      </h1>
      <v-icon class="material-icon" @click="handleClickShowRestInfo">info</v-icon>
      <v-bottom-sheet v-model="restaurantInfo" :light="true" overlay-opacity="0.5" :eager="true">
        <v-sheet class="restaurant-info__modal">
          <div class="modal__top">
            <p class="modal__title">
              {{ restaurant.name }}
            </p>
            <v-icon class="material-icon modal__button"
                    :size="35"
                    @click="handleClickShowRestInfo"
            >
              close
            </v-icon>
          </div>
          <div class="modal__center">
            <p class="modal__name">
              {{restaurant.name}}
            </p>
            <div class="modal__address"
                 v-for="(branch, index) in restaurant.branch"
                 :key="index"
            >
              {{branch.address}}
            </div>
            <div class="modal__tags">
              <div class="tags__list">
                <span class="tag__name" v-for="tag in restaurant.tags">
                    {{tag.name}}
                </span>
              </div>
            </div>
            <div class="modal__copyright">
              Исполнитель (продавец): {{restaurant.legal_info.business_firm_name}},
              {{restaurant.legal_info.business_address}},
              УНП {{restaurant.legal_info.business_unp}}.
            </div>
          </div>
        </v-sheet>
      </v-bottom-sheet>
    </div>
    <div class="restaurant-preview__center">
      <v-chip class="preview__show-rating-button"
              :color="showRatingSheet ? 'primary': null"
              :disabled="restaurant.rating === 0"
              @click="handleClickShowRating"
      >
        <v-icon class="material-icon">star</v-icon>
        {{ restaurant.rating ? restaurant.rating: 'Мало оценок' }}
      </v-chip>
      <v-bottom-sheet v-model="showRatingSheet" :light="true" overlay-opacity="0.5" :eager="true">
        <v-sheet>
          <div class="restaurant-rating__modal">
            <div class="modal__block">
              <p class="modal__title">
                Рейтинг
              </p>
              <v-icon class="material-icon"
                      :size="35"
                      @click="handleClickShowRating"
              >
                close
              </v-icon>
            </div>
          </div>
          <div v-if="restaurant.rating !== 0" class="modal__center-text">
            {{ restaurant.rating ? restaurant.rating : 'Мало оценок' }}
          </div>
        </v-sheet>
      </v-bottom-sheet>
      <v-chip class="preview__show-delivery-options-button"
              :color="showDeliveryOption ? 'primary': null"
              @click="handleClickShowDeliveryOptions"
      >
        Бесплатная доставка от {{ delivery && delivery.length && delivery[delivery.length-1].min }} BYN
      </v-chip>
      <v-chip class="preview__delivery-time" :color="showDeliveryOption ? 'primary': null">
        {{ restaurant.delivery.time.min }} - {{ restaurant.delivery.time.max }} минут
      </v-chip>
      <v-bottom-sheet v-model="showDeliveryOption" :light="true" overlay-opacity="0.5" :eager="true">
        <v-sheet class="restaurant__delivery-options">
          <div class="modal__top">
            <p class="modal__title">
              Условия доставки
            </p>
            <v-icon class="material-icon"
                    :size="35"
                    @click="handleClickShowDeliveryOptions"
            >
              close
            </v-icon>
          </div>
          <div class="modal__center">
            <div v-for="fee in restaurant.delivery.fee"
                 :key="`deliveryFee${fee.min}`"
                 class="modal__delivery-fee-time"
            >
              <v-icon class="material-icon">directions_run</v-icon>
              <span v-if="fee.delivery" class="modal__price">
                {{ fee.delivery }} BYN
                <span>на заказ от {{ fee.min }} BYN</span>
              </span>
              <span v-else class="modal__price">
                Бесплатная доставка при заказе от {{ fee.min }} BYN
              </span>
            </div>
          </div>
          <p class="modal__delivery-patner">
            Доставку выполнят партнёры Yest.by
          </p>
        </v-sheet>
      </v-bottom-sheet>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      restaurant: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        restaurantInfo: false,
        showRatingSheet: false,
        showDeliveryOption: false,
      }
    },
    computed: {
      delivery () {
        return this.restaurant && this.restaurant.delivery
            && this.restaurant.delivery.fee
            && this.restaurant.delivery.fee.length
            && this.restaurant.delivery.fee.sort((a, b) => {
            return a.min > b.min;
          })
      }
    },
    methods: {
      handleClickShowRestInfo () {
        this.restaurantInfo = !this.restaurantInfo;
      },
      handleClickShowRating () {
        this.showRatingSheet = !this.showRatingSheet;
      },
      handleClickShowDeliveryOptions () {
        this.showDeliveryOption = !this.showDeliveryOption;
      }
    },
  }
</script>
<style lang="scss" scoped>
  .mobile-preview__container {
    padding-top: 5px;
  }
  .restaurant-preview__top {
    display: flex;
    margin-bottom: 12px;
  }

  .preview__title {
    font-size: 24px;
    font-weight: 700;
    line-height: 28px;
    color: #3f3f3f;
    margin: 0 10px 0 8px;
  }

  .restaurant-preview__center {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 15px;
  }

  .preview__show-rating-button, .preview__show-delivery-options-button,
  .preview__delivery-time {
    background-color: $white !important;
    box-shadow: 0 2px 16px 0 rgb(0 0 0 / 7%);
    padding: 0 15px;
    font-size: 14px;
    margin: 0 8px 8px 0;
  }

  .preview__show-rating-button .v-icon {
    margin-right: 5px;
  }

  .restaurant-info__modal, .restaurant-rating__modal, .restaurant__delivery-options {
    padding: 20px;
  }

  .modal__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal__title {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 5px;
  }

  .modal__button {
    margin: 5px 0;
  }
</style>
