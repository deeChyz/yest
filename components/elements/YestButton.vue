<template>
  <div
    :is="htmlTag"
    @click="$emit('click', $event)"
    :disabled="disabled"
    :to="to"
    class="yest-button"
    :class="{'yest-button_disabled': disabled, 'yest-button_bold': bold, 'yest-button_narrow': narrow, 'yest-button_green': color}"
  >
    <div v-if="$slots['icon']" class="yest-button__icon">
      <slot name="icon"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      htmlTag: {
        type: String,
        default: 'div',
        validator: value => value.match(/(div|button|a|router-link)/)
      },
      to: {
        type: Object,
      },
      color: {
        type: String,
        default: 'green',
        validator: value => value.match(/(green|white)/),
      },
      bold: {
        type: Boolean,
        default: false
      },
      narrow: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      isMapButton : {
        type: Boolean,
        default: false,
      }
    }
  }
</script>

<style lang="scss" scoped>
  .yest-button {
    font-size: 14px;
    width: fit-content;
    padding: 8px 25px;
    border-radius: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    @include media($lg) {
      font-size: 16px;
      padding: 15px 30px;
    }

  }

  .yest-button_disabled {

  }

  .yest-button_bold {

  }

  .yest-button_narrow {

  }

  .yest-button_green {
    background-color: $green;
    color: $white;
  }

  .yest-button__icon {
    margin-right: 5px;
  }
</style>
