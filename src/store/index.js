import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import loadbar from './modules/loadbar'
import common from './modules/common'
import direction from './modules/direction'
import user from './modules/user'
import msg from './modules/msg'
import nav from './modules/nav'
import cart from './modules/cart'
import ticket from './modules/ticket'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  modules: {
  	loadbar,
  	common,
    direction,
    user,
    msg,
    nav,
    cart,
    ticket
    // cart,
    // products
  },
  strict: debug
  // plugins: debug ? [createLogger()] : []
})
