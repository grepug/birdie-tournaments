import AV from './js/AV'
import store from './vuex/store'

export default function (router) {
  router.map({
    '/': {
      component: require('./App')
    },
    '/login': {
      component: require('./pages/login')
    },
    '/chairUmpire': {
      component: require('./pages/chairUmpire/chairUmpire')
    },
    '/chairUmpire/tournament': {
      component: require('./pages/chairUmpire/tournament')
    },
    '/chairUmpire/tournament/subTournament': {
      component: require('./pages/chairUmpire/subTournament')
    },
    '/chairUmpire/tournament/subTournament/signUpMembers': {
      name: 'chairUmpireSignUpMembers',
      component: require('./pages/chairUmpire/signUpMembers')
    },
    '/chairUmpire/tournament/subTournament/viewOrders': {
      name: 'chairUmpireViewOrders',
      component: require('./pages/chairUmpire/viewOrders')
    },
    '/chairUmpire/tournament/subTournament/start': {
      name: 'chairUmpireSubTournamentStart',
      component: require('./pages/chairUmpire/start')
    },
    '/tournaments/create': {
      name: 'createTournament',
      component: require('./pages/tournament/create')
    }
  })

  router.beforeEach(function (transition) {
    var userObj = AV.User.current()
    if (!userObj) {
      if (transition.to.path !== '/login') {
        transition.redirect('/login')
      }
    } else {
      if (!userObj.get('nickname')) {
        transition.redirect('/setUserInfo')
      } else {
        store.dispatch('USERLOGED')
        store.dispatch('SET_USEROBJ', AV.User.current().toJSON())
        if (transition.to.path === '/login') {
          transition.redirect('/')
        }
      }
    }
    transition.next()
  })
}
