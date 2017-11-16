<!-- 
	经典语录图文混排
 -->

<template>
	<div class="img-text img-text-quotation" v-cloak>
		<div class="img-text-img">
			<img class="img" src="~assets/img/index/video-course.png" alt="">
		</div>
		
		<div class="text">
			<h5 class="title">{{ imgTextData.title }}</h5>
			<p :class="['desc', {'active': showAll }]" @click="expand()">{{ imgTextData.desc }}</p>
			<p>{{ imgTextData.label }}：{{ imgTextData.speaker }}<span>阅读人数：{{ imgTextData.subscribe }}</span></p>
			<div class="zan" @click="zan()">赞（{{ imgTextData.zan }}）</div>
		</div>
	</div>
</template>

<script type="text/babel">
	export default {
		props: ['imgTextData'],
		data () {
			return {
				showAll: false,
				list: {
					title: '总裁商业思维',
					price: '1233',
					priceUnit: '年',
					priceCurrency: '￥',
					desc: '以帮助学员实现梦想，突破发展瓶颈为己任，直指核心？',
					label: '主讲', 
					speaker: '苏引华',
					subscribe: '234343',
					zan: 111
				}
			}
		},
		methods: {
			zan () {
				this.imgTextData.zan++
			},
			expand () {
				this.showAll = !this.showAll
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	// @import '~assets/css/img-text'
	
</style>