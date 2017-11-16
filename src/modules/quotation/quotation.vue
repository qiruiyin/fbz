<!-- 
	经典语录
 -->

<template>
	<div class="quotation" v-cloak>
		<div class="container">
		  <scroller lock-x :height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offst="200">
		  	<div>
					<el-quotation @on-comment-click="commetClick" :quotation-data="item" v-for="(item, index) in quotationData" :key="index"></el-quotation>

					<el-load-more :load-all="scrollerInfo.loadAll"></el-load-more>
				</div>
			</scroller>
		</div>

		<div v-transfer-dom>
			<popup class="quotation-send" v-model="commentShow" position="bottom">
	      <group label-width="4em" label-margin-right="2em" label-align="right">
		      <x-input @on-focus="sendFocus" @on-blur="sendBlur" placeholder="评论" v-model="commentValue">
		      	<x-button v-if="sendBtn.status" @click.native="submitComment" type="primary" class="send" slot="right" mini>{{ sendBtn.sendStatus ? '发送中' : '发送' }}</x-button>
		      	<x-button v-else type="primary" class="send" slot="right" mini disabled>{{ sendBtn.sendStatus ? '发送中' : '发送' }}</x-button>
		      </x-input>
		    </group>
	    </popup>
	   </div>
	</div>
</template>

<script type="text/babel">
	import { Scroller, LoadMore, Divider, TransferDom, Popup, XInput, XTextarea, Group, XButton } from 'vux'
	import elQuotation from 'components/quotation/quotation'
	import elLoadMore from 'components/load-more/load-more'

	let bfscrolltop = document.body.scrollTop;//获取软键盘唤起前浏览器滚动部分的高度

	export default {
		directives: {
	    TransferDom
	  },
		components: { Scroller, Popup, XInput, XTextarea, Group, XButton, elQuotation, elLoadMore },
		data () {
			return {
				title: "经典语录",
				quotationInfo: {
					pageNum: 1,
					pageSize: this.wordBook.pageSize
				},
				scrollerInfo: {
					offsetBottom: 120,
					onfetching: false,
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
				},
				intervalInput: '' // 定时器处理
			}
		},
		watch: {
			commentValue (newValue, oldValue) {
				if(newValue == "") {
					this.sendBtn.status = false;
					this.sendBtn.value = 'default';
				} else {
					this.sendBtn.status = true;
					this.sendBtn.value = 'primary';
				}
			}
		},
		mounted () {
			this.fetchData();
		},
		methods: {
			sendFocus () {
				this.interval = setInterval(function(){//设置一个计时器，时间设置与软键盘弹出所需时间相近
	        document.body.scrollTop = document.body.scrollHeight;//获取焦点后将浏览器内所有内容高度赋给浏览器滚动部分高度
	      },100)
			},
			sendBlur () {
				clearInterval(this.interval);//清除计时器
	      document.body.scrollTop = bfscrolltop;将软键盘唤起前的浏览器滚动部分高度重新赋给改变后的高度
			},
			fetchData () {
				let _this = this;

				_this.$http.post('/wechat/quotationsmobile/list ',
					{
						pageNum: _this.quotationInfo.pageNum,
						pageSize: _this.quotationInfo.pageSize,
						userCode: _this.$store.state.user.userCode
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
			commetClick (val) {
				this.commentShow = true;
				this.commentCurrentClick = val
			},
			submitComment () {
				let _this = this;
				if(!_this.sendBtn.status) return false;
				if(_this.sendBtn.sendStatus) return false;
				_this.sendBtn.sendStatus = true;
				
				_this.$http.post('/wechat/quotationsmobile/addComment',
					{
						userCode: _this.$store.state.user.userCode, //用户code
						code: _this.commentCurrentClick.code, // 语录code
						parentCode: _this.commentCurrentClick.commentInfo.code, // 评论code
						content: _this.commentValue
					}).then(function(e) {
						_this.commentValue = "";
						let responseData = e.data.data;
						
						_this.sendBtn.sendStatus = false;
						_this.commentShow = false;

						if(responseData.tag == 1) {
							_this.$vux.alert.show({
								content: "评论成功，审核后可见"
							});
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							});
						}
					})
			},
			cancelComment () {
				this.commentShow = false
			},
			loadMore () {
				if(this.scrollerInfo.onFetching || this.scrollerInfo.loadAll) {

				} else {
					this.scrollerInfo.onFetching = true;					
					this.fetchData();
				}
			}
		}
	}
</script>

<style lang="scss">
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	.quotation-send {
		.weui-cell {
			padding: 24px 15px;
		}

		.weui-cells {
			margin-top: 0;
			background-color: $quotationSendBtnBackground;

			&:before {
				border-top-color: $quotationSendBtnBorderTop;
			}
		}

		.weui-cell__bd {
			@include halfpxline(0, $quotationSendBtnBorderBottom, 0 , 0, 1px, 0);
			margin-right: $padding;
		}

		.weui-input {
			line-height: 36px;
	    height: 36px;
		}
	}	
</style>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
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