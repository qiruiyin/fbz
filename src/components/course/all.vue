<!-- 
	所有课程
 -->

<template>
	<scroller lock-x :height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offst="200" v-cloak>
		<div class="all-course">
			<el-img-text-relate v-for="(item, index) in scrollerInfo.list" :img-text-data="item" :key="index"></el-img-text-relate>
			<el-load-more :load-all="scrollerInfo.loadAll"></el-load-more>
		</div>
	</scroller>
</template>

<script type="text/babel">
	import { Scroller, Timeline, TimelineItem } from 'vux'
	import elLoadMore from 'components/load-more/load-more'
	import elImgTextRelate from 'components/img-text/img-text-relate'

	export default {
		name: "courseAll",
		components: {
			Scroller, Timeline, TimelineItem, elLoadMore, elImgTextRelate
		},
		data () {
			return {
				scrollerInfo: {
					onFetching: false,
					loadAll: false,
					pageNum: 1,
					pageSize: this.wordBook.pageSize,
					offsetBottom: 50,
					list: []
				},
				kefuInfo: {},
				courseList: []
			}
		},
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData () {
				let _this = this;
				if(_this.scrollerInfo.onFetching || _this.scrollerInfo.loadAll) return;

				_this.scrollerInfo.onFetching = true;		
				_this.$http.post('/api/curriculum/curriculumList',
					_this.qs.stringify({
						type: "",
						pageNum: this.scrollerInfo.pageNum,
						pageSize: this.scrollerInfo.pageSize
					})).then(function(e) {
						if(e.data.code == 200) {
							let list = [];
							if(e.data.data && e.data.data.result && e.data.data.result.length > 0) {
								list = e.data.data.result.map(function(item, ind){
									return {
										img: item.images,
										id: item.periodsId,
										remark: item.remark,
										name: item.name,
										status: '',
										price: item.price,
										originalPrice: item.originalPrice,
										address: item.address || '',
										endDate: item.endDate,
										startDate: item.startDate,
										url: 'courseDetail',
										seller: item.disMaxCount || 0,
										isClick: true
									}
								});
							}

							if(list.length < _this.scrollerInfo.pageSize) {
								_this.scrollerInfo.loadAll = true;
							}

							if(_this.scrollerInfo.pageNum == 1) {
								_this.scrollerInfo.list = list;
							} else {
								_this.scrollerInfo.list = _this.scrollerInfo.list.concat(list);
							}

							_this.scrollerInfo.pageNum++;
							_this.resetView();
						}	else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}

						_this.scrollerInfo.onFetching = false;		
				});
			},
			resetView () {
				let _this = this;
				this.$nextTick(() => {
          this.$refs.scrollerBottom.reset()
        })
			},
			loadMore () {
				if(this.scrollerInfo.onFetching || this.scrollerInfo.loadAll) {

				} else {
					this.fetchData();
				}
			},
			goPage (obj) {
				if(!this.isLogin()) return false
				this.$router.push({ name: 'courseOrder', query: { id: obj.id, type: 'course' } })
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
  @import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
  
  @import '~assets/css/course';
	
	.container {
		padding-bottom: 100px;
	}

	.all-course {
		padding-bottom: 240px;
	}
</style>