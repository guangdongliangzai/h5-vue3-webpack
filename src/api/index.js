let domain = process.env.VUE_APP_BASEURL;


const API = {
    uploadPic: `${domain}/user/nameVerify/idcardImage`, //上传照片
    login: `${domain}/tp5/channel/Auth/login`, //登录
    getCode: `${domain}/tp5/channel/Auth/getVerifyCode`, //获取验证码
    checkIsOnline: `${domain}/user/login/checkIsOnline`, //检测登录

    //首页
    Storeindex: `${domain}/tp5/api/store/Store/index`, // 首页数据



};

export default API;
