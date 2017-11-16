<!-- 
	音视频排行榜
 -->

<template>
	<div class="rank-list" v-cloak>
		<div class="container">
			<div class="tab">
	      <tab v-model="tabSelected">
	        <tab-item :selected="tabSelected == index" v-for="(item, index) in tabData" @click="tabSelected = index" :key="index">{{ item.title }}</tab-item>
	      </tab>
	      <swiper class="list" height="100%" v-model="tabSelected" :show-dots="false" :threshold="tabChangeW">
	        <swiper-item v-for="(tabContentDatasList, index) in tabData" :key="index">
	  				<scroller lock-x :height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offst="200">
	          	<div class="scroller-list">
	          		<el-img-text-rank v-for="(item, ind) in tabContentDatasList.list" :img-text-data="item" img-text-btn="-1" from-rank="true" :key="ind"></el-img-text-rank>
								
								<el-load-more :load-all="tabContentDatasList.loadAll"></el-load-more>
							</div>
						</scroller>
	        </swiper-item>
	      </swiper>
	    </div>
    </div>

    <div v-transfer-dom>
			<popup v-model="pay.show" position="bottom">
	      <div class="pay">
					<form-preview header-label="付款金额" :header-value="pay.allPrice" :body-items="pay.list"></form-preview>	
	      	
	      	<div class="pay-btn">
						<x-button type="primary" :class="{'disabled': !user.pay}" @click.native="payOrder">支付</x-button>
	      	</div>
	    	</div>
	    </popup>
    </div>
	</div>
</template>

<script type="text/babel">
	import { Scroller, Tab, TabItem, Swiper, SwiperItem, XButton, Divider, FormPreview, Popup, TransferDom } from 'vux'
  import { mapState } from 'vuex'
	import elImgTextRank from 'components/img-text/img-text-rank'
	import elLoadMore from 'components/load-more/load-more'

	export default {
		name: 'rankList',
		directives: {
	    TransferDom
	  },
		components: { Scroller, Tab, TabItem, Swiper, SwiperItem, XButton, FormPreview, Popup, Divider, elImgTextRank, elLoadMore },
		data () {
			return {
				index: 0,
				count: this.wordBook.pageSize,
				tabChangeW: this.wordBook.tabChangeW,
				scrollerInfo: {
					offsetBottom: 100,
					onfetching: false,
					loadAll: false, // 是否加载完
				},
				tabData: [
					{
						value: 'pay',
						title: '付费',
						freeStatus: 0,
						showRankingStatus: "",
						pageNum: 1,
						onfetching: false,
						loadAll: false,
						list: []
					},{
						value: 'free',
						title: '免费',
						freeStatus: 1,
						showRankingStatus: "",
						pageNum: 1,
						onfetching: false,
						loadAll: false,
						list: []
					},{
						value: 'hot',
						title: '排行榜',
						freeStatus: "",
						showRankingStatus: "1",
						pageNum: 1,
						onfetching: false,
						loadAll: false,
						list: []
					}
				],
				tabSelected: 0,
				type: {
					video: 1,
					audio: 0
				},
				typeCurrent: '',
				pay: {
					show: false,
					allPrice: 0,
					list: [
						{
			        label: '订单号',
			        value: ''
			      }, {
			        label: '名称',
			        value: ''
			      }, {
			        label: '数量',
			        value: ''
			      }
			    ]
				},
				payCode: ''
			}
		},
		computed: {
			...mapState({
        user: state => state.user
      })
		},
		watch: {
			tabSelected (newValue, oldValue) {
				this.onTabClick(newValue)
			}
		},
		mounted () {
			this.fetchData(this.tabData[this.tabSelected], this.tabSelected);
		},
		methods: {
			fetchData (obj, ind) {
				let _this = this;
				this.$http.post('/api/product/online/list',
						this.qs.stringify({
							customerId: _this.user.userId,
							onlineType: _this.type[_this.$route.params.type],
							topTag: "",
							freeStatus: obj.freeStatus,
							showRankingStatus: obj.showRankingStatus,
							productId: "",
							pageNum: obj.pageNum,
							pageSize: _this.count,
						})
					).then(function(e) {
						let list = [];
						_this.tabData[ind].onFetching = false;

						if(e.data.code == 200) {
							if(e.data.data && e.data.data.result && e.data.data.result.length > 0) {
								list = e.data.data.result.map(function(item, index) {
									return {
										img: item.images,
										id: item.id,
										title: item.name,
										type: item.remark,
										pay: item.price,
										originalPrice: item.originalPrice, // 原价
										isBuy: item.subscribeStatus || 0,
										like: {
											num: item.viewCount,
											percent: item.rank
										},
										url: 'courseTypeDetail',
										query: {
											id: item.id,
											type: _this.$route.params.type
										}
									}
								})
							}


							if(list.length < _this.count) {
								_this.tabData[ind].loadAll = true;
							}

							if(obj.pageNum == 1) {
								_this.tabData[ind].list = list;
							} else {
								_this.tabData[ind].list = _this.tabData[ind].list.concat(list);
							}
							_this.tabData[ind].pageNum++;
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}

						_this.resetView(ind);
				})
			},
			resetView (ind) {
				let _this = this;
				this.$nextTick(() => {
          this.$refs.scrollerBottom[ind].reset()
        })
			},
			onTabClick (val) {
				if(this.tabData[val].list.length == 0){
					this.fetchData(this.tabData[val], val)
				}
			},
			loadMore () {
				if(this.tabData[this.tabSelected].onFetching || this.tabData[this.tabSelected].loadAll) {

				} else {
					this.tabData[this.tabSelected].onFetching = true;					
					this.fetchData(this.tabData[this.tabSelected], this.tabSelected);
				}
			}
		}
	}
</script>

<style lang="scss">
	.rank-list .vux-slider > .vux-swiper {
    overflow-y: auto;
  }
</style>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	@import '~assets/css/rank';

	.pay-btn {
		padding: $padding;

		.disabled {
			background: $disabledPay;
		}
	}
	
	.scroller-list {
		padding-bottom: 90px;
	}
</style>