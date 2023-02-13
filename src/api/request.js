import axios from "axios";
// import router from "@/router/index";
import API from "@/api/index.js";
import { getSession } from "@/tool/storage";
// import { Toast } from "vant";
import md5 from "md5";
import qs from "qs";
axios.interceptors.request.use(
    (config) => {
        //console.log("请求", config)
        //对象属性过滤
        const hm_timestamp = Math.floor(Date.now() / 1000); // 时间戳，秒为单位
        let hm_nonce = ""; // 随机数，12位
        for (let i = 0; i < 12; i++) {
            hm_nonce += Math.floor(Math.random() * 10);
        }
        if (config.method === "get") {
            for (const key in config.params) {
                if (config.params[key] === "" || config.params[key] === {})
                    delete config.params[key];
            }
            const access_token = getSession("access_token");
            if (!config.params) {
                config.params = {};
            }
            config.params.terminal = "miniprogram"; // 添加来源
            config.params.format = "json";
            config.params.hm_timestamp = hm_timestamp;
            config.params.hm_nonce = hm_nonce;
            if (access_token != "" && access_token != {} && access_token != undefined && !config.params.access_token) {
                config.params.access_token = access_token;
            } else {
                delete config.params.access_token;
            }
        }
        if (config.method === "post") {
            const access_token = getSession("access_token");
            if (!config.data) {
                config.data = {};
            }
            if (access_token != "" && access_token != undefined && !config.data.access_token) {
                config.data.access_token = access_token;
            }
            if (config.data.access_token == "") {
                delete config.data.access_token;
            }
            config.data.terminal = "miniprogram"; // 添加来源
            config.data.format = "json";
            config.data.hm_timestamp = hm_timestamp;
            config.data.hm_nonce = hm_nonce;
            const paramsArr = Object.keys(config.data).sort();
            let paramsStr = ""; // 拼接数字签名
            paramsArr.forEach((item) => {
                if (config.data[item] !== "" && config.data[item] !== "undefined") {
                    paramsStr += `${item}=${encodeURIComponent(config.data[item])}&`;
                }
            });
            paramsStr =
                paramsStr.slice(0, -1) + "66666666";
            console.log(config.url, paramsStr)
            const hm_sign = md5(paramsStr).toUpperCase(); // 签名
            config.data.hm_sign = hm_sign
            config.data = qs.stringify(config.data);

        }
        // debugger
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// 跨域请求，允许保存cookie
// axios.defaults.withCredentials = true;

axios.defaults.baseURL = API.domain;
axios.interceptors.response.use(
    (res) => {
        const status = Number(res.status) || 200;
        if (status != 200) {
            console.log("res", res || "");
            return Promise.reject(new Error("请求失败"));
        }
        // const { code, msg } = res.data;
        // if (code != 200) {
        //   Toast(msg);
        // }
        return res || { code: 500, data: {} };
        // if (res.data.code === 401) {
        //   router.push({ path: "/login" });
        //   return;
        // }
    },
    (error) => {
        return Promise.reject(new Error(error));
    }
);

export default axios;
