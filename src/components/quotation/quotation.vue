<!-- 
	经典语录
 -->

<template>
	<div class="quotation-list" v-cloak>
		<div class="quotation-list-content">
			<!-- <img class="user-img" src="~assets/img/user.png" alt=""> -->
			<div class="block">
				<div class="block-header">
					<p class="block-title">{{ quotationData.title }}</p>
					<p class="block-header-content" v-html="quotationTransContent(quotationData.content)"></p>
					<div v-if="quotationData.img.length > 0" :class="['block-img', {'block-img-2': quotationData.img.length == 2 || quotationData.img.length == 4, 'block-img-3': quotationData.img.length == 3 || quotationData.img.length > 4}]">
						<template v-if="quotationData.img.length == 1">
							<div class="img" v-for="(imgItem, imgIndex) in quotationData.img" @click="show(imgIndex)" :key="imgItem">
								<img :src="imgItem.src" alt="">
							</div>
						</template>
						<template v-else>
							<div class="img" v-for="(imgItem, imgIndex) in quotationData.img" :style="imgItem.style" @click="show(imgIndex)" :key="imgItem">
							</div>
						</template>
						<div v-transfer-dom>
				      <previewer :list="quotationData.img" ref="previewer"></previewer>
				    </div>
					</div>

					<div class="block-header-footer">
						<div class="block-time">{{ quotationData.time }}</div>
						<div :class="['block-btns', {'active': btnStatus}]" @click.stop="showBtns">
							<div class="show-btn"></div>
							<div class="block-btns-content">
								<div @click.stop="btnZan" v-if="quotationData.qulikes != 1" class="fa fa-heart-o">赞</div>
								<div @click.stop="btnZan" v-else class="fa fa-heart">取消</div>
								<div @click.stop="btnComment(quotationData.code)" class="fa fa-commenting-o">评论</div>
							</div>
						</div>
					</div>

					<div class="block-content" v-if="quotationData.zans.length > 0 || quotationData.comments.length > 0">
						
						<div :class="['zan-list', 'fa', 'fa-heart-o', {'active': showMoreZanBtnNum < quotationData.zans.length}]" v-if="quotationData.zans.length > 0">
							<span v-for="(zanItem, zanIndex) in quotationData.zans" :key="zanIndex" :class="[{'demo': showMoreZanBtnNum == zanIndex && !showMoreZan }, { 'active': showMoreZanBtnNum < zanIndex && !showMoreZan }]">
								<template v-if="zanIndex == 0">{{ zanItem.name }}</template>
								<template v-else>、{{ zanItem.name }}</template>
							</span>
						</div>
						<div @click="showZanAll" v-if="showMoreZanBtnNum < quotationData.zans.length" :class="['zan-show-more', 'fa', showMoreZan ? 'fa-angle-up' : 'fa-angle-down']"></div>
						<!-- <div v-if="showMoreZanBtn" class="zan-show-more fa fa-angle-down">{{ num }}\\ {{ num2 }}</div> -->

						<div class="comment-list" v-if="quotationData.comments.length > 0">
							<div @click="btnComment(quotationData.code, commentItem)" :class="['comment-card', {'show': commentShowNums > commentIndex || commentShowNumsStatus }]" v-for="(commentItem, commentIndex) in quotationData.comments" :key="commentIndex">
								<div class="comment-card-header">
									<i>{{ commentItem.sendName }}</i>
									<template v-if="commentItem.receiveCode">
										<span>回复</span>
										<i>{{ commentItem.receiveName }}</i>
									</template>：{{ commentItem.content }}
								</div>
							</div>

							<div @click="showCommentAll" v-if="quotationData.comments.length > commentShowNums" :class="['comment-show-more', 'fa', commentShowNumsStatus ? 'fa-angle-up' : 'fa-angle-down']">查看更多评论</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/babel">
	import { TransferDom, Popup, Previewer  } from 'vux'

	export default {
		props: ["quotationData"],
		directives: {
	    TransferDom
	  },
		components: { 
			Popup, Previewer
		},
		data () {
			return {
				title: "经典语录",
				num: -1,
				num2: -1,
				btnStatus: false,
				showMoreZanBtnNum: 10,
				showMoreZan: false,
				commentShowNums: 3,
				commentShowNumsStatus: false, // 是否展开
				quotationList: {
					code: "",
					title: '',
					content: '',
					img: [],
					time: '',
					qulikes: 0,
					comments: [
						{
							receiveCode: "",
							receiveName: "",
							sendCode: "",
							sendName: "",
							content: ""
						},{
							receiveCode: "",
							receiveName: "",
							sendCode: "",
							sendName: "",
							content: ""
						},{
							receiveCode: "",
							receiveName: "",
							sendCode: "",
							sendName: "",
							content: ""
						}
					],
					zans: []
				},
			}
		},
		mounted () {
			let _this = this;
			document.querySelector("body").addEventListener("touchstart", function (argument) {
				if(_this.btnStatus) {
					setTimeout(function(argument) {
						_this.btnStatus = false;
					}, 500)
				}
			})
		},
		updated () {
			// this.updateView();
		},
		methods: {
			updateView () {
				this.$nextTick( () => {
					if(this.$refs.zanList) {
						let h = document.querySelector(".zan-list").offsetHeight;
						let h2 = this.$refs.zanList.getBoundingClientRect().height;
						this.num = h;
						this.num2 = this.$refs.zanList.getBoundingClientRect().height;

						if(h2 > h) {	
							this.showMoreZanBtn = true;
						}
					}
				});
			},
			show (index) {
	      this.$refs.previewer.show(index)
	    },
			showBtns () {
				if(!this.isLogin()) return false;
				this.btnStatus = !this.btnStatus;
			},
			btnZan () {
				let _this = this;
				if(this.quotationData.qulikes == 0 ){
					this.quotationData.qulikes = 1;	
					this.quotationData.zans.push({
						name: this.$store.state.user.name,
						code: this.$store.state.user.userCode
					});

					_this.$http.post('/wechat/quotationsmobile/like',
						{
							code: _this.quotationData.code,
							userCode: _this.$store.state.user.userCode
						}).then(function(e) {

						})
				} else {
					this.quotationData.qulikes = 0;
					let ind = -1;
					this.quotationData.zans.map(function(item, index){
						if(item.code == _this.$store.state.user.userCode){
							ind = index;
						}
					})
					if (ind > -1) {
						this.quotationData.zans.splice(ind, 1);
					}
					_this.$http.post('/wechat/quotationsmobile/unlike',
						{
							code: _this.quotationData.code,
							userCode: _this.$store.state.user.userCode
						}).then(function(e) {

						})
				}
			},
			showZanAll () {
				this.showMoreZan = !this.showMoreZan;
			},
			showCommentAll () {
				this.commentShowNumsStatus = !this.commentShowNumsStatus;
			},
			btnComment (code, commentInfo = "") {
				if(!this.isLogin()) return false;
				this.$emit("on-comment-click", {code: code, commentInfo: commentInfo});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	.quotation-list {
		padding: $padding;
		padding-right: $padding*2;
	}

	.quotation-list-content {
		display: flex;
	}

	.user-img {
		width: $quotationUserImgW;
		height: $quotationUserImgW;
		border-radius: $quotationUserImgW;
	}

	.block {
		flex: 1;
		padding-left: $padding/2;
		user-select: initial;
	}

	.block-header {
		padding-bottom: $padding/2;
	}

	.block-title {
		font-size: 18px;
		color: $quotationColorTitle;
	}

	.block-header-content {
    line-height: 1.75;
		padding: $padding/2 0;
	}
	
	.block-img {
		padding-right: 10%;
		@extend %clearfix;
		padding-bottom: $padding/2;

		.img {
			float: left;
			width: 50%;
			background: no-repeat;
			background-size: cover;
		}

		img {
			width: 100%;
		}
	}

	.block-img-2 {
		.img {
			width: 50%;
		  height: 100px;
			border-right: $padding/2 solid #fff;
			border-bottom: $padding/2 solid #fff;
			overflow: hidden;
		}
	}

	.block-img-3 {
		.img {
			width: 33.3%;
		  height: 100px;
			border-right: $padding/2 solid #fff;
			border-bottom: $padding/2 solid #fff;
			overflow: hidden;
		}
	}

	.block-header-footer {
		position: relative;
		@extend %clearfix;
		height: 26px;
	}

	.block-time {
		float: left;
	}

	.block-btns {
		position: absolute;
		top: -6px;
		right: 0;
		width: 20px;
		height: 30px;
		line-height: 30px;
		overflow: hidden;
		transition: .5s;

		&.active {
			width: 180px;
		}

		.show-btn {
			position: absolute;
			top: 0;
			right: -10px;
			width: 40px;
			height: 100%;
			background: url("~assets/img/icon/comment.png") no-repeat;
			// background-size: 100%;
			// background-position: center;
		  background-size: 40%;
    	background-position: center;
	    line-height: 25px;
			text-align: center;
		}

		.block-btns-content {
			position: absolute;
			top: 50%;
			right: 26px;
			width: 142px;
			height: 100%;
			line-height: 30px;
			margin-top: -15px;
			background: $quotationBtnBg;
			color: #fff;
			border-radius: $borderRadius;
			text-align: center;
		
			.fa {
				float: left;
				line-height: 30px;
				width: 50%;
				padding: 0 .4em;
				text-align: center;
				letter-spacing: .2em;
			}
		}
	}

	$blockTriggleW: 10px;
	
	.block-content {
		position: relative;
		padding: $padding;
		background-color: $quotationCommentBg;
		
		&:before {
			content: "";
			position: absolute;
			top: - $blockTriggleW/2 + 1px;
			width: 0;
	    height: 0;
	    border-top: $blockTriggleW solid $quotationCommentBg;
    	border-left: $blockTriggleW solid transparent;
    	transform: rotate(-45deg);
		}

		i {
			font-style: normal;
			color: $quotationColorMan;
		}
	}
	
	$quotationCommentIconW: 20px;

	.comment-list, .zan-list {
		position: relative;
		padding-top: $paddingTop/2;
		
		& > i {
			position: absolute;
			left: - 25px;
			top: 0;
			width: $quotationCommentIconW;
			height: $quotationCommentIconW;
			border-radius: $quotationCommentIconW;
			font-size: 12px;
			color: #fff;
			text-align: center;
			line-height: $quotationCommentIconW;
			background-color: $quotationColorMan;
		}
	}

	.zan-list {
		position: relative;
		padding-top: 0;
		color: $quotationColorMan;
		text-align: justify;

		&.active {
			padding-bottom: 0;
		}

		&:before {
			margin-right: .5em;
			@include ellipsisOne();
			display: inline-block;
			line-height: $quotationCommentIconW;
		}


		span {
			@include ellipsisOne();
			display: inline-block;
			line-height: $quotationCommentIconW;

			&.demo {
				width: 1.5em;
			}

			&.active {
				font-size: 0;
			}
		}
	}

	.zan-show-more {
    width: 100%;
    text-align: center;
	}

	.comment-list {
		text-align: center;
	}

	.comment-show-more {
		@include halfpxline(30px, $colorOrange, 1px, 1px, 1px, 1px);
		padding: 0 1em;
		line-height: 1.75;
		color: $colorOrange;
		font-size: 12px;
		margin: 0 auto;
		margin-top: .5em;
	}

	.comment-card {
		text-align: left;
		display: none;
		// padding: 3px 0;

		&.show {
			display: block;
		}
	}
</style>