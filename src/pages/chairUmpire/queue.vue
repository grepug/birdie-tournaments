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
    panel(access="")
      panel-header 即将进行
      panel-body(v-for="el in thisQueue")
        media-box(type="text")
          media-body
            media-title {{el.vs}}
            media-description 小组赛 {{el.stage}} | 场地：待定 | 裁判：待定
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
  Panel, PanelHeader, PanelBody, MediaBox, MediaBody, MediaTitle, MediaDescription
} from 'vue-weui'
import _ from 'underscore'
import AV from '../../js/AV'
import Wilddog from '../../../node_modules/wilddog/lib/wilddog-node'

export default {
  components: {
    navbarView,
    Toast,
    Dialog,
    Cells,
    SelectCell,
    LinkCell,
    CellsTitle,
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
      ref.on('value', (snapshot) => {
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
          console.log(data.key())
          console.log(data.val())
        })
      })
      return true
    }
  },
  data () {
    return {
      preparingMatches: [],
      dialogShow: false,
      selected: '',
      queue: {},
      groups: []
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
    thisQueue () {
      return _.map(this.queue, (val, key) => {
        var {stage} = val
        if (stage.stage === 'groups') {
          var match = this.groups[stage.groupIndex].matches[stage.matchIndex]
          return {
            vs: match.teams.map(el => el.nickname).join(' vs '),
            stage: `第${stage.groupIndex + 1}组 第${stage.matchIndex + 1}场`,
            court: '3号场'
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
    dialogCancel () {
      this.dialogShow = false
    }
  },
  ready () {
    window.vm = this
  }
}

</script>
