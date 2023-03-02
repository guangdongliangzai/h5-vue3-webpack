<template>
  <div class="is">
    <p>传递参数实例</p>
    <p>参数名字：{{ name }}</p>
    <p>变量：{{ $filters.dateTime(age) }}</p>
    <p>变量只读：{{ ageOne }}</p>
    <p>变量：<input v-model="age" /></p>
    <button @click="plusOne()">+</button>
    <p><button @click="beautiful()">美图</button></p>
    <p>人体数据：{{ humanData1 }}</p>
    <DefaultExample @userVideAgeAdd="plusOne" :name="name" />
    <div>
      <p>使用vuex</p>
      <p>{{ myGetters_value }}</p>
    </div>
    <dynamic-heading :dar="'攻城师'" />
  </div>
</template>
<script>
// import { ref, onMounted, provide, reactive, readonly, computed, shallowRef } from "vue";
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  setup() {
    let name = ref("憨狗");
    let age = ref(18);
    let humanData = shallowRef({ sex: 1, height: 198 });
    let humanData1 = ref({ sex: 1, height: 198 });
    //ref创建
    let dataModel = ref({});
    //reactive创建
    let location = reactive({
      longitude: 90,
      latitude: 135,
    });
    //提供参数-子组件可以通过inject获取
    provide("videAge", age);
    provide("videLocation", readonly(location)); //只读
    onMounted(() => {
      age.value = 10; //使用钩子
    });

    const ageOne = computed(() => age.value + "只读计算");
    function plusOne() {
      age.value++; //想改变值或获取值 必须.value
    }

    function beautiful() {
      humanData.value = { sex: 3, height: 898, width: 101 };
      humanData1.value.sex = 66;
      console.log("humanData", humanData.value); //更改单独属性不会触发视图更新
      console.log("humanData1", humanData1.value); //Proxy
    }
    return {
      //必须返回 模板中才能使用
      dataModel,
      name,
      age,
      ageOne,
      plusOne,
      beautiful,
      humanData,
      humanData1,
    };
  },
  computed: {
    ...mapGetters({
      myGetters_value: "defaultX/dfName",
    }),
  },
  mounted() {
    this.name = "这里也可以变更";
    this.m_edit(222); //使用vuex
  },
  methods: {
    //使用VUEX-Actions
    ...mapActions("defaultX", [
      "a_edit", // -> this.a_edit()
    ]),
    //使用VUEX-Mutations
    ...mapMutations("defaultX", [
      "m_edit", // -> this.a_edit()
    ]),
  },
};
</script>
