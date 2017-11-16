s<!-- 
	订单支付按钮
 -->

<template>
	<div v-transfer-dom v-cloak>
		<div class="cart cart-pay">
			<p>订单总额<span><i>￥</i>{{ cartCourseData.money }}</span></p>
			<div @click="payOrder" :class="['pay-order', { 'disabled': !isActive }]">提交订单</div>
		</div>	
	</div>
</template>

<script type="text/babel">
	import { TransferDom } from 'vux'
  import { mapState } from 'vuex'
	
	export default {
		name: 'cartPay',
		directives: {
	    TransferDom
	  },
	  props: ["cartCourseData", "cartCourseDataStatus"],
		data () {
			return {
				title: "",
				orderInfo: {
					orderId: "",
					orderType: "",
					type: ""
				},
				cartPay: {
					num: 1,
					money: "60",
					orderCode: ""
				}
			}
		},
		computed: {
      ...mapState({
        user: state => state.user,
        loadbar: state => state.loadbar
      }),
      isActive () {
      	return this.cartCourseDataStatus
      	// return this.cartCourseDataStatus && this.user.pay
      }
    },
		methods: {
			payOrder () {
				let _this = this,
						url,
						query;
				// if(!this.isActive) return;
				if(this.loadbar.isLoading) return;
  			_this.$store.commit('updateLoadingStatus', {isLoading: true});

  			if(_this.cartCourseData.type == 'course'){
  				url = '/api/curriculum/signUpAdd';
  				query = {
						customerId:  _this.$store.state.user.userId, // 用户code
						topContacts: _this.cartCourseData.enrollInfo,
						periodsId: _this.cartCourseData.id,
						price: _this.cartCourseData.price,
						total:  _this.cartCourseData.money,
						admissionTicket: _this.cartCourseData.adTicketCount,
						whetherVoucher: _this.cartCourseData.voucherAmount
					};
  			} else {
  				url = "/api/curriculum/signUp/offineActivity";
  				query = {
						customerId:  _this.$store.state.user.userId, // 用户code
						topContacts: _this.cartCourseData.enrollInfo,
						activityId: _this.cartCourseData.id,
						price: _this.cartCourseData.price,
						total:  _this.cartCourseData.money,
						admissionTicket: _this.cartCourseData.adTicketCount,
						whetherVoucher: _this.cartCourseData.voucherAmount
					};
  			}

				_this.$http.post(url,
					_this.qs.stringify(query)).then(function(e) {
	  				_this.$store.commit('updateLoadingStatus', {isLoading: false});
						if(e.data.code == 200) {
							_this.orderInfo = {
								orderId: e.data.data.orderId,
								orderType: e.data.data.orderType,
								type: e.data.data.type
							};
							if(_this.cartCourseData.money > 0) {
								_this.$router.push({name: 'confirmOrder', query: { orderId: e.data.data.orderId, type: e.data.data.type, orderType: e.data.data.orderType }});
							} else {
								_this.enterPassword();
							}
							// _this.voucher.num = "" + e.data.data.actualAmount;
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
					})
			},
			enterPassword () {
				let _this = this;
				if(!_this.isPassword()) {
					return;
				}
				this.$vux.confirm.prompt("请输入支付密码", {
					show: _this.cartPay.password,
					title: "支付密码",
					inputAttrs: {
						type: "password",
						value: ""
					},
				  // 组件除show外的属性
				  onCancel () {
				    
				  },
				  onConfirm (val) {
				  	if(val) {
					  	_this.getPublicKey(val);
				  	} else {
				  		_this.$vux.alert.show({
				  			content: "密码不能为空",
				  			onHide() {
				  				_this.enterPassword();
				  			}
				  		})
				  	}
				  }
				})
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
								_this.$router.push({name: 'orderDoneMall', query: { orderId: _this.orderInfo.orderId, orderType: _this.orderInfo.orderType }})
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
			background: $cartColorYellow;
	
			&.disabled {
				background: $disabledPay;
			}
		}
	}
</style>