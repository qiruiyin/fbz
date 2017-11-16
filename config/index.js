// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 9010,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
        '/api': {
            // target: 'https://fbz.ittun.com/',
            // target: 'http://192.168.1.100:8088/',
            // target: 'http://114.215.135.236:8088/',
            target: 'http://fbz3.10-suns.com/api/',
            
            // target: 'http://fubanzhang.10-suns.com:8081/wechat',
            // target: 'http://114.215.135.236:8081/wechat',
            // target: 'http://192.168.1.100:18088/back/wechat/',
            changeOrigin: true,
            secure: false, // 接受 运行在 https 上的服务
            pathRewrite: {
              '^/api': ''
            }
        },
        // '/wechat': {
        //     target: 'http://localhost:3001/api/',
        //     // target: 'http://glyh.qibeisoft.com/wechat',
        //     // target: 'http://114.215.135.236:8090/qxpx/wechat',
        //     // target: 'http://192.168.1.158:8080/csm/wechat/',
        //     // target: 'http://192.168.1.174:8080/csm/wechat/',
        //     // target: 'http://192.168.1.199:81/wechat/',
        //     changeOrigin: true,
        //     secure: false, // 接受 运行在 https 上的服务
        //     pathRewrite: {
        //       '^/wechat': ''
        //     }
        // },
        // '/weixin': {
        //     // target: 'http://192.168.1.151:8080/csm/wechat/',
        //     target: 'http://test.yoao.com',
        //     // target: 'http://192.168.1.154:8080/csm/wechat/',
        //     // target: 'http://192.168.1.199:81/wechat/',
        //     changeOrigin: true,
        //     secure: false, // 接受 运行在 https 上的服务
        //     pathRewrite: {
        //       '^/weixin': ''
        //     }  
        // }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
