"use strict";
const common_vendor = require("../../common/vendor.js");
const BrutalistTitle = () => "../../components/BrutalistTitle/BrutalistTitle.js";
const BrutalistButton = () => "../../components/BrutalistButton/BrutalistButton.js";
const BrutalistInput = () => "../../components/BrutalistInput/BrutalistInput.js";
const BrutalistCard = () => "../../components/BrutalistCard/BrutalistCard.js";
const BrutalistAvatar = () => "../../components/BrutalistAvatar/BrutalistAvatar.js";
const BrutalistLoading = () => "../../components/BrutalistLoading/BrutalistLoading.js";
const BrutalistTabBar = () => "../../components/BrutalistTabBar/BrutalistTabBar.js";
const BrutalistToast = () => "../../components/BrutalistToast/BrutalistToast.js";
const BrutalistDialog = () => "../../components/BrutalistDialog/BrutalistDialog.js";
const _sfc_main = {
  components: {
    BrutalistTitle,
    BrutalistButton,
    BrutalistInput,
    BrutalistCard,
    BrutalistAvatar,
    BrutalistLoading,
    BrutalistTabBar,
    BrutalistToast,
    BrutalistDialog
  },
  data() {
    return {
      username: "",
      password: "",
      phone: "",
      loadingVisible: true,
      toastText: "",
      dialogVisible: false,
      activeTabIndex: 0,
      tabBarData: [
        { text: "首页", icon: "/static/images/home.png" },
        { text: "发布", icon: "/static/images/add.png" },
        { text: "我的", icon: "/static/images/user.png" }
      ]
    };
  },
  methods: {
    toggleLoading() {
      this.loadingVisible = !this.loadingVisible;
    },
    showToast(text) {
      this.toastText = text;
      this.$refs.toast.show();
    },
    showDialog() {
      this.dialogVisible = true;
    },
    handleDialogConfirm() {
      this.dialogVisible = false;
      this.showToast("点击了确定");
    },
    handleDialogCancel() {
      this.dialogVisible = false;
      this.showToast("点击了取消");
    },
    handleDialogClose() {
      this.dialogVisible = false;
    },
    handleTabChange(index) {
      this.activeTabIndex = index;
      this.showToast(`切换到${this.tabBarData[index].text}`);
    }
  }
};
if (!Array) {
  const _easycom_BrutalistTitle2 = common_vendor.resolveComponent("BrutalistTitle");
  const _easycom_BrutalistButton2 = common_vendor.resolveComponent("BrutalistButton");
  const _easycom_BrutalistInput2 = common_vendor.resolveComponent("BrutalistInput");
  const _easycom_BrutalistCard2 = common_vendor.resolveComponent("BrutalistCard");
  const _easycom_BrutalistAvatar2 = common_vendor.resolveComponent("BrutalistAvatar");
  const _easycom_BrutalistLoading2 = common_vendor.resolveComponent("BrutalistLoading");
  const _easycom_BrutalistTabBar2 = common_vendor.resolveComponent("BrutalistTabBar");
  const _easycom_BrutalistToast2 = common_vendor.resolveComponent("BrutalistToast");
  const _easycom_BrutalistDialog2 = common_vendor.resolveComponent("BrutalistDialog");
  (_easycom_BrutalistTitle2 + _easycom_BrutalistButton2 + _easycom_BrutalistInput2 + _easycom_BrutalistCard2 + _easycom_BrutalistAvatar2 + _easycom_BrutalistLoading2 + _easycom_BrutalistTabBar2 + _easycom_BrutalistToast2 + _easycom_BrutalistDialog2)();
}
const _easycom_BrutalistTitle = () => "../../components/BrutalistTitle/BrutalistTitle.js";
const _easycom_BrutalistButton = () => "../../components/BrutalistButton/BrutalistButton.js";
const _easycom_BrutalistInput = () => "../../components/BrutalistInput/BrutalistInput.js";
const _easycom_BrutalistCard = () => "../../components/BrutalistCard/BrutalistCard.js";
const _easycom_BrutalistAvatar = () => "../../components/BrutalistAvatar/BrutalistAvatar.js";
const _easycom_BrutalistLoading = () => "../../components/BrutalistLoading/BrutalistLoading.js";
const _easycom_BrutalistTabBar = () => "../../components/BrutalistTabBar/BrutalistTabBar.js";
const _easycom_BrutalistToast = () => "../../components/BrutalistToast/BrutalistToast.js";
const _easycom_BrutalistDialog = () => "../../components/BrutalistDialog/BrutalistDialog.js";
if (!Math) {
  (_easycom_BrutalistTitle + _easycom_BrutalistButton + _easycom_BrutalistInput + _easycom_BrutalistCard + _easycom_BrutalistAvatar + _easycom_BrutalistLoading + _easycom_BrutalistTabBar + _easycom_BrutalistToast + _easycom_BrutalistDialog)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      size: "large",
      text: "粗野主义手绘风格组件库"
    }),
    b: common_vendor.p({
      size: "medium",
      text: "按钮组件"
    }),
    c: common_vendor.o(($event) => $options.showToast("主要按钮点击")),
    d: common_vendor.p({
      text: "主要按钮",
      type: "primary"
    }),
    e: common_vendor.o(($event) => $options.showToast("次要按钮点击")),
    f: common_vendor.p({
      text: "次要按钮",
      type: "secondary"
    }),
    g: common_vendor.o($options.showDialog),
    h: common_vendor.p({
      text: "危险按钮",
      type: "danger"
    }),
    i: common_vendor.p({
      text: "禁用按钮",
      disabled: true
    }),
    j: common_vendor.p({
      size: "medium",
      text: "输入框组件"
    }),
    k: common_vendor.o(($event) => $data.username = $event),
    l: common_vendor.p({
      label: "用户名",
      placeholder: "请输入用户名",
      modelValue: $data.username
    }),
    m: common_vendor.o(($event) => $data.password = $event),
    n: common_vendor.p({
      label: "密码",
      type: "password",
      placeholder: "请输入密码",
      modelValue: $data.password
    }),
    o: common_vendor.o(($event) => $data.phone = $event),
    p: common_vendor.p({
      label: "手机号",
      placeholder: "请输入手机号",
      error: "请输入正确的手机号格式",
      modelValue: $data.phone
    }),
    q: common_vendor.p({
      size: "medium",
      text: "卡片组件"
    }),
    r: common_vendor.p({
      type: "primary"
    }),
    s: common_vendor.o(($event) => $options.showToast("点击了次要卡片")),
    t: common_vendor.p({
      type: "secondary",
      clickable: true
    }),
    v: common_vendor.p({
      size: "medium",
      text: "头像组件"
    }),
    w: common_vendor.p({
      size: "60",
      name: "张三"
    }),
    x: common_vendor.p({
      size: "80",
      src: "/static/images/default-avatar.png",
      name: "李四"
    }),
    y: common_vendor.p({
      size: "100",
      name: "王五"
    }),
    z: common_vendor.p({
      size: "medium",
      text: "标题组件"
    }),
    A: common_vendor.p({
      size: "small",
      text: "小标题"
    }),
    B: common_vendor.p({
      size: "medium",
      text: "中标题"
    }),
    C: common_vendor.p({
      size: "large",
      text: "大标题"
    }),
    D: common_vendor.p({
      size: "medium",
      text: "加载组件"
    }),
    E: common_vendor.p({
      visible: $data.loadingVisible,
      text: "正在加载中..."
    }),
    F: common_vendor.o($options.toggleLoading),
    G: common_vendor.p({
      text: "切换加载状态"
    }),
    H: common_vendor.o(($event) => $options.showToast("这是一个Toast提示")),
    I: common_vendor.p({
      text: "显示Toast"
    }),
    J: common_vendor.o($options.showDialog),
    K: common_vendor.p({
      text: "显示Dialog"
    }),
    L: common_vendor.p({
      size: "medium",
      text: "底部导航栏"
    }),
    M: common_vendor.o($options.handleTabChange),
    N: common_vendor.p({
      tabs: $data.tabBarData,
      activeIndex: $data.activeTabIndex
    }),
    O: common_vendor.sr("toast", "845cd3d9-29"),
    P: common_vendor.p({
      text: $data.toastText
    }),
    Q: common_vendor.o($options.handleDialogConfirm),
    R: common_vendor.o($options.handleDialogCancel),
    S: common_vendor.o($options.handleDialogClose),
    T: common_vendor.p({
      visible: $data.dialogVisible,
      title: "提示",
      content: "这是一个粗野主义风格的对话框"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-845cd3d9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/components/components.js.map
