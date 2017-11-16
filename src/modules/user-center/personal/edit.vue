<!-- 
	编辑个人资料
 -->

<template>
	<div class="dn-form personal-edit" v-cloak>
		<group class="dn-form-group">
			<x-input v-if="editKey == 'name'" :title="name.title" :placeholder="name.placeholder" v-model="name.value">
  		</x-input>
			
			<x-input v-if="editKey == 'phone'" :title="phone.title" :placeholder="phone.placeholder" v-model="phone.value">
				<el-verification-code :tel="phone.value" code-type="xiugai" slot="right"></el-verification-code>
			</x-input>
			
			<x-input v-if="editKey == 'phone'" type="tel" :max="6" :title="qrcode.title" :placeholder="qrcode.placeholder" v-model="qrcode.value">
  		</x-input>

			<x-input v-if="editKey == 'weixin'" :title="weixin.title" :placeholder="weixin.placeholder" v-model="weixin.value">
  		</x-input>

  		<template v-if="editKey == 'password'">
				<x-input :title="phone.title" :placeholder="phone.placeholder" v-model="phone.value">
					<el-verification-code :tel="phone.value" code-type="xiugai" slot="right"></el-verification-code>
				</x-input>
				
				<x-input type="tel" :max="6" :title="qrcode.title" :placeholder="qrcode.placeholder" v-model="qrcode.value">
	  		</x-input>

	  		<x-input type="password" v-model="password.value" :title="password.title" :placeholder="password.placeholder">
	      </x-input>
	      
	      <x-input type="password" v-model="sepassword.value" :title="sepassword.title" :placeholder="sepassword.placeholder">
	      </x-input>
  		</template>
		</group>

		<div class="btn">
      <x-button @click.native="submit" type="primary">确定</x-button>
    </div>
	</div>
</template>

<script type="text/babel">
	import { mapState } from 'vuex'
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
				editKey: this.$route.query.key,
				name: {
					value: this.$store.state.user.name,
					key: 'name',
					title: '姓名',
					placeholder: '更新您的姓名',
					isReadonly: false
				},
				idCard: {
					value: this.$store.state.user.idcard,
					key: 'idcard',
					title: '证件号码',
					placeholder: '请输入您的身份证号码', 
					isReadonly: true
				},
				phone: {
					value: this.$store.state.user.mobile,
					key: 'phone',
					title: '手机号',
					placeholder: '更新您的手机号',
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
					value: this.$store.state.user.wxAccount,
					key: 'weixin',
					title: '微信号',
					placeholder: '更新您的微信号',
					isReadonly: false
				},
				password: {
					value: "",
					title: "支付密码",
					placeholder: "请输入支付密码"
				},
				sepassword: {
					value: "",
					title: "确认密码",
					placeholder: "请再次输入支付密码"
				},
			}
		},
		computed: {
	    ...mapState({
	      user: state => state.user,
        loadbar: state => state.loadbar
	    })
		},
		mounted () {
		},
		methods: {
			submit () {
				let _this = this,
						url = '', // 修改微信号
						query = {}; // 参数
				if(_this.editKey == 'name') {
					if(_this.name.value == "") {
						this.$vux.alert.show({
		          content: _this.name.title + '不能为空',
		        })

		        return;
					}
	        url = '/api/userInfo/updateNameOrWxAccount';
	        query = {
	        	customerId: _this.$store.state.user.userId,
	        	name: _this.name.value
	        }
				} else if (_this.editKey == 'phone') {
	        if(_this.phone.value == "") {
						this.$vux.alert.show({
		          content: _this.phone.title + '不能为空',
		        })
		        return;
					} else if (_this.qrcode.value == "") {
						this.$vux.alert.show({
		          content: _this.qrcode.title + '不能为空',
		        })
		        return;
					}
	        url = '/api/userInfo/updateMobile';
	        query = {
	        	customerId: _this.$store.state.user.userId,
	        	mobile: _this.phone.value + '',
	        	verificationCode: _this.qrcode.value + ''
	        }
				} else if (_this.editKey == 'weixin') {
					if(_this.weixin.value == "") {
						this.$vux.alert.show({
		          content: _this.weixin.title + '不能为空',
		        })
		        return;
					}
					url = '/api/userInfo/updateNameOrWxAccount', // 修改微信号
					query = {
	        	customerId: _this.$store.state.user.userId,
						wxAccount: _this.weixin.value
					};
				} else if (_this.editKey == 'password') {
					if(_this.phone.value == "") {
						this.$vux.alert.show({
		          content: _this.phone.title + '不能为空',
		        })
		        return;
					} else if (_this.qrcode.value == "") {
						this.$vux.alert.show({
		          content: _this.qrcode.title + '不能为空',
		        })
		        return;
					} else if(_this.password.value == "" || _this.sepassword.value == "") {
						_this.$vux.alert.show({
		          content: "密码不能为空",
		        })
		        return;
					} else if (_this.password.value != _this.sepassword.value) {
						_this.$vux.alert.show({
		          content: "两次输入密码不一致",
		        })
		        return;
					}
					_this.getPublicKey(_this.password.value);
				}

				if (!_this.$store.state.loadbar.isLoading) {
					_this.$store.commit('updateLoadingStatus', {isLoading: true})
					this.$http.post(url,
							this.qs.stringify(query)
						).then(function(e) {
							_this.$store.commit('updateLoadingStatus', {isLoading: false})
							if(e.data.code == 200) {
								_this.$vux.alert.show({
									content: e.data.msg,
									onHide () {
										_this.getUserInfo(_this.$store.state.user.openId);
										_this.$router.go(-1);
									}
								})
							} else {
								_this.$vux.alert.show({
									content: e.data.msg
								})
							}
					})
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
							_this.setPassword(encrypted);
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
						verificationCode: _this.qrcode.value,
						mobile: _this.phone.value
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
<style lang="scss">
	.dn-form.personal-edit .weui-cell__hd {
		width: auto;
	}

	.personal-edit {
		.weui-cells {
			margin-top: 0;
		}
	}
</style>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	// @import '~assets/css/icon';
	
	.dn-form-group {
		border-top: $uiMarginH solid #fff;
		@include halfpxline(0, $uiMarginBg, 1px, 0, 1px, 0);
	}

	.btn {
		padding: 35px $padding;
	}
</style>