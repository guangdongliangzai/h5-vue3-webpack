import axios from "../request";
import { setSession, setLocal } from "@/tool/storage";
import API from "../index";

//获取登录的验证码
export async function getCode(data) {
    let res = await axios.post(API.getCode, data);
    return res.data || {};
}
//登录系统
export async function login(data) {
    let res = await axios.post(API.login, data);
    setSession("access_token", res.data.token || {});
    return res.data || {};
}
//退出系统
export async function logout(data) {
    let res = await axios.post(API.logout, data);
    return res.data || {};
}
//检查access_token是否过期
export async function checkToken(data) {
    let res = await axios.post(API.checkToken, data);
    return res.data || {};
}

//检测登录
export async function _checkIsOnline(data) {
    let res = await axios.post(API.checkIsOnline, data);
    if (res.data.error == 0) {
        setLocal("userInfo", res.data.data);
        setSession("access_token", res.data.data.access_token || false);
        return res.data.data;
    }
}

/**----------首页--------------- **/
//统计
export async function HomeStatistic(params) {
    let res = await axios.get(API.HomeStatistic, { params });
    return res.data || {};
}

export async function uploadPic(data) {
    let config = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        // transformRequest: [
        //     function (data) {
        //         console.log(data);
        //         // 对 data 进行任意转换处理
        //         return data;
        //     },
        // ],
    };
    let res = await axios.post(API.uploadPic, data, config);
    return res.data || {};

}

/**------------------------- **/
export async function isget(params) {
    let res = await axios.get(API.Storeindex, { params });
    return res.data || {};
}

export async function ispost(data) {
    let res = await axios.post(API.Storeindex, data);
    return res.data || {};
}

