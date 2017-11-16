<!-- 
	近期课程
 -->

<template>
	<timeline v-cloak>
		<timeline-item v-for="(item, index) in courseList" :key="index">
			<div class="course-recent">
				<div class="course-recent-block">
					<div class="course-recent-left">
						<h5>{{ item.name }}</h5>
					</div>
												
					<div class="course-recent-right">
						<div @click="goPage(item)" :class="['course-recent-right-btn', item.btn.value, { 'disabled': item.balance_count <= 0 }]">{{ item.btn.name }}<span></span></div>
						<p v-if="item.balance_count > 0">剩余{{ item.balance_count }}人</p>
						<p v-else>截止报名</p>
					</div>
				</div>

				<el-img-text :img-text-data="item"></el-img-text>
			</div>
		</timeline-item>
	</timeline>
</template>

<script type="text/babel">
	import { Timeline, TimelineItem } from 'vux'
	import elImgText from 'components/img-text/img-text-course'

	export default {
		name: "courseRecent",
		components: {
			Timeline, TimelineItem, elImgText
		},
		data () {
			return {
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
				_this.$http.post('/wechat/course/recent',
					{
						customerCode: _this.$store.state.user.userCode
					}).then(function(e) {
						let responseData = e.data.data;

						if(e.data.code == 200) {
							let list = [];
							if(e.data.data && e.data.data.lessonList && e.data.data.lessonList.length > 0) {
								list = e.data.data.lessonList.map(function(item, ind){
				  				let date = item.startDate + " - " + item.endDate;
									let btn = {
				  					name: "报名"				  				};

									return {
				  					btn: btn,
										code: item.code,
										courseCode: item.productCode,
										name: item.name,
										remark: item.remark,
				  					title: item.author,
				  					balance_count: item.balance_count,
				  					img: _this.resolveImg(item.thumbnail),
				  					address: item.address,
				  					desc: item.description,
				  					price: item.price,
				  					date: date,
										priceCurrency: '￥',
										label: '主讲', 
										speaker: item.author,
										isClick: true,
									}
								});
							}

							_this.courseList = list;
						}	else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
				});
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
  
</style>