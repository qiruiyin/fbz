<!-- 
	地址(废弃)
 -->
<template>
	<div class="address" @click="addressChoose">
		<div class="address-msg">
			<p class="address-man">收货人：{{ address.name }}</p>
			<span class="address-tel">{{ address.phone }}</span>
		</div>
		<div class="address-detail">
			<i class="address-icon fa fa-map-marker"></i>
			收货地址：{{ address.address }}
			<i class="angle-icon fa fa-angle-right"></i>
		</div>
	</div>
</template>

<script type="type/babel">
	export default {
		data () {
			return {

			}
		}
	}
</script>


