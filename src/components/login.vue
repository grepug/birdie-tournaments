<template lang="jade">
  div
    navbar-view
      .left
        a.link(v-link="'/'")
          i.fa.fa-arrow-left
      .center 登录
      .right
    main
      form
        ul
          li
            .item-content
              .item-media
                i.fa.fa-user
              .item-inner.with-button
                .item-title 手机号
                .item-input
                  input(type="tel", placeholder="手机号", v-model="phone")
                .item-button
                  button(type="button", @click="getValiCode()") {{getValiCodeText}}
          li
            .item-content
              .item-media
                i.fa.fa-user
              .item-inner
                .item-title 验证码
                .item-input
                  input(type="tel", placeholder="验证码", v-model="valicode")
        .content-block
          .button-block
            a.button.center(href="javascript:;", @click="login()") 登录
            a.button.center(href="javascript:;", @click="login('wx')") 微信登录

</template>

<style lang="less">
  @import "../less/_colors-vars.less";
  @import "../less/_mixins.less";
  * {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-touch-callout: none;
  }
  main {
    margin-top: 5rem;
  }
  input {
    outline: 0;
    appearance: none;
    box-sizing: border-box;
    border: none;
    background: none;
    border-radius: 0 0 0 0;
    box-shadow: none;
    display: block;
    padding: 0px;
    margin: 0;
    width: 100%;
    height: 43px;
    color: #000;
    font-size: 17px;
    font-family: inherit;
  }

  .content-block {
    margin-top: 2rem;
    .button-block {
      a.button {
        text-decoration: none;
        line-height: 1rem;
        text-align: center;
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        display: block;
        margin: 0 auto;
        color: #fff;
        background-color: @themeColor;
      }
      a.button.center {
        width: 50%;
      }
      a.button + a.button {
        margin-top: 1rem;
      }
    }
  }
  form {
    ul li {
      position: relative;
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        background-color: darken(#fff, 10%);
        height: 1px;
        width: 100%;
      }
      .item-content {
        > div {
          display: inline-block;
        }
        .item-media {
          width: 10%;
          text-align: center;
        }
        .item-inner {
          width: 90%;
          position: relative;
          > div {
            display: inline-block;
          }
          .item-title {
            width: 20%
          }
          .item-input {
            width: 80%;
            input {
              width: 95%;
            }
          }
        }
        .item-inner.with-button {
          .item-input {
            width: 50%;
            input {
              width: 100%;
            }
          }
          .item-button {
            width: 30%;
            button {
              width: 100%;
              font-size: 0.9rem;
              color: lighten(#000, 10%);
              outline: 0;
              border: 0;
              background-color: #fff;
            }
          }
        }
      }
      a.button-block {
        text-decoration: none;
        display: block;
        width: 100%;
        text-align: center;
        line-height: 2.5rem;
        height: 2.5rem;
      }
    }
    ul > li.button {
      margin-top: 2rem;
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        background-color: darken(#fff, 10%);
        height: 1px;
        width: 100%;
      }
    }
  }
</style>

<script>
  import navbarView from '../components/navbar'

  var counting = false

  export default {
    components: {
      navbarView
    },
    data () {
      return {
        getValiCodeText: '获取验证码'
      }
    },
    props: {
      valicode: {
        type: String
      },
      phone: {
        type: String
      }
    },
    methods: {
      getValiCode () {
        var counter = 5
        var timer
        if (!counting) {
          this.$dispatch('on-getvalicode')
          counting = true
          this.getValiCodeText = `剩余${counter--}秒`
          timer = setInterval(() => {
            this.getValiCodeText = `剩余${counter--}秒`
            if (counter < 0) {
              clearInterval(timer)
              counting = false
              this.getValiCodeText = '获取验证码'
            }
          }, 900)
        }
      },
      login (method) {
        this.$dispatch('on-login', method)
      }
    }
  }
</script>
