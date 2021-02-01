<template>

</template>

<script>
  export default {
    methods: {
      onCardClick (dish) {
        this.$emit('cardClicked', dish);
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
