const ItemRoutes = [

    {
        //  选择地址
        path: "default/mapSelect",
        name: "DefaultMapSelect",
        meta: { keepAlive: true, login: false, title: "选择地址" },
        component: () => import("@/views/default/mapSelect.vue"),
    },
    {
        // 排行榜
        path: "rankingList",
        name: "rankingList",
        meta: { title: "" },
        component: () => import("@/views/default/List/index.vue"),
    },

];

export default ItemRoutes;
