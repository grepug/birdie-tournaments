<template lang="jade">
  div
    login-view(@on-getvalicode="getValiCode", @on-login="login", :phone.sync="phone", :valicode.sync="valicode")
</template>

<script>
  import loginView from '../components/login'
  import AV from '../js/AV'
  import vali from '../js/validate'
  import cookie from 'js-cookie'

  export default {
    components: {
      loginView
    },
    data () {
      return {
        phone: '',
        valicode: ''
      }
    },
    methods: {
      getValiCode () {
        if (!vali().phone(this.phone)) return console.log('手机号格式不对')
        AV.Cloud.requestSmsCode(this.phone).then(function (ret) {
          console.log('验证码发送成功')
        }).catch(function (err) {
          console.log(err)
        })
      },
      login (method) {
        console.log(this.$log('phone'))
        switch (method) {
          case 'wx':
            break
          default:
            // if (!vali().phone(this.phone)) return console.log('手机号格式不对')
            // if (!vali().veriCode(this.valicode)) return console.log('验证码格式不对')
            // AV.User.signUpOrlogInWithMobilePhone(this.phone, this.valicode).then(function (ret) {
            //   console.log('登录成功')
            // }).catch(function (err) {
            //   console.log(err)
            // })
            AV.User.logInWithMobilePhone(this.phone, this.valicode).then(function (ret) {
              var cookieInfo = cookie.get('wx_userinfo')
              if (cookieInfo) {
                var userinfo = JSON.parse(cookie.get('wx_userinfo').slice(2))
                return ret.save({
                  openid: userinfo.openid,
                  nickname: userinfo.nickname,
                  headimgurl: userinfo.headimgurl,
                  sex: userinfo.sex
                }).then(function () {
                  window.location.reload()
                })
              } else {
                window.location.reload()
              }
            }).catch(function (err) {
              console.log(err)
            })
            break
        }
      }
    }
  }

</script>
