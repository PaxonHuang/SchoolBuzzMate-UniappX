"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      postContent: "",
      imageList: [],
      uploadedImages: [],
      // 已上传的图片URL列表
      isSubmitting: false
    };
  },
  computed: {
    canPost() {
      return this.postContent.trim().length > 0 || this.imageList.length > 0;
    }
  },
  onLoad() {
    this.checkLoginStatus();
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      const token = common_vendor.index.getStorageSync("token");
      if (!token) {
        common_vendor.index.redirectTo({
          url: "/pages/login/login"
        });
      }
    },
    // 选择图片
    chooseImage() {
      const maxCount = 9 - this.imageList.length;
      common_vendor.index.chooseImage({
        count: maxCount,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.imageList = [...this.imageList, ...res.tempFilePaths];
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/post/post.vue:90", "选择图片失败:", err);
          common_vendor.index.showToast({
            title: "选择图片失败",
            icon: "none"
          });
        }
      });
    },
    // 预览图片
    previewImage(index) {
      common_vendor.index.previewImage({
        current: index,
        urls: this.imageList
      });
    },
    // 删除图片
    deleteImage(index) {
      this.imageList.splice(index, 1);
    },
    // 上传图片
    async uploadImages() {
      if (this.imageList.length === 0) {
        return [];
      }
      common_vendor.index.showLoading({
        title: "上传图片中...",
        mask: true
      });
      const token = common_vendor.index.getStorageSync("token");
      const uploadPromises = [];
      for (const imagePath of this.imageList) {
        const base64 = await this.fileToBase64(imagePath);
        const uploadPromise = common_vendor.tr.callFunction({
          name: "upload-image",
          data: {
            token,
            fileContent: base64
          }
        });
        uploadPromises.push(uploadPromise);
      }
      try {
        const results = await Promise.all(uploadPromises);
        const uploadedUrls = results.map((result) => {
          if (result.result.code === 0) {
            return result.result.data.tempFileURL;
          } else {
            throw new Error(result.result.message);
          }
        });
        return uploadedUrls;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/post/post.vue:153", "上传图片失败:", error);
        common_vendor.index.showToast({
          title: "上传图片失败",
          icon: "none"
        });
        throw error;
      } finally {
        common_vendor.index.hideLoading();
      }
    },
    // 文件转base64
    fileToBase64(filePath) {
      return new Promise((resolve, reject) => {
        common_vendor.index.getFileSystemManager().readFile({
          filePath,
          encoding: "base64",
          success: (res) => {
            resolve(res.data);
          },
          fail: reject
        });
      });
    },
    // 取消发布
    cancelPost() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要取消发布吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.navigateBack();
          }
        }
      });
    },
    // 提交发布
    async submitPost() {
      if (!this.canPost) {
        common_vendor.index.showToast({
          title: "请输入内容或添加图片",
          icon: "none"
        });
        return;
      }
      if (this.isSubmitting) {
        return;
      }
      this.isSubmitting = true;
      try {
        const uploadedImages = await this.uploadImages();
        const token = common_vendor.index.getStorageSync("token");
        const result = await common_vendor.tr.callFunction({
          name: "publish-post",
          data: {
            token,
            content: this.postContent.trim(),
            images: uploadedImages,
            isPublic: true
          }
        });
        if (result.result.code === 0) {
          common_vendor.index.showToast({
            title: "发布成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          common_vendor.index.showToast({
            title: result.result.message || "发布失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/post/post.vue:240", "发布失败:", error);
        common_vendor.index.showToast({
          title: "发布失败",
          icon: "none"
        });
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
if (!Array) {
  const _easycom_BrutalistInput2 = common_vendor.resolveComponent("BrutalistInput");
  const _easycom_BrutalistButton2 = common_vendor.resolveComponent("BrutalistButton");
  const _easycom_BrutalistCard2 = common_vendor.resolveComponent("BrutalistCard");
  (_easycom_BrutalistInput2 + _easycom_BrutalistButton2 + _easycom_BrutalistCard2)();
}
const _easycom_BrutalistInput = () => "../../components/BrutalistInput/BrutalistInput.js";
const _easycom_BrutalistButton = () => "../../components/BrutalistButton/BrutalistButton.js";
const _easycom_BrutalistCard = () => "../../components/BrutalistCard/BrutalistCard.js";
if (!Math) {
  (_easycom_BrutalistInput + _easycom_BrutalistButton + _easycom_BrutalistCard)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o(($event) => $data.postContent = $event),
    b: common_vendor.p({
      type: "textarea",
      placeholder: "分享你的校园生活...",
      maxlength: 500,
      modelValue: $data.postContent
    }),
    c: common_vendor.t($data.postContent.length),
    d: common_vendor.f($data.imageList, (item, index, i0) => {
      return {
        a: item,
        b: common_vendor.o(($event) => $options.previewImage(index), index),
        c: common_vendor.o(($event) => $options.deleteImage(index), index),
        d: index
      };
    }),
    e: $data.imageList.length < 9
  }, $data.imageList.length < 9 ? {
    f: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  } : {}, {
    g: common_vendor.o($options.cancelPost),
    h: common_vendor.p({
      text: "取消",
      type: "secondary"
    }),
    i: common_vendor.o($options.submitPost),
    j: common_vendor.p({
      text: "发布",
      disabled: !$options.canPost
    }),
    k: common_vendor.p({
      rotate: -1
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/post/post.js.map
