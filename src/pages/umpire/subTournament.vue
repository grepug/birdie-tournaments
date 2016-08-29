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
        span(slot="footer") {{el.stage}}
    cells-title 即将进行
    cells(type="access")
      link-cell(v-for="(index, el) in myQueue", @click="go(index)", v-if="el.state === 'upcoming'")
        span(slot="header") {{el.vs}}
        span(slot="footer") {{el.stage}}
    cells-title 已结束
    cells(type="access")
      link-cell(v-for="(index, el) in myQueue", v-if="el.state === 'completed'")
        span(slot="header") {{el.vs}}
        span(slot="footer") {{el.stage}}

</template>

<script>
  import {
    navbarView
  } from '../../components'
  import {
    Cells, LinkCell, CellsTitle,
    Toast
  } from 'vue-weui'
  import _ from 'lodash'
  import AV from '../../js/AV'
  import {historyBack, getStageCN, isSingle} from '../../js/utils'
  import {addOthersUserObj, addDoubles} from '../../vuex/actions/user'
  import {getUserObj, getDoublesObj} from '../../js/methods'

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
          this.isSingle = isSingle(ret.discipline)
          var teams = _.flattenDeep(_.map(ret.queue, (val) => {
            if (ret.courts[val.courtIndex].umpire === this.userObj.objectId) {
              return val.stage.teams.map(el => el)
            }
          }))
          if (this.isSingle) {
            return this.addOthersUserObj(teams)
          }
          return this.addDoubles(teams)
          .then(ret => {
            this.addOthersUserObj(ret)
          })
        })
      }
    },
    vuex: {
      getters: {
        userObj: ({user}) => user.userObj,
        otherUserObjs: ({user}) => user.userObjs
      },
      actions: {
        addOthersUserObj,
        addDoubles
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
          var vs
          if (this.courts[val.courtIndex].umpire !== this.userObj.objectId) return
          if (this.isSingle) {
            vs = val.stage.teams.map(el =>
              this.getUserObj(el)[0].nickname
            ).join(' vs ')
          } else {
            vs = val.stage.teams.map(el =>
              this.getDoublesObj(el)[0].players.map(el => this.getUserObj(el)[0].nickname).join('/')
            ).join(' vs ')
          }
          return {
            vs,
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
      getDoublesObj,
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
