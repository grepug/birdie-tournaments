<template lang="jade">
div
  navbar-view
    .left
      a.link(href="javascript:;", @click="back") 返回
    .center 对阵表
    .right
      a.link(href="javascript:;")
  main
    template(v-for="(index, el) in thisGroups")
      cells-title 第{{index + 1}}组
      link-cell.row(v-for="team in el.teams")
        span(slot="header") {{team.nickname}}
        span(slot="footer") {{team.scores.join(' : ')}}
      link-cell.row(v-for="match in el.matches")
        span(slot="header") {{match.nicknames.join(' vs ')}}
        span(slot="footer") {{match.scores}}
</template>

<script>
  import {
    navbarView
  } from '../../components'
  import {bracket, group} from 'vue-bracket'
  import {
    Cells, LinkCell, CellsTitle
  } from 'vue-weui'
  import _ from 'lodash'
  import {isSingle} from '../../js/utils'
  import {getUserObj} from '../../js/methods'
  import Wilddog from '../../../node_modules/wilddog/lib/wilddog-node'
  import {addOthersUserObj} from '../../vuex/actions/user'

  export default {
    components: {
      navbarView,
      bracket,
      group,
      Cells, LinkCell, CellsTitle
    },
    route: {
      data () {
        var {query} = this.$route
        const uri = `https://birdie2.wilddogio.com/tournaments/${query.main}/subTournaments/${query.sub}`
        var ref = new Wilddog(uri)
        return ref.on('value', (snapshot) => {
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
    },
    vuex: {
      getters: {
        otherUserObjs: ({user}) => user.userObjs,
        userObj: ({user}) => user.userObj
      },
      actions: {
        addOthersUserObj
      }
    },
    computed: {
      thisGroups () {
        return this.groups.map(el => {
          return {
            teams: el.teams.map(el => {
              return {
                nickname: this.getUserObj(el.objectId)[0].nickname,
                objectId: el.objectId,
                scores: [_.size(el.scores.w), _.size(el.scores.l)]
              }
            }).sort((v1, v2) => {
              var a = v1.scores[0] - v1.scores[1]
              var b = v2.scores[0] - v2.scores[1]
              if (a > b) return -1
              if (a < b) return 1
              if (a === b) {
                if (v1.scores[1] > v2.scores[1]) return 1
                if (v1.scores[1] < v2.scores[1]) return -1
              }
              return 0
            }),
            matches: el.matches.map(el => {
              el.nicknames = el.teams.map(el => {
                return this.getUserObj(el.objectId)[0].nickname
              })
              el.scores = this.queue[el.queueKey]
              ? this.queue[el.queueKey].lastSnapshot.matchScores.join(' : ')
              : '0 : 0'
              return el
            })
          }
        })
      }
    },
    data () {
      return {
        isSingle: null,
        groups: [],
        playoffs: [],
        courts: [],
        queue: []
      }
    },
    methods: {
      back () {
        window.history.back()
      },
      getUserObj
    },
    ready () {
      window.vm = this
    }
  }
</script>

<style lang="less">
main {
  .b {
    overflow-x: scroll;
  }
  width: 100%;
}
</style>
