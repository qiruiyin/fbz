<!-- 
	商城提交订单
 -->

<template>
	<div v-transfer-dom v-cloak>
		<div class="cart cart-pay">
			<p>总金额 <span><i>￥</i>{{ cartData.money }}</span></p>
			<div @click="goBalance" class="pay-order">提交订单</div>
		</div>
	</div>
</template>

<script type="text/babel">
	import { TransferDom } from 'vux'
	import { mapState } from 'vuex'

	export default {
		name: "cartMall",
		directives: {
	    TransferDom
	  },
		props: ["cartData"],
		data () {
			return {
				title: "购物车按钮"
			}
		},
		computed: {
	    ...mapState({
	      cart: state => state.cart
	    })
	  },
		mounted () {
		},
		methods: {
			goBalance () {
				console.log(this.cartData)
				if(!this.isLogin()) return false;
				let _this = this;

				this.$http.post('/api/goods/order/confirm',
					_this.qs.stringify({
						customerId: _this.$store.state.user.userId,
						goodsId: _this.cartData.id,
						num: _this.cartData.num,
						addressId: _this.cartData.addressId,
						voucherStatus: 0,
						remark: ''
					})).then(function(e) {
						if(e.data.code == 200) {
							_this.$router.push({name: 'confirmOrder', query: { orderId: e.data.data.orderId, orderType: e.data.data.orderType, type: e.data.data.type }});
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
					});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	.cart {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: $cartH;
		background: $cartBg;
		z-index: 10;
		display: flex;
		color: $cartColor;
		font-size: $cartBtnFontSize;

		div {
			width: 100%;
			line-height: $cartH;
			text-align: center;
		}
	}

	.add-cart, .go-balance {
		background: $cartColorYellow;
		color: #fff;	
	}

	.go-balance {
		// background: $cartColorRed;
		background: $colorRedDeep;
	}

	.balance {
		position: relative;
		padding: 5px;
		// background: red;
		line-height: 1;

		&:before {
			height: auto;
			line-height: 1;
			display: block;
		}
		
		span {
			height: auto;
			line-height: 1.35;
			font-size: 14px;
			display: block;
		}

		i {
			position: absolute;
			font-style: normal;
			left: 50%;
			top: 0;
			margin-left: 1em;
			line-height: 1;
			font-size: 14px;
			color: #fff;
		}
	}

@import '~assets/css/cart';
	
	.cart {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: $cartH;
		background: $cartBg;
		z-index: 10;
		display: flex;
		font-size: $cartBtnFontSize;
		border-top: 1px solid $borderColor;
		color: $cartColor;

		div {
			width: 50%;
			line-height: $cartH;
			text-align: center;
		}
	}

	.cart-pay {

		p {
			padding-right: $padding;
			flex: 1;
			line-height: $cartH;
			text-align: right;

			span {
				color: $cartColor;
				
				i {
					font-style: normal;
				}
			}
		}

		.pay-order {
			width: 140px;
			background: $colorRedDeep;
			// background: $cartColorYellow;
	
			&.disabled {
				background: $disabledPay;
			}
		}
	}
</style>
