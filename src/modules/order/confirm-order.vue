<!-- 
	订单
	/* 0 课程订单 1 商城订单 2 音视频订单 3课程套餐订单 4专栏产品 5.线下活动 6.打赏订单 */	

	orderType	是	number	
		0 课程订单 1 商城订单 2 音视频订单 3课程套餐订单 4专栏产品 5.线下活动 6.打赏订单 7.充值订单 8.提现订单
 
 	type	number	订单类型 
 		0.产品订单 1.打赏，2.订单组 3.充值
 -->

<template>
	<div class="order" v-cloak>
		<form-preview header-label="订单信息" :header-value="orderInfo.allMoney" :body-items="orderInfo.list"></form-preview>

		<div class="pay-content">
			<h5>支付方式选择</h5>
			<div @click="setPayType(index)" class="pay-block" v-for="(item, index) in payData" :key="index">
				<p>{{ item.name }}</p>
				<div v-show="payType == index" class="check fa"></div>
			</div>
		</div>

		<el-cart-pay :order-info="orderInfo" :is-active="orderInfo.isActive"></el-cart-pay>
	</div>
</template>

<script type="text/babel">
	import { Group, Selector, XButton, FormPreview, Popup, Toast, TransferDomDirective as TransferDom  } from 'vux'
	import elOrderMall from 'components/order/mall'
	import elOrderCourse from 'components/order/course'
	import elOrderAudio from 'components/order/audio'
	import elCartPay from 'components/cart/cart-pay'

	export default {
		name: "order",
		directives: {
	    TransferDom
	  },
		components: {
			Group, Selector, XButton, FormPreview, Popup, elOrderMall, elCartPay, elOrderCourse, elOrderAudio
		},
		data () {
			return {
				payData: [
					{
						name: "奖学金",
						value: "1",
						icon: ""
					},{
						name: "微信支付",
						value: "2",
						icon: ""
					}
				],
				payType: 0,

				show: true,
				payClick: false, 
				orderInfo: {
					orderId: this.$route.query.orderId,
					orderType: this.$route.query.orderType,
					type: this.$route.query.type,
					productCode: "",
					num: 0,
					time: '',
					money: "",
					allMoney: '',
					adCounts: 0, // 可使用门票数量
					availVoucher: 0, // 可用抵用券数量
					address: {},
					payType: 0,
					list: [
						// {
		    //     	label: '产品名称',
		    //     	value: '电动打蛋机'
		    //   	}
		      ],
					isActive: '' //// 支付按钮是否可点击
				},
				orderMallDatas: {},
				orderCourseData: {},
				orderAudioData: {},
				pay: {
					show: false,
					allPrice: 0,
					list: [
						{
			        label: '订单号',
			        value: ''
			      }, {
			        label: '联系人',
			        value: ''
			      }, {
			        label: '电话',
			        value: ''
			      }, {
			        label: '地址',
			        value: ''
			      }, {
			        label: '时间',
			        value: ''
			      }
			    ]
				}
			}
		},
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData () {
				let _this = this;
				_this.$http.post('/api/customer/order/pay/detail',
					_this.qs.stringify({
						customerId: _this.$store.state.user.userId,
						orderId: _this.orderInfo.orderId,
						type: _this.orderInfo.type
					})).then(function(e) {
						if(e.data.code == 200) {
							let list = [],
									res = e.data.data;
							if(_this.orderInfo.orderType == 0) {
								list = [
									{
										label: '产品名称',
										value: res.goodsName
									},{
										label: '产品单价',
										value: res.singlePrice
									},{
										label: '购买数量',
										value: res.buyCount
									},{
										label: '使用门票数量',
										value: res.ticketCount
									},{
										label: '抵用券金额',
										value: res.voucherAmount || 0
									},{
										label: '应付金额',
										value: res.expectAmount
									},
								];
							} else {
								list = [
									{
										label: '产品名称',
										value: res.goodsName
									},{
										label: '产品单价',
										value: res.singlePrice
									},{
										label: '购买数量',
										value: res.buyCount
									},{
										label: '应付金额',
										value: res.expectAmount
									},
								];
							}
							_this.orderInfo.time = res.createTime;
							_this.orderInfo.money = res.actualAmount;
							_this.orderInfo.allMoney = res.expectAmount;
							_this.orderInfo.list = list;
							_this.orderInfo.isActive = true;
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
				});
			},
			getAudioData () {
				let _this = this;
				// _this.$http.post('/api/customer/product/online/order/detail',
				// 	_this.qs.stringify({
				// 		customerId: _this.$store.state.user.userId,
				// 		orderId: _this.orderInfo.orderId,
				// 	})).then(function(e) {
				// 		let responseData = e.data,
				// 				num = 0;
				// 		if(responseData.code == 200) {
				// 			_this.orderAudioData = {
				// 				description: "",
				// 				id: responseData.data.productId,
				// 				productCount: responseData.data.buyCount,
				// 				productName: responseData.data.name,
				// 				productPrice: responseData.data.price,
				// 				img: responseData.data.images
				// 			};
				// 			_this.orderInfo.money = responseData.data.totalAmount;
				// 			_this.orderInfo.isActive = true;
				// 		} else {
				// 			_this.$vux.alert.show({
				// 				content: e.data.data.msg
				// 			})
				// 		}
				// });
			},
			setPayType (ind) {
				this.payType = ind;
				this.orderInfo.payType = ind;
			},
			setCartPayStatus (data) {
				this.orderInfo.isActive = data
			},
			onTypeChange (val) {
				this.orderInfo.payType = val;
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	// @import '~assets/css/icon';

	.order {
		width: 100%;
		height: 100%;
		background-color: $bgGray;
	}
	
	.address {
		.block {
			@include halfpxline($borderRadius, $borderColor, 1px, 1px, 1px, 1px);
			padding: $padding;
			margin: $padding;
			border-radius: $borderRadius;

			&.active {
				background: $fontColorBlue;
				color: #fff;
			}
		}
	}

	.demo {
		position: absolute;
		z-index: 1000;
		top: 0;
		left: 0;
		right:　0;
		bottom: 0;
	}

	.pay-content {
		margin-top: $padding;

		h5 {
			@include halfpxline(0, $borderColor, 0, 0, 1px, 0);
			line-height: 40px;
			background: #fff;
			font-size: 16px;
			padding: 0 $padding;
		}
	}

	.pay-block {
		@include halfpxline(0, $borderColor, 0, 0, 1px, 0);
		background: #fff;
		line-height: $inputH;
		padding: 0 $padding;

		&:first-child {
			@include halfpxline(0, $borderColor, 1px, 0, 1px, 0);
		}

		.check {
			position: absolute;
			right: $padding;
			top: 50%;
			// width: 30px;
			// height: 30px;
			// line-height: 30px;
			// margin-top: -15px;
			// color: $colorRed;
			width: 20px;
			height: 20px;
			margin-top: -10px;
			background: url("~assets/img/user-center/address-check.png") no-repeat;
			background-size: 100%;
			// background: red;
		}
	}
</style>