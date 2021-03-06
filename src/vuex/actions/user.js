import _ from 'lodash'
import AV from '../../js/AV'
import {beArray, isSingle} from '../../js/utils'

export const addOthersUserObj = function ({dispatch, state}, userObjIds) {
  var unstoredObjs = beArray(userObjIds).map(id => {
    var r = _.find(state.user.userObjs, {objectId: id})
    if (!r && id !== state.user.userObj.objectId) return id
  }).filter(x => x)
  if (!unstoredObjs.length) return Promise.resolve()
  return AV.Cloud.run('user', {
    method: 'getUserObjByIds',
    userObjIds: unstoredObjs
  }).then(ret => {
    if (!ret || !ret.length) return
    dispatch('ADD_OTHER_USEROBJS', ret)
  }).catch(err => console.log(err))
}

export const addDoubles = function ({dispatch, state}, doublesObjIds) {
  var unstoredObjs = beArray(doublesObjIds).map(id => {
    return _.find(state.user.doubles, {objectId: id}) ? null : id
  }).filter(x => x)
  console.log(unstoredObjs)
  if (!unstoredObjs.length) return Promise.resolve()
  return AV.Cloud.run('doubles', {
    method: 'getDoublesByIds',
    doublesObjIds: unstoredObjs
  }).then(ret => {
    console.log(ret)
    if (!ret || !ret.length) return
    dispatch('ADD_DOUBLES', ret)
    return Promise.resolve(_.flattenDeep(ret.map(el => el.players)))
  }).catch(err => console.log(err))
}

export const addBigTeams = function ({dispatch, state}, objs) {
  var unstoredObjs = beArray(objs).map(id => {
    return _.find(state.user.bigTeams, {objectId: id}) ? null : id
  }).filter(x => x)
  if (!unstoredObjs.length) return Promise.resolve()
  return AV.Cloud.run('bigTeams', {
    method: 'getBigTeamsByIds',
    bigTeamsObjIds: unstoredObjs
  }).then(ret => {
    if (!ret || !ret.length) return
    console.log(ret)
    dispatch('ADD_BIG_TEAMS', ret)
    return Promise.resolve({
      doubles: _.flattenDeep(ret.map(el => _.map(el.playersByDisciplines, (v, k) => !isSingle(k) && v).filter(x => x))),
      singles: _.flattenDeep(ret.map(el => _.map(el.playersByDisciplines, (v, k) => isSingle(k) && v).filter(x => x))),
      players: _.flatten(ret.map(el => el.players))
    })
  }).catch(err => console.log(err))
}
