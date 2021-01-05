<template>
  <!-- 个人资料展示 -->
  <div class="p-3">
    <!-- 卡片控件 -->
    <Card :bordered="false">
      <p slot="title">个人资料</p>
      <div class="flex flex-colmun">
        <p class="mb-3">
          <span class="">头像</span>
          <Avatar
            icon="ios-person"
            size="large"
            :src="selfInfo.avatar || require('@/assets/img/defavatar.jpg')"
          />
        </p>
        <p class="mb-3"></p>
      </div>
    </Card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      selfInfo: {},
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
  },
  mounted() {
    console.log(this.user);
    this.selfInfo = this.user;
  },
  methods: {},
};
</script>
<style lang='scss' scoped>
</style>