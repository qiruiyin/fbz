<!--
	图文混排 
 -->
<template>
	<div class="img-text" @click="setCheck(2)" v-cloak>
		<check-icon @click.native.stop="setCheck(1)" :value.sync="imgTextData.check"></check-icon>
		<div class="img">
			<img :src="imgTextData.imgPath" alt="图片">
		</div>
		<div class="img-text-content">
			<div class="title">{{ imgTextData.title }}</div>
			<div class="num">
				<x-number @click.native.stop="numClick" :min="1" class="num-data" v-model="cartNum"></x-number>
			</div>
			<div class="price" v-if="imgTextData.price">￥{{ imgTextData.price }} <span>x1</span></div>
		</div>
	</div>
</template>

<script type="text/babel">
	import { XNumber, CheckIcon } from 'vux'

	export default {
		props: ['imgTextData', 'imgTextIndex'],
		components: { XNumber, CheckIcon },
		data () {
			return {
				cartNum: this.imgTextData.num
			}
		},
		watch: {
			cartNum (newValue, oldValue) {
				let _this = this,
						num = newValue - oldValue;
				_this.$store.commit("updateCartNum", { num: _this.$store.state.cart.num + num });

				_this.$http.post('/wechat/shop/updateCart',
					{
						userCode: _this.$store.state.user.userCode,
						productCode: _this.imgTextData.code,
						shopCount: num
					}).then(function(e) {
				});
			}
		},
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData() {
				let _this = this;
				_this.$http.post('/wechat/shop/queryCart',
					{
						userCode: _this.$store.state.user.userCode,
					}).then(function(e) {
						_this.$store.commit("updateCartNum", { num: e.data.data.number });	
				});
			},
			setCheck (ind) {
				if(ind != 1) {
					this.imgTextData.check = !this.imgTextData.check
				}
				this.$emit('on-check', this.imgTextData.check);
			},
			numClick () {
				let _this = this;
				this.$emit('on-number-change', {ind: this.imgTextIndex, num: this.cartNum});

				// _this.$http.post('/wechat/shop/updateCart',
				// 	{
				// 		userCode: _this.$store.state.user.userCode,
				// 		productCode: _this.imgTextData.code,
				// 		shopCount: _this.productInfo.num
				// 	}).then(function(e) {
				// 		if(e.data.code == 200) {
				// 			_this.$vux.toast.show({
				// 				text: "加入购物车成功"
				// 			});
				// 			let num = _this.productInfo.num + _this.$store.state.cart.num;

				// 			_this.$store.commit("updateCartNum", { num: num});
				// 		}
				// });

				// _this.$http.post('/wechat/shop/addCart',
				// 	{
				// 		userCode: _this.$store.state.user.userCode,
				// 		productCode: _this.imgTextData.code,
				// 		shopCount: _this.imgTextData.num
				// 	}).then(function(e) {
				// });
			}
		}
	}
</script>

<style lang="scss">
	@import '~lib/sandal/core';
	@import '~assets/css/core/vars', '~assets/css/core/functions';
	
	$imgTextCartNumColor: $colorOrange;

	.img-text {
		.vux-check-icon {
			display: flex;
			justify-content: center;
    	align-items: center;
		}
	}
</style>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/vars', '~assets/css/core/functions';
	

	.img-text {
		position: relative;
		min-height: $imgTextImgH;
		padding: $paddingTop/2 $padding;
		background-color: #fff;
		display: flex;

		&:first-child {
			// border-top: 0;
		}

		.img {
			height: $imgTextImgH;
			text-align: center;
			background: #efefef;

			img {
				margin: 0 auto;
				height: 100%;
			}
		}
	}

	.img-text-content {
	  position: relative;
	  flex: 1;
		padding-left: $padding;
		line-height: 2;
		@extend %clearfix;

		.title {
			color: $fontColorBlack;
		}

		.price {
			color: $colorOrange;

			span {
				float: right;
				font-size: 12px;
				color: $fontColor;
			}
		}

		.num {
			@extend %clearfix;
		}
	}
	
	.checkbox {
		position: absolute;
		top: 50%;
		left: $padding;
	}

	.num-data {
		// float: right;
		float: right;
		width: 130px;
		padding: 0;
	}
</style>