<template lang="jade">
div
  navbar-view
    .left
      a.link(href="javascript:;", @click="back") 返回
    .center 裁判
    .right
      a.link(href="javascript:;") 创建
  toast(type="loading", v-show="$loadingRouteData") 加载中...
  main(v-if="!$loadingRouteData")
    template(v-for="tournament in myUmpiredTournaments")
      cells-title {{tournament.name}}
      cells(type="access")
        link-cell(v-for="el in tournament.subTournaments", v-link="{path: '/umpire/subTournament', query: {main: tournament.objectId, sub: el.objectId}}")
          span(slot="body") {{el.name}}
</template>

<script>
import {
  navbarView
} from '../../components'
import {
  Cells,
  LinkCell,
  CellsTitle,
  Toast
} from 'vue-weui'
import {addTournaments} from '../../vuex/actions/tournaments'

export default {
  components: {
    navbarView,
    Cells,
    LinkCell,
    CellsTitle,
    Toast
  },
  route: {
    data () {
      return this.addTournaments()
    }
  },
  vuex: {
    getters: {
      tournaments: ({tournaments}) => tournaments.tournaments,
      myUmpiredTournaments: ({tournaments}) => tournaments.myUmpiredTournaments,
      userObj: ({user}) => user.userObj
    },
    actions: {
      addTournaments,
      addMyUmpiredTournaments: ({dispatch}) => {
        return
      }
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
