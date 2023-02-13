<template>
  <div class="list-page-component" :class="myClass">
    <div class="page-header">
      <slot name="header"></slot>
    </div>
    <div ref="scroller" class="page-content scrollable">
      <slot></slot>
    </div>
    <div class="page-footer">
      <slot name="footer"></slot>
    </div>
    <top-rocket  v-if="showBTN"/>
  </div>
</template>

<script>
// 距离底部高度
const SCROLL_BOTTOM_HEIGHT = 200;
import { ref } from "vue";
export default {
  name: "ListPage",
  inheritAttrs: false,
  props: {
    myClass: {
      type: String,
      default: () => {
        return "";
      },
    },
    showBTN: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
  },
  setup() {
    let scrollTop = ref(0);
    let scrollHeight = ref(0);
    let trigged = ref(true); //防抖函数开关

    return {
      scrollTop,
      scrollHeight,
      trigged,
    };
  }, 
  beforeUnmount() {
    const scroller = this.$refs.scroller;
    scroller.removeEventListener("scroll", this.handleScroll);
  },
  mounted() {
    const scroller = this.$refs.scroller;
    scroller.addEventListener("scroll", this.handleScroll);
  },
  methods: {
    stick() {
      this.$refs.scroller.scrollTop = 0;
    },
    handleScroll(event) {
      const scroller = this.$refs.scroller;
      this.scrollTop = scroller.scrollTop;
      this.$emit("scrollEvent", event, scroller);
      this.$emit("scrollEventing", scroller.clientHeight, scroller.scrollTop);
      const toBottom =
        scroller.scrollHeight - scroller.clientHeight - this.scrollTop;
      // 当滚动条到一定高度就会调用通知方法,5s内触发一次
      if (toBottom <= SCROLL_BOTTOM_HEIGHT) {
        if (this.trigged) {
          this.trigged = false;
          setTimeout(() => {
            this.trigged = true;
          }, 500);
          this.$emit("scrollBottom", event, scroller);
        }
      }
      if (this.scrollTop === 0) {
        this.$emit("scrollTop", event, scroller);
      }
    },
    cacheScroll() {
      this.$refs.scroller.scrollTop = this.scrollTop;
    },
    scorllTo(top) {
      this.$refs.scroller.scrollTop = top;
    },
    scorllToend() {
      console.log(this.scrollHeight);
      this.$refs.scroller.scrollTop = this.scrollHeight;
    },
  },
};
</script>

<style lang="less">
.list-page-component::-webkit-scrollbar{width: 0 !important}
.list-page-component {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  overflow: scroll;
  .page-header {
    position: relative;
    z-index: 3;
    width: 100%;
  }

  .page-content {
    position: relative;
    flex: 1;
    z-index: 1;
    width: 100%;
  }

  .page-content.scrollable {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
.page-content.scrollable::-webkit-scrollbar{width: 0 !important}
  .page-content .swiper-slide {
    padding-bottom: 0.1rem;
  }

  .page-footer {
    width: 100%;
    position: relative;
    z-index: 3;
  }
}
</style>
