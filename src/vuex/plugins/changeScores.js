// import _ from 'underscore'
import snapshot from '../../js/matchSnapshot'
import Wilddog from '../../../node_modules/wilddog/lib/wilddog-node'
import wilddogConfig from '../../config/wilddogConfig'
// import {toArray} from '../../js/utils'

export default function (store) {
  var ref
  var snapshotRef
  // var scoresRef
  // var lastSnapshotKeyRef
  store.subscribe((mutation, state) => {
    if (mutation.type === 'CHANGE_GAME_SCORES') {
      snapshotRef.set(state.match)
      snapshot.save(state)
    } else if (mutation.type === 'SAVE_MATCH_IDS') {
      var {tournamentObjId, subTournamentObjId, key} = state.match.matchIds
      ref = new Wilddog(`${wilddogConfig.host}/tournaments/${tournamentObjId}/subTournaments/${subTournamentObjId}/queue/${key}`)
      snapshotRef = ref.child('lastSnapshot')
    } else if (mutation.type === 'PUSH_MATCH_GAME') {
      if (state.match.matchState === 'completed') {
        snapshot.save(state)
        snapshotRef.set(state.match)
      }
    }
  })
}
