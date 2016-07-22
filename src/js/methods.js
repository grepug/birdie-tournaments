import _ from 'underscore'
import {beArray} from './utils'

export const getUserObj = function (ids) {
  var user = this.$store.state.user
  return beArray(ids).map(el => {
    if (el === user.userObj.objectId) return user.userObj
    var r = _.findWhere(user.userObjs, {objectId: el})
    return r || {}
  })
}
