<!-- 
	发布朋友圈
 -->

<template>
	<div class="add-quotation" v-cloak>
    <div class="add-quotation-content">
    	<x-textarea v-model="content" :height="160" placeholder="这一刻的想法..."></x-textarea>
    	
    	<div class="quotation-input">
				<el-priviewer-img @on-remove-img="removeImg" @click.native="showPriviewer(index)" v-for="(item, index) in imageFilePriviwer" :priviewer-ind="index" :priviewer-data="item" :key="index"></el-priviewer-img>
      	<div v-transfer-dom>
		      <previewer :list="imageFile" ref="previewer"></previewer>
		    </div>
				
				<div class="input-file">				
					<input type="file" name="img" ref="inputer" @change="previewFile" multiple="multiple">
					<div class="input-file-icon">+</div>
				</div>
    	</div>
    </div>
    <div class="btn">    	
      <x-button type="primary" @click.native="submit">提交</x-button>
    </div>
	</div>
</template>

<script type="text/babel">
	import { XTextarea, XButton, TransferDom, Previewer } from 'vux'
  import { mapState } from 'vuex'
  import elPriviewerImg from 'components/quotation/img'

	export default {
		name: 'addQuotation',
		directives: {
	    TransferDom
	  },
		components: { XTextarea, XButton, Previewer, elPriviewerImg },
		data () {
			return {
				imageFilePriviwer: [],
				imageFile: [],
				content: "",
				onUploading: false,
				uploadAll: false,
				maxsize: 2000
			}
		},
    computed: {
      ...mapState({
        loadbar: state => state.loadbar
      })
    },
		methods: {
			previewFile (val) {
				let _this = this,
						files = this.$refs.inputer.files,
						filesArr = [];

				if (!files.length) return;
				
				filesArr = Array.prototype.slice.call(files);

				filesArr.forEach(function (file, index) {
          if (!/\/(?:jpeg|png|gif)/i.test(file.type)) return;

          let reader = new FileReader();

          reader.onload = function () {
            let result = this.result;
            let img = new Image();
            img.src = result;

            //如果图片大小小于200kb，则直接上传
            if (result.length <= _this.maxsize) {
              img = null;
              _this.uploadImg(result, file);

              return;
            }

						// 图片加载完毕之后进行压缩，然后上传
            if (img.complete) {
              callback();
            } else {
              img.onload = callback;
            }

            function callback() {
              let data = _this.compress(img);
              _this.uploadImg(data, file);
              img = null;
            }
          };
          reader.readAsDataURL(file);
        })
			},
			submit () {
				let _this = this;
				if(!_this.loadbar.isLoading) {
					_this.submitAll();
				}
			},
      removeImg (ind) {
        let _this = this;
        _this.imageFilePriviwer.splice(ind, 1);
        _this.imageFile.splice(ind, 1);
      },
			uploadImg (data, file) {
				let _this = this,
						formData = new FormData(),
						text = window.atob(data.split(",")[1]),
        		buffer = new ArrayBuffer(text.length),
        		ubuffer = new Uint8Array(buffer),
        		pecent = 0,
        		loop = null;

        for (let i = 0; i < text.length; i++) {
            ubuffer[i] = text.charCodeAt(i);
        }

        let blob = getBlob([buffer], file.type);

        formData.append('file', blob);

				let config = {
          headers:{'Content-Type':'multipart/form-data'}
        };

				this.$http.post('/wechat/quotationsmobile/addQuotations',
						formData,
						config
					).then(function(e) {
						if(e.data.code == 200) {
	        		// _this.onUploading = false;
							_this.imageFile.push({
								src: _this.resolveImg(e.data.data.result[0]),
                name: e.data.data.result[0]
							});
              _this.imgPreview(file);           
							// _this.uploadImg(ind+1);
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
					});
			},
			submitAll () {
				let _this = this,
						imageFile = "";

				if(_this.imageFile.length > 0) {
					_this.imageFile.map(function(item, index){
						if(index > 0) {
							imageFile += ";";
						}
						imageFile += item.name;
					})
				}

        if(!_this.content) {
          _this.$vux.alert.show({
            content: "内容不能为空"
          })
          return false;
        } else if (imageFile.length == 0) {
          _this.$vux.alert.show({
            content: "请上传图片"
          })
          return false
        }
				this.$http.post('/wechat/quotationsmobile/save',
						{
							content: _this.content,
							imageFile: imageFile,
							openId: _this.$store.state.user.openId
						}
					).then(function(e) {
						if(e.data.code == 200) {
							_this.$vux.alert.show({
								content: e.data.msg,
								onHide () {
									_this.$router.go(-1)
								}
							})	
						} else {
							_this.$vux.alert.show({
								content: e.data.msg
							})
						}
					});
			},
			showPriviewer (index) {
	      this.$refs.previewer.show(index)
	    },
			imgPreview (file) {
				console.log('imgPreview')
        let self = this;
        // 看支持不支持FileReader
        if (!file || !window.FileReader) return;

        if (/^image/.test(file.type)) {
				console.log('imgPreview image')
          // 创建一个reader
          let reader = new FileReader();
          // 将图片将转成 base64 格式
          reader.readAsDataURL(file);
          // 读取成功后的回调
          reader.onloadend = function () {
            self.imageFilePriviwer.push({
            	style: {
								backgroundImage: "url(" + this.result + ")"
							},
              name: file.name
						});
          }
        }
      },
      compress(img) {
        // 压缩图片
        let _this = this,
        		initSize = img.src.length,
        		width = img.width,
        		height = img.height,
        	 	// 用于压缩图片的canvas
			      canvas = document.createElement("canvas"),
			  		ctx = canvas.getContext('2d'),
			  		// 瓦片canvas
			  		tCanvas = document.createElement("canvas"),
			  		tctx = tCanvas.getContext("2d");

        //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
        let ratio;
        if ((ratio = width * height / 4000000)>1) {
          ratio = Math.sqrt(ratio);
          width /= ratio;
          height /= ratio;
        }else {
          ratio = 1;
        }

        canvas.width = width;
        canvas.height = height;

				// 铺底色
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //如果图片像素大于100万则使用瓦片绘制
        let count;
        if ((count = width * height / 1000000) > 1) {
          count = ~~(Math.sqrt(count)+1); //计算要分成多少块瓦片

					// 计算每块瓦片的宽和高
          let nw = ~~(width / count);
          let nh = ~~(height / count);

          tCanvas.width = nw;
          tCanvas.height = nh;

          for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
              tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);

              ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
            }
          }
        } else {
          ctx.drawImage(img, 0, 0, width, height);
        }

        //进行最小压缩
        let ndata = canvas.toDataURL('image/jpeg', 0.1);

        // alert(ndata);
        // alert('压缩后：' + ndata.length);
        // alert('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");

        tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;

        return ndata;
    	}
		}
	}


	/**
   * 获取blob对象的兼容性写法
   * @param buffer
   * @param format
   * @returns {*}
   */
  function getBlob(buffer, format) {
    try {
      return new Blob(buffer, {type: format});
    } catch (e) {
      let bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder);
      buffer.forEach(function(buf) {
        bb.append(buf);
      });
      return bb.getBlob(format);
    }
  }
  /**
   * 获取formdata
   */
  function getFormData() {
    let isNeedShim = ~navigator.userAgent.indexOf('Android')
        && ~navigator.vendor.indexOf('Google')
        && !~navigator.userAgent.indexOf('Chrome')
        && navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop() <= 534;
    return isNeedShim ? new FormDataShim() : new FormData()
  }
  /**
   * formdata 补丁, 给不支持formdata上传blob的android机打补丁
   * @constructor
   */
  function FormDataShim() {
    console.warn('using formdata shim');
    let o = this,
        parts = [],
        boundary = Array(21).join('-') + (+new Date() * (1e16 * Math.random())).toString(36),
        oldSend = XMLHttpRequest.prototype.send;
    this.append = function(name, value, filename) {
      parts.push('--' + boundary + '\r\nContent-Disposition: form-data; name="' + name + '"');
      if (value instanceof Blob) {
        parts.push('; filename="' + (filename || 'blob') + '"\r\nContent-Type: ' + value.type + '\r\n\r\n');
        parts.push(value);
      }
      else {
        parts.push('\r\n\r\n' + value);
      }
      parts.push('\r\n');
    };
    // Override XHR send()
    XMLHttpRequest.prototype.send = function(val) {
      let fr,
          data,
          oXHR = this;
      if (val === o) {
        // Append the final boundary string
        parts.push('--' + boundary + '--\r\n');
        // Create the blob
        data = getBlob(parts);
        // Set up and read the blob into an array to be sent
        fr = new FileReader();
        fr.onload = function() {
          oldSend.call(oXHR, fr.result);
        };
        fr.onerror = function(err) {
          throw err;
        };
        fr.readAsArrayBuffer(data);
        // Set the multipart content type and boudary
        this.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
        XMLHttpRequest.prototype.send = oldSend;
      }
      else {
        oldSend.call(this, val);
      }
    };
  }
</script>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
	
	$quotationInputW: 60px;
	
	.add-quotation {
		width: 100%;
		height: 100%;
		background: $bgGray;
	}

	.add-quotation-content {
		background: #fff;
	}

	.quotation-input {
		@extend %clearfix;
		text-align: center;
		// padding: 0 $padding;
	}

	.input-file {
		float: left;
		@include halfpxline(0, $fontColorGray, 1px, 1px, 1px, 1px);
		width: $quotationInputW;
		height: $quotationInputW;
		margin: 0 $padding/2;
		margin-bottom: $padding;
		display: inline-block;
	
		input {
			width: 100%;
			height: 100%;
			opacity: 0;
		}

		.input-file-icon {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			line-height: $quotationInputW;
			color: #ccc;
			font-size: 70px;
			z-index: -1;
		}
	}

	.btn {
		margin: 40px $padding;
	}
</style>
