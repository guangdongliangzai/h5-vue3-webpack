<template>
  <div class="scanningDiscount">
    <ListPage :myClass="'huiyang_coupon'" @scrollBottom="nextPage" :showBTN="showBTN">
      列表里边的东西
    </ListPage>
  </div>
</template>
<style lang="less" scoped></style>
<script>
import { onMounted } from "vue";
export default {
  setup() {
    onMounted(() => {});
    return {};
  },
  mounted() {},
  methods: {},
};
</script>
