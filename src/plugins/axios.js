"use strict";

import Vue from 'vue';
import axios from "axios";

let config = {

};

const _axios = axios.create(config);


// 请求拦截器
_axios.interceptors.request.use(
  function (config) {
    if (config.token === true) {
      config.headers['token'] = window.localStorage.getItem('token')
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 响应拦截器
_axios.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    // 全局错误提示
    if (error.response.status !== 200 && error.response.data && error.response.data.msg === 'fail') {
      // Vue.prototype.$Message.error(error.response.data.data)
    }
    return Promise.reject(error);
  }
);

Plugin.install = function (Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;