<template lang="jade">
div
  navbar-view
    .left
      a.link(href="javascript:;", @click="back") 返回
    .center 对阵表
    .right
      a.link(href="javascript:;")
  main
    cells(type="split")
      select-cell(:after="true", :options="viewOptions", :selected.sync="viewSelected")
        span(slot="header") 查看
    template(v-if="viewSelected === 'groups'", v-for="(index, group) in thisGroups")
      select-cell(:after="true", :options="groupIndexOptions", :selected.sync="groupIndexSelected")
        span(slot="header") 小组
      template(v-if="index === groupIndexSelected")
        link-cell.row(v-for="team in group.teams")
          span(slot="header") {{team.nickname}}
          span(slot="footer") {{team.scores.join(' : ')}}
        link-cell.row(v-for="match in group.matches")
          span(slot="header") {{match.nicknames.join(' vs ')}}
          span(slot="footer") {{match.scores}}
    template(v-if="viewSelected === 'eliminations'")
      template(v-for="el in thisPlayoffs")
        cells-title {{el.roundTitle}}
        cells
          link-cell(v-for="el in el.matches")
            span(slot="header") {{el.nicknames}}
            span(slot="footer") {{el.scores}}
</template>

<script>
  import {
    navbarView
  } from '../../components'
  import {bracket, group} from 'vue-bracket'
  import {
    Cells, LinkCell, CellsTitle,
    SelectCell
  } from 'vue-weui'
  import _ from 'lodash'
  import {isSingle, roundTitleCN} from '../../js/utils'
  import {getUserObj} from '../../js/methods'
  import Wilddog from '../../../node_modules/wilddog/lib/wilddog-node'
  import {addOthersUserObj} from '../../vuex/actions/user'

  export default {
    components: {
      navbarView,
      bracket,
      group,
      Cells, LinkCell, CellsTitle,
      SelectCell
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
              ? this.queue[el.queueKey].lastSnapshot.matchGames.map(el => el.scores.join(':')).join(' ')
              : '-'
              return el
            })
          }
        })
      },
      thisPlayoffs () {
        return this.playoffs.map(el => {
          var {queueKey} = el
          var thisQueue = this.queue[queueKey]
          return {
            roundTitle: roundTitleCN(el.round),
            matches: el.matches.map(el => {
              el.nicknames = el.teams.map(el => {
                return this.getUserObj(el.objectId)[0].nickname
              }).join(' vs ')
              el.scores = thisQueue
              ? this.queue[el.queueKey].lastSnapshot.matchGames.map(el => el.scores.join(':')).join(' ')
              : '-'
              return el
            })
          }
        })
      },
      groupIndexOptions () {
        var len = this.groups.length
        if (!len) return []
        return _.range(len).map(el => {
          return {
            value: el,
            text: `第${el + 1}组`
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
        queue: [],
        groupIndexSelected: 0,
        viewOptions: [{text: '小组赛', value: 'groups'}, {text: '淘汰赛', value: 'eliminations'}],
        viewSelected: 'groups'
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
