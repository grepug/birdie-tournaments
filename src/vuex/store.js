import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import match from './modules/match'
import tournaments from './modules/tournaments'
import changeScores from './plugins/changeScores'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    match,
    tournaments
  },
  plugins: [changeScores]
})
