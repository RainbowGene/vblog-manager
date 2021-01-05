<template>
  <!-- 添加/修改文章 -->
  <div>
    <div class="m-3">
      <!-- 卡片控件 -->
      <Card :bordered="false">
        <p slot="title">文章{{ key === "create" ? "添加" : "编辑" }}</p>
        <Form
          ref="form"
          :model="formItem"
          :rules="ruleValidate"
          :label-width="80"
        >
          <FormItem label="文章标题" prop="title">
            <Input v-model="formItem.title" placeholder="请输入标题" />
          </FormItem>
          <FormItem label="创作人">
            <Input v-model="nickname" readonly />
          </FormItem>
          <FormItem label="内 容">
            <!-- 内容编辑控件 -->
            <vue-editor
              id="editor"
              useCustomImageHandler
              @image-added="handleImageAdded"
              v-model="formItem.content"
            ></vue-editor>
          </FormItem>
          <FormItem label="封 面">
            <img
              v-if="formItem.cover"
              :src="formItem.cover"
              style="width: 40vw"
              alt=""
            />
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
            >
              <Button icon="ios-cloud-upload-outline" class="mt-2"
                >选择图片</Button
              >
            </Upload>
          </FormItem>
          <FormItem label="类 别" prop="type">
            <Select v-model="formItem.type_id" style="width: 200px">
              <Option v-for="(item, i) in typeList" :value="item.id" :key="i">{{
                item.typename
              }}</Option>
            </Select>
          </FormItem>
          <FormItem label="权重选择" prop="weight">
            <Select v-model="formItem.weight" style="width: 200px">
              <Option
                v-for="(item, i) in weightList"
                :value="item.key"
                :key="i"
                >{{ item.name }}</Option
              >
            </Select></FormItem
          >
          <FormItem>
            <Button type="primary" :loading="loading" @click="submit"
              >保存</Button
            >
          </FormItem>
        </Form>
      </Card>
    </div>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
import { mapState } from "vuex";
export default {
  components: { VueEditor },
  data() {
    return {
      key: "create", // 默认为创建文章
      nickname: "",
      formItem: {
        title: "",
        user_id: 0,
        type_id: 0,
        cover: "", // 封面地址
        content: "", // 内容
        weight: "", // 文章权重
      },
      typeList: [],
      loading: false,
      weightList: [
        { key: "ord", name: "一般文章" },
        { key: "star", name: "推荐文章" },
        { key: "swiper", name: "首页轮播" },
      ],
      coverList: [], // 上传图片列表
      // 表单验证
      ruleValidate: {
        title: [{ required: true, message: "请输入标题" }],
      },
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
    token: (state) => {
      return state.user ? state.user.token : null;
    },
  },
  created() {
    this.init();
  },
  methods: {
    // 表单初始化
    async init() {
      this.key = this.$route.params.key || "create";
      // 获取列表项
      this.getTypeList();
      if (this.$route.params.id) {
        // 如果有id传来则是修改/查看操作
        this.formItem.id = this.$route.params.id; // 文章id
        const res = await this.getArticleInfo(this.formItem.id);
        if (res) {
          // 绑定数据
          this.formItem.title = res.data.title;
          this.formItem.user_id = res.data.user_id;
          this.nickname = res.data.user.nickname || res.data.user.username;
          this.formItem.content = res.data.content;
          this.formItem.cover = res.data.cover;
          this.formItem.type_id = res.data.type_id;
          this.formItem.weight = res.data.weight;
        }
      } else {
        // 添加操作
        // 绑定创作人
        this.nickname = this.user.nickname;
        this.formItem.user_id = this.user.id;
        this.formItem.weight = this.weightList[0].key;
      }
    },
    // 获取类别列表
    getTypeList() {
      this.axios.get("/api/type/list", { token: true }).then((res) => {
        this.typeList = res.data;
        this.formItem.type_id = res.data[0].id;
      });
    },
    // 获取文章信息
    getArticleInfo(id) {
      return new Promise((resolve, reject) => {
        this.axios
          .get("/api/article/read/" + id, {
            token: true,
          })
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            this.$Message.error("文章获取失败!");
            this.$router.go(-1);
          });
      });
    },
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
    //#region 封面上传相关
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
      this.formItem.cover = res.data;
    },
    //#endregion
    // 添加文章
    submit() {
      this.$refs.form.validate((val) => {
        if (!val) return;
        this.loading = true;
        if (this.key === "create") {
          // 添加文章
          this.axios
            .post("/api/article/insert", this.formItem, { token: true })
            .then((res) => {
              this.$Message.success("添加成功！");
              this.$router.push({ name: "article" });
            })
            .catch((err) => (this.loading = false));
        } else {
          // 文章修改
          this.formItem.id = this.axios
            .post("/api/article/update", this.formItem, { token: true })
            .then((res) => {
              this.$Message.success("修改成功！");
              this.$router.push({ name: "article" });
            })
            .catch((err) => (this.loading = false));
        }
      });
    },
  },
};
</script>
<style lang='scss' scoped>
</style>