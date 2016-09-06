<template lang="jade">
  div
    navbar-view
      .left
        a.link(href="javascript:;", @click="back") 返回
      .center(v-text="title")
      .right
        a.link(href="javascript:;", @click="create") 创建
    main
      .main-tournament(v-if="$route.query.sub !== 'yes'")
        cells(type="form")
          input-cell(type="text", label="赛事名", placeholder="请输入赛事名", :value.sync="name")
          input-cell(type="text", label="地点", placeholder="请输入地点", :value.sync="location")
          input-cell(type="date", label="开始时间", placeholder="请输入开始时间", :value.sync="startAt")
          input-cell(type="tel", label="主裁判", placeholder="请输入主裁判手机号", :value.sync="chairUmpirePhone")
          input-cell(type="textarea", placeholder="请输入赛事说明", :maxlength="400", :value.sync="description")
        .create-sub
          cells-title 添加子赛事
          cells(type="form")
            input-cell(type="text", label="子赛事名", placeholder="请输入赛事名", :value.sync="subName")
            select-cell(:after="true", :options="disciplineOptions", :selected.sync="disciplineSelected")
              span(slot="header") 项目
            select-cell(:after="true", :options="tournamentSys", :selected.sync="tournamentSysSelected")
              span(slot="header") 赛制
            select-cell(:after="true", :options="teamsMax", :selected.sync="teamsMaxSelected")
              span(slot="header") 人数上限
            select-cell(:after="true", :options="bestOf", :selected.sync="bestOfSelected")
              span(slot="header") 局数
            select-cell(:after="true", :options="['21', '11', '15']", :selected.sync="scoringSysSelected")
              span(slot="header") 得分制
            input-cell(type="textarea", placeholder="请输入子赛事说明", :maxlength="200", :value.sync="subDescription")
          .buttons
            a.button(href="javascript:;", @click="addSubTournament") 添加子赛事
            a.button.bubble(href="javascript:;", v-link="{query: {sub: 'yes'}}")
              span(v-text="subTournaments.length", v-show="subTournaments.length")
              | 查看子赛事
      toast-view(:text="toastText")
      .sub-tournaments(v-if="$route.query.sub === 'yes'")
        cells-title 子赛事
        .sub(v-for="(index, el) in subTournaments")
          cells(type="access")
            link-cell(link="javascript:;", @click="del(index)")
              span(slot="body", v-text="el.name")
              span(slot="footer", v-text="el.discipline")


</template>

<script>
  import {
    navbarView,
    toastView
  } from '../../components'
  import {
    Cells,
    InputCell,
    Button,
    CellsTitle,
    SelectCell,
    LinkCell
  } from 'vue-weui'
  import AV from '../../js/AV'
  import {int, trim} from '../../js/utils'

  export default {
    components: {
      navbarView,
      toastView,
      Cells,
      InputCell,
      CellsTitle,
      SelectCell,
      LinkCell,
      'weui-button': Button
    },
    data () {
      return {
        toastText: '',
        name: '',
        location: '',
        startAt: '',
        chairUmpirePhone: '',
        description: '',
        subName: '',
        subTournaments: [],
        disciplineOptions: [{text: '男子单打', value: 'ms'}, {text: '双打', value: 'd'}],
        disciplineSelected: 'ms',
        tournamentSys: [{text: '淘汰赛', value: 'singleElimination'}, {text: '小组循环后淘汰', value: 'group'}, {text: '天梯积分赛', value: 'ladder'}, {text: '团体赛', value: 'bigTeam'}],
        tournamentSysSelected: 'singleElimination',
        bestOf: [{text: '三局两胜', value: '3'}, {text: '一局一胜', value: '1'}, {text: '五局三胜', value: '5'}],
        scoringSysSelected: '21',
        teamsMax: [{text: '无上限', value: 'none'}, {text: '8人', value: '8'}, {text: '16人', value: '16'}, {text: '32人', value: '32'}],
        teamsMaxSelected: 'none',
        bestOfSelected: '3',
        subDescription: ''
      }
    },
    computed: {
      title () {
        if (this.$route.query.sub === 'yes') return '子赛事'
        return '创建赛事'
      }
    },
    methods: {
      addSubTournament () {
        this.subTournaments.push({
          name: trim(this.subName),
          discipline: trim(this.disciplineSelected),
          teamsMax: int(this.teamsMaxSelected),
          tournamentSys: this.tournamentSysSelected,
          bestOf: int(this.bestOfSelected),
          scoringSys: int(this.scoringSysSelected),
          description: trim(this.subDescription)
        })
        this.toastText = '添加成功'
      },
      create () {
        // validation here
        AV.Cloud.run('tournament', {
          method: 'create',
          name: this.name,
          location: this.location,
          startAt: this.startAt,
          description: this.description,
          subTournaments: this.subTournaments,
          chairUmpirePhone: this.chairUmpirePhone
        })
        .then(ret => console.log(ret))
        .catch(err => console.log(err))
      },
      back () {
        window.history.back()
      },
      del (index) {
        console.log(index)
        return
      }
    },
    ready () {
      window.vm = this
    }
  }
</script>

<style lang="less">
  .weui_select_after .weui_select {
    padding-left: 15px;
  }
  .buttons {
    width: 100%;
    text-align: center;
    margin-top: 1rem;
    .button {
      display: inline-block;
      width: 25%;
      border: 1px solid;
      margin-right: 1rem;
    }
    .button.bubble {
      position: relative;
      span {
        position: absolute;
        right: -0.7rem;
        bottom: 1rem;
        background-color: red;
        color: #fff;
        border-radius: 50%;
        padding: 0 5px;
        font-size: 0.8rem;
      }
    }
  }
</style>
