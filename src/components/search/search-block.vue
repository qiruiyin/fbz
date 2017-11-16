<!-- 
	搜索筛选模块
 -->

<template>
	<div class="search-block">
		<group>
      <x-switch title="筛选" v-model="saixuan"></x-switch>
    </group>

    <div v-transfer-dom>
      <popup v-model="saixuan" position="right">
        wseflkerlfer
      </popup>
    </div>
	</div>
</template>

<script type="text/babel">
	import { TransferDom, Group, Cell, Search, Popup, XSwitch } from 'vux'

	export default {
		name: "searchBlock",
		directives: {
	    TransferDom
	  },
		components: {
			Group, Cell, Search, Popup, XSwitch
		},
		data () {
			return {
				saixuan: false
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
</style>