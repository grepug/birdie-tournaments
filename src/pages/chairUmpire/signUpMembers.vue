<template lang="jade">
div
  navbar-view
    .left
      a.link(href="javascript:;", @click="back") 返回
    .center 报名列表
    .right
      a.link(href="javascript:;", @click="actionsheetShow = true", v-if="sortableState === 'closed'") 操作
      a.link(href="javascript:;", @click="save", v-if="sortableState === 'sorting'") 保存
  toast(type="loading", v-show="true", v-if="$loadingRouteData") 加载中...
  actionsheet(:show.sync="actionsheetShow", :menus="actionsheetMenus", :actions="actionsheetActions", @weui-menu-click="handleMenuClick")
  main(v-if="!$loadingRouteData")
    template(v-if="sortableState === 'closed'")
      cells-title {{subTournament.name}}报名列表
      cells(type="access", v-if="thisList && thisList.length")
        link-cell(v-for="(index, el) in thisList", :data-index="index")
          span(slot="body") {{el.nickname}}
          span(slot="footer") {{el.sex}}
    template(v-if="subTournament.state.indexOf('groupStage') !== -1 && sortableState === 'closed'")
      cells-title {{subTournament.name}}小组已出线
      cells(type="access", v-if="thisList && thisList.length", v-for="(index, promoted) in thisList")
        link-cell(v-for="el in promoted")
          span(slot="body") {{el.userObj.nickname}}
          span(slot="footer") {{el.w}} : {{el.l}}
    .group.clearfix(v-for="(index, group) in groups", v-show="sortableState === 'sorting'")
      cells-title 第{{index + 1}}组
      cells(type="access")
        link-cell(v-for="(index2, el) in group", :data-objectid="el.objectId")
          span(slot="body") {{el.nickname}}
          span(slot="footer") {{el.sex}}
</template>

