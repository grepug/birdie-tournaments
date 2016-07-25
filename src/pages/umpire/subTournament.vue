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
      link-cell(v-for="(index, el) in myQueue", @click="go(index)", v-if="el.state === 'ongoing'")
        span(slot="header") {{el.vs}}
        span(slot="footer") 小组赛 {{el.stage}}
    cells-title 即将进行
    cells(type="access")
      link-cell(v-for="(index, el) in myQueue", @click="go(index)", v-if="el.state === 'upcoming'")
        span(slot="header") {{el.vs}}
        span(slot="footer") 小组赛 {{el.stage}}
    cells-title 已结束
    cells(type="access")
      link-cell(v-for="(index, el) in myQueue", v-if="el.state === 'completed'")
        span(slot="header") {{el.vs}}
        span(slot="footer") 小组赛 {{el.stage}}

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
  import {historyBack, getStageCN, isSingle} from '../../js/utils'
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
          if (isSingle(ret.discipline)) {
            return this.addOthersUserObj(_.flatten(_.map(ret.queue, (val) => {
              if (ret.courts[val.courtIndex].umpire === this.userObj.objectId) {
                return val.stage.teams.map(el => el)
              }
            })))
          }
          return // doubles
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
          var {stage, courtIndex, matchSettings, state} = val
          if (this.courts[val.courtIndex].umpire !== this.userObj.objectId) return
          return {
            vs: val.stage.teams.map(el => {
              return this.getUserObj(el)[0].nickname
            }).join(' vs '),
            stage: getStageCN(stage),
            court: this.courts[courtIndex].name,
            courtIndex,
            matchSettings,
            key,
            state
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
        if (this.myQueue.filter(x => {
          return x.state === 'ongoing'
        }).length && this.myQueue[index].state !== 'ongoing') {
          return window.alert('请先完成正在进行中的比赛')
        }
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
