// dynameic 组件
import { h } from "vue";

// Vue3 中函数式组件只能用函数式声明
const DynamicHeading = (props, context) => {
  console.log("函数组件", props);
  // return h(`div`, context.attrs, context.slots);
  return h(`div`, context.attrs, props.dar);
};

DynamicHeading.props = ["dar"];

export default DynamicHeading;