<script>
  import {
    navbarView
  } from '../../components'
  import {
    Cells,
    LinkCell,
    CellsTitle,
    Toast,
    Actionsheet
  } from 'vue-weui'
  import _ from 'lodash'
  import AV from '../../js/AV'
  import {isSingle, groupArr, arrGroup, toArray} from '../../js/utils'
  import {addChairUmpiredTournaments} from '../../vuex/actions/tournaments'
  import {addOthersUserObj} from '../../vuex/actions/user'
  import Sortable from 'sortablejs'
  import {getUserObj} from '../../js/methods'

  export default {
    components: {
      navbarView,
      Cells,
      LinkCell,
      CellsTitle,
      Toast,
      Actionsheet
    },
    vuex: {
      getters: {
        myChairUmpiredTournaments: ({tournaments}) => tournaments.chairUmpiredTournaments,
        otherUserObjs: ({user}) => user.userObjs,
        userObj: ({user}) => user.userObj
      },
      actions: {
        addChairUmpiredTournaments,
        addOthersUserObj
      }
    },
    route: {
      data ({next}) {
        return this.addChairUmpiredTournaments()
        .then(() => {
          return AV.Cloud.run('tournamentRealtime', {
            method: 'getSubTournamentGroups',
            tournamentObjId: this.$route.query.main,
            subTournamentObjId: this.$route.query.sub
          })
        }).then(ret => {
          this.groupsStage = toArray(ret)
        })
      }
    },
    data () {
      return {
        groupsStage: [],
        sortableState: 'closed',
        groups: _.range(4),
        groupsList: [],
        playoffsList: [],
        actionsheetShow: false,
        actionsheetMenus: {
          orderByGroups: '小组赛排阵',
          orderAsElimination: '淘汰赛排阵'
        },
        actionsheetActions: {

        },
        orderMethod: ''
      }
    },
    computed: {
      subTournament () {
        if (!this.myChairUmpiredTournaments.length) return {}
        var {query} = this.$route
        var r = _.find(this.myChairUmpiredTournaments, {objectId: query.main})
        return _.find(r.subTournaments, {objectId: query.sub})
      },
      thisList () {
        const {state} = this.subTournament
        switch (state) {
          case 'signingUp':
          case 'signingUpDue':
            return this.signUpMembers
          case 'groupStageOngoing':
          case 'groupStageCompleted':
            return this.groupPromoted
        }
      },
      signUpMembers () {
        var signUpMembers = this.subTournament.signUpMembers
        if (!signUpMembers) return []
        if (isSingle(this.subTournament.discipline)) {
          return signUpMembers.map(el => {
            if (el === this.userObj.objectId) return this.userObj
            return _.find(this.otherUserObjs, {objectId: el})
          })
        }
        return signUpMembers.map(el => {
          return _.find(this.doubles, {objectId: el})
        })
      },
      signUpMembersGrouped () {
        return groupArr(this.signUpMembers, 4)
      },
      groupPromoted () {
        return this.groupsStage.map(el => {
          return el.teams.map(el => {
            var wSize = _.size(el.scores.w)
            var lSize = _.size(el.scores.l)
            if (wSize > lSize) {
              return {
                userObj: this.getUserObj(el.objectId)[0],
                w: wSize,
                l: lSize
              }
            }
          }).filter(x => x)
        })
      }
    },
    methods: {
      back () {
        window.history.back()
      },
      handleMenuClick (key) {
        const {state} = this.subTournament
        this.orderMethod = key
        switch (key) {
          case 'orderByGroups':
            if (state !== 'signingUpDue') break
            this.groups = arrGroup(this.signUpMembers, window.prompt('分成几组'))
            window.setTimeout(() => {
              this.openSortable()
            }, 10)
            break
          case 'orderAsElimination':
            console.log(state)
            if (state !== 'signingUpDue' &&
              state !== 'groupStageCompleted') break
            console.log(this.thisList)
            var members = _.flattenDeep(this.thisList.map(el => el.map(el => el.userObj)))
            this.groups = _.chunk(members, 2)
            console.log(this.groups)
            window.setTimeout(() => {
              this.openSortable()
            }, 10)
            break
        }
        this.actionsheetShow = false
      },
      isSingle,
      getUserObj,
      openSortable () {
        Array.prototype.forEach.call(document.querySelectorAll('.group .weui_cells'), (el, index) => {
          Sortable.create(el, {
            group: {
              name: 'signUpMembers'
            },
            handle: '.weui_cell',
            animation: 150
          })
        })
        this.sortableState = 'sorting'
      },
      save () {
        // if (this.subTournament.state !== 'signingUp') return
        var order = Array.prototype.map.call(document.querySelectorAll('main > .group'), el => {
          return Array.prototype.map.call(el.querySelectorAll('[data-objectid]'), el => {
            var objectId = el.getAttribute('data-objectid')
            return objectId
          })
        })
        console.log(JSON.parse(JSON.stringify(order)))
        var {query} = this.$route
        switch (this.orderMethod) {
          case 'orderByGroups':
            return AV.Cloud.run('tournamentRealtime', {
              method: 'saveSubTournamentOrder',
              tournamentObjId: query.main,
              subTournamentObjId: query.sub,
              order,
              stage: this.orderMethod
            }).then(ret => {
              console.log(ret)
              this.sortableState = 'closed'
            }).catch(err => console.log(err))
          case 'orderAsElimination':
            console.log(1)
            return AV.Cloud.run('tournamentRealtime', {
              method: 'savePlayoffs',
              tournamentObjId: query.main,
              subTournamentObjId: query.sub,
              order
            }).then(ret => {
              console.log(ret)
              this.sortableState = 'closed'
            }).catch(err => console.log(err))
        }
      }
    },
    ready () {
      window.vm = this
      window.groupArr = groupArr
    }
  }
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}
.clearfix:after{
  content: " ";
  display: table;
  height: 0;
  clear: both;
  visibility: hidden;
}
.clearfix {
  // *+height: 1%;
}
main {
  width: 100%;
  // display: flex;
  > .group {
    // display: inline-block;
    float: left;
    width: 50%;
    .weui_cells {
      min-height: 80px;
    }
  }
}

</style>
