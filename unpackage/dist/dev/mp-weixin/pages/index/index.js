"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      postList: [],
      loading: true,
      loadingMore: false,
      isEnd: false,
      currentPage: 1,
      pageSize: 10
    };
  },
  onLoad() {
    this.checkLoginStatus();
    this.loadPosts();
  },
  onPullDownRefresh() {
    this.refreshData();
  },
  onReachBottom() {
    this.loadMore();
  },
  methods: {
    // 检查登录状态
    checkLoginStatus() {
      const token = common_vendor.index.getStorageSync("token");
      if (!token) {
        common_vendor.index.redirectTo({
          url: "/pages/login/login"
        });
        return false;
      }
      return true;
    },
    // 加载动态列表
    async loadPosts(isRefresh = false) {
      if (isRefresh) {
        this.currentPage = 1;
        this.isEnd = false;
      }
      try {
        const token = common_vendor.index.getStorageSync("token");
        const result = await common_vendor.tr.callFunction({
          name: "get-posts",
          data: {
            token,
            page: this.currentPage,
            pageSize: this.pageSize
          }
        });
        if (result.result.code === 0) {
          const { posts, total, totalPages } = result.result.data;
          if (isRefresh) {
            this.postList = posts;
          } else {
            this.postList = [...this.postList, ...posts];
          }
          if (this.currentPage >= totalPages) {
            this.isEnd = true;
          }
        } else {
          common_vendor.index.showToast({
            title: result.result.message || "加载失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:176", "加载动态失败:", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
        this.loadingMore = false;
        if (isRefresh) {
          common_vendor.index.stopPullDownRefresh();
        }
      }
    },
    // 刷新数据
    refreshData() {
      this.loadPosts(true);
    },
    // 加载更多
    loadMore() {
      if (this.loadingMore || this.isEnd)
        return;
      this.loadingMore = true;
      this.currentPage++;
      this.loadPosts();
    },
    // 点赞动态
    async likePost(postId, isLiked, index) {
      if (!this.checkLoginStatus())
        return;
      try {
        const token = common_vendor.index.getStorageSync("token");
        const result = await common_vendor.tr.callFunction({
          name: "like-post",
          data: {
            token,
            postId
          }
        });
        if (result.result.code === 0) {
          const { isLiked: newIsLiked, likes } = result.result.data;
          this.postList[index].isLiked = newIsLiked;
          this.postList[index].likes = likes;
        } else {
          common_vendor.index.showToast({
            title: result.result.message || "操作失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:229", "点赞失败:", error);
        common_vendor.index.showToast({
          title: "操作失败",
          icon: "none"
        });
      }
    },
    // 评论动态（跳转到评论页）
    commentPost(postId) {
      common_vendor.index.navigateTo({
        url: `/pages/comments/comments?postId=${postId}`
      });
    },
    // 分享动态
    sharePost(postId) {
      common_vendor.index.showToast({
        title: "分享功能开发中",
        icon: "none"
      });
    },
    // 跳转到用户主页
    goToUserProfile(userId) {
      common_vendor.index.showToast({
        title: "用户主页开发中",
        icon: "none"
      });
    },
    // 预览图片
    previewImage(images, current = 0) {
      common_vendor.index.previewImage({
        current,
        urls: images
      });
    },
    // 格式化时间
    formatTime(time) {
      const now = /* @__PURE__ */ new Date();
      const date = new Date(time);
      const diff = now - date;
      if (diff < 60 * 1e3) {
        return "刚刚";
      }
      if (diff < 60 * 60 * 1e3) {
        return Math.floor(diff / (60 * 1e3)) + "分钟前";
      }
      if (diff < 24 * 60 * 60 * 1e3) {
        return Math.floor(diff / (60 * 60 * 1e3)) + "小时前";
      }
      if (diff < 30 * 24 * 60 * 60 * 1e3) {
        return Math.floor(diff / (24 * 60 * 60 * 1e3)) + "天前";
      }
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    },
    // 跳转到发布页面
    goToPost() {
      common_vendor.index.navigateTo({
        url: "/pages/post/post"
      });
    },
    // 跳转到个人中心
    goToProfile() {
      common_vendor.index.navigateTo({
        url: "/pages/profile/profile"
      });
    }
  }
};
if (!Array) {
  const _easycom_BrutalistTitle2 = common_vendor.resolveComponent("BrutalistTitle");
  const _easycom_BrutalistLoading2 = common_vendor.resolveComponent("BrutalistLoading");
  const _easycom_BrutalistAvatar2 = common_vendor.resolveComponent("BrutalistAvatar");
  const _easycom_BrutalistCard2 = common_vendor.resolveComponent("BrutalistCard");
  const _easycom_BrutalistButton2 = common_vendor.resolveComponent("BrutalistButton");
  (_easycom_BrutalistTitle2 + _easycom_BrutalistLoading2 + _easycom_BrutalistAvatar2 + _easycom_BrutalistCard2 + _easycom_BrutalistButton2)();
}
const _easycom_BrutalistTitle = () => "../../components/BrutalistTitle/BrutalistTitle.js";
const _easycom_BrutalistLoading = () => "../../components/BrutalistLoading/BrutalistLoading.js";
const _easycom_BrutalistAvatar = () => "../../components/BrutalistAvatar/BrutalistAvatar.js";
const _easycom_BrutalistCard = () => "../../components/BrutalistCard/BrutalistCard.js";
const _easycom_BrutalistButton = () => "../../components/BrutalistButton/BrutalistButton.js";
if (!Math) {
  (_easycom_BrutalistTitle + _easycom_BrutalistLoading + _easycom_BrutalistAvatar + _easycom_BrutalistCard + _easycom_BrutalistButton)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      title: "校园动态",
      size: "large",
      rotate: 0.5
    }),
    b: $data.loading
  }, $data.loading ? {
    c: common_vendor.p({
      text: "加载中..."
    })
  } : $data.postList.length > 0 ? {
    e: common_vendor.f($data.postList, (item, index, i0) => {
      return common_vendor.e({
        a: "79030325-3-" + i0 + "," + ("79030325-2-" + i0),
        b: common_vendor.p({
          src: item.userInfo.avatar,
          text: item.userInfo.nickname,
          size: "medium"
        }),
        c: common_vendor.t(item.userInfo.nickname),
        d: item.userInfo.school
      }, item.userInfo.school ? {
        e: common_vendor.t(item.userInfo.school)
      } : {}, {
        f: common_vendor.t($options.formatTime(item.createTime)),
        g: common_vendor.o(($event) => $options.goToUserProfile(item.userId), item._id),
        h: item.content
      }, item.content ? {
        i: common_vendor.t(item.content)
      } : {}, {
        j: item.images && item.images.length
      }, item.images && item.images.length ? {
        k: common_vendor.f(item.images, (img, imgIndex, i1) => {
          return {
            a: img,
            b: imgIndex,
            c: common_vendor.o(($event) => $options.previewImage(item.images, imgIndex), imgIndex)
          };
        })
      } : {}, {
        l: common_vendor.t(item.isLiked ? "❤️" : "🤍"),
        m: common_vendor.t(item.likes || 0),
        n: common_vendor.o(($event) => $options.likePost(item._id, item.isLiked, index), item._id),
        o: common_vendor.t(item.comments || 0),
        p: common_vendor.o(($event) => $options.commentPost(item._id), item._id),
        q: common_vendor.o(($event) => $options.sharePost(item._id), item._id),
        r: "79030325-2-" + i0,
        s: common_vendor.p({
          rotate: index % 2 === 0 ? -0.5 : 0.5
        }),
        t: item._id
      });
    })
  } : {
    f: common_vendor.o($options.goToPost),
    g: common_vendor.p({
      text: "去发布",
      type: "primary"
    }),
    h: common_vendor.p({
      rotate: -1
    })
  }, {
    d: $data.postList.length > 0,
    i: $data.postList.length > 0 && !$data.isEnd
  }, $data.postList.length > 0 && !$data.isEnd ? {
    j: common_vendor.o($options.loadMore),
    k: common_vendor.p({
      text: "加载更多",
      type: "secondary",
      loading: $data.loadingMore
    })
  } : {}, {
    l: $data.isEnd && $data.postList.length > 0
  }, $data.isEnd && $data.postList.length > 0 ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
