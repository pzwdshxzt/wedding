const db = require('../../Utils/DbConsole')
const util = require('../../Utils/Util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    tmpid: '',
    headPicUrl: '',
    sharePicUrl: ''
  },
  SetTitleValue: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      tmpid: options.tmpid
    })
 
  },
  /** 获取客户信息 */
  getUserInfo(e) {
    console.log('getUserInfo')
    if (e.detail.errMsg === 'getUserInfo:ok') {
      app.globalData.userInfo = JSON.parse(e.detail.rawData)
    } else {
      console.log('fail', '获取用户信息失败')
      wx.showModal({
        title: '提示',
        content: '获取用户信息失败',
        showCancel: false,
        confirmColor: '#e2211c',
        success(res) {

        }
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  SaveTemplate: function(e){

    let d = this.data
    if (util.checkObject(d.title)){
      wx.showToast({
        title: '标题不能为空',
        icon: 'none'
      })
      return
    }
    if (util.checkObject(d.headPicUrl)){
      wx.showToast({
        title: '头像图片不能为空',
        icon: 'none'
      })
      return
    }

    if (util.checkObject(d.sharePicUrl)){
      wx.showToast({
        title: '分享图片不能为空',
        icon: 'none'
      })
      return
    }
    let data = {
      title: d.title,
      headPicUrl: d.headPicUrl,
      sharePicUrl: d.sharePicUrl,
      templateId: d.tmpid
    }
    db.addCreavite(data)
    util.backPage(2)
  },
  ViewHeadImage: function(e) {
    wx.previewImage({
      current: this.data.headPicUrl
    });
  },
  ChooseHeadImage:function(e){
    let that = this
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        console.log(res)
        let path = 'user/headPicUrl-' + util.getTimeStamp() + '.png'
        console.log(path)
        console.log('11111')
        wx.cloud.uploadFile({
          cloudPath: path,
          filePath: res.tempFilePaths[0],
        }).then(res => {
          console.log(res)
          that.setData({
            headPicUrl: res.fileID
          })
        })
      }
    });
  },
  ChooseShareImage:function(e){
    let that = this
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        console.log(res)
        let path = 'user/sharePicUrl-' + util.getTimeStamp() + '.png'
        wx.cloud.uploadFile({
          cloudPath: path,
          filePath: res.tempFilePaths[0],
        }).then(res => {
          console.log(res)
          that.setData({
            sharePicUrl: res.fileID
          })
        })
      }
    });
  },
  ViewShareImage: function(e){
    wx.previewImage({
      current: this.data.sharePicUrl
    });
  }
})