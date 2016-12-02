<template lang="jade">
div
  navbar-view
    .left
      a.link(href="javascript:;", @click="historyBack") 返回
    .center 天梯
    .right
      a.link(href="javascript:;", @click="add") 添加
</template>

<script>
  import {
    navbarView
  } from '../../components'
  import {

  } from 'vue-weui'
  import {historyBack} from '../../js/utils'

  export default {
    components: {
      navbarView
    },
    router: {
      data () {

      }
    },
    vuex: {
      getters: {

      },
      actions: {

      }
    },
    computed: {

    },
    methods: {
      historyBack
    },
    ready () {
      window.vm = this
    }
  }
</script>
