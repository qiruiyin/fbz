<!-- 
	视频和音频的图文混排
 -->
<template>
	<div class="img-text-course" @click="imgTextClick" v-cloak>
		<div class="img-text">
			<div class="img-text-img">
				<img class="img" v-if="imgTextData.img" :src="imgTextData.img" alt="">
			</div>
			<div class="text">
				<h5 class="title">{{ imgTextData.remark }}</h5>
				<p class="address fa fa-calendar">{{ imgTextData.date }}</p>
				<p class="address fa fa-map-marker">{{ imgTextData.address }}</p>
			</div>
		</div>

		<div class="img-text-info">
			<span>原价：{{ imgTextData.originalPrice }}元</span>
			<p>活动价：{{ imgTextData.price }}元</p>
		</div>
	</div>
</template>

<script type="text/babel">
	export default {
		name: 'elImgText',
		props: ['imgTextData'],
		data () {
			return {
				list: {
					// title: '总裁商业思维',
					// price: '1233',
					// priceUnit: '年',
					// priceCurrency: '￥',
					// desc: '以帮助学员实现梦想，突破发展瓶颈为己任，直指核心？',
					// label: '主讲', 
					// speaker: '苏引华',
					// subscribe: '234343',
					// status: '新',
					// isClick: true,
					// date: '2017-04-12',
					// timeLength: '30分58秒'
				}
			}
		},
		methods: {
			imgTextClick () {
				if(this.imgTextData.type == 'activity') {
					this.$router.push({name: 'activityDetail', query: { activityId: this.imgTextData.id }}) 
				} else {
					this.$router.push({name: 'courseDetail', query: { periodsId: this.imgTextData.id }}) 
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	.img-text {
		padding: $padding 0;
		@include halfpxline(0, $borderColor, 0 , 0, 0, 0);

		.img-text-img {
			width: 40%;
		}

		.text {
			line-height: 1.75;

			.title {
				font-size: 14px;
				margin-bottom: 10px;
				@include ellipsisMore(1);
			}

			p {
				float: inherit;
			}
		}
		.address, .price {
			@include ellipsisOne();

			&:before {
				width: 1.4em;
				padding-right: .3em;
				text-align: center;
				display: inline-block;
				color: $fontColorGray;
			}	
		}
	}

	.img-text-info {
		@include halfpxline(0, $borderColor, 1px, 0, 1px, 0);
		line-height: 44px;
		height: 44px;

		&:after {
			border-style: dashed;
		}

		span {
			float: left;
			color: $fontColorGray;
			text-decoration: line-through;
		}

		p {
			float: right;
		}
	}
</style>