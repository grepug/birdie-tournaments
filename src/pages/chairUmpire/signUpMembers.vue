<template lang="jade">
div
  navbar-view
    .left
      a.link(href="javascript:;", @click="back") 返回
    .center 报名列表
    .right
      a.link(href="javascript:;", @click="openSortable", v-if="sortableState === 'closed'") 排阵
      a.link(href="javascript:;", @click="save", v-if="sortableState === 'sorting'") 保存
  toast(type="loading", v-show="true", v-if="$loadingRouteData") 加载中...
  main(v-if="!$loadingRouteData")
    template(v-if="subTournament.state === 'signingUp'")
      cells-title {{subTournament.name}}报名列表
      cells(type="access", v-if="signUpMembers && signUpMembers.length")
        link-cell(v-for="(index, el) in signUpMembers", :data-index="index")
          span(slot="body") {{el.nickname}}
          span(slot="footer") {{el.sex}}
      .group.clearfix(v-for="(index, group) in groups")
        cells-title 第{{index + 1}}组
        cells(type="access")

</template>

<script>
  import {
    navbarView
  } from '../../components'
  import {
    Cells,
    LinkCell,
    CellsTitle,
    Toast
  } from 'vue-weui'
  import _ from 'underscore'
  import AV from '../../js/AV'
  import {isSingle, groupArr} from '../../js/utils'
  import {addChairUmpiredTournaments} from '../../vuex/actions/tournaments'
  import {addOthersUserObj} from '../../vuex/actions/user'
  import Sortable from 'sortablejs'

  export default {
    components: {
      navbarView,
      Cells,
      LinkCell,
      CellsTitle,
      Toast
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
      }
    },
    data () {
      return {
        sortableState: 'closed',
        groups: _.range(4),
        groupsList: [],
        playoffsList: []
      }
    },
    computed: {
      subTournament () {
        if (!this.myChairUmpiredTournaments.length) return {}
        var {query} = this.$route
        var r = _.findWhere(this.myChairUmpiredTournaments, {objectId: query.main})
        return _.findWhere(r.subTournaments, {objectId: query.sub})
      },
      signUpMembers () {
        var signUpMembers = this.subTournament.signUpMembers
        if (!signUpMembers) return []
        if (isSingle(this.subTournament.discipline)) {
          return signUpMembers.map(el => {
            if (el === this.userObj.objectId) return this.userObj
            return _.findWhere(this.otherUserObjs, {objectId: el})
          })
        }
        return signUpMembers.map(el => {
          return _.findWhere(this.doubles, {objectId: el})
        })
      },
      signUpMembersGrouped () {
        return groupArr(this.signUpMembers, 4)
      }
    },
    methods: {
      back () {
        window.history.back()
      },
      isSingle,
      openSortable () {
        var el = document.querySelector('main')
        Array.prototype.forEach.call(document.querySelectorAll('.weui_cells'), (el, index) => {
          Sortable.create(el, {
            group: {
              name: 'signUpMembers'
              // pull: true,
              // put: ['signUpMembers0', 'signUpMembers1']
            },
            handle: '.weui_cell',
            animation: 150
          })
        })
        this.sort = Sortable.create(el, {
          animation: 150,
          handle: '.weui_cells_title',
          draggable: '.weui_cell',
          dataIdAttr: 'data-id',
          onEnd (evt) {
            console.log(evt.oldIndex)
            console.log(evt.newIndex)
          }
        })
        this.sortableState = 'sorting'
      },
      save () {
        if (this.subTournament.state !== 'signingUp') return
        var groupOrder = Array.prototype.map.call(document.querySelectorAll('main > .group'), el => {
          return Array.prototype.map.call(el.querySelectorAll('[data-index]'), el => {
            var index = el.getAttribute('data-index')
            return this.signUpMembers[index].objectId
          })
        })
        console.log(JSON.parse(JSON.stringify(groupOrder)))
        var {query} = this.$route
        return AV.Cloud.run('tournamentRealtime', {
          method: 'saveSubTournamentOrder',
          tournamentObjId: query.main,
          subTournamentObjId: query.sub,
          groupOrder
        }).then(ret => {
          console.log(ret)
          this.sortableState = 'closed'
        }).catch(err => console.log(err))
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
