<template>
  <!-- <el-dialog width="600px" title="请选择支付方式" :visible.sync="ispay" class="show_box" :modal="false" :close-on-click-modal="false" :lock-scroll="false">
    <div class="balance" v-if="balance && pay_code == 'balance'">
      账户余额： ￥{{ balance }}
    </div>
    <div class="paylist">
      <el-radio v-model="pay_code" :label="'balance'" @change.native="Paygateway" border :disabled="pay_amount > balance">余额支付</el-radio>
      <el-radio v-model="pay_code" border label="weixin" @change.native="Paygateway">微信支付</el-radio>
      <el-radio v-model="pay_code" border label="alipay" @change.native="Paygateway">支付宝</el-radio>
    </div>
    <img class="qr_code" v-if="pay_code != 'balance' && !retUrl" :src="qr_code_image" />
    <div class="pay_title" v-if="!retUrl">支付金额：{{ pay_amount }}</div>
    <div class="pay_title" v-if="!retUrl">
      请在{{ expire_second_txt.hours }}时{{ expire_second_txt.minute }}分{{
        expire_second_txt.second
      }}秒内完成支付
    </div>

    <div class="pay_title" v-if="retUrl">
      支付成功，将在{{ retUrl }}秒后跳转订单页
    </div>
    <el-button type="danger" class="balancebtn" :loading="confirmpay" v-if="pay_code == 'balance' && !retUrl" @click="Paybalance">余额支付</el-button>
  </el-dialog> -->
  <div></div>
</template>

<script>
import { getSession } from "@/tool/storage";

import API from "@/api/index";
export default {
  props: {
    order_id: {
      type: String,
      default: () => {
        return "";
      },
    },
  },

  data() {
    return {
      form: { keyword: "" },
      access_token: getSession("access_token"),
      //支付相关
      ispay: false, //支付窗口
      intsecond: null, //支付定时器
      expire_second: 0, //支付倒计时-创建支付单
      qr_code_image: false, //支付二维码
      pay_code_list: [
        { key: "balance", text: "余额支付" },
        { key: "weixin", text: "微信支付" },
        { key: "alipay", text: "支付宝" },
      ], //可以选择的支付方式
      pay_code: "balance", //支付方式
      inOrderId: 0, //正在支付的订单
      confirmpay: false,
      retUrl: 0,
      intsecondret: null,
      balance: 0,
      pay_amount: 0,
      expire_second_txt: {
        hours: 0,
        minute: 0,
        second: 0,
      },
    };
  },

  created() {
    this.init();
  },

  destroyed() {
    clearInterval(this.intsecond);
    clearInterval(this.intsecondret);
  },

  methods: {
    ...mapActions([
      "OpenOrderPaycreate",
      "OpenOrderPaydetail",
      "OpenOrderPaygateway",
      "channelBalant",
    ]),
    //详情顶部
    async init() {
      var data = {};
      let res = await this.channelBalant(data);
      this.balance = res.balance || 0;
    },
    //创建支付单
    async Paycreate() {
      const res = await this.OpenOrderPaycreate({
        order_id: this.order_id,
      });
      const { code, data, msg, error } = res;
      if (error === 0) {
        const { expire_second, id, pay_amount } = data;
        this.expire_second = expire_second || 0; //支付倒计时
        this.pay_amount = pay_amount * 1;
        this.inOrderId = id;
        this.ispay = true;
        this.intsecond = setInterval(() => {
          this.expire_second--;
          this.expire_second_txt = {
            hours: Math.floor(this.expire_second / 60 / 60)
              .toString()
              .padStart(2, 0),
            minute: Math.floor((this.expire_second / 60) % 60)
              .toString()
              .padStart(2, 0),
            second: parseInt(this.expire_second % 60)
              .toString()
              .padStart(2, 0),
          };
          if (this.expire_second <= 0) {
            this.ispay = false;
            this.clearpay();
            this.$message.error("支付超时，请刷新页面重新发起支付订单");
          }
          //两秒发起一次轮询
          if (this.expire_second % 2 == 0 && this.pay_code != "balance") {
            this.Paydetail();
          }
        }, 1000);
        //打开支付界面--等待支付
        console.log(data);
      } else {
        this.$message.error(msg);
      }
    },
    //获取支付二维码
    async Paygateway() {
      if (this.pay_code === "balance") {
        return;
      }
      const res = await this.OpenOrderPaygateway({
        id: this.inOrderId,
        pay_code: this.pay_code,
      });
      const { code, data, msg, error } = res;
      if (error === 0) {
        if (this.pay_code === "balance") {
          const { pay_amount } = data;
          let resa = await this.channelBalant({});
          this.balance = resa.balance || 0;
          this.$message.success(`支付成功，余额剩余￥${this.balance}`);
        } else {
          const { qr_code_image } = data;
          this.qr_code_image = qr_code_image;
        }
      } else {
        this.$message.error(msg);
      }
    },
    //余额支付
    async Paybalance() {
      const res = await this.OpenOrderPaygateway({
        id: this.inOrderId,
        pay_code: this.pay_code,
      });
      const { code, data, msg, error } = res;
      if (error === 0) {
        if (this.pay_code === "balance") {
          const { pay_amount } = data;
          this.tocart();
          let resa = await this.channelBalant({});
          this.balance = resa.balance || 0;
          this.$message.success(`支付成功，余额剩余￥${this.balance}`);
        }
      } else {
        this.$message.error(msg);
      }
    },
    //轮询支付单
    async Paydetail() {
      const res = await this.OpenOrderPaydetail({
        id: this.inOrderId,
      });
      const { code, data, msg, error } = res;
      if (error === 0) {
        const { pay_status } = data;
        if (pay_status == 1) {
          this.clearpay();
          this.tocart();
          this.$message.success(`支付成功`);
        }
        // this.ispay = false;
      }
    },
    //重置支付
    clearpay() {
      if (this.intsecond) {
        clearInterval(this.intsecond);
      }
      this.inOrderId = 0;
      this.pay_code = "balance";
      this.qr_code_image = false;
    },
    tocart() {
      this.retUrl = 6;
      let self = this;
      this.intsecondret = setInterval(() => {
        self.retUrl--;
        if (self.retUrl <= 1) {
          if (self.$route.name === "orderCenter") {
            window.location.reload();
          } else {
            self.$router.push({ path: "/orderCenter" });
          }
          self.retUrl = 0;
          clearInterval(self.intsecondret);
        }
      }, 1000);
    },
    async oldOrder() {
      const res = await this.OpenOrderPaydetail({
        id: this.$route.query.orderid,
      });
      const { code, data, msg, error } = res;
      if (error === 0) {
        const { expire_second, id } = data;
        this.expire_second = expire_second; //支付倒计时
        this.inOrderId = id;
        this.ispay = true;
        this.intsecond = setInterval(() => {
          this.expire_second--;
          this.expire_second_txt = {
            hours: Math.floor(this.expire_second / 60 / 60)
              .toString()
              .padStart(2, 0),
            minute: Math.floor((this.expire_second / 60) % 60)
              .toString()
              .padStart(2, 0),
            second: parseInt(this.expire_second % 60)
              .toString()
              .padStart(2, 0),
          };

          if (this.expire_second <= 0) {
            this.ispay = false;
            this.clearpay();
            this.$message.error("支付超时，请重新发起支付订单");
          }
          //两秒发起一次轮询
          if (this.expire_second % 2 == 0 && this.pay_code != "balance") {
            this.Paydetail();
          }
        }, 1000);
        //打开支付界面--等待支付
      }
    },
  },
};
</script>

