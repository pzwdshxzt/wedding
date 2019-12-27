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
    sharePicUrl: '',
    headTitle: '',
    creative: {},
    disabled: false
  },
  SetTitleValue: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  SetHeadTitleValue: function (e) {
    this.setData({
      headTitle: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let type = options.type
    if (!util.checkObject(type) && type === '99') {
      db.getCreativesById(options.id).then(res => {
        let creative = res.data
        this.setData({
          type,
          creative,
          headPicUrl: creative.headPicUrl,
          sharePicUrl: creative.sharePicUrl,
          tmpid: creative.templateId,
          title: creative.title,
          headTitle: creative.headTitle,
          musicUrl: creative.musicUrl,
          musicName: creative.musicName
        })
      })
    } else {
      this.setData({
        tmpid: options.tmpid
      })
    }

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
  SaveTemplate: function (e) {

    let d = this.data
    let that = this
    if (util.checkObject(d.title)) {
      wx.showToast({
        title: '标题不能为空',
        icon: 'none'
      })
      return
    }
    if (util.checkObject(d.headPicUrl)) {
      wx.showToast({
        title: '头像图片不能为空',
        icon: 'none'
      })
      return
    }

    if (util.checkObject(d.sharePicUrl)) {
      wx.showToast({
        title: '分享图片不能为空',
        icon: 'none'
      })
      return
    }


    if (util.checkObject(d.musicName) || d.musicName === '正在上传中') {
      wx.showToast({
        title: '背景音乐不能为空吧',
        icon: 'none'
      })
      return
    }

    that.setData({
      disabled: true
    })
    if (!util.checkObject(d.type) && d.type === '99') {
      let data = {
        title: d.title,
        headTitle: d.headTitle,
        headPicUrl: d.headPicUrl,
        sharePicUrl: d.sharePicUrl,
        musicName: d.musicName,
        musicUrl: d.musicUrl
      }
      db.updateCreavite(d.creative._id, data)
      util.backPage(1)
    } else {
      let data = {
        title: d.title,
        headTitle: d.headTitle,
        headPicUrl: d.headPicUrl,
        sharePicUrl: d.sharePicUrl,
        templateId: d.tmpid,
        musicName: d.musicName,
        musicUrl: d.musicUrl
      }
      db.addCreavite(data).then(res => {
        that.setData({
          disabled: false
        })
        util.backPage(2)
      })
    }
  },
  ViewHeadImage: function (e) {
    wx.previewImage({
      current: this.data.headPicUrl
    });
  },
  ChooseHeadImage: function (e) {
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
  ChooseShareImage: function (e) {
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
  ViewShareImage: function (e) {
    wx.previewImage({
      current: this.data.sharePicUrl
    });
  },
  DelShareImg: function (e) {
    let d = this.data
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定删除分享图片？',
      success: function (e) {
        if (e.confirm) {
          wx.cloud.deleteFile({
            fileList: [d.sharePicUrl]
          }).then(res => {
            if (res.fileList[0].status === 0) {
              wx.showToast({
                title: '删除分享图片成功',
                icon: 'none'
              })
              that.setData({
                sharePicUrl: ''
              })
            } else {
              wx.showToast({
                title: '删除分享图片失败',
                icon: 'none'
              })
            }
          }).catch(error => {
            wx.showToast({
              title: '删除分享图片失败',
              icon: 'none'
            })
            that.setData({
              sharePicUrl: ''
            })
          })
        }
      }
    })

  },
  DelHeadImg: function (e) {
    let d = this.data
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定删除首屏头像图片？',
      success: function (e) {
        if (e.confirm) {
          wx.cloud.deleteFile({
            fileList: [d.headPicUrl]
          }).then(res => {
            console.log(res)
            if (res.fileList[0].status === 0) {
              wx.showToast({
                title: '删除首屏头像成功',
                icon: 'none'
              })
              that.setData({
                headPicUrl: ''
              })
            } else {
              wx.showToast({
                title: '删除首屏头像失败',
                icon: 'none'
              })
              that.setData({
                sharePicUrl: ''
              })
            }
          }).catch(error => {
            console.log(error)
            wx.showToast({
              title: '删除首屏头像失败',
              icon: 'none'
            })
          })
        }
      }
    })
  },
  SelectMusicUrl: function (e) {
    let that = this
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        console.log(res)
        that.setData({
          musicName: '正在上传中'
        })
        let name = res.tempFiles[0].name
        let file = res.tempFiles[0].path
        let path = 'user/music/' + util.getTimeStamp() + file.substring(file.lastIndexOf("."), file.length)
        wx.cloud.uploadFile({
          cloudPath: path,
          filePath: res.tempFiles[0].path,
        }).then(res => {
          console.log(res)
          that.setData({
            musicUrl: res.fileID,
            musicName: name
          })
        })
      }
    })
  }
})