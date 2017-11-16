import Vue from 'vue'
import router from '../router'
import store from '../store'
import hold from './hold'
import qs from 'qs'

import wordBook from './wordBook'

import { AjaxPlugin } from 'vux'
Vue.use(AjaxPlugin)

import  { ConfirmPlugin } from 'vux'
Vue.use(ConfirmPlugin)

import { WechatPlugin } from 'vux'
Vue.use(WechatPlugin)

import  { ToastPlugin } from 'vux'
Vue.use(ToastPlugin)

// 获取userCode
Vue.prototype.setRater = (data) => {
	return parseFloat(data.toFixed(1));
};

Vue.prototype.toCash = (value) => {
	// 返回处理后的值
	if(value == null || value == undefined || value == ""){
		return 0;
	} else if(value == 0) {
		return value;
	} else {
		return value.toFixed(2);
	}
}

// 获取用户信息
Vue.prototype.getUserInfo = (openId,url = "") => {
	Vue.http.post('/api/userInfo/getUserInfo',
			qs.stringify({
				"openId": openId
			})
		).then(function(e) {
			let res = e.data.data;
			if(e.data.code == 200) {
				hold.storage.set("openId", openId);
				hold.storage.set("userId", res.customerId);
				hold.storage.set("hasPayPwd", res.hasPayPwd);

				store.commit("updateUserHasPayPwd", { hasPayPwd: res.hasPayPwd });
				store.commit("updateUserOpenId", { openId: openId });
				store.commit("updateUserUserId", { userId: res.customerId });
				store.commit("updateUserImg", { img: res.headUrl });
				store.commit("updateUserIdCard", { idcard: res.idcard });
				store.commit("updateUserMobile", { mobile: res.mobile });
				store.commit("updateUserLevel", { level: res.userLevel });
				store.commit("updateUserLevelName", { levelName: res.userLevelName });
				store.commit("updateUserName", { name: res.userName });
				store.commit("updateUserWxAccount", { wxAccount: res.wxAccount });

				if(url) {
					if(url == -1) {
						router.go(-1);
					} else {
						router.push(url);
					}
				}
			} else {
				Vue.$vux.alert.show({
			    content: e.data.msg
			  });
			}
	});
};

// 删除数字
Vue.prototype.numToNull = (data) => {
	if(data) {
		return data.replace(/[0-9]*/g, "");
	} else {
		return data;
	}
};

// 经典语录内容转换
Vue.prototype.quotationTransContent = (value) => {
	if(!value) return value;
	return value.replace(/\n/g, "<br />");
}

// 图片链接拼接
Vue.prototype.resolveImg =  function(img) {
	let imgUrl = Vue.prototype.wordBook.urlLink.img;

	if(!img || img.substr(0, 4) == "http") {
		return img
	} else {
		return imgUrl + img.replace(/\\/g, '/');
	}
}

