<template>
  <!-- 富文本编辑器组件 -->
  <div>
    <vue-editor
      id="editor"
      useCustomImageHandler
      @image-added="handleImageAdded"
      v-model="article"
      @text-change="change"
    ></vue-editor>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
import { Debounce } from "../../utils/loadsh";
export default {
  components: { VueEditor },
  props: ["content"],
  data() {
    return {
      article: this.content,
    };
  },
  mounted() {
    setTimeout(() => {
      this.article = this.content;
    }, 600);
  },
  methods: {
    // 编辑器中的图片上传,编辑器中一定要有 id="editor"
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      let formData = new FormData();
      formData.append("files", file); // 定义字段名
      const res = await this.axios.post("/api/upload", formData, {
        token: true,
      });
      Editor.insertEmbed(cursorLocation, "image", res.data);
      resetUploader();
    },
    // 编辑时
    change: Debounce(function () {
      this.$emit("change", this.article);
    }, 500),
  },
};
</script>
<style lang='scss' scoped>
</style>