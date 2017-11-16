<!-- 
	用户中心
 -->

<template>
	<div class="user-center" v-cloak>
		<header>
			<img @click="goPage('personal')" :src="user.img" alt="">
			<div class="header-info">
				<p>{{ user.name }}</p>
				<label>{{ user.level == 'common' ? '普通用户(非会员)' : user.levelName }}</label>
			</div>
			<div class="set" @click="checkLogin({name: 'personal'})"></div>
			<div v-if="user.level == 'common'"  class="shengji" @click="goPage('binding')">会员注册<i class="fa fa-angle-right"></i></div>
			<div v-if="user.level != 'common' && user.level != 'dreamPartner' " class="shengji" @click="submitUpgrade">升级<i class="fa fa-angle-right"></i></div>
		</header>

		<main>
			<div class="user-center-money">
				<div class="user-center-money-block" v-for="(item, index) in moneyDatas" :key="index"  @click="checkLogin({name: item.url}, item.click)">
					<span>{{ item.value }}</span>
					{{ item.name }}
				</div>
			</div>

			<div v-show="item.show" class="user-center-block" v-for="(item, index) in operationDatas" :key="index">
				<div v-if="item.name" class="user-center-block-title">{{ item.name }}</div>
				<div class="user-center-block-content">
					<template v-for="(listItem, listInd) in item.list">
						<div v-if="listItem.show" class="user-center-operate" @click="checkLogin({name: listItem.url}, listItem.click)">
							<div v-if="listItem.new" class="tuijian-tips"></div>
							<i :class="['icon', 'icon-user-' + listItem.icon]"></i>
							{{ listItem.name }}
						</div>
					</template>
				</div>
			</div>

			<div class="user-center-setup">
				<group>
		      <cell :class="{'setup-active': item.new}" v-for="(item, index) in setupDatas" :key="index" :title="item.name" @click.native="checkLogin({name: item.url}, item.click)" is-link>
		      	<div slot="icon" :class="['icon-setup', 'icon', 'icon-user-' + item.icon]"></div>
		      	<div class="member-rights" slot="default">{{ item.desc }}</div>
		      </cell>
		    </group>
			</div>
		</main>
	</div>
</template>

