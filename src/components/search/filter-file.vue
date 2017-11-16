<!-- 
	筛选资料
 -->

<template>
	<div class="filter-file">
		<div class="filter-file-block" v-for="(item, index) in list" :key="index">
			<div :class="['filter-file-block-title', 'fa', item.show ? 'fa-angle-up' : 'fa-angle-down']" @click="item.show = !item.show;">{{ item.name }}</div>
			<div class="filter-file-block-content" v-show="item.show">
				<div class="filter-file-block-cell" v-for="(it, ind) in item.list" :key="ind">{{ it.name }}</div>
			</div>
		</div>
	</div>
</template>

<script type="text/babel">
	import { TransferDom, Group, Cell, CellBox, Search, Popup, XSwitch } from 'vux'

	export default {
		name: "filterFile",
		directives: {
	    TransferDom
	  },
		components: { Group, Cell, CellBox, Search, Popup, XSwitch },
		data () {
			return {
				saixuan: false,
				list: [
					{
						name: "政策法规",
						value: "zhengche",
						show: false,
						list: [
							{
								name: "金融资本",
								value: "jinrong"
							},{
								name: "股权融资",
								value: "jinrong"
							},{
								name: "经典管理",
								value: "jinrong"
							},{
								name: "行业资料",
								value: "jinrong"
							},{
								name: "其他资金",
								value: "jinrong"
							},{
								name: "教育",
								value: "jinrong"
							},{
								name: "股权类",
								value: "jinrong"
							},{
								name: "期权类",
								value: "jinrong"
							},
						]
					},{
						name: "合同条款",
						value: "zhengche",
						show: false,
						list: [
							{
								name: "金融资本",
								value: "jinrong"
							},{
								name: "股权融资",
								value: "jinrong"
							},{
								name: "经典管理",
								value: "jinrong"
							},{
								name: "行业资料",
								value: "jinrong"
							},{
								name: "其他资金",
								value: "jinrong"
							},{
								name: "教育",
								value: "jinrong"
							},{
								name: "股权类",
								value: "jinrong"
							},{
								name: "期权类",
								value: "jinrong"
							},
						]
					}
				]
			}
		},
		methods: {
			showAll (obj) {
				obj.show = !obj.show;
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
  @import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	$filterW: 7em;
	$filterPadding: 10px;

	.filter-file {
		width: $filterW;
		background: $colorRedDeep;
		text-align: left;
		color: #fff;
	}

	.filter-file-block {
		
	}

	.filter-file-block-title {
		@include halfpxline(0, #fff, 0 , 0, 1px, 0);
		width: 100%;
		padding: $filterPadding 0;
		text-indent: .5em;

		&:before {
			padding-right: .5em;
		}
	}

	.filter-file-block-cell {
		padding: $filterPadding 0;
		@include halfpxline(0, #fff, 0 , 0, 1px, 0);
		text-indent: 1.6em;
	}
</style>