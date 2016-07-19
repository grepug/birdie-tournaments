import _ from 'underscore'
import AV from '../../js/AV'
import {addOthersUserObj} from './user'
import {isSingle} from '../../js/utils'

export const addChairUmpiredTournaments = ({dispatch, state}) => {
  if (state.tournaments.chairUmpiredTournaments && state.tournaments.chairUmpiredTournaments.length) return Promise.resolve()
  return AV.Cloud.run('tournament', {
    method: 'getMyChairUmpiredTournaments'
  }).then(ret => {
    dispatch('ADD_CHAIRUMPIRED_TOURNAMENTS', ret)
    var userObjIds = _.flatten(ret.map(el => el.subTournaments.map(el => {
      if (isSingle(el.discipline)) return el.signUpMembers.concat(el.umpires)
    }))).filter(x => x)
    return addOthersUserObj({dispatch, state}, userObjIds)
  })
}
