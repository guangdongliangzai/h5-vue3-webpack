<template>
  <div class="mapSelect">
    <div ref="mapBox" class="mapBox"></div>
    <div class="search">
      <div class="searchcity">{{ city }}</div>
      <div class="searchinput">
        <van-search
          v-model="keyword"
          shape="round"
          :left-icon="imge"
          placeholder="请输入搜索关键词"
          clearable
          @input="getSuggestions"
        />
      </div>
    </div>
    <!-- <div class="go_my_address" @click="locate">
      <van-icon name="aim" />
    </div> -->
    <div class="addresslist">
      <div
        class="address_item"
        v-for="item in suggestionList"
        :key="item.id"
        @click="select_in(item)"
      >
        <div class="title">
          {{ item.title }}
        </div>
        <div class="value">
          {{ item.address }}
        </div>
        <img src="~@/assets/img/huiyang/index/address_icon.png" class="icon_location" />
      </div>
    </div>

    <!-- <van-popup v-model="ProvinceShow" position="bottom" :style="{ height: '50%' }">
      <van-picker title="选择省份" show-toolbar :default-index="province_id" :value-key="'ext_name'" :columns="columnsProvince" @confirm="onConfirmProvince" @cancel="ProvinceShow = false" />
    </van-popup>
    <van-popup v-model="CityPicker" class="popupCity" round position="bottom">
      <van-picker title="选择城市" show-toolbar :default-index="cityid" :columns="columnsCity" @confirm="onConfirmCity" @cancel="CityPicker = false" />
    </van-popup> -->
  </div>
