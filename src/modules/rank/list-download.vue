<!-- 
	下载排行榜
 -->

<template>
	<div class="rank-list" v-cloak>
		<div class="container">
			<div class="tab">
	      <tab v-model="tabSelected">
	        <tab-item :selected="tabSelected == index" v-for="(item, index) in tabDatas" @click="tabSelected = index" :key="index">{{ item.title }}</tab-item>
	      </tab>
	      <swiper class="list" height="100%" v-model="tabSelected" :show-dots="false" :threshold="tabChangeW">
	        <swiper-item v-for="(tabDatasList, index) in tabDatas" :key="index">
	        	<template v-if="tabDatasList.list">
	        		<div class="type">
	        			<router-link :to="{name: item.url, query: { typeCode: item.value }}" class="type-entrance" v-for="item in tabDatasList.list" :key="item.value">
	        				<img :src="item.icon" alt="">
	        				{{ item.name }}
	        			</router-link>
	        		</div>
	        	</template>
	        	<template v-else>
	  					<scroller lock-x :height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offst="200">
	        			<div>
        					<!-- <el-img-text-rank @on-data-change="btnClick" v-for="(item, ind) in tabContentDatasList.list" :img-text-data="item" :is-download=true img-text-btn="1" :key="ind"></el-img-text-rank> -->
	        				<el-img-text-rank @on-data-change="btnClick" v-for="(item, ind) in download.list" :img-text-data="item" :is-download=true img-text-btn="1" :key="ind"></el-img-text-rank>
									
									<el-load-more :load-all="download.loadAll"></el-load-more>
	        			</div>
	        		</scroller>
	        	</template>
	        </swiper-item>
	      </swiper>
	    </div>
    </div>
	</div>
</template>

<script type="text/babel">
	import { Scroller, Tab, TabItem, Swiper, SwiperItem, Sticky } from 'vux'
	import elImgTextRank from 'components/img-text/img-text-rank'
	import elLoadMore from 'components/load-more/load-more'

	export default {
		name: 'listDownload',
		components: { Scroller, Tab, TabItem, Swiper, SwiperItem, Sticky, elImgTextRank, elLoadMore },
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
				tabDatas: [],
				tabSelected: 0,
				download: {
					onFetching: false,
					loadAll: false,
					pageNum: 1,
					list: []
				}
			}
		},
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData () {
				let _this = this,
						tabDatas = [];
				// 资料分类
	  		_this.$http.post('/wechat/coursewaremobile/queryType',{}).then(function(e) {
	  			let responseData = e.data.data;
	  			if(e.data.code == 200) {
		  			tabDatas = responseData.list.map(function(item, index) {
		  				let queryTypeData = [];
		  				queryTypeData = item.list.map(function(it, ind) {
		  					return {
		  						value: it.code,
		  						name: it.name,
		  						url: 'courseList',
		  						parentCode: it.parentCode,
		  						icon: _this.resolveImg(it.thumbnail)
		  					};
		  				})
		  				return {
		  					title: item.name,
		  					value: item.code,
		  					id: item.id,
		  					list: queryTypeData
		  				};
		  			})

	  				tabDatas.push({
	  					value: '',
	  					title: '下载最多',
	  				})

	  				_this.tabDatas = tabDatas;
		  			_this.getMore();
		  		} else {
		  			_this.$vux.alert.show({
		  				content: e.data.msg
		  			})
		  		}
	  		});
			},
			getMore () {
				let _this = this;
				// 下载做多
	  		_this.$http.post('/wechat/coursewaremobile/queryRank',
	  			{
	  				"customerCode": _this.$store.state.user.userCode,
	  				"pageNum": _this.download.pageNum,
	  				"pageSize": _this.count
	  			}).then(function(e) {
						_this.download.onFetching = false;
	  				let responseData = e.data.data,
	  						downloadData = [];
	  				if(e.data.code == 200) {
	  					if(e.data.data.list && e.data.data.list.length > 0) {
		  					downloadData = responseData.list.map(function(item, index){
			  					return {
			  						id: item.id,
			  						code: item.code,
										title: item.name,
										type: item.memo,
										pay: item.requiredpoints,
										isBuy: item.isbuy,
										download: item.downloads,
										downloadUrl: _this.resolveImg(item.file_url),
										price: item.requiredpoints,
										url: '',
										img: _this.resolveImg(item.thumbnail),
										query: {
											code: item.code
										}
			  					}
			  				});
		  				}

		  				if(downloadData.length < _this.count) {
								_this.download.loadAll = true;
							}

		  				if(_this.download.pageNum == 1) {
		  					_this.download.list = downloadData;
		  				} else {
		  					_this.download.list = _this.download.list.concat(downloadData);
		  				}

							_this.download.pageNum++;
	  				} else {
	  					_this.$vux.alert.show({
	  						content: e.data.msg
	  					})
	  				}

	  				_this.resetView();
	  		});
			},
			resetView (ind) {
				this.$nextTick(() => {
          this.$refs.scrollerBottom[0].reset()
        })
			},
			btnClick (val, status) {
				let _this = this;
				if(status == "download") {
					_this.download.list.map(function(item, index) {
						if(item.code == val.query.code) {
							item.download++;
							item.isBuy = 1;
						}
					});
				}
			},
			loadMore () {
				if(this.download.onFetching || this.download.loadAll) {

				} else {
					this.download.onFetching = true;
					this.getMore();		
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

	$typeIconW: 44px;

	// 头部固定
	.tab {
		
	}
 	// 头部固定end

	.type {
		@extend %clearfix;
	}

	.list {
		padding-bottom: 60px;
	}

	.type-entrance {
		float: left;
		width: 33.33%;
		padding: $typeIconW + $padding 0 $padding;
		text-align: center;
		@include halfpxline(0, $borderColor, 0, 1px, 1px, 0);
		line-height: 2;
		font-size: 12px;

		&:nth-child(3n) {
			@include halfpxline(0, $borderColor, 0, 0, 1px, 0);
		}

		img {
			position: absolute;
			top: $padding;
			width: $typeIconW;
			height: $typeIconW;
	    left: 0;
   	 	right: 0;
    	margin: 0 auto;
		}
	}
</style>