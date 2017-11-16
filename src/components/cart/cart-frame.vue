<!-- 
	购物车浮窗
 -->

<template>
	<div v-transfer-dom v-cloak>
		<div @click="goCart" class="cart-frame fa fa-shopping-cart">
			<span>{{ cartNum }}</span>
		</div>
	</div>
</template>

<script type="text/babel">
	import { TransferDom } from 'vux'
	import { mapState } from 'vuex'

	export default {
		name: "cartFrame",
		directives: {
	    TransferDom
	  },
		data () {
			return {
				title: "漂浮的购物车悬窗"
			}
		},
		computed: {
	    ...mapState({
	      cart: state => state.cart
	    }),
	    cartNum () {
	    	if(this.cart.num > 99) {
	    		return 99 + "+"
	    	} else if (this.cart.num == 0) {
	    		return ""
	    	}
	    	return this.cart.num
	    }
	  },
		mounted () {
			if(this.$store.state.user.userCode) this.fetchData();
		},
		methods: {
			fetchData () {
				let _this = this;
				this.$http.post('/wechat/shop/queryCart',
						{
							"userCode": _this.$store.state.user.userCode
						}
					).then(function(e) {
						if(e.data.code == 200) {
							_this.$store.commit("updateCartNum", { num: e.data.data.number });
						}
					});
			},
			goCart () {
				if(!this.isLogin()) return false;
				this.$router.push({name: "shopCart"});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	$cartH: 40px;

	.cart-frame {
		position: fixed;
		bottom: 100px;
		right: $padding;

		width: $cartH;
		height: $cartH;
		border-radius: $cartH;

		background: #FF5000;
		color: #fff;
		line-height: $cartH;
		text-align: center;
		font-size: 20px;

		span {
	    position: absolute;
		  top: 50%;
		  left: 50%;
		  height: 15px;
		  width: 15px;
		  line-height: 15px;
		  font-size: 12px;
		  color: #fff;
		  margin: -16px 0 0 6px;
		  background: yellow;
		  border-radius: 30px;
		  display: none;
		}
	}
	
</style>