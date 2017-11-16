<!-- 
	打赏
 -->

<template>
	<div class="reward" v-cloak>
		<p class="reward-tips">因快乐分享而富有，因成就他人而完整</p>
		<div @click="btnClick" class="reward-btn">打赏</div>

		<div v-transfer-dom>
	    <popup class="reward-popup" v-model="reward.status" position="bottom">
	      <checker class="check"
		    	v-model="reward.value"
		    	default-item-class="check-item"
		    	selected-item-class="check-item-selected"
		    >
		    	<div>
		      	<checker-item v-for="(item, index) in reward.list[0]" :key="index" :value="item">￥{{ item }}</checker-item>
		      </div>
		      <div>
		      	<checker-item v-for="(item, index) in reward.list[1]" :key="index" :value="item">￥{{ item }}</checker-item>
		      </div>
		    </checker>
		    <!-- <div class="reward-set" @click="rewardSet">自定义金额</div> -->
	      <div class="btns reward-pay-btn">
	        <x-button v-if="btnSubmitStatus" @click.native="btnSubmit" type="primary">确认</x-button>
	        <x-button v-else @click.native="btnSubmit" type="primary" show-loading>确认</x-button>
	      </div>
	    </popup>
	 	</div>

	 	<div v-transfer-dom>
		 	<actionsheet class="reward-actionsheet" v-model="paymentType.status" :menus="paymentType.menu" theme="android" @on-click-menu="payOrder">
	    </actionsheet>
    </div>

	 <!-- 	<div v-transfer-dom>
	    <popup class="reward-popup" v-model="rewardInput.status" position="bottom">
	    	<div class="reward-title">
	    		<div @click="rewardSet" class="reward-back"></div>
	    		自定义金额
	    	</div>
				<div class="reward-input">
					<x-input type="tel" v-model="rewardInput.value"></x-input>
				</div>	    	
	      <div class="btns">
	        <x-button v-if="btnSubmitStatus" @click.native="btnSubmit" type="primary">确认</x-button>
	        <x-button v-else @click.native="btnSubmit" type="primary" show-loading>确认</x-button>
	      </div>
	    </popup>
	 	</div> -->
	</div> 
</template>

