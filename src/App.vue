<template lang="jade">
div
  navbar-view
    .left
    .center Birdie 赛事
    .right
      a.link(href="javascript:;")
  main
    cells(type="access")
      link-cell(v-link="{name: 'createTournament'}")
        span(slot="body") 创建赛事
      link-cell(v-link="{path: '/chairUmpire'}")
        span(slot="body") 主裁判
      link-cell(v-link="{path: '/umpire'}")
        span(slot="body") 裁判
      link-cell(v-link="{path: '/realtimeTournaments'}")
        span(slot="body") 赛事实时比分
</template>

<script>
import {
  navbarView
} from './components'
import {
  Cells,
  LinkCell
} from 'vue-weui'

export default {
  components: {
    navbarView,
    Cells,
    LinkCell
  }
}
</script>

<style>
  a {
    text-decoration: none;
  }
</style>
