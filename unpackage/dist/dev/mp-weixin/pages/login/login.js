"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
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
    this.checkLoginStatus();
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      const token = common_vendor.index.getStorageSync("token");
      if (token) {
        this.validateToken(token);
      }
    },
    // 验证token有效性
    async validateToken(token) {
      try {
        const res = await common_vendor.tr.callFunction({
          name: "validate-token",
          data: { token }
        });
        if (res.result.success) {
          common_vendor.index.switchTab({
            url: "/pages/index/index"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login.vue:122", "Token验证失败:", error);
        common_vendor.index.removeStorageSync("token");
        common_vendor.index.removeStorageSync("userInfo");
      }
    },
    // 微信登录
    async handleWxLogin() {
      this.isLoading = true;
      try {
        const loginRes = await common_vendor.index.login({
          provider: "weixin"
        });
        if (!loginRes.code) {
          throw new Error("获取微信登录凭证失败");
        }
        const userInfoRes = await common_vendor.index.getUserInfo({
          provider: "weixin"
        });
        const res = await common_vendor.tr.callFunction({
          name: "wx-login",
          data: {
            code: loginRes.code,
            userInfo: userInfoRes.userInfo
          }
        });
        if (res.result.success) {
          common_vendor.index.setStorageSync("token", res.result.token);
          common_vendor.index.setStorageSync("userInfo", res.result.userInfo);
          common_vendor.index.switchTab({
            url: "/pages/index/index"
          });
        } else {
          common_vendor.index.showToast({
            title: res.result.message || "登录失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login.vue:172", "微信登录失败:", error);
        common_vendor.index.showToast({
          title: "登录失败，请重试",
          icon: "none"
        });
      } finally {
        this.isLoading = false;
      }
    },
    // 显示手机号登录
    showPhoneLogin() {
      this.showPhoneModal = true;
    },
    // 隐藏手机号登录
    hidePhoneLogin() {
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
        common_vendor.index.__f__("error", "at pages/login/login.vue:234", "发送验证码失败:", error);
        common_vendor.index.showToast({
          title: "发送失败，请重试",
          icon: "none"
        });
      }
    },
    // 手机号登录
    async handlePhoneLogin() {
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
        const res = await common_vendor.tr.callFunction({
          name: "phone-login",
          data: {
            phone: this.phoneNumber,
            code: this.verifyCode
          }
        });
        if (res.result.success) {
          common_vendor.index.setStorageSync("token", res.result.token);
          common_vendor.index.setStorageSync("userInfo", res.result.userInfo);
          common_vendor.index.switchTab({
            url: "/pages/index/index"
          });
        } else {
          common_vendor.index.showToast({
            title: res.result.message || "登录失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login.vue:287", "手机号登录失败:", error);
        common_vendor.index.showToast({
          title: "登录失败，请重试",
          icon: "none"
        });
      } finally {
        this.isLoading = false;
      }
    },
    // 打开用户协议
    openUserAgreement() {
      common_vendor.index.navigateTo({
        url: "/pages/webview/webview?title=用户协议&url=https://example.com/user-agreement"
      });
    },
    // 打开隐私政策
    openPrivacyPolicy() {
      common_vendor.index.navigateTo({
        url: "/pages/webview/webview?title=隐私政策&url=https://example.com/privacy-policy"
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
    a: common_assets._imports_0,
    b: common_vendor.o((...args) => $options.handleWxLogin && $options.handleWxLogin(...args)),
    c: $data.isLoading,
    d: common_vendor.o((...args) => $options.showPhoneLogin && $options.showPhoneLogin(...args)),
    e: $data.isLoading,
    f: common_vendor.o((...args) => $options.openUserAgreement && $options.openUserAgreement(...args)),
    g: common_vendor.o((...args) => $options.openPrivacyPolicy && $options.openPrivacyPolicy(...args)),
    h: $data.showPhoneModal
  }, $data.showPhoneModal ? {
    i: $data.phoneNumber,
    j: common_vendor.o(($event) => $data.phoneNumber = $event.detail.value),
    k: $data.verifyCode,
    l: common_vendor.o(($event) => $data.verifyCode = $event.detail.value),
    m: common_vendor.t($data.codeTimer > 0 ? `${$data.codeTimer}s` : "获取验证码"),
    n: common_vendor.o((...args) => $options.sendCode && $options.sendCode(...args)),
    o: $data.codeTimer > 0 || !$options.isValidPhone,
    p: common_vendor.o((...args) => $options.hidePhoneLogin && $options.hidePhoneLogin(...args)),
    q: common_vendor.o((...args) => $options.handlePhoneLogin && $options.handlePhoneLogin(...args)),
    r: common_vendor.o(() => {
    }),
    s: common_vendor.o((...args) => $options.hidePhoneLogin && $options.hidePhoneLogin(...args))
  } : {}, {
    t: $data.isLoading
  }, $data.isLoading ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
