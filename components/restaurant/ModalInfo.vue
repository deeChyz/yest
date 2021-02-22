<template>
  <div class="modal-info__block">
    <p class="modal-info__title">
      {{restaurant.name}}
    </p>
    <div>
      <ul class="modal-info__restaurant-addresses-list">
        <li class="restaurant__address" v-for="branch in restaurant.branch">
          {{branch.address}}
        </li>
      </ul>
    </div>
    <div class="modal-info__restaurant-tags">
      <div class="restaurant-tags__block">
        <span class="tag__item" v-for="tag in restaurant.tags">
            {{tag.name}}
        </span>
      </div>
    </div>
    <div class="modal-info__copyright-block">
      Исполнитель (продавец): {{restaurant.legal_info.business_firm_name}},
      {{restaurant.legal_info.business_address}},
      УНП {{restaurant.legal_info.business_unp}}.
    </div>
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
      }
    }
  }
</script>
<style lang="scss" scoped>
  .modal-info__block {
    padding: 20px;
  }

  .modal-info__title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .modal-info__title, .modal-info__restaurant-addresses-list, .modal-info__restaurant-tags  {
    margin-bottom: 10px;
  }

  .restaurant__address, .modal-info__restaurant-tags,  .modal-info__copyright-block{
    padding: 3px 0;
    line-height: 1em;
    font-size: 14px;
    color: $gray-a0;
  }

</style>
