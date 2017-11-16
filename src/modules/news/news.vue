<!-- 
	培训头条
 -->

<template>
	<div class="train-top">
	  <scroller lock-x :height="-topData.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offst="200">
			<div>
				<el-img-text-news v-for="(item, index) in topData.list" :img-text-data="item" :key="index"></el-img-text-news>

				<el-load-more :load-all="topData.loadAll"></el-load-more>
			</div>
		</scroller>
	</div>
</template>

<script type="text/babel">
	import { Scroller } from 'vux'
	import elImgTextNews from 'components/img-text/img-text-news'
	import elLoadMore from 'components/load-more/load-more'

	export default {
		name: "news",
		components: {
			Scroller, elImgTextNews, elLoadMore
		},
		data () {
			return {
				title: "培训头条",
				topData: {
					spareType: 2,
					offsetBottom: 53,
					onFetching: false,
					loadAll: false,
					pageNum: 1,
					pageSize: this.wordBook.pageSize,
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
				// _this.$store.commit('updateLoadingStatus', {isLoading: true});
				_this.topData.onFetching = true;
				_this.$http.post('/api/news/list',
	  				this.qs.stringify({
							"topTag": '',
							"pageNum": _this.topData.pageNum,
							"pageSize": _this.topData.pageSize,
						})
	  			).then(function(e) {
						_this.topData.onFetching = false;
						if(e.data.code == 200) {
							let list = [];
							if(e.data.data.result.length > 0){
								list = e.data.data.result.map(function(item, index){
									return {
										time: item.updateTime || item.createTime,
										desc: item.content,
										id: item.id,
										readCount: item.readCount,
										img: _this.resolveImg(item.images),
										title: item.title
									}
								});
							}

							if(_this.topData.pageNum == 1){
								_this.topData.list = list;
							} else {
								_this.topData.list = _this.topData.list.concat(list);
							}

							if(list.length < _this.topData.pageSize) {
								_this.topData.loadAll = true;
							}
							_this.topData.pageNum++;
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
						_this.resetView();
					})
			},
			resetView () {
				let _this = this;
				_this.$nextTick(() => {
          _this.$refs.scrollerBottom.reset()
        })
			},
			loadMore () {
				if(this.topData.onFetching || this.topData.loadAll) {

				} else {
					this.topData.onFetching = true;					
					this.fetchData();
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	.train-top {
		padding-bottom: 53px;
	}
</style>