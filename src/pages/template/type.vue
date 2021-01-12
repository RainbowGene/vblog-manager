<template>
  <!-- 类别操作相关 -->
  <div>
    <!-- 顶部操作条 -->
    <div class="top_bar border-bottom px-3 py-2">
      <div class="d-flex">
        <Button type="primary" @click="modalShow = true">添加类别</Button>
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
            @click="edit(row)"
            >修改</Button
          >
          <Button
            type="error"
            size="small"
            @click="remove(row.id, row.typename)"
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
        @on-change="pageChange"
        @on-page-size-change="psChange"
        :page-size-opts="[5, 8, 10]"
      ></Page>
    </div>

    <Modal
      v-model="modalShow"
      title="添加类别"
      :loading="modalLoad"
      @on-ok="asyncOK"
    >
      <!-- 所属类别 -->

      <Input v-model="typename" placeholder="输入类别名..." />
    </Modal>
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
      modalLoad: true,
      modalShow: false,
      typename: "",
      page: 1,
      limit: 8,
      total: 0, // 总条数
    };
  },
  mounted() {
    this.getTotal(); // 获取总条数
    this.getData();
  },
  methods: {
    async getTotal() {
      const res = await this.axios.get("/api/type/count", { token: true });
      this.total = res.data;
    },
    // 获取所有列表
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
    edit(row) {
      console.log(row.id);
    },
    // 删除类
    remove(id, name) {
      this.$Modal.confirm({
        title: "提示",
        content: "是否删除 " + name,
        onOk: () => {
          this.axios
            .post("/api/type/delete", { id }, { token: true })
            .then((res) => {
              this.$Message.success("删除成功");
              this.getTotal();
              this.getData();
            })
            .catch((err) => {
              console.log(err);
            });
        },
      });
    },
    // 提交添加/修改表单
    asyncOK() {
      this.axios
        .post("/api/type/insert", { typename: this.typename }, { token: true })
        .then((res) => {
          this.modalShow = false;
          this.getTotal();
          this.getData();
        });
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
  position: relative;
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