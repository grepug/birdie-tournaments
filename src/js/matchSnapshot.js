import _ from 'underscore'

const KEY = 'match_snapshot'

export default {

  revert (match) {
    var item
    var len
    var str
    var last

    item = window.localStorage.getItem(KEY)
    item = item && JSON.parse(item)
    len = item.length
    if (len <= 1) return
    item.splice(len - 1, 1)
    str = JSON.stringify(item)
    window.localStorage.setItem(KEY, str)
    len--
    last = item[len - 1]
    if (last) {
      console.log(item)
      _.extend(match, {
        matchGames: last.matchGames,
        gameNumber: last.gameNumber,
        lastScoredTeamIndex: last.lastScoredTeamIndex,
        matchScores: last.matchScores,
        matchState: last.matchState,
        scores: last.scores,
        scoresFlow: last.scoresFlow,
        sideExchanged: last.sideExchanged
      })
    }
  },

  save ({match}) {
    var item
    var str

    item = window.localStorage.getItem(KEY)
    item = item && JSON.parse(item)
    item = item || []
    item.push(match)
    str = JSON.stringify(item)
    window.localStorage.setItem(KEY, str)
  },

  reset () {
    window.localStorage.removeItem(KEY)
  }
}
