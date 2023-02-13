<template>
  <div class="huiyang_bar">
    <div class="bar_item" v-for="item,index in barData" :key="index" @click="runBar(item)">
      <img :src="active==index?item.act_iocn:item.ret_iocn" class="bar_icon" />
      <div class="bar_item_name" :class="{active:active==index}">{{item.name}}</div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.huiyang_bar {
  width: 375px;
  height: 65px;
  background-color: #ffffff;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  padding-top: 6px;
  .bar_item {
    flex: 1;
    text-align: center;
    .bar_icon {
      width: 22px;
      height: 22px;
      display: initial;
    }
    .bar_item_name {
      font-size: 10px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 14px;
      color: #999999;
      &.active {
        color: #222222;
      }
    }
  }
}
</style>
<script>
import { ref } from "vue";

export default {
  props: {
    active: {
      type: Number,
      default: () => {
        return 0;
      },
    },
  },
  setup() {
    let barData = ref([
      {
        name: "首页",
        path: "/huiyangShop/index",
        act_iocn: require("@/assets/img/huiyang/home.png"),
        ret_iocn: require("@/assets/img/huiyang/home_2.png"),
      },
      {
        name: "结算",
        path: "/huiyangShop/management",
        act_iocn: require("@/assets/img/huiyang/settlement.png"),
        ret_iocn: require("@/assets/img/huiyang/settlement_2.png"),
      },
      {
        name: "我的",
        path: "/huiyangShop/me",
        act_iocn: require("@/assets/img/huiyang/me.png"),
        ret_iocn: require("@/assets/img/huiyang/me_2.png"),
      },
    ]);
    return {
      //必须返回 模板中才能使用
      barData,
    };
  },
  methods: {
    async runBar(item) {
      const { path } = item;
      this.$router.replace({ path: path });
    },
  },
};
</script>

 
 