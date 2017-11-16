<!-- 
	悬浮按钮组
 -->

<template>
	<div :class="['frame-btn', { active: frameBtnStatus }]" v-cloak>
		<div @click="goPage(item)" :class="['frame-btn-block', 'frame-btn-icon-' + item.value]" v-for="(item, index) in list" :key="index"></div>
	</div>
</template>

<script type="text/babel">
	export default {
		name: "elFrameBtn",
		data () {
			return {
				frameBtnStatus: false,
				list: [
					{
						value: 'all',
						url: '',
					},{
						value: 'more',
						url: ''
					},{
						value: 'kefu',
						url: ''
					},{
						value: 'cart',
						url: 'shopCart'
					},{
						value: 'share',
						url: 'share'
					}
				]
			}
		},
		methods: {
			goPage ($obj) {
				// if($obj.value == "all") {
				this.frameBtnStatus = !this.frameBtnStatus;
				if ($obj.url) {
					this.$router.push({name: $obj.url});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	$frameBtnW: 50px;
	$frameBtnMargin: $frameBtnW + 20px; // 圆心到圆心的大小
	$frameBtnLeft: - $frameBtnMargin*sin(60deg);
	$frameBtnTop: $frameBtnMargin*sin(30deg);
	$frameBtnRotate: 1080deg; // 旋转度数
	$frameBtnIconOpacity: .65;

	$frameBtnIcon: ((value: all, bgColor: #e14e44, bgImg: '~assets/img/frame-btn/plus.png', left: 0, top: 0, activeLeft: 0, activeTop: 0, rotate: $frameBtnRotate + 45deg, zIndex: 2),
								 (value: more, bgColor: rgba(255, 157, 81, $frameBtnIconOpacity), bgImg: '~assets/img/frame-btn/more.png', left: 0, top: 0, activeLeft: 0, activeTop: $frameBtnMargin, rotate: $frameBtnRotate, zIndex: 1),
								 (value: kefu, bgColor: rgba(153, 204, 0, $frameBtnIconOpacity), bgImg: '~assets/img/frame-btn/kefu.png', left: 0, top: 0, activeLeft: $frameBtnLeft, activeTop: -$frameBtnTop, rotate: $frameBtnRotate, zIndex: 1),
								 (value: cart, bgColor: rgba(255, 137, 196, $frameBtnIconOpacity), bgImg: '~assets/img/frame-btn/cart.png', left: 0, top: 0, activeLeft: $frameBtnLeft, activeTop: $frameBtnTop, rotate: $frameBtnRotate, zIndex: 1),
								 (value: share, bgColor: rgba(42, 224, 72, $frameBtnIconOpacity), bgImg: '~assets/img/frame-btn/share.png', left: 0, top: 0, activeLeft: 0,  activeTop: -$frameBtnMargin, rotate: $frameBtnRotate, zIndex: 1));
	
	.frame-btn {
		position: absolute;
		right: 0;
		bottom: $containerBottom*2;
		width: $frameBtnW;
		height: $frameBtnW;
		z-index: 100;
	}

	.frame-btn-block {
		position: absolute;
		top: 0;
		left: 0;
		width: $frameBtnW;
		height: $frameBtnW;
		margin-top: -$frameBtnW/2;
		margin-left: -$frameBtnW/2;
		line-height: $frameBtnW;
		text-align: center;
		border-radius: $frameBtnW;
		color: #fff;
		transition: 1s;
		background: 100% no-repeat;
		background-position: center;
	}

	.frame-btn-icon-all {
		opacity: 1;
		width: $frameBtnW + 2px;
		height: $frameBtnW + 2px;
		margin-top: -$frameBtnW/2 -1px;
		margin-left: -$frameBtnW/2 -1px;
	}

	@for $i from 1 through length($frameBtnIcon) {
	  $item: nth($frameBtnIcon, $i);
	  $itemValue: map-get($item, value);

	  .frame-btn-icon-#{$itemValue} {
	    background-image: url(map-get($item, bgImg));
	    background-color: map-get($item, bgColor);
	    left: map-get($item, left);
	    top: map-get($item, top);
	    z-index: map-get($item, zIndex);
	  }

	  .frame-btn.active {
	  	.frame-btn-icon-#{$itemValue} {
	  		transform: translate(map-get($item, activeLeft), map-get($item, activeTop)) rotate(map-get($item, rotate));
		  }
	  }
	}
</style>