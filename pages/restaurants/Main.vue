<template>
  <div>
    <SetAddress :currentCategory='currentCategory'
                :categoryInfo='categoryInfo'
                :class="{ hide: !showSetAddressLabel }"
    />
    <SpecialOffers v-show="showSpecialOffers"
                   :offers="specialOffers"
    />
    <Categories v-show="categoriesList && categoriesList.length"
                :categoriesList='categoriesList'
                :currentCategory='currentCategory'
                @categoryItemClicked="chooseCategory"
    />
    <Offers :restaurantsList='timeFilteredRestaurantsBySpecialOfferList'
            :currentCategory='currentCategory'
    />
    <List :restaurantsList='restaurantsList'
          :currentCategory='currentCategory'
    />
  </div>
</template>

<script>
  import SetAddress from "../../components/restaurants/SetAddress.vue";
  import SpecialOffers from "../../components/restaurants/SpecialOffers.vue";
  import Categories from "../../components/restaurants/Categories.vue";
  import Offers from "../../components/restaurants/Offers.vue";
  import List from "../../components/restaurants/List.vue";
  import CategoryApi from "../../api/CategoryApi";
  import ZoneApi from "../../api/ZoneApi";
  import RestaurantApi from "../../api/RestaurantApi";
  import MetaInfoHelper from "../../utils/helpers/MetaInfoHelper";
  import RestaurantsHelper from "../../utils/helpers/RestaurantsHelper";
  import { mapGetters } from "vuex";
  import { DEFAULT_REDIRECT_URL, SCHEMA_URL } from "../../utils/confs/shared";
  import {
    CATEGORY_ALL,
    DEFAULT_BREADCRUMB,
    CATEGORY_INFO_DEFAULT_BACKGROUND_URL,
    STORE_GET_CATEGORIES,
    STORE_SET_ZONES,
    STORE_SET_SELECTED_ZONE,
    STORE_GET_CURRENT_COORDS,
    STORE_SET_CATEGORIES,
    STORE_GET_SELECTED_ZONE,
  } from "../../utils/confs/pages/restaurants";


  export default {
    data () {
      return {
        showSetAddressLabel: true,
        showSpecialOffers: false,
        restaurantsList: [],
        timeFilteredRestaurantsBySpecialOfferList: [],
        categoriesList: [],
        specialOfferRestaurants: [],
        currentCategory: null,
        categoryInfo: null,
        currentZone: null
      }
    },
    async asyncData ({ store, params, redirect, req }) {
      // Getting zones and init current zone
      const zoneList = await ZoneApi.getZones();
      store.dispatch(STORE_SET_ZONES, zoneList);
      let currentZone = store.getters[STORE_GET_SELECTED_ZONE];

      if (!currentZone || (currentZone && !currentZone.id)) {
        if (zoneList && zoneList.length) {
          currentZone = zoneList.find(zone => zone.alias === params.region);
        } else {
          redirect(DEFAULT_REDIRECT_URL);
        }
      }
      store.dispatch(STORE_SET_SELECTED_ZONE, currentZone);


      // Check if categories exists in store, get if not
      // TODO:: probably ew can delete this shit, cause we can get categories in another place(footer) and set them to vuex
      let categoriesList = store.getters[STORE_GET_CATEGORIES];

      if (categoriesList && !categoriesList.length && currentZone) {
        categoriesList = await CategoryApi.getCategories({ zone_id: currentZone.id });
        store.dispatch(STORE_SET_CATEGORIES, categoriesList);
      }

      // Set current category and category info
      let categoryInfo, currentCategory = Boolean(categoriesList) && Boolean(categoriesList.length) ?
        categoriesList.find(category => category.alias === params.category) : null;


      if (currentCategory) {
        categoryInfo = await CategoryApi.getCategoryInfo({
          zone_id: currentZone.id,
          category_id: currentCategory.id
        });
        if (categoryInfo) {
          categoryInfo.background = categoryInfo.background ? categoryInfo.background : CATEGORY_INFO_DEFAULT_BACKGROUND_URL;
        } else {
          categoryInfo = RestaurantsHelper.createCategoryInfoObject(currentZone);
        }
      } else if (!params.category) {
        categoryInfo = RestaurantsHelper.createCategoryInfoObject(currentZone);
        currentCategory = CATEGORY_ALL;
      } else {
        redirect({ name: 'restaurants', params: { region: params.region } });
        // I think we need to check if we really need category info setting, while we are about to be redirected
      }

      const {
        restaurants,
        timeFilteredRestaurantsList,
        timeFilteredRestaurantsBySpecialOfferList,
        specialOfferRestaurants,
        specialOffers,
        showSpecialOffers
      } = await RestaurantsHelper.getRestaurants(currentCategory, currentZone, req, null,false);

      return {
        restaurantsList: timeFilteredRestaurantsList && timeFilteredRestaurantsList.length ? timeFilteredRestaurantsList : restaurants,
        categoriesList: [CATEGORY_ALL].concat(categoriesList),
        timeFilteredRestaurantsBySpecialOfferList,
        specialOffers,
        currentCategory,
        categoryInfo,
        currentZone,
        specialOfferRestaurants,
        showSpecialOffers
      }
    },
    mounted () {
      window.scrollTo(0, 0);
      if (Boolean(this.getCurrentAddress && this.getCurrentAddress.length)) this.getSpecialOffers();
      this.setCategorySeoInfo();
    },
    watch: {
      getCurrentAddress () {
        if (window.innerWidth < 992) this.showSetAddressLabel = this.getCurrentAddress.length <= 0;
      },
      getCurrentCoords () {
        this.getSpecialOffers();
        RestaurantsHelper.getRestaurants(
          this.currentCategory,
          this.currentZone,
          null,
          this.getCurrentCoords ? { latitude: this.getCurrentCoords[0], longitude: this.getCurrentCoords[1] } : null,
          true
        );
      }
    },
    methods: {
      getBreadcrumbs () {
        const breadcrumbs = [ DEFAULT_BREADCRUMB ];
        if (this.currentZone) {
          breadcrumbs.push({
            text: `🌮 ${this.currentZone.name}`,
            url: `${process.env.API_URL}${this.currentZone.alias}`
          });
        }
        return breadcrumbs;
      },
      setCategorySeoInfo () {
        this.$nextTick(() => {
          const backgroundImage =  document.getElementById('bgImg');
          if (window.innerWidth < 992 && backgroundImage) {
            backgroundImage.setAttribute(
                'style',
                'background-image: url("' + this.categoryInfo.category_icon + '");'
              )
          } else if (backgroundImage) {
            backgroundImage.setAttribute(
                'style',
                'background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.4))), url("' + this.categoryInfo.background + '");'
              )
          }
        });
      },
      getSpecialOffers () {
        return RestaurantApi.getSpecialOffers({
          zone_id: parseInt(this.currentZone.id),
          latitude: parseFloat(this.getCurrentCoords[0]),
          longitude: parseFloat(this.getCurrentCoords[1]),
        }).then(responseData => {
          this.showSpecialOffers = responseData.length;
          if (this.showSpecialOffers) this.specialOfferRestaurants = responseData;
        })
      },
      async refreshRestaurantsList () {
        const {
          restaurants,
          timeFilteredRestaurantsList,
          timeFilteredRestaurantsBySpecialOfferList
        } = await RestaurantsHelper.getRestaurants(
          this.currentCategory,
          this.currentZone,
          null,
          this.getCurrentCoords ? { latitude: this.getCurrentCoords[0], longitude: this.getCurrentCoords[1] } : null,
          true
        );

        this.restaurantsList = timeFilteredRestaurantsList && timeFilteredRestaurantsList.length ?
          timeFilteredRestaurantsList : restaurants;

        this.timeFilteredRestaurantsBySpecialOfferList = timeFilteredRestaurantsBySpecialOfferList;
      },
      async chooseCategory (category) {
        this.currentCategory = category;
        this.setCategorySeoInfo();
        await this.refreshRestaurantsList();
        this.$router.push({
          name: 'restaurantsWithCategory',
          params: {
            region: this.currentZone ? this.currentZone.alias : 'minsk',
            category: this.currentCategory.alias
          }
        });
      }
    },
    computed: {
      ...mapGetters({
        getCurrentCoords: STORE_GET_CURRENT_COORDS
      })
    },
    jsonld () {
      const items = this.getBreadcrumbs().map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@id': item.url,
          name: item.text,
        },
      }));
      return MetaInfoHelper.createJsonldObject(SCHEMA_URL, 'BreadcrumbList', items);
    },
    head () {
      return this.categoryInfo && this.categoryInfo.meta ? MetaInfoHelper.createHeadWithMetaObject(
        this.categoryInfo.meta.title,
        this.categoryInfo.meta.description,
        this.categoryInfo.meta.keywords
      ) : MetaInfoHelper.getDefaultHeadWithMetaObject();
    },
    components: {
      SetAddress,
      Offers,
      List,
      SpecialOffers,
      Categories
    },
  }
</script>

<style lang="scss" scoped></style>
