<template>

</template>

<script>
  export default {
    props: {
      dish: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
        selectedSize: null
      }
    },
    methods: {
      onAddButtonClick () {
        this.$emit('addButtonClicked', this.prepareDishObject());
      },
      prepareDishObject () {
        return Object.assign(this.dish, { selectedSize: this.selectedSize })
      }
    }
  }
</script>

<style>

</style>
