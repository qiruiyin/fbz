<!-- 
	课程订单 (废弃)
 -->

<template>
	<div class="order-course" v-cloak>
		<div class="order-course-content">
			<el-card-course :card-course-data="orderCourseData"></el-card-course>
		</div>
		
		<div v-if="orderCourseData.prepareMoney > 0" class="pay-content">
			<h5>支付方式选择</h5>
			<div @click="setPayType(index)" class="pay-block" v-for="(item, index) in payData" :key="index">
				<p>{{ item.name }}</p>
				<div v-show="payType == index" class="check fa"></div>
			</div>
		</div>
		<div v-else class="pay-tips">
			<p v-if="orderCourseData.adCounts > 0">已使用张门票抵扣{{ orderCourseData.adCounts * orderCourseData.price }}</p>
			<p v-if="orderCourseData.availVoucher > 0">已使用抵用券抵扣{{ orderCourseData.availVoucher > orderCourseData.money ? orderCourseData.money : orderCourseData.availVoucher }}元</p>
		</div>
	</div>
</template>

<script type="text/babel">
	import { FormPreview, Group } from 'vux'
	import elCardCourse from 'components/card/card-course'
	
	export default {
		name: "orderCourse",
		components: { FormPreview, elCardCourse },
		props: ['orderCourseData'],
		data () {
			return {
				value: "",
				money: "",
				list: [
					{
		        label: '',
		        value: ''
		      },{
		        label: '',
		        value: ''
		      },{
		        label: '',
		        value: ''
		      }
		    ],
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
				payType: 0
			}
		},
		mounted () {
			// let _this = this;

			// // _this.money = _this.orderCourseData.amount;
			// // _this.list[0].value = _this.orderCourseData.code;
			// // _this.list[1].value = _this.orderCourseData.name;
			// // _this.list[2].value = _this.orderCourseData.time;
		},
		methods: {
			setPayType (ind) {
				this.payType = ind;
				this.$emit("on-type-change", this.payData[ind].value);
			}
		}
	}
</script>


<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	.order-course-header {
		padding: $paddingTop $padding;
		background-color: #fff;
		line-height: 1.75;
		color: $fontColorBlack;
		border-bottom: $uiMarginH solid $uiMarginBg;

		.info {
			font-size: 16px;
			display: flex;

			p {
				flex: 1;
				@include ellipsisOne();
			}

			span {
				width: 7em;
				text-align: right;
			}
		}
	}

	.order-course-content {
		padding: $paddingTop $padding;
		background-color: #fff;
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
	
	.pay-tips {
		line-height: 44px;
		margin-top: $padding;
		padding: 0 $padding;
		background: #fff;
	}
</style>