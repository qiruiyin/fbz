<!-- 
	课程详情页
 -->
<template>
	<div class="detail" v-show="courseInfo.name" v-cloak>
		<div class="container">
			<div>
      	<el-img-text-relate :img-text-data="courseInfo"></el-img-text-relate>
			</div>
			
			<div class="tab">
	      <tab v-model="tabSelected">
	        <tab-item :selected="tabSelected == index" v-for="(item, index) in tabDatas" @click="tabSelected = index" :key="index">{{ item.title }}</tab-item>
	      </tab>
	      <div class="list">
	      	<template v-if="tabSelected == 0">
	      		<div class="rich-html" v-html="courseInfo.content"></div>
	      	</template>
	        
	       <!--  <template v-if="tabSelected == 1">
	        	<el-teacher></el-teacher>
	        </template>
 -->
	        <template v-if="tabSelected == 1">
	        	<el-img-text-relate v-for="(item, index) in relateData" :img-text-data="item" :key="index"></el-img-text-relate>
	        </template>

	        <template v-if="tabSelected == 2">
	        	<!-- <el-comment :is-comment="hasBuy" :comment-code="courseInfo.code" :comment-type="0"></el-comment> -->
	        </template>
	      </div>
	    </div>
		</div>
		
		<div v-transfer-dom>
			<div class="detail-btn-bottom">
				<div class="detail-bottom-btn">课程咨询</div>
				<div class="detail-bottom-btn buy" @click="goPage('courseOrder', { id: courseInfo.periodsId, type: 'course' })">马上订票</div>
			</div>
		</div>
	</div>
</template>

<script type="text/babel">
	import { XButton, Flexbox, FlexboxItem, Tab, TabItem, Swiper, SwiperItem, Sticky, TransferDom } from 'vux'
	import elImgTextRank from 'components/img-text/img-text-rank'
	import elImgTextRelate from 'components/img-text/img-text-relate'
	import elComment from 'components/comment/comment'
	import elReward from 'components/reward/reward'
	import elWitness from 'components/witness/witness'
	import elVideo from 'components/video/video'
	import elTeacher from 'components/teacher/teacher'

	export default {
		name: 'detail',
		directives: {
	    TransferDom
	  },
		components: {
			XButton, Flexbox, FlexboxItem, Tab, TabItem, Swiper, SwiperItem, Sticky, elImgTextRank, elImgTextRelate, elComment, elReward, elWitness, elVideo, elTeacher
		},
		data () {
			return {
				title: '课程详情',
				courseInfo: {
					periodsId: this.$route.query.periodsId,
					content: "",
					name: "",
					price: "",
					originalPrice: "",
					status: "",
					address: "",
					startDate: "",
					endDate: "",
					seller: "",
					isClick: false
				},
				tabDatas: [
					{
						value: 'detail',
						title: '详情',
					// },{
					// 	value: 'author',
					// 	title: '讲师',
					},{
						value: 'relate',
						title: '相关',
					},{
						value: 'comment',
						title: '客户见证',
					}
				],
				tabSelected: 0,
				relateData: [
					{
						title: '',
						type: '',
						pay: '',
						img: '',
						like: '',
						url: '',
						query: {}
					}
				],
				witnessData: this.$route.query.periodsId,
				playBtn: {
					status: false,
					obj: ''
				}
			}
		},
		watch: {
	    // 如果路由有变化，会再次执行该方法
	    '$route': 'fetchData'
	  },
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData () {
				let _this = this;
				_this.getRelate();
				_this.$http.post('/api/curriculum/curriculumDetails',
					_this.qs.stringify({
						periodsId: _this.courseInfo.periodsId,
					})).then(function(e) {
						if(e.data.code == 200) {
							let resInfo = e.data.data;
							_this.courseInfo.img = resInfo.periodsImg;
							_this.courseInfo.name = resInfo.periodsName;
							_this.courseInfo.content = _this.resolveRichTextImg(resInfo.content);
							_this.courseInfo.price = resInfo.price;
							_this.courseInfo.originalPrice = resInfo.originalPrice || resInfo.price;
							_this.courseInfo.status = resInfo.sellTicketStateExplain; // 售票状态
							_this.courseInfo.address = resInfo.address;
							_this.courseInfo.startDate = resInfo.startTime;
							_this.courseInfo.endDate = resInfo.endTime;
							_this.courseInfo.seller = resInfo.remainingNumber;
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
					}
				);
			},
			getRelate () {
				let _this = this;
				_this.$http.post('/api/curriculum/relevantCurriculum',
					_this.qs.stringify({
						periodsId: _this.courseInfo.periodsId,
						pageNum: 1,
						pageSize: 4
					})).then(function(e) {
						if(e.data.code == 200) {
							let resInfo = e.data.data,
									list = [];

							if(e.data.data.result && e.data.data.result.length > 0) {
								list = e.data.data.result.map(function(item, index) {
									return {
										img: _this.resolveImg(item.periodsImg),
										id: item.periodsId,
										name: item.periodsName,
										status: item.sellTicketStateExplain,
										price: item.price,
										originalPrice: item.originalPrice,
										address: item.address,
										endDate: item.endTime,
										startDate: item.startTime,
										url: 'courseDetail',
										seller: item.remainingNumber
									}
								})
							}
							_this.relateData = list;
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
					}
				);
			},
			playBtnClick () {
				if(this.playBtn.status) {
					this.playBtn.obj = document.querySelector(".play-audio").pause();
				} else {
					this.playBtn.obj = document.querySelector(".play-audio").play();
				}
				this.playBtn.status = !this.playBtn.status;
			},
			goPage(url, query) {
				if(!this.isLogin()) return false;
				this.$router.push({name: url, query: query});
			},
		}
	}
</script>

<style lang="scss">
	// .detail .tab .list
</style>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
  @import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	.container {
		padding-bottom: 60px;
	}

	.course-info {
		img {
			width: 100%;
		}
	}

	.course-info-block {
		padding: $padding;

		h5 {
			margin-bottom: $padding;
			color: $fontColorBlack;
			font-size: 16px;
		}

		.course-info-block-key {
			@extend %clearfix;
			margin-bottom: $padding;

			.price {
				float: left;
				font-size: 18px;
				color: $colorRedDeep;
				span {
					font-size: 14px;
				}
			}

			.status {
				margin: 6px 4px;
				padding: 0 .5em; 
				line-height: 1.2;
				font-size: 12px;
				background: $colorRedDeep;
				border-radius: 30px;
				color: #fff;
				display: inline-block;
			}

			.seller {
				float: right;
				color: $fontColorGray;
			}
		}

		.address, .time {
			line-height: 1.75;
			display: block;

			&:before {
				width: 2em;
				text-align: center;
				display: inline-block;
			}
		}
	}
	
	.top-video {
		width: 100%;
		background: #000;
	}

	.list {
		video, .audio-msg {
			width: 100%;
			height: 200px;
			background: #333;
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
			padding: 40px;
			text-align: center;
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

  .rich-html {
  	padding-top: $padding;
  }
</style>