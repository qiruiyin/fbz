<!-- 
	消息详情
 -->

<template>
	<div class="msg-detail" v-cloak>
		<scroller class="scroller" lock-x :height="-offsetBottom + 'px'" @done-pulldown="donePulldown" @on-pulldown-loading="onPulldownLoading" @on-pullup-loading="onPullupLoading" ref="scrollerBottom" :scroll-bottom-offst="200" :use-pulldown="true" :use-pullup="true" :pulldown-config="pulldownConfig" :pullup-config="pullupConfig">
			<div id="msg-box">		
				<el-msg-info-block :info-data="item" v-for="(item, index) in list" :key="index"></el-msg-info-block>
				<div v-if="list.length == 0" class="none-data">暂无数据</div>
			</div>
		</scroller>

		<!-- <div class="msg-send" v-if="msgInfo.msgType == 3"> -->
		<div class="msg-send">
      <group label-width="4em" label-margin-right="2em" label-align="right">
	      <x-input @on-focus="sendFocus" @on-blur="sendBlur" placeholder="发送消息" v-model="msgSendValue">
	      	<x-button v-if="sendBtn.status" @click.native="submitMsg" type="primary" class="send" slot="right" mini>{{ sendBtn.sendStatus ? '发送中' : '发送' }}</x-button>
	      	<x-button v-else type="primary" class="send" slot="right" mini disabled>{{ sendBtn.sendStatus ? '发送中' : '发送' }}</x-button>
	      </x-input>
	    </group>
    </div>
	</div>
</template>

