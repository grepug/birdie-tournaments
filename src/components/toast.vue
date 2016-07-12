<template lang="jade">
  .toast(style="visibility: hidden; display: none;")
    .text {{text}}
</template>

<script>
  export default {
    props: {
      text: {
        type: String
      }
    },
    ready () {
      this.$watch('text', function (x, y) {
        if (x) {
          var _toast = window.document.querySelector('.toast')
          var winWidth = window.document.querySelector('body').offsetWidth
          var toastWidth
          var left
          _toast.style.display = 'block'
          toastWidth = _toast.offsetWidth
          left = (winWidth - toastWidth) / 2
          _toast.style.left = left + 'px'
          _toast.style.visibility = 'visible'
          setTimeout(() => {
            _toast.style.visibility = 'hidden'
            _toast.style.display = 'none'
            this.text = ''
          }, 1500)
        }
      })
    }
  }
</script>

<style lang="less", scoped>
  .toast {
    position: fixed;
    background-color: #666;
    border-radius: 5px;
    color: #fff;
    bottom: 20%;
    .text {
      padding: 0.4rem;
    }
  }
</style>
