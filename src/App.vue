<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  mounted() {
    this.init();
  },
  methods: {
    // 初始化当前用户信息
    init() {
      this.$store.dispatch("initUser");
    },
  },
};
</script>

<style>
</style>
