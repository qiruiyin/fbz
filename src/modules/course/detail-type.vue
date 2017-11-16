<!-- 
	音频详情页
 -->
<template>
	<div class="detail" v-if="list.title" v-cloak>
		<div class="detail-container">
			<el-img-text-rank @on-pay-show="hiddenVideo" class="detail-header" :img-text-data="list" from-rank="true" :img-text-btn="-1"></el-img-text-rank>
			
			<div class="tab">
	      <tab v-model="tabSelected">
	        <tab-item :selected="tabSelected == index" v-for="(item, index) in tabDatas" @click="tabSelected = index" :key="index">{{ item.title }}</tab-item>
	      </tab>
	      <div class="list">
	      	<div v-show="tabSelected == 0">
	        	<template v-if="courseInfo.type == 'video' || courseInfo.type == 'course'">        		
							<div :class="['video', { 'hidden': !videoHidden }]">
								<el-video :video-data="course" :course-info="list" :has-buy="hasBuy"></el-video>
							</div>
	        	</template>
	        	<template v-if="courseInfo.type == 'audio'">        		
							<el-audio :audio-data="course" :course-info="list" :has-buy="hasBuy"></el-audio>
	        	</template>
	          <div class="detail-header-msg">
							<div class="detail-header-msg-desc">
								<el-reward @reward-done="refreshReward" :reward-data="courseInfo"></el-reward>
							</div>
						</div>
						<el-reward-list @reward-done="refreshReward" :reward-info="rewardInfo" :reward-refresh-status="rewardRefreshStatus"></el-reward-list>
	      	</div>
	        
	        <div v-show="tabSelected == 1">	        	
						<el-comment :comment-info="commentInfo"></el-comment>
	        </div>

	        <div v-show="tabSelected == 2">
	        	<el-img-text-rank v-for="(item, ind) in relateData" :img-text-data="item" :img-text-btn="-1" from-rank="true" :key="ind"></el-img-text-rank>
	        </div>
	      </div>
	    </div>
		</div>

		<div v-transfer-dom>
			<div class="detail-btn-bottom">
				<div class="detail-bottom-btn" @click="goPage('course', { type: '1' })">线下课程</div>
				<div v-if="hasBuy == 0" class="detail-bottom-btn buy" @click="createOrder">订阅：￥{{ list.pay }}</div>
				<div v-else class="detail-bottom-btn buy">已订阅</div>
			</div>
		</div>
	</div>
</template>

