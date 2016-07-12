<template lang="jade">
.navbar
  .navbar-inner
    slot
      .left(@click="back()")
        i.fa.fa-arrow-left
      .center {{center}}
      .right
        i.fa.fa-arrow-right
        i.fa.fa-arrow-right
</template>

<script>
  export default {
    props: {
      center: {
        type: String
      }
    },
    data () {
      return {
        navbarAlpha: 10
      }
    },
    methods: {
      back () {
        window.history.back()
      }
    },
    ready () {
      // var didScroll = false
      // window.onscroll = doThisStuffOnScroll
      // function doThisStuffOnScroll () {
      //   didScroll = true
      // }
      // setInterval(() => {
      //   if (didScroll) {
      //     didScroll = false
      //     var a = document.body.scrollTop
      //     var rate = a / (window.innerWidth * 1.5)
      //     rate = rate > 0.9 ? 0.9 : rate
      //     this.navbarAlpha = rate
      //   }
      // }, 10)
    }
  }
</script>

<style lang="less">
@import "../less/color-vars.less";

html {
  overflow-x: hidden;
}
body {
  font-family: Roboto, Noto, Helvetica, Arial, sans-serif;
  overflow-x: hidden;
  position: relative;
  #app {
    overflow-x: hidden;
    main {
      // margin-top: 50px;
    }
  }
}
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 3.2rem;
  line-height: 3.2rem;
  background-color: #0c6;
  color: #fff;
  .navbar-inner {
    padding: 0 1rem;
    > div {
      display: inline-block;
      width: 33%;
    }
    .center {
      text-align: center;
      font-size: 1.2rem;
    }
    .right {
      text-align: right;
      a {
        margin-right: 1rem;
        font-size: 1.1rem;
        &:last-child {
          margin-right: 0
        }
      }
    }
  }
  a.link {
    text-decoration: none;
    color: #fff;
    padding: 0.3rem;
  }
}
</style>
