<!-- 
	我的好友
 -->

<template>
	<div class="friend" v-cloak>
		<scroller lock-x :height="-scrollerInfo.offsetBottom + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offst="200">
			<div class="btns">
				<x-button type="primary" @click.native="addFriend">新增好友</x-button>
			</div>

			<swipeout v-show="friendDatasLength" class="swiper">
	      <swipeout-item transition-mode="follow" v-for="(item, index) in scrollerInfo.list" :key="index">
	        <div slot="right-menu">
	          <swipeout-button type="primary" @click.native="editClick(item, index)">编辑</swipeout-button>
	          <swipeout-button type="warn" @click.native="deleteClick(item, index)">删除</swipeout-button>
	        </div>
					<div slot="content" class="friend-block-info">
						<p>
							<span>{{ item.name }}</span>
							<label>{{ item.mobile }}</label>
						</p>
						<p>{{ item.idcard }}</p>
					</div>
	      </swipeout-item>
	    </swipeout>
		</scroller>
	</div>
</template>

<script type="text/babel">
	import { Scroller, Radio, Group , XButton, Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'

	export default {
		name: "friend",
		components: { Scroller, Radio, Group, XButton, Swipeout, SwipeoutItem, SwipeoutButton },
		data () {
			return {
				// 来自订单的传参
				orderCode: this.$route.query.orderCode || "",
				scrollerInfo: {
					offsetBottom: 60,
					onFetching: false,
					loadAll: false,
					pageNum: 1,
					pageSize: this.wordBook.pageSize,
					list: []
				},
				friendDatas: [
					// {
					// 	friend: "",
					// 	name: "",
					// 	phone: "",
					// 	code: "",
					// 	state: ""
					// }
				]
			}
		},
		computed: {
			friendDatasLength () {
				return this.scrollerInfo.list.length > 0
			}
		},
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData () {
				let _this = this;
				if(this.scrollerInfo.onFetching) return;
				this.scrollerInfo.onFetching = true;			
				this.$http.post('/api/userInfo/friendList',
					this.qs.stringify({
	  				customerId: _this.$store.state.user.userId,
	  				pageSize: _this.scrollerInfo.pageSize,
	  				pageNum: _this.scrollerInfo.pageNum
	  			})).then(function(e) {
						if(e.data.code == 200){
							let list = [];

							if(e.data.data.result && e.data.data.result.length > 0) {
								list = e.data.data.result.map(function(item, index){
									return {
										friendId: item.friendId,
										idcard: item.idcard,
										mobile: item.mobile,
										name: item.name,
									}
								})
							}

							if(list.length < _this.scrollerInfo.pageSize) {
								_this.scrollerInfo.loadAll = true;
							}

							if(_this.scrollerInfo.pageNum == 1) {
								_this.scrollerInfo.list = list;
							} else {
								_this.scrollerInfo.list = _this.scrollerInfo.list.concat(list);
							}

							_this.scrollerInfo.pageNum++;
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}

						_this.resetView();
						_this.scrollerInfo.onFetching = false;			
					})
			},
			resetView () {
				let _this = this;
				this.$nextTick(() => {
          this.$refs.scrollerBottom.reset()
        })
			},
			loadMore () {
				if(this.scrollerInfo.onFetching || this.scrollerInfo.loadAll) {

				} else {
	        this.scrollerInfo.onFetching = true;
					this.fetchAgency()
				}
			},
			editClick (data) {
				this.$router.push({name: "friendEdit", query: { friendId: data.friendId, orderCode: this.orderCode }})
			},
			deleteClick (data, ind) {
				let _this = this;

				_this.$store.commit('updateLoadingStatus', {isLoading: true});
				_this.$http.post('/api/userInfo/deleteFriend',
					this.qs.stringify({
	  				friendId: data.friendId
	  			})).then(function(e) {
  					_this.$store.commit('updateLoadingStatus', {isLoading: false});
	  				if(e.data.code == 200) {
	  					_this.scrollerInfo.list.splice(ind,1)
	  				}
	  				_this.$vux.alert.show({
		          content: e.data.msg
		        })
	  		});
			},
			addFriend () {
  			this.$router.push({ name: "friendAdd" });
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	.friend {
		padding-top: $padding;
	}
	
	.swiper {
		@include halfpxline(0, $borderColor, 1px, 0, 0, 0);
		margin-bottom: 40px;
	}
	
	.block {
		@include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
		padding: $padding;
	}
	
	.btns {
		padding: $padding;
	}

	.friend-block-info {
		@include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
		padding: 6px $padding;
		line-height: 1.5;
		color: $fontColorBlack;
		flex: 1;

		span {
			float: left;
			@include ellipsisMore(1);
	    margin-right: 1em;
		}

		label {
			width: 11em;
			color: $fontColor;
			font-size: 12px;
			text-indent: 1em;
		}
	}
</style>
