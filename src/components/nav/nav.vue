<!-- 
 底部导航菜单
 -->

<template>
    <div v-transfer-dom>
      <nav>
    	<tabbar v-model="navSelected" icon-class="vux-center" slot="bottom">
          <tabbar-item v-for="(item, index) in navDatas" :link="item.link" :selected="index == navSelected" :badge="item.link == 'msg' ? user.hasMsg : ''" :key="item.value">
            <div :class="['nav-icon', 'nav-icon-' + item.icon, {'active': index == navSelected, 'nav-icon-big': item.value == 'mall'}]" slot="icon"></div>
            <span slot="label" class="nav-label">{{ item.name }}</span>
          </tabbar-item>
        </tabbar>
      </nav>
    </div>
</template>

<script type="text/babel">
	import { Tabbar, TabbarItem, TransferDom } from 'vux'
    import { mapState } from 'vuex'

	export default {
		name: 'elNav',
        directives: {
            TransferDom
        },
		components: { Tabbar, TabbarItem },
		data () {
        	return {
        		isDemo: true,
        		navDatas: [
        			{
        				value: "home",
        				name: "首页",
        				icon: 'index',
                        link: {
                            name: 'index'
                        }
        			},{
        				value: "headphones",
        				name: "课程",
                        icon: 'course',
                        link: {
                            name: 'course'
                        }
        			},{
        				value: "mall",
        				name: "培训导航",
                        icon: 'mall',
        				link: {
                            name: 'courseNav'
                        }
        			},{
        				value: "comments-o",
        				name: "线下活动",
                        icon: 'activity',
                        link: {
                            name: 'activity'
                        }
        			},{
        				value: "user-o",
        				name: "我的",
                        icon: 'my',
                        link: {
                            name: 'userCenter'
                        }
        			}
        		],
        		navSelected: 0
    	    }
	    },
        computed: {
          ...mapState({
            user: state => state.user
          }),
        },
        watch: {
          '$route' (to, from) {
            let indexArray = [ 'index', 'news', 'newsDetail' ],
                courseArray = [ 'courseList', 'courseNav', 'courseDetail', '' ],
                activityArray = [ 'activity', 'activityDetail' ],
                userArray = [ 'userCenter', 'personal', 'personalEdit', 'share', 'integral', 'feedback', 'wallet', 'tixian', 'tixianDone', 'customer', 'agency', 'tuisong', 'orderCourseList', 'orderActivityList', 'orderMallList', 'orderSourceList', 'address', 'addressAdd', 'addressEdit', 'friend', 'friendAdd', 'friendEdit', 'ticket', 'ticketCheck', 'voucher', 'upgradeRights', 'upgrade' ];
            if(this.arrContain(courseArray, to.name)) {
                this.navSelected = 2;
            } else if(this.arrContain(activityArray, to.name)) {
                this.navSelected = 3;
            } else if(this.arrContain(userArray, to.name)) {
                this.navSelected = 4;
            } else {
                this.navSelected = 0;
            }
          }
        },
        // computed: {
        //     navSelected () {
        //         let _this = this,
        //             name = this.$route.name,
        //             data = "home";
        //         this.navDatas.map(function(item, index){
        //             if(item.link == name) {
        //                 data = item.value;
        //             }
        //         });
        //         return data;
        //     }
        // }
	}
</script>

<style lang="scss">
    @import '~lib/sandal/core';
    @import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';
        
    $vuxBadgeW: 8px;
    
    .vux-center {
        .vux-badge {
            font-size: 0;
            width: $vuxBadgeW;
            height: $vuxBadgeW;
            margin-top: 6px;
            color: $msgCircleColor;
            border-radius: $vuxBadgeW;
        }
    }
</style>

<style lang="scss" scoped>
	@import '~lib/sandal/core';
	@import '~assets/css/core/functions', '~assets/css/core/mixins', '~assets/css/core/vars';

	// 这里的大小取自vux组件的
    $navIconW: 26px;
    $navIconArr: index, // 首页
                 course, // 课程
                 mall, // 商城
                 msg, // 消息
                 activity, // 活动
                 my; // 我的

    .nav-icon {
        position: absolute;
        top: 0;
        left: 50%;
        width: $navIconW;
        height: $navIconW;
        margin-left: -$navIconW/2;
        background: url("~assets/img/nav/nav-index.png") no-repeat;
        background-size: 100%;
    }

	// .nav-icon-big {
	// 	width: 60px;
 //        height: 60px;
 //        top: -36px;
 //        margin-left: -30px;
	// }

    @each $iconName in $navIconArr {
        .nav-icon-#{$iconName} {
            background-image: url("~assets/img/nav/nav-#{$iconName}.png");

            &.active {
                background-image: url("~assets/img/nav/nav-#{$iconName}-active.png");
            }
        }
    }

    .nav-label {
        // text
        // color: $colorYellowEasy;
    }
</style>