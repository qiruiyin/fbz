<!-- 
	客户与客户消息页面（废弃）
 -->

<template>
	<div class="integral-msg" v-cloak>
		<group>
      <x-textarea title="内容" :rows="8" placeholder="请填写消息内容" :max="200" v-model="value"></x-textarea>
    </group>

    <div class="btns">
    	<x-button type="primary" @click="submit">确定</x-button>
    </div>
 	</div>
</template>

<script type="text/babel">
	import { XTextarea, Group, XInput, XButton } from 'vux'

	export default {
		name: "integralMsg",
		components: {
			XTextarea, Group, XInput, XButton
		},
		data () {
			return {
				title: "客户与客户消息页面",
				value: ''
			}
		},
		methods: {
			submit () {
				let _this = this;
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	@import '~assets/css/form';
	

</style>