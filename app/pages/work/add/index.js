const app = getApp();
let http = require('../../../utils/request')
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    TabbarBot: app.globalData.tabbar_bottom,
    hidden: true,
    name: '',
    content: '',
    latitude: null,
    longitude: null,
    address: '',
    fileList: [],
    price: 0,
    bottom: false,
    column1: ['食品', '饮品', '药品'],
    vaa: "",
    radio: '1',
  },
  onLoad: function (option) {
    this.isLogin()
  },
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },
  getLnglatValue() {
    const _this = this;
    wx.chooseLocation({
      success(res) {
        console.log(res.address)
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          address: res.address
        })
      },
      fail(e) {
        console.log(e);
      }
    })
  },
  onClick(event) {
    const {
      name
    } = event.currentTarget.dataset;
    this.setData({
      radio: name,
    });
  },
  toggleBottomPopup(e) {
    console.log(e)
    this.setData({
      bottom: true
    });
  },
  toggleBottomPopup2(e) {
    console.log(e)
    this.setData({
      bottom: false
    });
  },
  onChange1(event) {
    console.log("change", event.detail.value);
    this.setData({
      vaa: event.detail.value
    });
  },
  onConfirm(event) {
    console.log("confirm", event.detail.value);
    this.setData({
      vaa: event.detail.value
    });
    this.setData({
      bottom: false
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
        if (this.data.address == '' || this.data.content == '' || this.data.price == 0 || this.data.fileList === 0) {
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
          let data = {
            type: this.data.radio,
            userId: res.data.id,
            images: images.length !== 0 ? images.join(',') : null,
            totalPrice: this.data.price,
            address: this.data.address,
            longitude: this.data.longitude,
            latitude: this.data.latitude,
            onPut: this.data.radio == 1 ? 1 : 0,
            content: this.data.content
          }
          console.log(JSON.stringify(data))
          http.post('addService', data).then((r) => {
            wx.showToast({
              title: '提交成功！',
              icon: 'success',
              duration: 1000
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
    const {
      file
    } = event.detail;
    let that = this
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'http://127.0.0.1:9527/file/fileUpload', // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'avatar',
      success(res) {
        // 上传完成需要更新 fileList
        const {
          fileList = []
        } = that.data;
        fileList.push({
          ...file,
          url: res.data
        });
        that.setData({
          fileList
        });
        console.log(JSON.stringify(fileList))
      },
    });
  }
});