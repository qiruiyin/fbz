<!-- 
	消息组件
 -->

<template>
	<div :class="['el-msg-info-block', {'right': infoData.status == 2 }]" v-cloak>
		<div class="el-msg-info-block-img">
			<img v-if="infoData.msgType == 3" :src="infoData.img" alt="">		
			<img v-if="infoData.msgType == 2" :src="imgOrder" alt="">		
			<img v-if="infoData.msgType == 1" :src="imgSys" alt="">		
		</div>
		
		<div class="el-msg-info-block-content">
			<p v-html="quotationTransContent(infoData.content)"></p>
			<div>
				<span>{{ infoData.time }}</span>
			</div>
		</div>
	</div>
</template>

<script type="text/babel">

	import imgOrder from "assets/img/icon/msg-order.png"
	import imgSys from "assets/img/icon/msg-sys.png"

	export default {
		name: "elMsg",
		props: ['infoData'],
		data () {
			return {
				imgSys: imgSys,
				imgOrder: imgOrder,
				data: {
					img: "",
					content: "",
					status: "",
					msgType: "",
					time: ""
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	$elMsgInfoBlockImgW: 50px;
	$elMsgInfoBlockAngleW: 10px;
	$elMsgInfoBlockColor: #a2e759;

	$elMsgPaddingTop: 15px;

	.el-msg-info-block {
		position: relative;
		padding: $elMsgPaddingTop $padding * 2 + $elMsgInfoBlockImgW 0;

		&:last-child {
			padding-bottom: $elMsgPaddingTop;
		}

		&.right {
			.el-msg-info-block-img {
				left: auto;
				right: $padding;
			}

			.el-msg-info-block-content {

				p {
					float: right;
					background: $elMsgInfoBlockColor;

					&:before {
						left: 100%;
						margin-left: -$elMsgInfoBlockAngleW/2;
						transform: rotate(45deg);
						border-top-color: $elMsgInfoBlockColor;
					}
				}

				div {
					float: right;
				}
			}
		}
	}

	.el-msg-info-block-img {
		position: absolute;
		left: $padding;
		width: $elMsgInfoBlockImgW;
		height: $elMsgInfoBlockImgW;

		img {
			width: 100%;
			height: 100%;
			border-radius: $elMsgInfoBlockImgW/2;
		}
	}

	.el-msg-info-block-content {
		@extend %clearfix;

		p {
			position: relative;
			float: left;
			padding: $padding;
			margin-top: 4px;
			background: #fff;
			border-radius: $borderRadius;
			color: $fontColorBlack;
			text-align: justify;
			display: inline-block;

			&:before {
				content: "";
				position: absolute;
				top: $elMsgInfoBlockAngleW;
				left: - $elMsgInfoBlockAngleW/2;
				width: 0;
		    height: 0;
		    border-top: $elMsgInfoBlockAngleW solid #fff;
	    	border-left: $elMsgInfoBlockAngleW solid transparent;
	    	transform: rotate(225deg);
			}
		}
		
		& > div {
			float: left;
			width: 100%;
			text-align: center;
		}

		span {
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
	}
</style>