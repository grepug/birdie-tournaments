import Vue from 'vue'
import Router from 'vue-router'
import routerConfig from './routerConfig'
import fastclick from 'fastclick'
import store from './vuex/store'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.use(Router)
Vue.use(Mint)

fastclick.attach(document.body)

// create router
var router = new Router({
})

routerConfig(router)

router.start(Vue.extend({store}), '#app')
