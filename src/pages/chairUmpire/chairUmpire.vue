<template lang="jade">
div
  navbar-view
    .left
      a.link(href="javascript:;", @click="back") 返回
    .center 主裁判
    .right
      a.link(href="javascript:;")
  main
    mt-cell(is-link="", v-link="{path: '/chairUmpire/tournament', query: {main: el.objectId}}", v-for="el in myChairUmpiredTournaments")
      span(slot="title") {{el.name}}
</template>

<script>
  import {
    navbarView
  } from '../../components'
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
    methods: {
      back () {
        window.history.back()
      }
    },
    ready () {
      window.vm = this
      this.addChairUmpiredTournaments()
    }
  }
</script>
