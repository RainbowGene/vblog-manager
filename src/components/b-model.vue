<template>
  <!-- 基于 iview 的弹出框：适用于提交表单 -->
  <div>
    <Modal v-model="modal" :title="title" :loading="loading" @on-ok="asyncOK">
      <p slot="content"></p>
    </Modal>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "提示",
    },
  },
  data() {
    return {
      modal: false,
      loading: true,
    };
  },
  methods: {
    asyncOK() {
      setTimeout(() => {
        this.modal = false;
      }, 2000);
    },
  },
};
</script>