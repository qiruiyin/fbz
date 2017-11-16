// 用户信息存储
import * as types from '../mutation-types'
// 用户等级
// 普通用户：common，会员：member ，合伙人： partner ，梦想合伙人： dreamPartner

export default {
  state: {
    img: '', // 头像
    name: '', // 姓名
    hasPayPwd: 0, // 0 没有，1有 是否设置支付密码
    level: '', // 等级
    levelName: '', // 等级名字
    userId: '', // 用户关键词
    openId: '', // 用户微信生成的openId
    mobile: '', // 用户电话
    idcard: '', // 身份证号
    wxAccount: '', // 微信账号
    qrcode: "", // 二维码
    hasMsg: '',
    pay: false, // 是否可支付
    shareImg: "", // 分享二维码
    randomNum: '', // 访问记录随机数
    ticketsCount: 0, // 门票数
    voucherAmount: 0, // 抵用券
    walletAmount: 0, // 奖学金
    integralAmount: 0, // 积分
  },
  mutations: {
    updateUserImg (state, payload) {
      state.img = payload.img
    },
    updateUserName (state, payload) {
      state.name = payload.name
    },
    updateUserHasPayPwd (state, payload) {
      state.hasPayPwd = payload.hasPayPwd
    },
    updateUserLevel (state, payload) {
      state.level = payload.level
    },
    updateUserLevelName (state, payload) {
      state.levelName = payload.levelName
    },
    updateUserOpenId (state, payload) {
      state.openId = payload.openId
    },
    updateUserUserId (state, payload) {
      state.userId = payload.userId
    },
    updateUserMobile (state, payload) {
      state.mobile = payload.mobile
    },
    updateUserIdCard (state, payload) {
      state.idcard = payload.idcard
    },
    updateUserWxAccount (state, payload) {
      state.wxAccount = payload.wxAccount
    },
    updateUserQrcode (state, payload) {
      state.qrcode = payload.qrcode
    },
    updateUserPay (state, payload) {
      state.pay = payload.pay
    },
    updateUserHasMsg (state, payload) {
      state.hasMsg = payload.hasMsg
    },
    updateUserShareImg (state, payload) {
      state.shareImg = payload.shareImg
    },
    updateUserRandomNum (state, payload) {
      state.randomNum = payload.randomNum
    },
    updateUserTicketsCount (state, payload) {
      state.ticketsCount = payload.ticketsCount
    },
    updateUserVoucherAmount (state, payload) {
      state.voucherAmount = payload.voucherAmount
    },
    updateUserWalletAmount (state, payload) {
      state.walletAmount = payload.walletAmount
    },
    updateUserIntegralAmount (state, payload) {
      state.integralAmount = payload.integralAmount
    },

  }
}
