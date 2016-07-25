<template lang="jade">
div
  navbar-view
    .left
      a.link(href="javascript:;", @click="back") 返回
    .center 开始比赛
    .right
      a.link(href="javascript:;", @click="start") 开始
  toast(type="loading", v-show="$loadingRouteData") 加载中...
  main(v-if="!$loadingRouteData")
    cells-title 场地设置
    template(v-for="(index, el) in court", track-by="$index")
      cells(type="form")
        input-cell(type="text", label="场地名称", placeholder="请输入场地名称，如1号场地", :value.sync="court[index].name")
        select-cell(:after="true", :options="umpireOptions", :selected.sync="court[index].umpireSelected")
          span(slot="header") 裁判
    .buttons
      a.button(@click="addCourt", href="javascript:;") 添加场地
</template>

<script>
  import {
    navbarView
  } from '../../components'
  import {
    Cells,
    InputCell,
    CellsTitle,
    SelectCell,
    Toast
  } from 'vue-weui'
  import _ from 'lodash'
  import {addChairUmpiredTournaments} from '../../vuex/actions/tournaments'
  import {addOthersUserObj} from '../../vuex/actions/user'

  export default {
    components: {
      navbarView,
      Cells,
      InputCell,
      CellsTitle,
      SelectCell,
      Toast
    },
    route: {
      data () {
        return this.addChairUmpiredTournaments()
        .then(ret => {
          return this.addOthersUserObj(ret)
        })
      }
    },
    vuex: {
      getters: {
        myChairUmpiredTournaments: ({tournaments}) => tournaments.chairUmpiredTournaments,
        otherUserObjs: ({user}) => user.userObjs,
        userObj: ({user}) => user.userObj
      },
      actions: {
        addOthersUserObj,
        addChairUmpiredTournaments
      }
    },
    computed: {
      subTournament () {
        if (!this.myChairUmpiredTournaments.length) return {}
        var {query} = this.$route
        var r = _.find(this.myChairUmpiredTournaments, {objectId: query.main})
        return _.find(r.subTournaments, {objectId: query.sub})
      },
      umpireOptions () {
        if (!this.myChairUmpiredTournaments.length) return []
        return [{text: '请选择', value: ''}].concat(this.subTournament.umpires.map(el => {
          var r = _.find(this.otherUserObjs, {objectId: el}) || this.userObj
          return {
            text: r.nickname,
            value: el
          }
        }))
      }
    },
    data () {
      return {
        courtsNum: '',
        court: [{name: '', umpireSelected: ''}, {name: '', umpireSelected: ''}, {name: '', umpireSelected: ''}]
      }
    },
    methods: {
      back () {
        window.history.back()
      },
      addCourt () {
        this.court.push({name: '', umpireSelected: ''})
      },
      start () {
        return
      }
    },
    ready () {
      window.vm = this
    }
  }
</script>
