"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      postId: "",
      commentList: [],
      loading: true,
      loadingMore: false,
      refreshing: false,
      isEnd: false,
      currentPage: 1,
      pageSize: 10,
      totalComments: 0,
      commentContent: "",
      replyTarget: null
      // 回复目标，包含用户信息和评论ID
    };
  },
  onLoad(options) {
    if (!this.checkLoginStatus())
      return;
    this.postId = options.postId;
    if (!this.postId) {
      common_vendor.index.showToast({
        title: "参数错误",
        icon: "none"
      });
      common_vendor.index.navigateBack();
      return;
    }
    this.loadComments();
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
    // 加载评论列表
    async loadComments(isRefresh = false) {
      if (isRefresh) {
        this.currentPage = 1;
        this.isEnd = false;
      }
      try {
        const token = common_vendor.index.getStorageSync("token");
        const result = await common_vendor.tr.callFunction({
          name: "get-comments",
          data: {
            token,
            postId: this.postId,
            page: this.currentPage,
            pageSize: this.pageSize
          }
        });
        if (result.result.code === 0) {
          const { comments, total } = result.result.data;
          if (isRefresh) {
            this.commentList = comments;
          } else {
            this.commentList = [...this.commentList, ...comments];
          }
          this.totalComments = total;
          if (this.commentList.length >= total) {
            this.isEnd = true;
          }
        } else {
          common_vendor.index.showToast({
            title: result.result.message || "加载失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/comments/comments.vue:206", "加载评论失败:", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
        this.loadingMore = false;
        this.refreshing = false;
      }
    },
    // 刷新评论
    refreshComments() {
      this.refreshing = true;
      this.loadComments(true);
    },
    // 加载更多
    loadMore() {
      if (this.loadingMore || this.isEnd)
        return;
      this.loadingMore = true;
      this.currentPage++;
      this.loadComments();
    },
    // 回复评论
    replyToComment(comment, reply = null) {
      if (reply) {
        this.replyTarget = {
          ...reply.userInfo,
          commentId: reply._id,
          parentCommentId: comment._id
        };
      } else {
        this.replyTarget = {
          ...comment.userInfo,
          commentId: comment._id,
          parentCommentId: null
        };
      }
      this.$nextTick(() => {
        this.commentContent = "";
      });
    },
    // 提交评论
    async submitComment() {
      const content = this.commentContent.trim();
      if (!content) {
        common_vendor.index.showToast({
          title: "请输入评论内容",
          icon: "none"
        });
        return;
      }
      try {
        const token = common_vendor.index.getStorageSync("token");
        const data = {
          token,
          postId: this.postId,
          content
        };
        if (this.replyTarget) {
          data.replyTo = this.replyTarget.commentId;
        }
        const result = await common_vendor.tr.callFunction({
          name: "add-comment",
          data
        });
        if (result.result.code === 0) {
          this.commentContent = "";
          this.replyTarget = null;
          this.refreshComments();
          common_vendor.index.showToast({
            title: "评论成功",
            icon: "success"
          });
        } else {
          common_vendor.index.showToast({
            title: result.result.message || "评论失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/comments/comments.vue:303", "评论失败:", error);
        common_vendor.index.showToast({
          title: "评论失败",
          icon: "none"
        });
      }
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
      return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
    }
  }
};
if (!Array) {
  const _easycom_BrutalistLoading2 = common_vendor.resolveComponent("BrutalistLoading");
  const _easycom_BrutalistAvatar2 = common_vendor.resolveComponent("BrutalistAvatar");
  const _easycom_BrutalistCard2 = common_vendor.resolveComponent("BrutalistCard");
  const _easycom_BrutalistInput2 = common_vendor.resolveComponent("BrutalistInput");
  const _easycom_BrutalistButton2 = common_vendor.resolveComponent("BrutalistButton");
  (_easycom_BrutalistLoading2 + _easycom_BrutalistAvatar2 + _easycom_BrutalistCard2 + _easycom_BrutalistInput2 + _easycom_BrutalistButton2)();
}
const _easycom_BrutalistLoading = () => "../../components/BrutalistLoading/BrutalistLoading.js";
const _easycom_BrutalistAvatar = () => "../../components/BrutalistAvatar/BrutalistAvatar.js";
const _easycom_BrutalistCard = () => "../../components/BrutalistCard/BrutalistCard.js";
const _easycom_BrutalistInput = () => "../../components/BrutalistInput/BrutalistInput.js";
const _easycom_BrutalistButton = () => "../../components/BrutalistButton/BrutalistButton.js";
if (!Math) {
  (_easycom_BrutalistLoading + _easycom_BrutalistAvatar + _easycom_BrutalistCard + _easycom_BrutalistInput + _easycom_BrutalistButton)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.totalComments),
    b: $data.loading
  }, $data.loading ? {
    c: common_vendor.p({
      text: "加载中..."
    })
  } : $data.commentList.length > 0 ? {
    e: common_vendor.f($data.commentList, (comment, index, i0) => {
      return common_vendor.e({
        a: "203f8302-2-" + i0 + "," + ("203f8302-1-" + i0),
        b: common_vendor.p({
          src: comment.userInfo.avatar,
          text: comment.userInfo.nickname,
          size: "small"
        }),
        c: common_vendor.t(comment.userInfo.nickname),
        d: common_vendor.t($options.formatTime(comment.createTime)),
        e: common_vendor.t(comment.content),
        f: common_vendor.o(($event) => $options.replyToComment(comment), comment._id),
        g: comment.replies && comment.replies.length > 0
      }, comment.replies && comment.replies.length > 0 ? {
        h: common_vendor.f(comment.replies, (reply, k1, i1) => {
          return {
            a: "203f8302-3-" + i0 + "-" + i1 + "," + ("203f8302-1-" + i0),
            b: common_vendor.p({
              src: reply.userInfo.avatar,
              text: reply.userInfo.nickname,
              size: "small"
            }),
            c: common_vendor.t(reply.userInfo.nickname),
            d: common_vendor.t($options.formatTime(reply.createTime)),
            e: common_vendor.t(reply.content),
            f: common_vendor.o(($event) => $options.replyToComment(comment, reply), reply._id),
            g: reply._id
          };
        }),
        i: common_vendor.t(comment.userInfo.nickname)
      } : {}, {
        j: "203f8302-1-" + i0,
        k: common_vendor.p({
          rotate: index % 2 === 0 ? -0.5 : 0.5
        }),
        l: comment._id
      });
    })
  } : {
    f: common_vendor.p({
      rotate: -1
    })
  }, {
    d: $data.commentList.length > 0,
    g: !$data.isEnd && $data.commentList.length > 0
  }, !$data.isEnd && $data.commentList.length > 0 ? common_vendor.e({
    h: $data.loadingMore
  }, $data.loadingMore ? {
    i: common_vendor.p({
      text: "加载中..."
    })
  } : {}) : {}, {
    j: $data.refreshing,
    k: common_vendor.o((...args) => $options.refreshComments && $options.refreshComments(...args)),
    l: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args)),
    m: common_vendor.o($options.submitComment),
    n: common_vendor.o(($event) => $data.commentContent = $event),
    o: common_vendor.p({
      placeholder: $data.replyTarget ? `回复 ${$data.replyTarget.nickname}` : "发表评论",
      modelValue: $data.commentContent
    }),
    p: common_vendor.o($options.submitComment),
    q: common_vendor.p({
      text: "发送",
      disabled: !$data.commentContent.trim()
    }),
    r: common_vendor.p({
      rotate: 0
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/comments/comments.js.map
