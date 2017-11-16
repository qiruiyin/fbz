<!-- 
	微信授权
 -->

<template>
	<div class="author" v-cloak>
		
	</div>
</template>

<script type="text/babel">
	import hold from 'src/commons/hold'
	
	export default {
		name: 'author',
		data () {
			return {

			}
		},
		mounted () {
			let _this = this,
					urlJson = _this.parseToJson(location.href),
					openId = "",
					paramP = "";

			if(urlJson) {
				openId = urlJson.openId;
				paramP = urlJson.p;
			}
			if(!openId) {
				_this.$http.post('/api/wechat/getAuthorize',
  				_this.qs.stringify({
						data: ""
					})
  			).then(function(e) {
  				if(e.data.data)
  					window.location.href = e.data.data.authorUrl;
  			})
	    } else {
	    	let beforeLoginUrl = JSON.parse(hold.localStorage.get('beforeLoginUrl'));
	    	if(beforeLoginUrl) {
	    		_this.getUserInfo(openId, {name: beforeLoginUrl.name, query: beforeLoginUrl.query, params: beforeLoginUrl.params});
	    	} else {
		    	_this.getUserInfo(openId, {name: 'index'});
	    	}
	    }
		},
		methods: {
			parseToJson (url) {
				if(url != "" && url.indexOf("?") != -1){
					let	url_json = {};
					url = url.replace("#/author", "");
					url = url.split("?");
					url = url[1].split('&');
					for (let i = 0; i<url.length ; i++) {
				    let str = url[i].split('=');
				    url_json[str[0]]=str[1];
					}
					return url_json;
				} else {
					return "";
				}
			}
		}
	}
</script>