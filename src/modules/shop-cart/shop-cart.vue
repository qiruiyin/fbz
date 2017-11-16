<!-- 
	购物车
 -->
<template>
	<div class="shop-cart" v-cloak>
		<div class="shop-cart-title">购物车（{{ cart.num }}）</div>
		<swipeout>
      <swipeout-item v-for="(item, index) in cartDatas" :key="index" transition-mode="follow">
        <div slot="right-menu">
          <swipeout-button @click.native="deleteCart(item, index)" type="warn">删除</swipeout-button>
        </div>

        <imgTextCart slot="content" :ref="'imgText'+index" v-show="item.show" @on-number-change="onNumberChange" :img-text-data="item" :img-text-index="index" @on-check="onCheck"></imgTextCart>
      </swipeout-item>
    </swipeout>
		
		<div v-transfer-dom>
			<div class="submit-order">
				<div class="submit-order-info">
					<div @click="selectAll(2)" class="check-all">
						<check-icon @click.native.stop="selectAll(1)" :value.sync="checkedAll"></check-icon>{{ checkedAll ? "取消" : "" }}全选
					</div>
				</div>
				<div @click="submitOrder" class="submit-order-btn">结算：￥{{ allMoney | numToCash }}</div>
			</div>
		</div>
	</div>
</template>

