"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {},
      isLoading: false,
      showPhoneModal: false,
      phoneNumber: "",
      verifyCode: "",
      codeTimer: 0,
      codeTimerId: null
    };
  },
  computed: {
    isValidPhone() {
      return /^1[3-9]\d{9}$/.test(this.phoneNumber);
    }
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
          if (this.userInfo.isPhoneVerified) {
            common_vendor.index.switchTab({
              url: "/pages/index/index"
            });
          }
        } else {
          common_vendor.index.removeStorageSync("token");
          common_vendor.index.removeStorageSync("userInfo");
          common_vendor.index.redirectTo({
            url: "/pages/login/login"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/bind/bind.vue:132", "获取用户信息失败:", error);
        common_vendor.index.redirectTo({
          url: "/pages/login/login"
        });
      }
    },
    // 绑定手机号
    bindPhone() {
      this.showPhoneModal = true;
    },
    // 隐藏绑定手机号
    hideBindPhone() {
      this.showPhoneModal = false;
      this.phoneNumber = "";
      this.verifyCode = "";
    },
    // 发送验证码
    async sendCode() {
      if (!this.isValidPhone) {
        common_vendor.index.showToast({
          title: "请输入正确的手机号",
          icon: "none"
        });
        return;
      }
      try {
        const res = await common_vendor.tr.callFunction({
          name: "send-sms-code",
          data: {
            phone: this.phoneNumber
          }
        });
        if (res.result.success) {
          this.codeTimer = 60;
          this.codeTimerId = setInterval(() => {
            this.codeTimer--;
            if (this.codeTimer <= 0) {
              clearInterval(this.codeTimerId);
              this.codeTimerId = null;
            }
          }, 1e3);
          common_vendor.index.showToast({
            title: "验证码已发送",
            icon: "success"
          });
        } else {
          common_vendor.index.showToast({
            title: res.result.message || "发送失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/bind/bind.vue:191", "发送验证码失败:", error);
        common_vendor.index.showToast({
          title: "发送失败，请重试",
          icon: "none"
        });
      }
    },
    // 确认绑定手机号
    async handleBindPhone() {
      if (!this.isValidPhone) {
        common_vendor.index.showToast({
          title: "请输入正确的手机号",
          icon: "none"
        });
        return;
      }
      if (!this.verifyCode || this.verifyCode.length !== 6) {
        common_vendor.index.showToast({
          title: "请输入正确的验证码",
          icon: "none"
        });
        return;
      }
      this.isLoading = true;
      try {
        const token = common_vendor.index.getStorageSync("token");
        const res = await common_vendor.tr.callFunction({
          name: "bind-phone",
          data: {
            token,
            phone: this.phoneNumber,
            code: this.verifyCode
          }
        });
        if (res.result.success) {
          this.userInfo = res.result.userInfo;
          common_vendor.index.setStorageSync("userInfo", this.userInfo);
          common_vendor.index.showToast({
            title: "绑定成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.switchTab({
              url: "/pages/index/index"
            });
          }, 1500);
        } else {
          common_vendor.index.showToast({
            title: res.result.message || "绑定失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/bind/bind.vue:255", "绑定手机号失败:", error);
        common_vendor.index.showToast({
          title: "绑定失败，请重试",
          icon: "none"
        });
      } finally {
        this.isLoading = false;
      }
    },
    // 跳过绑定
    skipBind() {
      common_vendor.index.switchTab({
        url: "/pages/index/index"
      });
    }
  },
  onUnload() {
    if (this.codeTimerId) {
      clearInterval(this.codeTimerId);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userInfo.avatar,
    b: common_vendor.t($data.userInfo.nickname),
    c: !$data.userInfo.isPhoneVerified
  }, !$data.userInfo.isPhoneVerified ? {
    d: common_vendor.o((...args) => $options.bindPhone && $options.bindPhone(...args))
  } : {}, {
    e: common_vendor.o((...args) => $options.skipBind && $options.skipBind(...args)),
    f: $data.showPhoneModal
  }, $data.showPhoneModal ? {
    g: $data.phoneNumber,
    h: common_vendor.o(($event) => $data.phoneNumber = $event.detail.value),
    i: $data.verifyCode,
    j: common_vendor.o(($event) => $data.verifyCode = $event.detail.value),
    k: common_vendor.t($data.codeTimer > 0 ? `${$data.codeTimer}s` : "获取验证码"),
    l: common_vendor.o((...args) => $options.sendCode && $options.sendCode(...args)),
    m: $data.codeTimer > 0 || !$options.isValidPhone,
    n: common_vendor.o((...args) => $options.hideBindPhone && $options.hideBindPhone(...args)),
    o: common_vendor.o((...args) => $options.handleBindPhone && $options.handleBindPhone(...args)),
    p: common_vendor.o(() => {
    }),
    q: common_vendor.o((...args) => $options.hideBindPhone && $options.hideBindPhone(...args))
  } : {}, {
    r: $data.isLoading
  }, $data.isLoading ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/bind/bind.js.map
