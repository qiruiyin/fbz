<!-- 
	个人信息
 -->

<template>
	<div class="personal">
		<group>
			<cell class="personal-header" title="头像">
				<img slot="after-title" :src="user.img" alt="">
			</cell>
			<cell title="姓名" :value="user.name" @click.native="goPage('personalEdit', { key: 'name' })" is-link></cell>
			<cell title="分享二维码" @click.native="goPage('share')" is-link>
				<div slot="after-title" class="fa fa-qrcode"></div>
			</cell>
			<cell title="证件号码" :value="user.idcard | centerToStar(2, 4)"></cell>
			<cell title="手机号" :value="user.mobile | centerToStar(3, 4)" @click.native="goPage('personalEdit', { key: 'phone' })" is-link></cell>
			<cell title="密码设置" @click.native="goPage('personalEdit', { key: 'password' })" is-link></cell>
			<cell title="微信" :value="user.wxAccount" @click.native="goPage('personalEdit', { key: 'weixin' })" is-link></cell>
		</group>
	</div>
</template>

<script type="text/babel">
	import { mapState } from 'vuex'
	import { Group, Cell } from 'vux'

	export default {
		name: "personal",
		components: {
			Group, Cell
		},
		data () {
			return {
				userData: {
					name: '',
					idCard: '',
					phone: '',
					weixin: ''
				},
				address: {
					value: '',
					name: '地址管理',
					url: 'address',
					icon: 'address',
					click: false,
					show: true
				},
				modifyName: true
			}
		},
		computed: {
	    ...mapState({
	      user: state => state.user
	    })
	  },
		mounted () {
		},
	  methods: {
	  	fetchData () {
			
	  	},
			checkLogin (url, data) {
				if(data) {
					if(url.name) {
						this.$router.push(url); 
					} else {
						this.clearStorage(); 
					}
				} else {
					if(!this.isLogin()) return false

					this.$router.push(url);
				}
			},
			goPage (url, query) {
				this.$router.push({ name: url, query: query });
			}
	  }
	}
</script>

<style lang="scss">
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	.personal {
		.weui-cell_access .weui-cell__ft:after {
			width: 10px;
			height: 10px;
		}

		.weui-cells {
			margin-top: 0;
			border-top: $uiMarginH solid $uiMarginBg;

			&:before {
				border-top: 0;
			}
			&:after {
				border-bottom: 0;
			}
		}
	}
</style>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	// @import '~assets/css/icon';

	.personal {
		& > div:last-child {
			border-bottom: 1px solid $uiMarginBg;
		}
	}

	.personal-header {
		position: relative;
		height: 40px;

		img {
			position: absolute;
			top: 50%;
			right: $padding;
			width: 40px;
			margin-top: -20px;
		}
	}

	.fa {
		position: absolute;
		right: $padding + 18px;
		top: 50%;
		margin-top: -8px;
	}

</style>