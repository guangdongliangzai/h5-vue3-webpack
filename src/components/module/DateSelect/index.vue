<template>
  <div class="date-select-components">
    <div class="data-type">
      <div class="year-div" @scroll="yearScroll" ref="yearItemBox">
        <!-- <div v-html="copyYear"></div> -->
        <div :style="{ transform: `translate(0px,${scrollTop_year}px)` }" ref="yearList">
          <div class="year-text" v-for="(item, i) in 40" :key="i">
            {{ item }}
          </div>
        </div>
      </div>
    </div>
    <div class="data-type"><div class="dsds">1</div></div>
    <div class="data-type"><div class="dsds">1</div></div>
  </div>
</template>
<style lang="less" scoped>
.date-select-components {
  width: 100%;
  height: 150px;
  display: flex;
  overflow: hidden;
  .data-type {
    flex: 1;
    overflow: hidden;
    height: 150px;
    .year-div {
      overflow-y: auto;
      height: 150px;
      transition: all 0ms ease-in 0s;
      .year-text {
        width: 100%;
        text-align: center;
        font-size: 18px;
        height: 30px;
        line-height: 30px;
        color: #222222;
      }
    }
  }
}
</style>
<script>
export default {
  name: "DateSelect",
};
</script>
<script setup>
let scrollTop_year = ref(0);
const year_translate = ref(true);
const yearItemBox = ref(null);
const yearList = ref(null);
// let copyYear = ref(null);
const yearScroll = () => {
  // console.log(
  //   yearItemBox.value.scrollTop,
  //   yearList.value.clientHeight,//1324
  //   yearItemBox.value.clientHeight//331
  // );
  console.log(yearItemBox.value.scrollTop);
  const toBottom =
    yearList.value.clientHeight -
    yearItemBox.value.scrollTop -
    yearItemBox.value.clientHeight;

  // console.log(toBottom);
  if (toBottom == 0 && toBottom > -1) {
    if (year_translate.value) {
      console.log("到底了");
      // scrollTop_year.value = yearList.value.clientHeight;
      yearItemBox.value.scrollTop = 0;
    }
  }
  // if (toBottom < 0 && (toBottom * -1) % yearList.value.clientHeight == 0) {
  //   if (year_translate.value) {
  //     console.log("到底了2");
  //     scrollTop_year.value = 0;
  //   }
  // }
  // if (
  //   yearItemBox.value.scrollTop <
  //   scrollTop_year.value - yearItemBox.value.clientHeight
  // ) {
  //   scrollTop_year.value = 0;
  // }
};

onMounted(() => {
  yearList.value.addEventListener("scroll", yearScroll);
  // console.log(yearList.value.innerHTML);
  // copyYear.value = yearList.value.innerHTML;
});
// const dateText = reactive({ year: "", month: "", day: "" });
</script>
