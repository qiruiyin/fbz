<!-- 
	查看全部card
 -->

<template>
	<div @click="goPage" :class="['card-more-block', 'icon-' + cardMoreBlockData.type]" :style="styleObject">
		<img v-if="cardMoreBlockData.src" :src="cardMoreBlockData.src" alt="">
		<p>{{ cardMoreBlockData.name }}</p>
	</div>
</template>

<script type="text/babel">
	import { Panel, Group, Radio } from 'vux'
	
	import imgHeader from 'assets/img/icon/icon.png'

	export default {
		name: 'cardMore',
		components: { Panel },
		props: ['cardMoreBlockData'],
		data () {
			return {
				title: '卡片'
			}
		},
		computed: {
			styleObject () {
				return {
					backgroundImage: 'url(' + this.cardMoreBlockData.src + ")"
				}
			}
		},
		methods: {
			goPage () {
				this.$router.push({ name: 'courseTypeDetail', query: { type: this.cardMoreBlockData.type, id: this.cardMoreBlockData.id } })
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
  @import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
  
	$cardMoreBlockImgH: 60px;

 	.card-more-block {
		position: relative;
		float: left;
		width: 50%;
		padding-bottom: 6px;
		background: no-repeat;
		background-size: 100%;
		line-height: 2;

		&:before {
			content: "";
			position: absolute;
			top: 8px;
			left: 8px;
			width: 40px;
			height: 40px;
			background: no-repeat;
			// background: url("~assets/img/icon/icon-video.png") no-repeat;
			background-size: 100%;
		}
		
		&.icon-audio {
			&:before {
				background-image: url("~assets/img/icon/icon-audio.png");
			}
		}
		
		&.icon-video {
			&:before {
				background-image: url("~assets/img/icon/icon-video.png");
			}
		}


		img {
			width: 100%;
			visibility: hidden;
		}
		p {
 			@include ellipsisMore(1);
			height: 36px;
			line-height: 30px;
		}
	}
</style>