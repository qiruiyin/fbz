<template>
	<div class="dn-form bangding" v-cloak>
		<p class="bangding-tips">根据国家网络安全相关要求，请进行实名验证注册！</p>
		<group>
      <x-input v-model="bangding.name.value" :title="bangding.name.title" :placeholder="bangding.name.placeholder">
      </x-input>
      <x-input v-model="bangding.idCard.value" :title="bangding.idCard.title" :placeholder="bangding.idCard.placeholder">
      </x-input>
<!-- 
      <x-input v-model="bangding.password.value" :title="bangding.password.title" :placeholder="bangding.password.placeholder">
      </x-input>
      
      <x-input v-model="bangding.sepassword.value" :title="bangding.sepassword.title" :placeholder="bangding.sepassword.placeholder">
      </x-input> -->

      <x-input type="tel" :title="bangding.tel.title" v-model="bangding.tel.value" :placeholder="bangding.tel.placeholder" class="weui-vcode">
        <el-verification-code :tel="bangding.tel.value" code-type="bangding" slot="right"></el-verification-code>
      </x-input>

      <x-input type="tel" :max="6" :title="bangding.code.title" v-model="bangding.code.value" :placeholder="bangding.code.placeholder">
      </x-input>
    </group>
		
		<div class="btns">
			<x-button type="primary" @click.native="submitBangDing">确定</x-button>
		</div>

		<!-- <p class="bangding-tips bangding-tips-bottom">请设置本公众号内积分、抵用券、门票及奖学金支付和提现的密码，请注意妥善保管！</p> -->
		
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
					name: {
						value: "",
						title: "姓名",
						placeholder: "请输入身份证姓名"
					},
					idCardType: {
						title: "证件类别",
						list: [
							{key: '1', value: '身份证'},
							{key: '2', value: '护照'}
						],
						value: "1"
					},
					idCard: {
						value: "",
						title: "身份证",
						placeholder: "请输入身份证号码"
					},
					password: {
						value: "",
						title: "提现及支付密码",
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
				if(_this.bangding.name.value == "") {
					_this.$vux.alert.show({
	          content: "姓名不能为空",
	        })
				} else if(_this.bangding.idCard.value == "") {
					_this.$vux.alert.show({
	          content: "身份证号不能为空",
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
					_this.$store.commit('updateLoadingStatus', {isLoading: true});

					_this.$http.post("/api/customer/binding", 
						_this.qs.stringify({
							customerId: _this.$store.state.user.userId,
							name:  _this.bangding.name.value,
							idcard: _this.bangding.idCard.value,
							verificationCode: _this.bangding.code.value,
							mobile: _this.bangding.tel.value,
						})).then(function(e) {
							_this.$store.commit('updateLoadingStatus', {isLoading: false});
							if(e.data.code == 200) {
								_this.$vux.alert.show({
									content: e.data.msg,
									onHide () {
										_this.getUserInfo(_this.$store.state.user.openId, -1);
									}
								})
							} else {
								_this.$vux.alert.show({
									content: e.data.msg
								})
							}
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	// @import '~assets/css/icon';
	
	.bangding-tips {
		padding: 6px $padding 0;
		color: $fontColorGray;
		font-size: 12px;
		// color: $colorRedDeep;

		&.bangding-tips-bottom {
			margin-bottom: 60px;
		}
	}
</style>