<!-- 
	视频音频订单
 -->

<template>
	<div class="order-audio" v-cloak>
		<!-- <form-preview header-label="付款金额" :header-value="money" :body-items="list"></form-preview> -->
		<div class="odrer-info-mall">
			<el-card-mall class="card-mall-padding" :card-mall-data="orderAudioData"></el-card-mall>
		</div>

		<div class="pay-content">
			<h5>支付方式选择</h5>
			<div @click="setPayType(index)" class="pay-block" v-for="(item, index) in payData" :key="index">
				<p>{{ item.name }}</p>
				<div v-show="payType == index" class="check fa"></div>
			</div>
		</div>
	</div>
</template>

<script type="text/babel">
	import { FormPreview } from 'vux'
	import elCardMall from 'components/card/card-mall'
	
	export default {
		name: "orderAudio",
		components: { FormPreview, elCardMall },
		props: ['orderAudioData'],
		data () {
			return {
				title: "视频音频订单",
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
			let _this = this;

			// _this.money = _this.orderAudioData.amount;
			// _this.list[0].value = _this.orderAudioData.code;
			// _this.list[1].value = _this.orderAudioData.name;
			// _this.list[2].value = _this.orderAudioData.time;
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
	
	.odrer-info-mall {
		padding: $paddingTop $padding;
		background: #fff;
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