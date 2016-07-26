<template lang="jade">
div
  navbar-view
    .left
      a.link(href="javascript:;", @click="back") 返回
    .center 实时得分
    .right
      a.link(href="javascript:;")
  main
    .scores
      div(v-for="(index, el) in scores", track-by="$index")
        span.player {{players[index]}}
        span.score {{el}}

</template>

<script>
  import {
    navbarView
  } from '../components'
  import Wilddog from '../../node_modules/wilddog/lib/wilddog-node'
  import {addOthersUserObj} from '../vuex/actions/user'
  import {getUserObj} from '../js/methods'

  export default {
    components: {
      navbarView
    },
    route: {
      data () {
        var ref = new Wilddog(`https://birdie2.wilddogio.com/tournaments/5795c4e4c4c97100541d00d9/subTournaments/5795c4e31532bc0060d3f894/queue/${this.$route.query.key}`)
        return ref.on('value', (snapshot) => {
          snapshot.forEach(data => {
            var key = data.key()
            var val = data.val()
            console.log(key)
            if (key === 'lastSnapshot') {
              this.lastSnapshot = val
            }
            if (key === 'stage') {
              this.teams = val.teams
              this.addOthersUserObj(val.teams)
            }
          })
        })
      }
    },
    vuex: {
      getters: {
        otherUserObjs: ({user}) => user.userObjs
      },
      actions: {
        addOthersUserObj
      }
    },
    data () {
      return {
        lastSnapshot: [],
        teams: []
      }
    },
    computed: {
      scores () {
        return this.lastSnapshot.scores
      },
      players () {
        return this.teams.map(el => {
          return this.getUserObj(el)[0].nickname
        })
      }
    },
    methods: {
      getUserObj
    },
    ready () {
      window.vm = this
    }
  }
</script>

<style lang="less">
  .scores {
    font-size: 15rem;
    text-align: center;
    .player {
      font-size: 8rem;
      margin-right: 10rem;
    }
  }
</style>
