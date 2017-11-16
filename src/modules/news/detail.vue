<!-- 
	详情
 -->

<template>
	<div class="news-detail">
		<div class="news-detail-header">
			<h5>{{ news.title }}</h5>
			<div class="info">
				<span>{{ news.time }}</span>
				<span>{{ news.readCount }}人浏览</span>
			</div>
		</div>

		<div class="news-detail-content" v-html="resolveRichTextImg(news.content)"></div>
		
		<el-reward class="news-reward" :reward-data="news" @reward-done="refreshReward" ></el-reward>
		<el-reward-list @reward-done="refreshReward" :reward-info="rewardInfo" :reward-refresh-status="rewardRefreshStatus"></el-reward-list>
		
		<el-comment-bar :comment-data="news"></el-comment-bar>
	</div>
</template>

<script type="text/babel">
	import elCommentBar from 'components/comment/comment-bar'
	import elReward from 'components/reward/reward'
	import elRewardList from 'components/reward/reward-list'

	export default {
		name: "newsDetail",
		components: {
			elCommentBar, elReward, elRewardList
		},
		data () {
			return {
				title: "头条详情",
				news: {
					spareType: "1", // spareType打赏类型 0产品 1头条
					id: this.$route.query.id,
					content: "",
					time: "",
					readCount: "",
					img: "",
					title: ""
				},
				rewardRefreshStatus: false,
				rewardInfo: {
					spareType: 1,
					goodsId: this.$route.query.id,
				}
			}
		},
		mounted () {
			this.fetchData();
		},
		methods: {
			fetchData () {
				let _this = this;
				// _this.visitCount(_this.news.code, 1);
				_this.$http.post('/api/news/detail',
					_this.qs.stringify({
						customerId: _this.$store.state.user.userId,
						id: _this.news.id
					})).then(function(e) {
						if(e.data.code == 200) {
							let res = e.data.data;
							_this.news.title = res.title;
							_this.news.content = res.content;
							_this.news.time = res.updateTime || res.createTime;
							_this.news.readCount = res.readCount;
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
					})
			},
			refreshReward (val) {
				this.rewardRefreshStatus = val;
			}
		}
	}
</script>

<style lang="scss">
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	.news-detail-content {
		
		img {
			max-width: 100%;
		}
	}
</style>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	.news-detail {
		padding-bottom: 50px;
	}

	.news-detail-header {
		padding: $padding;

		h5 {
			line-height: 1.5;
			margin-bottom: $padding/2;
			font-size: 18px;
			color: $fontColorBlack;
		}

		.info {
			font-size: 12px;
			color: $fontColorGray;

			span {
				&:last-child {
					float: right;
				}
			}
		}
	}

	.news-detail-content {
		padding: 0 $padding*2;
		text-align: justify;
	}

	.news-reward {
		margin-bottom: $padding;
	}
</style>