<script type="text/babel">
	import { XButton, Flexbox, FlexboxItem, Tab, TabItem, Swiper, SwiperItem, Sticky, TransferDom } from 'vux'
	import elImgTextRank from 'components/img-text/img-text-rank'
	import elComment from 'components/comment/comment'
	import elReward from 'components/reward/reward'
	import elRewardList from 'components/reward/reward-list'
	import elProductAd from 'components/product-ad/product-ad'
	import elVideo from 'components/video/video'
	import elAudio from 'components/video/audio'

	import imgPoster from 'assets/img/audio.png'

	export default {
		name: 'detail',
		directives: {
	    TransferDom
	  },
		components: { 
			XButton, Flexbox, FlexboxItem, Tab, TabItem, Swiper, SwiperItem, Sticky, elImgTextRank, elComment, elReward, elRewardList, elProductAd, elVideo, elAudio
		},
		data () {
			return {
				title: '课程详情',
				imgPoster: '',
				hasBuy: false, // 是否购买
				playVisitStatus: false, // 是否点击过
				courseInfo: {
					spareType: "0", // spareType打赏类型 0产品 1头条
					type: this.$route.query.type,
					id: this.$route.query.id,
					name: "",
					desc: "",
				},
				rewardInfo: {
					spareType: "0", // spareType打赏类型 0产品 1头条
					goodsId: this.$route.query.id
				},
				commentInfo: {
					productId: this.$route.query.id,
					commentType: 1,
					hasBuy: 0
				},
				courseAudioData: {
					label: '测',
					audioStatus: false,
					audioProgress: 0,
					time: 100,
					audio: ''
				},
				list: {
					btn: '-1',
					title: '',
					type: '',
					pay: '',
					originalPrice: '',
					isBuy: '0',
					img: '',
					like: {
						num: 0,
						percent: 0
					},
					url: '',
					query: {
						id: this.$route.query.id,
						type: this.$route.query.type
					}
				},
				tabDatas: [
					{
						value: 'detail',
						title: '详情',
					},{
						value: 'comment',
						title: '评论',
					},{
						value: 'relate',
						title: '相关',
					}
				],
				tabSelected: 0,
				course: {
					src: '',
					course: '',
					name: '',
					courseNum: 0,
					lecturer: '',
					subscribe: 0,
					desc: '',
					fileUrl: '',
					playauth: '',
					fileThumb: ''
				},
				relateDataBtn: "-1",
				relateData: [
					{
						title: '',
						type: '',
						pay: '',
						isBuy: '0',
						img: '',
						like: {
							num: 0,
							percent: 0
						},
						url: '',
						query: {}
					}
				],
				playBtn: {
					status: false,
					obj: ''
				},
				type: {
					video: 1,
					audio: 0
				},
				rewardRefreshStatus: false, // 刷新列表数据
				videoHidden: true, // 微信android机器video过高隐藏
			}
		},
		watch: {
	    // 如果路由有变化，会再次执行该方法
	    '$route' () {
	    	this.$router.go(0)
	    }
	  },
		mounted () {
			this.fetchData();
		},
		methods: {
			listenVideo () {
				let _this = this;
				let video = document.querySelector('.video');

				video.addEventListener('timeupdate', function() {
					if(video.currentTime > 30) {
						video.pause();
						alert("请先购买");
						_this.$vux.alert.show({
							content: "请先购买"
						})
					} else {
						video.play();
					}
				});
			},
			fetchData () {
				let _this = this,
						relateData = [],
						url,
						params = {};

				_this.getRelateData();
				
				if(this.courseInfo.type == "course") {
					// url = '/wechat/discover/product/lessonDetails';
					// params = {
					// 			"userCode": _this.$store.state.user.userCode,
					// 			"productCode": _this.courseInfo.code,
					// 			"type": "video"
					// 		};
				} else {
					url = '/api/product/online';
					params = {
						customerId: _this.$store.state.user.userId,
						productId: _this.courseInfo.id,
					};
				}
				
				this.$http.post(url,
						_this.qs.stringify(params)
					).then(function(e) {
						let responseData = e.data.data;

						if(e.data.code == 200) {
							_this.commentInfo.hasBuy = responseData.price == 0 || responseData.subscribeStatus > 0 ? '1' : '0';
							_this.hasBuy = responseData.price == 0 || responseData.subscribeStatus > 0 ? '1' : '0';
							
							if(_this.courseInfo.type == "course") {
								_this.list.btn = '-1';
								_this.relateDataBtn = '-1';
								_this.hasBuy = '1';
							} else {
								_this.list.btn = responseData.price == 0 || responseData.subscribeStatus > 0 ? '-1' : '0';
								_this.relateDataBtn = '0';
							}
							_this.list.title = responseData.name;
							_this.list.pay = responseData.price;
							_this.list.originalPrice = responseData.originalPrice;
							_this.list.isBuy = responseData.subscribeStatus;
							_this.list.type = responseData.remark;
							_this.list.img = responseData.images;
							_this.list.like = {
								num: responseData.viewCount,
								percent: responseData.rank ? responseData.rank : 0,
							};

							_this.course.fileUrl = responseData.fileUrl;
							_this.course.name = responseData.name;
							_this.course.fileThumb = responseData.images;
							_this.courseInfo.desc = _this.resolveRichTextImg(responseData.content);
							_this.courseInfo.name = responseData.name;

							if(_this.courseInfo.type == 'audio') {
								_this.courseAudioData.audio = responseData.fileUrl;
							}
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
					}
				);
			},
			getRelateData () {
				let _this = this;
				this.$http.post('/api/product/online/list',
						this.qs.stringify({
							onlineType: _this.type[_this.$route.query.type],
							topTag: "",
							freeStatus: "",
							showRankingStatus: "",
							productId: _this.courseInfo.id,
							pageNum: 1,
							pageSize: 4
						})
					).then(function(e) {
						let list = [];

						if(e.data.code == 200) {
							if(e.data.data && e.data.data.result && e.data.data.result.length > 0) {
								list = e.data.data.result.map(function(item, index) {
									return {
										img: item.images,
										id: item.id,
										title: item.name,
										type: item.subscribeStatus,
										pay: item.price,
										originalPrice: item.originalPrice, // 原价
										isBuy: item.subscribeStatus || 0,
										like: {
											num: item.viewCount,
											percent: item.rank || 0
										},
										url: 'courseTypeDetail',
										query: {
											id: item.id,
											type: _this.$route.query.type
										}
									}
								})
							}
							_this.relateData = list;
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}

				})
			},
			playBtnClick () {
				if(!this.playVisitStatus) {
					this.playVisitStatus = true;
					this.playCount(this.$route.query.code);
				}

				if(this.playBtn.status) {
					this.playBtn.obj = document.querySelector(".play-audio").pause();
				} else {
					this.playBtn.obj = document.querySelector(".play-audio").play();
				}
				this.playBtn.status = !this.playBtn.status;
			},
			playVideo () {
				if(!this.playVisitStatus) {
					this.playVisitStatus = true;
					this.playCount(this.$route.query.code);
				}
			},
			hiddenVideo (data) {
				this.videoHidden = !data
			},
			goPage(url, query) {
				this.$router.push({ name: url, query: query });
			},
			createOrder () {
				let _this = this;
				if(!this.isLogin()) return false;

				_this.$http.post('/api/product/online/order/confirm',
					_this.qs.stringify({
						productId: _this.courseInfo.id,
						customerId: _this.$store.state.user.userId,
						type: 2, 
						voucherStatus: 0,
						num: 1
					})).then(function(e) {
						if(e.data.code == 200) {
							_this.$router.push({name: 'confirmOrder', query: { orderId: e.data.data.orderId, orderType: 2, type: e.data.data.type }});
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							});
						}
					})
			},
			refreshReward (val) {
				this.rewardRefreshStatus = val;
			}
		}
	}
