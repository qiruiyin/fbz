<!-- 
	客户见证
 -->

<template>
	<div class="witness" v-cloak>
		<div class="rich-html" v-html="item.content" v-for="(item, index) in witnessData.list" :key="index"></div>
		<div class="btn-more">
			<x-button v-if="!witnessData.onFetching && !witnessData.loadAll" @click.native="loadMore" mini>查看更多</x-button>
      <load-more v-if="witnessData.onFetching && !witnessData.loadAll" tip="loading"></load-more>			
			<divider v-if="witnessData.loadAll">没有更多数据</divider>
		</div>
	</div>
</template>

<script type="text/babel">
	import { XButton, LoadMore, Divider } from 'vux'

	export default {
		name: "elWitness",
		components: {
			XButton, LoadMore, Divider
		},
		props: ['productCode'],
		data () {
			return {
				title: "客户见证",
				witnessData: {
					pageNum: 1,
					pageSize: this.wordBook.pageSize,
					onFetching: false,
					loadAll: false,
					list: []
				}
			}
		},
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData () {
				let _this = this;

				this.witnessData.onFetching = true;				
				this.$http.post('/wechat/customerWitnessMobile/queryCustomerWitnessList',
						{
							code: _this.productCode,
							pageNum: _this.witnessData.pageNum,
							pageSize: _this.witnessData.pageSize
						}
					).then(function(e) {
						let list = [];
						if(e.data.code == 200) {
							if(e.data.data.list && e.data.data.list.length > 0) {
								list = e.data.data.list.map(function(item, index){
									return {
										content: _this.resolveRichTextImg(item.content)
									}
								})
							}

							if(_this.witnessData.pageNum == 1) {
								_this.witnessData.list = list;
							} else {
								_this.witnessData.list = _this.witnessData.list.concat(list);
							}

							if(list.length < _this.witnessData.pageSize) {
								_this.witnessData.loadAll = true;
							}
							_this.witnessData.pageNum++;
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}

						_this.witnessData.onFetching = false;
					})
			},
			loadMore () {
				if(this.witnessData.onFetchhing || this.witnessData.loadAll) {

				} else {
					this.fetchData();
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
  @import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
 
	.btn-more {
		margin-bottom: 40px;
		text-align: center;
	}

</style>