"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {}
    };
  },
  onLoad() {
    this.getUserInfo();
  },
  methods: {
    // 获取用户信息
    async getUserInfo() {
      try {
        const token = common_vendor.index.getStorageSync("token");
        if (!token) {
          common_vendor.index.redirectTo({
            url: "/pages/login/login"
          });
          return;
        }
        const res = await common_vendor.tr.callFunction({
          name: "validate-token",
          data: { token }
        });
        if (res.result.success) {
          this.userInfo = res.result.userInfo;
        } else {
          common_vendor.index.removeStorageSync("token");
          common_vendor.index.removeStorageSync("userInfo");
          common_vendor.index.redirectTo({
            url: "/pages/login/login"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/profile.vue:73", "获取用户信息失败:", error);
        common_vendor.index.redirectTo({
          url: "/pages/login/login"
        });
      }
    },
    // 格式化日期
    formatDate(dateStr) {
      if (!dateStr)
        return "";
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}年${month}月${day}日`;
    },
    // 编辑资料
    editProfile() {
      common_vendor.index.showToast({
        title: "功能开发中",
        icon: "none"
      });
    },
    // 退出登录
    logout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.removeStorageSync("userInfo");
            common_vendor.index.redirectTo({
              url: "/pages/login/login"
            });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userInfo.avatar,
    b: common_vendor.t($data.userInfo.nickname),
    c: $data.userInfo.isPhoneVerified
  }, $data.userInfo.isPhoneVerified ? {} : {}, {
    d: $data.userInfo.wxOpenId
  }, $data.userInfo.wxOpenId ? {} : {}, {
    e: common_vendor.t($data.userInfo.phone ? $data.userInfo.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : "未绑定"),
    f: common_vendor.t($options.formatDate($data.userInfo.createTime)),
    g: common_vendor.o((...args) => $options.editProfile && $options.editProfile(...args)),
    h: common_vendor.o((...args) => $options.logout && $options.logout(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/profile.js.map
