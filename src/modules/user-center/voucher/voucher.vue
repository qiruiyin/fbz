<!-- 
	我的抵用券
 -->

<template>
	<div class="wallet">
		<div class="wallet-header">
			<p>抵用券</p>
			<div class="money">{{  user.voucherAmount | numToCash }}</div>
			<div class="wallet-btn" @click="btnClick">充值</div>
		</div>

		<div class="wallet-content">
			<scroller lock-x :height="-wallet.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offst="200">
		  	<div>
					<card>
			      <div class="wallet-card-header" slot="header">收支明细</div>
			      <div slot="content" class="wallet-card-content">
			      	<div class="wallet-block" v-for="(item, index) in wallet.list" :key="index">
			      		<div class="wallet-block-list">		      			
				      		<div class="title">{{ item.detail }}</div>
				      		<span class="value">{{ item.operateType == 'sub' ? '-' : '+' }}{{ item.amount }}</span>
			      		</div>

			      		<div class="wallet-block-list">
				      		<div class="time">{{ item.time }}</div>
				      		<span v-if="item.cashStatus" class="status">{{ item.cashStatus }}</span>		      			
			      		</div>
			      	</div>
			      </div>
			    </card>

					<el-load-more :load-all="wallet.loadAll"></el-load-more>
				</div>
			</scroller>
		</div>

	 	<div v-transfer-dom>
	    <popup class="reward-popup" v-model="reward.status" position="bottom">
	    	<div class="reward-title">
	    		<div @click="rewardSet" class="reward-back"></div>
	    		自定义金额
	    	</div>
				<div class="reward-input">
					<x-input type="tel" v-model="rewardInput.value"></x-input>
				</div>	    	
	      <div class="btns">
	        <x-button @click.native="btnSubmit" type="primary">确认</x-button>
	      </div>
	    </popup>
	 	</div>

	 	<div v-transfer-dom>
		 	<actionsheet class="reward-actionsheet" v-model="paymentType.status" :menus="paymentType.menu" theme="android" @on-click-menu="payOrder">
	    </actionsheet>
    </div>
	</div>
</template>

