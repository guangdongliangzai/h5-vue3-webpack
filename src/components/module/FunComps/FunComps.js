<<<<<<< HEAD
// dynameic 组件
import { h } from "vue";

// Vue3 中函数式组件只能用函数式声明
const DynamicHeading = (props, context) => {
  console.log("函数组件", props);
  // return h(`div`, context.attrs, context.slots);
  return h(`div`, context.attrs, props.dar);
};

DynamicHeading.props = ["dar"];

=======
// dynameic 组件
import { h } from "vue";

// Vue3 中函数式组件只能用函数式声明
const DynamicHeading = (props, context) => {
  console.log("函数组件", props);
  // return h(`div`, context.attrs, context.slots);
  return h(`div`, context.attrs, props.dar);
};

DynamicHeading.props = ["dar"];

>>>>>>> 37d629dae9f346af1bd56f730d883069584567f2
export default DynamicHeading;