<script type="text/babel">
	import { Scroller, LoadMore, TransferDom, Popup, XInput, XButton, Group } from 'vux'
	import elMsgInfoBlock from "components/msg/msg-info-block"
	
	let bfscrolltop = document.body.scrollTop;//获取软键盘唤起前浏览器滚动部分的高度

	export default {
		name: "msgDetail",
		directives: {
	    TransferDom
	  },
		components: {
			Scroller, LoadMore, Popup, XInput, XButton, Group, elMsgInfoBlock
		},
		data () {
			return {
				title: "消息详情",
				scrollH: 0, // 初始scroll高度
				onFetching: false, // 是否在加载数据
				offsetBottom: this.$route.query.msgType == 3 ? 70 : 0, // 距底部高度
				pulldownConfig: {
					content: '',
					downContent: '',
					upContent: '',
					loadingContent: '正在加载'
				},
				pullupConfig: {
					content: '',
					downContent: '',
					upContent: '',
					loadingContent: '正在加载'
				},
				msgSendShow: true,
				msgSendValue: "",
				msgSendCurrentClick: "",
				msgInfo: {
					sendUser: this.$route.query.sendUser,
					msgType: this.$route.query.msgType,
					lastMsgCode: "",
					newMsgCode: "",
					pageNum: 1,
					pageSize: this.wordBook.pageSize
				},
				sendBtn: {
					status: false,
					value: "default",
					sendStatus: false // 是否在调用接口
				},
				list: [],
				intervalInput: '' // 定时器处理
			}
		},
		watch: {
			msgSendValue (newValue, oldValue) {
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
				this.intervalInput = setInterval(function(){//设置一个计时器，时间设置与软键盘弹出所需时间相近
	        document.body.scrollTop = document.body.scrollHeight;//获取焦点后将浏览器内所有内容高度赋给浏览器滚动部分高度
	      },100)
			},
			sendBlur () {
				clearInterval(this.intervalInput);//清除计时器
	      document.body.scrollTop = bfscrolltop;将软键盘唤起前的浏览器滚动部分高度重新赋给改变后的高度
			},
			fetchData () {
				let _this = this;
				_this.$http.post('/api/tidings/messageList',
					_this.qs.stringify({
						customerId: _this.$store.state.user.userId, 
						type: _this.msgInfo.msgType,
						pageNum: _this.msgInfo.pageNum,
						pageSize: _this.msgInfo.pageSize
						// lastMsgCode: _this.msgInfo.lastMsgCode,
					})).then(function(e) {
						let responseData = e.data.data,
								list = [];
	        	_this.onFetching = false;

						if(e.data.code == 200) {
							if(responseData.result.length > 0) {
								list = responseData.result.map(function(item, index) {
									return {
										id: item.id,
										msgType: _this.msgInfo.msgType,
										// img: _this.resolveImg(item.sendHeader),
										content: item.content,
										status: "1",
										time: item.createTime
									}
								});

								if(responseData.result.length > 0) {
									_this.msgInfo.newMsgCode = list[0].id;
								}

								list.reverse();

								if(_this.msgInfo.pageNum == 1) {
									_this.list = list;
									_this.msgInfo.lastMsgCode = list[0].id;
									_this.resetView(true);
								} else if(list.length > 0) {
									_this.list = list.concat(_this.list);
									_this.resetView(false);
								}

								_this.msgInfo.pageNum++;
							}
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
						_this.$refs.scrollerBottom.donePulldown();
					})
			},
			resetView (status) {
				// status: true 到底部，false：保持当前
				let _this = this;
				setTimeout(function() {
					let oldH = _this.scrollH,
							endH = 0,
							h = document.getElementById('msg-box').offsetHeight - document.body.clientHeight + _this.offsetBottom;
					if(h < 0) h = 0;
					_this.scrollH = h;

					if(h > 0) {
						if(status) {
							endH = h;
						} else {
							endH = h - oldH
						}
					}

					_this.$nextTick(() => {
					  _this.$refs.scrollerBottom.reset({
					    top: endH
					  })
					})
				});
			},
			onPulldownLoading () {
	      if (this.onFetching) {
	        // do nothing
	      } else {
	        this.onFetching = true
					this.fetchData(true);
	      }
	    },
	    onPullupLoading (){
	    	if (this.onFetching) {
	        // do nothing
	      } else {
		    	let _this = this;
		    	_this.onFetching = true;
		    	this.$http.post('/wechat/message/queryNewMsg',
							{
								openId: _this.$store.state.user.openId,
								sendUser: _this.msgInfo.sendUser,
								msgType: _this.msgInfo.msgType,
								lastMsgCode: _this.msgInfo.newMsgCode
							}
						).then(function(e) {
							let responseData = e.data.data,
									list = [];
							_this.onFetching = false;
							if(e.data.code == 200) {
								if(responseData.result.length > 0) {
									list = responseData.result.map(function(item, index) {
										return {
											id: item.id,
											msgType: _this.msgInfo.msgType,
											img: _this.resolveImg(item.header),
											content: item.content,
											status: "1",
											time: item.time
										}
									});

									_this.msgInfo.newMsgCode = list[0].id;
									list.reverse();
									_this.list = _this.list.concat(list);
								}
							} else {
								_this.$vux.alert.show({
									content: e.data.msg
								})
							}
							_this.resetView(true);
							_this.$refs.scrollerBottom.donePullup();
						})
				}
	    },
	    donePulldown () {
	    	console.log(111);
	    },
	    donePullup () {
	    	console.log(111);
	    },
			submitMsg () {
				let _this = this;

				if(!_this.sendBtn.status) return false;
				if(_this.sendBtn.sendStatus) return false;
				_this.sendBtn.sendStatus = true;
				
				_this.$http.post('/wechat/message/sendUserMsg',
					{
						openId: _this.$store.state.user.openId,
						receiveUser: _this.msgInfo.sendUser,
						content: _this.msgSendValue
					}).then(function(e) {
						_this.commentValue = "";
						let responseData = e.data.data;
						
						_this.sendBtn.sendStatus = false;
						_this.commentShow = false;

						if(e.data.code == 200) {
							_this.list.push({
								img: _this.$store.state.user.img,
								content: _this.msgSendValue,
								status: "2",
								msgType: "3"
							});

							_this.resetView(true);
							_this.$vux.toast.show({
								text: "发送成功",
								time: 1000
							});
						} else {
							_this.$vux.toast.show({
								text: e.data.msg
							});
						}
						_this.msgSendValue = "";
					})
			}
		}
	}
</script>


<style lang="scss">
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	.msg-send {
		.weui-cell {
			padding: 8px 15px 12px;
		}

		.weui-cells {
			margin-top: 0;
			background-color: #fff;

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

	$elMsgInfoBlockImgW: 50px;
	$elMsgInfoBlockAngleW: 10px;
	$elMsgInfoBlockColor: #a2e759;

	$elMsgPaddingTop: 15px;

	.msg-detail {
		position: absolute;
		width: 100%;
		height: 100%;
		background: $bgGray;
		text-align: center;
	}

	.msg-send {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		display: none;
	}

	.none-data {
		line-height: 20px;
		padding: 0 .5em;
		margin: 0 auto;
		margin-top: $elMsgPaddingTop;
		font-size: 12px;
		color: #fff;
		background: $colorGrayDisabled;
		border-radius: $borderRadius;
		display: inline-block;
	}
</style>