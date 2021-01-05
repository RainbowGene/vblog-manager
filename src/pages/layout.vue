<template>
  <Layout class="main">
    <Header class="bg-white px-0" style="line-height: 60px; height: 60px">
      <Menu
        mode="horizontal"
        theme="light"
        :active-name="topActive"
        @on-select="handleSelect"
        class="d-flex align-items-center"
      >
        <div style="min-width: 200px; font-size: 25px" class="text-center">
          博客后台管理
        </div>
        <div class="layout-nav">
          <MenuItem
            v-for="(item, index) in topMenus"
            :key="index"
            :name="index"
          >
            <Icon :type="item.icon"></Icon>
            {{ item.title }}
          </MenuItem>
        </div>
        <div class="ml-auto mr-4">
          <Dropdown style="margin-left: 20px" placement="bottom-end">
            <a href="javascript:void(0)" class="d-flex align-items-center">
              <Avatar
                class="mr-2"
                :src="
                  user.avatar ||
                  'https://i.loli.net/2017/08/21/599a521472424.jpg'
                "
              />
              {{ user.nickname || user.username }}
              <Icon type="ios-arrow-down"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem @click.native="readInfo">个人资料</DropdownItem>
              <DropdownItem>修改密码</DropdownItem>
              <DropdownItem @click.native="logout">安全退出</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Menu>
    </Header>
    <Layout>
      <Sider class="bg-light bgc" style="position: relative" hide-trigger>
        <Menu
          theme="light"
          active-name="1"
          width="200"
          @on-select="handleSliderSelect"
          class="bgc"
        >
          <MenuGroup
            v-for="(item, index) in mainMenus"
            :key="index"
            :title="item.title"
          >
            <MenuItem
              v-for="(item2, index2) in item.item"
              :key="index2"
              :name="item2.name"
            >
              <Icon :type="item2.type" />
              {{ item2.text }}
            </MenuItem>
          </MenuGroup>
        </Menu>
      </Sider>
      <Content class="bg-white main_content">
        <div class="content_body">
          <router-view></router-view>
        </div>
      </Content>
    </Layout>
  </Layout>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      topMenus: [
        // { icon: "ios-paper", title: "网盘" },
        // { icon: "ios-people", title: "分享" },
        // { icon: "ios-construct", title: "更多" },
      ],
      mainMenus: [
        // 主菜单项配置
        {
          title: "基本信息",
          item: [
            {
              name: 1,
              type: "md-chatbubbles",
              text: "个人资料",
              path: "/index",
            },
          ],
        },
        {
          title: "内容管理",
          item: [
            {
              name: 2,
              type: "md-chatbubbles",
              text: "用户管理",
              path: "/user",
            },
            {
              name: 3,
              type: "md-chatbubbles",
              text: "文章管理",
              path: "/article",
            },
            {
              name: 4,
              type: "md-chatbubbles",
              text: "类别管理",
              path: "/type",
            },
            { name: 5, type: "md-chatbubbles", text: "标签管理", path: "/tag" },
            {
              name: 6,
              type: "md-chatbubbles",
              text: "相册管理",
              path: "/album",
            },
          ],
        },
      ],
      topActive: 0,
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user || {},
    }),
  },
  mounted() {},
  methods: {
    // 监听顶部导航改变
    handleSelect(e) {
      this.topActive = e;
    },
    // 监听侧边导航改变
    handleSliderSelect(e) {
      let p = this.mainMenus.map((item) => item.item).flat()[e - 1].path;
      if (this.$route.path === p) return console.log("已是当前路由");
      this.$router.push(p);
    },
    // 查看个人资料
    readInfo() {
      if (this.$route.path === "/index") return;
      this.$router.push({ name: "index" });
    },
    // 退出登录
    logout() {
      this.axios
        .post("/api/logout", {}, { token: true })
        .then((res) => {
          // 清除登录状态和本地存储
          this.$store.dispatch("logout");
          this.$Message.success("退出成功");
          this.$router.push({ name: "login" });
        })
        .catch((res) => {
          // 清除登录状态和本地存储
          this.$store.dispatch("logout");
          this.$Message.success("退出成功");
          this.$router.push({ name: "login" });
        });
    },
  },
};
</script>
<style lang='scss' scoped>
.main {
  height: 100vh;
  min-width: 645px;
  .footer_lr {
    .footer_left {
      width: 200px;
      height: 50px;
    }
  }
  .main_content {
    position: relative;
    .content_body {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow-y: auto;
    }
  }
}

.bgc {
  background-color: #ebf0f1;
}
</style>