<!-- 
	商城详情
 -->

<template>
	<div class="detail" v-cloak>
		<div class="detail-body">
			<div class="banner" @click="show">
	    	<swiper v-model="goodsMsg.bannerIndex"  auto dots-position="center" :list="goodsMsg.img" :aspect-ratio="800/750" loop></swiper>
			</div>
			<div v-transfer-dom>
	      <previewer :list="goodsMsg.imgPriviwer" ref="previewer"></previewer>
	    </div>

			<div class="detail-ggct uiBorderTop">
				<div :class="['detail-ggct-info', 'detail-ggct-icon-' + item.icon]" v-for="(item, index) in ggctData" :key="index">{{ item.name }}</div>
			</div>

			<div class="msg uiBorderTop">
				<div class="msg-header">{{ goodsMsg.title }}</div>
				<div class="msg-body">
					<div class="msg-body-info">
						<div class="price">单价<i>￥</i>{{ goodsMsg.price }}</div>
					</div>
					<!-- <div class="num">
						<x-number title="数量" :min="1" class="num-data" v-model="goodsMsg.num"></x-number>
					</div> -->
				</div>
			</div>
			
			<div class="tab uiBorderTop">
				<div class="tab">
		      <tab v-model="tabSelected">
		        <tab-item :selected="tabSelected == index" v-for="(item, index) in tabDatas" @click="tabSelected = index" :key="index">{{ item.title }}</tab-item>
		      </tab>
		      <div class="list">
	      		<template v-if="tabSelected == 0">
		          <div class="rich-html" v-html="goodsMsg.details"></div>
	      		</template>
	      		<template v-if="tabSelected == 1">
	          	<el-comment :comment-info="commentInfo"></el-comment>
	      		</template>
	      	</div>
		    </div>
	    </div>

			<el-cart :product-info="goodsMsg"></el-cart>
		</div>

		<el-back-index></el-back-index>
	</div>
</template>

<script type="text/babel">
	import { XNumber, Swiper, Card, Tab, TabItem, SwiperItem, Previewer, TransferDom } from 'vux'

	import elComment from 'components/comment/comment'
	import elCart from 'components/cart/cart'
	import elBackIndex from 'components/cart/back-index'

	export default {
		name: "mallDatail",
		directives: {
	    TransferDom
	  },
		components: { XNumber, Swiper, Card, Tab, TabItem, SwiperItem, Previewer, elComment, elCart, elBackIndex },
		data () {
			return {
				title: "商城详情",
				cartNum: 0,
				goodsId: this.$route.query.id,
				ggctData: [
					{
						name: "七天退换",
						icon: "guan"
					},{
						name: "正品保证",
						icon: "zheng"
					},{
						name: "优品优价",
						icon: "you"
					},{
						name: "极速发货",
						icon: "su"
					},
				],
				commentInfo: {
					productId: this.$route.query.id,
					commentType: 1,
					hasBuy: 0
				},
				goodsMsg: {
					id: this.$route.query.id,
					img: [],
					imgPriviwer: [],
					bannerIndex: 0,
					title: "",
					price: "",
					sellNum: "",
					num: 1,
					author: "",
					address: "",
					code: "",
					details: ""
				},
				tabDatas: [
					{
						value: 'detail',
						title: '详情',
					},{
						value: 'comment',
						title: '评论',
					}
				],
				tabSelected: this.$route.query.type ? parseInt(this.$route.query.type) : 0,
				tabContentDatas: {
					detail: [],
					comment: [],
					record: []
				},
				details: "",
				commentCode: this.$route.query.id,
				recordData: []
			}
		},
		computed: {
			
		},
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData () {
				let _this = this;

				_this.$http.post('/api/goods/detail',
					_this.qs.stringify({
						id: _this.goodsId
					})).then(function(e) {
						if(e.data.code == 200) {
							let responseData = e.data.data;
			  			_this.goodsMsg.title = responseData.name;
			  			_this.goodsMsg.originalPrice = responseData.originalPrice;
			  			_this.goodsMsg.price = responseData.price;
			  			_this.goodsMsg.details = _this.resolveRichTextImg(responseData.content);
			  			_this.commentInfo.hasBuy = responseData.buyStatus;
			  			
			  			if(responseData.carouselImages) {
				  			let img = responseData.carouselImages.split(";");
				  			_this.goodsMsg.img = img.map(function(item, index){
				  				return {
				  					img: _this.resolveImg(item)
				  				}
				  			});	

				  			_this.goodsMsg.imgPriviwer = img.map(function(item, index){
				  				return {
				  					src: _this.resolveImg(item)
				  				}
				  			});	
			  			}
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
				});

				// _this.payRecord(1, 10);	
			},
			payRecord (pageNum = 1, pageSize = 10) {
				let _this = this;
				_this.$http.post('/wechat/shop/productByHistory',
					{
						code: this.$route.params.id,
						userCode: "",
						pageNum: pageNum,
						pageSize: pageSize
					}).then(function(e) {
						if(e.data.code == 200) {
							let responseData = e.data.data;
							if(responseData.list.length > 0) {
								if(pageNum > 0) {
									let listData = responseData.list.map(function(item, index) {
										return {
											img: _this.resolveImg(item.header),
											name: item.name,
											date: item.time
										}
									});
									_this.recordData.push.apply(_this.recordData, listData);
								} else {
									_this.recordData = responseData.list.map(function(item, index) {
										return {
											img: _this.resolveImg(item.header),
											name: item.name,
											date: item.time
										}
									});
								}
							}	
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
				});	
			},
			show () {
	      this.$refs.previewer.show(this.goodsMsg.bannerIndex)
	    },
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
  
  $imgW: 44px;

  .detail {
  	padding-bottom: $containerBottom;
  }
	
	.banner {
		img {
			width: 100%;
			padding: $padding*2 0;
		}
	}

	.msg {
	  padding: $padding;
	  line-height: 1.5;
	}

	.msg-header {
		font-size: 16px;
		color: $fontColorBlack;	
	}

	.msg-body {
		.msg-body-info {
			span {
				display: inline-block;

				&:last-child {
					float: right;
				}
			}
		}
	}

	.msg-body-info {
		
		.price {
			font-size: 14px;
			color: $colorRed;
			display: inline-block;

			i {
				font-size: 16px;
				font-style: normal;
			}
		}

		.cart {
			float: right;
			font-size: 22px;
		}
	}

	.num {
		.num-data {
			padding: 0;
		}
	}

	.record {
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
	
	.detail-ggct {
		padding: $padding;
		background: #fff;
		display: flex;
	}

	$ggctDataIcon: guan, zheng, you, su;

	.detail-ggct-info {
		position: relative;
		flex: 1;
		text-align: center;
		text-indent: 12px;
		font-size: 12px;

		&:before {
			content: "";
			position: absolute;
			top: 50%;
			left: 50%;
			margin-left: -36px;
			margin-top: -10px;
			width: 18px;
			height: 20px;
			background: url("~assets/img/mall/guan.png") no-repeat;
			background-size: 80%;
			background-position: center;
		}
	}


@each $iconName in $ggctDataIcon {
	.detail-ggct-icon-#{$iconName} {
		&:before {
			background-image: url("~assets/img/mall/#{$iconName}.png");
		}
	}
}
</style>