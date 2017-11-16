<!-- 
	订单列表页面
 -->

<template>
	<div class="order-list" v-cloak>
		<tab :line-width=2 v-model="tabSelected">
      <tab-item class="vux-center" v-for="(item, index) in tabData" :key="index">{{ item.name }}</tab-item>
    </tab>
    <swiper v-model="tabSelected" height="100%" :show-dots="false" :threshold="tabChangeW">
      <swiper-item v-for="(item, index) in tabData" :key="index">
  			<el-card-order @update-tabSelected="updateTabSelected" @on-load-more="loadMore" @on-data-change="dataChange" :card-data="item.list" :card-count="count" :card-index="index" :on-fetching="item.onFetching" :on-fetch-all="item.loadAll"></el-card-order>
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
						value: 'unpaid',
						name: '未支付',
						status: 'unpaid',
						orderStatus: "0",
						expressStatus: "",
						pageNum: 1,
						onFetching: false,
						loadAll: false,
						list: []
					// },{
					// 	value: 'pending',
					// 	name: '待发货',
					// 	status: 'pending',
					// 	orderStatus: 1,
					// 	expressStatus: 0,
					// 	pageNum: 1,
					// 	list: []
					// },{
					// 	value: 'delivered',
					// 	name: '已发货',
					// 	status: 'delivered',
					// 	orderStatus: "1",
					// 	expressStatus: "1",
					// 	pageNum: 1,
					// 	list: []
					},{
						value: 'unreceive',
						name: '待收货',
						status: 'unreceive',
						orderStatus: "2",
						expressStatus: "0",
						pageNum: 1,
						onFetching: false,
						loadAll: false,
						list: []
					},{
						value: 'receive',
						name: '已完成',
						status: 'receive',
						orderStatus: "3",
						expressStatus: "2",
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
			this.fetchData(this.tabData[this.tabSelected], this.tabSelected);
		},
		methods: {
			fetchData (obj, ind = 0) {
				let _this = this;
				this.$http.post('/api/customer/order/list',
					_this.qs.stringify({
						customerId: _this.$store.state.user.userId,
						pageNum: obj.pageNum,
						pageSize: _this.count,
						orderStatus: obj.orderStatus, // 0 未支付， 1 已支付 "" 全部
						orderType: 1,
					})).then(function(e) {
	          _this.tabData[ind].onFetching  = false;
	          if(e.data.code == 200) {
	          	let res = e.data.data,
								list = [];

							if(res.result && res.result.length > 0) {
								list = res.result.map(function(item, index) {
									let orderProductList = [],
											count = 0;
									orderProductList = [{
										description: item.remark,
										productCount: item.buyCount,
										productName: item.goodsName,
										productPrice: item.singlePrice,
										customerName: item.contactName,
										img: item.images
									}];

									return {
										id: item.id,
										count: item.buyCount,
										orderId: item.id,
										orderNo: item.orderNo,
										orderType: 1,
										type: item.type,
										actualAmount: item.expectAllAmount,
										orderStatus: item.orderStatus,
										status: item.orderStatusName,
										img: '',
										time: item.createTime,
										orderProductList: orderProductList
									}
								});
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
			},
			updateTabSelected (data) {
				this.tabSelected = data.newInd;
				this.tabData[data.newInd].pageNum = 1;
				this.tabData[data.newInd].onFetching = false;
				this.tabData[data.newInd].loadAll = false;
				this.tabData[data.oldInd].pageNum = 1;
				this.tabData[data.oldInd].onFetching = false;
				this.tabData[data.oldInd].loadAll = false;
				this.tabData[data.oldInd].list = [];
				this.tabData[data.newInd].list = [];
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