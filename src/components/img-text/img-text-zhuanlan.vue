<!-- 
	专栏订阅
 -->

<template>
	<div class="img-text img-text-zhuanlan">
		<div class="img-text-img">
			<img class="img" v-if="imgTextData.img" :src="imgTextData.img" alt="">
		</div>
		<div class="text">
			<h5 class="title">{{ imgTextData.title }}</h5>
			<p class="desc">{{ imgTextData.desc }}</p>
			<p>更新{{ imgTextData.updateCount }}期，共{{ imgTextData.total }}期</p>
			<div class="price">
				<p><span>￥{{ imgTextData.price }}</span>/{{ imgTextData.total }}期</p>
				<span class="tips">{{ imgTextData.subCount }} 人订阅</span>
			</div>
		</div>
	</div>
</template>

<script type="text/babel">
	export default {
		name: "imgTextZhuanlan",
		props: ['imgTextData'],
		data () {
			return {
				title: "专栏订阅"
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	// @import '~assets/css/img-text'

	// .img-text-zhuanlan {
			
	// }
</style>

