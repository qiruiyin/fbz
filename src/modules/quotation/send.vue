<!-- 
	发送朋友圈，只针对老板
 -->

<template>
	<div class="quotation" v-cloak>
	  
		<div class="container" v-cloak>
		  <scroller lock-x :height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offst="200">
		  	<div>
		  		<header>
						<img :src="user.img" alt="">
						<div class="header-info">
							<p>{{ user.name }}</p>
							<p>{{ user.course }}</p>
						</div>
					</header>
					
					<div v-cloak>
						<div class="add-quotation quotation-list">
							<div class="quotation-list-content">
								<div class="quotation-time">
									今天				
								</div>
								<div class="block" @click="goAdd">
									<div class="block-img">
										<div class="img"></div>
									</div>
									<div class="block-info">添加语录</div>
								</div>
							</div>
						</div>

						<el-quotation-send @on-delete="deleteQuotation" :quotation-data="item" v-for="(item, index) in quotationData" :key="index"></el-quotation-send>

						<el-load-more :load-all="scrollerInfo.loadAll"></el-load-more>
					</div>
				</div>
			</scroller>
		</div>
	</div>
</template>

<script type="text/babel">
	import { Scroller } from 'vux'
	import { mapState } from 'vuex'
	import elQuotationSend from 'components/quotation/send'
	import elLoadMore from 'components/load-more/load-more'

	export default {
		name: "sendQuotation",
		components: { Scroller, elQuotationSend, elLoadMore },
		data () {
			return {
				title: "经典语录发送",
				quotationInfo: {
					pageNum: 1,
					pageSize: this.wordBook.pageSize
				},
				scrollerInfo: {
					offsetBottom: 1,
					onFetching: false,
					loadAll: false, // 是否加载完
				},
				quotationData: [
					// {
					// 	title: '',
					// 	content: '',
					// 	img: [],
					// 	time: '',
					// 	qulikes: 0,
					// 	comments: [
					// 		{
					// 			receiveCode: "",
					// 			receiveName: "",
					// 			sendCode: "",
					// 			sendName: "",
					// 			content: ""
					// 		}
					// 	],
					// 	zans: []
					// }
				],
				commentShow: false,
				commentValue: "",
				commentCurrentClick: "",
				sendBtn: {
					status: false,
					value: "default",
					sendStatus: false // 是否在调用接口
				}
			}
		},
		computed: {
	    ...mapState({
	      user: state => state.user,
	    })
	  },
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData () {
				let _this = this;

				_this.$http.post('/wechat/quotationsmobile/listUser',
					{
						pageNum: _this.quotationInfo.pageNum,
						pageSize: _this.quotationInfo.pageSize,
						userCode: _this.user.userCode,
						openId: _this.user.openId
					}).then(function(e) {
						let responseData = e.data.data,
								list = [];
						if(e.data.code == 200) {
							if(responseData && responseData.list) {
								if(responseData.list.length > 0) {
									list = responseData.list.map(function(item, index){
										let img = [];
										if(item.img.length > 0)
											img = item.img.map(function(it, ind){
												return {
													src: _this.resolveImg(it),
													style: {
														backgroundImage: "url(" + _this.resolveImg(it) + ")"
													},
												}
											});

										return {
											code: item.code,
											comments: item.comments,
											content: item.content,
											id: item.id,
											img: img,
											qulikes: item.qulikes,
											time: item.time,
											title: item.title,
											zans: item.zans
										}
									});
								}

								if(_this.quotationInfo.pageNum == 1){
									_this.quotationData = list;
								} else {
									_this.quotationData = _this.quotationData.concat(list);
								}
							}

							if(list.length < _this.quotationInfo.pageSize) {
								_this.scrollerInfo.loadAll = true;
							}

							_this.quotationInfo.pageNum++;

						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
						
						_this.resetView();
						_this.scrollerInfo.onFetching = false;					
					})
			},
			resetView () {
				let _this = this;
				_this.$nextTick(() => {
          _this.$refs.scrollerBottom.reset()
        })
			},
			loadMore () {
				if(this.scrollerInfo.onFetching || this.scrollerInfo.loadAll) {

				} else {
					this.scrollerInfo.onFetching = true;					
					this.fetchData();
				}
			},
			goAdd () {
				this.$router.push({ name: "quotationAdd" });
			},
			deleteQuotation (data) {
				let _this = this;
				_this.quotationData.map(function(item, index){
					if(item.code = data) {
						_this.quotationData.splice(index, 1);
					}
				})
				_this.resetView()
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	@import '~assets/css/quotation';

	$userCenterheaderImgW: 50px;
	
	header {
		padding: $paddingTop 0;
		background-color: $colorOrange;
		text-align: center;
		color: #fff;

		img {
			width: $userCenterheaderImgW;
			height: $userCenterheaderImgW;
			margin: 0 auto;
			border-radius: $userCenterheaderImgW;
		}
		
		.header-info {
			width: 100%;
			line-height: 2;
			@extend %clearfix;

			p {
				float: left;
				width: 50%;
				padding: 0 .5em;
				text-align: right;

				&:last-child {
					text-align: left;
				}
			}
		}
	}

	.quotation {
		// width: 100%;
		// height: 100%;
	}

	.container {
		// width: 100%;
		// height: 100%;
	}
	
	.comment-card {
		padding: 3px 0;
	}

	.btns {
		padding: $padding;
	}
</style>