</script>

<style lang="scss">
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	.detail {
		.detail-container {
			.text {
				.type {
					@include ellipsisMore(30);
				}
			}
		}
	}
</style>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
  @import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	.container {
		
	}

	.detail-container {
		padding-bottom: 50px;
	}

	.list {
	}

	.list {
		padding-top: $padding;

		.video, .audio-msg {
			width: 100%;
			// height: 200px;
			background: #333;

			video {
				width: 100%;
				height: 100%;
			}

			&.hidden {
				video {
					visibility: hidden;
					display: none;
				}
			}
		}

		.audio-msg {
			position: relative;
			height: auto;

			img {
				width: 100%;
			}
		} 

		.detail-header-msg {
			padding: $padding;
			line-height: 2; 	
		}

		.detail-header-msg-desc {
			padding: $paddingTop 0;
			text-align: center;

			& > p {
				line-height: 1.35;
			}
		}
	}

	.swiper-desc {
		padding: $padding;
	}

	// 音乐播放
	$playBtnW: 60px;

	.play-btn {
		position: absolute;
		bottom: $padding;
		left: 0;
		right: 0;
		width: $playBtnW;
		height: $playBtnW;
		margin: 0 auto;
		border-radius: $playBtnW;
		background: url("~assets/img/index/play-start.png") no-repeat;
		background-size: 100%;

		&.active {
			// animation: mymove 2s  linear infinite;
			background-image: url("~assets/img/index/play.png");
		}
	}

	@keyframes mymove {
		from {
			transform: rotate(0);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.audio-detail-desc {
		margin-bottom: $paddingTop;
		padding: 0 6px;
	
		&.active {
			.audio-detail-desc-content {
				max-height: 11111400px;
			}
		}

		.fa {
			font-size: 20px;
			text-indent: .5em;
		}

		.audio-detail-desc-header {
			font-size: 18px;
			color: $colorRedDeep;
		}

		.audio-detail-desc-content {
			max-height: 0;
			overflow: hidden;
			transition: 1s;

			p {
				text-align: justify;
				text-indent: 2em;
			}
		}
	}
  .detail-btn-bottom {
		@include halfpxline(0, $borderColor, 1px, 0, 0, 0);
  	position: absolute;
  	bottom: 0;
  	left: 0;
  	right: 0;
  	line-height: 50px;
  	text-align: center;
  	background: $colorYellowEasy;
  	color: #fff;
  	font-size: 18px;
  	display: flex;
  }

  .detail-bottom-btn {
  	flex: 1;

  	&.buy {
  		background: $colorRedDeep;
  	}
  }
</style>