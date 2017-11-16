<!-- 
	商城创建订单页面
 -->

<template>
	<div class="mall-order">
		<template v-if="address.address">
			<div class="address" @click="addressChoose">
				<div class="address-msg">
					<p class="address-man">收货人：{{ address.name }}</p>
					<span class="address-tel">{{ address.phone }}</span>
				</div>
				<div class="address-detail">
					<i class="address-icon"></i>
					收货地址：{{ address.address }}
					<i class="angle-icon fa fa-angle-right"></i>
				</div>
			</div>
		</template>

		<template v-else>
			<div class="btns">
				<x-button class="order-add-address fa fa-plus" @click.native="addressAdd">添加收货地址</x-button>
			</div>
		</template>

		<div class="card-product-list">
			<el-card-mall class="card-mall-padding" :card-mall-data="goodsInfo" :cart-num="goodsInfo.num" @on-num-change="onNumChange"></el-card-mall>
		</div>
	
		<el-cart-mall :cart-data="cartData"></el-cart-mall>
	</div>
</template>

<script type="text/babel">
	import { XButton } from 'vux'
	import elCardMall from 'components/card/card-mall'
	import elCartMall from 'components/cart/cart-mall'

	export default {
		name: 'mallOrder',
		components: {
			XButton, elCardMall, elCartMall
		},
		data () {
			return {
				goodsInfo: {
					id: this.$route.query.id,
					num: 1,
					description: "",
					productCode: "",
					productCount: "",
					productName: "",
					productPrice: "",
					addressId: "",
					img: ""
				},
				address: {
					address: "",
					name: "",
					phone: "",
					id: ""
				},
				cartData: {
					money: 0,
					num: 1,
					addressId: "",
					id: this.$route.query.id
				}
			}
		},
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData () {
				let _this = this;

				this.getAddress();
				this.getDetail();
			},
			getDetail () {
				let _this = this;

				_this.$http.post('/api/goods/detail',
					_this.qs.stringify({
						id: _this.goodsInfo.id
					})).then(function(e) {
						if(e.data.code == 200) {
							let res = e.data.data;
							
							_this.goodsInfo.description = res.remark;
							_this.goodsInfo.productName = res.name;
							_this.goodsInfo.productPrice = res.price;
							_this.goodsInfo.img = res.images;

							_this.cartData.money = _this.goodsInfo.num * _this.goodsInfo.productPrice;
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
				});
			},
			addressChoose() {
				this.$router.push({ name: "address", query: { goodsId: this.goodsInfo.id, url: 'mallOrder' }});
			},
			addressAdd () {
  			this.$router.push({ name: "addressAdd", query: { goodsId: this.goodsInfo.id, url: 'mallOrder' } });
			},
			getAddress () {
				let _this = this;
				_this.$http.post('/api/userInfo/getDefaultAddressInfo',
					_this.qs.stringify({
						customerId: _this.$store.state.user.userId
					})).then(function(e) {
						if(e.data.code == 200) {
							let res = e.data.data;

							_this.address = {
								address: res.receiverAddress,
								name: res.receiverName,
								phone: res.receiverPhone,
								id: res.id
							};

							_this.cartData.addressId = res.id;
						}
				});
			},
			onNumChange (val) {
				let _this = this;
				_this.cartData.money = val * _this.goodsInfo.productPrice;
				_this.cartData.num = val;
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	.address {
		padding: $paddingTop $padding $paddingTop + 10px;
		padding-left: $padding + 30px;
		padding-right: $padding + 20px;
		line-height: 1.75;
    background: #fff url("~assets/img/shop-cart/location-bg.png") repeat-x;
		background-position: bottom;


		&.active {
		}

		.address-msg {
			font-size: 16px;
			display: flex;
			color: $fontColorBlack;
			
			p {
				flex: 1;
				@include ellipsisOne();
			}

			span {
				width: 7em;
				text-align: right;
				display: block;
			}
		}

		.address-detail {
			position: relative;
			text-align: justify;

			.fa {
				position: absolute;
				top: 50%;
				margin-top: -.75em;
				line-height: 1.5;
				font-size: 18px;
			}

			.address-icon {
				position: absolute;
				top: 50%;
				left: -20px;
				width: 15px;
				height: 20px;
				margin-top: -10px;
				background: url("~assets/img/shop-cart/location.png") center no-repeat;
				background-size: 100%;
				display: block;
			}

			.angle-icon {
				right: -20px;
			}
		}
	}

	.order-add-address {
		background: $colorOrange;
		color: #fff;

		&:not(.weui-btn_disabled):active {
			color: #fff;
			background: $colorOrange;
		}
	}

</style>