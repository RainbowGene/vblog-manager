<template>
  <!-- 基于iview的图片上传组件 -->
  <div>
    <Upload
      :headers="{
        token,
      }"
      :format="['jpg', 'jpeg', 'png']"
      :max-size="2048"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :on-success="onSuccess"
      action="/api/upload"
      :show-upload-list="false"
    >
      <Button size="small" icon="ios-cloud-upload-outline" class="mt-2">上传图片</Button>
    </Upload>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
    token: (state) => {
      return state.user ? state.user.token : null;
    },
  },
  methods: {
    // 上传文件类型错误的回调
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件类型错误",
        desc: "仅限jpg/jpeg/png类型文件",
      });
    },
    // 上传文件太大的回调
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "文件过大",
        desc: "上传文件大小不能超过2M",
      });
    },
    // 文件上传之前
    handleBeforeUpload(file) {},
    // 上传成功
    onSuccess(res, file, fileList) {
      this.$emit("handleUpload", res.data);
    },
  },
};
</script>
<style lang='scss' scoped>
</style>