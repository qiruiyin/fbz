<!-- 
	提现
 -->

<template>
	<div class="tixian dn-form">
		<div class="tixian-type">
			<div class="tixian-type-title">选择提现路径</div>
			<checker class="check"
		    	v-model="tixianType.value"
		    	default-item-class="check-item"
		    	selected-item-class="check-item-selected"
		    >
	    	<div>
	      	<checker-item v-for="(item, index) in tixianType.list" :class="['check-' + item.icon]" :key="index" :value="item.value"></checker-item>
	      </div>
	    </checker>
		</div>

		<group>
			<x-input v-model="tixianType.num" placeholder="请输入提下金额">
      	<label slot="label" class="label">提现金额</label>
      </x-input>
		</group>
		<div class="tianxian-tips">最多可提：{{ user.walletAmount }}元</div>
		
		<!-- 支付宝 -->
		<group v-show="tixianType.value == 'alipay' || tixianType.value == ''">
			<x-input v-model="alipay.customerName" placeholder="">
      	<label slot="label" class="label">姓名</label>
      </x-input>
			<x-input v-model="alipay.account" placeholder="">
      	<label slot="label" class="label">支付宝</label>
      </x-input>
			<x-input type="password" v-model="payPwd" placeholder="">
      	<label slot="label" class="label">支付密码</label>
      </x-input>
			<x-input type="tel" v-model="mobile" placeholder="">
      	<label slot="label" class="label">手机号</label>
        <el-verification-code :tel="mobile" code-type="bangding" slot="right"></el-verification-code>
      </x-input>
			<x-input type="tel" :max="6" v-model="smsCode" placeholder="">
      	<label slot="label" class="label">验证码</label>
      </x-input>
		</group>	
		<!-- 微信支付 -->
		<group v-show="tixianType.value == 'weixin'">
			<x-input v-model="weixin.customerName" placeholder="">
      	<label slot="label" class="label">微信昵称</label>
      </x-input>
			<x-input v-model="weixin.account" placeholder="">
      	<label slot="label" class="label">微信号</label>
      </x-input>
			<x-input type="password" v-model="payPwd" placeholder="">
      	<label slot="label" class="label">支付密码</label>
      </x-input>
			<x-input type="tel" v-model="mobile" placeholder="">
      	<label slot="label" class="label">手机号</label>
        <el-verification-code :tel="mobile" code-type="bangding" slot="right"></el-verification-code>
      </x-input>
			<x-input type="tel" :max="6" v-model="smsCode" placeholder="">
      	<label slot="label" class="label">验证码</label>
      </x-input>
		</group>	
		<!-- 银行卡 -->
		<group v-show="tixianType.value == 'bank'">
			<x-input v-model="bank.bankInfo" placeholder="">
      	<label slot="label" class="label">开户行</label>
      </x-input>
			<x-input v-model="bank.account" placeholder="">
      	<label slot="label" class="label">银行卡号</label>
      </x-input>
			<x-input v-model="bank.customerName" placeholder="">
      	<label slot="label" class="label">姓名</label>
      </x-input>
			<x-input type="password" v-model="payPwd" placeholder="">
      	<label slot="label" class="label">支付密码</label>
      </x-input>
			<x-input type="tel" v-model="mobile" placeholder="">
      	<label slot="label" class="label">手机号</label>
        <el-verification-code :tel="mobile" code-type="bangding" slot="right"></el-verification-code>
      </x-input>
			<x-input type="tel" :max="6" v-model="smsCode" placeholder="">
      	<label slot="label" class="label">验证码</label>
      </x-input>
		</group>	

		<div class="btns">
			<x-button type="primary" @click.native="tixian">确认提现</x-button>
		</div>
	</div>
</template>

