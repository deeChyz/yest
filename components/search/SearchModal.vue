<template>
  <v-card class="search-modal__block">
    <div class="search-modal__input-block">
      <input class="search-modal__input" type="text" placeholder="Найти в еде" v-model="searchText">
      <div class="search-modal__button" @click="$emit('closeModalWindow')">
        Отменить
      </div>
    </div>
    <search :search-text="searchText"></search>
  </v-card>
</template>

<script>
  import Search from "@/components/search/Search";

  export default {
    data () {
        return {
          searchText: '',
        }
    },
    components: {
      Search
    }
  }
</script>
<style lang="scss" scoped>
  .search-modal__block {
    border-bottom: 1px solid $gray-dd;
    background: $white;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1) !important;
  }

  .search-modal__input-block {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 10px 0 10px 17px;
    background-color: $white;
    ::placeholder {
      color: $gray-b0;
    }
  }

  .search-modal__input {
    width: 100%;
    margin: 5px 0;
    outline: none;
  }

  .search-modal__button {
    padding: 5px 15px;
    font-size: 14px;
    cursor: pointer;
    border-left: 1px solid $gray-dd;
  }
</style>
