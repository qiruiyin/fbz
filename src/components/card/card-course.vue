<!-- 
	订单内课程订单产品展现卡
 -->

<template>
	<div class="product course-product" v-cloak>
		<div v-if="cardCourseData.img" class="img">
			<img :src="cardCourseData.img" alt="">
		</div>
		<div class="product-content">
			<div class="product-info full-width">
				<div class="product-info-left">
					<p class="product-info-title parent-title" v-if="cardCourseData.parentTitle">{{ cardCourseData.parentTitle }}</p>
					<p class="product-info-title" v-if="cardCourseData.title">{{ cardCourseData.title }}</p>
				</div>
				<!-- <div class="product-info-right">
					<p>单价：￥{{ cardCourseData.amount | numToCash }}</p>
					<span class="num">数量：{{ cardCourseData.num }}</span>
				</div> -->
			</div>
			
			<div class="product-info full-width product-info-course">
				<span>报名人：{{ cardCourseData.customerName }}</span>
			</div>
			<div class="product-info full-width product-info-course">
				<div class="product-info-left">
					<span>单价：￥{{ cardCourseData.amount | numToCash }}</span>
					<span class="product-info-time">{{ cardCourseData.time }}</span>
				</div>
				<div class="product-info-right">
					<!-- 是否全额 -->
					<p class="num">数量：{{ cardCourseData.num }}</p>
					<p class="all">总额：￥{{ cardCourseData.expectAmount | numToCash }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/babel">
	export default {
		name: "cardProduct",
		props: ['cardCourseData'],
		data () {
			return {
				title: "产片卡片",
				list: {
					img: "",
					title: "",
					parentTitle: "",
					amount: "", // 总金额
					expectAmount: "", // 已付金额
					num: "",
					customerName: "",
					time: ""
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
  @import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

  @import '~assets/css/card-order';
	

	.product-info {
		.product-info-title {
			@include ellipsisMore(1);
		}

		.parent-title {
			color: $colorOrange;
		}
	}

	.font12 {
		font-size: 12px !important;
	}

	.product-info-course {
		font-size: 12px;
		line-height: 1.5;

		.product-info-left {

		}

		.product-info-right {
			width: 9em;
		}

		.has-pay {
			color: $fontColorGray;
			// line-height: 2;
		}

		.all {
			color: $colorOrange;
		}
	}
</style>