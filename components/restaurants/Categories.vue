<template>
  <div class="categories__block" :class="{'categories-search_active': showModalOverlay}">
    <div class="categories__container">
      <div class="categories__list">
        <v-chip active-class="category-chips_active"
                class="category-chips"
                v-for="(item, index) in firstHalfOfCategories"
                :key="'firstCategory' + index"
                :color="item.alias === currentCategory.alias ? 'primary': 'white'"
                @click="selectCategory(item)"
        >
          <div class="chip__name">
            {{ item.name }}
          </div>
        </v-chip>
        <v-menu offset-y max-height="200px" min-width="100px">
          <template v-slot:activator="{ on }">
            <v-chip v-on="on" class="category-chips" :color="more.isMore === true ? 'primary': 'white'">
              <span class="chip__name">
                  {{ more.text }}
              </span>
              <v-icon class="chip__icon" color="secondary">
                keyboard_arrow_down
              </v-icon>
            </v-chip>
          </template>
          <v-list class="more-categories__list">
            <v-list-item class="more-categories__item"
                         v-for="(item, index) in secondHalfOfCategories"
                         :key="'secondCategory' + index"
                         @click="selectCategory(item)"
            >
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
    <div id="mobile-categories-block" class="mobile-categories__list">
      <button class="list__button"
              @click="toggleShowSearchModal"
      >
        <span class="list__item-name">
            <v-icon class="material-icon">search</v-icon>
        </span>
      </button>
      <div class="list__item"
           v-for="(item, index) in categoriesList"
           :key="'adaptiveCatList' + index"
           v-show="item.category_icon"
           @click="selectCategory(item)"
      >
        <v-chip :class="{selected: item.id === currentCategory.id}" class="list__item-name">
          {{ item.name }}
        </v-chip>
      </div>
      <v-overlay :value="showModalOverlay" :dark="false">
        <div class="modal-search-wrapper">
          <searchModal @closeModalWindow="toggleShowSearchModal"/>
        </div>
      </v-overlay>
    </div>
    <div class="search-box">
      <v-text-field placeholder="Название, кухня или блюдо"
                    height="46" dense clearable prepend-inner-icon="search"
                    outlined
                    class="search-box__desktop"
                    v-model="searchNameKitchenDish"
                    @clear="dropSearchParameter"
      />
      <search :search-text="searchNameKitchenDish"></search>
    </div>
    <v-overlay :value="restOverlay" z-index="100">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
// here we should choose category and set it ti vuex
// after that, Main.vue checks if getter of category changed value, if yes -- get new categoryInfo
  import Search from '../search/Search.vue';
  import SearchModal from '../search/SearchModal.vue';

  export default {
    props: {
      categoriesList: {
        type: Array,
        default: () => []
      },
      currentCategory: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
        showSearchModal: false,
        firstHalfOfCategories: [],
        secondHalfOfCategories: [],
        sliceCounter: 9,
        hideCategory: false,
        more: {
          text: 'Eщё',
          id: -1,
          isMore: false
        },
        showModalOverlay: false,
        searchNameKitchenDish: '',
        restOverlay: false,
      }
    },
    mounted () {
      const windowWidth = window.innerWidth;
      if (windowWidth < 1440) {
        this.sliceCounter -= 2;
        if (windowWidth < 1200) {
          this.sliceCounter -= 2;
          if (windowWidth < 992) {
            this.sliceCounter -= 2;
          }
        }
      }

      this.firstHalfOfCategories = this.categoriesList.slice(0, this.sliceCounter);
      this.secondHalfOfCategories = this.categoriesList.slice(this.sliceCounter, this.categoriesList.length);

      let checkMoreAvailable = this.firstHalfOfCategories.find((cat)=>{
        return cat.id === this.currentCategory.id
      });
      if (checkMoreAvailable === undefined) {
        this.more= {
          text: this.currentCategory.name,
          id: this.currentCategory.id,
          isMore: true
        }
      } else {
        this.more= {
          text: 'Ещё',
          id: -1,
          isMore: false
        }
      }
    },
    methods: {
      selectCategory (category) {
        this.$emit('categoryItemClicked', category);
      },
      toggleShowSearchModal () {
        this.showSearchModal = !this.showSearchModal;
      },
      dropSearchParameter () {
        this.searchNameKitchenDish = ''
      },
    },
    components: {
      Search,
      SearchModal
    }
  }
</script>

<style lang="scss" scoped>
  .categories__block {
    position: sticky;
    top: 65px;
    z-index: 3;
    width: 100%;
    max-width: 1420px;
    margin: auto;
    border-left: 1px solid rgba(0, 0, 0, .1);
    border-right: 1px solid rgba(0, 0, 0, .1);
    background: $white;
    @include media($lg) {
      position: relative;
    }
  }

  .categories-search_active {
    z-index: 999;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
  }

  .categories__container {
    //display: flex;
    //flex-direction: column;
    display: none;
    @include media($lg) {
      padding: 20px 15px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 90%;
      margin: auto;
    }
  }

  .categories__list {
    display: flex;
    align-items: center;
    width: 100%;
    @include media($lg) {

      //todo: it was not

      :first-child {
        pointer-events: none;
        cursor: none;
      }
    }
  }

  .category-chips {
    margin: 3px 0;
    text-align: center;
    @include media($lg) {
      height: 46px !important;
      padding: 0 18px;
      display: block;
      line-height: 46px;
      border-radius: 22px !important;
      margin-right: 4px;
    }
  }

  .category-chips .primary .chip__name {
    color: $white !important;
  }

  .chip__name {
    text-align: center;
    width: 100%;
    @include media($lg) {
      margin: 5px 0;
      cursor: pointer;
      line-height: 46px;
      font-weight: 400;
      font-size: 16px;
      white-space: nowrap;
    }
  }

  .chip__icon {
    font-family: $material-icons;
  }

  .more-categories__list {
    overflow: scroll;
  }

  .more-categories__item {
    padding: 0 16px;
  }

  .more-categories__item:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, .1);
  }

  .mobile-categories__list {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-items: flex-start;
    max-width: 992px;
    overflow: hidden;
    overflow-x: auto;
    padding: 10px 0 10px 66px;
    border-top: 1px solid rgba(0, 0, 0, .1);
    @include media($lg) {
      display: none;
    }
  }

  .list__button {
    position: absolute;
    top: 1px;
    bottom: 0;
    left: 0;
    z-index: 1;
    background-color: #fff;
    padding-left: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    outline: none;
  }

  .list__item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    outline: none;
  }

  .list__item-name {
    min-height: 48px;
    display: flex;
    font-size: 16px !important;
    transition: background-color 100ms;
    align-items: center;
    flex-shrink: 0;
    margin-right: 8px;
    border-radius: 16px;
    justify-content: center;
    background-color: $light-gray;
    padding: 0 12px;
  }

  .modal-search-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    background-color: $white;
  }

  .search-box {
    position: relative;
    padding: 0 80px;
  }

  .search-box__desktop {
    display: none;
    @include media($lg) {
      display: unset;
      padding: 0 80px 6px!important;
      border-bottom: 4px solid rgba(245, 245, 245, 0.6);
    }
  }

  .search-box__desktop .v-input__control .v-input__slot .v-input__prepend-inner {
    margin-top: 11px !important;
  }
</style>
