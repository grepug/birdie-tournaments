<template lang="jade">
div
  navbar-view
    .left
      a.link(href="javascript:;", @click="back") 返回
    .center 比赛队列
    .right
      a.link(href="javascript:;", @click="add") 添加
  toast(type="loading", v-show="$loadingRouteData") 加载中...
  main(v-if="!$loadingRouteData")
    dialog(v-show="dialogShow", type="confirm", title="添加队列", confirm-button="添加", cancel-button="取消", @weui-dialog-confirm="dialogConfirm", @weui-dialog-cancel="dialogCancel")
      cells(type="split")
        select-cell(:after="true", :options="preparingMatchesOptions", :selected.sync="selected")
          span(slot="header") 选手
        select-cell(:after="true", :options="courtsOptions", :selected.sync="courtSelected")
          span(slot="header") 场地
        select-cell(:after="true", :options="scoringSysOptions", :selected.sync="scoringSysSelected")
          span(slot="header") 得分制
        select-cell(:after="true", :options="bestOfOptions", :selected.sync="bestOfSelected")
          span(slot="header") 局数
        switch-cell(name="switch", label="是否场地固定裁判", :on.sync="ifOneUmpire")
        select-cell(:after="true", :options="courtsOptions", :selected.sync="courtSelected", v-if="!ifOneUmpire")
          span(slot="header") 裁判
    dialog(v-show="editDialogShow", type="confirm", title="队列变更", confirm-button="确认", cancel-button="取消", @weui-dialog-confirm="editDialogConfirm", @weui-dialog-cancel="dialogCancel")
      cells(type="split")
        link-cell
          span(slot="header") 选手
          span(slot="footer") {{teamsInEditing.vs}}
        select-cell(:after="true", :options="courtsOptions", :selected.sync="courtSelected")
          span(slot="header") 场地
        select-cell(:after="true", :options="scoringSysOptions", :selected.sync="scoringSysSelected")
          span(slot="header") 得分制
        select-cell(:after="true", :options="bestOfOptions", :selected.sync="bestOfSelected")
          span(slot="header") 局数
        switch-cell(name="switch", label="是否场地固定裁判", :on.sync="ifOneUmpire")
        select-cell(:after="true", :options="courtsOptions", :selected.sync="courtSelected", v-if="!ifOneUmpire")
          span(slot="header") 裁判
    panel(access="")
      panel-header 即将进行
      panel-body(v-for="(index, el) in thisQueue", @click="edit(index)")
        media-box(type="text")
          media-body
            media-title {{el.vs}}
            media-description 小组赛 {{el.stage}} | 场地：{{el.court}} | 裁判：{{el.umpire}}
    //- cells(type="access")
    //-   link-cell(v-for="el in thisQueue")
    //-     span(slot="header") {{el.vs}}
    //-     span(slot="footer") {{el.stage}} {{el.court}} 裁判:邵锴
    //- cells-title 进行中

</template>

<script>
import {
  navbarView
} from '../../components'
import {
  Toast,
  Dialog,
  Cells,
  SelectCell,
  LinkCell,
  CellsTitle,
  SwitchCell,
  Panel, PanelHeader, PanelBody, MediaBox, MediaBody, MediaTitle, MediaDescription
} from 'vue-weui'
import _ from 'underscore'
import AV from '../../js/AV'
import Wilddog from '../../../node_modules/wilddog/lib/wilddog-node'
import {isSingle} from '../../js/utils'
import {addOthersUserObj} from '../../vuex/actions/user'

