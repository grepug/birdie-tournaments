import _ from 'lodash'
import store from '../vuex/store'
// import {arr2Obj} from './utils'
// import wilddogConfig from '../config/wilddogConfig'
// import Wilddog from '../../node_modules/wilddog/lib/wilddog-node'

const KEY = 'match_snapshot'

export default {

  undo () {
    var item
    var len
    var str
    var last
    var {match} = store.state
    var range = (match.matchCompleted || !match.scoresFlow.length) ? 2 : 1

    item = window.localStorage.getItem(KEY)
    item = item && JSON.parse(item)
    len = item.length
    if (len <= 1) return
    item.splice(len - range, range)
    console.log(len)
    str = JSON.stringify(item)
    window.localStorage.setItem(KEY, str)
    len--
    last = item[len - range]
    if (last) {
      console.log(item)
      store.dispatch('MATCH_REVERT', last)
    }
  },

  recover (snapshot) {
    snapshot && store.dispatch('MATCH_RECOVER', snapshot)
  },

  save ({match}) {
    var item
    var str

    item = window.localStorage.getItem(KEY)
    item = item && JSON.parse(item)
    item = item || []
    item.push(match)
    console.log(match)
    str = JSON.stringify(item)
    window.localStorage.setItem(KEY, str)
    store.dispatch('SET_CLOCK', Date.now())
  },

  reset () {
    store.dispatch('RESET_ALL')
    window.localStorage.setItem(KEY, '')
    window.localStorage.removeItem(KEY)
  },

  get (last) {
    var item = window.localStorage.getItem(KEY)
    item = item && JSON.parse(item)
    if (last) {
      return _.nth(item, -last)
    }
    return item
  }
}
