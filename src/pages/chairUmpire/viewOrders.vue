<template lang="jade">
div
  navbar-view
    .left
      a.link(href="javascript:;", @click="back") 返回
    .center 对阵表
    .right
      a.link(href="javascript:;")
  main
      group(:list="list")
      .b
        bracket(:list="playoffs")
</template>

<script>
  import {
    navbarView
  } from '../../components'
  import {bracket, group} from 'vue-bracket'

  export default {
    components: {
      navbarView,
      bracket,
      group
    },
    methods: {
      back () {
        window.history.back()
      }
    }
  }
</script>

<style lang="less">
main {
  .b {
    overflow-x: scroll;
  }
}
</style>
