import { createRouter, createWebHistory } from "vue-router";
import defaultRouter from "./default";
import activity from "./activity";
import { getSession } from "@/tool/storage";
const routes = [
  {
    path: "/",
    redirect: "/404",
  },
  {
    path: "/defaultRouter",
    redirect: "/defaultRouter/index",
    meta: { login: true },
    component: () =>
      import(/* webpackChunkName: "defaultRouter" */ "@/components/layoutt/Home.vue"),
    children: defaultRouter,
  },
  {
    path: "/activity",
    redirect: "/404",
    component: () =>
      import(/* webpackChunkName: "activity" */ "@/components/layoutt/Home.vue"),
    children: activity,
  },
  {
    path: "/defaultHtml",
    component: () =>
      import(/* webpackChunkName: "defaultHtml" */ "@/views/default/index.vue"),
  },
  // {
  //   path: "/webView",
  //   component: () =>
  //     import(/* webpackChunkName: "activity" */ "@/views/webView/index.vue"),
  //   children: activity,
  // },
  {
    path: "/404",
    component: () => import(/* webpackChunkName: "404" */ "@/views/404.vue"),
  },
  {
    path: '/:pathMatch(.*)',//没有的路由重定向
    redirect: '/404'//重定向
  },
];

const router = createRouter({
  history: createWebHistory("/"),
  routes,
});


//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  if (to.meta.login) {
    const access_token = getSession("access_token") || "";
    const hrefs = window.location.href;
    if (access_token || (hrefs.indexOf("?") > -1 && hrefs.indexOf("access_token") > -1)) {
      next();
      return;
    } else {
      next("/404");
      return;
    }
  } else {
    next();
    return;
  }
});




export default router;
