<!-- 
	我的钱包
 -->

<template>
	<div class="wallet">
		<div class="wallet-header">
			<p>钱包余额</p>
			<div class="money">{{ user.walletAmount | numToCash }}</div>
			<div class="wallet-btn" @click="goPage('tixian')">提现</div>
		</div>

		<div class="wallet-content">
			<scroller lock-x :height="-wallet.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offst="200">
		  	<div>
					<card>
			      <div class="wallet-card-header" slot="header">收支明细</div>
			      <div slot="content" class="wallet-card-content">
			      	<div class="wallet-block" v-for="(item, index) in wallet.list" :key="index">
			      		<div class="wallet-block-list">		      			
				      		<div class="title">{{ item.detail }}</div>
				      		<span class="value">{{ item.operateType == 0 ? '-' : '+'}}{{ item.amount }}</span>
			      		</div>

			      		<div class="wallet-block-list">
				      		<div class="time">{{ item.time }}</div>
				      		<span v-if="item.cashStatus" class="status">{{ item.cashStatus }}</span>		      			
			      		</div>
			      	</div>
			      </div>
			    </card>

					<el-load-more :load-all="wallet.loadAll"></el-load-more>
				</div>
			</scroller>
			
		</div>
	</div>
</template>

<script type="text/babel">
  import { mapState } from 'vuex'
	import { Scroller, Card } from 'vux'
	import elLoadMore from 'components/load-more/load-more'

	export default {
		name: 'wallet',
		components: {
			Scroller, elLoadMore, Card 
		},
		data () {
			return {
				wallet: {
					offsetBottom: 220,
					money: '',
					onFetching: false,
					loadAll: false,
					pageNum: 1,
					pageSize: this.wordBook.pageSize,
					list: [
						// {
						// 	title: "《逆向盈利》赚钱快速增长1000倍",
						// 	time: "2017-08-21",
						// 	value: "3980"
						// },{
						// 	title: "《逆向盈利》赚钱快速增长1000倍",
						// 	time: "2017-08-21",
						// 	value: "3980"
						// }
					]
				}
			}
		},
    computed: {
      ...mapState({
        user: state => state.user
      })
    },
		mounted () {
			this.fetchData();
			this.getAll();
		},
		methods: {
			fetchData () {
				let _this = this;
				_this.wallet.onFetching = true;

				this.$http.post('/api/userInfo/getCustomerBill',
					_this.qs.stringify({
						customerId: _this.$store.state.user.userId,
						type: 1,
						pageNum: _this.wallet.pageNum,
						pageSize: _this.wallet.pageSize
					})).then(function(e) {
						if(e.data.code == 200) {
							let list = []
							if(e.data.data.result.length > 0) {							
								list = e.data.data.result.map(function(item, index){
									return {
										id: item.billId,
										amount: item.amount,
										cashStatus: item.status == 1 ? "完成" : "处理中",
										time: item.createTime,
										detail: item.billDetails,
										operateType: item.operateType
									}
								});
							}

							if(list.length < _this.wallet.pageSize) {
								_this.wallet.loadAll = true;
							}

							if(_this.wallet.pageNum == 1){
								_this.wallet.list = list;
							} else {
								_this.wallet.list = _this.wallet.list.concat(list);
							}
							_this.wallet.pageNum++;
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}

						_this.resetView();
					})
			},
			getAll () {
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
			resetView () {
				let _this = this;
				_this.$nextTick(() => {
          _this.$refs.scrollerBottom.reset()
        })
			},
			loadMore () {
				if(this.wallet.onFetching || this.wallet.loadAll) {

				} else {
					this.wallet.onFetching = true;					
					this.fetchData();
				}
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
	
	$walletBg: $colorRedDeep;

	.wallet {

	}

	.wallet-header {
		padding: 30px 0 20px;
		color: #fff;
		text-align: center;
		background: $walletBg;
		
		p {
			margin-bottom: 10px;
		}

		.money {
			font-size: 30px;
			margin-bottom: 10px;
		}

		.wallet-btn {
			padding: 0 2em;
			line-height: 30px;
			background-color: orange;
			border-radius: $borderRadius;
			display: inline-block;
		}
	}

	.wallet-card-header {
		padding: 0 $padding;
		line-height: $inputH;
		font-size: 18px;
		background-color: $bgGray;
		color: $fontColorBlack;
	}

	.wallet-card-content {

	}

	.wallet-block {
		@include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
		padding: $padding;

		.wallet-block-list {
			display: flex;
			
			div {
				flex: 1;
			}

			span {
				width: 4em;
				text-align: right;
				display: block;
			}
		}

		.title {
			@include ellipsisMore(1);
			color: $fontColorBlack;
			font-size: 16px;
		}

		.wallet-block-list {
			padding-top: 6px;
			color: $fontColorGray;

			.value {
				color: $fontColorBlack;
			}
		}
	}
</style>