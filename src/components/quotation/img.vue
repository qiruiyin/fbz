<!-- 
	上传的远程图片不知为什么会显示不出来，暂时做一个组件（后期研究）
 -->

<template>
	<div v-cloak class="priviewer-img" :style="priviewerData.style">
	<!-- <div class="priviewer-img"> -->
		<div @click.stop="removeImg" class="remove">-</div>
	</div>
</template>

<script type="text/babel">
	export default {
		name: "priviewerImg",
		props: [ 'priviewerData', 'priviewerInd' ],
		data () {
			return {

			}
		},
		methods: {
			removeImg () {
				this.$emit('on-remove-img', this.priviewerInd);
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	$quotationInputW: 60px;
	$quotationRemoveW: 15px;

	.priviewer-img {
		position: relative;
		float: left;
		width: $quotationInputW;
		height: $quotationInputW;
		margin: 0 $padding/2;
		margin-bottom: $padding;
		background: no-repeat;
		background-size: cover;
		display: inline-block;
		// overflow: hidden;
	}

	.remove {
		position: absolute;
		top: -$quotationRemoveW/2;
		right: -$quotationRemoveW/2;
		width: $quotationRemoveW;
		height: $quotationRemoveW;
		line-height: $quotationRemoveW;
		color: #fff;
		background: $colorRed;
		border-radius: $quotationRemoveW;
	}
</style>