<template lang="jade">
div
  navbar-view
    .left
      a.link(href="javascript:;", @click="back") 返回
    .center(v-if="!$loadingRouteData") 子赛事
    .right
      a.link(href="javascript:;")
  toast(type="loading", v-show="$loadingRouteData") 加载中...
  main(v-if="!$loadingRouteData")
    cells-title 比赛信息
    cells
      link-cell()
        span(slot="body") 名称
        span(slot="footer") {{subTournament.name}}
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
    cells(type="split")
      select-cell(:after="true", :options="stateOptions", :selected.sync="stateSelected")
        span(slot="header") 状态
    cells-title 操作
    cells(type="access")
      link-cell(@click="go('chairUmpireSignUpMembers')")
        span(slot="body") 报名名单 & 排阵
      link-cell(@click="go('chairUmpireViewOrders')")
        span(slot="body") 对阵表
      link-cell(@click="go('chairUmpireSubTournamentStart')")
        span(slot="body") 设置场地 / 裁判
      link-cell(@click="go('chairUmpireQueue')")
        span(slot="body") 比赛队列

</template>

<script>
  import _ from 'lodash'
  import {
    navbarView
  } from '../../components'
  import AV from '../../js/AV'
  import {addChairUmpiredTournaments} from '../../vuex/actions/tournaments'
  import {
    Cells,
    LinkCell,
    CellsTitle,
    Toast,
    SelectCell
  } from 'vue-weui'

  export default {
    components: {
      navbarView,
      Cells,
      LinkCell,
      CellsTitle,
      Toast,
      SelectCell
    },
    route: {
      data () {
        return this.addChairUmpiredTournaments()
      }
    },
    data () {
      return {
        stateOptions: ['preSigninUp', 'signingUp', 'signingUpDue', 'orderReleased', 'groupStageOngoing', 'groupStageCompleted', 'playoffsOngoing', 'subTournamentCompleted'],
        stateSelected: ''
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
        var r = _.find(this.myChairUmpiredTournaments, {objectId: query.main})
        return _.find(r.subTournaments, {objectId: query.sub})
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
    watch: {
      stateSelected (val, old) {
        return AV.Cloud.run('tournament', {
          method: 'changeSubTournamentState',
          subTournamentObjId: this.$route.query.sub,
          state: val
        }).then(ret => {
          console.log(ret)
        }).catch(err => console.log(err))
      }
    },
    ready () {
      window.vm = this
    }
  }
</script>
