<!-- 
	活动订单列表页面
 -->

<template>
	<div class="order-list" v-cloak>
		<tab :line-width=2 v-model="tabSelected">
      <tab-item class="vux-center" v-for="(item, index) in tabData" :key="index">{{ item.name }}</tab-item>
    </tab>
    <swiper v-model="tabSelected" height="100%" :show-dots="false" :threshold="tabChangeW">
      <swiper-item v-for="(item, index) in tabData" :key="index">
  			<el-card-order @on-load-more="loadMore" @on-data-change="dataChange" :card-data="item.list" :card-count="count" :card-index="index" :on-fetching="item.onFetching" :on-fetch-all="item.loadAll"></el-card-order>
      </swiper-item>
    </swiper>
	</div>
</template>

<script type="type/babel">
	import { Tab, TabItem, Swiper, SwiperItem } from 'vux'

	import elCardOrder from 'components/card/card-order'

	export default {
		name: 'orderList',
		components: { Tab, TabItem, Swiper, SwiperItem, elCardOrder },
		data () {
			return {
				title: '订单列表页面',
				count: this.wordBook.pageSize,
				tabChangeW: this.wordBook.tabChangeW,
				tabData: [
					{
						value: 'all',
						name: '全部',
						status: 'all',
						orderStatus: "",
					  paymentStatus: "",
					  ticketStatus: "",
						pageNum: 1,
						onFetching: false,
						loadAll: false,
						list: []
					},{
						value: 'unpay',
						name: '待付款',
						status: 'unpay',
						orderStatus: "0",
					  paymentStatus: "0",
					  ticketStatus: "",
						pageNum: 1,
						onFetching: false,
						loadAll: false,
						list: []
					},{
						value: 'untake',
						name: '待参加',
						status: 'untake',
						orderStatus: "2",
					  paymentStatus: "1",
					  ticketStatus: "0",
					  pageNum: 1,
						onFetching: false,
						loadAll: false,
						list: []
					},{
						value: 'take',
						name: '已参加',
						status: 'take',
						orderStatus: "3",
					  paymentStatus: "1",
					  ticketStatus: "1",
						pageNum: 1,
						onFetching: false,
						loadAll: false,
						list: []
					}
				],
				tabSelected: 0
			}
		},
		watch: {
			tabSelected (newValue, oldValue) {
				this.onTabClick(newValue)
			}
		},
		mounted () {
			// 取全部数据
			this.fetchData(this.tabData[0], 0);
		},
		methods: {
			fetchData (obj, ind = 0) {
				let _this = this;
				_this.$http.post('/api/customer/order/list',
					_this.qs.stringify({
							customerId: _this.$store.state.user.userId,
							orderStatus: obj.orderStatus,
							orderType: '5',
							pageNum: obj.pageNum,
							pageSize: _this.count,
							// "paymentStatus": obj.paymentStatus,
							// "ticketStatus": obj.ticketStatus
						})
					).then(function(e) {
						_this.tabData[ind].onFetching = false;
						if(e.data.code == 200) {

							let responseData = e.data.data,
									customerStudyedLessonList = [];

							if(responseData.result.length > 0) {
								customerStudyedLessonList = responseData.result.map(function(item, index) {
									return {
										icon: '',
										orderId: item.id,
										orderNo: item.orderNo,
										title: item.goodsName,
										type: item.type,
										orderType: '5',
										customerName: item.contactName,
										expectAmount: item.totalAmount, // 已付金额
										amount: item.singlePrice, // 单价
										actualAmount: item.expectAmount,
										img: item.images,
										orderStatus: item.orderStatus,
										status: item.orderStatusName,
										time: item.createTime,
										num: item.buyCount,
									}
								});
							}

							if(customerStudyedLessonList.length < _this.count) {
								_this.tabData[ind].loadAll = true;
							}
							if(obj.pageNum == 1) {
								_this.tabData[ind].list = customerStudyedLessonList;
							} else {
								_this.tabData[ind].list = _this.tabData[ind].list.concat(customerStudyedLessonList);
							}
							_this.tabData[ind].pageNum++;
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
				})
			},
			onTabClick (val) {
				if(this.tabData[val].list.length == 0){
					this.fetchData(this.tabData[val], val)
				}
			},
			loadMore (val) {
				if(this.tabData[val].onFetching || this.tabData[val].loadAll) {

				} else {
	        this.onFetching = true;
					this.fetchData(this.tabData[val], val)
				}
			},
			dataChange (ind) {
				this.tabData[ind].pageNum = 1;
				this.fetchData(this.tabData[ind], ind)
			}
		}
	}
</script>

<style lang="scss">
	.order-list .vux-slider {
		height: 100%;
	}
</style>>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	.order-list {
		height: 100%;
	}
</style>