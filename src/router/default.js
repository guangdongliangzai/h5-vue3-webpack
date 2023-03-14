<<<<<<< HEAD
const ItemRoutes = [

    {
        //  选择地址
        path: "mapSelect",
        name: "DefaultMapSelect",
        meta: { keepAlive: true, login: false, title: "选择地址" },
        component: () => import("@/views/default/mapSelect.vue"),
    },
    {
        // 排行榜
        path: "rankingList",
        name: "RankingList",
        meta: { keepAlive: true, login: false, title: " " },
        component: () => import("@/views/default/List/index.vue"),
    },

];

export default ItemRoutes;
=======
const ItemRoutes = [

    {
        //  选择地址
        path: "mapSelect",
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
>>>>>>> 37d629dae9f346af1bd56f730d883069584567f2
