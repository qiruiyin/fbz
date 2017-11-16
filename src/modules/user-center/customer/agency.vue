<!-- 
	我的客户
 -->

<template>
	<div class="agency">
		<scroller lock-x :height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offst="200">
    	<div>
				<div class="agency-header">
					<div class="title">我的代理</div>
					<p class="total-num">{{ agency.totalAmount }}</p>
					<div class="num">
						<p>当前身份：<span>{{ agency.levelName }}</span></p>
					</div>
					<div class="num num-new">
						<p>本周新增：<span>{{ agency.weekCount }}</span></p>
						<p>本月新增：<span>{{ agency.monthCount }}</span></p>
					</div>
				</div>
				<div class="agency-content">
      		<table class="agency-table">
      			<tr class="agency-theader">
      				<th>{{ agency.header.name }}</th>
      				<th>{{ agency.header.customerCount }}</th>
      				<th>{{ agency.header.orderCount }}</th>
      				<th>{{ agency.header.levelName }}</th>
      				<th>{{ agency.header.totalAmount }}</th>
      			</tr>

      			<tr class="agency-tr" v-for="(item, index) in agency.list">
      				<td><p>{{ item.name }}</p></td>
      				<td>{{ item.customerCount }}</td>
      				<td>{{ item.orderCount }}</td>
      				<td>{{ item.levelName }}</td>
      				<td>{{ item.totalAmount }}</td>
      			</tr>
      		</table>
					<el-load-more :load-all="agency.loadAll"></el-load-more>
			  </div>
			</div>
		</scroller>
	</div>
</template>

<script type="text/babel">
	import { Scroller, Tab, TabItem, Swiper, SwiperItem } from 'vux'

	import elLoadMore from 'components/load-more/load-more'

	export default {
		name: "agency",
		components: { Scroller, Tab, TabItem, Swiper, SwiperItem, elLoadMore },
		data () {
			return {
				title: "我的客户",
				agency: {
					totalAmount: "",
					levelName: "",
					weekCount: "",
					monthCount: "",
					pageNum: 1,
					pageSize: this.wordBook.pageSize,
					onFetching: false,
					loadAll: false,
					header: { 
						name: "我的代理",
						customerCount: "客户数",
						orderCount: "订单数",
						levelName: "身份",
						totalAmount: "成交总额"
					},
					list: [
						// { 
						// 	name: "我的代理",
						// 	customerCount: "0",
						// 	orderCount: "0",
						// 	levelName: "会员",
						// 	totalAmount: "988.00"
						// }
					]
				},
				scrollerInfo: {
					offsetBottom: 53
				},
				count: this.wordBook.pageSize
			}
		},
		watch: {
			tabSelected (newValue, oldValue) {
				this.onTabClick(newValue)
			}
		},
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData () {
				let _this = this;
				_this.fetchAgency();
				this.$http.post('/api/userInfo/myAgent/count',
					_this.qs.stringify({
						customerId: _this.$store.state.user.userId
					})).then(function(e) {
						if(e.data.code == 200){
							let agency = e.data.data;

							_this.agency.levelName = agency.levelName;
							_this.agency.totalAmount = agency.totalCount;
							_this.agency.weekCount = agency.weekCount;
							_this.agency.monthCount = agency.monthCount;
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
					})
			},
			fetchAgency () {
				let _this = this;
				this.agency.onFetching = true;					
				this.$http.post('/api/userInfo/myAgent',
					_this.qs.stringify({
						customerId: _this.$store.state.user.userId,
						pageNum: _this.agency.pageNum,
						pageSize: _this.agency.pageSize
					})).then(function(e) {
						let myAgentList = [];
						if(e.data.code == 200) {
							if(e.data.data && e.data.data.result && e.data.data.result.length > 0) {
								myAgentList = e.data.data.result.map(function(item, index) {
									return {
			  						customerCount: item.customerCount, 
										header: _this.resolveImg(item.header),
										levelName: item.levelName,
										name: item.name,
										orderCount: item.orderCount,
										totalAmount: item.totalAmount
			  					}
								})
							}

							if(myAgentList.length < _this.agency.pageSize) {
								_this.agency.loadAll = true;
							}

							if(_this.agency.pageNum == 1) {
								_this.agency.list = myAgentList;
							} else {
								_this.agency.list = _this.agency.list.concat(myAgentList);
							}
							_this.agency.pageNum++;
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}

						_this.resetView();
						_this.agency.onFetching = false;					
					})
			},
			resetView () {
				let _this = this;
				this.$nextTick(() => {
          this.$refs.scrollerBottom.reset()
        })
			},
			loadMore () {
				if(this.agency.onFetching || this.agency.loadAll) {

				} else {
	        this.agency.onFetching = true;
					this.fetchAgency()
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

  $imgW: 44px;

  .agency-header {
  	padding: $padding 0;
  	color: #fff;
  	text-align: center;
  	background: $colorRedDeep;

  	.title {
			margin-bottom: 15px;
  	}

  	.total-num {
  		height: 40px;
  		font-size: 30px;
  	}

  	.num {
  		line-height: 2;
  		display: flex;
			
			&.num-new {
				padding-top: 4px;
				color: rgba(255, 255, 255, .8);
			}
	
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

	.agency-table	{
		width: 100%;
		line-height: 40px;
		border-collapse: collapse;
		border-spacing: 0;
		text-align: center;
		
		th, td {
			padding: 0;
			border: 0px solid red;
			min-width: 4.5em;
		}

		p {
			@include ellipsisMore(1);
		}
	}

	.agency-theader {
		background: $bgGray;
		font-size: 12px;
	}

	.agency-tr {

		td {
			font-size: 13px;
			padding: 1em 0;
			line-height: 1.35;
			@include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
		}
	}
</style>