<!-- 
	订单支付按钮
 -->

<template>
	<div v-transfer-dom v-cloak>
		<div class="cart cart-pay">
			<!-- <p>共<span>{{ orderInfo.num }}</span>件，总金额 <span><i>￥</i>{{ orderInfo.money }}</span></p> -->
			<p>总金额 <span><i>￥</i>{{ orderInfo.money }}</span></p>
			<div @click="payOrder" :class="['pay-order', { 'disabled': !isActive }]">提交订单</div>
		</div>
	</div>
</template>

<script type="text/babel">
	import { TransferDom  } from 'vux'
  import { mapState } from 'vuex'
	
	export default {
		name: 'cartPay',
		directives: {
	    TransferDom
	  },
	  props: ["orderInfo"],
		data () {
			return {
				title: "",
				cartPay: {
					num: 1,
					money: "60",
					orderCode: "",
					payType: "",
					password: false
				}
			}
		},
		computed: {
      ...mapState({
        user: state => state.user,
        loadbar: state => state.loadbar
      }),
      isActive () {
      	return this.orderInfo.isActive
      }
    },
		methods: {
			payOrder () {
				let _this = this;
				if(_this.isActive) {
					if(_this.orderInfo.isActive) {
						if(_this.orderInfo.payType == 0) {
							if(!_this.isPassword()) {
								return;
							}
							_this.$vux.confirm.prompt("请输入支付密码", {
								show: _this.cartPay.password,
								title: "支付密码",
								inputAttrs: {
									type: "password",
									value: ""
								},
							  // 组件除show外的属性
							  onCancel () {
							  	_this.$vux.confirm.setInputValue('') 
							  },
							  onConfirm (val) {
							  	_this.$vux.confirm.setInputValue('') 
							  	if(val) {
								  	_this.getPublicKey(val);
							  	} else {
							  		_this.$vux.alert.show({
							  			content: "密码不能为空",
							  			onHide() {
							  				_this.payOrder();
							  			}
							  		})
							  	}
							  }
							})
							_this.$vux.confirm.setInputValue('')
						} else {
							this.payPrepar();
						}
					} else {
						this.$vux.alert.show({
							content: "请选择收货地址"
						})
					}
				}
			},
			pay (pwd) {
				let _this = this;

				if(pwd) {
	  			_this.$store.commit('updateLoadingStatus', {isLoading: true});
					_this.$http.post('/api/pay/wallet', 
						_this.qs.stringify({
							customerId: _this.$store.state.user.userId,
							payPwd: pwd,
							orderId: _this.orderInfo.orderId,
							type: _this.orderInfo.type 
						})).then(function(e) {
							_this.$store.commit('updateLoadingStatus', {isLoading: false});
							if(e.data.code == 200) {
								// _this.payPrepar();
								_this.$router.push({name: 'orderDoneMall', query: { orderType: _this.orderInfo.orderType }})
							} else {
								_this.$vux.alert.show({
									content: e.data.msg,
					  			onHide() {
					  				_this.payOrder();
					  			}
								})
							}
					})
				} else {
					_this.payPrepar();
				}
			},		 
			getPublicKey (data) {
				let _this = this;
				let jse = new this.$jsEncrypt.JSEncrypt();

				_this.$store.commit('updateLoadingStatus', {isLoading: true});
				_this.$http.post("/api/pay/publickey", 
					_this.qs.stringify({
						customerId: _this.$store.state.user.userId,
					})).then(function(e) {
						_this.$store.commit('updateLoadingStatus', {isLoading: false});
						if(e.data.code == 200) {
							jse.setPublicKey(e.data.data);
							let encrypted = jse.encrypt(data);
							_this.pay(encrypted);
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
				});
			},
			payPrepar () {
				let _this = this;
					this.payWeixinOrder(_this.orderInfo, {name: 'orderDoneMall', query: { orderType: _this.orderInfo.orderType }}, 1)
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

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