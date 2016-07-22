<template lang="jade">
div
  navbar-view
    .left
      a.link(href="javascript:;", @click="historyBack") 返回
    .center 子赛事
    .right
      a.link(href="javascript:;") 刷新
  main
    cells
      link-cell
        span(slot="header") 场地
        span(slot="footer") {{myCourt}}
    cells-title 正在进行
    cells(type="access")
      link-cell(v-for="el in ongoings", v-if="ongoings.length")
        span(slot="header") {{el}}
        span(slot="footer")
      link-cell(v-if="!ongoings.length")
        span(slot="header") 还没有进行中的比赛
    cells-title 即将进行
    cells(type="access")
      link-cell(v-for="(index, el) in myQueue", @click="go(index)")
        span(slot="header") {{el.vs}}
        span(slot="footer")
</template>

<script>
  import {
    navbarView
  } from '../../components'
  import {
    Cells, LinkCell, CellsTitle
  } from 'vue-weui'
  import _ from 'underscore'
  import {historyBack} from '../../js/utils'
  // import Wilddog from '../../../node_modules/wilddog/lib/wilddog-node'
  import {addOthersUserObj} from '../../vuex/actions/user'
  import {getUserObj} from '../../js/methods'
  import {subTournamentRealtime} from '../../js/routeData'

  export default {
    components: {
      navbarView,
      Cells, LinkCell, CellsTitle
    },
    route: {
      data: subTournamentRealtime
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
          if (stage.stage === 'groups') {
            var match = this.groups[stage.groupIndex].matches[stage.matchIndex]
            var vs
            if (this.isSingle) { // 单打
              vs = match.teams.map(el => {
                return this.getUserObj(el.objectId)[0].nickname
              }).join(' vs ')
            } else { // 双打
              // to do
            }
            return {
              vs,
              stage: `第${stage.groupIndex + 1}组 第${stage.matchIndex + 1}场`,
              court: this.courts[courtIndex].name,
              courtIndex,
              matchSettings,
              key
            }
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
