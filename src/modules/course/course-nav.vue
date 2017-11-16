<!-- 
	课程列表
 -->

<template>
	<div class="detail-type" v-cloak>
		<div class="container">
			<el-course-all></el-course-all>
		</div>
	</div>
</template>

<script type="text/babel">
	import { XTable, Card, Timeline, TimelineItem, Tab, TabItem, Swiper, SwiperItem } from 'vux'
	import elCard from 'components/card/card'
	import elImgText from 'components/img-text/img-text'
	import elCourseAll from 'components/course/all'

	export default {
		name: 'courseTypeDetail',
		components: { XTable, Card, Timeline, TimelineItem, Tab, TabItem, Swiper, SwiperItem, elCard, elImgText, elCourseAll },
		data () {
			return {
				title: '课程列表',
				tabChangeW: this.wordBook.tabChangeW,
				tabData: [
					{
						value: 'all',
						name: '所有课程',
						list: []
					},{
						value: 'recent',
						name: '推荐课程',
						list: []
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