<script type="text/babel">
	import hold from 'src/commons/hold'
  import { mapState } from 'vuex'
	import { TransferDom, Actionsheet, Popup, Group, XInput, XButton, FormPreview, Selector, Checker, CheckerItem } from 'vux'

	export default {
		name: "reward",
		directives: {
	    TransferDom
	  },
		components: {
			Actionsheet, Popup, Group, XInput, XButton, FormPreview, Selector, Checker, CheckerItem
		},
		props: ['rewardData'],
		data () {
			return {
				title: "打赏",
				reward: {
					status: false,
					value: 3,
					list: [
						[2, 3, 5],
						[10, 20, 1]
						// [20, 10, 1]
					],
				},
				rewardInput: {
					status: false,
					value: ""
				},
				// pay: {
				// 	status: false,
				// 	allPrice: 0,
				// 	list: [
				// 		{
			 //        label: '订单号',
			 //        value: ''
			 //      }, {
			 //        label: '名称',
			 //        value: ''
			 //      }
			 //    ]
				// },
				btnSubmitStatus: true,
				paymentType: {
					value: '1',
					status: false,
					orderId: "",
					orderType: "",
					type: "",
					menu: {
		        wallet: '奖学金',
		        weixin: '微信'
		      },
				},
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
        user: state => state.user
      })
		},
		methods: {
			btnClick () {
				this.reward.status = true;
			},
			rewardSet () {
				this.rewardInput.status = !this.rewardInput.status;
				this.rewardInput.value = "";
			},
			btnSubmit () {
				let _this = this,
						money;

				if(this.rewardInput.status) {
					money = _this.rewardInput.value
				} else {
					money = _this.reward.value;
				}

				if (!money) {
					this.$vux.alert.show({
						content: "请选择金额"
					})
					return false;
				}

				_this.btnSubmitStatus = false;

				this.$http.post('/api/product/spare/order',
						_this.qs.stringify({
							customerId: _this.$store.state.user.userId,
							goodsId: _this.rewardData.id,
							spareAmount: money,
							spareType: _this.rewardData.spareType
							// spareType打赏类型 0产品 1头条
						})
					).then(function(e) {
						let res = e.data;
						_this.btnSubmitStatus = true;

						if(res.code == 200) {
							_this.paymentType.status = true;
							_this.paymentType.orderId = e.data.data.orderId;			
							_this.paymentType.orderType = e.data.data.orderType;				
							_this.paymentType.type = e.data.data.type;	
						} else {
							_this.$vux.toast.show({
			          text: res.msg
			        })
						}
					})
			},
			btnCancel (obj) {
				this[obj].status = false
			},
			payOrder (data) {
				let _this = this;
				if (data == "weixin") {
					_this.payWeixinOrder(_this.paymentType);
				} else {
					if(!_this.isPassword()) return;

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
			pay (pwd) {
				let _this = this;
  			_this.$store.commit('updateLoadingStatus', {isLoading: true});
				_this.$http.post('/api/pay/wallet', 
					_this.qs.stringify({
						customerId: _this.$store.state.user.userId,
						payPwd: pwd,
						orderId: _this.paymentType.orderId,
						type: _this.paymentType.type 
					})).then(function(e) {
						_this.$store.commit('updateLoadingStatus', {isLoading: false});
						if(e.data.code == 200) {
							_this.$vux.alert.show({
								content: e.data.msg
							})	
						} else {
							_this.$vux.alert.show({
								content: e.data.msg,
								onHide () {
									_this.payOrder();
								}
							})
						}
				})
			},
		}
	}
</script>

<style lang="scss">
	@import '~lib/sandal/core';
  @import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	.btns {
		padding: $padding;

		&.reward-pay-btn {
			padding-left: 0;
			padding-right: 0;
			padding-bottom: 0;

			.weui-btn {
				line-height: 50px;
				border-radius: 0;
			}
		}

		.disabled {
			background: $disabledPay;
		}
	}
</style>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
  @import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	.reward {
		// margin-bottom: $paddingTop;
	}

	.reward-popup {
		background: #fff;
		z-index: 600;
	}

	.check {
		padding: $padding 0;
		text-align: center;

		& > div {
			width: 100%;
			padding: 0 40px;
			text-align: center;
			display: flex;
		}
	}

	// check
	.check-item {
	  width: 67px;
	  height: 30px;
	  margin: $padding/2 auto;
	  line-height: 30px;
	  text-align: center;
	  border-radius: 3px;
	  // border: 1px solid #ccc;
	  color: $fontColorBlack;
	  background-color: #efefef;
	  // margin: $padding;
	}
	.check-item-selected {
		position: relative;
		color: #fff;
	  background: $colorOrange;

	  &:before {
	  	content: "";
	  	position: absolute;
	  	right: 3px;
	  	bottom: 3px;
	  	width: 12px;
	  	height: 12px;
	  	background: url(~assets/img/icon/active.png) no-repeat;
	  	background-size: 100%;
	  }
	  // border-color: #ff4a00;
	}

	.reward-set, .reward-title {
		font-size: 18px;
		color: #59748f;
	}

	.reward-title, .reward-set {
		position: relative;
		line-height: $inputH;
		margin-bottom: 50px;
		text-align: center;

		.reward-back {
			position: absolute;
			top: 0;
			left: $padding;
			width: $inputH;
			height: $inputH;
			// background: red;

			&:before {
				content: "";
				position: absolute;
				top: 50%;
				left: 0;
				width: 12px;
				height: 12px;
				margin-top: -8px;
				// margin-left: -4px;
				border: 1px solid #59748f;
				border-right: 0;
				border-top: 0;
				transform: rotate(45deg);
			}
		}
	}

	.reward-set {
		margin-bottom: 0;
	}

	.reward-input {
		position: relative;
		margin: 0 $padding;
		margin-bottom: $padding;
		padding-left: 20px;
		color: $fontColorBlack;
		@include halfpxline(0, #ccc, 0 , 0, 1px, 0);

		&:before {
			content: "￥";
			position: absolute;
			left: 0;
			right: 0;
			width: 40px;
			text-align: center;
			line-height: 42px;
			font-size: 18px;
		}
	}

	.reward-btn {
		width: 4em;
		margin: 0  auto;
		margin-top: $padding;
		line-height: $inputH;
		background: $colorOrange;
		color: #fff;
		font-size: 20px;
		// letter-spacing: .5em;
		// text-indent: .5em;
		text-align: center;
		border-radius: $borderRadius;
	}
	
	.reward-tips {
		line-height: 1.35;
		text-align: center;
	}
	
</style>