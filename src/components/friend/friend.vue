<!-- 
	我的好友
 -->

<template>
	<div class="friend">
		<group>
			<swipeout>
				<swipeout-item v-show="item.value" @on-close="swipeoutClose(item, index)" @on-open="swipeoutOpen(item, index)" :ref="'swipeout' + index" v-for="(item, index) in friendData" :key="index" transition-mode="follow">
	        <div slot="right-menu">
	          <!-- <swipeout-button @click.native="editFriend" type="primary">编辑</swipeout-button> -->
	          <swipeout-button @click.native="deleteFriend(item)" type="warn">删除</swipeout-button>
	        </div>
	        <div slot="content" class="friend-block">
						<div @click="friendBtn(item, index)" class="friend-btn fa fa-minus"></div>
						<div class="friend-block-info">
							<p>
								<span>{{ item.name }}</span>
								<label>{{ item.tel }}</label>
							</p>
							<p>{{ item.idCard }}</p>
						</div>
					</div>
	      </swipeout-item>
			</swipeout>
			<div class="add-btn">添加报名人员
				<div @click="addFriend" class="add-btn-click fa fa-plus"></div>
			</div>
		</group>

		<div v-transfer-dom>
			<popup v-model="friendPopup.status" @on-hide="hidePopup" is-transparent>
				<div class="friend-popup">
					<div class="friend-popup-btn">
						<!-- <div class="friend-popup-cancel">取消</div> -->
						<div class="friend-popup-sure" @click="friendPopupSure">确定</div>
					</div>

					<scroller lock-x :height="scrollerInfo.height + 'px'" @on-scroll-bottom="loadMore" ref="scrollerBottom" :scroll-bottom-offst="200">
						<div class="friend-btn-add">
							<x-button @click.native="friendAdd" mini>新增</x-button>
						</div>
		        <div class="friend-block" v-for="(item, index) in friendData" :key="index">
							<div @click="popuopFriendBtn(item)" class="friend-btn fa fa-edit"></div>
							<div class="friend-block-info">
								<p>
									<span>{{ item.name }}</span>
									<label>{{ item.tel }}</label>
								</p>
								<p>{{ item.idCard }}</p>
							</div>
							
							<check-icon class="friend-check" :value.sync="item.value"></check-icon>
						</div>
					</scroller>
				</div>
      </popup>
		</div>
	</div>
</template>

