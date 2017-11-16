import Vue from 'vue'
// 数字转货币格式
Vue.filter('numToCash', function (value) {
  // 返回处理后的值
  value = parseFloat(value);
	if(value == null || value == undefined || value == ""){
		return 0;
	} else if(value == 0) {
		return value;
	} else {
		let end = "",
			start = "";
		value = value.toFixed(2);
		
		if(value < 0) {
			start = "-";
			value += "";
			value = value.substring(1);
		}
		value += "";
		if(!/^-?\d+$/.test(value)) {
			end = value.split(".")[1];
			value = value.split(".")[0];
		}
		value = value.split("").reverse();
		let arr = [];
		value.map(function(elem, index){
			arr.push(elem);
			if(index%3 == 2 && index != value.length - 1) {
				arr.push(",");
			}
		});
		
		let respond = arr.reverse().join("");
		if(end != ""){
			return start + respond + "." + end;
		} else {    				
			return start + respond;
		}
	}
});

// 证件号码中间隐藏
Vue.filter('centerToStar', function (value, numBefore, numAfter) {
	if(value > numBefore + numAfter) {
		let len = value.length,
				endNum = len - numBefore - numAfter,
				star = '',
				re = new RegExp("\^(\\w\{" + numBefore + "\}\)\\w\{" + endNum + "\}\(.*\)\$");
		
		for(let i = 0; i < endNum; i++) star+= '*';

		return value.replace(re, '$1' + star + '$2');
	} else {
		return value
	}
});

const myFilter = Vue.filter(['numToCash', 'centerToStar'])

export default myFilter