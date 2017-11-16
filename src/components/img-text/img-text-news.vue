<!-- 
	视频和音频的图文混排
 -->
<template>
	<div class="img-text img-text-news" @click="imgTextClick" v-cloak>
		<div class="img-text-img">
			<img class="img" v-if="imgTextData.img" :src="imgTextData.img" alt="">
		</div>

		<div class="text">
			<h5 class="title">{{ imgTextData.title }}</h5>
			<div class="text-info">
				<span class="text-info-date">{{ imgTextData.time }}</span>
				<span v-if="imgTextData.readCount > 0">{{ imgTextData.readCount }}人浏览</span>
			</div>
		</div>
	</div>
</template>

<script type="text/babel">
	export default {
		name: 'elImgTextNews',
		props: ['imgTextData'],
		data () {
			return {
				list: {
					// img: '',
					// time: '',
					// readCount: '', // 浏览次数
					// id: '', // id
					// desc: '以帮助学员实现梦想，突破发展瓶颈为己任，直指核心？',
					// code: '',
					// title: "总裁商业思维"
				}
			}
		},
		methods: {
			imgTextClick () {
				let _this = this;
					this.$router.push({name: 'newsDetail', query: { id: this.imgTextData.id }}) 
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	// @import '~assets/css/img-text';
	
	.img-text-news {
		.title {
			@include ellipsisMore(2); 
		}

		.text-info {
			span {
				padding-top: 10px;
				color: $fontColorGray;
			}

			.text-info-date {
				float: left;
			}
		}
	}
	
</style>