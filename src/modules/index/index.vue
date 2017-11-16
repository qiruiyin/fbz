<!-- 
	首页
 -->

<template>
	<div class="index" v-cloak>
		
		<div class="container">
			
			<div class="banner">
	    	<swiper auto dots-position="center" :list="bannerTopDatas" :aspect-ratio="bannerWidthHeight" loop></swiper>
			</div>
			
			<div class="entry">
				<div v-for="(item, index) in entryDatas" :key="index" :class="['entry-' + item.img]" @click="entry(item.url, item.type)">
					<p>{{ item.name }}</p>
				</div>
			</div>

			<!-- 视频 -->
			<el-card-more :card-more-data="tuijianVideoDatas">
				<div class="card-more-content-slot clearfix" slot="content">
					<el-card-more-block class="card-more-padding" v-for="(item, index) in tuijianVideoDatas.list" :card-more-block-data="item" :key="index"></el-card-more-block>
				</div>
			</el-card-more>

			<!-- 音频 -->
			<el-card-more :card-more-data="tuijianAudioDatas">
				<div class="card-more-content-slot clearfix" slot="content">
					<el-card-more-block class="card-more-padding" v-for="(item, index) in tuijianAudioDatas.list" :card-more-block-data="item" :key="index"></el-card-more-block>
				</div>
			</el-card-more>

			<!-- 培训导航推荐 -->
			<a :href="bannerCenterDatas.adLinked" class="tuijian-banner">
			<!-- <a href="bannerCenterDatas.adLinked" class="tuijian-banner" @click="goPage('course', {'type': 1})"> -->
				<img :src="bannerCenterDatas.adImage" alt="">
			</a>

			<!-- 培训头条 -->
			<el-card-more :card-more-data="indexNewsList">
				<div class="peixun-news" slot="content">
					<el-img-text-news :img-text-data="item" @click="goPage('newsDetail', { 'id': item.id })" v-for="(item, index) in indexNewsList.list" :key="index"></el-img-text-news>
				</div>
			</el-card-more>
			
			<!-- 专栏订阅 -->
			<el-card-more v-show="false" :card-more-data="specialColumn">
				<div class="clearfix" slot="content">
					<el-img-text-zhuanlan v-for="(item, index) in specialColumn.list" :img-text-data="item" :key="index"></el-img-text-zhuanlan>
				</div>
			</el-card-more>
		</div>
	</div>
</template>

