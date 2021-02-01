<template>
  <div class='special-offer__container'>
    <div v-swiper="swiperOptions" id='swiper' ref="swiper">
      <div class="swiper-wrapper special-offer__wrapper">
        <a class="swiper-slide special-offer__slide" :href="item.link" v-for='(item, index) in offers' :key='index'
           @click="goToUrl(item)">
          <img :src='item.image' :alt="`special-offer${index}`" class="special-offer__img"/>
        </a>
      </div>
      <div class="custom-btn-prev" slot="button-prev">
        <div class="custom-btn-prev__box"></div>
      </div>
      <div class="custom-btn-next" slot="button-next">
        <div class="custom-btn-next__box"></div>
      </div>
      <div class="swiper-pagination" slot="pagination"></div>
    </div>
  </div>
</template>

<script>
  import {directive} from 'vue-awesome-swiper';
  import {Swiper, Navigation, Autoplay} from 'swiper';

  Swiper.use(Navigation);
  Swiper.use(Autoplay);

  export default {
    directives: {
      swiper: directive
    },
    props: {
      offers: {
        type: Array,
        default: () => []
      },
    },
    data () {
      return {
        swiperOptions: {
          observer: true,
          observeParents: false,
          slidesPerView: 4,
          spaceBetween: 30,
          navigation: {
            nextEl: '.custom-btn-next',
            prevEl: '.custom-btn-prev',
          },
          autoplay: {
            delay: 5000,
          },
          breakpoints: {
            1200: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
            992: {
              slidesPerView: 3,
            },
            600: {
              slidesPerView: 2.1,
            },
            360: {
              slidesPerView: 1.1,
              spaceBetween: 20,
            }
          }
        }
      }
    },
    methods: {
      goToUrl(url) {
        window.location.href = url;
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/scss/specialOffers.scss";

  #swiper {
    padding: 20px;
    max-width: 1420px;
    width: 100%;
    margin: 0 auto;
    @include media($lg) {
      padding: 0 80px;
    }
  }
  .special-offer__container {
    border-top: 1px solid rgba(0, 0, 0, .1);
    padding: 0;
    @include media($lg) {
      width: 100%;
      max-width: 1420px;
      padding: 1rem 0 0;
      margin: auto;
      border-left: 1px solid rgba(0, 0, 0, .1);
      border-right: 1px solid rgba(0, 0, 0, .1);
    }
  }

  .special-offer__slide {
    width: 100%;
    height: 162px !important;
    overflow: hidden;
    border-radius: 10px;
  }

  .special-offer__img {
    cursor: pointer;
    border-radius: 10px;
    height: 100%;
  }

  .special-offer__wrapper {
    width: fit-content;
  }

  .custom-btn-prev,
  .custom-btn-next {
    display: none;
    @include media($lg) {
      position: absolute;
      top: -1px;
      bottom: 0;
      background: #fff;
      z-index: 1;
      overflow: hidden;
      width: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .custom-btn-prev {
    @include media($lg) {
      left: -1px;
    }
  }

  .custom-btn-next {
    @include media($lg) {
      right: -1px;
    };
  }

  .custom-btn-next__box, .custom-btn-prev__box {
    z-index: 10;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    height: 40px;
    width: 40px;
    background-position: center;
    background-color: $green;
  }

  .custom-btn-next__box {
    background-image: url("../../assets/svg/nextArrowIcon.svg");
  }

  .custom-btn-prev__box {
    background-image: url("../../assets/svg/prevArrowIcon.svg");
  }

  .custom-btn-prev.swiper-button-disabled .custom-btn-prev__box,
  .custom-btn-next.swiper-button-disabled .custom-btn-next__box {
    display: none;
  }
</style>
