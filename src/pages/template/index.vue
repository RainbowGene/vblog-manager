<template>
  <!-- 个人资料展示 -->
  <div class="bootstrap-iso p-3">
    <!-- 卡片控件 -->
    <Card :bordered="false">
      <div class="info-head">
        <div class="info-left">
          {{ $route.params.id ? "用户资料" : "个人资料" }}
        </div>
        <div class="info-right">
          <Button type="primary" @click="submit">提交修改</Button>
        </div>
      </div>
      <p class="border-bottom my-3"></p>
      <Form :model="selfInfo" :label-width="80">
        <div class="form-body">
          <div class="form-left">
            <FormItem label="用户名">
              <Input v-model="selfInfo.username" disabled />
            </FormItem>
            <FormItem label="昵称">
              <Input v-model="selfInfo.nickname" />
            </FormItem>
            <FormItem label="地址">
              <Input v-model="selfInfo.area" />
            </FormItem>
            <FormItem label="电话">
              <Input v-model="selfInfo.phone" />
            </FormItem>
            <FormItem label="签名">
              <Input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 5 }"
                placeholder="填写个性签名..."
                v-model="selfInfo.sign"
              />
            </FormItem>
          </div>
          <div class="form-right">
            <FormItem label="头像">
              <div class="avatar-con">
                <div class="avatar-left">
                  <Avatar :src="selfInfo.avatar" />
                </div>
                <div class="avatar-right ml-3">
                  <b-upload-img @handleUpload="uploadSuccess"></b-upload-img>
                </div>
              </div>
            </FormItem>
            <FormItem label="性别">
              <RadioGroup v-model="selfInfo.sex">
                <Radio label="男">男</Radio>
                <Radio label="女">女</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="权限">
              <RadioGroup v-model="selfInfo.auth">
                <Radio label="user">用户</Radio>
                <Radio label="admin">管理员</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="邮箱">
              <Input v-model="selfInfo.email" />
            </FormItem>
            <FormItem label="描述">
              <Input
                type="textarea"
                :autosize="{ minRows: 5, maxRows: 12 }"
                placeholder="填写描述..."
                v-model="selfInfo.desc"
              />
            </FormItem>
          </div>
        </div>
      </Form>
    </Card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import bUploadImg from "@/components/b-upload-img.vue";
export default {
  data() {
    return {
      id: 0, // 查看用户id
      selfInfo: {},
    };
  },
  components: {
    bUploadImg,
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
    auth() {
      return this.selfInfo.auth === admin;
    },
  },
  mounted() {
    if (this.$route.params.id) {
      // 传入id表示查看他人资料
      this.id = this.$route.params.id;
    } else {
      // 展示当前用户资料
      // this.selfInfo = JSON.parse(JSON.stringify(this.user)); // 浅拷贝
      this.id = this.user.id;
    }
    this.getData();
  },
  methods: {
    getData() {
      // 查看用户资料
      this.axios
        .get("/api/user/read/" + this.id, { token: true })
        .then((res) => {
          this.selfInfo = res.data;
        });
    },
    // 头像上传成功
    uploadSuccess(src) {
      this.selfInfo.avatar = src;
    },
    // 修改提交
    submit() {
      console.log(this.selfInfo);
      this.$Modal.confirm({
        title: "提示",
        content: "确认提交用户信息?",
        onOk: () => {
          this.axios
            .post("/api/user/update", this.selfInfo, { token: true })
            .then((res) => {
              this.$Message.success("修改成功");
              this.getData();
            })
            .catch((err) => {
              console.log(err);
            });
        },
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.form-body {
  display: flex;
  justify-content: space-between;

  .form-left {
    flex: 1;
  }

  .form-right {
    flex: 1;
  }
}

.info-head {
  display: flex;
  align-items: center;

  .info-right {
    margin-left: auto;
  }
}

.avatar-con {
  display: flex;
}
</style>