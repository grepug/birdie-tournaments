// import _ from 'underscore'
import snapshot from '../../js/matchSnapshot'
import Wilddog from '../../../node_modules/wilddog/lib/wilddog-node'
import wilddogConfig from '../../config/wilddogConfig'
import {toArray} from '../../js/utils'

export default function (store) {
  var ref
  var snapshotRef
  var scoresRef
  store.subscribe((mutation, state) => {
    if (mutation.type === 'CHANGE_GAME_SCORES') {
      snapshot.save(state)
      snapshotRef.push(state.match)
      scoresRef.set((toArray(state.match.matchGames && state.match.matchGames.scores) || []).concat(state.match.scores))
    } else if (mutation.type === 'SAVE_MATCH_IDS') {
      var {tournamentObjId, subTournamentObjId, key} = state.match.matchIds
      ref = new Wilddog(`${wilddogConfig.host}/tournaments/${tournamentObjId}/subTournaments/${subTournamentObjId}/queue/${key}`)
      snapshotRef = ref.child('snapshot')
      scoresRef = ref.child('scores')
    }
  })
}
