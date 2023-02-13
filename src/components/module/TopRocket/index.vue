<template>
  <div v-show="showBtn" class="to-top" @click="backTop">
    <img class="icon-toTop" :src="imgsrc" alt="" />
  </div>
</template>
<script>
import imgsrc from "@/assets/img/icon-game-top.png";
export default {
  name: "TopRocket",
  props: {
    isscroll: {
      type: Number,
      default() {
        return 0;
      },
    },
  },
  data() {
    return {
      imgsrc,
      scrollDestence: 0,
      showBtn: false,
    };
  },
  mounted() {
    // 监听元素classname的div的滚动条
    this.$nextTick(() => {
      const iv = this.$parent.$refs.scroller || this.$parent.$refs.listPage;
      iv.addEventListener("scroll", this.scrollHandler);
    });
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.scrollHandler);
  },
  methods: {
    scrollHandler() {
      // 上滑推送弹框隐藏
      //   if (this.$recommend.show()) {
      //     this.$recommend.hide();
      //   }
      this.showBtn = false;
      const iv = this.$parent.$refs.scroller || this.$parent.$refs.listPage;
      this.scrollDestence = iv.scrollTop;
      // console.log('scrollDestence', this.scrollDestence)
      setTimeout(() => {
        if (this.scrollDestence > 200) {
          this.showBtn = true;
        } else {
          this.showBtn = false;
        }
      }, 3000);
    },
    addEvent() {
      window.addEventListener("scroll", this.scrollHandler);
    },
    backTop() {
      const iv = this.$parent.$refs.scroller || this.$parent.$refs.listPage;
      iv.scrollTop = 0;
      // this.$baseEventBus.$emit("scrollTopShowName");
    },
  },
};
</script>
<style lang="less" scoped>
.to-top {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 2rem;
  right: 0.2rem;
  z-index: 999;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  color: white;
  text-align: center;
  line-height: 36px;
  .icon-toTop {
    width: 40px;
    height: 40px;
  }
}
</style>
