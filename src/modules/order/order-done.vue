<!-- 
	课程支付完成
 -->

<template>
	<div class="order-done order-course" v-show="orderInfo.name" v-cloak>
		<div class="order-done-content">
			<div class="order-done-succcess">
				<img src="~assets/img/tips/success.png">
				<p>恭喜您报名成功！</p>
			</div>

			<div class="order-done-block-new">
				<h5>{{ orderInfo.name }}</h5>

				<div class="order-done-block-new-content">
					<p class="fa fa-user-o">
						<span v-for="(item, index) in orderInfo.list" :key="index">{{ index == 0 ? item : '、' + item }}</span>
					</p>
					<p class="fa fa-calendar-o">{{ orderInfo.date }}</p>
					<p class="fa fa-map-marker">{{ orderInfo.address }}</p>
				</div>
			</div>

			<!-- <div class="order-done-block order-done-msg">
				<p>您已成功报名{{ orderInfo.date }}日在{{ orderInfo.address }}开课的{{ orderInfo.name }}</p>
				<div class="order-done-label">上课人: 
					<p v-for="(item, index) in orderInfo.list" :key="index">{{ item }}</p>
				</div>
			</div> -->
		</div>

		<div class="btns">
			<x-button type="primary" @click.native="goPage('index')">完成</x-button>
		</div>
	</div>
</template>

<script type="text/babel">
	import { XButton, Group, Cell, Rater } from 'vux'

	export default {
		name: "orderDone",
		components: {
			XButton, Group, Cell, Rater
		},
		data () {
			return {
				title: "订单完成页面",
				orderInfo: {
					groupCode: this.$route.query.groupCode,
					orderCode: this.$route.query.orderCode,
					name: "",
					date: "",
					address: "",
					list: []
				},
				kefuInfo: {}
			}
		},
		mounted () {
			// this.fetchData();
		},
		methods: {
			fetchData () {
				let _this = this;

				// 获取订单信息
				_this.$http.post('/api/customer/product/online/order/detail',
					_this.qs.stringify({
						"groupCode": _this.orderInfo.groupCode,
						"orderCode": _this.orderInfo.code
					})).then(function(e) {
						let responseData = e.data.data;
						if(e.data.code == 200) {
							// _this.orderInfo.name = responseData.lessonName;
							// _this.orderInfo.date = responseData.time;
							// _this.orderInfo.address = responseData.address;
							// _this.orderInfo.list = responseData.studentNames;
						}	else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}	
				});
			},
			goPage (url) {
				this.$router.push({name: url});
			}
		}
	}
</script>	

<style lang="scss">
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	.order-done-kefu {
		.vux-rater {
			a {
				// margin: 0 auto !important;
				width: auto !important;
				height: auto !important;
				font-size: 12px !important;
			}
		}
	}
</style>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	$orderMargin: 10px; // 上课人和客服标签的间距

	$orderDoneBlockPadding: 30px;
	$orderDoneBlockPaddingTop: 20px;
	$orderDoneBlockPaddingBottom: 30px;

	$orderDoneMargin: 30px; // 块间距

	$kefuW: 70px;
	$kefuPadding: 20px;

	.order-done {
		position: relative;
		width: 100%;
		height: 100%;
		padding: 0;
		background-color: $bgGray;
	}

	.order-done-succcess {
		line-height: 2;
		padding-top: 30px;
		margin-bottom: 30px;
		text-align: center;
		color: $colorGreen;
	
		img {
			width: 60px;
			margin: 0 auto;
			border-radius: 60px;
		}
	}

	.order-done-block-new {
		padding: 0 $padding;
		line-height: 2;
		background: #fff;

		h5 {
			@include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
			line-height: 2;
			font-size: 20px;
		}

		.order-done-block-new-content {
			padding: 10px 0;

			p {
				line-height: 2;
				display: block;

				&:before {
					width: 1em;
					margin-right: .5em;
					text-align: center;
					display: inline-block;
				}
			}
		}
	}

	.order-done-block {
		padding: $orderDoneBlockPaddingTop $orderDoneBlockPadding $orderDoneBlockPaddingBottom;
		margin-top: $orderDoneMargin;
		background-color: #fff;
		border-radius: $borderRadius;
		line-height: 1.75;
	}

	.btns {
		margin-top: $orderDoneMargin;
		text-align: center;
	}
</style>