import _ from 'lodash'
import {beArray} from './utils'

export const getUserObj = function (ids) {
  var user = this.$store.state.user
  return beArray(ids).map(el => {
    if (el === user.userObj.objectId) return user.userObj
    var r = _.find(user.userObjs, {objectId: el})
    return r || {}
  })
}

export const getDoublesObj = function (ids) {
  var user = this.$store.state.user
  return beArray(ids).map(el => {
    return _.find(user.doubles, {objectId: el}) || {}
  })
}
