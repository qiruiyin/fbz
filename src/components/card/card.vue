<!-- 
	主题详情卡片
 -->
<template>
	<div class="card" v-cloak>
		<div class="card-header">
			<img :src="cardData.header.img">
			<div class="title">
				<p>{{ cardData.header.title }}</p>
				<span>{{ cardData.header.desc }}</span>
			</div>
		</div>
		<div class="card-content">
			<div class="title">{{ cardData.content.title }}</div>
			<p>{{ cardData.content.desc }}</p>
		</div>
		<div class="card-footer">
			<div class="btn" v-for="(item, index) in cardData.footer.btns" :key="index">{{ item.name }}</div>
		</div>
	</div>
</template>

<script type="text/babel">
	import { Panel, Group, Radio } from 'vux'
	
	import imgHeader from 'assets/img/icon/icon.png'

	export default {
		name: 'card',
		components: { Panel },
		props: ['cardData'],
		data () {
			return {
				title: '卡片',
				list: {
					header: {
						img: imgHeader,
						title: '系统思维',
						desc: '破译了国家激发生产力背后的分配机制'
					},
					content: {
						title: '如何让客户离不开公司',
						desc: '成为第一名的源动力，自动自发'
					},
					footer: {
						btns: [
							{
								value: '',
								name: '查看更多',
								url: ''
							},{
								value: '',
								name: '立即报名',
								url: ''
							}
						]
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
  @import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
  
  $imgW: 44px;

  .card {
		margin-bottom: $padding;
  }

  .card-header {
  	padding: $padding;
  	display: flex;
		@include halfpxline(0, $borderColor, 1px, 0, 1px, 0);

  	img {
  		width: $imgW;
  		height: $imgW;
  	}
		
		.title {
			padding-left: $padding;
			flex: 1;
		}

  	p {
			font-size: 18px;
  	}
  }

  .card-content {
  	padding: $padding;
  	padding-left: $padding * 2 + $imgW;
		line-height: 1.75;
		@include halfpxline(0, $borderColor, 0, 0, 1px, 0);

  	.title {
			font-size: 20px;
  	}
  }
	
	.card-footer {
		display: flex;
		text-align: center;
		@include halfpxline(0, $borderColor, 0, 0, 1px, 0);
		background-color: $bgGray;

		.btn {
			line-height: 44px;
			flex: 1;
			@include halfpxline(0, $borderColor, 0, 0, 0, 1px);

			&:first-child {
				border-left: 0;
			}
		}
	}
</style>