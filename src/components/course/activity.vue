<!-- 
	活动课程
 -->

<template>
	<scroller lock-x :height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offst="200" v-cloak>
		<timeline>
			<timeline-item v-for="(item, index) in courseList" :key="index">
				<div class="course-recent">
					<div class="course-recent-block">
						<div class="course-recent-left">
							<h5>{{ item.name }}</h5>
						</div>
													
						<div class="course-recent-right">
							<div @click="goPage(item)" :class="['course-recent-right-btn', item.btn.value, { 'disabled': item.remainingNumber <= 0 }]">{{ item.btn.name }}<span></span></div>
							<p v-if="item.remainingNumber > 0">剩余{{ item.remainingNumber }}人</p>
							<p v-else>截止报名</p>
						</div>
					</div>

					<el-img-text :img-text-data="item"></el-img-text>
				</div>
			</timeline-item>
		</timeline>
	</scroller>
</template>

<script type="text/babel">
	import { Scroller, Timeline, TimelineItem } from 'vux'
	import elLoadMore from 'components/load-more/load-more'
	import elImgText from 'components/img-text/img-text-course'

	export default {
		name: "courseActivity",
		components: {
			Scroller, Timeline, TimelineItem, elLoadMore, elImgText
		},
		data () {
			return {
				scrollerInfo: {
					onFetching: false,
					loadAll: false,
					pageNum: 1,
					pageSize: this.wordBook.pageSize,
					offsetBottom: 100
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
						type: 1,
						pageNum: this.scrollerInfo.pageNum,
						pageSize: this.scrollerInfo.pageSize
					})).then(function(e) {

						if(e.data.code == 200) {
							let list = [];
							if(e.data.data && e.data.data.result && e.data.data.result.length > 0) {
								list = e.data.data.result.map(function(item, ind){
				  				let date = item.startDate + " - " + item.endDate;
									let btn = {
				  					name: "报名"
				  				};

									return {
				  					btn: btn,
										id: item.periodsId,
										name: item.name,
										remark: item.remark,
				  					lecturer: item.lecturer,
				  					remainingNumber: item.remainingNumber,
				  					img: item.images,
				  					address: item.address,
				  					desc: '',
				  					price: item.price,
				  					originalPrice: item.originalPrice,
				  					date: date,
										priceCurrency: '￥',
										label: '主讲', 
										speaker: item.lecturer,
										isClick: true
									}
								});
							}

							if(list.length < _this.scrollerInfo.pageSize) {
								_this.scrollerInfo.loadAll = true;
							}

							if(_this.scrollerInfo.pageNum == 1) {
								_this.courseList = list;
							} else {
								_this.courseList = _this.courseList.concat(list);
							}

							_this.scrollerInfo.pageNum++;
						}	else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}

						_this.resetView();
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
				this.$router.push({ name: 'courseOrder', query: { id: obj.id, type: 'course'} })
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
</style>