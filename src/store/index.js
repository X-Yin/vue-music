import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

vue.use(Vuex)
const debug = process.env.NONE_ENV !== 'production'
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