<script type="text/babel">
	import {  Scroller, Group, Cell, CheckIcon, Swipeout, SwipeoutItem, SwipeoutButton, XInput, XButton, FormPreview, Popup, TransferDomDirective as TransferDom } from 'vux'

	export default {
		name: "elFriend",
		directives: {
	    TransferDom
	  },
		components: {
			Scroller, Group, Cell, CheckIcon, Swipeout, SwipeoutItem, SwipeoutButton,
			XInput, XButton, FormPreview, Popup			
		},
		// props: ['value'],
		data () {
			return {
				title: "我的好友",
				scrollerInfo: {
					height: 300,
					offsetBottom: 160,
					onFetching: false,
					loadAll: false,
					pageNum: 1,
					pageSize: this.wordBook.pageSize,
					list: []
				},
				friendData: [],
				friend: [
					// {
					// 	value: false,
					// 	name: "戚瑞印1戚瑞印1戚瑞印1戚瑞印1戚瑞印1戚瑞印1戚瑞印1戚瑞印1戚瑞印1",
					// 	idCard: "372923199204054415",
					// 	tel: "15021417505",
					// 	showBtn: false
					// }
				],
				friendPopupStatus: true,
				friendPopup: {
					status: false
				}
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
	  		_this.$http.post('/api/userInfo/friendList',
	  			_this.qs.stringify({
	  				customerId: _this.$store.state.user.userId,
	  				pageSize: _this.scrollerInfo.pageSize,
	  				pageNum: _this.scrollerInfo.pageNum
	  			})).then(function(e) {
	  				if(e.data.code == 200) {
	  					let list = [];

							if(e.data.data.result && e.data.data.result.length > 0) {
								list = e.data.data.result.map(function(item, index){
									return {
										friendId: item.friendId,
										idcard: item.idcard,
										mobile: item.mobile,
										name: item.name,
										value: false,
										showBtn: false
									}
								})
							}

							if(list.length < _this.scrollerInfo.pageSize) {
								_this.scrollerInfo.loadAll = true;
							}

							if(_this.scrollerInfo.pageNum == 1) {
								_this.friendData = list;
							} else {
								_this.friendData = _this.friendData.concat(list);
							}

							_this.scrollerInfo.pageNum++;
							_this.resetView();
							_this.scrollerInfo.onFetching = false;	
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
	  		});
			},
			resetView () {
				// let _this = this;
				// this.$nextTick(() => {
    //       this.$refs.scrollerBottom.reset()
    //     })
			},
			loadMore () {
				if(this.scrollerInfo.onFetching || this.scrollerInfo.loadAll) {

				} else {
	        this.scrollerInfo.onFetching = true;
					this.fetchAgency()
				}
			},
			addFriend () {
				this.friendPopup.status = true;
			},
			deleteFriend (obj) {
				obj.value = false;
			},
			friendBtn (obj, ind) {
				obj.showBtn = !obj.showBtn;
				if(obj.showBtn) {
					this.$refs['swipeout'+ind][0].open('right')
				} else {
					this.$refs['swipeout'+ind][0].close()
				}
			},
			popuopFriendBtn (obj) {
				this.$router.push({ name: "friendEdit", query: { code: obj.code }})
			},
			swipeoutClose (obj, ind) {
				this.friend.map(function(item){
					item.showBtn = false;
				})
			},
			swipeoutOpen (obj, ind) {
				obj.showBtn = true;
			},
			friendPopupSure () {
				this.friendPopup.status = false;
			},
			friendAdd () {
				this.$router.push({ name: 'friendAdd' })
			},
			hidePopup () {
				let list = [];

				if(this.friendData.length > 0) {
					list = this.friendData.filter(function(item, index){
						return item.value
					})
				}
				this.$emit("on-hide-popup", list);
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	$addBtnW: 30px;
	$addBorderColor: #f3f3f3;
	
	$friendBtnW: 30px;
	$friendCheckW: 23px;

	.add-btn {
		position: relative;
		width: 100%;
		line-height: $inputH + 7px;
		padding: 0 $padding;
		background: #fff;
	}

	.add-btn-click {
		position: absolute;
		top: 50%;
		right: $padding;
		width: $addBtnW;
		height: $addBtnW;
		margin-top: - $addBtnW/2;
		line-height: $addBtnW + 2px;
		text-align: center;
		border-radius: $addBtnW;
		background: $colorYellowEasy;
		color: #fff;
		font-size: $addBtnW - 8px;

		&.delete {
			background: $colorRed;
		}
	}
	
	.friend-block {
		@include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
		padding: 5px $padding + $friendCheckW 5px $padding + $friendBtnW;
		display: flex;

		&.active {
			.friend-btn {
				transform: rotate(-90deg);
			}
		}
	}

	.friend-btn {
		position: absolute;
		top: 0;
		left: 0;
		width: 40px;
		height: 100%;
		color: red;
		transition: 300ms;
		display: flex;
		align-items: center;
		text-align: center;

		&:before {
			margin: 0 auto;
		}
	}

	.friend-btn-add {
		width: 100%;
		padding: 0 $padding;
		line-height: $inputH;
		text-align: left;
	}

	.friend-block-info {
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
		}
	}

	.friend-check {
		position: absolute;
		top: 50%;
		right: $padding;
		margin-top: -$friendCheckW/2;
	}

	.friend-popup {
		padding-bottom: 40px;
		background: #fff;

		.friend-block {
			padding-top: $padding;
		}
	}

	.friend-popup-btn {
		@extend %clearfix; 
		padding: 0 $padding;
		line-height: $inputH;
		background: $fontColorBlack;
		color: #fff;

		& > div {
			float: left;
		}

		.friend-popup-sure {
			float: right;
		}
	}
</style>