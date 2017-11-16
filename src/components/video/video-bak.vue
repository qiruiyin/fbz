<!-- 
	视频播放
 -->

<template>
	<div class="video" v-cloak>
		<video-player class="video-player-box"
                 ref="videoPlayer"
                 :options="playerOptions"
                 :playsinline="true"
                 customEventName="customstatechangedeventname"
                 @play="onPlayerPlay($event)"
                 @pause="onPlayerPause($event)"
                 @ended="onPlayerEnded($event)"
                 @waiting="onPlayerWaiting($event)"
                 @playing="onPlayerPlaying($event)"
                 @loadeddata="onPlayerLoadeddata($event)"
                 @timeupdate="onPlayerTimeupdate($event)"
                 @canplay="onPlayerCanplay($event)"
                 @canplaythrough="onPlayerCanplaythrough($event)"
                 @statechanged="playerStateChanged($event)"
                 @ready="playerReadied">
    </video-player>
	</div>
</template>

<script type="text/babel">
	// import VideoPlayer from 'vue-video-player'

	export default {
		name: "elVideo",
		components: {
			// VideoPlayer
		},
		props: ['videoSrc'],
		data () {
			return {
				// playerOptions: {
    //       // videojs options
    //       muted: true,
    //       language: 'en',
    //       playbackRates: [0.7, 1.0, 1.5, 2.0],
    //       sources: [{
    //         type: "video/mp4",
    //         src: ""
    //          // "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
    //       }],
    //       poster: "",
    //     }
			}
		},
		computed: {
			playerOptions () {
       	console.log( this.videoSrc);
        return {  // videojs options
          muted: true,
          language: 'en',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [{
            // type: "video/mp4",
            src: this.videoSrc || ""
             // "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
          }],
          poster: "",
        }
      }
		},
    mounted() {
      console.log('this is current player instance object', this.player)
    },
  
    methods: {
      // listen event
      onPlayerPlay(player) {
        console.log('player play!', player)
      },
      onPlayerPause(player) {
        console.log('player pause!', player)
      },
      // ...player event

      // or listen state event
      playerStateChanged(playerCurrentState) {
        console.log('player current update state', playerCurrentState)
      },

      // player is ready
      playerReadied(player) {
        console.log('the player is readied', player)
        // you can use it to do something...
        // player.[methods]
      },
      onPlayerLoadeddata (player) {
        console.log('the player is onPlayerLoadeddata', player)

      },
      onPlayerPlaying (player) {
        console.log('the player is onPlayerPlaying', player)

      },
      onPlayerEnded (player) {
        console.log('the player is onPlayerEnded', player)

      },
      onPlayerWaiting (player) {
        console.log('the player is onPlayerWaiting', player)

      },
      onPlayerTimeupdate (player) {
      	console.log(player.currentTime())
      	if(player.currentTime() >= 30) {
      		player.exitFullscreen();
      		player.exitFullWindow();

      		player.reset();
      		this.$vux.confirm.show({
      			content: "请去购买"
      		})
      	}
        // console.log('the player is onPlayerTimeupdate', player)

      },
      onPlayerCanplay (player) {
        console.log('the player is onPlayerCanplay', player)

      },
      onPlayerCanplaythrough (player) {
        console.log('the player is onPlayerCanplaythrough', player)

      }
    }
	}
</script>

<style lang="scss">
	
	.video-player-box {
		width: 100%;

		div {
			width: 100%;
		}
	}
</style>