<template>
  <div class="restaurant-menu__block">
    <v-tabs v-model="tab" hide-slider z-index="1" class="restaurant-catalog__list" center-active>
      <v-tab
        v-for="(category, index) in restaurant.menu"
        :key="category.cat_id"
        active-class="catalog__item_active"
        :class="{'catalog__item_active': currentTab === index}"
        height="70px"
        class="catalog__item"
        @click="handleClickCategory(category.cat_id)"
      >
        <v-chip>
          {{ category.name }}
        </v-chip>
      </v-tab>
    </v-tabs>
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
      },
      selectedCategoryId: {
        type: [Number, String],
        default: 0
      },
      currentTab: {
        type: Number,
        default: 0
      }
    },
    watch: {
      currentTab(val) {
        this.tab = val;
      }
    },
    data () {
      return {
        tab: 0,
      }
    },
    methods: {
      handleClickCategory (id) {
        const element = document.getElementById(id)
        const yOffset = window.innerWidth < 992 ? 80 : 140
        const y = element.getBoundingClientRect().top + window.pageYOffset - yOffset
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .restaurant-menu__block {
    position: sticky;
    top: 60px;
    background-color: $white;
    z-index: 1;
    @include media($lg) {
      padding: 0 80px;
      top: 80px;
    }
  }

  .restaurant-catalog__list {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    height: 50px;
    margin-left: 12px;
    overflow-y: hidden;
    overflow-x: scroll;
    &::-webkit-scrollbar-track {
      background: $light-gray;
    }
    &::-webkit-scrollbar {
      background-color: $light-gray;
      height: 3px;
      width: 10px;
    }
    &::-webkit-scrollbar-thumb {
      height: 3px;
      background: #bfbfbf;
    }

    @include media($lg) {
      height: 70px;
      &::-webkit-scrollbar {
        height: 0;
      }
      &::-webkit-scrollbar-thumb {
        height: 0;
      }
    }
  }

  .catalog__item {
    display: flex !important;
    align-items: center !important;
    border-radius: 14px !important;
    line-height: 20px !important;
    letter-spacing: 0.5px !important;
    font-family: sans-serif !important;
    background-color: $white !important;
    color: #a3a3a3 !important;
    white-space: nowrap !important;
    cursor: pointer !important;
    margin-right: 10px !important;
    padding: 0 12px !important;

    transition: none;
    text-transform: initial;
    border-bottom: 4px solid #fff !important;
    font-size: 16px !important;
    &:last-child {
      margin-right: unset !important;
    }
    @include media($lg) {
      font-size: 16px !important;
      letter-spacing: 0.8px !important;
      border-radius: unset !important;
      padding: 0 16px !important;
    }
    span {
      background-color: $white !important;
      .v-tab {
        opacity: 1 !important;
      }
    }

    &:hover{
      ::before{
        opacity: 0 !important;
      }
      background-color: $white !important;
      .v-tab {
        opacity: 1 !important;
      }
      span {
        background-color: $white !important;
        .v-tab {
          opacity: 1 !important;
        }
        ::before{
          opacity: 0 !important;
        }
      }
    }
  }

  .theme--light.v-tabs .v-tab--active:hover::before, .theme--light.v-tabs .v-tab--active::before {
    opacity: 0 !important;
  }

  .catalog__item_active {
    background-color: $gray-f1 !important;
    color: $black !important;
    @include media($lg) {
      background-color: $white !important;
      border-bottom: 4px solid $green !important;
      color: #000;
    }
    .v-tab--active:hover::before {
      opacity: 0 !important;
    }
    ::before{
      opacity: 0 !important;
    }
    &:hover{
      background-color: $white !important;

      ::before{
        opacity: 0 !important;
      }
      .v-tab--active:hover::before {
        opacity: 0 !important;
      }

      span {
        background-color: $white !important;
        .v-tab {
          opacity: 0 !important;
        }
      }
    }
  }
</style>
