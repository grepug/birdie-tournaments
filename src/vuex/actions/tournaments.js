import _ from 'underscore'
import AV from '../../js/AV'
import {isSingle} from '../../js/utils'

export const addChairUmpiredTournaments = ({dispatch}, cb) => {
  return AV.Cloud.run('tournament', {
    method: 'getMyChairUmpiredTournaments'
  }).then(ret => {
    console.log(ret)
    dispatch('ADD_CHAIRUMPIRED_TOURNAMENTS', ret)
    var userObjIds = _.flatten(ret.map(el => el.subTournaments.map(el => {
      if (isSingle(el.discipline)) return el.signUpMembers
    }))).filter(x => x)
    cb(userObjIds)
  })
}
