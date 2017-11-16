<!-- 
	产品列表
 -->

<template>
	<div class="mall-product" v-cloak>
		<img :src="mallProductData.img" alt="">
		<h5>{{ mallProductData.name }}</h5>
		<p>{{ mallProductData.desc }}</p>
		<div class="price">￥{{ mallProductData.price }}</div>
	</div>
</template>

<script type="text/babel">
	export default {
		name: "mallProduct",
		props: ["mallProductData"],
		data () {
			return {
				mallData: {
					// img: '',
					// name: '',
					// desc: '',
					// price: ''
					img: '',
					name: '测试书籍',
					desc: '',
					price: '12',
					code: "",
					type: '' // 判别是音频，视频还是商品
				}
			}
		}
	}

</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	$mallProductBorder: 3px;
	
	.mall-product {
		float: left;
		width: 50%;
		border-bottom: $mallProductBorder solid $uiMarginBg;
		line-height: 1.5;
		text-align: center;
		background: #fff;

		&:nth-child(odd) {
			border-right: $mallProductBorder/2 solid $uiMarginBg;
    }
		&:nth-child(even) {
			border-left: $mallProductBorder/2 solid $uiMarginBg;
    }

		img {
			width: 80%;
			height: 200px;
			margin: 0 auto;
	    padding: 10px 0;
		}
		
		h5, p {
			padding: 0 $padding;
			@include ellipsisOne();
		}

		h5 {
			font-size: 18px;
		}
	}
</style>