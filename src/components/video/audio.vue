
<!-- 
	音频播放
 -->

<template>
	<div class="audio" v-cloak>
    <div v-if="status">    
		  <div :class="['prism-player', {'hidden': !status}]" id="J_prismPlayer"></div>
    </div>
    <p v-show="false">{{ audioData }}</p>
    <div class="course-info" v-if="!status">
      <p>该音频是付费音频，订阅可观看全部音频</p>
    </div>
	</div>
</template>

<script type="text/babel">
	import imgPoster from 'assets/img/audio.png'

	export default {
		name: "elAudio",
		components: {
			// VideoPlayer
		},
    props: ['audioData', 'courseInfo', 'hasBuy'],
		data () {
			return {
        time: 60,
				audioStatus: false,
        player: "",
        status: true
			}
		},
    mounted() {
      this.$nextTick(function(){
        this.init()
      })
    },
    methods: {
      init () {
        let _this = this;
        this.player = new prismplayer({
          id: 'J_prismPlayer',
          width: document.body.clientWidth,
          height: '260px',
          // height: document.body.clientWidth,
          autoplay: false,
          preload: true,
          //支持播放地址播放,此播放优先级最高
          source : _this.audioData.fileUrl,
          playsinline: true,
          cover: _this.audioData.fileThumb,
          // source : '播放url',
          //播放方式二：推荐
          // vid : "3165805f6ba34ba8a451b9ba592aba39" || _this.audioData.fileUrl,
          // playauth : '',
        });

        // document.querySelector('.audio video').title =  _this.audioData.name;
        if(_this.hasBuy != 1){
          _this.getCurrentTime();
        }
      },
      getCurrentTime () {
        let _this = this;
        if(_this.player.getCurrentTime() >= _this.time){
          _this.player.pause();
          _this.status = false;
          setTimeout(function(){
            _this.getCurrentTime();
          }, 1000);
        } else {
          setTimeout(function(){
            _this.getCurrentTime();
          }, 1000);   
        }
      }
    }
	}
</script>

<style lang="scss">
  @import '~lib/sandal/core';
  @import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
  
	.audio {
    position: relative;
    height: 260px;
    width: 100%;

    .prism-player {
			background: url("~assets/img/audio.gif") no-repeat;
			background-size: 100%;

      video {
        opacity: 0;
      }

      .prism-fullscreen-btn {
        display: none;
      }
    }

    .prism-player .prism-cover {
    	background: none;
    }
  }

  .course-info {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    color: #fff;
    text-align: center;
    display: flex;
    align-items: center;
    margin: 0 auto;
    background: #000;
    z-index: 100;
  }
</style>