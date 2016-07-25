import _ from 'lodash'
import {beArray} from '../../js/utils'

const state = {
  chairUmpiredTournaments: [],
  matchResults: [],
  tournaments: [],
  myUmpiredTournaments: []
}

const mutations = {
  ADD_CHAIRUMPIRED_TOURNAMENTS (state, objs) {
    beArray(objs).forEach(el => {
      var r = _.find(state.chairUmpiredTournaments, {objectId: el.objectId})
      if (!r) state.chairUmpiredTournaments.push(el)
    })
  },
  ADD_TOURNAMENTS (state, tournamentObjs) {
    beArray(tournamentObjs).forEach(el => {
      var r = _.find(state.tournaments, {objectId: el.objectId})
      if (!r) state.tournaments.push(el)
    })
  },
  ADD_MY_UMPIRED_TOURNAMENTS (state, tournaments) {
    state.myUmpiredTournaments = tournaments
  }
}

export default {
  state,
  mutations
}
