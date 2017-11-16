<!-- 
	提现完成
 -->

<template>
	<div class="tixian-done">
		<div class="tixian-done-header">
			<img src="~assets/img/user-center/tixian/time.png" alt="">
			提现申请已提交
		</div>
		<div class="tixian-done-content">
			<group>
	      <cell v-if="bankInfo.value" :title="bankInfo.title" :value="bankInfo.value"></cell>
	      <!-- <cell :title="customerName.title" :value="customerName.value"></cell> -->
	      <cell :title="account.title" :value="account.value"></cell>
	      <cell :title="amount.title" :value="amount.value"></cell>
	      <cell :title="time.title" :value="time.value"></cell>
	    </group>

	    <div class="btns">
	    	<x-button type="primary" @click.native="goPage">完成</x-button>
	    </div>
		</div>
	</div>
</template>

<script type="text/babel">
	import { Group, Cell, XButton } from 'vux'

	export default {
		name: "tixianDone",
		components: {
			Group, Cell, XButton
		},
		data () {
			return {
				title: "",
				customerName: {
					title: '',
					value: ''
				},
				account: {
					title: '',
					value: ''
				},
				bankInfo: {
					title: '开户行',
					value: ''
				},
				amount: {
					title: '提现金额',
					value: ''
				},
				time: {
					title: "预计到账时间",
					value: ""
				}
			}
		},
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData () {
				let _this = this;

				this.$http.post('/api/userInfo/cashDetail',
					_this.qs.stringify({
						customerId: _this.$store.state.user.userId,
						cashId: _this.$route.query.cashId
					})).then(function(e) {
						if(e.data.code == 200) {
							let cashInfo = e.data.data;
							if(cashInfo.cashType == '微信') {
								_this.account.title = '微信号';
								_this.customerName.title = '微信昵称';
							} else if(cashInfo.cashType == '银行卡') {
								_this.account.title = '银行卡号';
								_this.customerName.title = '姓名';
							} else {
								_this.account.title = '支付宝';
								_this.customerName.title = '姓名';
							}

							_this.customerName.value = cashInfo.customerName;
							_this.account.value = cashInfo.cashAccount;
							_this.bankInfo.value = cashInfo.bankInfo;
							_this.amount.value = cashInfo.cashAmount + " ￥";
							_this.time.value = cashInfo.paymentDate;
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
					})
			},
			goPage () {
				this.$router.push({ name: 'wallet' });
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	.tixian-done {
		width: 100%;
		height: 100%;
		background: $bgGray;
	}

	.tixian-done-header {
		padding: 40px 0 30px;
		line-height: 3;
		text-align: center;
		font-size: 18px;
		color: $fontColorBlack;

		img {
			width: 80px;
			margin: 0 auto;
		}
	}

	.btns {
		padding-top: 30px;
	}
</style>