<template>
  <div class="layoutt_content">
    <!-- <router-view
      v-slot="{ Component }"
      v-if="$route.meta.keepAlive"
      v-wechat-title="title"
    >
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
    <router-view v-slot="{ Component }" v-else>
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view> -->
    <router-view v-slot="{ Component }" v-wechat-title="title">
      <keep-alive>
        <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
      </keep-alive>
      <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" />
    </router-view>
  </div>
</template>
<style lang="less" scoped>
.layoutt_content {
  width: 375px;
  height: 100vh;
  overflow: auto;
  background: #ffffff;
  overflow-x: hidden;
}
</style>
<script>
// import { getSession } from "@/tool/storage";
import { ref } from "vue";
// import { _checkIsOnline } from "@/api/modules/index";
// import { setSession } from "@/tool/storage";
export default {
  setup() {
    let collapse = ref(false);
    let title = ref("");
    return {
      title,
      collapse,
    };
  },
  watch: {
    $route(to, oldPath) {
      this.title = to.meta.title || "";
      console.log("to", this.title, oldPath);
    },
  },
  beforeCreate() {
    // 检查登录----获取url读取用户信息
    // try {
    //   let access_token = "";
    //   let token = getSession("access_token");
    //   const hrefs = window.location.href;
    //   console.log("isToken", hrefs, token);
    //   if (hrefs.indexOf("?") > -1) {
    //     const prams = hrefs.split("?")[1];
    //     const pramList = prams.split("&");
    //     for (let name in pramList) {
    //       if (pramList[name].indexOf("access_token") > -1) {
    //         access_token = pramList[name].replace("access_token=", "");
    //       }
    //       if (pramList[name].indexOf("sys_tem") > -1) {
    //         let system = pramList[name].replace("sys_tem=", "");
    //         setSession("sys_tem", system || "higirz");
    //       }
    //     }
    //   }
    //   console.log("runToken", access_token, hrefs);
    //   if (access_token != "" && access_token != token) {
    //     setSession("access_token", access_token);
    //     _checkIsOnline({ access_token });
    //   }
    // } catch (e) {
    //   console.log(e);
    // }
  },
};
</script>
