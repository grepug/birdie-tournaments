import _ from 'lodash'

const state = {
  matchSettings: {},
  matchState: 'playing', // preparing, playing, completed
  matchClock: '00:00:00',
  matchDuration: 0,
  scores: {
    '0': 0,
    '1': 0
  },
  scoresFlow: [],
  sideExchanged: false,
  matchGames: [],
  matchScores: {
    '0': 0,
    '1': 0
  },
  lastScoredTeamIndex: 1,
  gameNumber: 1,
  isGameInterval: false,
  gameIntervalTimer: 0,
  matchIds: {},
  withdrawal: null,
  results: null,
  lastScoreDate: null,
  winnerIndex: null
}

const mutations = {
  CHANGE_MATCH_STATE (state, matchState) {
    state.matchState = matchState
  },
  CHANGE_MATCH_DURATION (state, cl, duration) {
    state.matchClock = cl
    state.matchDuration = duration
  },
  CHANGE_GAME_SCORES (state, team) {
    state.scores[team]++
    state.scoresFlow.push({
      scoredTeam: team,
      duration: state.matchDuration,
      currentScore: state.scores[team]
    })
    state.lastScoredTeamIndex = team
  },
  RESET_GAME_SCORES (state) {
    state.scores = {'0': 0, '1': 0}
  },
  EXCHANGE_SIDES (state) {
    state.sideExchanged = !state.sideExchanged
  },
  PUSH_MATCH_GAME (state, winnerIndex) {
    state.matchGames.push({
      scoresFlow: state.scoresFlow,
      winner: winnerIndex,
      duration: state.matchDuration,
      scores: state.scores
    })
    state.matchScores[winnerIndex]++
    state.scoresFlow = []
  },
  ADD_GAME_NUMBER (state) {
    state.gameNumber++
  },
  SET_GAME_INTERVAL (state) {
    state.isGameInterval = true
  },
  SET_GAME_INTERVAL_TIMER (state, secs) {
    state.gameIntervalTimer = secs
  },
  REMOVE_GAME_INTERVAL (state) {
    state.isGameInterval = false
    state.gameIntervalTimer = 0
  },
  SET_WITHDRAWAL (state, index) {
    state.withdrawal = index
  },
  SET_MATCH_RESULTS (state, results) {
    state.results = results
  },
  SAVE_MATCH_IDS (state, ids) {
    state.matchIds = ids
  },
  SET_MATCH_SETTINGS (state, obj) {
    state.matchSettings = obj
  },
  MATCH_RECOVER (state, obj) {
    _.extend(state, obj)
  },
  MATCH_REVERT (state, obj) {
    _.extend(state, obj)
  },
  SET_CLOCK (state, clock) {
    state.lastScoreDate = clock
  }
}

export default {
  state,
  mutations
}
