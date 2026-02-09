"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main$8 = {
  name: "BrutalistButton",
  props: {
    text: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: "primary",
      // primary, secondary, danger
      validator: (value) => ["primary", "secondary", "danger"].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick() {
      if (!this.disabled) {
        this.$emit("click");
      }
    }
  }
};
function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($props.text),
    b: common_vendor.n(`brutalist-button--${$props.type}`),
    c: common_vendor.n({
      "brutalist-button--disabled": $props.disabled
    }),
    d: $props.disabled,
    e: common_vendor.o((...args) => $options.handleClick && $options.handleClick(...args))
  };
}
const Component$8 = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main$8, [["render", _sfc_render$8], ["__scopeId", "data-v-95e39da3"]]);
const _sfc_main$7 = {
  name: "BrutalistInput",
  props: {
    value: {
      type: [String, Number],
      default: ""
    },
    type: {
      type: String,
      default: "text"
    },
    label: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    password: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: [String, Number],
      default: 140
    },
    error: {
      type: String,
      default: ""
    }
  },
  methods: {
    handleInput(e) {
      this.$emit("input", e.detail.value);
    },
    handleFocus(e) {
      this.$emit("focus", e);
    },
    handleBlur(e) {
      this.$emit("blur", e);
    }
  }
};
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.label
  }, $props.label ? {
    b: common_vendor.t($props.label)
  } : {}, {
    c: $props.error ? 1 : "",
    d: $props.type,
    e: $props.value,
    f: $props.placeholder,
    g: $props.password,
    h: $props.maxlength,
    i: common_vendor.o((...args) => $options.handleInput && $options.handleInput(...args)),
    j: common_vendor.o((...args) => $options.handleFocus && $options.handleFocus(...args)),
    k: common_vendor.o((...args) => $options.handleBlur && $options.handleBlur(...args)),
    l: $props.error
  }, $props.error ? {
    m: common_vendor.t($props.error)
  } : {});
}
const Component$7 = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main$7, [["render", _sfc_render$7], ["__scopeId", "data-v-801ad2b2"]]);
const _sfc_main$6 = {
  name: "BrutalistCard",
  props: {
    type: {
      type: String,
      default: "default",
      // default, primary, secondary
      validator: (value) => ["default", "primary", "secondary"].includes(value)
    },
    clickable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick() {
      if (this.clickable) {
        this.$emit("click");
      }
    }
  }
};
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.n(`brutalist-card--${$props.type}`),
    b: common_vendor.n({
      "brutalist-card--clickable": $props.clickable
    }),
    c: common_vendor.o((...args) => $options.handleClick && $options.handleClick(...args))
  };
}
const Component$6 = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main$6, [["render", _sfc_render$6], ["__scopeId", "data-v-b656d347"]]);
const _sfc_main$5 = {
  name: "BrutalistAvatar",
  props: {
    src: {
      type: String,
      default: ""
    },
    size: {
      type: [String, Number],
      default: 80
    },
    name: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      imageError: false
    };
  },
  computed: {
    avatarStyle() {
      return {
        width: `${this.size}rpx`,
        height: `${this.size}rpx`
      };
    },
    placeholderText() {
      if (this.name) {
        return this.name.charAt(0).toUpperCase();
      }
      return "用";
    }
  },
  methods: {
    handleImageError() {
      this.imageError = true;
    }
  }
};
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.src
  }, $props.src ? {
    b: $props.src,
    c: common_vendor.o((...args) => $options.handleImageError && $options.handleImageError(...args))
  } : {
    d: common_vendor.t($options.placeholderText)
  }, {
    e: common_vendor.s($options.avatarStyle)
  });
}
const Component$5 = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main$5, [["render", _sfc_render$5], ["__scopeId", "data-v-a80429dc"]]);
const _sfc_main$4 = {
  name: "BrutalistTabBar",
  props: {
    tabs: {
      type: Array,
      required: true
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleTabClick(index) {
      this.$emit("change", index);
    }
  }
};
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($props.tabs, (tab, index, i0) => {
      return common_vendor.e({
        a: tab.icon
      }, tab.icon ? {
        b: tab.icon
      } : {}, {
        c: common_vendor.t(tab.text),
        d: index,
        e: index === $props.activeIndex ? 1 : "",
        f: common_vendor.o(($event) => $options.handleTabClick(index), index)
      });
    })
  };
}
const Component$4 = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__scopeId", "data-v-6266c8fb"]]);
const _sfc_main$3 = {
  name: "BrutalistTitle",
  props: {
    text: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: "medium",
      // small, medium, large
      validator: (value) => ["small", "medium", "large"].includes(value)
    }
  }
};
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($props.text),
    b: common_vendor.n(`brutalist-title--${$props.size}`)
  };
}
const Component$3 = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__scopeId", "data-v-3d84b199"]]);
const BrutalistButton = () => "./BrutalistButton/BrutalistButton.js";
const _sfc_main$2 = {
  name: "BrutalistDialog",
  components: {
    BrutalistButton
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "提示"
    },
    content: {
      type: String,
      default: ""
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    cancelText: {
      type: String,
      default: "取消"
    },
    confirmText: {
      type: String,
      default: "确定"
    }
  },
  methods: {
    handleConfirm() {
      this.$emit("confirm");
    },
    handleCancel() {
      this.$emit("cancel");
    },
    handleMaskClick() {
      this.$emit("close");
    }
  }
};
if (!Array) {
  const _easycom_BrutalistButton2 = common_vendor.resolveComponent("BrutalistButton");
  _easycom_BrutalistButton2();
}
const _easycom_BrutalistButton = () => "./BrutalistButton/BrutalistButton.js";
if (!Math) {
  _easycom_BrutalistButton();
}
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.visible
  }, $props.visible ? common_vendor.e({
    b: common_vendor.t($props.title),
    c: common_vendor.t($props.content),
    d: $props.showCancel
  }, $props.showCancel ? {
    e: common_vendor.o($options.handleCancel),
    f: common_vendor.p({
      type: "secondary",
      text: $props.cancelText
    })
  } : {}, {
    g: common_vendor.o($options.handleConfirm),
    h: common_vendor.p({
      type: "primary",
      text: $props.confirmText
    }),
    i: common_vendor.o(() => {
    }),
    j: common_vendor.o((...args) => $options.handleMaskClick && $options.handleMaskClick(...args))
  }) : {});
}
const Component$2 = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-3f350b9b"]]);
const _sfc_main$1 = {
  name: "BrutalistToast",
  props: {
    text: {
      type: String,
      default: ""
    },
    duration: {
      type: Number,
      default: 2e3
    }
  },
  data() {
    return {
      visible: false,
      timer: null
    };
  },
  methods: {
    show() {
      this.visible = true;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.hide();
      }, this.duration);
    },
    hide() {
      this.visible = false;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    }
  },
  beforeUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
};
if (!Array) {
  const _component_transition = common_vendor.resolveComponent("transition");
  _component_transition();
}
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.visible
  }, $data.visible ? {
    b: common_vendor.t($props.text)
  } : {}, {
    c: common_vendor.p({
      name: "fade"
    })
  });
}
const Component$1 = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-2e7f2ec6"]]);
const _sfc_main = {
  name: "BrutalistLoading",
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    text: {
      type: String,
      default: "加载中..."
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.visible
  }, $props.visible ? common_vendor.e({
    b: $props.text
  }, $props.text ? {
    c: common_vendor.t($props.text)
  } : {}) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9868c53a"]]);
const components = {
  BrutalistButton: Component$8,
  BrutalistInput: Component$7,
  BrutalistCard: Component$6,
  BrutalistAvatar: Component$5,
  BrutalistTabBar: Component$4,
  BrutalistTitle: Component$3,
  BrutalistDialog: Component$2,
  BrutalistToast: Component$1,
  BrutalistLoading: Component
};
const install = function(app) {
  Object.keys(components).forEach((key) => {
    app.component(key, components[key]);
  });
};
const BrutalistUI = {
  install,
  ...components
};
exports.BrutalistUI = BrutalistUI;
exports.Component = Component$8;
exports.Component$1 = Component$3;
exports.Component$2 = Component;
exports.Component$3 = Component$5;
exports.Component$4 = Component$6;
exports.Component$5 = Component$7;
exports.Component$6 = Component$4;
exports.Component$7 = Component$1;
exports.Component$8 = Component$2;
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/index.js.map
