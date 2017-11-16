import Vue from 'vue'
import commonFun from 'src/commons'
import store from 'src/store'
import Router from 'vue-router'
import routerLink from './router-link'
import hold from 'src/commons/hold'
import wordBook from 'src/commons/wordBook'

import { AjaxPlugin } from 'vux'
Vue.use(AjaxPlugin)

Vue.use(Router)

const router = new Router({
  routes: routerLink
})

const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0);

router.beforeEach((to, from, next) => {

  // 是否加载
  store.commit('updateLoadingStatus', {isLoading: true});
  // if(to.path != '/share') {
  if(!hold.storage.get('openId') && to.path != '/author'){
  // 第一次进入项目
    hold.localStorage.set('beforeLoginUrl', JSON.stringify(to)) // 保存用户进入的url
    next('/author')
    return false
  } 
  // }
  // 用户是否授权结束

  // 底部显不显示（Vue.prototype.wordBook.nav不显示列表）
  store.commit("updateNavStatus", { status: !Vue.prototype.arrContain(Vue.prototype.wordBook.nav, to.name) });

  if(to.name == 'msg') {
    store.commit("updateUserHasMsg", { hasMsg: '' });
  }
  // 切换效果
  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)

  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
      store.commit('updateDirection', {direction: 'forward'})
    } else {
      store.commit('updateDirection', {direction: 'reverse'})
    }
  } else {
    ++historyCount
    history.setItem('count', historyCount)
    to.path !== '/' && history.setItem(to.path, historyCount)
    store.commit('updateDirection', {direction: 'forward'})
  }
  if (/\/http/.test(to.path)) {
    let url = to.path.split('http')[1]
    window.location.href = `http${url}`
  } else {
    next()
  }
  // 切换效果结束
})

router.afterEach((to, from, next) => {

  // 微信签名
  if(to.name == 'share') store.commit('updateUserShareImg', {shareImg: ''});
  // Vue.prototype.signUrl();
  // Vue.prototype.openShare(Vue.prototype.wordBook.urlLink.share, "富班长商学院", '海量"企业"管理与"行业资料"任你下载，大量"培训视频"与"商业思维"随你观看！', store.state.user.openId, "", true);
  // Vue.prototype.openShare(Vue.prototype.wordBook.urlLink.share, "富班长商学院", '海量"企业"管理与"行业资料"任你下载，大量"培训视频"与"商业思维"随你观看！', store.state.user.openId, "", true);
 
  if(to.name == 'share' && !store.state.user.shareImg) {
    Vue.prototype.signUrl(location.href, false, { url: 'http://fubanzhang.10-suns.com/fbz/#/share?openId' + hold.storage.get('openId'), imgUrl: '' });
  } else {
    Vue.prototype.signUrl(location.href, true, { url: 'http://fubanzhang.10-suns.com/fbz/#/share?openId' + hold.storage.get('openId'), imgUrl: '' });
  }
  // // 统计页面访问记录
  // if(to.name && Vue.prototype.arrContain(Vue.prototype.wordBook.visitRouter, to.name)) {
  //   if(to.name == 'rankList') {
  //     Vue.prototype.visitRouter(to.meta.routerTitle[to.params.type], to.fullPath, 'in')
  //   } else if (to.name == 'courseTypeDetail') {
  //     Vue.prototype.visitRouter(to.meta.routerTitle[to.query.type], to.fullPath, 'in')
  //   } else {
  //     Vue.prototype.visitRouter(to.meta.routerTitle, to.fullPath, 'in')
  //   }
  // }

  // // 统计页面访问记录
  // if(from.name && Vue.prototype.arrContain(Vue.prototype.wordBook.visitRouter, from.name)) {
  //   if(from.name == 'rankList') {
  //     Vue.prototype.visitRouter(from.meta.routerTitle[from.params.type], from.fullPath, 'out')
  //   } else if (from.name == 'courseTypeDetail') {
  //     Vue.prototype.visitRouter(from.meta.routerTitle[from.query.type], from.fullPath, 'out')
  //   } else {
  //     Vue.prototype.visitRouter(from.meta.routerTitle, from.fullPath, 'out')
  //   }
  // }
 
  store.commit('updateLoadingStatus', {isLoading: false})
  // 设置标题
  global.document.title = to.meta.title || '富班长'
  // 滚动条回到头部
  global.scrollTo(0, 0)
})

export default router
