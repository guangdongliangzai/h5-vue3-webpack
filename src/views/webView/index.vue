<template>
  <div class="my_iframe">
    <iframe class="my_iframe" :src="urlData"></iframe>
  </div>
</template>
<style lang="less" scoped>
.my_iframe {
  width: 100vh;
  height: 100vh;
  margin: 0;
  padding: 0;
}
</style>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
export default {
  setup() {
    const route = useRoute();
    let urlData = ref("");
    onMounted(() => {
      urlData.value = route.query.urlData;
    });
    return {
      urlData,
    };
  },
};
</script>
