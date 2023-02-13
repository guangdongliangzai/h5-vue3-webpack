import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import myAxios from "./api/request";
import components from "./components/index"; //全局的插件
import filters from "./filters/index";
import "lib-flexible";
import "./base.less";
import { Toast } from "vant";
import VueWechatTitle from "vue-wechat-title";
const app = createApp(App);

app.use(store);
app.use(router);
app.use(components);
app.use(Toast);
app.use(VueWechatTitle);
app.mount("#app");
//全局的过滤器
app.config.globalProperties.$filters = {
  ...filters,
};
app.config.globalProperties.$myAxios = myAxios;


/***** 
 * 全局属性：
 * 版本号：window._myconfig.$_hm_version
 * 系统环境:window._myconfig.$_hm_system
 ******/
let _myconfig = {
  $_hm_version: "3.4.2",
}
var ua = window.navigator.userAgent.toLowerCase();
if (ua.match(/MicroMessenger/i) == "micromessenger") {
  //微信环境下
  _myconfig.$_hm_system = "wx";
  window.wx.miniProgram.getEnv((res) => {
    if (res.miniprogram) {
      // 小程序环境下逻辑
      _myconfig.$_hm_system = "wxApp";
    }
  });
} else {
  //非小程序环境下逻辑
  if (/hmType=app/i.test(window.navigator.userAgent)) {
    if (/(iPhone|iPad|iPod|iOS)/i.test(window.navigator.userAgent)) {
      _myconfig.$_hm_system = "hmIOS";
    } else {
      _myconfig.$_hm_system = "hmAndroid";
    }
  } else {
    _myconfig.$_hm_system = "null";
  }
}

window._myconfig = _myconfig
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    // window.document.title = to.meta.title;
    // alert(window.document.title)
    let data_ = JSON.stringify({
      title: to.meta.title,
    });
    try {
      switch (window._myconfig.$_hm_system) {
        case "hmIOS":
          window.webkit.messageHandlers.shareActivityPage.postMessage(data_);
          break;
        case "hmAndroid":
          window.AndroidWebView.shareActivityPage(data_);
          break;
        default:
          break;
      }
    } catch (e) {
      console.log(e)
    }

  }
  next();
});
