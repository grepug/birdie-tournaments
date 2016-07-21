<template lang="jade">
div
  navbar-view
    .left
      a.link(href="javascript:;", @click="back") 返回
    .center(v-if="!$loadingRouteData") {{subTournament.name}}
    .right
      a.link(href="javascript:;")
  toast(type="loading", v-show="$loadingRouteData") 加载中...
  main(v-if="!$loadingRouteData")
    cells-title 比赛信息
    cells
      link-cell()
        span(slot="body") 项目
        span(slot="footer") {{subTournament.discipline}}
      link-cell()
        span(slot="body") 局数
        span(slot="footer") {{subTournament.bestOf}}
      link-cell()
        span(slot="body") 得分制
        span(slot="footer") {{subTournament.scoringSys}}
      link-cell
        span(slot="body") 状态
        span(slot="footer") {{subTournament.state}}
    cells-title 操作
    cells(type="access")
      link-cell(@click="go('chairUmpireSignUpMembers')")
        span(slot="body") 报名名单 & 排阵
      link-cell(@click="go('chairUmpireViewOrders')")
        span(slot="body") 对阵表
      link-cell(@click="go('chairUmpireQueue')")
        span(slot="body") 比赛队列
      link-cell(@click="go('chairUmpireSubTournamentStart')")
        span(slot="body") 开始比赛

</template>

<script>
  import _ from 'underscore'
  import {
    navbarView
  } from '../../components'
  import {addChairUmpiredTournaments} from '../../vuex/actions/tournaments'
  import {
    Cells,
    LinkCell,
    CellsTitle,
    Toast
  } from 'vue-weui'

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
        return this.addChairUmpiredTournaments()
      }
    },
    vuex: {
      getters: {
        myChairUmpiredTournaments: ({tournaments}) => tournaments.chairUmpiredTournaments
      },
      actions: {
        addChairUmpiredTournaments
      }
    },
    computed: {
      subTournament () {
        if (!this.myChairUmpiredTournaments.length) return []
        var {query} = this.$route
        var r = _.findWhere(this.myChairUmpiredTournaments, {objectId: query.main})
        return _.findWhere(r.subTournaments, {objectId: query.sub})
      }
    },
    methods: {
      back () {
        window.history.back()
      },
      go (name) {
        this.$router.go({
          name,
          query: this.$route.query
        })
      }
    },
    ready () {
      window.vm = this
    }
  }
</script>