<script type="text/babel">
	import { mapState } from 'vuex'
	import { Group, Cell } from 'vux'
	
	export default {
		components: {
			Group, Cell
		},
		data () {
			return {
				title: '用户中心',
				kefuUrl: 'kefu',
				moneyDatas: [
					{
						value: '',
						name: '门票',
						url: 'ticket',
						query: {},
						value: 0,
						icon: 'ticket',
						click: false, // 不绑定是否可点击
						new: '', // 推广背景
						show: true
					},{
						value: '',
						name: '抵用券',
						url: 'voucher',
						query: {},
						value: 0,
						icon: 'voucher',
						click: false, // 不绑定是否可点击
						new: '', // 推广背景
						show: true
					},{
						value: '',
						name: '积分',
						url: 'integral',
						query: {},
						value: 0,
						icon: 'integral',
						click: false, // 不绑定是否可点击
						new: '', // 推广背景
						show: true
					}
				],
				setupDatas: [
					{
						value: '',
						name: '分享二维码',
						url: 'share',
						icon: 'share',
						click: true, // 不绑定是否可点击
						desc: '分享给好友',
						new: 'share', // 推广背景
						show: true
					},{
						value: '',
						name: '会员中心',
						url: 'upgradeRights',
						icon: 'member',
						desc: '合伙人权益',
						click: true,
						show: true
					},{
						value: '',
						name: '常用名单',
						url: 'friend',
						query: {},
						icon: 'friend',
						click: false, // 不绑定是否可点击
						new: '', // 推广背景
						show: true
					},{
						value: '',
						name: '地址管理',
						url: 'address',
						icon: 'address',
						click: false,
						show: true
					},{
						value: '',
						name: '意见反馈',
						url: 'feedback',
						query: {},
						icon: 'feedback',
						click: true, // 不绑定是否可点击
						new: '', // 推广背景
						show: true
					},
				],
				operationDatas: [
					{
						name: "",
						show: false,
						list: [
							{
								value: '',
								name: '我的客户',
								url: 'customer',
								query: {},
								icon: 'customer',
								click: true, // 不绑定是否可点击
								new: '', // 推广背景
								show: true
							},{
								value: '',
								name: '我的代理',
								url: 'agency',
								query: {},
								icon: 'agent',
								click: true, // 不绑定是否可点击
								show: true
							},{
								value: '',
								name: '我的奖学金',
								url: 'wallet',
								query: {},
								icon: 'wallet',
								click: false, // 不绑定是否可点击
								new: '', // 推广背景
								show: true
							}
						]
					},{
						name: "",
						show: true,
						list: [
							{
								value: '',
								name: '课程订单',
								url: 'orderCourseList',
								query: {},
								icon: 'course',
								click: false, // 不绑定是否可点击
								new: '', // 推广背景
								show: true
							},{
								value: '',
								name: '活动订单',
								url: 'orderActivityList',
								query: {},
								icon: 'activity',
								click: false, // 不绑定是否可点击
								new: '', // 推广背景
								show: true
							},{
								value: '',
								name: '商城订单',
								url: 'orderMallList',
								query: {},
								icon: 'cart',
								click: false, // 不绑定是否可点击
								new: '', // 推广背景
								show: true
							},{
								value: '',
								name: '线上资料',
								url: 'orderSourceList',
								query: {},
								icon: 'file',
								click: false, // 不绑定是否可点击
								new: '', // 推广背景
								show: true
							}
						]
					}
				]
			}
		},
		computed: {
	    ...mapState({
	      user: state => state.user,
	    })
	  },
		mounted () {
			this.$nextTick(function(){
				if(this.$store.state.user.level == 'partner' || this.$store.state.user.level == 'dreamPartner') {
					this.operationDatas[0].show  = true
				}	
			})
			
			this.fetchData();
		},
		updated () {
			this.$nextTick(function(){
				if(this.$store.state.user.level == 'partner' || this.$store.state.user.level == 'dreamPartner') {
					this.operationDatas[0].show  = true
				}	
			})
		},
		methods: {
			fetchData () {
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
	  					_this.moneyDatas.map(function(item, index){
	  						if(index == 0) {
	  							item.value = res.ticketsCount;
	  						} else if (index == 1) {
	  							item.value = res.voucherAmount;
	  						} else if (index == 2) {
	  							item.value = res.integralAmount || 0;
	  						}
	  					});
	  				} else {
	  					_this.$vux.alert.show({
	  						content: e.data.msg
	  					})
	  				}
	  			});
			},
			clearStorage () {
				window.localStorage.clear();
				this.$router.push({name: 'index'})
			},
			checkLogin (url, data) {
				if(!data) {
					if(!this.isLogin()) return false
				}

				if(url.name) {
					if(/http/.test(url.name)) {
						location.href = url.name;
					} else {
						this.$router.push(url); 
					}
				} else {
					this.clearStorage(); 
				}
			},
			upgrade () {
				let _this = this;

				_this.$store.commit('updateLoadingStatus', {isLoading: true});

				_this.$http.post('/api/customer/upgrade',
					_this.qs.stringify({
						customerId: this.$store.state.user.userId,
						type: 0
					})).then(function(e) {
	  				_this.$store.commit('updateLoadingStatus', {isLoading: false});

						_this.$vux.alert.show({
							content: e.data.msg
						})
					});
			},
			submitUpgrade () {
				let _this = this;

				_this.$store.commit('updateLoadingStatus', {isLoading: true});
				_this.$http.post('/api/customer/upgrade',
					_this.qs.stringify({
						customerId: this.$store.state.user.userId,
						type: 1
					})).then(function(e) {
						_this.$store.commit('updateLoadingStatus', {isLoading: false});
						if(e.data.code == 200) {
					  	_this.$router.push({ name: 'upgrade' });
						} else {
							_this.$vux.confirm.show({
								content: e.data.msg,
								"confirmText": "返回",
								"cancelText": "查看",
							  onCancel () {
							  	_this.$router.push({ name: 'upgrade' });
							  },
							  onConfirm () {

							  }
							})
						}
					});
			},
			goPage (url) {
				this.$router.push({ name: url });
			},
		}
	}
