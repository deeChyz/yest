<template>
 <div class="restaurant-preview__block">
   <MobilePreview v-if="isMobile" :restaurant="restaurant"></MobilePreview>
   <DesctopPreview v-else :restaurant="restaurant"></DesctopPreview>
 </div>
</template>

<script>
  import MobilePreview from "@/components/restaurant/preview/Mobile.vue";
  import DesctopPreview from "@/components/restaurant/preview/Desctop.vue";

  export default {
    props: {
      restaurant: {
        type: Object,
        default () {
          return {}
        }
      },
      isMobile: {
        type: Boolean,
        default: false,
      }
    },
    components: {
      MobilePreview,
      DesctopPreview,
    }
  }
</script>

<style lang="scss" scoped>
  .restaurant-preview__block {
    padding: 0 16px;
    background-color: $white;
    @include media($lg) {
      padding: 0;
      background-color: unset;
    }
  }
</style>
