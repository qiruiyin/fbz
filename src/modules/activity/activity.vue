<!-- 
	活动线下活动
 -->

<template>
	<div class="detail-type" v-cloak>
		<div class="container">
			<div class="tab">			
				<tab :line-width=2 v-model="tabSelected">
		      <tab-item class="vux-center" v-for="(item, index) in tabData" :key="index">{{ item.name }}</tab-item>
		    </tab>
		    <swiper v-model="tabSelected" height="100%" :show-dots="false" :threshold="tabChangeW">
		      <swiper-item v-for="(tabItem, ind) in tabData" :key="ind">
		    		<template v-if="tabItem.value == 'salon'">
							<el-activity-salon></el-activity-salon>
		    		</template>

		    		<template v-if="tabItem.value == 'visit'">
							<el-activity-visit></el-activity-visit>
							<!-- <el-course-activity></el-course-activity> -->
		    		</template>

		    		<template v-if="tabItem.value == 'trade'">
							<el-activity-trade></el-activity-trade>
							<!-- <el-course-all></el-course-all> -->
		    		</template>
		      </swiper-item>
		    </swiper>
			</div>
		</div>
	</div>
</template>

<script type="text/babel">
	import { Tab, TabItem, Swiper, SwiperItem } from 'vux'
	import elActivitySalon from 'components/activity/salon'
	import elActivityVisit from 'components/activity/visit'
	import elActivityTrade from 'components/activity/trade'
	
	export default {
		name: 'activity',
		components: { Tab, TabItem, Swiper, SwiperItem, elActivitySalon, elActivityVisit, elActivityTrade },
		data () {
			return {
				title: '课程列表',
				tabChangeW: this.wordBook.tabChangeW,
				tabData: [
					{
						value: 'salon',
						name: '线下沙龙',
						list: []
					},{
						value: 'visit',
						name: '参观考察',
						list: []
					},{
						value: 'trade',
						name: '行业活动',
						list: []
					}
				],
				tabSelected: this.$route.query.type == 1 ? 1 : 0,
				// courseTitle: [ '日期', '课程', '讲师', '时间', '地点' ],
				banner: [],
				courseTuijian: []
			}
		},
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData	() {
	  		
	  	},
	  	goPage(code, status) {
	  		// this.$router.push({name: "courseDetail", query: { courseCode: code, courseStatus: status }})
	  	}
		}
	}
</script>

<style lang="scss">
	.tab .vux-slider {
		height: 100%;
	}
</style>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
  @import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
  
	@import '~assets/css/course-index';
	
</style>