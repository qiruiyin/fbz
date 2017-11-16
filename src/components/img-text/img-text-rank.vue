<!-- 
	视频和音频 排行榜图文混排
 -->

<template>
	<div class="img-text img-text-rank" @click="goPage(imgTextData.url, imgTextData.query)" v-cloak>
		<div v-if="imgTextData.img" :class="['img-text-img', imgTextData.query.type]">
			<img class="img" :src="imgTextData.img" alt="">
		</div>
		
		<div class="text">
			<h5 :class="['title', {'text-left': isDownload }]">{{ imgTextData.title }}</h5>
			<p class="type">{{ imgTextData.type }}</p>
			
			<p v-if="imgTextData.like.num || imgTextData.like.num == 0">
				<rater v-model="raterNum" :margin="0" slot="value" :max="5" :font-size="15" active-color="#04BE02" disabled></rater>
				（{{ imgTextData.like.num }}）
			</p>
			<p v-if="imgTextData.download || imgTextData.download == 0">下载次数：{{ imgTextData.download }}</p>

			<div v-if="fromRank && imgTextData.pay > 0 && imgTextData.isBuy == 0" class="price-rank" @click.stop="download(imgTextData)">
				<div class="original-price">原价：￥{{ imgTextData.originalPrice }}</div><span>￥</span>{{ imgTextData.pay }}
			</div>
			
			<template v-if="imgTextBtn != -1">
				<template v-if="isDownload">
					<a @click.stop="downloadFile" v-if="isClick" :href="imgTextData.downloadUrl" class="btn">{{ btns[imgTextBtn].name }}</a>
					<div class="btn btn-integral" v-else @click.stop="download(imgTextData)">{{ imgTextData.pay }}积分</div>
					<a ref="downloadFile" v-show="false" :href="imgTextData.downloadUrl" class="btn">{{ btns[imgTextBtn].name }}</a>
				</template>

				<template v-else>
					<div v-if="isClick" class="btn">{{ btns[imgTextBtn].name }}</div>
					<div class="btn" v-else @click.stop="download(imgTextData)">￥{{ imgTextData.pay | numToCash }}</div>
				</template>
			</template>
		</div>

		<div v-transfer-dom>
			<popup v-model="payShow" position="bottom">
	      <div class="pay">
					<form-preview header-label="付款金额" :header-value="pay.allPrice" :body-items="pay.list"></form-preview>	
	      	
	      	<div class="pay-btn">
						<x-button type="primary" :class="{'disabled': !user.pay}" @click.native="payOrder">支付</x-button>
	      	</div>
	    	</div>
	    </popup>
    </div>
	</div>
</template>

