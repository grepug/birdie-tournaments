<template lang="jade">
div
  navbar-view
    .left
      a.link(href="javascript:;", @click="back") 返回
    .center 赛事详情
    .right
      a.link(href="javascript:;", @click="edit", v-if="!editState") 编辑
      a.link(href="javascript:;", @click="edit", v-if="editState") 完成
  main
    cells(v-if="!$route.query.edit")
      cell()
        span(slot="body") 赛事名
        span(slot="footer", v-text="thisTournament.name")
      cell()
        span(slot="body") 地点
        span(slot="footer", v-text="thisTournament.location")
      cell()
        span(slot="body") 开始时间
        span(slot="footer", v-text="nicetime({date: thisTournament.startAt}).get('Y-M-d H:i')")
      .description(v-text="thisTournament.description")
    cells(type="form", v-if="$route.query.edit")
      input-cell(type="text", label="赛事名", placeholder="请输入赛事名", :value.sync="thisTournament.name")
      input-cell(type="text", label="地点", placeholder="请输入地点", :value.sync="thisTournament.location")
      //- input-cell(type="date", label="开始时间", placeholder="请输入开始时间", :value.sync="nicetime(thisTournament.startAt).get('Y-M-d')")
      input-cell(type="textarea", placeholder="请输入赛事说明", :maxlength="1000", :value.sync="thisTournament.description")
    cells-title 子赛事
      cells(type="access")
        cell(v-for="(index, el) in subTournaments", @click="go(index)")
          span(slot="body", v-text="el.name")
          span(slot="footer") 报名截止{{nicetime({date: el.signUpDue}).get('Y-M-d')}}
</template>

<script>
  import {
    navbarView
  } from '../../components'
  import {
    Cells,
    Cell,
    CellsTitle,
    InputCell
  } from 'vue-weui'
  import AV from '../../js/AV'
  import _ from 'underscore'
  import {addChairUmpiredTournaments} from '../../vuex/actions/tournaments'
  import nicetime from '@grepug/nicetime'

  export default {
    components: {
      navbarView,
      Cells,
      Cell,
      CellsTitle,
      InputCell
    },
    vuex: {
      getters: {
        myChairUmpiredTournaments: ({tournaments}) => tournaments.chairUmpiredTournaments
      },
      actions: {
        addChairUmpiredTournaments
      }
    },
    data () {
      return {
        editState: false
      }
    },
    computed: {
      thisTournament () {
        if (!this.myChairUmpiredTournaments.length) return []
        return _.findWhere(this.myChairUmpiredTournaments, {objectId: this.$route.query.main})
      },
      subTournaments () {
        if (!this.myChairUmpiredTournaments.length) return []
        return _.findWhere(this.myChairUmpiredTournaments, {objectId: this.$route.query.main}).subTournaments
      }
    },
    methods: {
      back () {
        window.history.back()
      },
      go (index) {
        this.$router.go({
          path: '/chairUmpire/tournament/subTournament',
          query: _.extend(this.$route.query, {
            sub: this.subTournaments[index].objectId
          })
        })
      },
      edit () {
        if (this.editState) {
          var {name, location, description} = this.thisTournament
          AV.Cloud.run('tournament', {
            method: 'edit',
            name,
            location,
            description
          }).then(ret => {
            console.log(ret)
          }).catch(err => console.log(err))
        }
        this.editState = !this.editState
      },
      nicetime
    },
    ready () {
      window.vm = this
      if (!this.myChairUmpiredTournaments.length) this.addChairUmpiredTournaments()
    }
  }
</script>

<style media="screen">
  .description {
    padding: 10px 15px;
    border-top: 1px solid #d9d9d9;
  }
</style>
