<template>
 <div class="restaurant-preview__block">
   <MobilePreview v-if="isMobile" :restaurant="restaurant"></MobilePreview>
   <DesktopPreview v-else :restaurant="restaurant"></DesktopPreview>
 </div>
</template>

<script>
  import MobilePreview from "@/components/restaurant/preview/Mobile.vue";
  import DesktopPreview from "@/components/restaurant/preview/Desktop.vue";

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
      DesktopPreview,
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
