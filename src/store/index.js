import { createStore } from "vuex";
const files = require.context("./modules", true, /\.js$/);
const modules = {};

files.keys().forEach((key) => {
  modules[key.replace(/(\.\/|\.js)/g, "")] = files(key).default;
});

console.log("module", modules);
export default createStore({
  modules: {
    ...modules,
  },
});
