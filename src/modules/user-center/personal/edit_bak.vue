<!-- 
	编辑个人资料
 -->

<template>
	<div class="dn-form personal-edit" v-cloak>
		<group>
			<x-input @on-change="nameTestNum" :title="name.title" :placeholder="name.placeholder" v-model="name.value">
  			<label slot="label" class="label icon icon-user">{{ name.title }}</label>
  		</x-input>

  		<x-input :title="idCard.title" :placeholder="idCard.placeholder" v-model="idCard.value" readonly>
				<label slot="label" class="label icon icon-idCard">{{ idCard.title }}</label>
			</x-input>
			
			<x-input :title="phone.title" :placeholder="phone.placeholder" v-model="phone.value">
  			<label slot="label" class="label icon icon-tel">{{ phone.title }}</label>
				<el-verification-code :tel="phone.value" code-type="xiugai" slot="right"></el-verification-code>
			</x-input>
			
			<x-input type="tel" :max="6" :title="qrcode.title" :placeholder="qrcode.placeholder" v-model="qrcode.value">
  			<label slot="label" class="label icon icon-qrcode">{{ qrcode.title }}</label>
  		</x-input>
			
			<x-input :title="weixin.title" :placeholder="weixin.placeholder" v-model="weixin.value">
  			<label slot="label" class="label icon icon-weixin">{{ weixin.title }}</label>
  		</x-input>
		</group>

		<div class="btn">
      <x-button @click.native="submit" type="primary">确定</x-button>
    </div>
	</div>
</template>

<script type="text/babel">
	import { XInput, Group, XButton, Toast } from 'vux'
	import elVerificationCode from 'components/verification-code/verification-code'

	export default {
		components: {
			XInput, Group, XButton, Toast, elVerificationCode
		},
		data () {
			return {
				title: "修改个人资料",
				btnStatus: false,
				name: {
					value: '',
					key: 'name',
					title: '姓名',
					placeholder: '请输入您真实姓名',
					isReadonly: false
				},
				idCard: {
					value: '',
					key: 'idcard',
					title: '证件号码',
					placeholder: '请输入您的身份证号码', 
					isReadonly: true
				},
				phone: {
					value: '',
					key: 'phone',
					title: '手机号',
					placeholder: '请输入您的手机号',
					isReadonly: false
				},
				qrcode: {
					value: '',
					key: 'qrcode',
					title: '验证码',
					placeholder: '请输入手机验证码', 
					isReadonly: false
				},
				weixin: {
					value: '',
					key: 'weixin',
					title: '微信',
					placeholder: '请输入微信号码（选填）',
					isReadonly: false
				}
			}
		},
		computed: {

		},
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData() {
				let _this = this;
				this.$http.post('/wechat/usercenter/getCustomerInfo',
						{
							"customerCode": _this.$store.state.user.userCode,
						}
					).then(function(e) {
						let responseData = e.data.data,
								arr = [],
								data;
						if(e.data.code == 200) {
							data = responseData.customerInfoList[0];
							_this.name.value = data.NAME;
							_this.idCard.value = data.idcard;
							_this.phone.value = data.mobile;
							_this.weixin.value = data.weixinAccount;
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
					}
				);
			},
			submit () {
				let _this = this;
				if(_this.name.value == "") {
					this.$vux.toast.show({
	          text: '姓名不能为空',
	        })
				} else if (_this.phone.value == "") {
					this.$vux.toast.show({
	          text: '手机号码不能为空',
	        })
				} else if (_this.qrcode.value == "") {
					this.$vux.toast.show({
	          text: '验证码不能为空',
	        })
				} else if (_this.btnStatus) {
					return false;
				} else {
					_this.btnStatus = true;
					this.$http.post('/wechat/usercenter/updateCustomerInfo',
							{
								"code": _this.$store.state.user.userCode,
								"name": _this.name.value,
								"mobile": _this.phone.value,
								"idcard": _this.idCard.value,
								"smsCode": _this.qrcode.value,
								"weixinAccount": _this.weixin.value
							}
						).then(function(e) {
							if(e.data.code == 200) {
								_this.$vux.alert.show({
									content: e.data.msg
								})
							} else {
								_this.$vux.alert.show({
									content: e.data.msg
								})
							}
							_this.btnStatus = false;
					})
				}
			},
	    // nameTestNum (data) {
	    // 	if(/[0-9]/.test(data) || /^.*[~!@#\$%\^&\*\(\)_+\-=\[\]\{\}\\\|\'\";:,\<\.\>\/\?\s+].*$/.test(data)) {
	    // 		this.$vux.toast.text(this.nameTip);
	    // 		return true;
	    // 	}
	    // 	return false;
	    // }
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	// @import '~assets/css/icon';

	.btn {
		padding: 30px $padding;
	}
</style>