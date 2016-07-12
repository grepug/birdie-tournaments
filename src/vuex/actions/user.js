import _ from 'underscore'
import AV from '../../js/AV'
import {beArray} from '../../js/utils'

export const addOthersUserObj = function ({dispatch, state}, userObjIds) {
  var unstoredObjs = beArray(userObjIds).map(id => {
    var r = _.findWhere(state.user.userObjs, {objectId: id})
    if (!r && id !== state.user.userObj.objectId) return id
    return null
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
