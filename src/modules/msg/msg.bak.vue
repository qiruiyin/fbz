<!-- 
	消息页面
 -->

<template>
	<div class="msg" v-cloak>
		<swipeout class="vux-1px-tb">
      <swipeout-item transition-mode="follow" v-for="(item, index) in msgDatas" :key="item.date">
      	<div slot="left-menu">
          <swipeout-button @click.native="btnDelete(item.code, index)" type="warn">删除</swipeout-button>
        </div>
        <div slot="right-menu">
          <swipeout-button @click.native="btnDelete(item.code, index)" type="warn">删除</swipeout-button>
        </div>
      	
      	<div slot="content" class="msg-simple vux-1px-t">
        <!-- 客户消息 -->
        	<template  v-if="item.status == 1">
						<main v-show="item.show" @click="btnReply(item.code, item.openId,item.sendUserName)">
							<div class="title">来自{{ item.sendUserName }}的短消息</div>
							<div class="desc">详情：{{ item.content }}</div>
							<div class="time">时间：{{ item.time }}</div>
							<div class="reply fa fa-mail-reply"></div>
						</main>  	 
	        </template>
        	<!-- 系统消息 -->
        	<template v-else>
						<main>
							<div class="title">来自系统的短消息</div>
							<div class="desc">详情：{{ item.content }}</div>
							<div class="time">时间：{{ item.time }}</div>
							<div class="reply fa fa-mail-reply"></div>
						</main>
						<footer v-if="item.url">
							<router-link :to="{ name: item.url }">
								{{ item.urlMsg }}
							</router-link>
						</footer>  	 
        	</template>
        </div>
        
      </swipeout-item>
    </swipeout>
	</div>
</template>

<script type="text/babel">
import hold from 'src/commons/hold'
	import { GroupTitle, Swipeout, SwipeoutItem, SwipeoutButton, XButton, Toast } from 'vux'

	export default {
		name: 'msg',
		components: {
			GroupTitle, Swipeout, SwipeoutItem, SwipeoutButton, XButton, Toast
		},
		data () {
			return {
				title: '消息',
				msgDatas: []
			}
		},
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData () {
				let _this = this;
				
				this.$http.post('/wechat/message/index',
						{
							"openId": _this.$store.state.user.openId,
							"lessonCode": "",
							"pageNum": 1,
							"pageSize": 10
						}
					).then(function(e) {
						// messageType: 0系统消息,1客户消息
						let responseData = e.data;
						if(responseData.code == 200) {
							// 标题：来自某某的短消息
							// 内容
							// 时间
							if(responseData.data.messageList) {
								_this.msgDatas = responseData.data.messageList.map(function(item, index){
									return {
										status: 1,
										show: true,
										openId: item.sendUser,
										content: item.content,
										time: item.createTime,
										code: item.messageCode,
										sendUserName: item.sendUserName,
										sendUserCode: item.sendCode,
										url: '',
										urlMsg: '',
									}
								})
							}
						}

					})
			},
			btnDelete (code, ind) {
				let _this = this;

				_this.msgDatas.map(function(item, index) {
      		if(index == ind) {
      			item.show = false
      		}
      	})

				this.$http.post('/wechat/message/deleteMessage',
						{
							"messageCode": code
						}
					).then(function(e) {
						if(e.data.code == 200) {
							_this.$vux.toast.show({
			          text: '删除成功',
			        })
						}
					})
			},
			btnReply (code, sendOpenId, sendUserName) {
				this.$store.commit("updateMsgName", { name: sendUserName });
				this.$store.commit("updateMsgOpenId", { openId: sendOpenId });
				this.$store.commit("updateMsgUrl", { url: 'msg' });
				this.$router.push({ name: 'msgAdd' })
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	$msgMargin: $padding;

	.msg {
    min-height: 100%;
		padding: $msgMargin 0 0;
		background: $bgGray;
	}

	.msg-simple {
		margin-bottom: $msgMargin;
		background-color: #fff;
	}

	header	{
		line-height: 40px;
		@include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
		text-align: center;
	}

	main {
		padding: $padding;
		line-height: 1.75;
		text-align: left;
	}

	.title {
		color: $fontColorBlack;
		font-size: 18px;
	}

	footer {
		padding: 0 $padding $padding;
	}

	.reply {
		position: absolute;
		top: $padding;
		right: $padding;
	}
</style>