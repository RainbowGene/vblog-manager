<template>
  <!-- 文章操作相关 -->
  <div>
    <!-- 顶部操作条 -->
    <div class="top_bar border-bottom px-3 py-2">
      <div class="d-flex">
        <Button type="primary" @click="handleArticle({ key: 'create' })"
          >添加文章</Button
        >
        <Input
          class="ml-auto mr-3 top_bar_input"
          search
          enter-button
          placeholder="文章标题"
          @on-search="search"
        />
      </div>
    </div>
    <!-- 内容表格 -->
    <div class="content-table">
      <Table max-height="450" :columns="columns" :data="list">
        <template slot-scope="{ row }" slot="name">
          <strong>{{ row.title }}</strong>
        </template>
        <template slot-scope="{ row }" slot="typename">
          <strong
            :class="
              row.type.typename === '原创' ? 'text-success' : 'text-warning'
            "
            >{{ row.type.typename }}</strong
          >
        </template>
        <!-- <template slot-scope="{ row }" slot="nickname">
          <strong>{{ row.user.nickname }}</strong>
        </template> -->
        <template slot-scope="{ row }" slot="action">
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="handleArticle({ key: 'update', id: row.id })"
            >修改</Button
          >
          <Button type="warning" size="small" @click="bindTag(row.id)"
            >标签绑定</Button
          >
          <Button
            type="error"
            style="margin-left: 5px"
            size="small"
            @click="remove(row.id, row.title)"
            >删除</Button
          >
        </template>
      </Table>
      <!-- 加载效果 -->
      <Spin v-if="loading" fix></Spin>
    </div>
    <!-- 分页部分 -->
    <div class="page_bar d-flex align-items-center px-3 border-top">
      <Page
        :total="total"
        :page-size="limit"
        :current="page"
        show-sizer
        :page-size-opts="[8, 20, 50]"
        @on-change="pageChange"
        @on-page-size-change="psChange"
      ></Page>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [], // 用户列表
      columns: [
        {
          type: "selection",
          width: 60,
          height: 40,
          // fixed: "left",
        },
        {
          title: "id",
          key: "id",
          width: 60,
        },
        {
          title: "标题名",
          key: "typename",
          slot: "name",
          align: "center",
        },
        {
          title: "类别名",
          key: "typename",
          slot: "typename",
          width: 80,
          align: "center",
        },
        // {
        //   title: "作者",
        //   key: "nickname",
        //   slot: "nickname",
        // },
        {
          title: "操作",
          slot: "action",
          width: 210,
          align: "center",
          // fixed: "right",
        },
      ],
      loading: false,
      page: 1,
      limit: 20,
      total: 0, // 总条数
    };
  },
  mounted() {
    this.getTotal(); // 获取总条数
    this.getData();
  },
  methods: {
    async getTotal() {
      const res = await this.axios.get("/api/article/count", { token: true });
      this.total = res.data;
    },
    // 获取所有列表
    getData() {
      this.list = [];
      this.loading = true;
      this.axios
        .get(`/api/article/list?page=${this.page}&limit=${this.limit}`, {
          token: true,
        })
        .then((res) => {
          this.list = res.data;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 页码改变
    pageChange(e) {
      this.page = e;
      this.getData();
    },
    // 每页选择改变
    psChange(e) {
      this.limit = e;
      this.getData();
    },
    // 关键字查询
    search(e) {
      console.log(e);
    },
    // 删除文章
    remove(id, name) {
      this.$Modal.confirm({
        title: "提示",
        content: "是否删除<span style='color:gray;'> " + name + "</span>",
        onOk: () => {
          this.axios
            .post("/api/article/delete", { id }, { token: true })
            .then((res) => {
              this.$Message.success("删除成功");
              this.getData();
            })
            .catch((err) => {
              console.log(err);
            });
        },
      });
    },
    // 为文章绑定标签
    bindTag(id) {},
    handleArticle(e) {
      switch (e.key) {
        case "create":
          this.$router.push({ name: "addArticle", params: { key: "create" } });
          break;
        case "update":
          this.$router.push({
            name: "addArticle",
            params: { key: "update", id: e.id },
          });
          break;
        default:
          break;
      }
    },
  },
};
</script>
<style lang='scss'>
.top_bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  // height: 90px;
  Button {
    margin-right: 15px;
  }
  .top_bar_input {
    width: 250px;
  }
}
.content-table {
  position: relative;
  margin-top: 50px;
  padding: 10px;
}
.page_bar {
  height: 55px;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
}

// 只针对content-table 下的 CheckBox
.content-table .ivu-checkbox-wrapper {
  cursor: pointer;
  font-size: 14px;
  display: inline-block;
  margin-right: 8px;
  margin-top: 8px !important;
}
</style>