<!-- 
	消息组件
 -->

<template>
	<div class="el-msg" @click="goPage" v-cloak>
		<div :class="['el-msg-img', { 'no-see': dataMsg.status == 0 }]">
			<img :src="dataMsg.img" alt="">		
		</div>

		<div class="el-msg-info">
			<div class="el-msg-title">
				<h5>{{ dataMsg.title }}</h5>
			  <span>{{ dataMsg.time }}</span>
			</div>
			<div class="desc">{{ dataMsg.content }}</div>
		</div>
	</div>
</template>

<script type="text/babel">
	export default {
		name: "elMsg",
		props: ['dataMsg'],
		data () {
			return {
				data: {
					img: this.$store.state.user.img,
					title: "订单通知",
					time: "16:20",
					content: "你订购了苏老师的思维导图书后让我受益匪浅给你订购了苏老师的思维导图书后让我受益匪浅给你订购了苏老师的思维导图书后让我受益匪浅给"
				}
			}
		},
		methods: {
			goPage () {
				let _this = this;

				// this.$http.post('/wechat/message/setRead',
				// 		{
				// 			openId: _this.$store.state.user.openId,
				// 			sendUser: _this.dataMsg.sendUser,
				// 			msgType: _this.dataMsg.msgType
				// 		}
				// 	).then(function(e) {
				// 		let responseData = e.data.data;
				// })
				this.$router.push({name: "msgDetail", query: { sendUser: _this.dataMsg.sendUser, msgType: _this.dataMsg.msgType }})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	$elMsgImgW: 40px;
	$elMsgImgTipW: $msgCircleW;

	$elMsgLeft: 15px; // 只有此处是
	$elMsgPadding: 15px;

	.el-msg {
		position: relative;
		@include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
		height: 70px;
		padding-right: $elMsgLeft;
		padding-left: $elMsgLeft + $elMsgImgW;

		&:last-child {
			color: red;
			
			.el-msg-info {
				@include halfpxline(0, $borderColor, 0 , 0, 0, 0);
			}
		}
	}

	.el-msg-img {
		position: absolute;
		left: $elMsgLeft;
		top: 50%;
		margin-top: - $elMsgImgW/2;
		width: $elMsgImgW;
		height: $elMsgImgW;
		
		&:before {
			content: "";
			position: absolute;
			top: -3px;
			right: -8px;
			width: $elMsgImgTipW;
			height: $elMsgImgTipW;
			border-radius: $elMsgImgTipW/2;
		}

		&.no-see {
			&:before {
				background: $msgCircleColor;
			}
		}

		img {
			width: 100%;
			height: 100%;
			border-radius: $elMsgImgW/2;
		}
	}

	.el-msg-info {
		position: relative;
		width: 100%;
		height: 100%;
		padding: $elMsgPadding 0 $elMsgPadding $padding;
		line-height: 1.5;
		text-align: left;

		.el-msg-title {
			font-size: 16px;
			width: 100%;
			display: flex;
		}

		h5 {
			font-size: 14px;
			flex: 1;
			color: $fontColorBlack;
			@include ellipsisOne();
		}

		span {
			position: absolute;
			right: 0;
			color: #999;
			font-size: 12px;
			text-align: right;
		}

		.desc {
			width: 100%;
			padding-right: 4em;
			font-size: 12px;
			color: #999;
			@include ellipsisOne();
		}
	}
</style>