<script type="text/babel">
	import { Cell, Group, XButton, Swipeout, SwipeoutItem, SwipeoutButton, CheckIcon, TransferDom } from 'vux'
  import { mapState } from 'vuex'
	import imgTextCart from 'components/img-text/img-text-cart'

	export default {
		name: "shopCart",
		directives: {
	    TransferDom
	  },
		components: {
			Cell, Group, XButton, Swipeout, SwipeoutItem, SwipeoutButton, CheckIcon, imgTextCart
		},
		data () {
			return {
				cartDatas: [],
				checkedAll: false,
				allMoney: 0
			}
		},
		computed: {
			...mapState({
        cart: state => state.cart
      }),
			allPrice () {
				let data = 0;
				this.cartDatas.map(function(item, index){
					data += item.price * item.num;
				});
				return data.toFixed(2);
			}
		},
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData () {
				let _this = this;

				_this.$http.post('/wechat/shop/queryCart',
					{
						userCode: _this.$store.state.user.userCode,
					}).then(function(e) {
						let responseData = e.data, 
								money = 0;
						
						_this.$store.commit("updateCartNum", { num: e.data.data.number });
						
						if(responseData.code == 200) {
							_this.cartDatas = responseData.data.list.map(function(item, index){
							  money += item.price*item.shop_count;

								return {
									imgPath: _this.resolveImg(item.thumbnail),
									title: item.name,
									price: item.price,
									num: item.shop_count,
									code: item.code,
									check: true,
									hasCheck: true,
									show: true
								}
							})

							_this.allMoney = money;
						}
				});
			},
			deleteCart (obj, ind = -1) {
				let _this = this;
				if(ind > -1 && !_this.$store.state.loadbar.isLoading) {
					_this.$store.commit('updateLoadingStatus', {isLoading: true});
					_this.$http.post('/wechat/shop/delCart',
						{
							userCode: _this.$store.state.user.userCode,
							productCode: obj.code
						}).then(function(e) {
							_this.$store.commit('updateLoadingStatus', {isLoading: false});	
							if(e.data.code == 200) {
								_this.cartDatas[ind].show = false;
								_this.$store.commit("updateCartNum", { num: _this.$store.state.cart.num - obj.num });
								_this.onNumberChange();
							} else {
								_this.$vux.alert.show({
									content: e.data.msg
								})
							}
					});
				}
			},
			deleteAll () {
				let _this = this;
				if(_this.cartDatas.length > 0) {
					this.cartDatas = [];
					_this.$http.post('/wechat/shop/emptyCart',
						{
							userCode: _this.$store.state.user.userCode,
						}).then(function(e) {
			  			_this.$store.commit("updateCartNum", { num: 0 });
					});
				}
				_this.onNumberChange();
			},
			selectAll (ind) {
				let _this = this;
				if(ind != 1) _this.checkedAll = !_this.checkedAll;
				_this.cartDatas.map(function(item, index){
					item.check = _this.checkedAll;
				})
				_this.onNumberChange();
			},
			submitOrder () {
				let _this = this,
						payCartNum = 0, // 订单商品总数量
	    	 		productCode = "", // 商品code
	    	 		amount = 0, // 商品单价
	    	 		money = 0, // 订单总价
			    	cartDatas = _this.cartDatas.filter(function(item, index){
			    		if(item.check) {
			    			productCode += productCode == "" ? item.code : "," + item.code;
			    			amount += amount == "" ? item.num : "," + item.num;
			    			money += money == "" ? (item.price * item.num).toFixed(2): "," + (item.price * item.num).toFixed(2);
			    			payCartNum += item.num;
			    		}
		    			return item.check;
			    	});

	    	if(cartDatas.length > 0) {
					_this.$store.commit("updateLoadingStatus", { isLoading: true });

					this.$http.post('/wechat/order/create',
							{
								"userCode": _this.$store.state.user.userCode,
								"productCode": productCode,
								"amount": amount,
								"money": money,
								"allMoney": _this.allPrice,
								"orderType":  3,
								"lessonCode": "",
								"address": ""
							}
						).then(function(e) {
							_this.$store.commit("updateLoadingStatus", { isLoading: false });
							if(e.data.code == 200) {
								// 移除下了订单的产品
								cartDatas.map(function(item, index) {
									_this.deleteCart(item)
								});
								// 更新购物车数量
								_this.$store.commit("updateCartNum", { num: _this.$store.state.cart.num - payCartNum });

								_this.$router.push({name: 'confirmOrder', query: { "orderCode": e.data.data.order.code }});
							}
						});
	    	} else {
	    		_this.$vux.toast.show({
	    			text: "请至少选择一个商品"
	    		})
	    	}
			},
			onCheck (val) {
				let _this = this,
						data;
				if (val) {
					data = this.cartDatas.every(function(elem) {
						return elem.check == !elem.check
					})
					if (data) this.checkAll = true
				} else {
					this.checkAll = false
				}
				_this.onNumberChange();
			},
			onNumberChange (imgCart) {
				let _this = this,
						num = 0;
				if(imgCart) {
					_this.cartDatas[imgCart.ind].num = imgCart.num;				
				}
				_this.cartDatas.map(function(item, index){
					let obj = _this.$refs['imgText' + index][0];
					if(obj.imgTextData.check && item.show) {
						num += obj.cartNum * obj.imgTextData.price;
					}
					// num += item.
				})
				_this.allMoney = num;
			}
		}
	}
</script>

<style lang="scss">
	@import '~lib/sandal/core';
	@import '~assets/css/core/vars', '~assets/css/core/functions';
	
	$imgTextPadding: $paddingTop;

	.shop-cart {
		.vux-swipeout-item {
			border-top: $imgTextPadding solid $borderColor;
			
			&:first-child {
				border-top: 0;
			}
		}
	}
</style>


<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/vars', '~assets/css/core/functions';
	
	.shop-cart {

	}

	.shop-cart-title {
		width: 100%;
		height: $inputH;
		line-height: $inputH;
		text-align: center;
		color: #fff;
		font-size: 18px;
		background-color: $colorOrange;
	}

	.submit-order {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: $cartBg;
		font-size: $cartBtnFontSize;
		display: flex;
	}

	.submit-order-info {
		flex: 1;
		color: $cartColor;
		display: flex;
  	align-items: center;
  	padding-left: $padding;
	}

	.submit-order-btn {
		width: 10em;
		line-height: $cartH;
		color: #fff;
		text-align: center;
		background-color: $colorOrange;
	}
</style>