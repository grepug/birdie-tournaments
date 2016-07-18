import _ from 'underscore'

export const toArray = function (obj) {
  return _.map(obj, x => x)
}

export const find = function (obj, objectId) {
  return _.findWhere(obj, {objectId})
}

export const exchange = function (index) {
  return index === 0 ? 1 : 0
}

export const int = parseInt

export const trim = function (str) {
  return str.trim()
}

export const beArray = function (param) {
  if (_.isArray(param)) return param
  return [param]
}

export const isSingle = function (discipline) {
  if (discipline === 'ms' || discipline === 'ws' || discipline === 's') return true
  return false
}

export const groupArr = function (arr, groups) {
  const len = arr.length
  const lenPerGroup = Math.floor(len / groups)
  var begin = 0
  var end = lenPerGroup
  return _.range(groups).map((el, i, originArr) => {
    if (i === originArr.length - 1) {
      if (end !== i + 1) end = i + 1
    }
    console.log(end)
    var ret = arr.slice(begin, end)
    begin += lenPerGroup
    end += lenPerGroup
    return ret
  })
}
