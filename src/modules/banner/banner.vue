<!-- 
	轮播详情页
 -->

<template>
	<div class="banner" v-cloak>
		<div v-html="richText"></div>
	</div>
</template>

<script type="text/babel">
	export default {
		data () {
			return {
				richText: ""
			}
		},
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData () {
				let _this = this;
				_this.$http.post('/wechat/discover/queryPageContent',
					{
						"code": _this.$route.params.bannerCode,
					}).then(function(e) {
						let responseData = e.data.data;

						_this.richText = _this.resolveRichTextImg(responseData.content);

				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	.banner {
		padding: $padding;
	}
</style>