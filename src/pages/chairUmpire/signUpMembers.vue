<template lang="jade">
div
  navbar-view
    .left
      a.link(href="javascript:;", @click="back") 返回
    .center 报名列表
    .right
      a.link(href="javascript:;", @click="openSortable", v-if="sortableState === 'closed'") 排阵
      a.link(href="javascript:;", @click="save", v-if="sortableState === 'sorting'") 保存
  main
    div.clearfix(v-for="(index, group) in signUpMembersGrouped")
      cells-title Group {{index + 1}}
      cells(type="access", v-if="isSingle(subTournament.discipline)")
        link-cell(v-for="(index2, el) in group", :data-index="index", :data-index2="index2")
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
    CellsTitle
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
      CellsTitle
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
    data () {
      return {
        sortableState: 'closed'
      }
    },
    computed: {
      subTournament () {
        if (!this.myChairUmpiredTournaments.length) return []
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
        var groupOrder = Array.prototype.map.call(document.querySelectorAll('main > div'), el => {
          return Array.prototype.map.call(el.querySelectorAll('[data-index]'), el => {
            var index = el.getAttribute('data-index')
            var index2 = el.getAttribute('data-index2')
            return this.signUpMembersGrouped[index][index2]
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
      if (!this.myChairUmpiredTournaments.length) {
        this.addChairUmpiredTournaments((userObjIds) => this.addOthersUserObj(userObjIds))
      }
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
  > div {
    // display: inline-block;
    float: left;
    width: 50%;
    .weui_cells {
      min-height: 80px;
    }
  }
}

</style>
