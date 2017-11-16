<!-- 
	我的客户
 -->

<template>
	<div class="customer">
		<scroller lock-x :height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore(tabSelected)" ref="scrollerBottom" :scroll-bottom-offst="200">
    	<div>
				<div class="customer-header">
					<div class="title">我的客户</div>
					<p class="total-num">{{ customer.total }}</p>
					<div class="num">
						<p>本周新增：<span>{{ customer.week }}</span></p>
						<p>本月新增：<span>{{ customer.month }}</span></p>
					</div>
				</div>
				<div class="customer-content">
					<div class="tab">
			      <tab v-model="tabSelected">
			        <tab-item :selected="tabSelected == index" v-for="(item, index) in tabData" @click="tabSelected = index" :key="index">
			        	{{ item.name }}
			        </tab-item>
			      </tab>

			      <div v-show="tabSelected == index" v-for="(tabContentDatasList, index) in tabData" :key="index">
          		<div class="integral-man" v-for="(item, ind) in tabContentDatasList.list" :key="ind">
								<img v-if="item.header" :src="item.header">
								<div class="title">
									<p>{{ item.name }}</p>
									<span>时间：{{ item.time }}</span>
								</div>
							</div>
							<el-load-more :load-all="tabContentDatasList.loadAll"></el-load-more>
			      </div>
			    </div>
			  </div>
			</div>
		</scroller>
	</div>
</template>

<script type="text/babel">
	import { Scroller, Tab, TabItem, Swiper, SwiperItem } from 'vux'

	import elLoadMore from 'components/load-more/load-more'

	export default {
		name: "customer",
		components: { Scroller, Tab, TabItem, Swiper, SwiperItem, elLoadMore },
		data () {
			return {
				title: "我的客户",
				customer: {
					total: "",
					week: "",
					month: ""
				},
				scrollerInfo: {
					offsetBottom: 53
				},
				count: this.wordBook.pageSize,
				tabChangeW: this.wordBook.tabChangeW,
				tabData: [
					{
						value: 'qianzai',
						name: '潜在',
						type: 0,
						pageNum: 1,
						pageSize: this.wordBook.pageSize,
						onFetching: false,
						loadAll: false,
						list: []
					},{
						value: 'zhuce',
						name: '注册',
						type: 1,
						pageNum: 1,
						pageSize: this.wordBook.pageSize,
						onFetching: false,
						loadAll: false,
						list: []
					},{
						value: 'xianshang',
						name: '线上',
						type: 2,
						pageNum: 1,
						pageSize: this.wordBook.pageSize,
						onFetching: false,
						loadAll: false,
						list: []
					},{
						value: 'xianxia',
						name: '线下',
						type: 3,
						pageNum: 1,
						pageSize: this.wordBook.pageSize,
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
			this.fetchData(this.tabData[this.tabSelected], this.tabSelected);
		},
		methods: {
			fetchData (obj, ind) {
				let _this = this;
				_this.fetchCustomer(obj, ind);
				this.$http.post('/api/userInfo/myCustomer/count',
					_this.qs.stringify({
						customerId: _this.$store.state.user.userId
					})).then(function(e) {
						if(e.data.code == 200){
							_this.customer = {
								total: e.data.data.totalCount,
								week: e.data.data.weekCount,
								month: e.data.data.monthCount
							}
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
					})
			},
			fetchCustomer (obj, ind) {
				let _this = this;
				this.tabData[ind].onFetching = true;					
				this.$http.post('/api/userInfo/myCustomer',
					_this.qs.stringify({
						customerId: _this.$store.state.user.userId,
						type: obj.type,
						pageNum: obj.pageNum,
						pageSize: obj.pageSize
					})).then(function(e) {
						let myCustomerList = [];
						if(e.data.code == 200) {
							if(e.data.data.result && e.data.data.result && e.data.data.result.length > 0) {
								myCustomerList = e.data.data.result.map(function(item, index) {
									return {
										id: item.id,
			  						time: item.createTime,
			  						header: item.headerUrl,
			  						// mobile: item.mobile || "15021417505",
			  						name: item.name,
			  						// totalAmount: item.totalAmount || ""
			  					}
								})
							}

							if(myCustomerList.length < _this.count) {
								_this.tabData[ind].loadAll = true;
							}

							if(obj.pageNum == 1) {
								_this.tabData[ind].list = myCustomerList;
							} else {
								_this.tabData[ind].list = _this.tabData[ind].list.concat(myCustomerList);
							}
							_this.tabData[ind].pageNum++;

							console.log(_this.tabData[ind])
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}

						_this.resetView();
						_this.tabData[ind].onFetching = false;					
					})
			},
			resetView () {
				let _this = this;
				this.$nextTick(() => {
          this.$refs.scrollerBottom.reset()
        })
			},
			onTabClick (val) {
				if(this.tabData[val].list.length == 0){
					this.fetchCustomer(this.tabData[val], val)
				}
			},
			loadMore (val) {
				if(this.tabData[val].onFetching || this.tabData[val].loadAll) {

				} else {
	        this.tabData[val].onFetching = true;
					this.fetchData(this.tabData[val], val)
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

  $imgW: 44px;

  .customer-header {
  	padding: $padding 0;
  	color: #fff;
  	text-align: center;
  	background: $colorRedDeep;

  	.title {
			margin-bottom: 15px;
  	}

  	.total-num {
  		height: 40px;
			margin-bottom: 15px;
  		font-size: 30px;
  	}

  	.num {
  		display: flex;

  		p {
  			flex: 1;
  		}
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
			font-size: 16px;
  	}

  	span {
  		font-size: 12px;
  		color: $fontColorGray;
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
</style>