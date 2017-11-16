<!-- 
	首页推荐
 -->

<template>
	<div class="tuijian" v-cloak>
		<div class="tuijian-left">
			<div :class="{ 'tuijian-img': item.src, 'active': tuijianStatus == index }"  v-for="(item, index) in tuijianData" :key="index">
				<div @click="play(index)" >{{ item.name }}</div>
				<!-- <div v-if="item.src" @click="play(index)" >{{ item.name }}</div> -->
				<!-- <div v-else @click="goPage('quotation')" >{{ item.name }}</div> -->
			</div>
		</div>

		<div class="tuijian-right">
			<slot></slot>
		</div>
	</div>
</template>

<script type="text/babel">
	// import imgHeader from 'assets/img/index/header.png'

	export default {
		props: ['tuijianData', 'tuijianLink', 'tuijianStatus'],
		data () {
			return {
				// img: imgHeader,
				// list: [
				// 	{
				// 		value: '',
				// 		name: '狼群（全新修订全本珍藏版 上）',
				// 		url: ''
				// 	},{
				// 		value: '',
				// 		name: '狼群（全新修订全本珍藏版 上）',
				// 		url: ''
				// 	},{
				// 		value: '',
				// 		name: '狼群（全新修订全本珍藏版 上）',
				// 		url: ''
				// 	}
				// ]
			}
		},
		methods: {
			goPage (url, params) {
				if(params) {
		  		this.$router.push({ name: url, params: params})
				} else {
		  		this.$router.push({ name: url })
				}
			},
			play (ind) {
				console.log(ind)
				this.$emit('play-change', ind);
			}
		}	
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	$tuijianImg: 30px;

	.tuijian {
		padding: $padding;
		@include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
		display: flex;
	}
	
	.tuijian-left {
		flex: 1;
		line-height: $tuijianImg;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

		& > div {
			position: relative;
			width: 100%;
			padding-left: $tuijianImg;
			
			&:before {
				content: "";
				position: absolute;
				top: 0;
				left: 0;
				width: $tuijianImg;
    		height: $tuijianImg;
    		background: url("~assets/img/index/tuijian-quotation.png") no-repeat;
    		background-size: 70%;
    		background-position: left center;
			}

			&.tuijian-img {
				&:before {
    			background-image: url("~assets/img/index/tuijian.png");
				}
			}

			&.active {
				color: $colorOrange;
				transition: 1s;

				&:before {
    			background-image: url("~assets/img/index/tuijian-active.png");
				}
			}

			div {
				overflow:hidden;
				text-overflow:ellipsis; 
			}
		}

	}

	.tuijian-right {
		width: $tuijianImgW + 10px;
		text-align: center;
		line-height: 30px;
		color: $colorOrange;
		
		img {
			width: $tuijianImgW;
			height: $tuijianImgW;
			margin: 0 auto;
		}
	}

</style>