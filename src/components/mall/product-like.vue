<!-- 
	产品列表(设计猜你喜欢)
 -->

<template>
	<div @click="goPage(mallProductData.id)" class="mall-product" :style="styleObject" v-cloak>
		<!-- <img :src="mallProductData.img" alt=""> -->
		<h5>{{ mallProductData.name }}</h5>
		<!-- <p>{{ mallProductData.desc }}</p> -->
		<div class="price">￥{{ mallProductData.originalPrice }} <span>￥{{ mallProductData.price }}</span></div>
	</div>
</template>

<script type="text/babel">
	export default {
		name: "mallProductLike",
		props: ["mallProductData"],
		data () {
			return {
				mallData: {
					img: '',
					name: '测试书籍',
					desc: '',
					price: '12',
					code: "",
					type: '' // 判别是音频，视频还是商品
				}
			}
		},
		computed: {
			styleObject () {
				return {
					backgroundImage: 'url(' + this.mallProductData.img + ')'
				}
			}
		},
		methods: {
			goPage(data) {
				// this.$store.commit('updateLoadingStatus', {isLoading: true});
				this.$router.push({name: 'mallDetail', query: { id: data }})
			}
		}
	}

</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	$mallProductBorder: 3px;

	.mall-product {
		// float: left;
		width: 50%;
		padding-top: 178px;
		border-bottom: $mallProductBorder solid $bgGray;
		line-height: 1;
		text-align: left;
		background: #fff no-repeat;
		background-size: 150px;
		background-position: center 10px;
		display: inline-block;

		&:nth-child(odd) {
			border-right: $mallProductBorder/2 solid $bgGray;
    }
		&:nth-child(even) {
			border-left: $mallProductBorder/2 solid $bgGray;
    }

		img {
			width: 150px;
			height: 150px;
			margin: 0 auto;
	    padding: 10px 0;
		}
		
		h5, p, .price {
			padding: 0 $padding;
			text-align: justify;
			@include ellipsisOne();
		}

		h5, .price {
			font-size: 14px;
			margin-bottom: $padding/2;
		}

		.price {
			color: $fontColorGray;
			margin-bottom: $padding;

			span {
				float: right;
				color: $colorRedDeep;
			}
		}
	}
</style>