export default {
  components: {
    navbarView,
    Toast,
    Dialog,
    Cells,
    SelectCell,
    LinkCell,
    CellsTitle,
    SwitchCell,
    Panel, PanelHeader, PanelBody, MediaBox, MediaBody, MediaTitle, MediaDescription
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
              this.addOthersUserObj(_.flatten(val.map(el => {
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
  data () {
    return {
      isSingle: null,
      preparingMatches: [],
      dialogShow: false,
      editDialogShow: false,
      teamsInEditing: '',
      selected: '',
      queue: {},
      groups: [],
      courts: [],
      courtSelected: '',
      ifOneUmpire: false,
      scoringSysOptions: [{text: '21分制', value: '21'}, {text: '15分制', value: '15'}, {text: '11分制', value: '11'}],
      scoringSysSelected: '21',
      bestOfOptions: [{text: '三局两胜', value: '3'}, {text: '一局一胜', value: '1'}, {text: '五局三胜', value: '5'}],
      bestOfSelected: '3'
    }
  },
  computed: {
    preparingMatchesOptions () {
      var preparingMatches = _.flatten(this.groups.map((el, groupIndex) => {
        return el.matches.map((el, matchIndex) => {
          if (el.state === 'preparing') {
            var text = el.teams.map(el => {
              return (_.findWhere(this.otherUserObjs, {objectId: el.objectId}) || this.userObj).nickname
            }).join(' vs ')
            return {
              text,
              value: JSON.stringify({
                stage: 'groups',
                groupIndex,
                matchIndex
              })
            }
          }
        }).filter(x => x)
      }).filter(x => x))
      return [{text: '请选择', value: ''}].concat(preparingMatches)
    },
    courtsOptions () {
      return [{text: '请选择', value: ''}].concat(this.courts.map((el, courtIndex) => {
        return {
          text: el.name,
          value: courtIndex + ''
        }
      }))
    },
    thisQueue () {
      return _.map(this.queue, (val, key) => {
        var {stage, courtIndex, matchSettings} = val
        if (stage.stage === 'groups') {
          var match = this.groups[stage.groupIndex].matches[stage.matchIndex]
          var umpire = (_.findWhere(this.otherUserObjs, {objectId: this.courts[courtIndex].umpire}) || this.userObj).nickname
          var vs
          if (this.isSingle) { // 单打
            vs = match.teams.map(el => {
              return (_.findWhere(this.otherUserObjs, {objectId: el.objectId}) || this.userObj).nickname
            }).join(' vs ')
          } else { // 双打
            // to do
          }
          return {
            vs,
            stage: `第${stage.groupIndex + 1}组 第${stage.matchIndex + 1}场`,
            court: this.courts[courtIndex].name,
            courtIndex,
            matchSettings,
            umpire,
            key
          }
        }
      })
    }
  },
  methods: {
    back () {
      window.history.back()
    },
    add () {
      this.dialogShow = true
    },
    edit (index) {
      this.teamsInEditing = this.thisQueue[index]
      this.scoringSysSelected = this.teamsInEditing.matchSettings.scoringSys
      this.bestOfSelected = this.teamsInEditing.matchSettings.bestOf
      this.courtSelected = this.teamsInEditing.courtIndex
      this.editDialogShow = true
    },
    dialogConfirm () {
      const {query} = this.$route
      return AV.Cloud.run('tournamentRealtime', {
        method: 'queueUp',
        tournamentObjId: query.main,
        subTournamentObjId: query.sub,
        stage: JSON.parse(this.selected),
        courtIndex: this.courtSelected,
        matchSettings: {
          scoringSys: this.scoringSysSelected,
          bestOf: this.bestOfSelected
        }
      }).then(ret => {
        console.log(ret)
        this.dialogShow = false
      }).catch(err => console.log(err))
    },
    editDialogConfirm () {
      const {query} = this.$route
      return AV.Cloud.run('tournamentRealtime', {
        method: 'updateQueue',
        tournamentObjId: query.main,
        subTournamentObjId: query.sub,
        key: this.teamsInEditing.key,
        courtIndex: this.courtSelected,
        matchSettings: {
          scoringSys: this.scoringSysSelected,
          bestOf: this.bestOfSelected
        }
      }).then(ret => {
        console.log(ret)
        this.editDialogShow = false
      }).catch(err => console.log(err))
    },
    dialogCancel () {
      this.dialogShow = false
      this.editDialogShow = false
    }
  },
  ready () {
    window.vm = this
  }
}

</script>
