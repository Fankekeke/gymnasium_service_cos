const app = getApp();
let http = require('../../../utils/request')
Page({
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		TabbarBot: app.globalData.tabbar_bottom,
		hidden: true,
    title: '',
    content: '',
    tagId: '',
    fileList: [],
    tagList: []
	},
	onLoad: function (option) {
    this.isLogin()
    this.selectTagList()
  },
  selectTagList() {
    http.get('selectTagList').then((r) => {
      this.setData({
        tagList: r.data,
      });
    })
  },
  onChange(event) {
    this.setData({
      tagId: event.detail,
    });
  },

  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      tagId: name,
    });
  },
  isLogin() {
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
      },
      fail: res => {
        wx.showToast({
          title: '请先进行登录',
          icon: 'none',
          duration: 2000
        })
        setTimeout(() => {
          wx.switchTab({
            url: '../index/index'
          })
        }, 1500)
      }
    })
  },
  submit() {
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        if (this.data.title == '' || this.data.content == '' || this.data.fileList === 0) {
          wx.showToast({
            title: '请完整填写！',
            icon: 'error',
            duration: 2000
          })
        } else {
          let images = []
          this.data.fileList.forEach(item => {
            images.push(item.url)
          });
          let data = {tagIds: this.data.tagId, title: this.data.title, content: this.data.content, userId: res.data.userId, images: images.length !== 0 ? images.join(',') : null}
          http.post('postAdd', data).then((r) => {
            wx.showToast({
              title: '发布成功！',
              icon: 'success',
              duration: 2000
            })
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          })
        }
      },
      fail: res => {
        wx.showToast({
          title: '请先进行登录',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  afterRead(event) {
    const { file } = event.detail;
    let that = this
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'http://127.0.0.1:9527/file/fileUpload', // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'avatar',
      success(res) {
        // 上传完成需要更新 fileList
        const { fileList = [] } = that.data;
        fileList.push({ ...file, url: res.data });
        that.setData({ fileList });
      },
    });
  }
});
