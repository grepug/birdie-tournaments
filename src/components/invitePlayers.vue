<template lang="jade">
  div
    .popup(v-show="isInvitePlayersPopupShow")
      navbar-view
        .left
          a.link(href="javascript:;", @click="back")
            i.fa.fa-arrow-left
        .center 邀请
        .right
          a.link(href="javascript:;", @click="confirm") 确认
      main
        .list
          cells(type="checkbox")
            checkbox-cell(:label="el.nickname", name="checkbox", :value="index + ''", :checked.sync="checked", v-for="(index, el) in list")
    toast-view(:text="toastText")
</template>

<script>
  import navbarView from './navbar'
  import toastView from '../components/toast'
  import {Cells, CheckboxCell} from 'vue-weui'
  import {getAllUsers} from '../vuex/actions/user'
  import {addMatchRoomInvitees} from '../vuex/actions/match'
  import {getMembers} from '../vuex/getters'
  import AV from '../js/AV'
  import matchRoom from '../js/matchRoomWd'

  export default {
    components: {
      navbarView,
      Cells,
      CheckboxCell,
      toastView
    },
    vuex: {
      actions: {
        getAllUsers,
        addMatchRoomInvitees
      },
      getters: {
        members: getMembers,
        roomId: (state) => state.match.matchRoomStates.roomId,
        allUsers: (state) => state.user.userObjs,
        matchRoomInvitees: (state) => state.match.matchRoomStates.invitees
      }
    },
    props: {
      isInvitePlayersPopupShow: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        toastText: ''
      }
    },
    computed: {
      list () {
        console.log(this.allUsers)
        return this.allUsers.map(el => {
          return {
            openid: el.openid,
            nickname: el.nickname,
            objectId: el.objectId
          }
        })
      },
      checked () {
        return []
      }
    },
    methods: {
      back () {
        this.isInvitePlayersPopupShow = false
      },
      confirm () {
        var invitee
        console.log(this.checked.length)
        if (!this.checked.length) return
        invitee = this.checked.map(x => {
          return {
            openid: this.list[x].openid,
            objectId: this.list[x].objectId
          }
        })
        console.log(invitee)
        AV.Cloud.run('match', {
          method: 'invite',
          roomId: this.roomId,
          invitee
        }).then(ret => {
          matchRoom.addInvitees(invitee.map(el => el.objectId), this)
          setTimeout(() => {
            this.isInvitePlayersPopupShow = false
          }, 500)
        }).catch(err => console.log(err))
      }
    },
    ready () {
      this.getAllUsers()
    }
  }
</script>

<style lang="less" scoped>
  .popup {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    z-index: 999;
    background-color: #eee;
  }
</style>
