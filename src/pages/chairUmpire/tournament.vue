<template lang="jade">
div
  navbar-view
    .left
      a.link(href="javascript:;", @click="back") 返回
    .center 赛事
    .right
      a.link(href="javascript:;")
  main
    mt-cell(is-link="", @click="go(index)", v-for="(index, el) in subTournaments")
      span(slot="title") {{el.name}}
</template>

<script>
  import {
    navbarView
  } from '../../components'
  import _ from 'underscore'
  import {addChairUmpiredTournaments} from '../../vuex/actions/tournaments'

  export default {
    components: {
      navbarView
    },
    vuex: {
      getters: {
        myChairUmpiredTournaments: ({tournaments}) => tournaments.chairUmpiredTournaments
      },
      actions: {
        addChairUmpiredTournaments
      }
    },
    computed: {
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
      }
    },
    ready () {
      window.vm = this
      if (!this.myChairUmpiredTournaments.length) this.addChairUmpiredTournaments()
    }
  }
</script>
