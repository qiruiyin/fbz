// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store'
import router from './router'
import App from './App'
import myFilter from './filter'
import wordBook from './commons/wordBook'
import hold from 'src/commons/hold'

import qs from 'qs'
Vue.prototype.qs = qs

// 很重要！！！这里不是直接引入jsencrypt
import JsEncrypt from 'jsencrypt/bin/jsencrypt'
// 将jsencrypt压入到Vue
Vue.prototype.$jsEncrypt = JsEncrypt

import VideoPlayer from 'vue-video-player'
Vue.use(VideoPlayer)

import commonFun from './commons'
// 微信签名
import weixinFun from './commons/weixin.js'

import { AjaxPlugin } from 'vux'
Vue.use(AjaxPlugin)

import  { ConfirmPlugin } from 'vux'
Vue.use(ConfirmPlugin)

import  { ToastPlugin } from 'vux'
Vue.use(ToastPlugin)

import  { AlertPlugin } from 'vux'
Vue.use(AlertPlugin)

// 微信
import { WechatPlugin } from 'vux'
Vue.use(WechatPlugin)

// Vue.http.defaults.timeout = 10000;                        //响应时间
Vue.http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';           //配置请求头
// Vue.http.defaults.headers.post['Content-Type'] = 'application/raw';           //配置请求头
// Vue.http.defaults.baseURL = '';

// 清楚缓存
// window.localStorage.clear()

// // // 自己
// window.sessionStorage.setItem("openId", "o7ox6wnFTVcg2NCcHM4PvWcCqW0c");

// // // 马一鸣
// window.sessionStorage.setItem("openId", "o5fuYwpjOLBaqApUC4v_UIX8r7K4");
// // // 陈双胜
// window.sessionStorage.setItem("openId", "o5fuYwrkyKmu6uzgJUpKxfA5ECcw");
// // // 刁伟
// window.sessionStorage.setItem("openId", "o5fuYwoLmTybBPv8zeI4p2fnvxfI");
// // // 张鑫
// window.sessionStorage.setItem("openId", "o5fuYwsxQD5Cns-wbwf9bPNRo3gQ");

// 杨锐
// window.sessionStorage.setItem("openId", "o5fuYwpRqai6-U_BLqc2_1ECGg0U");

// 未绑定用户的openId
// window.sessionStorage.setItem("openId", "o7ox6woUOUK2W6kj35pdVjt9ckuA");
// 徐峰
// window.sessionStorage.setItem("openId", "o7ox6wjaIDrlSQPxQhp5VDAuMzFU");

// amy
// window.sessionStorage.setItem("openId", "o7ox6wpXoS-DS1DKZFYktNXvyZbE");

// 刁总
// window.sessionStorage.setItem("openId", "12345678");

// 点击延迟
// const FastClick = require('fastclick')
// FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
