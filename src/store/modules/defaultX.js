//组件通过 this.$store.dispatch(''，data) 对actions 的方法，然后用commit对mutations操作
const defaultX = {
  namespaced: true,
  state: () => ({
    //存放键值所在的管理状态
    name: 123,
    checkStateOk: false,
  }),
  getters: {
    //使用this.$store.getters.g_name   可以获取state中的name值
    dfName: (state) => {
      return state.name;
    },
  },
  actions: {
    a_edit(context, value) {
      return new Promise((resolve) => {
        setTimeout(() => {
          context.commit("m_edit", value);
          resolve();
        }, 2000);
      });
    },
  },
  mutations: {
    m_edit(state, value) {
      state.name = value;
    },
  },
};
export default defaultX;
