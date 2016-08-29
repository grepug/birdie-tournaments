import _ from 'lodash'

const state = {
  isUserLoged: false,
  userObj: null,
  userObjs: [],
  doubles: []
}

const mutations = {
  USERLOGED (state) {
    state.isUserLoged = true
  },
  SET_USEROBJ (state, userObj) {
    state.userObj = userObj
  },
  ADD_OTHER_USEROBJS (state, userObjs) {
    userObjs.forEach(userObj => {
      var r = _.find(state.userObjs, {objectId: userObj.objectId})
      if (!r) state.userObjs.push(userObj)
    })
  },
  ADD_DOUBLES (state, doublesObjs) {
    console.log(doublesObjs)
    doublesObjs.forEach(obj => {
      var r = _.find(state.doubles, {objectId: obj.objectId})
      r || state.doubles.push(obj)
    })
  }
}

export default {
  state,
  mutations
}
