<!-- 
	商城类型版块
 -->

<template>
	<div class="mall-card" v-cloak>
		{{ mallCardData }}
		<!-- <div class="mall-card-header" v-if="mallCardData.title">
			<h3>{{ mallCardData.title }}</h3>
			<p>{{ mallCardData.desc }}</p>
		</div> -->
		<div class="mall-card-body">
			<el-mall-product :mall-product-data="item" v-for="(item, index) in mallCardData.list" :key="index"></el-mall-product>

			<!-- <cell class="mall-more" v-if="mallCardData.type" title="查看更多" :link="{name: 'mallList', query: { type: mallCardData.type }}" is-link></cell> -->
		</div>
	</div>
</template>

<script type="text/babel">
	import { Cell } from 'vux'
	import elMallProduct from 'components/mall/product-like'
	
	export default {
		name: "mallProduct",
		components: {
			Cell, elMallProduct
		},
		props: ["mallCardData"],
		data () {
			return {
				mallData: {
					title: '',
					desc: '',
					list: '',
					type: ''
				}
			}
		},
		methods: {
	    goPage (link, code) {
	    	this.$router.push({name: link, query: { goodsCode: code }})
	    }
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	.mall-card {
		width: 100%;
	}

	.mall-card-header {
		position: relative;
		text-align: center;
		padding: $padding 0;
		background-color: $uiMarginBg;
		// @include halfpxline(0, #fff, 0 , 0, 1px, 0);

		h3 {
			font-size: 20px;
		}

		p {
			position: relative;
			width: auto;
			display: inline;

			&:before, &:after {
				content: "";
				position: absolute;
				top: 6px;
				left: -26px;
				width:0;
		    height:0;
		    border-width: 8px 8px 0;
		    border-style: solid;
		    border-color: $fontColorGray transparent transparent;
			}

			&:after {
				left: auto;
				right: -26px;
			}
		}
	}

	.mall-card-body {
		@extend %clearfix;
		// padding: $padding;
		background-color: $uiMarginBg;
	}

	.mall-more {
		width: 100%;
	}
</style>