// 富文本图片链接地址处理
Vue.prototype.resolveRichTextImg = function(text) {
	let textUrl = Vue.prototype.wordBook.urlLink.richText;

	if(!text) return text;
	text = text.replace(/\ssrc=\"http/g, '-CC309AB4-89E6-44D2-9A7C-A8F33F40F3BB-');
	text = text.replace(/\ssrc=\"/g, " src=\""+ textUrl);
	text = text.replace(/\-CC309AB4\-89E6\-44D2\-9A7C\-A8F33F40F3BB\-/g, " src=\"http");
	return text;
}

// 视频链接拼接
Vue.prototype.resolveVideo =  function(video) {
	let imgUrl = Vue.prototype.wordBook.urlLink.file;

	if(!video) {
		return video
	} else {
		return videoUrl + video.replace(/\\/g, '/');
	}
}

// 处理首页通用的字段转换
Vue.prototype.resolveField =  function (_this, $obj, datas, img, link, url = "") {
	// 获取banner数据并处理
	let arr = [];

	if(datas && datas.length > 0) {
		arr = datas.map((item, i) => {
			return {
				img: Vue.prototype.resolveImg(item[img]),
				link: link,
				url: url == "" ? url : item[url],
				name: item.name,
				desc: item.description,
				price: item.price,
				code: item.code
			}
		})
	}

	_this[$obj] = arr;
}

// 判断数组中是否包含指定元素
Vue.prototype.arrContain = function(arr, obj) {
	let status = false;

	if(arr && arr.length > 0) {
		arr.map(function(item, index){
			if(item == obj) {
				status = true
				return
			}
		})
	}
	return status;
}

// 是否登录
Vue.prototype.isLogin = () => {
  if(store.state.user.level == 'common') {
		Vue.$vux.confirm.show({
	    content: '你还没有绑定用户',
	    onCancel () {
	    	return false
	    },
	    onConfirm () {
	      router.push({name: 'binding'});
	    }
	  });
  } else {
  	return true
	} 
}

// 是否设置过支付密码
Vue.prototype.isPassword = () => {
  if(store.state.user.hasPayPwd == 0) {
		Vue.$vux.confirm.show({
	    content: '您还没有设置过支付密码，确定先去设置支付密码',
	    onCancel () {
	    	return false
	    },
	    onConfirm () {
	      router.push({name: 'setPassword'});
	    }
	  });
  } else {
  	return true
	} 
}

// 登陆后页面跳转方法
Vue.prototype.goBeforeLoginUrl = () => {
  let url = hold.session.get('beforeLoginUrl')
  if(!url || url.indexOf('/author') != -1){
    router.push('/index')
  } else {
    if(url == '/'){
      url = '/index'
    }
    router.push(url)
    hold.session.set('beforeLoginUrl', '')
  }
}

// 生成随机数
Vue.prototype.createRandom = (ind) => {
  let num = "";

  for(var i = 0; i < ind; i += 1){
    num += Math.floor(Math.random() * 10);
  }
  return num;
}

// 页面路由访问记录
Vue.prototype.visitRouter = (title, url, op) => {
	// op : in 进入 out 离开
  let randomNum = store.state.user.randomNum;
  let locationOrigin = location.href.split("/#/")[0];
	if(!randomNum) {
    randomNum = Vue.prototype.createRandom(16);
    store.commit('updateUserRandomNum', {randomNum: randomNum});
  }
	Vue.http.post('/wechat/discover/addLog',
		{
			"title": title,
			"url": locationOrigin + '/#' + url,
			"randomNum": randomNum,
			"openId": store.state.user.openId,
			"op": op
		}
	).then(function(e) {

	});
}

// 商品访问统计记录
Vue.prototype.visitCount = (code, type = 0) => {
	// viewType 0产品 1头条
	Vue.http.post('/wechat/discover/addProductViewCount',
		{
			"code": code,
			"openId": store.state.user.openId,
			"viewType": type
		}
	).then(function(e) {

	});
}

// 音频视频播放记录
Vue.prototype.playCount = (code) => {
	Vue.http.post('/wechat/discover/addProductPlayCount',
		{
			"code": code,
			"openId": store.state.user.openId
		}
	).then(function(e) {

	});
}

// 创建订单 非课程订单
Vue.prototype.valiPwd = (pwd, userCode) => {

	store.commit('updateLoadingStatus', {isLoading: true});
	Vue.http.post('/wechat/order/pay/checkPwd', 
		orderInfo
		).then(function(e) {
			store.commit('updateLoadingStatus', {isLoading: false});
			if(e.data.code == 200) {
				router.push({ name: 'confirmOrder', query: { orderCode: e.data.data.orderCode, orderType: orderInfo.orderType }})
			} else {
				Vue.$vux.alert.show({
					content: e.data.msg
				})
			}
	})
}

// 创建订单 非课程订单
Vue.prototype.orderCreate = (orderInfo) => {
	// orderType : 1 课程 2 音视频 3 奖赏 4 商城
	// type == 1 商业思维多个一起报名
	// {
	// 	"userCode": _this.$store.state.user.userCode, // 用户code
	// 	"productCode": _this.courseInfo.code, // 商品code
	// 	"amount": "1", // 数量
	// 	"lessonCode": "", // 购买课程code
	// 	"orderType": "2", // orderType:1课程2音视频3奖赏4商城
	// 	"address": "", // 商城订单收货地址
	// 	"voucherAmount": "0", // 使用课程券的金额,默认传0
	// 	"allMoney": _this.list.pay // 应付金额
	// }
	store.commit('updateLoadingStatus', {isLoading: true});
	Vue.http.post('/wechat/order/create', 
		orderInfo
		).then(function(e) {
			store.commit('updateLoadingStatus', {isLoading: false});
			if(e.data.code == 200) {
				router.push({ name: 'confirmOrder', query: { orderCode: e.data.data.orderCode, orderType: orderInfo.orderType }})
			} else {
				Vue.$vux.alert.show({
					content: e.data.msg
				})
			}
	})
}


Vue.prototype.invokePay = (data, url) => {
	// let weixinConfig = {
	// 		"appId": data.appid,     //公众号名称，由商户传入     
 //     	"timeStamp": data.time_stamp,         //时间戳，自1970年以来的秒数     
 //      "nonceStr": data.nonce_str, //随机串     
 //      "package": 'prepay_id=' + data.prepay_id,     
 //      "signType": "MD5",         //微信签名方式：     
 //      "paySign": data.sign //微信签名 
	// 	};
	WeixinJSBridge.invoke(
   'getBrandWCPayRequest', data,
   function(res){
      if(res.err_msg == "get_brand_wcpay_request:ok" ) {
     		if(url != "") {
     			router.push(url);
     		} else {
     			router.go(0);
     		}
      } else if(res.err_msg == "get_brand_wcpay_request:cancel" ) {
     		router.go(0);
      } else if(res.err_msg == "get_brand_wcpay_request:fail" ) {
      	// Vue.
      	Vue.$vux.alert.show({
      		content: "调取微信接口失败"
      	})
      } 
       // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
   })
}

// 支付订单
Vue.prototype.payWeixinOrder = (orderInfo, url = "") => {
	// orderType : 1 课程 2 音视频 3 奖赏 4 商城
	// type == 1 商业思维多个一起报名
	store.commit('updateLoadingStatus', {isLoading: true});
	Vue.http.post('/api/pay/wx/prePayId',
		qs.stringify({
			customerId: store.state.user.userId,
			orderId: orderInfo.orderId,
			type: orderInfo.type, 
		})).then(function(e) {
			store.commit('updateLoadingStatus', {isLoading: false});
			if(e.data.code == 200) {
				// if(orderInfo.payType == 2) {
					Vue.prototype.invokePay(e.data.data, url)
				// } else {
				// 	router.push(url);
				// }
			} else {
				Vue.$vux.alert.show({
					content: e.data.msg
				})
			}
	})
}

Vue.prototype.isObjectValueEqual = (a, b) => {
  // Of course, we can do it use for in 
  // Create arrays of property names
  let aProps = Object.getOwnPropertyNames(a),
  		bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length != bProps.length) {
    return false;
  }

  for (let i = 0; i < aProps.length; i++) {
    let propName = aProps[i];

    // If values of same property are not equal,
    // objects are not equivalent
    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true;
}