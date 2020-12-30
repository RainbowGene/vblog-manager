<template>
  <div class="d-flex justify-content-center main">
    <div class="form-main mx-auto bg-white rounded p-3">
      <!-- 头部 -->
      <div class="d-flex flex-column align-items-center justify-center mb-4">
        <div class="d-flex align-items-center">
          <Icon type="md-briefcase" size="55" color="#2db7f5"></Icon>
          <h3 class="text-muted ml-2">博客后台</h3>
        </div>
        <span class="text-muted small my-3">GeneClycle</span>
      </div>
      <!-- 表单 -->
      <Form ref="form" :label-width="0" :model="formItem" :rules="rules">
        <FormItem prop="username">
          <Input v-model="formItem.username" placeholder="请输入用户名" />
        </FormItem>
        <FormItem prop="password">
          <Input
            v-model="formItem.password"
            placeholder="请输入密码"
            type="password"
          />
        </FormItem>
        <FormItem v-if="type === 'reg'" prop="repassword">
          <Input
            v-model="formItem.repassword"
            placeholder="请输入确认密码"
            type="password"
          />
        </FormItem>
        <div class="d-flex align-items-center mb-2 ml-1">
          <!-- <Checkbox v-model="formItem.remember">自动登录</Checkbox> -->
          <a href="#" class="small ml-auto">忘记密码</a>
          <span class="mx-1">|</span>
          <a href="#" class="small" @click="changeType">{{
            type === "login" ? "注册账户" : "去登录"
          }}</a>
        </div>
        <FormItem>
          <Button type="primary" :loading="loading" long @click="submit">{{
            type === "login" ? "登录" : "注册"
          }}</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formItem: {
        username: "13026636499",
        password: "123456",
        repassword: "",
      },
      loading: false,
      type: "login",
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          // { type: "string", min: 6, message: "用户名长度不能小于6位" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          // { type: "string", min: 6, message: "密码长度不能小于6位" },
        ],
        repassword: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
          // { type: "string", min: 6, message: "密码长度不能小于6位" },
        ],
      },
    };
  },
  methods: {
    submit() {
      this.$refs.form.validate((val) => {
        if (!val) return;
        // 提交表单
        let text = this.type === "login" ? "登录" : "注册";
        this.loading = true;
        this.axios
          // .post(`/api/${this.type}`, this.formItem)  // 暂不提供注册
          .post(`/api/login`, this.formItem)
          .then((res) => {
            this.loading = false;
            if (this.type === "reg") {
              this.type = "login";
            } else {
              // 存储登录状态
              this.$store.dispatch("login", res.data);
              console.log(res);
              // 跳转
              this.$router.push({ name: "layout" });
            }
            this.$Message.success(text + "成功");
          })
          .catch((err) => {
            // this.$Message.error(err.response.data.data);
            this.loading = false;
          });
      });
    },
    // 切换登录/注册
    changeType() {
      this.type = this.type === "login" ? "reg" : "login";
    },
  },
};
</script>
<style lang='scss' scoped>
.main {
  height: 100vh;
  background-color: #515a6e;
  .form-main {
    margin-left: auto;
    margin-right: auto;
    width: 480px;
    height: max-content;
    margin-top: 50px;
  }
}
</style>