<script type="text/babel">
	import { Rater, TransferDom, XButton, FormPreview, Popup } from 'vux'
  import { mapState } from 'vuex'

	export default {
		name: "imgTextRank",
		components: { Rater, XButton, FormPreview, Popup },
		directives: {
	    TransferDom
	  },
		props: ['imgTextData', 'imgTextBtn', 'isDownload', 'imgTextInd', 'fromRank'],
		data () {
			return {
				list: {
					title: '',
					type: '',
					pay: '',
					isBuy: 0,
					img: '',
					like: {
						num: 0,
						percent: 0
					},
					url: '',
					query: {}
				},
				btnStatus: {
					order: false,
					pay: false
				},
				btns: [
					{
						link: '',
						name: '播放'
					},{
						link: '',
						name: '下载'
					}
				],
				payShow: false,
				pay: {
					show: false,
					allPrice: 0,
					list: [
						{
			        label: '订单号',
			        value: ''
			      }, {
			        label: '名称',
			        value: ''
			      }, {
			        label: '数量',
			        value: ''
			      }
			    ]
				},
				payCode: '',
				raterNum: 5,
				// raterNum: this.imgTextData.like && this.imgTextData.like.percent ? this.imgTextData.like && this.imgTextData.like.percent : 5
			}
		},
		computed: {
			...mapState({
        user: state => state.user,
        loadbar: state => state.loadbar
      }),
			isClick () {
				if(this.imgTextData.pay == 0) {
					return true
				} else if (this.imgTextData.isBuy > 0) {
					return true
				} else {
					return false
				}
			}
		},
		watch: {
			payShow (newValue, oldValue) {
				this.$emit("on-pay-show", newValue);
			}
		},
		mounted () {
		},
		methods: {
			goPage (url, query) {
				// 1、没有url 不跳转
				// 2、没有btn （课程）判断是否购买过，判断是否绑定，判断是否
				// 3、没有购买
				let _this = this;
				if(!url) {
					return false
				}

				_this.$router.push({name: url, query: query });
			},
			download (val) {
				if(this.imgTextData.pay != 0 && !this.isLogin())
					return false;
				let _this = this;
				_this.payCode = val.query.code;
				if(_this.isDownload) {
					_this.$vux.confirm.show({
						content: "需要积分：" + val.pay,
				    onConfirm () {
							_this.$store.commit('updateLoadingStatus', {isLoading: true});
				      _this.$http.post('/wechat/coursewaremobile/buy',
								{
									"customerCode": _this.$store.state.user.userCode,
									"productCode": val.query.code
								}).then(function(e) {
									_this.$store.commit('updateLoadingStatus', {isLoading: false});
									let responseData = e.data.data;
									if(e.data.code == 200) {
										if(e.data.data.result.buy == 1) {
											_this.$emit('on-data-change', _this.imgTextData, 'download', _this.imgTextInd);
			 								_this.$refs.downloadFile.click()
										} if(e.data.data.result.tag == 1) {
											_this.$vux.alert.show({
												content: e.data.data.result.msg,
												onHide () {
													_this.$emit('on-data-change', _this.imgTextData, 'download', _this.imgTextInd);
			 										_this.$refs.downloadFile.click()
												}
											})
										} else {
											_this.$vux.alert.show({
												content: responseData.result.msg
											});	
										}
									} else {
										_this.$vux.alert.show({
											content: e.data.msg
										});
									}
								})
						}
			    })
				} else {
					let _this = this;
					_this.$http.post('/api/product/online/order/confirm',
						_this.qs.stringify({
							productId: _this.imgTextData.query.id,
							customerId: _this.$store.state.user.userId,
							type: 2, 
							voucherStatus: 0,
							num: 1
						})).then(function(e) {
							if(e.data.code == 200) {
								_this.$router.push({name: 'confirmOrder', query: { orderId: e.data.data.orderId, orderType: 2, type: e.data.data.type }});
							} else {
								_this.$vux.alert.show({
									content: e.data.msg
								});
							}
						})
					// this.orderCreate({
					// 	"userCode": _this.$store.state.user.userCode, // 用户code
					// 	"productCode": val.query.code, // 商品code
					// 	"amount": "1", // 数量
					// 	"lessonCode": "", // 购买课程code
					// 	"orderType": "2", // orderType:1课程2音视频3奖赏4商城
					// 	"address": "", // 商城订单收货地址
					// 	"voucherAmount": "0", // 使用课程券的金额,默认传0
					// 	"allMoney": val.pay // 应付金额
					// });
				}
			},
			downloadFile (status) {
				let _this = this;
				_this.$http.post('/api/product/online/order/confirm',
					_this.qs.stringify({
						productId: _this.imgTextData.query.id,
						customerId: _this.$store.state.user.userId
					})).then(function(e) {
						if(e.data.code == 200) {

						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							});
						}
						// _this.$emit('on-data-change', _this.imgTextData, 'download', _this.imgTextInd);
						// window.location = _this.imgTextData.downloadUrl;
					})
			},
			payOrder () {
	    	let _this = this;

				if(!this.user.pay) return false;
				if(!this.loadbar.isLoading) {
					_this.$store.commit('updateLoadingStatus', {isLoading: true});
					_this.payShow = false;
					// this.payWeixinOrder(_this.pay.list[0].value);
				}
			}
		}
	}
</script>


<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	// @import '~assets/css/img-text';

	.pay-btn {
		padding: $padding;

		.disabled {
			background: $disabledPay;
		}
	}
	
	.price-rank {
		position: relative;
		float: right;
		text-align: right;
		color: $colorRed;
		font-size: 16px;

		.original-price {
			color: $fontColorGray;
			text-decoration: line-through;
			padding-right: .5em;
			display: inline-block;
		}

		span {
			float: none;
			// position: absolute;
			// bottom: 0px;
			// left: -1em;
			font-size: 14px;
			color: $colorRed;
		}
	}	
</style>