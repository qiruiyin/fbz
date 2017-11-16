<!-- 
	商城产品列表
 -->

<template>
	<div class="mall-list" v-cloak>
	  <scroller lock-x :height="-offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offst="200">
			<div class="mall-list-content">
				<!-- <el-mall-card :mall-card-data="item" v-for="(item, index) in listData" :key="index"></el-mall-card> -->
				
				<el-mall-product :mall-product-data="item" v-for="(item, index) in listData" :key="index"></el-mall-product>

				<el-load-more :load-all="loadAll"></el-load-more>
			</div>
		</scroller>
	</div>
</template>

<script type="text/babel">
	import { Scroller, LoadMore, Divider } from 'vux'
	import elMallProduct from 'components/mall/product-like'
	import elMallCard from 'components/mall/card'
	import elLoadMore from 'components/load-more/load-more'

	export default {
		name: "mallList",
		components: {
			Scroller, LoadMore, Divider, elMallProduct, elMallCard, elLoadMore
		},
		data () {
			return {
				title: "商城产品列表",
				type: this.$route.query.type,
				count: this.wordBook.pageSize,
				onFetching: false,
				loadAll: false,
				offsetBottom: 70,
				pageNum: 1,
				listData: []
			}
		},
		computed: {
			dataAll() {
				return this.count == this.listData.length;
			}
		},
		watch: {
			listData (newValue, oldValue) {
				this.resetView();
			} 
		},
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData() {
				let _this = this;
				this.onFetching = true;

				_this.$http.post('/wechat/shop//productList',{
						type: _this.type,
						pageNum: _this.pageNum,
						pageSize: _this.count
					}).then(function(e) {
						let list = [];
						if(e.data.code == 200) {
							if(e.data.data && e.data.data.list && e.data.data.list.length > 0) {
								list = e.data.data.list.map(function(item, index){
									return {
										img: _this.resolveImg(item.thumbnail),
										link: 'mallDetail',
										url: "",
										name: item.name,
										desc: item.description,
										price: item.price,
										code: item.code
									}
								});

								if(_this.pageNum == 1) {
									_this.listData = list;
								} else {
									_this.listData = list.concat(_this.listData);
								}

								_this.pageNum++;
								_this.resetView();
							}

							if(list.length < _this.count) {
								_this.loadAll = true;
							}
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
						_this.onFetching = false;
				});
			},
			resetView () {
				let _this = this;
				// setTimeout(function(){
					_this.$nextTick(() => {
	          _this.$refs.scrollerBottom.reset()
	        })
				// })
			},
			loadMore () {
				if(this.onFetching || this.loadAll) {

				} else {
					this.onFetching = true;
					this.fetchData(this.pageNum);
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	.mall-list {
		width: 100%;
		height: 100%;
		background-color: $bgGray;
	}

	.mall-list-content {
		width: 100%;
		height: 100%;
		@extend %clearfix;
	}

	.load-more {
		float: left;
	}
</style>