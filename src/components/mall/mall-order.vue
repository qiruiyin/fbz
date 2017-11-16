<!-- 
	商城创建订单页面
 -->

<template>
	<div class="mall-order">
		<div class="address" @click="addressChoose">
			<div class="address-msg">
				<p class="address-man">收货人：{{ address.name }}</p>
				<span class="address-tel">{{ address.phone }}</span>
			</div>
			<div class="address-detail">
				<i class="address-icon"></i>
				收货地址：{{ address.address }}
				<i class="angle-icon fa fa-angle-right"></i>
			</div>
		</div>
	</div>
</template>

<script type="text/babel">
	export default {
		name: 'mallOrder',
		data () {
			return {

			}
		},
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData () {
				let _this = this;

			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	.address {
		padding: $paddingTop $padding $paddingTop + 10px;
		padding-left: $padding + 30px;
		padding-right: $padding + 20px;
		line-height: 1.75;
    background: #fff url("~assets/img/shop-cart/location-bg.png") repeat-x;
		background-position: bottom;


		&.active {
		}

		.address-msg {
			font-size: 16px;
			display: flex;
			color: $fontColorBlack;
			
			p {
				flex: 1;
				@include ellipsisOne();
			}

			span {
				width: 7em;
				text-align: right;
				display: block;
			}
		}

		.address-detail {
			position: relative;
			text-align: justify;

			.fa {
				position: absolute;
				top: 50%;
				margin-top: -.75em;
				line-height: 1.5;
				font-size: 18px;
			}

			.address-icon {
				position: absolute;
				top: 50%;
				left: -20px;
				width: 15px;
				height: 20px;
				margin-top: -10px;
				background: url("~assets/img/shop-cart/location.png") center no-repeat;
				background-size: 100%;
				display: block;
			}

			.angle-icon {
				right: -20px;
			}
		}
	}

	.order-add-address {
		background: $colorOrange;
		color: #fff;

		&:not(.weui-btn_disabled):active {
			color: #fff;
			background: $colorOrange;
		}
	}

</style>