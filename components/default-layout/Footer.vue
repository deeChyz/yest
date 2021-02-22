<template>
  <div class="footer__block">
    <div class="footer__logo-block">
      <div class="footer__logo">
        <img class="footer__img" src="@/assets/svg/logo.svg" alt="logo">
      </div>
    </div>
    <div class="footer__center-block">
      <div class="footer__main-information">
        <div class="main__block">
          <div class="list__block">
            <div class="list__title">Регионы</div>
            <div>
              <client-only>
                <div
                  v-for="zone in getZoneList"
                  :key="'footerRegion' + zone.alias"
                  @click="handleZoneClick(zone)"
                  class="list__item"
                >
                  {{ zone.name }}
                </div>
              </client-only>
            </div>
          </div>
          <div class="list__block">
            <div class="list__title">Блюда и кухни</div>
            <div class="list__items">
              <client-only>
                <div
                  v-for="category in currentCategoryList"
                  :key="+ 'footerCategory' + category.alias "
                  @click="handleCategoryClick(category)"
                  class="list__item"
                >
                  {{ category.name }}
                </div>
                <div v-if="!allCategories" @click="allCategories = !allCategories" class="list__show-more-button">
                  Показать все >
                </div>
              </client-only>
            </div>
          </div>
        </div>
        <div class="list__block">
          <div class="list__title list__title--about-company">О компании</div>
          <div>
            <nuxt-link v-for="link in links"
                       :key="link.label"
                       class="list__item list__item--about-company"
                       :to="{name: link.routeName}"
            >
              {{ link.label }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <div class="information__block">
      <div class="copyright__block">
        ООО «Фудтех системс», юр.адрес: 223016, <br/>Минский район, д. Королищевичи, ул. Центральная, 86, к. 1
      </div>
      <div class="social-links">
        <a href="https://www.facebook.com/groups/yestby/" rel="nofollow" target="_blank" class="social-link">
          <img src="@/assets/svg/social-links/fb.svg" alt="facebook" class="social-link__img">
        </a>
        <a href="https://vk.com/yestby" rel="nofollow" target="_blank" class="social-link">
          <img src="@/assets/svg/social-links/vk.svg" alt="vk" class="social-link__img">
        </a>
        <a href="https://www.instagram.com/yest.by/" rel="nofollow" target="_blank" class="social-link">
          <img src="@/assets/svg/social-links/insta.svg" alt="instagramm" class="social-link__img">
        </a>
        <a href="https://twitter.com/yest_by" rel="nofollow" target="_blank" class="social-link">
          <img src="@/assets/svg/social-links/twitter.svg" alt="twitter" class="social-link__img">
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  import CategoryApi from "@/api/CategoryApi";
  import handleZoneClickMixin from "../../utils/mixins/handleZoneClickMixin";
  import { mapGetters, mapActions } from 'vuex';

  import {
    STORE_GET_CATEGORIES,
    STORE_GET_SELECTED_ZONE,
    STORE_SET_CATEGORIES,
  } from '../../utils/confs/pages/defaultLayout';
  import ZoneApi from "../../api/ZoneApi";
  import { STORE_SET_ZONES } from "../../utils/confs/pages/home";

  export default {
    mixins: [handleZoneClickMixin],
    data() {
      return {
        allCategories: false,
        links: [
          {
            label: 'Контакты',
            routeName: 'contacts'
          },
          {
            label: 'Доставка',
            routeName: 'delivery'
          },
          {
            label: 'Пользовательское соглашение',
            routeName: 'terms-of-use'
          },
          {
            label: 'Вопросы и ответы',
            routeName: 'faq'
          },
          {
            label: 'Стать партнёром',
            routeName: 'partner'
          },
          {
            label: 'Стать курьером',
            routeName: 'rabota'
          },
          {
            label: 'Еда для бизнеса',
            routeName: 'business'
          },
        ]
      }
    },
    async fetch() {
      if (!this.getZoneList || (this.getZoneList && !this.getZoneList.length)) {
        const zoneList = await ZoneApi.getZones();
        this.setZones(zoneList);
      }
      let categories = [];
      if (this.getCategoryList && this.getCategoryList.length) {
        return;
      } else if (this.getSelectedZone && this.getSelectedZone.id) {
        categories = await CategoryApi.getCategories({ zone_id: this.getSelectedZone.id });
      } else {
        categories = await CategoryApi.getCategories({ zone_id: 1 }); // Take first zone id maybe ?
      }
      this.setCategories(categories);
    },
    methods: {
      ...mapActions({
        setCategories: STORE_SET_CATEGORIES,
        setZones: STORE_SET_ZONES
      }),
      handleCategoryClick(category) {
        this.$router.push({ name: 'restaurantsWithCategory', params: {
          region: this.getSelectedZone ? this.getSelectedZone.alias : 'minsk',
          category: category.alias
        }});
      }
    },
    computed: {
      ...mapGetters({
        getCategoryList: STORE_GET_CATEGORIES,
        getSelectedZone: STORE_GET_SELECTED_ZONE
      }),
      currentCategoryList() {
        if (this.allCategories) {
          return this.getCategoryList;
        }
        return this.getCategoryList.slice(0, 4);
      },
    }
  }
</script>

<style lang="scss" scoped>
  .footer__block {
    line-height: 1.5;
    background-color: $gray-249;
  }

  .footer__logo-block {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .footer__logo {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 900px;
    padding: 20px;
    margin: auto;
    @include media($lg) {
      padding: 10px 0;
    }
    @include media($xl) {
      max-width: 1420px;
      padding: 10px 160px;
    }
    @include media($xxl) {
      padding: 10px 120px;
    }
  }

  .footer__img {
    max-height: 40px;
    opacity: .5;
    filter: grayscale(1);
    margin: 10px;
    @include media($lg) {
      margin: 0;
    }
  }

  .footer__center-block {
    @include media($lg) {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
  }

  .footer__main-information {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 900px;
    margin: auto;
    @include media($lg) {
      flex-direction: row;
      justify-content: space-between;
      padding: 35px 0 25px;
    }
    @include media($xl) {
      max-width: 1420px;
      padding: 30px 160px;
      align-items: flex-start;
    }
    @include media($xxl) {
      padding: 30px 120px;
    }
  }

  .main__block {
    display: flex;
    flex-direction: column-reverse;
    @include media($lg) {
      flex-direction: row;
    }
  }

  .list__block {
    padding: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    @include media($lg) {
      width: 215px;
      border-bottom: unset;
      padding: 0;
    }
  }

  .list__title {
    width: 100%;
    margin-bottom: 15px;
    color: $gray-b0;
    font-size: 12px;
    font-weight: 300;
    letter-spacing: 2px;
    text-transform: uppercase;
    @include media($lg) {
      color: #646464;
      margin-bottom: 30px;
      font-size: 17px;
      font-weight: bold;
      line-height: 1.76;
      text-transform: unset;
      letter-spacing: normal;
    }
  }

  .list__title--about-company {
    @include media($lg) {
      display: flex;
      justify-content: flex-end;
    }
  }

  .list__items {
    column-count: 2;
    @include media($lg) {
      column-count: unset;
    }
  }

  .list__item, .list__item a, .list__show-more-button {
    width: fit-content;
    margin-bottom: 10px;
    color: #818181;
    display: block;
    font-size: 12px;
    text-decoration: none;
    cursor: pointer;
    letter-spacing: 0.05rem;
    @include media($lg) {
      color: $gray-b8;
      font-size: 13px;
    }
    @include media($xl) {
      margin-bottom: 17px;
    }
    &:hover {
      text-decoration: underline;
    }
    &:last-child {
      margin-bottom: 0;
      @include media($lg) {
        margin-bottom: 10px;
      }
    }
  }

  .list__item--about-company {
    @include media($lg) {
      margin-left: auto;
    }
  }

  .information__block {
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    margin: auto;
    max-width: 900px;
    @include media($lg) {
      flex-direction: row;
      justify-content: space-between;
      padding: 35px 0 25px;
    }
    @include media($xl) {
      max-width: 1420px;
      padding: 10px 160px;
      align-items: center;
    }
    @include media($xxl) {
      padding: 10px 120px;
    }
  }

  .copyright__block {
    color: $gray-b8;
    font-size: 13px;
    font-weight: 300;
    display: flex;
    align-items: center;
    line-height: 1.5;
    letter-spacing: 0.05rem;
    margin-bottom: 15px;
  }

  .social-links {
    display: flex;
    flex-direction: row;
    padding-right: 20px;
  }

  .social-link {
    margin-left: 25px;
    &:first-child {
      margin-left: 0;
    }
  }

  .social-link__img {
    width: 35px;
    height: 35px;
    cursor: pointer;
  }
</style>
