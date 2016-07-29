<template lang="jade">
div
  navbar-view
    .left
      a.link(href="javascript:;", @click="back") 返回
    .center 设置场地
    .right
      a.link(href="javascript:;", @click="save") 保存
  toast(type="loading", v-show="$loadingRouteData") 加载中...
  toast(v-show="saveSuccessfullToastShow") 保存成功
  main(v-if="!$loadingRouteData")
    cells-title 场地设置
    template(v-for="(index, el) in courts", track-by="$index")
      cells(type="form")
        input-cell(type="text", label="场地名称", placeholder="请输入场地名称，如1号场地", :value.sync="courts[index].name")
        select-cell(:after="true", :options="umpireOptions", :selected.sync="courts[index].umpire")
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
  import AV from '../../js/AV'
  import {toArray} from '../../js/utils'
  import {getUserObj} from '../../js/methods'
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
        }).then(ret => {
          return AV.Cloud.run('tournamentRealtime', {
            method: 'getCourts',
            tournamentObjId: this.$route.query.main,
            subTournamentObjId: this.$route.query.sub
          })
        }).then(ret => {
          ret = toArray(ret)
          this.courts = ret.map(el => {
            return {
              name: el.name,
              umpire: el.umpire
            }
          })
          return this.addOthersUserObj(ret.map(el => el.umpire))
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
          var r = this.getUserObj(el)[0]
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
        courts: [{name: '', umpire: ''}, {name: '', umpire: ''}, {name: '', umpire: ''}],
        saveSuccessfullToastShow: false
      }
    },
    methods: {
      back () {
        window.history.back()
      },
      addCourt () {
        this.courts.push({name: '', umpire: ''})
      },
      save () {
        return AV.Cloud.run('tournamentRealtime', {
          method: 'saveCourts',
          tournamentObjId: this.$route.query.main,
          subTournamentObjId: this.$route.query.sub,
          courts: this.courts.filter(x => x.name && x.umpire)
        }).then(ret => {
          this.saveSuccessfullToastShow = true
          window.setTimeout(() => {
            this.saveSuccessfullToastShow = false
          }, 1000)
        })
      },
      getUserObj
    },
    ready () {
      window.vm = this
    }
  }
</script>