</template>
<script>
// import { mapMutations, mapActions } from "vuex";
// import { getLocalStorage } from "@/tool/util";
import imge from "@/assets/img/huiyang/index/ic_classification.png";
//在index.html页面写入自己的key
const TMap = window.TMap;
import { Search } from "vant";
export default {
  components: {
    "van-search": Search,
  },
  data() {
    return {
      imge,
      CityPicker: false,
      ProvinceShow: false,
      my_map: null, //选择的位置
      my_marker: false,
      coordinate: {},
      city: "深圳市",
      cityid: 0,
      keyword: "",
      suggestionList: [],
      columnsCity: [],
      columnsProvince: [],
      isSuggestions: true, //防抖
      province: "",
      province_id: 0,
      lng: "",
      lat: "",
    };
  },
  mounted() {
    console.log(this.$route.query);
    if (this.$route.query.city) {
      this.city = this.$route.query.city;
    }
    this.lng = this.$route.query.lng;
    this.lat = this.$route.query.lat;
    this.$nextTick(() => {
      this.initMap();
      //   this.districtList(0, {});
    });
  },
  activated() {
    if (this.$route.query.city) {
      this.city = this.$route.query.city;
      this.getSuggestions(); //获取搜索地址
    }
  },
  methods: {
    initMap() {
      let self = this;
      this.my_map = new TMap.Map(this.$refs.mapBox, {
        rotation: 0, //设置地图旋转角度
        pitch: 0, //设置俯仰角度（0~45）
        zoom: 16,
        center: new TMap.LatLng(this.lat, this.lng),
      });
      this.my_map.setViewMode("2D");
      this.my_map.on("click", (evt) => {
        var lat = evt.latLng.getLat().toFixed(6);
        var lng = evt.latLng.getLng().toFixed(6);
        console.log(lat, lng);
        self.createMarker(lat, lng);
        // convert()
        self.convert(lat, lng);
      });
      //移除旋转控件
      if (this.my_map.getControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION)) {
        this.my_map.removeControl(TMap.constants.DEFAULT_CONTROL_ID.ROTATION);
      }
      const control = this.my_map.getControl(TMap.constants.DEFAULT_CONTROL_ID.ZOOM);
      control.setPosition(TMap.constants.CONTROL_POSITION.BOTTOM_RIGHT);
      //获取自己的定位
      //   this.locate();
      this.getSuggestions(); //获取搜索地址
    },
    //获取自己位置
    locate() {
      var ipLocation = new TMap.service.IPLocation(); // 新建一个IP定位类
      ipLocation
        .locate({})
        .then((result2) => {
          console.log(result2);
          // 未给定ip地址则默认使用请求端的ip
          const { lat, lng } = result2.result.location;
          const { city } = result2.result.ad_info;
          this.city = city;
          // const txt = `您的IP/您输入的IP所在位置：${result2.result.ad_info.nation}，${result2.result.ad_info.province}`;
          this.$nextTick(() => {
            this.createMarker(lat, lng);
            this.my_map.setCenter(result2.result.location);
            this.my_map.setViewMode("2D");
            this.keyword = "";
            this.getSuggestions(); //获取搜索地址
          });
        })
        .catch((error) => {
          console.log("无法获取定位", error.message);
        });
    },
    //创建遮盖物
    createMarker(lat, lng) {
      if (this.my_marker) {
        this.my_marker.setMap(null);
        this.my_marker = false;
      }
      this.my_marker = new TMap.MultiMarker({
        id: "marker-layer",
        map: this.my_map,
        styles: {
          marker: new TMap.MarkerStyle({
            width: 25,
            height: 35,
            anchor: { x: 16, y: 32 },
            src: "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/markerDefault.png",
          }),
        },
        geometries: [
          {
            id: "demo",
            styleId: "marker",
            position: new TMap.LatLng(lat, lng),
            properties: {
              title: "marker",
            },
          },
        ],
      });
    },
    // 解析地址
    convert(myLatitude, myLongitude) {
      var geocoder = new TMap.service.Geocoder(); // 新建一个正逆地址解析类
      var location = new TMap.LatLng(myLatitude, myLongitude);
      geocoder
        .getAddress({
          location: location,
        }) // 将给定的坐标位置转换为地址
        .then((result) => {
          console.log(result.result);
          this.suggestionList.unshift({
            location: {
              lat: myLatitude,
              lng: myLongitude,
              height: 0,
            },
            province: result.result.address_component.province,
            city: result.result.address_component.city,
            district: result.result.address_component.district,
            title: "选择的点",
            address: result.result.address,
          });
        });
    },
    //地址转为坐标
    LatLng_value(txt) {
      var geocoder = new TMap.service.Geocoder(); // 新建一个正逆地址解析类
      // 将给定的地址转换为坐标位置
      geocoder
        .getLocation({
          address: txt,
        })
        .then((result) => {
          const { lat, lng } = result.result.location;
          this.createMarker(lat, lng);
          this.my_map.setCenter(result.result.location);
          this.coordinate = result.result.location;
          console.log(this.coordinate.toString());

          // 显示坐标数值
        });
    },
    getSuggestions() {
      if (!this.isSuggestions) {
        return;
      }
      this.isSuggestions = false;
      // 使用者在搜索框中输入文字时触发
      setTimeout(() => {
        const suggest = new TMap.service.Suggestion({
          // 新建一个关键字输入提示类
          pageSize: 10, // 返回结果每页条目数
          region: this.city, // 限制城市范围
          regionFix: true, // 搜索无结果时是否固定在当前城市
        });
        suggest
          .getSuggestions({
            keyword: this.keyword || this.city,
            location: this.my_map.getCenter(),
          })
          .then((result) => {
            this.suggestionList = result.data;
            console.log(this.suggestionList);
            // suggestionList.forEach((item, index) => {
            // 	suggestionListContainer.innerHTML += `<li><a href="#" onclick="setSuggestion(${index})">${item.title}<span class="item_info">${item.address}</span></a></li>`
            // })
          })
          .catch((error) => {
            console.log(error);
          });
        this.isSuggestions = true;
      }, 1000);
    },
    select_in({ address, location }) {
      //  province, city, district,
      let txt = address;
      // txt = txt.replace(province, "");
      // txt = txt.replace(city, "");
      // txt = txt.replace(district, "");
      this.$router.replace({
        path: "/huiyangShop/index/decorate",
        query: { address: txt, lat: location.lat, lng: location.lng },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.mapSelect {
  text-align: left;

  .mapBox {
    z-index: 1;
    width: 375px;
    height: 320px;
  }

  .search {
    z-index: 9;
    width: 351px;
    height: 43px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    border-radius: 22px;
    position: absolute;
    top: 35px;
    left: 12px;
    display: flex;

    .searchcity {
      width: 82px;
      height: 43px;
      background-color: #fcd63b;
      font-size: 15px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 43px;
      color: #222222;
      text-align: center;
      border-top-left-radius: 22px;
      border-bottom-left-radius: 22px;
    }

    .searchinput {
      flex: 1;
      border-top-right-radius: 22px;
      border-bottom-right-radius: 22px;
      background-color: #ffffff;
      width: 250px;

      .van-search {
        padding: 0 0;
        padding-top: 5px;
        //  line-height: 43px;
        border-top-right-radius: 22px;
        border-bottom-right-radius: 22px;

        .van-search__content {
          background-color: #ffffff;
        }
      }
    }
  }

  .go_my_address {
    width: 30px;
    height: 30px;
    position: absolute;
    top: 230px;
    left: 20px;
    border-radius: 50%;
    background-color: #ffffff;
    font-size: 20px;
    text-align: center;
    line-height: 30px;
    padding-top: 3px;
    z-index: 5;
  }

  .addresslist {
    position: absolute;
    top: 300px;
    bottom: 0;
    z-index: 2;
    background-color: #ffffff;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    height: calc(100vh - 300px);
    overflow-y: auto;
    padding: 20px 15px;
    width: 375px;

    .address_item {
      position: relative;
      padding: 12px 0;
      border-bottom: 1px solid #dddddd;

      .title {
        width: 300px;
        font-size: 17px;
        font-family: PingFang SC;
        font-weight: bold;
        line-height: 30px;
        height: 30px;
        color: #111111;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .value {
        width: 300px;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 17px;
        height: 17px;
        color: #999999;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .icon_location {
        position: absolute;
        top: 20px;
        right: 0;
        width: 16px;
        height: 22px;
        font-size: 26px;
      }
    }

    .address_item:last-child {
      border-bottom: 0;
    }
  }

  .popupCity {
    width: 375px;
    height: 300px;
  }
}
</style>
<style>
.van-cell {
  align-items: center;
}
</style>
