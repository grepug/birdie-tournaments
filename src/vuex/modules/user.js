import _ from 'lodash'

const state = {
  isUserLoged: false,
  userObj: null,
  userObjs: []
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
  }
}

export default {
  state,
  mutations
}
