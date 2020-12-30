<template>
  <!-- 类别操作相关 -->
  <div>
    <!-- 顶部操作条 -->
    <div class="top_bar border-bottom px-3 py-2">
      <div class="d-flex">
        <Button type="primary">添加类别</Button>
        <Input
          class="ml-auto mr-3 top_bar_input"
          search
          enter-button
          placeholder="类别名"
          @on-search="search"
        />
      </div>
    </div>
    <!-- 内容表格 -->
    <div class="content-table">
      <Table :columns="columns" :data="list">
        <template slot-scope="{ row }" slot="name">
          <strong>{{ row.typename }}</strong>
        </template>
        <template slot-scope="{ row }" slot="action">
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="edit(row.id)"
            >修改</Button
          >
          <Button type="error" size="small" @click="remove(row.id)"
            >删除</Button
          >
        </template>
      </Table>

      <!-- 加载效果 -->
      <div
        v-if="loading"
        style="
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          overflow-y: auto;
        "
      >
        <div class="text-center text-secondary pt-5 mt-5">加载中...</div>
      </div>
    </div>

    <!-- 表格部分 -->

    <!-- 分页部分 -->
    <div class="page_bar d-flex align-items-center px-3 border-top">
      <Page
        :total="total"
        :page-size="limit"
        :current="page"
        show-sizer
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
          title: "id",
          key: "id",
        },
        {
          title: "类别名",
          key: "typename",
          slot: "name",
        },
        {
          title: "所属类别id",
          key: "typeof_id",
        },
        {
          title: "Action",
          slot: "action",
          width: 150,
          align: "center",
        },
      ],
      loading: false,
      page: 1,
      limit: 10,
      total: 0, // 总条数
    };
  },
  mounted() {
    this.getTotal(); // 获取总条数
    this.getData();
  },
  methods: {
    async getTotal() {
      const res = await this.axios.get("/api/user/count", { token: true });
      this.total = res.data;
    },
    // 获取所有用户列表
    getData() {
      this.list = [];
      this.loading = true;
      this.axios
        .get(`/api/type/list?page=${this.page}&limit=${this.limit}`, {
          token: true,
        })
        .then((res) => {
          // console.log(res);
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
    // 修改类名
    edit(id) {
      console.log(id);
    },
    // 删除类
    remove(id) {
      console.log(id);
    },
  },
};
</script>
<style lang='scss' scoped>
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
  padding: 10px;
  margin-top: 50px;
}
.page_bar {
  height: 55px;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
}
</style>