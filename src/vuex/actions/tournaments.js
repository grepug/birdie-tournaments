import _ from 'underscore'
import AV from '../../js/AV'

export const addChairUmpiredTournaments = ({dispatch}, cb) => {
  return AV.Cloud.run('tournament', {
    method: 'getMyChairUmpiredTournaments'
  }).then(ret => {
    console.log(ret)
    dispatch('ADD_CHAIRUMPIRED_TOURNAMENTS', ret)
    var userObjIds = _.flatten(ret.map(el => el.subTournaments.map(el => el.signUpMembers)))
    cb(userObjIds)
  })
}
