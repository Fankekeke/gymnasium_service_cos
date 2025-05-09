const app = getApp();
let http = require('../../../utils/request')
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    TabbarBot: app.globalData.tabbar_bottom,
    TabCur: 1, scrollLeft: 0,
    postInfo: null,
    imagesList: [],
    replyInfo: [],
    content: '',
    collectFlag: false
  },
  onLoad: function (options) {
    this.getPostInfo(options.postId)
  },
  getContent(e) {
    this.setData({ content: e.detail.value })
  },
  reply() {
    if (this.data.content == '') {
      wx.showToast({
        title: '请输入回复内容',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.getStorage({
        key: 'userInfo',
        success: (res) => {
          let data = {postId: this.data.postInfo.id, userId: res.data.userId, content: this.data.content}
          http.post('replyPost', data).then((r) => {
            wx.showToast({
              title: '回复成功',
              icon: 'success',
              duration: 2000
            })
            this.setData({content: ''})
            this.getPostInfo(this.data.postInfo.id)
          })
        },
        fail: res => {
          wx.showToast({
            title: '请先进行登录',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },
  getPostInfo(postId) {
    let userId = null
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
       userId = res.data.userId
       http.get('getPostInfoById', { postId, userId }).then((r) => {
        let images = ''
        if (r.postInfo.images) {
          images = r.postInfo.images.split(',')
        }
        this.setData({ imagesList: images, replyInfo: r.replyInfo, postInfo: r.postInfo })
        this.queryCollectPost()
      })
      },
      fail: res => {
        http.get('getPostInfoById', { postId }).then((r) => {
          let images = ''
          if (r.postInfo.images) {
            images = r.postInfo.images.split(',')
          }
          this.setData({ imagesList: images, replyInfo: r.replyInfo, postInfo: r.postInfo })
        }) 
      }
    })
  },
  queryCollectPost() {
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
       http.get('queryCollectPost', { postId: this.data.postInfo.id, userId: res.data.userId }).then((r) => {
        this.setData({ collectFlag: r.data > 0 })
      })
      }
    })
  },
  collectPost() {
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
       http.get('collectPost', { postId: this.data.postInfo.id, userId: res.data.userId, type: 1 }).then((r) => {
        this.queryCollectPost()
      })
      }
    })
  },
  collectPostElse() {
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
       http.get('collectPost', { postId: this.data.postInfo.id, userId: res.data.userId, type: 2 }).then((r) => {
        this.queryCollectPost()
      })
      }
    })
  }
});
