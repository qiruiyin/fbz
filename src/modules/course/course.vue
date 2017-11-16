<!-- 
	课程列表
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
		    		<template v-if="tabItem.value == 'tuijian'">
							<el-course-tuijian></el-course-tuijian>
		    		</template>

		    		<template v-if="tabItem.value == 'activity'">
							<el-course-activity></el-course-activity>
		    		</template>

		    		<template v-if="tabItem.value == 'all'">
							<el-course-all></el-course-all>
		    		</template>
		      </swiper-item>
		    </swiper>
			</div>
		</div>
	</div>
</template>

<script type="text/babel">
	import { XTable, Card, Timeline, TimelineItem, Tab, TabItem, Swiper, SwiperItem } from 'vux'
	import elCard from 'components/card/card'
	import elImgText from 'components/img-text/img-text'
	import elCourseTuijian from 'components/course/tuijian'
	import elCourseRecent from 'components/course/recent'
	import elCourseActivity from 'components/course/activity'
	import elCourseAll from 'components/course/all'

	export default {
		name: 'courseTypeDetail',
		components: { XTable, Card, Timeline, TimelineItem, Tab, TabItem, Swiper, SwiperItem, elCard, elImgText, elCourseTuijian, elCourseRecent, elCourseAll, elCourseActivity },
		data () {
			return {
				title: '课程列表',
				tabChangeW: this.wordBook.tabChangeW,
				tabData: [
					{
						value: 'tuijian',
						name: '推荐课程',
						list: []
					},{
						value: 'activity',
						name: '活动课程',
						list: []
					// },{
					// 	value: 'recent',
					// 	name: '优惠套餐',
					// 	list: []
					}
				],
				tabSelected: this.$route.query.type == 1 ? 1 : 0,
				courseTitle: [ '日期', '课程', '讲师', '时间', '地点' ],
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
	  		this.$router.push({name: "courseDetail", query: { courseCode: code, courseStatus: status }})
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