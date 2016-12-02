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
      .team-name(v-for="(index, el) in players", track-by="$index") {{el.slice(0,3)}}
    .scores
      span(v-for="(index, el) in matchScores", track-by="$index")
        .score(style="background-color: yellow") {{el}}
    .scores
      span(v-for="(index, el) in scores", track-by="$index")
        .score(:class="{'last-scored': lastSnapshot.lastScoredTeamIndex === $index}") {{el}}

</template>

<script>
  import {
    navbarView
  } from '../components'
  import Wilddog from '../../node_modules/wilddog/lib/wilddog-node'
  import {isSingle} from '../js/utils'
  import {addOthersUserObj, addDoubles} from '../vuex/actions/user'
  import {getUserObj, getDoublesObj} from '../js/methods'

  export default {
    components: {
      navbarView
    },
    route: {
      data () {
        var sub
        if (this.$route.query.sub === 's') sub = '57ecc86a816dfa0056689342'
        else sub = '57ecc86a816dfa0056689343'
        console.log(sub)
        var ref = new Wilddog(`https://birdie2.wilddogio.com/tournaments/57ecc86a5bbb50005bd759d9/subTournaments/${sub}/queue/${this.$route.query.key}`)
        return ref.on('value', (snapshot) => {
          snapshot.forEach(data => {
            var key = data.key()
            var val = data.val()
            console.log(key)
            if (key === 'lastSnapshot') {
              this.lastSnapshot = val
            }
            if (key === 'stage') {
              console.log(val.teams)
              this.teams = val.teams
              if (isSingle(this.$route.query.sub)) {
                this.addOthersUserObj(this.teams)
              } else {
                this.addDoubles(this.teams)
                .then(ret => this.addOthersUserObj(ret))
              }
            }
            if (key === 'matchSettings') {
              this.isSingle = isSingle(val.discipline)
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
        addOthersUserObj,
        addDoubles
      }
    },
    data () {
      return {
        lastSnapshot: [],
        teams: [],
        isSingle,
        key: ''
      }
    },
    computed: {
      scores () {
        return this.lastSnapshot.scores
      },
      matchScores () {
        return this.lastSnapshot.matchScores
      },
      players () {
        if (this.isSingle) {
          return this.teams.map(el => {
            return this.getUserObj(el)[0].nickname
          })
        }
        return this.teams.map(el => {
          return this.getDoublesObj(el)[0].players.map(el => this.getUserObj(el)[0].nickname).join('/')
          // return this.getDoublesObj(el)[0].players.map(el => this.getUserObj())
        })
      }
    },
    methods: {
      getUserObj,
      getDoublesObj
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
    display: inline-block;
    width: 25%;
    .player {
      font-size: 8rem;
      margin-right: 10rem;
    }
  }
  .team-name {
    font-size: 3rem;
    line-height: 25rem;
  }
  .last-scored {
    background-color: red;
  }
</style>
