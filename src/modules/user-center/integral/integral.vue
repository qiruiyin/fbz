<!-- 
	我的推广积分页面
 -->

<template>
	<div class="integral" v-cloak>
		<div class="container">
			<div class="integral-header">
				<img src="~assets/img/user-center/integral.png" alt="">
				<p>我的积分：{{ user.integralAmount }}分</p>
				
				<div class="btns">
					<x-button type="primary" @click.native="goPage('share')">分享给好友</x-button>				
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/babel">
	import { mapState } from 'vuex'
	import { Tab, TabItem, Swiper, SwiperItem, XButton } from 'vux'

	export default {
		name: 'integral',
		components: { Tab, TabItem, Swiper, SwiperItem, XButton },
		data () {
			return {
				title: '我的积分',
				tabChangeW: this.wordBook.tabChangeW,
				integral: 0,
				tabDatas: [
					{
						value: 'type1',
						title: '已邀请普通学员',
						num: '',
						tip: "关注时间",
						list: []
					},{
						value: 'type2',
						title: '已报名总裁商业思维',
						num: '',
						tip: "报名时间",
						list: []
					}
				],
				tabSelected: 0,
				tabContentDatas: {
					type1: [],
					type2: []
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
		},
		methods: {
			fetchData() {
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
			transData (data, name) {
				let _this =this,
						arr = [];
				if(data) {
					data.map(function(item, index){
						arr[index] = {
							id: item.id,
							code: item.code,
							name: item.name,
							img: _this.resolveImg(item.header),
							date: item.create_time,
							openId: item.openid
						}
					});
				}
				_this.tabContentDatas[name] = arr;
			},
			goMsg (sendOpenId, name) {
				this.$router.push({ name: 'msgDetail', query: { sendUser: sendOpenId, msgType: '3' }})
			},
			goPage (url) {
				this.$router.push({ name: url })
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
  $imgW: 44px;
  
	.integral {

	}

	.integral-header {
		padding: 40px $padding $padding;
		text-align: center;
		line-height: 1.75;
		color: $colorRed;

		img {
			max-width: 96px;
			margin: 0 auto;
			margin-bottom: $padding;
		}
	}

	.integral-man {
  	padding: $padding;
  	display: flex;
		@include halfpxline(0, $borderColor, 1px, 0, 1px, 0);

  	img {
  		width: $imgW;
  		height: $imgW;
  		border-radius: $imgW;
  	}
		
		.title {
			padding-left: $padding;
			flex: 1;
		}

  	p {
			font-size: 18px;
  	}
  }

  .info {
  	position: absolute;
  	right: $padding;
		top: 50%;
		width: 22px;
		height: 22px;
		background: url("~assets/img/icon/integral-msg.png") no-repeat;
		background-size: 100%;
		font-size: 20px;
		line-height: 1;
		margin-top: -10px;
  }
	
	.link {
		margin-top: 10px;
		line-height: 30px;
		background: #ff4545;
		color: #fff;
		padding: 0 1em;
		display: inline-block;
		border-radius: 100px;
	}
	
	.vux-tab-item {
		padding: 6px 0;
	}

	.dn-tab-p {
		line-height: 1;
	}

	.btns {
		margin-top: 40px;
	}
</style>