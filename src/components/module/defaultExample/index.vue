<template>
  <div class="hello">
    <p class="son">子组件数值：{{ userVideAge }}</p>
    <button @click="looks()">子组件：{{ name }}age+1</button>
    <button @click="add_my()">子组件2：{{ name }}age+1</button>
  </div>
</template>
<script>
import { inject } from "vue";
export default {
  name: "DefaultExample",
  props: {
    name: String,
  },
  setup(props, context) {
    console.log("props", props); //可以在这用
    let userVideAge = inject("videAge", 0); //接受传递过来的参数
    function add_my() {
      context.emit("userVideAgeAdd");
    }

    return {
      userVideAge,
      add_my,
    };
  },
  methods: {
    //子组件不能变更-本方法无效
    looks() {
      console.log(this.userVideAge);
      this.$emit("userVideAgeAdd");
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.son {
  color: #42b983;
}
</style>
