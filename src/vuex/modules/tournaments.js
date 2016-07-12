import _ from 'underscore'
import {beArray} from '../../js/utils'

const state = {
  chairUmpiredTournaments: []
}

const mutations = {
  ADD_CHAIRUMPIRED_TOURNAMENTS (state, objs) {
    beArray(objs).forEach(el => {
      var r = _.findWhere(state.chairUmpiredTournaments, {objectId: el.objectId})
      if (!r) state.chairUmpiredTournaments.push(el)
    })
  }
}

export default {
  state,
  mutations
}