<style scoped lang="less">
.container {
  margin-bottom: 0 !important;
  padding: 0 !important;
}
.basic-container {
  padding: 7px 0px;
  border-radius: 10px;
  box-sizing: border-box;

  .goods_list {
    width: 1300px;
    max-height: 600px;
    padding-top: 10px;
    overflow-x: auto;
    .goods_item {
      width: 1250px;
      height: 140px;
      margin-bottom: 20px;
      padding-top: 5px;
      box-shadow: 5px 3px 5px 2px #cccc;
      border-left: 1px dotted #cccc;
      display: flex;
      padding-left: 15px;
      .goods_goods {
        width: 450px;
        display: flex;
        padding-top: 5px;
        .goods_thumb {
          margin-top: 10px;
          width: 100px;
          height: 100px;
          display: block;
        }
        .goods_text {
          flex: 1;
          text-align: left;
          padding-left: 10px;
          padding-top: 10px;
          line-height: 30px;
          p {
            margin: 0;
          }
          .name {
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            -webkit-box-orient: vertical;
          }
          .type_1 {
            border: 1px solid #574bf8;
            padding: 1px 6px;
            border-radius: 20px;
            margin-right: 6px;
            color: #574bf8;
          }
          .goods_img_mini {
            display: inline-block;
            width: 30px;
            vertical-align: top;
            margin-left: 10px;
          }
        }
      }

      .goods_mun {
        width: 50px;
        text-align: center;
        line-height: 140px;
      }
      .goods_subtotal {
        width: 100px;
        line-height: 140px;
        text-align: center;
      }
      .good_address {
        width: 350px;
        padding-top: 20px;
        p {
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 21;
          -webkit-box-orient: vertical;
        }
      }
      .good_address2 {
        line-height: 140px;
      }
      .goods_operation {
        flex: 1;
        line-height: 140px;
        text-align: center;
      }
      .goods_tips {
        width: 120px;
        line-height: 140px;
        color: red;
      }
    }
  }
  .goods_bottom {
    display: flex;
    width: 1180px;
    padding-left: 20px;
    .bottom_left {
      flex: 1;
    }
    .operation2_left {
      width: 200px;
      padding-right: 30px;
      text-align: center;
      p {
        line-height: 20px;
      }
    }
    .operation2_right {
      line-height: 50px;
    }
  }
}
//支付css
.show_box {
  .pay_title {
    width: 400px;
    margin: auto;
    text-align: left;
    font-size: 20px;
    color: red;
    line-height: 30px;
    padding-bottom: 30px;
  }
  .balance {
    width: 400px;
    margin: auto;
    padding-bottom: 20px;
  }
  .paylist {
    width: 400px;
    margin: auto;
  }
  .pay_title {
    font-size: 16px;
  }
  .qr_code {
    width: 200px;
    display: block;
    margin: auto;
  }
  .balancebtn {
    margin: auto;
    display: block;
  }
}

.address_list {
  width: 700px;
  height: 500px;
  overflow-y: auto;
  margin: auto;
  .address_item {
    width: 650px;
    box-shadow: 5px 3px 5px 0 #cecececc;
    border: 1px solid #d5d5d58f;
    border-radius: 10px;
    margin: auto;
    margin-top: 20px;
    padding: 12px;
    padding-top: 0;
    ._item {
      padding-top: 15px;
      span {
        margin-left: 20px;
      }
      .idcard {
        margin-left: 20px;
        width: 40px;
        height: 25px;
      }
    }
  }
}

/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

/deep/ input::-webkit-outer-spin-button {
  -webkit-appearance: none !important;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
