<!-- 
	分享有奖
 -->

<template>
	<div class="share" v-cloak>
		<img :src="user.shareImg" alt="">
	</div>
</template>

<script type="text/babel">
  import { mapState } from 'vuex'

	export default {
		name: 'share',
		components: '',
		data () {
			return {
				title: '分享有奖'
			}
		},
		computed: {
      ...mapState({
        user: state => state.user
      })
    },
    mounted () {
			// this.openShare(this.wordBook.urlLink.share, "分享", "分享二维码", this.user.openId, "", true);
    },
    methods: {
    	fetchData () {

    	}
    }
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	.share {
		img {
			width: 100%;
		}
	}
</style>