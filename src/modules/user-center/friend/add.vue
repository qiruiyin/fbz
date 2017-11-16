<!-- 
	好友新增
 -->

<template>
	<div class="dn-form" v-cloak>
		<group labelWidth="4em">
      <x-input title="姓名" placeholder="请输入姓名" v-model="name"></x-input>
      <x-input title="身份证" placeholder="请输入身份证号" type="tel" v-model="idcard"></x-input>
      <x-input title="联系电话" placeholder="请输入联系电话" type="tel" v-model="mobile"></x-input>
    </group>
		
		<div class="btn">
    	<x-button type="primary" @click.native="submit">确定</x-button>
		</div>
	</div>
</template>

<script type="text/babel">
	import { Group, XInput, XButton  } from 'vux'
	
	export default {
		name: "friendAdd",
		components: {
			Group, XInput, XButton
		},
		data () {
			return {
	      addressDetail: '',
	      name: '',
	      idcard: '',
	      mobile: '',
			}
		},
		mounted () {
			// 获取省信息列表
			// this.getAddressInfo("", 1, "province");
		},
		methods: {
	    submit() {
	    	let _this = this;
	    	if (_this.name == "") {
	    		_this.$vux.toast.show({
	          text: '请输入姓名'
	        })
	    	} else if (_this.idcard == "") {
	    		_this.$vux.toast.show({
	          text: '请输入身份证号码'
	        })
	    	} else if (_this.mobile.length != 11) {
	    		_this.$vux.toast.show({
	          text: '请输入正确的联系电话'
	        })
	    	} else {
					_this.$store.commit('updateLoadingStatus', {isLoading: true});
		  		_this.$http.post('/api/userInfo/addFriendInfo',
		  			this.qs.stringify({
			  			customerId: _this.$store.state.user.userId,
			  			friendId: "",
			  			name: _this.name,
			  			mobile: _this.mobile,
			  			idcard: _this.idcard	
		  			})).then(function(e) {
							_this.$store.commit('updateLoadingStatus', {isLoading: false});
							if(e.data.code == 200) {
								_this.$vux.alert.show({
									content: e.data.msg,
									onHide () {
										_this.$router.go(-1)
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
	
	.check {
		@include halfpxline(0, $borderColor, 1px, 0, 0, 0);
		padding: $padding;
	}

	.btn {
		margin-top: 40px;
		padding: $padding;
	}

</style>
