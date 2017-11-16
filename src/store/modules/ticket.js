// 课程抵用券的使用情况
import * as types from '../mutation-types'

export default {
  state: {
    num: 0
  },
  mutations: {
    updateTicketNum (state, payload) {
      state.num = payload.num
    }
  }
}
