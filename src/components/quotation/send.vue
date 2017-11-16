<!-- 
	经典语录(发送)
 -->

<template>
	<div class="quotation-list" v-cloak>
		<div class="quotation-list-content">
			<div class="quotation-time">
				<!-- 8月28日 -->
				{{ quotationData.time }}				
			</div>

		  <swipeout class="block-swipeout">
	      <swipeout-item transition-mode="follow">
	        <div slot="right-menu">
	          <swipeout-button @click.native="onButtonClick('delete')" type="warn">删除</swipeout-button>
	        </div>
	        <div slot="content" class="block">
						<div v-if="quotationData.img.length > 0" class="block-img">
							<div class="img" :style="quotationData.img[0].style" @click="show(0)"></div>
							<div v-transfer-dom>
					      <previewer :list="quotationData.img" ref="previewer"></previewer>
					    </div>
						</div>

						<div class="block-info" v-html="quotationTransContent(quotationData.content)"></div>
					</div>
	      </swipeout-item>
	    </swipeout>
			
		</div>
	</div>
</template>

<script type="text/babel">
	import { TransferDom, Previewer, Swipeout, SwipeoutItem, SwipeoutButton, XButton  } from 'vux'

	export default {
		name: "quotationSend",
		directives: {
	    TransferDom
	  },
		components: { 
			Previewer, Swipeout, SwipeoutItem, SwipeoutButton, XButton
		},
		props: ["quotationData"],
		data () {
			return {
				title: "经典语录",
				num: -1,
				num2: -1,
				btnStatus: false,
				showMoreZanBtnNum: 10,
				showMoreZan: false,
				commentShowNums: 3,
				commentShowNumsStatus: false, // 是否展开
				quotationList: {
					code: "",
					title: '',
					content: '',
					img: [],
					time: '',
					qulikes: 0
				},
			}
		},
		mounted () {
			
		},
		methods: {
			onButtonClick () {
				let _this = this;
				this.$http.post('/wechat/quotationsmobile/del',
						{
							code: _this.quotationData.code
						}
					).then(function(e) {
						if(e.data.code == 200) {
							_this.$emit("on-delete", _this.quotationData.code);
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
					});
			},
			show (index) {
	      this.$refs.previewer.show(index)
	    },
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	@import '~assets/css/quotation';
</style>
