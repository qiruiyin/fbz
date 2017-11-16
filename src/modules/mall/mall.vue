<!-- 
	商城
 -->

<template>
	<div :class="['mall', { 'active': searchData.popup }]" v-cloak>
		<div class="mall-header">
			<div @click="changeType(item, index)" :class="['mall-header-block', {'active': index == selectedType}]" v-for="(item, index) in goodsType" :key="index">{{ item.name }}</div>
		</div>
		<!-- <div class="mall-header-title">{{ goodsType[selectedType].title }}</div> -->

		<!-- <el-search-block></el-search-block> -->

		<div class="mall-container">
			<scroller lock-x :height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom">
				<div class="mall-list">				
					<el-mall-product :mall-product-data="item" v-for="(item, index) in scrollerInfo.list" :key="index"></el-mall-product>
					<el-load-more :load-all="scrollerInfo.loadAll"></el-load-more>
				</div>
			</scroller>	
			<!-- <el-cart-frame></el-cart-frame> -->
		</div>
	</div>
</template>

<script type="text/babel">
	import { TransferDom, Scroller, Group, Cell, Swiper, Card, Panel, Search, Popup } from 'vux'
	
	import elCartFrame from 'components/cart/cart-frame'
	import elSearch from 'components/search/search'
	import elSearchBlock from 'components/search/search-block'
	import elLoadMore from 'components/load-more/load-more'
	import elMallProduct from 'components/mall/product-like'
	
	export default {
		name: "mall",
		directives: {
	    TransferDom
	  },
		components: {
			Group, Scroller, Cell, Swiper, Card, Panel, Search, Popup, elCartFrame, elSearch, elSearchBlock, elLoadMore, elMallProduct
		},
		data () {
			return {
				title: '商城',
				goodsType: [
					{
						name: "全部",
						id: "",
						title: "全部"
					}
				],
				selectedType: 0,
				scrollerInfo: {
					offsetBottom: 100,
					onfetching: false,
					loadAll: false, // 是否加载完
					pageSize: 10,
					pageNum: 1,
					list: []
				},
      	tuijianList: [{
      		desc: "",
  				type: "",
  				title: "",
  				list: []
      	}],
      	searchData: {
      		popup: false,
      		value: "",
      		list: [
      			{
      				img: "",
      				title: "",
      				desc: "",
      				price: "12",
      				sellNum: "111"
      			}
      		]
      	}
			}
		},
		mounted ()  {
			this.fetchData();
		},
		methods: {
			fetchData () {
				let _this = this;
				this.getType();
				this.getGoods();
			},
			getType () {
				let _this = this;
				_this.$http.post('/api/goods/category',
					_this.qs.stringify({
						pageSize: 100,
						pageNum: 1
					})).then(function(e) {
						if(e.data.code == 200) {
							let res = e.data.data,
									list = [];
							if(res.result.length > 0){
								list = res.result.map(function(item, index){
									return {
										id: item.goodsCategoryId,
										name: item.goodsCategoryName,
										title: item.goodsCategoryName
									}
								});
							}

							_this.goodsType = _this.goodsType.concat(list);
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
					});
			},
			getGoods (id = "") {
				let _this = this;
				_this.$http.post('/api/goods/list',
					_this.qs.stringify({
						goodsCategoryId: id,
						pageSize: _this.scrollerInfo.pageSize,
						pageNum: _this.scrollerInfo.pageNum
					})).then(function(e) {
						if(e.data.code == 200) {
							let res = e.data.data,
									list = [];
							if(e.data.data.result && e.data.data.result.length > 0) {
			  				list = res.result.map(function(item, index){
			  					return {
			  						img: item.images,
										name: item.goodsName,
										desc: item.remark,
										price: item.price,
										originalPrice: item.originalPrice,
										id: item.goodsId,
			  					}
			  				})
					  	}

					  	if(_this.scrollerInfo.pageNum == 1) {
						  	_this.scrollerInfo.list = list
					  	} else {
						  	_this.scrollerInfo.list = _this.scrollerInfo.list.concat(list);
					  	}

					  	if(list.length < _this.scrollerInfo.pageSize) {
					  		_this.scrollerInfo.loadAll = true;
					  	}

					  	_this.scrollerInfo.pageNum++;
							_this.resetView();
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
					});
			},
			resetView (ind) {
				let _this = this;
				this.$nextTick(() => {
          this.$refs.scrollerBottom.reset();
        })
			},
			loadMore () {
				if(this.scrollerInfo.onFetching || this.scrollerInfo.loadAll) {

				} else {
					this.scrollerInfo.onFetching = true;					
					this.getGoods(this.goodsType[this.selectType].id, this.scrollerInfo.pageNum);
				}
			},
			changeType(data, ind) {
				let _this = this;
				this.selectedType = ind;
				this.scrollerInfo.pageNum = 1;
				_this.getGoods(data.id)
			}
	  }
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	$tuijianPadding: 5px;

	$productImgW: $imgTextImgW;
	$productImgH: $imgTextImgH;

	.mall {
		width: 100%;
		height: 100%;
		background-color: $bgGray;

		&.active {
	    overflow: hidden;
		}
	}

	.mall-header {
		margin-bottom: $padding;
		background: #fff;
    white-space: nowrap;
    overflow: auto;

		.mall-header-block {
			width: 100px;
			line-height: 44px;
			text-align: center;
			display: inline-block;

			&.active {
				color: $colorRedDeep;
			}
		}
	}

	.mall-header-title {
		line-height: 44px;
		font-size: 20px;
		text-align: center;
		background: $bgGray;
	}

	.mall-container {
		padding-bottom: $containerBottom;
	}

	.tuijian-img {
		display: flex;
		padding: 10px 10px;
		background: #fff;
		
		a {
			width: 100%;
			display: block;
			background-size: 100%;
			border-radius: 5px;
		}

		img {
			border-radius: 5px;
		}
	}

	.mall-list {
		@extend %clearfix;
	}

	.tuijian-img-left, .tuijian-img-right {
		flex: 1;
		padding-right: 5px;

		img {
			width: 100%;
			visibility: hidden;
		}
	}

	.tuijian-img-right {
		padding-right: 0;
		padding-left: 5px;

		a:last-child {
			img {
				margin-top: 5px;
			}
		}
	}
</style>