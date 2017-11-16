<!-- 
	音视频创建订单
 -->

<template>
	<div class="order-create">
		<el-order-audio :order-audio-data="orderAudioData"></el-order-audio>
		<!-- <el-order-mall :order-mall-data="orderMallDatas" @update-address="setCartPayStatus"></el-order-mall> -->
	</div>
</template>

<script type="text/babel">
	export default {
		name: "orderCreate",
		data () {
			return {
				title: ""
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
  @import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	
</style>