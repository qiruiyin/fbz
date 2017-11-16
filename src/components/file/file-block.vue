<!-- 
	文件模块
 -->

<template>
	<div class="file-block">
		<h5>{{ fileData.name }}</h5>
		<div class="file-block-info">
			<span>下载积分：{{ fileData.price }}</span>
			<span>下载次数：{{ fileData.download }}</span>
		</div>
		<!-- <a ref="downloadFile" target="_blank" :href="downloadUrl" class="btn"></a> -->
		
		<div @click="download" :class="['download-btn', 'fa', 'fa-arrow-down', {'disable': isDownload}]"></div>
	</div>
</template>

<script type="text/babel">
	export default {
		name: "fileBlock",
		props: ['fileData'],
		data () {
			return {
				downloadUrl: "",
				data: {
					name: "公司股权融资计划书",
					price: 100,
					download: 20,
					isBuy: 1 // 0是未购买，1是购买
				}
			}
		},
		computed: {
			isDownload () {
				if(this.fileData.price == 0 || this.fileData.isBuy == 1) {
					return true;
				}

				return false;
			}
		},
		methods: {
			download () {
				let _this = this;
				if(this.isDownload) {
					_this.downloadFile();
				}	else {
					_this.$vux.confirm.show({
						content: "文件需要支付" + _this.fileData.price + "积分",
						onConfirm () {
							_this.downloadFile();
						},
						onCancel () {					
						}
					})
				}
			},
			downloadFile () {
				let _this = this;
				_this.$http.post('/api/index/material/download',
					_this.qs.stringify({
						customerId: _this.$store.state.user.userId,
						materialId: _this.fileData.id
					})).then(function(e) {
		  			if(e.data.code == 200) {
							_this.downloadUrl = e.data.data;
							// window.open(e.data.data)
							location.href = e.data.data;
							// _this.$refs.downloadFile.click();
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
	  			})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
  @import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	.file-block {
		position: relative;
		@include halfpxline(0, $borderColor, 0 , 0, 1px, 0);
		padding: 20px $padding;
		
		h5 {
			@include ellipsisMore(1);
			margin-bottom: 6px;
			font-size: 14px;
		} 

		span {
			font-size: 12px;
			color: $fontColorGray;

			&:first-child {
				margin-right: 2em;
			}
		}
	}

	.download-btn {
		position: absolute;
		top: 50%;
		right: 16px;
		line-height: 24px;
		width: 24px;
		height: 24px;
		margin-top: -12px;
		// border: 1px solid $colorRedDeep;
		text-align: center;
		border-radius: 30px;
		// color: $colorRedDeep;
		font-size: 0;
		background: url("~assets/img/icon/file-download.png") no-repeat;
		background-size: 80%;
		background-position: center;

		&.disable {
			opacity: .4;
		}
	}
</style>