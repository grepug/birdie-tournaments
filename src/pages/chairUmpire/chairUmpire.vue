<template lang="jade">
div
  navbar-view
    .left
      a.link(href="javascript:;", @click="back") 返回
    .center 赛事
    .right
      a.link(href="javascript:;")
  toast(type="loading", v-show="$loadingRouteData") 加载中...
  main(v-if="!$loadingRouteData")
    mt-cell(is-link="", v-link="{path: '/chairUmpire/tournament', query: {main: el.objectId}}", v-for="el in myChairUmpiredTournaments")
      span(slot="title") {{el.name}}
</template>

<script>
  import {
    navbarView
  } from '../../components'
  import {
    Toast
  } from 'vue-weui'
  import {addChairUmpiredTournaments} from '../../vuex/actions/tournaments'

  export default {
    components: {
      navbarView,
      Toast
    },
    vuex: {
      getters: {
        myChairUmpiredTournaments: ({tournaments}) => tournaments.chairUmpiredTournaments
      },
      actions: {
        addChairUmpiredTournaments
      }
    },
    route: {
      data () {
        return this.addChairUmpiredTournaments()
      }
    },
    methods: {
      back () {
        window.history.back()
      }
    },
    ready () {
      window.vm = this
    }
  }
</script>
