import Vue from 'vue'
import store from '../store'
import wordBook from './wordBook'
import hold from './hold'
import qs from 'qs'

import { AjaxPlugin } from 'vux'
Vue.use(AjaxPlugin)

import { WechatPlugin } from 'vux'
Vue.use(WechatPlugin)

// 微信分享
Vue.prototype.openShare = () => {
	Vue.http.post("/api/wechat/createQRcode",
		qs.stringify({
			openId: store.state.user.openId
		})).then(function(e) {
			store.commit("updateUserShareImg", { 'shareImg': e.data.data.qrCodeUrl + "?time=" + Date.parse(new Date())})
	});
}

// 微信签名
Vue.prototype.signUrl = (url, status = false, obj = {}) => {
	store.commit("updateUserPay", { 'pay': false})
	
	Vue.wechat.hideOptionMenu();
	Vue.wechat.hideAllNonBaseMenuItem();

  Vue.http.post("/api/wechat/sign", qs.stringify({url: url})).then(function(e) {
  	let data = e.data.data.signature;
  	
  	if(data.status != 0){
			return false;
		}

		store.commit("updateUserPay", { 'pay': true});

		Vue.wechat.config({
			debug : false,
			appId : data.signature.appId,
			timestamp : data.signature.timestamp,
			nonceStr : data.signature.nonceStr,
			signature : data.signature.signature,
			// jsApiList : [ 'onMenuShareTimeline', 'onMenuShareAppMessage', 'showMenuItems', 'hideOptionMenu', 'showOptionMenu', 'hideAllNonBaseMenuItem', 'closeWindow' ]
		});

		Vue.wechat.ready(function() {
			Vue.wechat.checkJsApi({
				// jsApiList : [ 'onMenuShareTimeline', 'onMenuShareAppMessage', 'showMenuItems', 'hideOptionMenu', 'showOptionMenu', 'hideAllNonBaseMenuItem', 'closeWindow' ]
			});
		});
		
		Vue.wechat.error(function(res) {
			if(res.err_msg){
				alert(res.err_msg);
			}
		});

		if(!status) {
			Vue.prototype.openShare()
		}
  });
}


