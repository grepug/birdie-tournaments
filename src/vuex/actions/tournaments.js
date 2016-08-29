// import _ from 'lodash'
import AV from '../../js/AV'
// import {addOthersUserObj, addDoubles} from './user'
import {duplicate, beArray} from '../../js/utils'

export const addChairUmpiredTournaments = ({dispatch, state}) => {
  if (state.tournaments.chairUmpiredTournaments && state.tournaments.chairUmpiredTournaments.length) return Promise.resolve()
  return AV.Cloud.run('tournament', {
    method: 'getMyChairUmpiredTournaments'
  }).then(ret => {
    dispatch('ADD_CHAIRUMPIRED_TOURNAMENTS', ret)
    // var userObjIds = _.flattenDeep(ret.map(el => el.subTournaments.map(el => {
    //   if (isSingle(el.discipline)) return el.signUpMembers.concat(el.umpires)
    // }))).filter(x => x)
    // console.log(userObjIds)
    // var pro1 = addOthersUserObj({dispatch, state}, userObjIds)
    // var promises = ret.map(el => el.subTournaments.map(el => {
    //   if (!isSingle(el.discipline)) return addDoubles(el.signUpMembers)
    // })).filter(x => x)
    // var pro2 = Promise.all(promises)
    // return Promise.all([pro1, pro2])
  })
}

export const addTournaments = ({dispatch, state}, ids) => {
  return AV.Cloud.run('tournament', {
    method: 'get',
    ids: ids ? beArray(ids) : null
  }).then(ret => {
    console.log(ret)
    dispatch('ADD_TOURNAMENTS', ret)
    dispatch('ADD_MY_UMPIRED_TOURNAMENTS', duplicate(ret).map(el => {
      el.subTournaments = el.subTournaments.map(el2 => {
        if (el2.umpires.indexOf(state.user.userObj.objectId) !== -1) return el2
      }).filter(x => x)
      return el.subTournaments.length && el
    }).filter(x => x))
  })
}
