<!-- 
	课程块
 -->

<template>
	<div class="course-block">
		<div class="course-block-header">
			<h5>{{  }}</h5>
		</div>
		<div class="course-block-content"></div>
	</div>
</template>

<script type="text/babel">
	export default {
		name: "courseBlock",
		data () {
			return {
				courseData: [
					{
						name: "逆向融资2.0",
						num: "98",
						date: "2017/08/23 - 26",
						address: "上海",
						price: "3980"
					}
				]
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
  @import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
  

  .course-block {
  	
  }
</style>