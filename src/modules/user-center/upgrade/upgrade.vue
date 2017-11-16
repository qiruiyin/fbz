<!-- 
	升级页面
// 用户等级
// 普通用户：common，会员：member ，合伙人： partner ，梦想合伙人： dreamPartner
 -->

<template>
	<div class="upgrade" v-if="user.level" v-cloak>

		<template v-if="user.level == 'common'">
			<div class="upgrade-header">
				<img class="upgrade-header-bg" src="~assets/img/upgrade/upgrade.jpg" alt="">
				<div class="upgrade-header-img">
					<img src="~assets/img/upgrade/upgrade-1.jpg" alt="">						
				</div>
			</div>
			
			<div class="upgrade-content">
				<div class="upgrade-person">
					<img src="~assets/img/upgrade/upgrade-icon-1.png" alt="">
				</div>

				<section>
					<h5>如何成为会员</h5>
					<p>进行实名制注册验证即可成为会员（注册时输入您的真实身份证号及身份证上的名字、手机号）</p>
				</section>

				<section>
					<h5>会员权益：</h5>
					<p>1、首次注册完成，可获得5000积分</p>
					<p>2、享受课程套餐组合优惠及各种活动优惠</p>
					<p>3、线上课程：可获得自己邀请的会员消费总额60%的课程抵用券，可获得会员转介绍的会员消费总额的20%的课程抵用券</p>
					<p>4、线下课程：可获得邀请会员线下课程消费总额10%的课程抵用券</p>
				</section>

				<section>
					<h5>备注：</h5>
					<p>1、积分：按照消费给予积分，每消费1元获得1积分（积分仅用于下载资料）</p>
					<p>2、抵用券：抵用券可用于抵扣线上、线下课程及商城消费，不可提现</p>
				</section>
			</div>

			<div class="btns">	
				<x-button type="primary" @click.native="submitUpgrade">会员注册</x-button>
			</div>
		</template>

		<template v-if="user.level == 'member'">
			<div class="upgrade-header">
				<img class="upgrade-header-bg" src="~assets/img/upgrade/upgrade.jpg" alt="">
				<div class="upgrade-header-img">
					<img src="~assets/img/upgrade/upgrade-1.jpg" alt="">						
				</div>
			</div>
			
			<div class="upgrade-content">
				<div class="upgrade-person">
					<img src="~assets/img/upgrade/upgrade-icon-1.png" alt="">
					<p>{{ user.levelName }}</p>
				</div>
				<section>
					<h5>升级合伙人条件：<span>满足以下一项即可升级</span></h5>
					<p>1、自己消费满1万元</p>
					<p>2、购买1万元课程券</p>
					<p>3、邀请的好友消费满3万</p>
					<p class="p-strong">4、邀请3位会员并产生消费</p>
				</section>

				<section>
					<h5>合伙人权益：</h5>
					<p>1、线上课程：自己邀请的会员提成60%，会员转介绍的会员20%</p>
					<p>2、线下课程：自己邀请的会员提成20%，会员转介绍的会员10%</p>
					<p>3、享受课程套餐组合优惠及各种活动优惠</p>
				</section>

				<section>
					<h5>备注：</h5>
					<p>1、积分：按照消费给予积分，每消费1元获得1积分（积分仅用于下载资料）</p>
					<p>2、抵用券：抵用券可用于抵扣线上、线下课程及商城消费，不可提现</p>
					<p>3、奖学金：所有的提成即为奖学金，奖学金可以提现</p>
				</section>

				<div class="btns">	
					<x-button type="primary" @click.native="submitUpgrade">升级合伙人</x-button>
				</div>
			</div>
		</template>

		<template v-if="user.level == 'partner'">
			<div class="upgrade-header">
				<img class="upgrade-header-bg" src="~assets/img/upgrade/upgrade.jpg" alt="">
				<div class="upgrade-header-img">
					<img src="~assets/img/upgrade/upgrade-2.jpg" alt="">						
				</div>
			</div>
			
			<div class="upgrade-content">
				<div class="upgrade-person">
					<img src="~assets/img/upgrade/upgrade-icon-2.png" alt="">
					<p>{{ user.levelName }}</p>
				</div>

      	<section>
					<h5>升级梦想合伙人条件：<span>满足以下一项即可升级</span></h5>
					<p>1、购买5万抵用券</p>
					<p>2、自己消费满5万元</p>
					<p class="p-strong">3、邀请3位合伙人（含邀请的会员升级的合伙人）</p>
				</section>

				<section>
					<h5>梦想合伙人权益：</h5>
					<p>1、线上课程：自己邀请的会员提成60%，会员转介绍的会员20%</p>
					<p>2、线下课程：自己邀请的会员提成25%，会员转介绍的会员15%</p>
					<p>3、梦想合伙人可以得到所发展全部合伙人及其会员的分成：线下课程5%（注：梦想合伙人发展的合伙人再发展的合伙人仍归属于此梦想合伙人）</p>
					<p>4、享受课程套餐组合优惠及各种活动优惠</p>
				</section>

				<section>
					<h5>备注：</h5>
					<p>1、积分：按照消费给予积分，每消费1元获得1积分（积分仅用于下载资料）</p>
					<p>2、抵用券：抵用券可用于抵扣线上、线下课程及商城消费，不可提现</p>
					<p>3、奖学金：所有的提成即为奖学金，奖学金可以提现</p>
				</section>

				<div class="btns">
					<x-button type="primary" @click.native="submitUpgrade">升级梦想合伙人</x-button>
				</div>
			</div>
		</template>

		<img class="upgrade-img" src="~assets/img/upgrade/upgrade-bottom.jpg" alt="">
	</div>
</template>

<script type="text/babel">
	import { mapState } from 'vuex'
	import { XButton, Tab, TabItem, Swiper, SwiperItem } from 'vux'

	export default {
		name: "upgrade",
		components: {
			XButton, Tab, TabItem, Swiper, SwiperItem
		},
		data () {
			return {
				tabSelected: 0
			}
		},
		computed: {
	    ...mapState({
	      user: state => state.user,
	    })
	  },
		methods: {
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
							_this.$vux.alert.show({
								content: e.data.msg
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
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	.upgrade-header {
		position: relative;
		width: 100%;
		background: url("~assets/img/upgrade/upgrade.jpg") no-repeat;
		background-size: 100%;

		img {
			width: 100%;
		}

		.upgrade-header-bg {
			position: relative;
			width: 100%;
			visibility: hidden;
		}

		.upgrade-header-img {
			position: absolute;
			top: 0;
			height: 100%;
			width: 100%;
			display: flex;
			align-items: center;
		}
	}

	.upgrade-img {
		width: 100%;
		margin-top: 20px;
	}

	.upgrade-content {
		section {
			padding: $padding $padding + 10px 10px;
			border-bottom: 2px dotted $uiMarginBg;

			&:last-child {
				border-bottom: 0 solid $uiMarginBg;
			}
		}

		h5 {
			padding-bottom: 10px;
			font-size: 16px;
			color: $fontColorBlack;
		}

		p {
			line-height: 1.35;
			text-align: justify;
			margin-bottom: 6px;
		}
	}

	.upgrade-person {
		padding: 20px 0 0;
		display: none;

		img {
			width: 40px;
			margin: 0 auto;
		}

		p {
			line-height: 2.5;
			text-align: center;
			font-size: 16px;
		}
	}

	.p-strong {
		color: $colorRedDeep;
	}
</style>