<template>
  <div
    :is="htmlTag"
    @click="$emit('click', $event)"
    :disabled="disabled"
    :to="to"
    class="yest-button"
    :class="[color && `yest-button_` + color,
             disabled && 'yest-button_disabled',
             bold && 'yest-button_bold',
             narrow && 'yest-button_narrow',
    ]"
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
        validator: value => value.match(/(green|white|gray)/),
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
    cursor: pointer;
    @include media($lg) {
      font-size: 16px;
      padding: 15px 30px;
    }

  }

  .yest-button_disabled {
    background-color: $gray-b0;
    opacity: .7;
    pointer-events: none;
  }

  .yest-button_bold {

  }

  .yest-button_narrow {

  }

  .yest-button {
    &_green {
      background-color: $green;
      color: $white;
    }
    &_white {
      background-color: $white;
      border: 1px solid $gray-dd;
      color: #9E9B98;
    }
    &_gray {
      background-color: $gray-f1;
      color: $black;
    }
  }

  .yest-button__icon {
    //margin-right: 5px;
  }
</style>
