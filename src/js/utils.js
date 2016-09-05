import _ from 'lodash'

export const toArray = function (obj) {
  return _.map(obj, x => x)
}

export const find = function (obj, objectId) {
  return _.find(obj, {objectId})
}

export const exchange = function (index) {
  return parseInt(index) === 0 ? 1 : 0
}

export const int = parseInt

export const trim = function (str) {
  return str.trim()
}

export const beArray = function (param) {
  if (_.isArray(param)) return param
  return [param]
}

export const arr2Obj = function (arr) {
  var obj = {}
  arr.filter(x => {
    return x === 0 ? true : x
  }).forEach((el, index) => {
    obj[index] = el
  })
  return obj
}

export const historyBack = function () {
  var location = window.location.href
  window.history.back()
  setTimeout(() => {
    if (location === window.location.href) return this.$router.go({path: '/'})
  }, 10)
}

export const isSingle = function (discipline) {
  if (discipline === 'ms' || discipline === 'ws' || discipline === 's') return true
  return false
}

export const duplicate = function (obj) {
  return JSON.parse(JSON.stringify(obj))
}

export const getAgeByBirthday = function (birthday) {
  var birthdayObj = new Date(birthday)
  var todayObj = new Date()
  var raw = todayObj.getFullYear() - birthdayObj.getFullYear()
  if (todayObj.getMonth() > birthdayObj.getMonth()) return raw
  else if (todayObj.getMonth() < birthdayObj.getMonth()) return raw - 1
  else {
    if (todayObj.getDate() >= birthdayObj.getDate()) return raw
    else return raw - 1
  }
}

export const disciplineCN = function (discipline) {
  switch (discipline) {
    case 'ms':
      return '男子单打'
    case 'md':
      return '男子双打'
    case 'ws':
      return '女子单打'
    case 'wd':
      return '女子双打'
    case 'xd':
      return '混合双打'
    case 's':
      return '单打'
    case 'd':
      return '双打'
    default:
      return '未知'
  }
}

export const bestOfCN = function (bestOf) {
  switch (parseInt(bestOf)) {
    case 1:
      return '一局一胜'
    case 3:
      return '三局两胜'
    case 5:
      return '五局三胜'
  }
}

export const roundTitleCN = function (round) {
  switch (parseInt(round)) {
    case 2:
      return '决赛'
    case 4:
      return '半决赛'
    case 8:
      return '四分之一决赛'
    case 16:
      return '八分之一决赛'
    default:
      return '未知'
  }
}

export const getStageCN = function (stage) {
  if (stage.stage === 'groups') {
    return `小组赛 第${stage.groupIndex + 1}组 第${stage.matchIndex + 1}场`
  }
  if (stage.stage === 'playoffs') {
    return `淘汰赛 ${stage.round}强 第${stage.matchIndex}场`
  }
}

export const arrGroup = function (arr, groupsLen) {
  var len = arr.length
  var size = Math.floor(len / groupsLen)
  var ret = _.range(groupsLen)
  return ret.map((el, index) => {
    return index !== groupsLen - 1 ? arr.slice(index * size, (index + 1) * size) : arr.slice(index * size)
  })
}
