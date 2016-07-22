<template lang="jade">
div
  navbar-view
    .left
      a.link(href="javascript:;", @click="historyBack") 返回
    .center 比赛中
    .right
      a.link(href="javascript:;") 更多
  main
    versus-view(:teams="teams", :points="scores", @on-add-point="addScore")
    dialog(type="alert", v-show="initDialogShow", title="赛前选边", @weui-dialog-confirm="initDialogConfirm")
      cells(type="split")
        select-cell(:after="true", :options="leftTeamOptions", :selected.sync="leftTeamSelected")
          span(slot="header") 左侧选手
        select-cell(:after="true", :options="serviceTeamOptions", :selected.sync="serviceTeamSelected")
          span(slot="header") 发球选手
    dialog(v-if="isGameInterval", type="alert", title="中场间歇", confirm-button="取消间歇", @weui-dialog-confirm="removeGameInterval")
        h4(style="text-align: center") 中场间歇还有{{gameIntervalTimer}}秒
    cells
      link-cell()
        span(slot="body") 得分
        span(slot="footer") {{currentMatchScore}}
      link-cell()
        span(slot="body") 时钟
        span(slot="footer") {{matchClock}}
      link-cell()
        span(slot="body") 比赛项目
        span(slot="footer") {{disciplineCN}}
      link-cell()
        span(slot="body") 局数
        span(slot="footer") {{bestOfCN}}
      link-cell()
        span(slot="body") 得分制
        span(slot="footer") {{scoringSysCN}}
    .buttons
      a.button(href="javascript:;", @click="undo") 撤销
      a.button(href="javascript:;", @click="pause") 暂停
      a.button(href="javascript:;", @click="matchComplete", v-show="matchCompleted") 完成
</template>

<script>
import {
  navbarView,
  versusView
} from '../../components'
import {
  Dialog,
  Cells, LinkCell, InputCell, SelectCell
} from 'vue-weui'
import _ from 'underscore'
// import AV from '../../js/AV'
import {historyBack, exchange, toArray, disciplineCN, bestOfCN} from '../../js/utils'
import {getUserObj} from '../../js/methods'
import {addOthersUserObj} from '../../vuex/actions/user'
import {subTournamentRealtime} from '../../js/routeData'
import Clock from '../../js/Clock'
// import {saveMatch} from '../../vuex/actions/match'
import snapshot from '../../js/matchSnapshot'

const timer = new Clock()
const clock = new Clock()

