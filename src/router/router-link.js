// 路由到path

// 例如：复训retrain

// query参数传递 :/retain?lessonCode=值&lessonType=值

// 例如：courseOrder

// path上的冒号参数传递：/confirm-order/1 1为参数值

import loadView from './async-view-loader'

const routes = [
	{
		path: '*',
		redirect: '/index' 
	},{
		path: '/index',
		name: 'index',
		component:  loadView(loaded => {
			require(['../modules/index/index.vue'], loaded)
		}),
		meta: {
			title: '富班长',
			routerTitle: '公众号首页'
		}
	},{
		path: '/author',
		name: 'author',
		component:  loadView(loaded => {
			require(['../modules/author/author.vue'], loaded)
		}),
		meta: {
			title: '授权页面'
		}
	},{
		path: '/binding',
		name: 'binding',
		component:  loadView(loaded => {
			require(['../modules/index/binding.vue'], loaded)
		}),
		meta: {
			title: '信息绑定'
		}
	},{
		path: '/set-password',
		name: 'setPassword',
		component:  loadView(loaded => {
			require(['../modules/index/set-password.vue'], loaded)
		}),
		meta: {
			title: '设置支付密码'
		}
	},{
		path: '/confirm-order',
		name: 'courseOrder',
		query: {
			code: "", // 报名课程期数code
			courseCode: "" // 课程code
		},
		component:  loadView(loaded => {
			require(['../modules/index/course-order.vue'], loaded)
		}),
		meta: {
			title: '富班长'
		}
	},{
		path: '/order-create',
		name: 'orderCreate',
		query: {
			code: "", // 报名课程期数code
			courseCode: "" // 课程code
		},
		component:  loadView(loaded => {
			require(['../modules/order/order-create.vue'], loaded)
		}),
		meta: {
			title: '下订单'
		}
	},{
		path: '/order-done',
		name: 'orderDone',
		query: {
			groupCode: "", // 组code
			orderCode: "" // 订单code
		},
		component:  loadView(loaded => {
			require(['../modules/order/order-done.vue'], loaded)
		}),
		meta: {
			title: '订单完成'
		}
	},{
		path: '/order-done-mall',
		name: 'orderDoneMall',
		query: {
			orderCode: "" // 订单code (是否传类别，待定)
		},
		component:  loadView(loaded => {
			require(['../modules/order/order-done-mall.vue'], loaded)
		}),
		meta: {
			title: '订单完成'
		}
	},{
		// 废弃
		path: '/banner/:bannerCode',
		name: 'banner',
		component:  loadView(loaded => {
			require(['../modules/banner/banner.vue'], loaded)
		}),
		meta: {
			title: '富班长'
		}
	},{
		path: '/rank/:type', // video：视频， audio: 音频
		name: 'rankList',
		component:  loadView(loaded => {
			require(['../modules/rank/list.vue'], loaded)
		}),
		meta: {
			title: '排行榜',
			routerTitle: {
				video: '视频程序首页',
				audio: '音频程序首页'
			}
		}
	},{
		path: '/list-course', 
		name: 'courseList',
		component:  loadView(loaded => {
			require(['../modules/rank/list-course.vue'], loaded)
		}),
		meta: {
			title: '资料下载'
		}
	},{
		path: '/quotation',
		name: 'quotation',
		component:  loadView(loaded => {
			require(['../modules/quotation/quotation.vue'], loaded)
		}),
		meta: {
			title: '经典语录',
			routerTitle: '经典语录'
		}
	},{
		path: '/quotation-send',
		name: 'quotationSend',
		component:  loadView(loaded => {
			require(['../modules/quotation/send.vue'], loaded)
		}),
		meta: {
			title: '发送语录'
		}
	},{
		path: '/quotation-add',
		name: 'quotationAdd',
		component:  loadView(loaded => {
			require(['../modules/quotation/add.vue'], loaded)
		}),
		meta: {
			title: '发布语录'
		}
	},{
		path: '/news',
		name: 'news',
		component:  loadView(loaded => {
			require(['../modules/news/news.vue'], loaded)
		}),
		meta: {
			title: '培训头条'
		}
	},{
		path: '/news-detail',
		name: 'newsDetail',
		component:  loadView(loaded => {
			require(['../modules/news/detail.vue'], loaded)
		}),
		meta: {
			title: '培训头条'
		}
	},{
		// 课程
		path: '/course',
		name: 'course',
		query: {
			type: "", // 1：近期课程，0：所有课程，只是课程切换
		},
		component:  loadView(loaded => {
			require(['../modules/course/course.vue'], loaded)
		}),
		meta: {
			title: '课程',
			routerTitle: '课程首页'
		}
	},{
		// 课程
		path: '/course-nav',
		name: 'courseNav',
		query: {
			// type: "", // 1：近期课程，0：所有课程，只是课程切换
		},
		component:  loadView(loaded => {
			require(['../modules/course/course-nav.vue'], loaded)
		}),
		meta: {
			title: '课程导航',
			routerTitle: '课程导航'
		}
	},{
		// 课程详情
		path: '/course-detail',
		name: 'courseDetail',
		force: true,
		query: {
			periodsId: "" // 课程期数Id
		},
		component:  loadView(loaded => {
			require(['../modules/course/detail-course.vue'], loaded)
		}),
		meta: {
			title: '课程详情',
			routerTitle: '课程详情'
		}
	},{
		// 活动
		path: '/activity',
		name: 'activity',
		query: {
			type: "", // 0：沙龙，1：参观考察，2：行业活动
		},
		component:  loadView(loaded => {
			require(['../modules/activity/activity.vue'], loaded)
		}),
		meta: {
			title: '活动',
			routerTitle: '活动首页'
		}
	},{
		// 活动详情
		path: '/activity-detail',
		name: 'activityDetail',
		force: true,
		query: {
			activityId: "" // 课程期数Id
		},
		component:  loadView(loaded => {
			require(['../modules/activity/detail.vue'], loaded)
		}),
		meta: {
			title: '活动详情',
			routerTitle: '活动详情'
		}
	},{
		// 视频及音频详情
		path: '/course-type-detail', // type: video视频、audio音频，code产品code
		name: 'courseTypeDetail',
		force: true,
		query: {
			type: "", // type: video视频、audio音频、course：课程视频
			code: "" // code产品code
		},
		component: loadView(loaded => {
			require(['../modules/course/detail-type.vue'], loaded)
		}),
		meta: {
			title: '详情',
			routerTitle: {
				video: "视频播放页面",
				audio: "音频播放页面"
			}
		}
	},{
		// 消息
		path: '/msg',
		name: 'msg',
		component:  loadView(loaded => {
			require(['../modules/msg/msg.vue'], loaded)
		}),
		meta: {
			title: '消息列表',
			routerTitle: '消息列表页'
		}
	},{
		// 消息
		path: '/msg-detail',
		name: 'msgDetail',
		query: {
			sendUser: "", // sendUser
			msgType: "" // 消息类型：1：系统消息，2：订单消息，3：普通用户消息
		},
		component:  loadView(loaded => {
			require(['../modules/msg/msg-detail.vue'], loaded)
		}),
		meta: {
			title: '消息详情'
		}
	},{
		// 用户中心
		path: '/user-center',
		name: 'userCenter',
		component:  loadView(loaded => {
			require(['../modules/user-center/user-center.vue'], loaded)
		}),
		meta: {
			title: '富班长',
			routerTitle: '个人中心列表页'
		}
	},{
		path: '/personal',
		name: 'personal',
		component:  loadView(loaded => {
			require(['../modules/user-center/personal/personal.vue'], loaded)
		}),
		meta: {
			title: '个人资料'
		}
	},{
		path: '/personal-edit',
		name: 'personalEdit',
		query: {
			key: "" // key是要修改的属性
		},
		component:  loadView(loaded => {
			require(['../modules/user-center/personal/edit.vue'], loaded)
		}),
		meta: {
			title: '修改资料'
		}
	},{
		path: '/share',
		name: 'share',
		query: {
			openId: "" // openId
		},
		component:  loadView(loaded => {
			require(['../modules/user-center/share/share.vue'], loaded)
		}),
		meta: {
			title: '推荐分享'
		}
	},{
		path: '/integral',
		name: 'integral',
		component:  loadView(loaded => {
			require(['../modules/user-center/integral/integral.vue'], loaded)
		}),
		meta: {
			title: '我的好友'
		}
	},{
		path: '/feedback',
		name: 'feedback',
		component:  loadView(loaded => {
			require(['../modules/user-center/feedback/feedback.vue'], loaded)
		}),
		meta: {
			title: '问题反馈'
		}
	},{
		path: '/wallet',
		name: 'wallet',
		component:  loadView(loaded => {
			require(['../modules/user-center/wallet/wallet.vue'], loaded)
		}),
		meta: {
			title: '我的奖学金'
		}
	},{
		path: '/tixian',
		name: 'tixian',
		component:  loadView(loaded => {
			require(['../modules/user-center/wallet/tixian.vue'], loaded)
		}),
		meta: {
			title: '提现'
		}
	},{
		path: '/tixian-done',
		name: 'tixianDone',
		component:  loadView(loaded => {
			require(['../modules/user-center/wallet/tixian-done.vue'], loaded)
		}),
		meta: {
			title: '提现信息提示'
		}
	},{
		path: '/customer',
		name: 'customer',
		component:  loadView(loaded => {
			require(['../modules/user-center/customer/customer.vue'], loaded)
		}),
		meta: {
			title: '我的客户'
		}
	},{
		path: '/agency',
		name: 'agency',
		component:  loadView(loaded => {
			require(['../modules/user-center/customer/agency.vue'], loaded)
		}),
		meta: {
			title: '我的代理'
		}
	},{
		path: '/tuisong',
		name: 'tuisong',
		component:  loadView(loaded => {
			require(['../modules/user-center/tuisong/tuisong.vue'], loaded)
		}),
		meta: {
			title: '推送设置'
		}
	},{
		// 商城
		path: '/mall',
		name: 'mall',
		component:  loadView(loaded => {
			require(['../modules/mall/mall.vue'], loaded)
		}),
		meta: {
			title: '商城首页'
		}
	},{
		// 商城产品列表
		path: '/mall-list', // 商品类型：book: 书籍, cd: 光盘，如需新增，直接在后台新增即可
		name: 'mallList',
		query: {
			type: "" // 商品类型：book: 书籍, cd: 光盘，如需新增，直接在后台新增即可
		},
		component:  loadView(loaded => {
			require(['../modules/mall/list.vue'], loaded)
		}),
		meta: {
			title: '产品列表'
		}
	},{
		// 商城详情
		path: '/mall-detail',
		name: 'mallDetail',
		query: {
			goodsCode: "", // 商品code
			type: '' // 显示tab
		},
		component:  loadView(loaded => {
			require(['../modules/mall/detail.vue'], loaded)
		}),
		meta: {
			title: '商品详情'
		}
	},{
		// 商城产品订单创建
		path: '/mall-order',
		name: 'mallOrder',
		query: {
			id: "" // 商品id
		},
		component:  loadView(loaded => {
			require(['../modules/mall/mall-order.vue'], loaded)
		}),
		meta: {
			title: '商品订单'
		}
	},{
		// 课程订单
		path: '/order-list-course',
		name: 'orderCourseList',
		component:  loadView(loaded => {
			require(['../modules/order/order-course.vue'], loaded)
		}),
		meta: {
			title: '课程订单列表'
		}
	},{
		// 活动订单
		path: '/order-list-activity',
		name: 'orderActivityList',
		component:  loadView(loaded => {
			require(['../modules/order/order-activity.vue'], loaded)
		}),
		meta: {
			title: '活动订单列表'
		}
	},{
		// 商城订单
		path: '/order-list-mall',
		name: 'orderMallList',
		// query: {
		// 	type: '' // 订单状态，可以不传，不传就是tab第一个，1：tab第二个，2：tab第三个
		// },
		component:  loadView(loaded => {
			require(['../modules/order/mall-list.vue'], loaded)
		}),
		meta: {
			title: '商城订单列表'
		}
	},{
		// 资料订单
		path: '/order-list-source',
		name: 'orderSourceList',
		query: {
			type: '' // 1 音频 2 资料 其他都是视频
		},
		component:  loadView(loaded => {
			require(['../modules/order/source-list.vue'], loaded)
		}),
		meta: {
			title: '资料订单列表'
		}
	},{
		// 订单
		path: '/pay-order',
		name: 'confirmOrder',
		query: {
			orderCode: "", // 订单code,
			groupCode: "",  // 课程报名是有groupCode
			orderType: "" // 订单类型 1 课程 2 音视频 3 奖赏 4 商城
		},
		component:  loadView(loaded => {
			require(['../modules/order/confirm-order.vue'], loaded)
		}),
		meta: {
			title: '订单支付'
		}
	},{
		// 购物车
		path: '/shop-cart',
		name: 'shopCart',
		component:  loadView(loaded => {
			require(['../modules/shop-cart/shop-cart.vue'], loaded)
		}),
		meta: {
			title: '购物车'
		}
	},{
		// 地址信息
		path: '/address',
		name: 'address', 
		query: {
			orderCode: "" // 订单code,用来判定是不是来自订单
		},
		component:  loadView(loaded => {
			require(['../modules/address/address.vue'], loaded)
		}),
		meta: {
			title: '地址信息'
		}
	},{
		// 地址信息
		path: '/address-add',
		name: 'addressAdd',
		component:  loadView(loaded => {
			require(['../modules/address/address-add.vue'], loaded)
		}),
		meta: {
			title: '地址新增'
		}
	},{
		// 地址编辑
		path: '/address-edit',
		name: 'addressEdit',
		query: {
			orderCode: "" // 订单code,用来判定是不是来自订单
		},
		component:  loadView(loaded => {
			require(['../modules/address/address-edit.vue'], loaded)
		}),
		meta: {
			title: '地址编辑'
		}
	},{
		// 好友信息
		path: '/friend',
		name: 'friend', 
		query: {
			orderCode: "" // 订单code,用来判定是不是来自订单
		},
		component:  loadView(loaded => {
			require(['../modules/user-center/friend/friend.vue'], loaded)
		}),
		meta: {
			title: '地址信息'
		}
	},{
		// 好友新增
		path: '/friend-add',
		name: 'friendAdd',
		component:  loadView(loaded => {
			require(['../modules/user-center/friend/add.vue'], loaded)
		}),
		meta: {
			title: '好友新增'
		}
	},{
		// 好友编辑
		path: '/friend-edit',
		name: 'friendEdit',
		query: {
			friendId: "", // 好友的id
			orderCode: "" // 订单code
		},
		component:  loadView(loaded => {
			require(['../modules/user-center/friend/edit.vue'], loaded)
		}),
		meta: {
			title: '好友编辑'
		}
	},{
		// 门票券
		path: '/ticket',
		name: 'ticket',
		component:  loadView(loaded => {
			require(['../modules/user-center/ticket/ticket.vue'], loaded)
		}),
		meta: {
			title: '我的门票券'
		}
	},{
		// 门票券
		path: '/ticket-check',
		name: 'ticketCheck',
		component:  loadView(loaded => {
			require(['../modules/user-center/ticket/check.vue'], loaded)
		}),
		meta: {
			title: '我的门票券'
		}
	},{
		// 抵用券
		path: '/voucher',
		name: 'voucher',
		component:  loadView(loaded => {
			require(['../modules/user-center/voucher/voucher.vue'], loaded)
		}),
		meta: {
			title: '我的抵用券'
		}
	},{
		// 线下课程支付
		path: '/pay',
		name: 'pay',
		component:  loadView(loaded => {
			require(['../modules/pay/pay.vue'], loaded)
		}),
		meta: {
			title: '我的门票券'
		}
	},{
		path: '/upgrade',
		name: 'upgrade',
		component:  loadView(loaded => {
			require(['../modules/user-center/upgrade/upgrade.vue'], loaded)
		}),
		meta: {
			title: '升级'
		}
	},{
		path: '/upgrade-rights',
		name: 'upgradeRights',
		component:  loadView(loaded => {
			require(['../modules/user-center/upgrade/upgrade-rights.vue'], loaded)
		}),
		meta: {
			title: '权益'
		}
	}
]

export default routes