</script>

<style lang="scss">
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	.user-center-setup {
		.weui-cells {
			margin-top: 0;
		}
	}
</style>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	// @import '~assets/css/icon';
	
	$userCenterheaderImgW: 60px;
	
	$userCenterIconW: 30px;

	.user-center {
		.icon {
			padding-left: $userCenterIconW + 6px;

			&:before {
				width: $userCenterIconW;
				height: $userCenterIconW;
				margin-top: -$userCenterIconW/2;
			}
		}
	}

	header {
		@extend %clearfix;
		position: relative;
		padding: 20px 0 20px;
		background: $colorOrange;
		color: #fff;

		img {
			float: left;
			width: $userCenterheaderImgW;
			height: $userCenterheaderImgW;
			margin-left: $padding;
			border-radius: $userCenterheaderImgW;
		}
		
		.header-info {
			padding-top: 10px;
			padding-left: $userCenterheaderImgW + $padding + 10px;
			width: 100%;
			line-height: 1.5;
			@extend %clearfix;

			p {
				font-size: 17px;
				width: 60%;
				margin-left: 0;
				@include ellipsisOne();
			}

			label {
				font-size: 14px;
				display: block;
			}
		}

		.shengji {
			position: absolute;
			right: $padding;
			top: 50%;
			line-height: 30px;
			margin-top: -15px;
		
			i {
				text-align: right;
				padding-left: 10px;
			}

		}

		.set {
			position: absolute;
			top: $padding;
			right: $padding;
			width: 24px;
			height: 24px;
			background: url("~assets/img/user-center/user-set.png") no-repeat;
			background-size: 100%;
			display: none;
		}
	}
	
	.user-center-money {
		@extend %clearfix;
		padding: 6px 0;
		border-top: 1px solid #ddd;
		border-bottom: $padding solid $bgGray;
	}

	.user-center-money-block {
		@include halfpxline(0, #ddd, 0, 1px, 0, 0);
		float: left;
		width: 33.33%;
		padding: 5px 0;
		text-align: center;
		background: #fff;
		color: $fontColorGray;
		font-size: 12px;

		span {
			font-size: 16px;
			color: $fontColor;
			display: block;
		}
	}
	
	main {
		@extend %clearfix;
		text-align: center;
	}

	.user-center-order {
		@extend %clearfix;
		text-align: center;
		border-top: $padding solid $bgGray;
	}

	.user-center-block {
		@include halfpxline(0, $bgGray, 1px, 0, 0, 0);
		border-bottom: $padding solid $bgGray;

		.tuijian-tips {
			position: absolute;
			top: 0;
			left: 0;
			width: 53px;
			height: 36px;
			background: url("~assets/img/user-center/share.png") no-repeat;
			background-size: 100%;
		}
	}

	.user-center-block-title {
		line-height: 40px;
		text-indent: $padding;
		text-align: left;
		background: $bgGray;
	}

	.user-center-block-content {
		@extend %clearfix;
		text-align: center;
	}

	.user-center-operate {
		position: relative;
		float: left;
		width: 33.33%;
		height: 80px;
		padding-top: 46px;
		padding-left: 0;
		background-color: #fff;
		
		i {
			position: absolute;
			top: 26px;
			left: 50%;
			margin-left: -15px;
			display: block;
		}
	}

	.user-center-setup {
		border-bottom: $padding solid $bgGray;
		text-align: left;
	}

	.member-rights {
		padding: 0 6px;
		border-radius: 30px;
		color: #fff;
		font-size: 14px;
		background: #fff;
		color: $colorRedDeep;
	}

	.user-center {

		.icon-setup {
			padding-left: 26px;

			&:before {
				width: 20px;
				height: 20px;
				margin-top: -10px;
			}
		}
	}

	.user-center-block-content {
		display: flex;
    font-size: 12px;
	}
</style>