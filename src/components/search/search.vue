<!-- 
	搜索
 -->

<template>
	<div class="search">
		<search 
			v-model="searchData.value"
			position="absolute"
			auto-scroll-to-top top="60px"
			@on-cancel="onCancel"
			@on-submit="onSubmit"
			ref="search">
		</search>

		<popup class="search-list" v-model="searchData.popup" position="bottom" :show-mask="false">
			<scroller class="scroller" lock-x height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offst="200">
	    	<div v-if="searchData.list.length > 0">
	    		<div @click="goPage(item)" class="search-block" v-for="(item, index) in searchData.list" :key="index">
	    			<div class="search-block-img">
	    				<img :src="item.img" alt="">
	    			</div>
	    			<div class="search-block-content">
	    				<h5>{{ item.title }}</h5>
	    				<p>{{ item.desc }}</p>
	    				<div class="price-info">
	    					<p>￥{{ item.price }}</p>
	    					<span>{{ item.sellNum }}人购买</span>
	    				</div>
	    			</div>
	    		</div>

					<el-load-more :load-all="searchData.loadAll"></el-load-more>
	    	</div>
    		<div v-else>没有产品</div>
	    </scroller>

    </popup>
	</div>
</template>

<script type="text/babel">
	import { Search, Popup, Scroller } from 'vux'
	import elLoadMore from 'components/load-more/load-more'

	export default {
		name: "elSearch",
		components: {
			Search, Popup, Scroller, elLoadMore
		},
		props: ['searchType'],
		data() {
			return {
				scrollerInfo: {
					offsetBottom: 70,
					
				},
      	searchData: {
      		popup: false,
      		value: "",
      		onfetching: false,
					loadAll: false, // 是否加载完
      		pageNum: 1,
      		pageSize: this.wordBook.pageSize,
      		list: [
      			// {
      			// 	img: "",
      			// 	title: "",
      			// 	desc: "",
      			// 	price: "",
      			// 	sellNum: ""
      			//  code: ""
      			// }
      		]
      	}
			}
		},
		mounted () {
			// this.fetchData();
		},
		methods: {
			fetchData () {

			},
	    onSubmit (status) {
	      this.$refs.search.setBlur();
	      let _this = this,
	      		pageNum = 1;
	      
	      if(!status) {
	      	pageNum = _this.searchData.pageNum;
	      }

				if(_this.searchData.value != "") {

	 				_this.$http.post('/wechat/shop/productList',{
							type: _this.searchType,
							name: _this.searchData.value,
							pageNum: pageNum,
							pageSize: _this.searchData.pageSize
						}).then(function(e) {
							let list = [];
							if(e.data.code == 200) {
								if(e.data.data.list.length > 0) {
									list = e.data.data.list.map(function(item, index){
										return {
											img: _this.resolveImg(item.thumbnail),
				      				title: item.name,
				      				desc: item.DESCRIPTION,
				      				price: item.price,
				      				sellNum: item.salesCount,
				      				code: item.code
										}
									});
								}

								if(pageNum == 1) {
									_this.searchData.pageNum = 2;
									_this.searchData.list = list;
									_this.resetView(true);
								} else {
									_this.searchData.pageNum++;
									_this.searchData.list = _this.searchData.list.concat(list);
									_this.resetView();
								}

								if(list.length < _this.searchData.pageSize) {
									_this.searchData.loadAll = true;
								} else {
									_this.searchData.loadAll = false;
								}
							} else {
								_this.$vux.alert.show({
									content: e.data.msg
								})
							}
							_this.searchData.onFetching = false;
					});

	      	this.searchData.popup = true;
				}
	    },
	    resetView(status) {
	    	if(status) {
	    		this.$nextTick(() => {
	          this.$refs.scrollerBottom.reset({
	          	top: 0
	          })
	        })	
	    	} else {
	    		this.$nextTick(() => {
	          this.$refs.scrollerBottom.reset()
	        })
	    	}
				
	    },   
	    onCancel () {
	      this.searchData.popup = false;
	    },
	    goPage (item) {
	      this.searchData.popup = false;
	    	this.$router.push({name: 'mallDetail', query: { goodsCode: item.code }})
	    },
			loadMore () {
				if(this.searchData.onFetching || this.searchData.loadAll) {

				} else {
					this.searchData.onFetching = true;
					this.onSubmit(false);		
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	$productImgW: $imgTextImgW;
	$productImgH: $imgTextImgH;

	.search-list {
		position: absolute;
		top: 104px;
		left: 0;
		right: 0;
		bottom: $containerBottom;
		background: #fff;
		z-index: 1;
	}

	.search-block {
    position: relative;
    width: 100%;
    padding: $padding/2 $padding;
    display: flex;
    z-index: 2;
	}

	.search-block-img {
		width: $productImgW;
    height: $productImgH;
    text-align: center;
    background: #efefef;
    text-align: center;
    overflow: hidden;

    img {
    	height: 100%;
    	margin: 0 auto;
    }
	}

	.search-block-content {
		position: relative;
    width: 100%;
    height: 100%;
    min-height: $productImgH;
    padding-left: $padding;

    h5 {
    	font-size: 16px;
    	color: $colorOrange;
    }

    & > p {
    	text-align: justify;
    }

    .price-info {
    	position: absolute;
    	bottom: 0;

    	p {
    		color: $colorOrange;
    		display: inline-block;
    	}

    	span {
    		color: $fontColorGray;
    	}
    }
	}
</style>