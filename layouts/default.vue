<template>
  <div>
    <layoutHeader
      v-if="!isMapVisible && currentRouteName !== 'cart'"
      :class="{'header_hidden': currentRouteName ==='restaurant'}"
      :is-mobile="isMobile"
    >
    </layoutHeader>
    <v-app v-if="!isMapVisible">
      <v-container class="main__container"
                   :class="{'main__container-without-header': currentRouteName ==='restaurant'}"
      >
        <Nuxt/>
      </v-container>
    </v-app>
    <layoutFooter v-if="!isMapVisible && currentRouteName !== 'cart'"></layoutFooter>
    <mapContainer v-if="isMobile"></mapContainer>
  </div>
</template>

<script>
  import LayoutHeader from "../components/default-layout/Header.vue";
  import LayoutFooter from "../components/default-layout/Footer.vue";
  import MapContainer from "../components/map/Container.vue";
  import mobileMixin from "@/utils/mixins/deviceMixin";

  export default {
    name: 'default',
    mixins: [mobileMixin],
    data () {
      return {
        //todo: get from vuex
        isMapVisible: false
      }
    },
    mounted () {
      //this.$vuetify.theme.dark = false;
      document.addEventListener('touchmove', this.handleMove, false);
    },
    beforeDestroy () {
      document.removeEventListener('touchmove', this.handleMove);
    },
    methods: {
      handleMove (e) {
        if (e.scale && e.scale !== 1) {
          e.preventDefault();
        }
      }
    },
    computed: {
      currentRouteName () {
        return this.$route.name;
      }
    },
    components: {
      LayoutHeader,
      LayoutFooter,
      MapContainer
    },
  }
</script>

<style lang="scss">
  body {
    margin: 0;
  }

  div {
    font-family: sans-serif;
  }

  .header_hidden {
    @media screen and (max-width: 991px) {
      display: none !important;
    }
  }

  .container {
    max-width: 1500px;
    width: 100%;
    margin: 0 auto;
  }

  .main__container {
    padding: 65px 0 0;
    @include media($lg) {
      padding: 3rem 40px 0;
    }
  }

  .main__container-without-header {
    padding: 0;
  }
</style>
