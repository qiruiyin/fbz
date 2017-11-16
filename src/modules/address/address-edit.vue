<!-- 
	地址修改
 -->

<template>
	<div class="address-add" v-cloak>
		<group>
      <!-- <x-address title="地址" v-model="address" :list="addressData" placeholder="请选择地址"></x-address> -->
      <selector title="省" placeholder="请选择省份" :options="province.list" v-model="province.value" @on-change="provinceChange"></selector>
      <selector title="市" placeholder="请选择城市" :options="city.list" v-model="city.value" @on-change="cityChange"></selector>
      <selector title="区" placeholder="请选择区县" :options="county.list" v-model="county.value"></selector>
      <x-input title="具体地址" placeholder="请输入具体地址" v-model="addressDetail"></x-input>
      <x-input title="姓名" placeholder="请输入姓名" v-model="name"></x-input>
      <x-input title="联系电话" placeholder="请输入联系电话" type="tel" v-model="tel"></x-input>
    	<div class="check">
    		<check-icon :value.sync="checkAddress">是否默认</check-icon>
    	</div>
    </group>
		
		<div class="btn">
    	<x-button type="primary" @click.native="submit">确定</x-button>
		</div>
	</div>
</template>

<script type="text/babel">
	import { Group, Cell, Selector, CheckIcon, XInput, XButton, XAddress, ChinaAddressV3Data  } from 'vux'
	
	export default {
		name: "address-add",
		components: {
			Group, Cell, Selector, CheckIcon, XInput, XButton, XAddress, ChinaAddressV3Data 
		},
		data () {
			return {
				// orderCode: this.$route.query.orderCode || "",
	      addressData: ChinaAddressV3Data,
	      address: [],
	      province: {
	      	value: '',
	      	list: []
	      },
	      city: {
	      	value: '',
	      	list: []
	      },
	      county: {
	      	value: '',
	      	list: []
	      },
	      addressDetail: '',
	      name: '',
	      tel: '',
	      checkAddress: true,
	      responseData: {
	      	id: "",
	      	code: ""
	      },
	      huancun: { // selector级联 辅助使用，status标明是否使用过
	      	city: {
	      		value: "",
	      		status: false
	      	},
	      	county: {
	      		value: "",
	      		status: false
	      	},
	      }
			}
		},
		mounted () {
			// 获取省信息列表
			// this.fetchData();
			let _this = this;
  		_this.$http.post('/api/userInfo/areaInfo',
  			_this.qs.stringify({
	  			areaId: ''
  			})).then(function(e) {
					let res = e.data.data;

					if(res.length > 0) {
						_this.province.list = res.map(function(item, index){
							return {
								key: item.areaId,
								value: item.name
							}
						});
					} else {
						_this.province.list = [];								
					}
					_this.fetchData();
  			});
		},
		methods: {
			fetchData () {
				let _this = this;
	  		_this.$http.post('/api/userInfo/getCustomerAddressInfo',
	  			_this.qs.stringify({
	  				addressId: _this.$route.query.addressId
	  			})).then(function(e) {
	  				if(e.data.code == 200) {
	  					let responseData = e.data.data;
							_this.addressDetail = responseData.receiverAddress;
							_this.name = responseData.receiverName;
							_this.tel = responseData.receiverPhone;
							_this.province.value = responseData.provinceId;
							_this.huancun.city.value = responseData.cityId;
							_this.huancun.county.value = responseData.areaId;
							_this.checkAddress = responseData.defaultAddress == 1 ? true : false;
	  				} else {
	  					_this.$vux.alert.show({
		         	 content: e.data.msg
		       		})
	  				}
	  		});
			},
			getAddressInfo (areaId, type, obj) {
				// type： 1为省，2为市，3为区
				// areaId: 父节点值
				let _this = this;
	  		_this.$http.post('/api/userInfo/areaInfo',
	  			_this.qs.stringify({
		  			areaId: areaId
	  			})).then(function(e) {
						if(e.data.code == 200) {
							let res = e.data.data;

							if(res.length > 0) {
								_this[obj].list = res.map(function(item, index){
									return {
										key: item.areaId,
										value: item.name
									}
								});
							} else {
								_this[obj].list = [];								
							}

							if(type == 1) {
								_this.city.value = 0;
								_this.city.list = [];
								_this.county.value = 0;
								_this.county.list = []
							}						

							if(type == 2 && !_this.huancun.city.status) {
								_this.huancun.city.status = true;
								_this.city.value = _this.huancun.city.value;
							} else if (type == 3 && !_this.huancun.county.status) {
								_this.huancun.county.status = true;
								_this.county.value = _this.huancun.county.value;
							}
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
	  		});
			},
			provinceChange (val) {
	      this.getAddressInfo(val, 2, "city")
	    },
			cityChange (val) {
	      this.getAddressInfo(val, 3, "county")
	    },
	    submit() {
	    	let _this = this;
	    	if(_this.province.value == "") {
    		  _this.$vux.toast.show({
	          text: '请选择省份'
	        })
	    	} else if(_this.city.value == "") {
    		  _this.$vux.toast.show({
	          text: '请选择城市'
	        })
	    	} else if(_this.county.value == "") {
    		  _this.$vux.toast.show({
	          text: '请选择区县'
	        })
	    	} else if (_this.addressDetail == "") {
	    		_this.$vux.toast.show({
	          text: '请输入具体地址'
	        })
	    	} else if (_this.name == "") {
	    		_this.$vux.toast.show({
	          text: '请输入姓名'
	        })
	    	} else if (_this.tel == "") {
	    		_this.$vux.toast.show({
	          text: '请输入联系电话'
	        })
	    	} else {
		  		_this.$store.commit('updateLoadingStatus', {isLoading: true});
		  		_this.$http.post('/api/userInfo/addCustomerAddress',
	  				_this.qs.stringify({
	  					addressId: _this.$route.query.addressId,
	  					customerId: _this.$store.state.user.userId,
			  			receiverName: _this.name,
			  			receiverPhone: _this.tel,
			  			receiverProvince: _this.province.value,
			  			receiverCity: _this.city.value,
			  			receiverArea: _this.county.value,
			  			receiverAddress: _this.addressDetail,
			  			defaultAddress: _this.checkAddress ? 1 : 0
		  			})).then(function(e) {
							_this.$store.commit('updateLoadingStatus', {isLoading: false});
							if(e.data.code == 200) {
								_this.$router.go(-1);
								// _this.$router.push({ name: _this.$route.query.url, query: { orderCode: _this.orderCode } });
							} else {
								_this.$vux.alert.show({
				          content: e.data.msg
				        })
							}
		  		});
	    	}
	    }
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	.check {
		@include halfpxline(0, $borderColor, 1px, 0, 0, 0);
		padding: $padding;
	}

	.btn {
		margin-top: 40px;
		padding: $padding;
	}

</style>
