<!-- 
	线下课程支付页面
 -->

<template>
	<div class="pay">
		<div class="pay-header">
			<p>支付金额</p>
			<span>￥{{ orderInfo.money }}</span>
		</div>

		<div class="pay-content">
			<div @click="setPayType(index)" class="pay-block" v-for="(item, index) in payData" :key="index">
				<p>{{ item.name }}</p>
				<div v-show="payType == index" class="check"></div>
			</div>

			<div class="btns">
				<x-button type="primary">支付</x-button>
			</div>
		</div>
	</div>
</template>

<script type="text/babel">
	import { XButton } from 'vux'
	
	export default {
		name: "pay",
		components: {
			XButton
		},
		data () {
			return {
				title: "支付页面",
				orderInfo: {
					money: "100"
				},
				payData: [
					{
						name: "奖学金",
						value: "",
						icon: ""
					},{
						name: "微信支付",
						value: "",
						icon: ""
					}
				],
				payType: 0
			}
		},
		methods: {
			setPayType (ind) {
				this.payType = ind;
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	.pay {
		width: 100%;
		height: 100%;
		padding-top: 30px;
		background: $bgGray;
	}

	.pay-header {
		padding: $padding 0;
		margin: 0 $padding;
		background: #fff;
		text-align: center;
		border-radius: $borderRadius;

		p {
			// color
		}
	}

	.pay-content {
		margin-top: $padding;
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
			width: 30px;
			height: 30px;
			margin-top: -15px;
			background: red;
		}
	}

	.btns {
		margin-top: 40px;
	}

</style>