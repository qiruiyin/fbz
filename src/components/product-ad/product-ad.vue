<!-- 
	产品广告
 -->

<template>
	<x-button @click.native="goPage" type="warn" class="product-ad" v-cloak>{{ adInfo.name }}</x-button>
</template>

<script type="text/babel">
	import { XButton } from 'vux'

	export default {
		name: "elProductAd",
		components: { XButton },
		props: ['productCode'],
		data () {
			return {
				adInfo: {
					name: "",
					code: ""
				}
			}
		},
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData () {
				let _this = this;
				_this.$http.post('/wechat/discover/queryRandomLessonInfo',
					{
						productCode: _this.productCode
					}).then(function(e) {
						if(e.data.code == 200) {
							_this.adInfo = e.data.data.lessonInfo;
						} else {
							Vue.$vux.alert.show({
								content: e.data.msg
							})
						}
				})
			},
			goPage () {
				this.$router.push({name: 'course', query: { type: 1 }})
			}
		}
	} 
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
		
	.product-ad {
		@include ellipsisOne();
	}
</style>