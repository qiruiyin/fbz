<!-- 
	讲师
 -->

<template>
	<div class="teacher">
		<div class="teacher-info">
			<h4>讲师</h4>
			<h5>
				<img :src="data.header">
				<p>
					<label>{{ data.name }}</label>
					<span>{{ data.label }}</span>
				</p>
			</h5>
			<p>{{ data.saying }}</p>
		</div>

		<div class="teacher-org">
			<h4>机构介绍</h4>
			<img :src="data.logo" alt="">
			<p>{{ data.desc }}</p>
		</div>
	</div>
</template>

<script type="text/babel">
	export default {
		name: "teacher",
		data () {
			return {
				data: {
					name: "俞敏洪",
					header: "",
					label: "新东方教育科技集团创始人",
					saying: "新东方不光实现了自己的梦想，而且让无数的年轻人放弃了自己心中的那么一点点的障碍，最后充满活力地奔向未来，我们能做到，你为什么不行？",
					logo: "", // 机构logo
					desc: "新东方不光实现了自己的梦想，而且让无数的年轻人放弃了自己心中的那么一点点的障碍，最后充满活力地奔向未来，我们能做到，你为什么不行？"
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
  @import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
   
  $teacherHeaderW: 50px;
  $teacherHeaderPadding: 10px;

  .teacher {
  	padding: $padding;

  	h4 {
  		padding-bottom: $padding;
  		font-size: 18px;
  		color: $fontColorBlack;
  	}
  }

  .teacher-info {
  	padding-bottom: $padding;

		h5 {	
			position: relative;
			padding: 0 0 $teacherHeaderPadding $teacherHeaderW + $teacherHeaderPadding;
			height: $teacherHeaderW + $teacherHeaderPadding*2;
			line-height: $teacherHeaderW/2;
			font-size: $fontSize;

			span {
				color: $fontColorBlack;
				display: block;
			}
		}

		img {
			position: absolute;
			top: $teacherHeaderPadding;
			left: 0;
			width: $teacherHeaderW;
			height: $teacherHeaderW;
			border-radius: $teacherHeaderW/2;
		}

		& > p {
			text-indent: 2em;
		}
  }

  .teacher-org {
		p {
			text-indent: 2em;
		}
  }
</style>