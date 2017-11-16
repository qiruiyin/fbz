<!-- 
	视频和音频的图文混排
 -->
<template>
	<div class="img-text" @click="imgTextClick" v-cloak>
		<div class="img-text-img">

			<img class="img" v-if="imgTextData.img" :src="imgTextData.img" alt="">
			
			<div v-if="imgTextData.status" class="status">{{ imgTextData.status }}</div>
			<div v-if="imgTextData.date" class="date">{{ imgTextData.date }}</div>
		</div>
		<div class="text">
			<h5 class="title">
				<p>{{ imgTextData.title }}</p>
				<span>￥{{ imgTextData.price }}</span>	
				<!-- <span>{{ imgTextData.priceCurrency }}{{ imgTextData.price }}/{{ imgTextData.priceUnit }}</span>	 -->
			</h5>
			<p class="desc">{{ imgTextData.desc }}</p>
			<p>{{ imgTextData.label }}：{{ imgTextData.speaker }} <span v-if="imgTextData.classDay" class="class-day">{{ imgTextData.classDay }}</span></p>
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
					title: '总裁商业思维',
					price: '1233',
					priceUnit: '年',
					priceCurrency: '￥',
					desc: '以帮助学员实现梦想，突破发展瓶颈为己任，直指核心？',
					label: '主讲', 
					speaker: '苏引华',
					subscribe: '234343',
					status: '新',
					isClick: true,
					date: '2017-04-12',
					timeLength: '30分58秒'
				}
			}
		},
		methods: {
			imgTextClick () {
				let _this = this;
					this.$router.push({name: 'courseDetail', query: { courseCode: this.imgTextData.code }}) 
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	// @import '~assets/css/img-text'
	
</style>