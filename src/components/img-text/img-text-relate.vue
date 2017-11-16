<!-- 
	相关课程
 -->

<template>
	<div class="img-text-relate" @click="goPage">
		<div class="img">
			<img :src="imgTextData.img" alt="">
			<div v-if="courseStatus" class="count-time">开始倒计时
				<span>{{ day }}</span>天 
				<span>{{ hour }}</span>时
				<span>{{ min }}</span>分
				<!-- <span>{{ second }}</span>秒 -->
			</div>
			<div class="status">{{ !courseStatus ? '上课中' : '售票中' }}</div>
		</div>

		<div class="info">
			<h5>{{ imgTextData.name }}</h5>
			<p class="fa fa-calendar">{{ imgTextData.startDate + " - " + imgTextData.endDate}}</p>
			<p class="fa fa-map-marker">{{ imgTextData.address }}</p>
			<div class="price"><span>￥{{ imgTextData.originalPrice || imgTextData.price }}</span>￥{{ imgTextData.price }}</div>
		</div>
	</div>
</template>

<script type="text/babel">
	export default {
		name: "elImgTextRelate",
		props: ['imgTextData'],
		data () {
			return {
				title: "相关课程",
				relateData: {
					// id: '',
					// img: "",
					// name: "逆向融资2.0，周导-赚钱增速1000倍",
					// address: "苏州河",
					// startDate: "2017/10/04",
					// endDate: "2017/10/04",
					// time: "",
					// price: "3980",
					// status: "售票中",
					// seller: "1", // 购买数量
				},
				courseStatus: true,
				day: 0,
				hour: 0,
				min: 0,
				second: 0
			}
		},
		watch: {
			day (newValue, oldValue) {
			},
			hour (newValue, oldValue) {
				if(newValue == 23)
					this.day = this.day - 1;
			},
			min (newValue, oldValue) {
				if(newValue == 59)
					this.hour = this.hour - 1;
			},
			second (newValue, oldValue) {
				if(newValue == 59)
					this.min = this.min - 1;
			}
		},
		mounted () {
			let _this = this;
			this.$nextTick(function(){
				let date1 = new Date(),
						date2 = new Date(_this.imgTextData.startDate + " 00:00:00"),
						s1 = date1.getTime(),
						s2 = date2.getTime(),
						total = (s2 - s1)/1000;

				let day = parseInt(total / (24*60*60));//计算整数天数
				let afterDay = total - day*24*60*60;//取得算出天数后剩余的秒数
				let hour = parseInt(afterDay/(60*60));//计算整数小时数
				let afterHour = total - day*24*60*60 - hour*60*60;//取得算出小时数后剩余的秒数
				let min = parseInt(afterHour/60);//计算整数分
				// let second = total - day*24*60*60 - hour*60*60 - min*60;//取得算出分后剩余的秒数

				if(day < 0 || hour < 0 || min < 0) {
					this.courseStatus = false;
				}

				_this.day = day;
				_this.hour = hour;
				_this.min = min;
				// _this.second = parseInt(second);

				if(total > 0) {
 					setTimeout(function(){
						_this.updateTimeNum()
					},60000);
 				}
			})
		},
		updated () {
			let _this = this;
			this.$nextTick(function(){
				let date1 = new Date(),
						date2 = new Date(_this.imgTextData.startDate + " 00:00:00"),
						s1 = date1.getTime(),
						s2 = date2.getTime(),
						total = (s2 - s1)/1000;

				let day = parseInt(total / (24*60*60));//计算整数天数
				let afterDay = total - day*24*60*60;//取得算出天数后剩余的秒数
				let hour = parseInt(afterDay/(60*60));//计算整数小时数
				let afterHour = total - day*24*60*60 - hour*60*60;//取得算出小时数后剩余的秒数
				let min = parseInt(afterHour/60);//计算整数分
				// let second = total - day*24*60*60 - hour*60*60 - min*60;//取得算出分后剩余的秒数

				if(day < 0 || hour < 0 || min < 0 || !day || !hour || !min) {
					this.courseStatus = false;
				}

				_this.day = day;
				_this.hour = hour;
				_this.min = min;
				// _this.second = parseInt(second);

				if(total > 0) {
 					setTimeout(function(){
						_this.updateTimeNum()
					},60000);
 				}
			})
		},
		methods: {
			updateTimeNum () {
				if(this.day > 0 || this.hour > 0 || this.min > 0) {
					if(this.min == 0) {
						this.min = 59;
					} else {
						this.min--;
					}
				}

				setTimeout(this.updateTimeNum, 60000);
			},
			goPage () {
				if(!this.imgTextData.isClick) return; 
				if(this.imgTextData.url == 'activityDetail') {
					this.$router.push({name: 'activityDetail', query: { activityId: this.imgTextData.id }}) 
				} else {
					this.$router.push({name: 'courseDetail', query: { periodsId: this.imgTextData.id }}) 
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	.img-text-relate {

	}

	.img {
		position: relative;
		width: 100%;

		img {
			width: 100%;
		}

		.status {
			@include halfpxline(30px, #fff, 1px, 1px, 1px, 1px);
			position: absolute;
			top: 8px;
			right: $padding;
			padding: 0 .8em;
			// padding-left: 20px;
			line-height: 20px;
			color: #fff;
			font-size: 12px;

			// &:before {
			// 	content: "";
			// 	position: absolute;
			// 	top: 50%;
			// 	left: .5em;
			// 	margin-top: -3px;
			// 	border: 4px solid #fff;
			// 	border-radius: 5px;
			// }
		}

		.count-time {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 4px 0;
			text-align: center;
			background: rgba(0, 0, 0, .3);
			color: #fff;
			line-height: 40px;

			span {
				margin: 0 .4em;
				line-height: 30px;
				padding: 0 .4em;
				background: rgba(0, 0, 0, .6);
				border-radius: $borderRadius;
				display: inline-block;
			}
		}
	}

	.info {
		position: relative;
		padding: $padding/2 $padding $padding;
		line-height: 1.75;

		h5 {
			font-size: 18px;
			color: $fontColorBlack;
		}

		p {
			line-height: 1.75;
			display: block;

			&:before {
				width: 1em;
				margin-right: .5em;
				text-align: center;
				display: inline-block;
			}
			span {
				font-size: 12px;
				float: right;
				color: $fontColorGray;
			}
		}
	}

	.price {
		position: absolute;
		right: $padding;
		bottom: $padding;

		span {
			margin-right: .5em;
			text-decoration: line-through;
			font-size: 12px;
			color: $fontColorGray;	
		}
	}

	.original-price {
		position: absolute;
		right: $padding;
		bottom: $padding + 30px;
		text-decoration: line-through;
		font-size: 12px;
		color: $fontColorGray;
	}
</style>