<script type="text/babel">
	import hold from 'src/commons/hold'
	import { Group, Cell, Swiper, Card, Panel, Popup, XInput, XButton, TransferDom } from 'vux'
	
	import elTuijian from 'components/tuijian/tuijian'
	import elImgText from 'components/img-text/img-text'
	import elImgTextZhuanlan from 'components/img-text/img-text-zhuanlan'
	import elVideo from 'components/video/video'
	import elCardMore from 'components/card/card-more'
	import elCardMoreBlock from 'components/card/card-more-block'
	import elImgTextNews from 'components/img-text/img-text-news'

	import { getterIndex } from 'services/index';
	import imgTuijianHeader from 'assets/img/index/header.png'

	export default {
		name: 'index',
		directives: {
	    TransferDom
	  },
		components: { Group, Cell, Swiper, Card, Panel, Popup, XInput, XButton, elTuijian, elImgText, elImgTextZhuanlan, elVideo, elCardMore, elCardMoreBlock, elImgTextNews },
	  data () {
	    return {
	    	bannerWidthHeight: this.wordBook.bannerWidthHeight,
	      bannerTopDatas: [],
	      bannerCenterDatas: {},
	      bannerBottomDatas: [],
	      entryDatas: getterIndex.entryDatas,
	      tuijianAudioDatas: {
	      	title: "音频",
	      	url: 'rankList',
	      	params: {
	      		type: 'audio'
	      	},
	      	list: []
	      },
	      tuijianVideoDatas: {
	      	title: "视频",
	      	url: 'rankList',
	      	params: {
	      		type: 'video'
	      	},
	      	list: []
	      },
	      indexNewsList: {
	      	title: '培训头条',
	      	url: 'news',
	      	list: []
	      },
	      specialColumn: {
	      	title: "专栏订阅",
	      	list: []
	      }
	    }
	  },
	  mounted () {
	  	this.fetchData();
	  },
	  methods: {
	  	fetchData	() {
	  		// 获取所有数据
	  		this.getBanner(0);
	  		this.getAudio();
	  		this.getVideo();
	  		this.getNews();
	  	},
	  	getBanner (type) {
	  		// index/advertisement/
	  		let _this = this;
  		 	_this.$http.post('/api/index/advertisement',
	  				this.qs.stringify({
							type: type
						})
	  			).then(function(e) {
	  				if(e.data.code == 200) {
	  					if(e.data.data.adTopList.length > 0) {
		  					_this.bannerTopDatas = e.data.data.adTopList.map(function(item, index){
		  						return {
		  							url: item.adLinked,
									  img: item.adImage,
									  title: item.name
		  						}
		  					});
	  					}

	  					_this.bannerCenterDatas = e.data.data.adMidList[0];

	  					if(e.data.data.adBottomList.length > 0) {
		  					_this.bannerBottomDatas = e.data.data.adBottomList.map(function(item, index){
		  						return {
		  							url: item.adLinked,
									  img: item.adImage,
									  title: item.name
		  						}
		  					});
	  					}

	  				} else {
	  					_this.$vux.alert.show({
	  						content: e.data.msg
	  					})
	  				}
	  			});
	  	},
	  	getAudio () {
	  		let _this = this;
  		 	_this.$http.post('/api/product/online/list',
	  				_this.qs.stringify({
							onlineType: 0, // 音频
							topTag: 1,
							freeStatus: '',
							showRankingStatus: '',
							productId: "",
							pageNum: 1,
							pageSize: 4,
							customerId: ''
						})
	  			).then(function(e) {
	  				if(e.data.code == 200) {
	  					let res = e.data.data,
	  							list = [];
	  					
	  					if(res.result.length > 0) {
	  						list = res.result.map(function(item, index){
	  							return {
										id: item.id,
										src: item.images,
										name: item.name,
										originalPrice: item.originalPrice,
										price: item.price,
										desc: item.subscribeStatus,
										type: 'audio'
									}
								})

								_this.tuijianAudioDatas.list = list;
	  					}

	  				} else {
	  					_this.$vux.alert.show({
	  						content: e.data.msg
	  					})
	  				}
	  			});
	  	},
	  	getVideo () {
	  		let _this = this;
  		 	_this.$http.post('/api/product/online/list',
	  				this.qs.stringify({
							onlineType: 1, // 视频
							topTag: 1,
							freeStatus: '',
							showRankingStatus: '',
							productId: "",
							pageNum: 1,
							pageSize: 4,
							customerId: ''
						})
	  			).then(function(e) {
	  				if(e.data.code == 200) {
	  					let res = e.data.data,
	  							list = [];
	  					
	  					if(res.result.length > 0) {
	  						list = res.result.map(function(item, index){
	  							return {
										id: item.id,
										src: item.images,
										name: item.name,
										originalPrice: item.originalPrice,
										price: item.price,
										desc: item.subscribeStatus,
										type: 'video'
									}
								})

								_this.tuijianVideoDatas.list = list;
	  					}
	  				} else {
	  					_this.$vux.alert.show({
	  						content: e.data.msg
	  					})
	  				}
	  			});
	  	},
	  	getNews () {
	  		let _this = this;
  		 	_this.$http.post('/api/news/list',
	  				this.qs.stringify({
							"topTag": 1,
							"pageNum": 1,
							"pageSize": 4,
						})
	  			).then(function(e) {
	  				if(e.data.code == 200) {
	  					let res = e.data.data;
	  					if(res.result && res.result.length > 0) {
	  						_this.indexNewsList.list = res.result.map(function(item, index){
	  							return {
										time: item.updateTime || item.createTime,
										desc: item.content,
										id: item.id,
										readCount: item.readCount,
										img: _this.resolveImg(item.images),
										title: item.title
									}
	  						});
	  					}
	  				} else {
	  					_this.$vux.alert.show({
	  						content: e.data.msg
	  					})
	  				}
	  			});
	  	},
	  	entry (url, type) {
	  		this.$router.push({ name: url, params: { type: type }})
	  	},
	  	videoAudioDetail (url, id) {
	  		this.$router.push({ name: url, params: { id: id }})
	  	},
			goPage (url, query) {
				if(query) {
					this.$router.push({ name: url, query: query })
				} else {
					this.$router.push({ name: url})
				}
			}
	  }
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	@import '~assets/css/entry';
	@import '~assets/css/form';
	
	$playImgW: 60px;
	$playBtnW: 30px;

	.index {
		padding-bottom: 30px;
	}

	.ad {
		margin: 0 auto;
	}

	.course-others {
		@extend %clearfix;
		padding: $padding;

		a {
			float: left;
			width: 50%;
			display: block;

			&:nth-child(odd) {
				padding-right: 5px;
			}

			&:nth-child(even) {
				padding-left: 5px;
			}
		}

		img {
			width: 100%;
		}
	}

	.tuijian-data {		    
		img {
			border-radius: $tuijianImgW
		}
	}

	.card-block {
		.card-block-header {
			position: relative;
			padding: 0 $padding;
			@include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
			line-height: 50px;

			h5 {
				font-size: 16px;
				color: $fontColorBlack;
			}

			.link {
				position: absolute;
				top: 0;
				right: $padding;

				span {
					margin-left: .5em;
				}
			}
		}

		.card-block-content {
			padding: 0 $padding;
		}
	}

	.quotation-index {
		padding: $padding 0;
		display: flex;

		.quotation-index-img {
			width: 102px;
			height: 80px;
			background-size: cover;
		}

		p {
			flex: 1;
			padding-left: 1em;
			line-height: 2;
			@include ellipsisMore(3);
		}
	}

	// 推荐banner
	.tuijian-banner {
 		padding: $padding;
    display: block;

 		img {
 			width: 100%;
 		}
	}

	// 培训头条新闻
	.peixun-news {
		padding: $padding/2 0;

		.img-text {
			padding-left: 0;
			padding-right: 0;
		}
		
		.peixun-block {
			position: relative;
			@include ellipsisOne;
			line-height: 30px;
			text-indent: 20px;

			&:before {
				content: "";
				position: absolute;
				top: 0;
				left: 0;
				width: 0;
		    height: 0;
		    border-top: 5px solid transparent;
		    border-left: 10px solid $fontColorGray;
		    border-bottom: 5px solid transparent;
		    margin-top: 10px;
			}
		}
	}

	.card-more-content {
		padding-top: 15px;
	}

	.card-more-content-slot {
		padding: $padding/2 0;
	}

	.card-more-padding {
		border-right: 5px solid transparent;
		
		&:nth-child(even) {
			border-left: 5px solid transparent;
			border-right: 0;	
		}
	}
</style>