export default {
  components: {
    navbarView,
    versusView,
    Dialog,
    Cells, LinkCell, InputCell, SelectCell
  },
  route: {
    data: subTournamentRealtime
  },
  vuex: {
    getters: {
      userObj: ({user}) => user.userObj,
      otherUserObjs: ({user}) => user.userObjs,
      sideExchanged: ({match}) => match.sideExchanged,
      isGameInterval: ({match}) => match.isGameInterval,
      gameIntervalTimer: ({match}) => {
        var {matchSettings} = match
        var timeout = match.gameIntervalTimer
        return timeout === 0 ? matchSettings.gameIntervalDuration : timeout
      },
      currentMatchScore: ({match}) => {
        var ret = match.matchGames.map(el => {
          return toArray(el.scores).join(':')
        }).join(' ')
        if (match.matchState === 'playing') ret += ' ' + toArray(match.scores).join(':')
        return ret
      },
      matchClock: ({match}) => match.matchClock,
      scores: ({match}) => {
        var s = _.clone(match.scores)
        return match.sideExchanged ? {'0': s['1'], '1': s['0']} : s
      },
      disciplineCN: ({match}) => {
        return disciplineCN(match.matchSettings.discipline)
      },
      scoringSysCN: ({match}) => {
        return match.matchSettings.scoringSys + '分制'
      },
      bestOfCN: ({match}) => {
        return bestOfCN(match.matchSettings.bestOf)
      }
    },
    actions: {
      addOthersUserObj,
      saveMatchSettings: ({dispatch}, obj) => dispatch('SET_MATCH_SETTINGS', obj),
      saveMatchIds ({dispatch}) {
        dispatch('SAVE_MATCH_IDS', {
          tournamentObjId: this.$route.query.main,
          subTournamentObjId: this.$route.query.sub,
          key: this.key,
          stage: this.queue[this.key].stage
        })
      },
      addScore ({dispatch, state}, index) {
        var {match} = state
        var {matchSettings} = this.queue[this.key]
        if (match.matchState !== 'playing') return
        if (match.isGameInterval) return
        if (match.sideExchanged) index = exchange(index)
        dispatch('CHANGE_GAME_SCORES', index)
        var opponentIndex = exchange(index)
        var currentScoredTeamScore = match.scores[index]
        var currentOpponentTeamScore = match.scores[opponentIndex]
        var diff = currentScoredTeamScore - currentOpponentTeamScore
        var willInterval = matchSettings.intervalScore && currentScoredTeamScore === matchSettings.intervalScore && currentScoredTeamScore > currentOpponentTeamScore
        var willWinTheGame = diff >= 2 && currentScoredTeamScore >= matchSettings.scoringSys
        if (willInterval) {
          timer.initTimer(matchSettings.gameIntervalDuration, (secs) => {
            dispatch('SET_GAME_INTERVAL_TIMER', secs)
            if (secs <= 0) dispatch('REMOVE_GAME_INTERVAL')
          })
          dispatch('SET_GAME_INTERVAL')
        }
        if (willWinTheGame) { // 得分方赢得一局比赛
          console.log('complete')
          var willWinTheMatch = willWinTheGame && (Math.ceil(matchSettings.bestOf / 2) === match.matchScores[index] + 1)
          if (willWinTheMatch) { // 赢得一场比赛
            console.log('match win')
            dispatch('CHANGE_MATCH_STATE', 'completed')
            dispatch('PUSH_MATCH_GAME', index)
          } else {
            dispatch('PUSH_MATCH_GAME', index)
            dispatch('ADD_GAME_NUMBER')
            dispatch('EXCHANGE_SIDES')
            dispatch('RESET_GAME_SCORES')
          }
        }
      },
      removeGameInterval: ({dispatch}) => {
        dispatch('REMOVE_GAME_INTERVAL')
        timer.cancel(timer.timer)
      },
      initDialogConfirm ({dispatch}) {
        // var {query} = this.$route
        // return AV.Cloud.run('tournamentRealtime', {
        //   method: 'matchStart',
        //   tournamentObjId: query.main,
        //   subTournamentObjId: query.sub,
        //   key: this.key
        // }).then(ret => {
        //   console.log(ret)
        //   this.leftTeamSelected === '0' || dispatch('EXCHANGE_SIDES')
        //   this.initDialogShow = false
        // })
        this.ref.child(`queue/${this.key}`).update({
          state: 'ongoing'
        }, () => {
          this.leftTeamSelected === '0' || dispatch('EXCHANGE_SIDES')
          this.initDialogShow = false
        })
      }
    }
  },
  data () {
    return {
      groups: [],
      queue: null,
      courts: [],
      playoffs: [],
      isSingle: null,
      key: this.$route.query.key,
      initDialogShow: false,
      leftTeamSelected: '',
      serviceTeamOptions: [],
      serviceTeamSelected: ''
    }
  },
  computed: {
    leftTeamOptions () {
      return [{text: '请选择', value: ''}].concat(this.teams.map((el, index) => {
        return {
          text: el.map(el => el.nickname).join('/'),
          value: index + ''
        }
      }))
    },
    serviceTeamOptions () {
      return this.leftTeamOptions
    },
    teams () {
      if (!this.queue) {
        return [1, 1].map(el => {
          return [{nickname: '加载中'}]
        })
      }
      var queue = this.queue[this.key]
      var {stage, groupIndex, matchIndex} = queue.stage
      if (this.isSingle) {
        if (stage === 'groups') {
          var match = this.groups[groupIndex].matches[matchIndex]
          var t = match.teams.map(el => {
            return this.getUserObj(el.objectId)
          })
          return this.sideExchanged ? t.reverse() : t
        }
      }
    }
  },
  methods: {
    historyBack,
    getUserObj,
    undo () {
      var match = this.$store.state.match
      if (match.matchState === 'preparing') return
      if (!match.scoresFlow.length && !match.matchGames.length) return
      if (!window.confirm('确定撤销上一分？')) return
      snapshot.revert(this.$store.state.match)
      // this.confirmDialogText = '确定撤销上一分？'
      // this.confirmDialogState = 'undo'
      // this.confirmDialogShow = true
    },
    matchComplete () {
      clock.cancel()
      this.saveMatch().then(ret => {
        console.log(ret)
        this.setMatchResults({
          maxConsecutivePoints: ret.maxConsecutivePoints,
          maxMatchConsecutivePoints: ret.maxMatchConsecutivePoints,
          scoringArr: ret.scoringArr
        })
        this.matchCompletedDialogShow = true
      }).catch(err => console.log(err))
    }
  },
  watch: {
    queue (val, oldVal) {
      if (!val) return
      var thisQueue = val[this.key]
      if (thisQueue.state === 'upcoming') {
        console.log(1)
        this.initDialogShow = true
      }
      if (oldVal === null) {
        this.saveMatchIds()
        this.saveMatchSettings(thisQueue.matchSettings)
      }
    }
  },
  ready () {
    window.vm = this
    snapshot.reset()
    snapshot.save(this.$store.state)
  }
}

</script>
