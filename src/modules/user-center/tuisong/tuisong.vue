<!-- 
	推送设置
 -->

<template>
	<div class="tuisong" v-cloak>
		<div class="tuisong-content">
			<group>
				<x-switch v-for="(item, index) in list" :key="index" :title="item.title" :inline-desc="item.memo" prevent-default v-model="item.flag" @on-change="onChange"></x-switch>
			</group>
		</div>
	</div>
</template>

<script type="text/babel">
	import { Group, XSwitch } from 'vux'
  import { mapState } from 'vuex'

	export default {
		name: 'tuisong',
		components: {
			Group, XSwitch
		},
		data () {
			return {
				title: '推送',
				value2: true,
				list: [
					// {
					// 	name: 'quoatation',
					// 	title: "经典语录推送",
					// 	memo: '每日订阅经典语录推送',
					// 	flag: true
					// }
				]
			}
		},
		computed: {
      ...mapState({
        user: state => state.user,
        loadbar: state => state.loadbar
      })
    },
    mounted () {
    	this.fetchData();
    },
    methods: {
    	fetchData () {
    		let _this = this;
    		_this.$http.post("/wechat/usercenter/getTags", {
					"openId":  _this.user.openId
				}).then(function(e) {
					if(e.data.code == 200) {
						if(e.data.data.list && e.data.data.list.length > 0) {
							_this.list = e.data.data.list.map(function(item, index){
								return {
									name: item.name,
									title: item.title,
									memo: item.memo,
									flag: item.flag == 0 ? false : true
								}
							})	
						}
					} else {
						_this.$vux.alert.show({
							content: e.data.msg
						})
					}
				})
    	},
    	onChange () {
    		let _this = this;
    		if(!_this.loadbar.isLoading) {
    			let flag = '',
    					name = '';

    			if(_this.list.length == 0) return false;
    			
					_this.$store.commit('updateLoadingStatus', {isLoading: true});

    			_this.list.map(function(item, index){
    				if(index > 0) {
    					flag += ';';
    					name += ';';
    				}
    				flag += item.flag ? "1" : "0";
    				name += item.name;
    			});

    			_this.$http.post("/wechat/usercenter/updateTags", {
						"openId":  _this.user.openId,
						"flag": flag,
						"name": name
					}).then(function(e) {
						if(e.data.code == 200) {
							_this.$store.commit('updateLoadingStatus', {isLoading: false});
							if(e.data.data.list && e.data.data.list.length > 0) {
								_this.list = e.data.data.list.map(function(item, index){
									return {
										name: item.name,
										title: item.title,
										memo: item.memo,
										flag: item.flag == 1 ? false : true
									}
								})	
							}
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
					})
    		}
    	}
    }
	}
</script>

<style lang="scss">
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	.tuisong-content {
		.vux-x-switch.weui-cell_switch {
			padding-top: 12px;
			padding-bottom: 10px;
			border-bottom: $uiMarginH solid $uiMarginBg;

			&:first-child {
				border-top: $uiMarginH solid $uiMarginBg;
			}
		}

		.weui-label {
			font-size: 16px;
			color: #000;
		}

		.vux-label-desc {
			font-size: 12px;
			color: #999
		}
	}
</style>