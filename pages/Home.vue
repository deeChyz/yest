<template>
  <div class="home__block">
    <div>
      <div class="home__delivery">Доставка еды</div>
      <div class="home__region" v-for="zone in getZoneList" :key="zone.alias" @click="handleRegionClick(zone)">
        {{ zone.name }}
      </div>
    </div>
    <v-overlay :value="restOverlay" z-index="100">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
  import handleZoneClickMixin from "../utils/mixins/handleZoneClickMixin";

  import MetaInfoHelper from "../utils/helpers/MetaInfoHelper";
  import {
    STORE_GET_ZONE_LIST,
    STORE_SET_ZONES
  } from "../utils/confs/pages/home";
  import ZoneApi from "../api/ZoneApi";

  export default {
    mixins: [handleZoneClickMixin],
    data() {
      return {
        restOverlay: false
      };
    },
    async asyncData({ store }) {
      // let getCurrentCoords = store.getters['map/getCurrentCoords'];    DO WE NEEED THIS ???s
      if (!store.getters[STORE_GET_ZONE_LIST] || (store.getters[STORE_GET_ZONE_LIST] && !store.getters[STORE_GET_ZONE_LIST].length)) {
        const zoneList = await ZoneApi.getZones();
        store.dispatch(STORE_SET_ZONES, zoneList);
      }
      return {};
    },
    mounted() {
      window.scrollTo(0, 0);
    },
    methods: {
      handleRegionClick(zone) {
        this.toggleRestOverlay();
        this.handleZoneClick(zone);
      },
      toggleRestOverlay() {
        this.restOverlay = !this.restOverlay;
      }
    },
    head() {
      let title = 'Доставка еды – yest.by';
      let content = 'Быстрая доставка еды по Беларуси из ресторанов и кафе. 🚚 Доставляем пиццу, суши, бургеры, WOK, шаурму. 🍰 Блюда итальянской, японской, европейской и других кухонь мира. 📞 Звоните!';
      return MetaInfoHelper.createHeadWithMetaObject(title, content);
    },
  }
</script>

<style lang="scss" scoped>
  .home__block {
    display: flex;
    flex: 1 0 auto;
    line-height: 1.5;
    padding: 40px 20px;
    @include media($lg) {
      padding: 72px 20px 40px;
    }
  }

  .home__delivery {
    font-size: 32px;
    font-weight: bold;
    font-family: sans-serif;
    margin-bottom: 20px;
    @include media($lg) {
      margin-bottom: 5px;
    }
  }

  .home__region {
    font-family: sans-serif;
    cursor: pointer;
    color: $green;
    margin-bottom: 4px;
    font-size: 18px;
  }
</style>