<script type="text/babel">
	import { mapState } from 'vuex'
	import { Checker, CheckerItem, Group, XInput, XButton } from 'vux'
	import elVerificationCode from 'components/verification-code/verification-code'

	export default {
		name: "tixian",
		components: {
			Checker, CheckerItem, Group, XInput, XButton, elVerificationCode
		},
		data () {
			return {
				title: "提现",
				tixianType: {
					value: "alipay",
					num: '',
					maxNum: 0,
					list: [
						{
							name: "支付宝",
							value: "alipay",
							icon: "alipay"
						},{
							name: "微信",
							value: "weixin",
							icon: "weixin"
						},{
							name: "银行卡",
							value: "bank",
							icon: "bank"
						}
					]
				},
				alipay: {
					customerName: '',
					account: ''
				},
				weixin: {
					customerName: '',
					account: ''
				},
				bank: {
					customerName: '',
					account: '',
					bankInfo: ''
				},
				payPwd: '',
				mobile: "",
				smsCode: ""
			}
		},
		computed: {
	    ...mapState({
	      user: state => state.user,
	    })
	  },
		mounted () {
		},
		methods: {
			fetchData () {
				let _this = this;

			},
			tixian () {
				let _this = this,
						cashType = 1,
						customerName = _this.alipay.customerName,
						account = _this.alipay.account,
						bankInfo = '';
				// cashType 0 支付宝 1微信 2银行卡 

				if(_this.tixianType.num == "") {
					_this.$vux.alert.show({
						content: "提现金额不能为空"
					});
					return false;
				} else if(_this.tixianType.num > _this.user.walletAmount) {
					_this.$vux.alert.show({
						content: "提现金额不能大于最大提现金额"
					});
					return false;
				} else if(_this.tixianType.num == 0) {
					_this.$vux.alert.show({
						content: "提现金额必须大于0"
					});
					return false;
				}

				if(_this.tixianType.value == 'weixin') {
					cashType = 2;
					customerName = _this.weixin.customerName;
					account = _this.weixin.account;
					
					if(customerName == "") {
						_this.$vux.alert.show({
							content: "微信昵称不能为空"
						});
						return false;
					} else if(account == "") {
						_this.$vux.alert.show({
							content: "微信账号不能为空"
						});
						return false;
					}
				} else if(_this.tixianType.value == 'bank') {
					cashType = 3;
					customerName = _this.bank.customerName;
					account = _this.bank.account;
					bankInfo = _this.bank.bankInfo;
					
					if(customerName == "") {
						_this.$vux.alert.show({
							content: "姓名不能为空"
						});
						return false;
					} else if(account == "") {
						_this.$vux.alert.show({
							content: "银行卡号不能为空"
						});
						return false;
					} else if(bankInfo == "") {
						_this.$vux.alert.show({
							content: "开户行不能为空"
						});
						return false;
					}
				} else {
					if(customerName == "") {
						_this.$vux.alert.show({
							content: "姓名不能为空"
						});
						return false;
					} else if(account == "") {
						_this.$vux.alert.show({
							content: "支付宝账号不能为空"
						});
						return false;
					}
				}

				if(_this.mobile.length != 11) {
					_this.$vux.alert.show({
						content: "请输入正确的手机号码"
					});
					return false
				} else if (_this.smsCode == '') {
					_this.$vux.alert.show({
						content: "验证码不能为空"
					});
					return false
				}

				if(_this.payPwd == "") {
					_this.$vux.alert.show({
						content: "密码不能为空"
					});
					return false	
				}

				_this.getPublicKey(_this.payPwd, cashType, customerName, account, bankInfo);
				
			},
			pay (payPwd, cashType, customerName, account, bankInfo) {
				let _this = this;

				this.$http.post('/api/userInfo/cashCommit',
					_this.qs.stringify({
							customerId: _this.$store.state.user.userId,
							type: cashType,
							money: _this.tixianType.num,
							name: customerName,
							account: account,
							payPwd: payPwd,
							mobile: _this.mobile,
							verificationCode: _this.smsCode,
							bankInfo: bankInfo
						})
					).then(function(e) {
						_this.$store.commit('updateLoadingStatus', {isLoading: false});
						if(e.data.code == 200) {
							_this.payPwd = '';
							_this.$router.push({ name: 'tixianDone', query: { cashId: e.data.data } })
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
					})
			},
			getPublicKey (data, cashType, customerName, account, bankInfo) {
				let _this = this;
				let jse = new this.$jsEncrypt.JSEncrypt();

				_this.$store.commit('updateLoadingStatus', {isLoading: true});
				_this.$http.post("/api/pay/publickey", 
					_this.qs.stringify({
						customerId: _this.$store.state.user.userId,
					})).then(function(e) {
						if(e.data.code == 200) {
							jse.setPublicKey(e.data.data);
							let encrypt = jse.encrypt(data);
							_this.pay(encrypt, cashType, customerName, account, bankInfo);
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

<style lang="scss">
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	.dn-form .weui-cell__hd {
		width: 4em;
	}

	.dn-form .vux-x-input.weui-cell input {
		text-indent: .5em;
	}

</style>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	.tixian-type {
		padding: $padding;
		padding-bottom: 0;
	}

	.tixian-type-title {
		
	}

	.check {
		padding-top: $padding;
		text-align: center;

		& > div {
			width: 100%;
			text-align: center;
			display: flex;
		}
	}

	// check
	.check-item {
		position: relative;
	  width: 108px;
	  height: 60px;
	  margin-left: 10px;
	  border-radius: 3px;
	  color: $fontColorBlack;
	  background: url("~assets/img/user-center/tixian/alipay.png") no-repeat;
	  background-size: contain;

	  &:first-child {
	  	margin-left: 0;
	  }

	  &.check-weixin {
	  	background-image: url("~assets/img/user-center/tixian/weixin.png");
	  }
	  &.check-bank {
	  	background-image: url("~assets/img/user-center/tixian/bank.png");
	  }

		&.check-item-selected {

		  &:before {
		  	content: "";
		  	position: absolute;
		  	right: 5px;
		  	bottom: 5px;
		  	width: 12px;
		  	height: 12px;
		  	background: url(~assets/img/icon/active.png) no-repeat;
		  	background-size: 100%;
		  }
		}
	}

	.tianxian-tips {
		line-height: $inputH;
		padding: 0 $padding;
		text-align: right;
		background-color: $bgGray;
	}

	
	@media screen and (max-width: 414px) {
	  .check-item {
			height: 60px;
	  }
	}
	@media screen and (max-width: 375px) {
	  .check-item {
			height: 60px;
	  }
	}
	@media screen and (max-width: 320px) {
	  .check-item {
			height: 50px;
	  }
	}
</style>