<script type="text/babel">
	import { mapState } from 'vuex'
	import { TransferDom, Actionsheet, Popup, Group, XInput, XButton, FormPreview, Selector, Checker, CheckerItem, Scroller, Card } from 'vux'
	import elLoadMore from 'components/load-more/load-more'

	export default {
		name: 'wallet',
		directives: {
	    TransferDom
	  },
		components: {
			Actionsheet, Popup, Group, XInput, XButton, FormPreview, Selector, Checker, CheckerItem, Scroller, elLoadMore, Card 
		},
		data () {
			return {
				wallet: {
					offsetBottom: 210,
					money: '',
					onFetching: false,
					loadAll: false,
					pageNum: 1,
					pageSize: this.wordBook.pageSize,
					list: [
						// {
						// 	title: "《逆向盈利》赚钱快速增长1000倍",
						// 	time: "2017-08-21",
						// 	value: "3980"
						// },{
						// 	title: "《逆向盈利》赚钱快速增长1000倍",
						// 	time: "2017-08-21",
						// 	value: "3980"
						// }
					]
				},
				btnSubmitStatus: false,
				reward: {
					status: false,
					value: 3,
					list: [
						[2, 3, 5],
						[10, 20, 1]
						// [20, 10, 1]
					],
				},
				paymentType: {
					value: '1',
					status: false,
					orderId: "",
					orderType: '',
					type: '',
					menu: {
		        wallet: '奖学金',
		        weixin: '微信'
		      },
				},
				rewardInput: {
					status: false,
					value: ""
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
	      user: state => state.user,
	    })
		},
		mounted () {
			this.fetchData();
			this.getUserAttribute();
		},
		methods: {
			getUserAttribute () {
				let _this = this;
  		 	_this.$http.post('/api/userInfo/userAttribute',
	  				this.qs.stringify({
							"customerId": this.user.userId
						})
	  			).then(function(e) {
	  				if(e.data.code == 200) {
	  					let res = e.data.data;
							_this.$store.commit("updateUserTicketsCount", { ticketsCount: res.ticketsCount });
							_this.$store.commit("updateUserVoucherAmount", { voucherAmount: res.voucherAmount });
							_this.$store.commit("updateUserWalletAmount", { walletAmount: res.walletAmount });
							_this.$store.commit("updateUserIntegralAmount", { integralAmount: res.integralAmount });
	  				} else {
	  					_this.$vux.alert.show({
	  						content: e.data.msg
	  					})
	  				}
	  			});
			},
			fetchData (status) {
				let _this = this,
						pageNum;
				_this.wallet.onFetching = true;
				if (status) {
					pageNum = 1
				}

				_this.$http.post('/api/userInfo/getCustomerBill',
					_this.qs.stringify({
							customerId: _this.$store.state.user.userId,
							type: '0',
							pageNum: pageNum || _this.wallet.pageNum,
							pageSize: _this.wallet.pageSize
						})
					).then(function(e) {
						if(e.data.code == 200) {
							let list = [];

							if(e.data.data.result.length > 0) {
								list = e.data.data.result.map(function(item, index){
									return {
										id: item.billId,
										amount: item.amount,
										cashStatus: item.status == 1 ? "完成" : "处理中",
										time: item.createTime,
										detail: item.billDetails,
										operateType: item.operateType
									}
								})

								if(_this.wallet.pageNum == 1 || pageNum == 1) {
									_this.wallet.list = list;
								} else {
									_this.wallet.list = _this.wallet.list.concat(list);
								}

								if(pageNum) {
									_this.wallet.pageNum = pageNum + 1;
								} else {
									_this.wallet.pageNum++;
								}
								if(list.length < _this.wallet.pageSize) {
									_this.wallet.loadAll = true;
								}
							}

							_this.resetView();
							_this.wallet.onFetching = false;
							_this.wallet.loadAll = true;
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
					})
			},
			resetView () {
				let _this = this;
				_this.$nextTick(() => {
          _this.$refs.scrollerBottom.reset()
        })
			},
			loadMore () {
				if(this.wallet.onFetching || this.wallet.loadAll) {

				} else {
					this.wallet.onFetching = true;					
					this.fetchData();
				}
			},
			goPage (url) {
				this.$router.push({ name: url })
			},
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

				money = _this.rewardInput.value;

				if (!money) {
					this.$vux.alert.show({
						content: "请输入金额"
					})
					return false;
				}

				_this.btnSubmitStatus = false;

				_this.$store.commit('updateLoadingStatus', {isLoading: true});
				_this.$http.post('/api/userInfo/voucherRecharge',
					_this.qs.stringify({
						customerId: _this.$store.state.user.userId,
						amount: money + "",
					})).then(function(e) {
						_this.$store.commit('updateLoadingStatus', {isLoading: false});
						let responseData = e.data;
						_this.btnSubmitStatus = true;

						if(responseData.code == 200) {
							_this.paymentType.status = true;				
							_this.paymentType.orderId = e.data.data.orderId;			
							_this.paymentType.orderType = e.data.data.orderType;				
							_this.paymentType.type = e.data.data.type;				
						} else {
							_this.$vux.alert.show({
			          text: responseData.msg
			        })
						}
					})
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
								content: e.data.msg,
								onHide () {
									_this.fetchData();
									_this.getUserAttribute();
								}
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
			// updateVoucher () {
			// 	let _this = this;
  	// 	 	_this.$http.post('/api/userInfo/userAttribute',
	  // 				this.qs.stringify({
			// 				"customerId": this.user.userId
			// 			})
	  // 			).then(function(e) {
	  // 				if(e.data.code == 200) {
	  // 					let res = e.data.data;
			// 				_this.$store.commit("updateUserTicketsCount", { ticketsCount: res.ticketsCount });
			// 				_this.$store.commit("updateUserVoucherAmount", { voucherAmount: res.voucherAmount });
			// 				_this.$store.commit("updateUserWalletAmount", { walletAmount: res.walletAmount });
			// 				_this.$store.commit("updateUserIntegralAmount", { integralAmount: res.integralAmount });
	  					
	  // 				} else {
	  // 					_this.$vux.alert.show({
	  // 						content: e.data.msg
	  // 					})
	  // 				}
	  // 			});
			// }
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	$walletBg: $colorRedDeep;

	.wallet {

	}

	.wallet-header {
		padding: 30px 0 20px;
		color: #fff;
		text-align: center;
		background: $walletBg;
		
		p {
			margin-bottom: 10px;
		}

		.money {
			font-size: 30px;
			margin-bottom: 10px;
		}

		.wallet-btn {
			padding: 0 2em;
			line-height: 30px;
			background-color: orange;
			border-radius: $borderRadius;
			display: inline-block;
		}
	}

	.wallet-card-header {
		padding: 0 $padding;
		line-height: $inputH;
		font-size: 18px;
		background-color: $bgGray;
		color: $fontColorBlack;
	}

	.wallet-card-content {

	}

	.wallet-block {
		@include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
		padding: $padding;

		.wallet-block-list {
			display: flex;
			
			div {
				flex: 1;
			}

			span {
				width: 4em;
				text-align: right;
				display: block;
			}
		}

		.title {
			@include ellipsisMore(1);
			color: $fontColorBlack;
			font-size: 14px;
		}

		.wallet-block-list {
			padding-top: 6px;
			color: $fontColorGray;

			.value {
				color: $fontColorBlack;
			}
		}
	}

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