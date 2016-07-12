<template lang="jade">
  .swiper-container
    .swiper-wrapper
      slot
    .swiper-pagination(v-if="ifPagination")
</template>

<script>
  import Swiper from 'swiper'

  export default {
    props: {
      ifPagination: {
        type: Boolean,
        default () {
          return true
        }
      }
    },
    ready () {
      Swiper('.swiper-container', {
        pagination: '.swiper-pagination'
      })
    }
  }

</script>

<style lang="less">
  @import "../less/swiper.less";
</style>
