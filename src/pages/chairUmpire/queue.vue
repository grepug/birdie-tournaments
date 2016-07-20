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
          span(slot="header") 准备中的比赛
        select-cell(:after="true", :options="courtsOptions", :selected.sync="courtSelected")
          span(slot="header") 场地
        switch-cell(name="switch", label="是否场地固定裁判", :on.sync="ifOneUmpire")
        select-cell(:after="true", :options="courtsOptions", :selected.sync="courtSelected", v-if="!ifOneUmpire")
          span(slot="header") 裁判
    dialog(v-show="editDialogShow", type="confirm", title="队列变更", confirm-button="确认", cancel-button="取消", @weui-dialog-confirm="editDialogConfirm", @weui-dialog-cancel="dialogCancel")
      cells(type="split")
        link-cell
          span(slot="header") 选手
          span(slot="footer") {{teamsInEditing}}
        select-cell(:after="true", :options="courtsOptions", :selected.sync="courtSelected")
          span(slot="header") 场地
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
      // return AV.Cloud.run('tournamentRealtime', {
      //   method: 'getPreparingMatches',
      //   tournamentObjId: query.main,
      //   subTournamentObjId: query.sub
      // }).then(ret => {
      //   this.preparingMatches = ret
      // })
      const uri = `https://birdie2.wilddogio.com/tournaments/${query.main}/subTournaments/${query.sub}`
      var ref = new Wilddog(uri)
      return ref.on('value', (snapshot) => {
        snapshot.forEach(data => {
          var key = data.key()
          var val = data.val()
          if (key === 'groups') {
            this.groups = val
          }
          if (key === 'playoffs') {
            this.playoffs = val
          }
          if (key === 'queue') {
            this.queue = val
          }
          if (key === 'courts') {
            this.courts = val
            this.addOthersUserObj(val.map(el => el.umpire))
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
      preparingMatches: [],
      dialogShow: false,
      editDialogShow: false,
      teamsInEditing: '',
      selected: '',
      queue: {},
      groups: [],
      courts: [],
      courtSelected: '',
      ifOneUmpire: false
    }
  },
  computed: {
    preparingMatchesOptions () {
      var preparingMatches = _.flatten(this.groups.map((el, groupIndex) => {
        return el.matches.map((el, matchIndex) => {
          if (el.state === 'preparing') {
            return {
              text: el.teams.map(el => el.nickname).join(' vs '),
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
        var {stage, courtIndex} = val
        if (stage.stage === 'groups') {
          var match = this.groups[stage.groupIndex].matches[stage.matchIndex]
          var umpire = (_.findWhere(this.otherUserObjs, {objectId: this.courts[courtIndex].umpire}) || this.userObj).nickname
          return {
            vs: match.teams.map(el => el.nickname).join(' vs '),
            stage: `第${stage.groupIndex + 1}组 第${stage.matchIndex + 1}场`,
            court: this.courts[courtIndex].name,
            umpire
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
      this.teamsInEditing = this.thisQueue[index].vs
      this.editDialogShow = true
    },
    dialogConfirm () {
      const {query} = this.$route
      return AV.Cloud.run('tournamentRealtime', {
        method: 'queueUp',
        tournamentObjId: query.main,
        subTournamentObjId: query.sub,
        stage: JSON.parse(this.selected)
      }).then(ret => {
        console.log(ret)
      }).catch(err => console.log(err))
    },
    editDialogConfirm () {

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
