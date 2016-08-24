import _ from 'lodash'
import AV from '../../js/AV'
import {beArray} from '../../js/utils'

export const addOthersUserObj = function ({dispatch, state}, userObjIds) {
  var unstoredObjs = beArray(userObjIds).map(id => {
    var r = _.find(state.user.userObjs, {objectId: id})
    if (!r && id !== state.user.userObj.objectId) return id
  }).filter(x => x)
  if (!unstoredObjs.length) return
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
    var r = _.find(state.user.doublesObjs, {objectId: id})
    if (!r) return id
  }).filter(x => x)
  if (!unstoredObjs.length) return
  return AV.Cloud.run('doubles', {
    method: 'getDoublesByIds',
    doublesObjIds: unstoredObjs
  }).then(ret => {
    if (!ret || !ret.length) return
    dispatch('ADD_DOUBLES', ret)
  }).catch(err => console.log(err))
}
