const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
const Timestamp = new Date().getTime();
const AutoImport = require("unplugin-auto-import/webpack");
// const Components = require("unplugin-vue-components/webpack");
// const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");

module.exports = {
  publicPath: "/",
  // assetsDir: "static",
  productionSourceMap: false,
  configureWebpack: {
    // webpack 配置
    plugins: [
      AutoImport({
        imports: ['vue', 'vue-router', 'vuex'],
        eslintrc: {
          enabled: false, // 默认false, true启用。生成一次就可以，避免每次工程启动都生成
          filepath: './.eslintrc-auto-import.json', // 生成json文件,eslintrc中引入
          globalsPropValue: true,
        },
      }),
      // Components({
      //   resolvers: [ElementPlusResolver()],
      // }),
    ],
    output: {
      // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
      filename: `js/[name].${process.env.VUE_APP_Version}.${Timestamp}.js`,
      chunkFilename: `js/[name].${process.env.VUE_APP_Version}.${Timestamp}.js`,
    },
  },
  css: {
    loaderOptions: {
      postcss: {
        less: {
          javascriptEnabled: true
        },
        plugins: [
          require("autoprefixer")({
            overrideBrowserslist: ["Android >= 4.0", "iOS >= 7"],
          }),
          require("postcss-plugin-px2rem")({
            rootValue: 37.5, //换算基数， 默认100  ，可以设置为75这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多上px了。
            // unitPrecision: 5, //允许REM单位增长到的十进制数字。
            //propWhiteList: [],  //默认值是一个空数组，这意味着禁用白名单并启用所有属性。
            propBlackList: ["vant"], //黑名单
            exclude: /(node_module)/, //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)\/如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
            // selectorBlackList: [], //要忽略并保留为px的选择器
            // ignoreIdentifier: false,  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
            // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
            mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
            unitPrecision: 2,
            minPixelValue: 3, //设置要替换的最小像素值(3px会被转rem)。 默认 0
          }),
        ],
      },
    },
  },
};
