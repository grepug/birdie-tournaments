import AV from 'avoscloud-sdk'

const config = {
  appid: 'SXHKYLU066nSzpRhnqNoLK7v-gzGzoHsz',
  appsecret: '2opqk8qfC8OIOJs8A6dBpNUL'
}

// AV.init({appId: config.appid, appKey: config.appsecret})
AV.initialize(config.appid, config.appsecret)

window.AV = AV

AV.serverURL = 'http://localhost:3000'
// AV.serverURL = 'http://grepug.vip.natapp.cn'

export default AV
