<!-- 
	门票券
 -->

<template>
	<div class="ticket">
		<divider v-if="scrollerInfo.list.length == 0">暂时无信息</divider>
		<scroller lock-x :height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offst="200">
			<div class="ticket-content">
				<div class="ticket-block" v-for="(item, index) in scrollerInfo.list" :key="index">
					<div :class="['ticket-block-content', { 'active': item.tips }]">
						<div class="ticket-block-left">
							<div class="ticket-block-img">
								<img :src="item.img" alt="">
							</div>
							<div class="ticket-block-info">
								<h5>{{ item.name }}</h5>
								<span>{{ item.remark }}</span>
								<p>截止日期：{{ item.time }}</p>
							</div>
						</div>
						<div class="ticket-block-right">
							<p>
								<span>门票价值</span>
								<label><i>￥</i>{{ item.price }}</label>
							</p>
						</div>	
					</div>
					<div v-if="item.tips" class="ticket-tips">{{ item.tips }}</div>
				</div>
			</div>
		</scroller>
	</div>
</template>

<script type="text/babel">
	import { Scroller, Divider } from 'vux'
	import elLoadMore from 'components/load-more/load-more'

	export default {
		name: "ticket",
		components: { Scroller, Divider, elLoadMore },
		data () {
			return {
				title: "门票券",
				scrollerInfo: {
					offsetBottom: 60,
					onFetching: false,
					loadAll: false,
					pageNum: 1,
					pageSize: this.wordBook.pageSize,
					list: [
						// {
						// 	img: "",
						// 	code: "",
						// 	name: "",
						// 	remark: "",
						// 	tips: "",
						// 	time: "",
						// 	price: ""
						// }
					]
				}
			}
		},
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData () {
				let _this = this;
				if(this.scrollerInfo.onFetching) return;
				this.scrollerInfo.onFetching = true;			
				this.$http.post('/api/userInfo/getTicketList',
					_this.qs.stringify({
							customerId: _this.$store.state.user.userId,
							pageNum: _this.scrollerInfo.pageNum,
							pageSize: _this.scrollerInfo.pageSize
						})
					).then(function(e) {
						if(e.data.code == 200){
							let list = [];

							if(e.data.data.result && e.data.data.result.length > 0) {
								list = e.data.data.result.map(function(item, index){
									return {
										img: item.ticketsImg,
										id: item.ticketId,
										name: item.ticketsTitle,
										remark: item.remark || "在线支付专享",
										tips: "",
										time: item.ticketTime,
										price: item.ticketsPrice
									}
								})
							}

							if(list.length < _this.scrollerInfo.pageSize) {
								_this.scrollerInfo.loadAll = true;
							}

							if(_this.scrollerInfo.pageNum == 1) {
								_this.scrollerInfo.list = list;
							} else {
								_this.scrollerInfo.list = _this.scrollerInfo.list.concat(list);
							}

							_this.scrollerInfo.pageNum++;
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}

						_this.resetView();
						_this.scrollerInfo.onFetching = false;			
					})
			},
			resetView () {
				let _this = this;
				this.$nextTick(() => {
          this.$refs.scrollerBottom.reset()
        })
			},
			loadMore () {
				if(this.scrollerInfo.onFetching || this.scrollerInfo.loadAll) {

				} else {
	        this.scrollerInfo.onFetching = true;
					this.fetchAgency()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	$ticketRadius: $borderRadius;
	$ticketImgW: 94px;

	.ticket {
		width: 100%;
		height: 100%;
		padding: $padding;
		background: $bgGray;
	}

	.ticket-block {
		margin-bottom: $padding;
	}

	.ticket-block-content {
		display: flex;

		&.active {
			.ticket-block-left {
				border-radius: $ticketRadius 0 0 $ticketRadius;
			}
			.ticket-block-right {
				border-radius: 0 $ticketRadius $ticketRadius 0;
				border-left: 0;
			}
		}
	}

	.ticket-block-left {
		position: relative;
		flex: 1;
		background: #fff;
		border-radius: $ticketRadius;

		.ticket-block-img {
			position: absolute;
			left: $padding/2;
			top: 0;
			width: $ticketImgW;
			height: 100%;
			// border-radius: $ticketImgW;
			overflow: hidden;
			display: flex;
			align-items: center;

			img {
				width: 100%;
				// height: 100%;
			}
		}

		.ticket-block-info {
			width: 100%;
			padding: $padding/2;
			padding-left: $ticketImgW + $padding;

			h5 {
				font-size: 16px;
				@include ellipsisOne();
			}

			p {
				font-size: 12px;
			}

			span {
				@include ellipsisOne();
				font-size: 12px;
				color: $fontColorGray;
			}
		}
	}

	.ticket-block-right {
		position: relative;
		width: 6em;
		background: #fff;
		border-radius: $ticketRadius;
		display: flex;
		align-items: center;
		text-align: center;
		border-left: 2px dashed $borderColor;

		span {
			font-size: 12px;
			color: $fontColorGray;
			display: block;
		}

		label {
			font-size: 16px;
			color: $colorYellowEasy;

			i {
				font-style: normal;
				font-size: 10px;
			}
		}
	}

	.ticket-tips {
		width: 100%;
		border-top: 2px dashed $borderColor;
		padding: 0 $padding/2;
		line-height: 30px;
		border-radius: $ticketRadius;
		color: $fontColorGray;
		background: #fff;
	}
</style>