<!-- 
	订单内商城产品展现卡
 -->

<template>
	<div class="product mall-product" v-cloak>
		<div v-if="cardMallData.img" class="img">
			<img :src="cardMallData.img" alt="">
		</div>
		<div class="product-content">
			<div class="product-info">
				<p>{{ cardMallData.productName }}</p>
				<p :class="{'price': !cardMallData.productCount}">单价：{{ cardMallData.productPrice }}</p>
				<span v-if="cardMallData.productCount" class="num">数量：{{ cardMallData.productCount }}</span>
				<x-number v-else title="数量" :min="1" class="num-data" v-model="numData"></x-number>
			</div>
		</div>
	</div>
</template>

<script type="text/babel">
	import { XNumber } from 'vux'

	export default {
		name: "cardMall",
		components: {
			XNumber
		},
		props: ['cardMallData', 'cartNum'],
		data () {
			return {
				title: "产片卡片",
				info: {
					img: "",
					productName: "",
					productPrice: "",
					productCount: ""
				},
				numData: this.cartNum
			}
		},
		watch: {
			numData (newValue, oldValue) {
				this.$emit('on-num-change', newValue);
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
  @import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
  @import '~assets/css/card-order';
	
	.price {
		text-align: right;
	}

	.num-data {
		padding-right: 0;
		padding-left: 0;
	}
</style>