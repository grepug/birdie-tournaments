import Wilddog from '../../node_modules/wilddog/lib/wilddog-node'
import _ from 'lodash'
import {isSingle} from './utils'

export const subTournamentRealtime = function () {
  var {query} = this.$route
  const uri = `https://birdie2.wilddogio.com/tournaments/${query.main}/subTournaments/${query.sub}`
  this.ref = new Wilddog(uri)
  return this.ref.on('value', (snapshot) => {
    snapshot.forEach(data => {
      var key = data.key()
      var val = data.val()
      switch (key) {
        case 'groups':
          this.groups = val
          this.addOthersUserObj(_.flattenDeep(val.map(el => {
            return el.teams.map(el => el.objectId)
          })))
          break
        case 'playoffs':
          this.playoffs = val
          break
        case 'queue':
          this.queue = val
          break
        case 'courts':
          this.courts = val
          this.addOthersUserObj(val.map(el => el.umpire))
          break
        case 'discipline':
          this.isSingle = isSingle(val)
          break
      }
    })
  })
}
