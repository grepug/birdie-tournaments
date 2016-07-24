<template lang="jade">
div
  navbar-view
    .left
      a.link(href="javascript:;", @click="historyBack") 返回
    .center 子赛事
    .right
      a.link(href="javascript:;", @click="refresh") 刷新
  toast(type="loading", v-show="$loadingRouteData") 加载中...
  main(v-if="!$loadingRouteData")
    cells
      link-cell
        span(slot="header") 场地
        span(slot="footer") {{myCourt}}
    cells-title 正在进行
    cells(type="access")
      link-cell(v-for="el in ongoings")
        span(slot="header") {{el}}
        span(slot="footer")
    cells-title 即将进行
    cells(type="access")
      link-cell(v-for="(index, el) in myQueue", @click="go(index)")
        span(slot="header") {{el.vs}}
        span(slot="footer")
    cells-title 已结束
    cells
      link-cell(v-for="(index, el) in completed")
        span(slot="header") {{el.vs}}
        span(slot="footer")

</template>

<script>
  import {
    navbarView
  } from '../../components'
  import {
    Cells, LinkCell, CellsTitle,
    Toast
  } from 'vue-weui'
  import _ from 'underscore'
  import AV from '../../js/AV'
  import {historyBack, getStageCN, toArray} from '../../js/utils'
  import {addOthersUserObj} from '../../vuex/actions/user'
  import {getUserObj} from '../../js/methods'

  export default {
    components: {
      navbarView,
      Cells, LinkCell, CellsTitle,
      Toast
    },
    route: {
      data () {
        return AV.Cloud.run('tournamentRealtime', {
          method: 'getSubTournament',
          tournamentObjId: this.$route.query.main,
          subTournamentObjId: this.$route.query.sub
        }).then(ret => {
          this.queue = ret.queue
          this.courts = ret.courts
          this.groups = ret.groups
          return this.addOthersUserObj(_.flatten(_.map(ret.queue, (val) => {
            if (ret.courts[val.courtIndex].umpire === this.userObj.objectId) {
              return val.teams.map(el => toArray(el))
            }
          })))
        })
      }
    },
    vuex: {
      getters: {
        userObj: ({user}) => user.userObj,
        otherUserObjs: ({user}) => user.userObjs
      },
      actions: {
        addOthersUserObj
      }
    },
    data () {
      return {
        queue: {},
        courts: [],
        isSingle: null,
        groups: []
      }
    },
    computed: {
      myQueue () {
        return _.map(this.queue, (val, key) => {
          var {stage, courtIndex, matchSettings} = val
          if (this.courts[val.courtIndex].umpire !== this.userObj.objectId) return
          if (val.state !== 'upcoming') return
          return {
            vs: val.teams.map(el => {
              return el.map(el => this.getUserObj(el)[0].nickname)
            }).join(' vs '),
            stage: getStageCN(stage),
            court: this.courts[courtIndex].name,
            courtIndex,
            matchSettings,
            key
          }
        }).filter(x => x)
      },
      ongoings () {
        return _.map(this.queue, (val, key) => {
          if (val.state !== 'ongoing') return
          var {stage} = val
          var match = this.groups[stage.groupIndex].matches[stage.matchIndex]
          if (this.isSingle) {
            return match.teams.map(el => {
              return this.getUserObj(el.objectId)[0].nickname
            }).join(' vs ')
          }
        }).filter(x => x)
      },
      completed () {
        return _.map(this.queue, (val, key) => {
          var {stage, courtIndex, matchSettings} = val
          if (this.courts[val.courtIndex].umpire !== this.userObj.objectId) return
          if (val.state !== 'completed') return
          return {
            vs: val.teams.map(el => {
              // return el.map(el => this.getUserObj(el)[0].nickname)
              return _.map(el, (el) => this.getUserObj(el)[0].nickname)
            }).join(' vs '),
            stage: getStageCN(stage),
            court: this.courts[courtIndex].name,
            courtIndex,
            matchSettings,
            key
          }
        }).filter(x => x)
      },
      myCourt () {
        return this.courts.map(el => {
          if (el.umpire === this.userObj.objectId) {
            return el.name
          }
        }).join('')
      }
    },
    methods: {
      historyBack,
      getUserObj,
      refresh: () => window.location.reload(),
      go (index) {
        this.$router.go({
          name: 'umpireScoringPage',
          query: _.extend(this.$route.query, {key: this.myQueue[index].key})
        })
      }
    },
    ready () {
      window.vm = this
    }
  }
</script>
