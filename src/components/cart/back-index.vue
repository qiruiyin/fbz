<!-- 
	回到商城首页
 -->

<template>
	<div v-transfer-dom v-cloak>
		<div @click="goIndex" class="back-index fa fa-home">
			{{ title }}
		</div>
	</div>
</template>

<script type="text/babel">
	import { TransferDom } from 'vux'

	export default {
		name: "elBackIndex",
		directives: {
	    TransferDom
	  },
		data () {
			return {
				title: "回到首页"
			}
		},
		methods: {
			goIndex () {
				this.$router.push({name: "mall"})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	$backIndexH: 26px;

	.back-index {
		position: fixed;
		bottom: 100px;
		right: 0;
		background: rgba(0, 0, 0, .6);
		padding: 0 .5em 0 1em;
		line-height: $backIndexH;
		font-size: 12px;
		color: #fff;
		border-radius: $backIndexH 0 0 $backIndexH;
	}
</style>