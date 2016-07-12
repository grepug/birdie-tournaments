<template lang="jade">
div
  navbar-view
    .left
      a.link(href="javascript:;", @click="back") 返回
    .center {{subTournament.name}}
    .right
      a.link(href="javascript:;")
  main
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
    cells-title 操作
    cells(type="access")
      link-cell(@click="goSignUpMembers")
        span(slot="body") 查看报名详情
      link-cell
        span(slot="body") 排阵
      link-cell
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
    CellsTitle
  } from 'vue-weui'

  export default {
    components: {
      navbarView,
      Cells,
      LinkCell,
      CellsTitle
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
      goSignUpMembers () {
        this.$router.go({
          name: 'chairUmpireSignUpMembers',
          query: this.$route.query
        })
      }
    },
    ready () {
      window.vm = this
      if (!this.myChairUmpiredTournaments.length) this.addChairUmpiredTournaments()
    }
  }
</script>
