<!-- 
	地址信息
 -->

<template>
	<div class="address" v-cloak>
		<swipeout v-show="addressDatasLength" class="swiper">
      <swipeout-item transition-mode="follow" v-for="(item, index) in addressDatas" :key="index">
        <div slot="right-menu">
          <swipeout-button type="primary" @click.native="editClick(item, index)">编辑</swipeout-button>
          <swipeout-button type="warn" @click.native="deleteClick(item, index)">删除</swipeout-button>
        </div>
        <div slot="content" @click="setCheck(item, index)" class="block">
       		<div class="block-address">{{ item.address }}</div>
					<div class="block-msg">{{ item.name }}{{ item.phone }}</div>

					<div v-if="item.state" class="checked"></div>
       	</div>
      </swipeout-item>
    </swipeout>

		<div class="btns">
			<x-button type="primary" @click.native="addAddress">新增地址</x-button>
		</div>
	</div>
</template>

<script type="text/babel">
	import { Radio, Group , XButton, Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'

	export default {
		name: "address",
		components: { Radio, Group, XButton, Swipeout, SwipeoutItem, SwipeoutButton },
		data () {
			return {
				// 来自订单的传参
				goodsId: this.$route.query.goodsId || "",
				addressDatas: [
					// {
					// 	address: "",
					// 	name: "",
					// 	phone: "",
					// 	code: "",
					// 	state: ""
					// }
				],
				addressState: -1
			}
		},
		computed: {
			addressDatasLength () {
				return this.addressDatas.length > 0
			}
		},
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData () {
				let _this = this;
	  		_this.$http.post('/api/userInfo/customerAddressList',
					this.qs.stringify({
	  				customerId: _this.$store.state.user.userId
	  			})).then(function(e) {
	  				if(e.data.code == 200) {
	  					let responseData = e.data.data;
							if(responseData.result.length > 0 ){
								_this.addressDatas = responseData.result.map(function(item, index){
									return {
										address: item.receiverAddress,
										name: item.receiverName,
										phone: item.receiverPhone,
										id: item.id,
										state: item.defaultAddress == 1
									}
								})
							}
	  				} else {
	  					_this.$vux.alert.show({
	  						content: e.data.msg
	  					})
	  				}
	  		});
			},
			setCheck (data, ind) {
				let _this = this;

				if(_this.goodsId) {

  				_this.$router.push({ name: _this.$route.query.url, query: { id: _this.$route.query.goodsId } });
				} else {
					_this.$http.post('/api/userInfo/setDefaultAddress',
						_this.qs.stringify({
							customerId: _this.$store.state.user.userId,
							addressId: data.id			
		  			})).then(function(e) {
		  				if(e.data.code == 200) {
		  					_this.addressState = ind
		  				}
		  				_this.$vux.toast.show({
			          text: e.data.msg
			        })
		  		});
				}
			},
			editClick (data) {
				this.$router.push({name: "addressEdit", query: { addressId: data.id }})
			},
			deleteClick (data, ind) {
				let _this = this;

				_this.$http.post('/api/userInfo/deleteAddress',
					this.qs.stringify({
	  				addressId: data.id
	  			})).then(function(e) {
	  				if(e.data.code == 200) {
	  					_this.addressDatas.splice(ind,1)
	  				}
	  				_this.$vux.alert.show({
		          content: e.data.msg
		        })
	  		});
			},
			addAddress () {
				this.$router.push({name: "addressAdd"});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	.address {
		padding-top: $padding;
	}
	
	.swiper {
		margin-bottom: 40px;
		@include halfpxline(0, $borderColor, 1px, 0, 0, 0);
	}
	
	.block {
		@include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
		padding: $padding;
	}

	.checked {
		position: absolute;
		right: $padding;
		top: 50%;
		width: 20px;
		height: 20px;
		margin-top: -10px;
		background: url("~assets/img/user-center/address-check.png") no-repeat;
		background-size: 100%;
		// line-height: 1;
		// margin-top: -12px;
		// font-size: 24px;
		// color: $colorGreen;
	}
	
	.btns {
		padding: $padding;
	}
</style>
