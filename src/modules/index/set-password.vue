<!-- 
	设置支付密码
 -->

<template>
	<div class="dn-form bangding" v-cloak>
		<!-- <p class="bangding-tips">根据国家网络安全相关要求，请进行实名验证注册！</p> -->
		<p class="bangding-tips">请设置本公众号内积分、抵用券、门票及奖学金支付和提现的密码，请注意妥善保管！</p>
		<group>
      <x-input v-model="bangding.password.value" type="password" :title="bangding.password.title" :placeholder="bangding.password.placeholder">
      </x-input>
      
      <x-input v-model="bangding.sepassword.value" type="password" :title="bangding.sepassword.title" :placeholder="bangding.sepassword.placeholder">
      </x-input>

      <x-input type="tel" :title="bangding.tel.title" v-model="bangding.tel.value" :placeholder="bangding.tel.placeholder" class="weui-vcode">
        <el-verification-code :tel="bangding.tel.value" code-type="bangding" slot="right"></el-verification-code>
      </x-input>

      <x-input type="tel" :max="6" :title="bangding.code.title" v-model="bangding.code.value" :placeholder="bangding.code.placeholder">
      </x-input>
    </group>
		
		<div class="btns">
			<x-button type="primary" @click.native="submitBangDing">确定</x-button>
		</div>

	</div>
</template>

<script type="text/babel">
  import { mapState } from 'vuex'
	import hold from 'src/commons/hold'
	import { Group, Selector, XInput, XButton } from 'vux'
	import elVerificationCode from 'components/verification-code/verification-code'

	export default {
		naem: 'bangding',
		components: { Group, Selector, XInput, XButton, elVerificationCode },
		data () {
			return {
				title: "绑定页面",
				bangding: {
					password: {
						value: "",
						title: "密码",
						placeholder: "请输入密码"
					},
					sepassword: {
						value: "",
						title: "确认密码",
						placeholder: "请再次输入密码"
					},
					tel: {
						value: "",
						title: "手机号",
						placeholder: "请输入手机号码"
					},
					code: {
						value: "",
						title: "验证码",
						placeholder: "请输入验证码"
					},
				}
			}
		},
		methods: {
			submitBangDing () {
				let _this = this;
				if(_this.bangding.password.value == "") {
					_this.$vux.alert.show({
	          content: "密码不能为空",
	        })
				} else if(_this.bangding.sepassword.value == "") {
					_this.$vux.alert.show({
	          content: "身份证号不能为空",
	        })
				} else if(_this.bangding.password.value != _this.bangding.sepassword.value) {
					_this.$vux.alert.show({
	          content: "两次密码输入不一致",
	        })
				} else if(_this.bangding.tel.value.length != 11) {
					_this.$vux.alert.show({
	          content: "请输入正确的手机号码",
	        })
				} else if (_this.bangding.code.value == "") {
					_this.$vux.alert.show({
	          content: "验证码不能为空",
	        })
				} else {
					_this.getPublicKey();
				}
			}, 
			getPublicKey () {
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
							let encrypted = jse.encrypt(_this.bangding.password.value);
							_this.setPassword(encrypted);
							// _this.$store.commit('updateUserHasPayPwd', {hasPayPwd: 1});
							// _this.$router.go(-1);
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
				});
			},
			setPassword (pwd) {
				let _this = this;

				_this.$store.commit('updateLoadingStatus', {isLoading: true});
				_this.$http.post("/api/customer/updatePayPwd", 
					_this.qs.stringify({
						customerId: _this.$store.state.user.userId,
						payPwd: pwd,
						verificationCode: _this.bangding.code.value,
						mobile: _this.bangding.tel.value
					})).then(function(e) {
						_this.$store.commit('updateLoadingStatus', {isLoading: false});
						if(e.data.code == 200) {
							_this.$store.commit('updateUserHasPayPwd', {hasPayPwd: 1});
							_this.$router.go(-1);
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
	
	.bangding-tips {
		padding: 6px $padding 0;
		color: $fontColorGray;
		font-size: 12px;

		&.bangding-tips-bottom {
			margin-bottom: 60px;
		}
	}
</style>