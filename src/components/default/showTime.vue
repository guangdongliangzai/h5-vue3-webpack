<template>
  <van-popup teleport="body" v-model:show="showScreens" class="default-showTime-components">
    <div class="top_box">
      <div class="time_btn">
        <div class="date">日期</div>
        <input type="text" class="time_txt" v-model="start_time" placeholder="开始日期" @click="isTimeType = 0" readonly />
        <div class="center_txt">至</div>
        <input class="time_txt" type="text" v-model="end_time" placeholder="结束日期" @click="isTimeType = 1" readonly />
        <div class="clean_btn" @click="clean">清除</div>
      </div>
      <div class="top_btn">
        <div class="top_btn_1" @click="cancel">取消</div>
        <div class="top_btn_1  disable " :class="{trueRun:start_time&&end_time}" @click="onconfirmTime">
          确定
        </div>
      </div>
    </div>
    <div class="bottom_box">
      <van-datetime-picker v-model="currentDate" :type="btnType" :title="''" :min-date="minDate" :cancel-button-text="'取消'" @cancel="cancel" :max-date="maxDate" @confirm="confirmTime" :formatter="formatter" />
    </div>
  </van-popup>
</template> 
<style lang="less"  >
.van-picker__confirm {
  color: #2ba8df;
}
.default-showTime-components {
  width: 375px !important;
  height: 100vh !important;
  background-color: transparent !important;
  padding: 0 !important;

  .top_box {
    width: 375px;
    height: 147px;
    background-color: #ffffff;
    font-size: 15px;
    .time_btn {
      display: flex;
      padding-top: 23px;
      text-align: center;
      align-items: center;
      justify-content: center;
      .date {
        width: 50px;
      }
      .clean_btn {
        width: 50px;
      }
      .center_txt {
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 28px;
        color: #222222;
        margin: 0 10px;
      }

      .time_txt {
        text-align: center;
        width: 108px;
        height: 28px;
        border: 1px solid #999999;
        color: #222222;
        &::placeholder {
          color: #999999;
        }
      }
    }

    .top_btn {
      display: flex;
      margin-left: auto;
      margin-right: 0;
      padding-top: 34px;
      width: 200px;

      .top_btn_1 {
        width: 88px;
        height: 28px;
        background: rgba(255, 255, 255, 0.39);
        border: 1px solid #dddddd;
        margin-right: 18px;
        font-size: 15px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 28px;
        color: #222222;
        text-align: center;

        &.disable {
          background-color: #eeeeee;
          color: #999999;
        }

        &.trueRun {
          background-color: #fcd63b;
          color: #222222;
          border: 0;
        }
      }
    }
  }

  .bottom_box {
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: #ffffff;
    width: 375px;
  }
}
</style>
<script>
// import { dealdate } from "@/tool/data.js";
import { Popup, DatetimePicker } from "vant";
import { ref } from "vue";
export default {
  components: {
    "van-popup": Popup,
    "van-datetime-picker": DatetimePicker,
  },
  props: {
    showScreen: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    btnType: {
      type: String,
      default: () => {
        return "date";
      },
    },
    clearb: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  setup(props) {
    console.log("99999");
    let start_time = ref("");
    let end_time = ref("");
    let isTimeType = ref(0);
    let minDate = ref(new Date(2020, 0, 1));
    let maxDate = ref(new Date(2525, 10, 1));
    let currentDate = ref(new Date());
    let showScreens = ref(props.showScreen);
    return {
      start_time,
      end_time,
      isTimeType,
      minDate,
      maxDate,
      currentDate,
      showScreens,
    };
  },
  watch: {
    showScreen(newValue) {
      this.showScreens = newValue;
    },
    clearb(newValue) {
      if (newValue == true) {
        this.start_time = "";
        this.end_time = "";
      }
    },
  },
  methods: {
    formatter(type, val) {
      if (type === "year") {
        return val + "年";
      }
      if (type === "month") {
        return val + "月";
      }
      if (type === "day") {
        return val + "日";
      }
      if (type === "hour") {
        return val + "时";
      }
      if (type === "minute") {
        return val + "分";
      }
      return val;
    },
    cancel() {
      this.clean();
      this.$emit("cancelTime");
    },
    clean() {
      this.isTimeType = 0;
      this.start_time = "";
      this.end_time = "";
    },
    confirmTime() {
      const datad = Date.parse(new Date(this.currentDate));
      let txt = "YYYY-MM-DD";
      if (this.btnType == "datetime") {
        txt = "YYYY-MM-DD HH:mm";
      }
      if (!this.isTimeType) {
        this.start_time = this.$filters.dateTime(datad, txt);
        this.isTimeType = 1;
      } else {
        this.end_time = this.$filters.dateTime(datad, txt);
      }
    },
    onconfirmTime() {
      this.$emit("confirmTime", {
        start_time: this.start_time || "",
        end_time: this.end_time || "",
      });
    },
  },
};
</script>

 
 