<!-- 
	主题详情卡片
	lessonCommodityList: 课程列表
	orderProductList: 商城订单
 -->
<template>
	<div class="card-order-list" v-cloak>
	  <scroller lock-x :height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offst="200">
			<div>
				<div class="card" v-for="(item, index) in cardData" :key="index">
					<div class="card-header">
						<p>订单号：{{ item.orderNo }}</p>
						<span>{{ item.status }}</span>
					</div>
					<div class="card-content">
						<el-card-course v-if="!item.orderProductList" :card-course-data="item"></el-card-course>
						<el-card-mall v-else :card-mall-data="productItem" v-for="(productItem, productIndex) in item.orderProductList" :key="productIndex"></el-card-mall>
					</div>

					<div class="card-footer">
						<!-- 显示商品总量 -->
						<div v-if="item.orderProductList" class="card-all-info">
							<p>共<span>{{ item.count }}</span>件商品 <span>合计金额</span>：<span>￥{{ item.actualAmount }}</span></p>
						</div>
						
						<div class="card-footer-btn">
							<!-- 支付状态 -->
							<template v-if="item.orderStatus == 0">
								<x-button class="btn" @click.native="deleteOrder(item, index)" mini>取消</x-button>
								<x-button class="btn" @click.native="payment(item)" mini>立即支付</x-button>
								<!-- 快递状态 -->
								

								<!-- <template v-if="item.expressType == 2">
									<x-button class="btn" @click.native="goComment(item)" mini>评价</x-button>
								</template> -->

								<!-- 改签状态 -->
								<!-- <template v-if="(item.ticketType == '' || item.ticketType == 0) && item.num == 1">
									<x-button class="btn" @click.native="ticketChange(item.commodityCode, item.lessonCode)" mini>改签</x-button>
								</template> -->

								<!-- 二维码 -->
								<!-- <template v-if="item.ticketCode">
									<x-button class="btn" @click.native="goSigncode(item.ticketCode)" mini>二维码</x-button>
								</template> -->

								<!-- <template v-if="item.ticketType == 1">
									<x-button class="btn" @click.native="ticketReview(item.code)" mini>见证</x-button>
								</template> -->
							</template>

							<template v-if="(item.orderStatus == 1 || item.orderStatus == 2) && item.orderType == 1">
								<x-button class="btn" @click.native="confirmOrder(item, index)" mini>确认收货</x-button>
 								
								<!-- <x-button class="btn" @click.native="payment(item)" mini>立即支付</x-button> -->
							</template>


						</div>
					</div>
				</div>
				
				<el-load-more :load-all="onFetchAll"></el-load-more>

			</div>
		</scroller>

	</div>
</template>

<script type="text/babel">
	import { Scroller, Panel, Group, Cell, Radio, XNumber, XButton, LoadMore, Divider, Popup, Selector, TransferDom } from 'vux'
	
	import elCardCourse from 'components/card/card-course'
	import elCardMall from 'components/card/card-mall'
	import elLoadMore from 'components/load-more/load-more'

	export default {
		name: 'card',
		directives: {
	    TransferDom
	  },
		components: { Scroller, Panel, XNumber, Group, Cell, XButton, Popup, Selector, elCardCourse, elCardMall, elLoadMore },
		props: ['cardData', 'cardCount', 'cardIndex', 'onFetching', 'onFetchAll'],
		data () {
			return {
				title: '卡片',
				scrollerInfo: {
					offsetBottom: 120,
					onfetching: false,
					loadAll: false, // 是否加载完
				},
				cardList: [
					// { // 数据结构已经改的有点乱，此处只有参考价值
					// 	// icon: '',
					// 	// code: '',
					// 	// title: "富班长",
					// 	// actualAmount: '',
					// 	// amount: '',
					// 	// status: '',
					// 	// img: '',
					// 	// num: '',
					// 	// paymentType: '', // 是否
					// 	// status: '', // 支付状态
					// 	// orderProductList: [],
					// 	// time: '',
					// 	// expressCompany: '',
					// 	// expressNumber: '',
					// }
				],
				ticketChangeData: {
					show: false,
					title: "",
					lessonCode: "",
					commodityCode: "",
					list: []
				},
			}
		},
		watch: {
			cardData (newValue, oldValue) {
				let _this = this;
				setTimeout(function(argument) {
					_this.$nextTick(() => {
	          _this.$refs.scrollerBottom.reset()
	        })
				})
			} 
		},
		methods: {
			payment (obj) {
				// 应传code
				this.$router.push({name: "confirmOrder", query: { orderId : obj.orderId, type: obj.type, orderType: obj.orderType }});
			},
			goPage (url, query) {
				this.$router.push({ name: url, query: query })
			},
			deleteOrder (item, ind) {
				let _this = this;
				_this.$vux.confirm.show({
					content: "确认取消订单？",
					onConfirm () {
						_this.$http.post('/api/customer/order/delete',
			  			_this.qs.stringify({
			  				customerId: _this.$store.state.user.userId,
		  					orderId: item.orderId
			  			})).then(function(e) {
			  				if(e.data.code == 200) {
									_this.cardData.splice(ind, 1);
									_this.$vux.toast.show({
										text: "删除成功"
									})
			  				} else {
			  					_this.$vux.alert.show({
			  						content: e.data.msg
			  					})
			  				}
			  		});		
					}
				})
			},
			confirmOrder (item, ind) {
				let _this = this;
				_this.$vux.confirm.show({
					content: "确认完成订单？",
					onConfirm () {
						_this.$http.post('/api/customer/order/change',
			  			_this.qs.stringify({
			  				customerId: _this.$store.state.user.userId,
		  					orderId: item.orderId,
		  					orderStatus: 3
			  			})).then(function(e) {
			  				if(e.data.code == 200) {
									_this.cardData.splice(ind, 1);
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
				})
			},
			loadMore () {
				this.$emit("on-load-more", this.cardIndex)
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
  @import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
  
  .card-order-list {
  	position: relative;
		width: 100%;
		height: 100%;
  }

  .card {
  	@include halfpxline(0, $borderColor, 1px, 0, 1px, 0);
  	border-top: $uiMarginH solid $uiMarginBg;
  }

  .card-header {
		height: $inputH + 8px;
		line-height: $inputH;
		padding: 4px $padding;
		color: $fontColorBlack;
  	@include halfpxline(0, $borderColor, 0, 0, 1px, 0);
  	display: flex;

  	img {
  		float: left;
  		width: $inputH;
  		height: $inputH;
  		border-radius: $inputH;
			margin-right: $padding;
  	}

  	p {
  		flex: 1;
	    overflow: hidden;
    	text-overflow: ellipsis;
    	white-space: nowrap;
  	}

  	span {
  		width: 6em;
  		text-align: right;
  		color: $colorOrange;
  		display: block;
  	}
  }

  .card-content {
  	padding: $paddingTop/2 $padding;
  	@include halfpxline(0, $borderColor, 0, 0, 1px, 0);
  }

	.card-footer {
		padding: 4px $padding;

		.btn {
			float: right;
			width: auto;
	    margin: 6px 0;
	    margin-left: 10px;
	    line-height: $inputH - 12px;
		}
	}

	.card-all-info {
		width: 100%;
		line-height: $inputH;
  	@include halfpxline(0, $borderColor, 0, 0, 1px, 0);
		text-align: right;

		span {
			color: $colorOrange;
		}
	}

	.card-footer-btn {
		@extend %clearfix;
		line-height: $inputH;
	}
</style>