const app = getApp();
const util = require('../../../Utils/Util.js');
const db = require('../../../Utils/DbConsole')
const fs = wx.getFileSystemManager()
Page({
  data: {
    tmpid: '',
    AnimateArray: [
      app.globalData.AnimateList,
      app.globalData.AnimateSpeed,
      app.globalData.AnimateDelay,
      app.globalData.AnimateInfinite
    ],
    ColorList: app.globalData.ColorList,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    pageArray: app.globalData.pageArray,
    title: '',
    titleColor: 'white',
    titleIndex: '14',
    subTitle: '',
    subTitleColor: 'white',
    subTitleIndex: '14',
    content: '',
    contentColor: 'white',
    contentIndex: '14',
    buttonName: '提交',
    buttonColor: 'white',
    buttonIndex: '14',
    pageIndex: '0',
    titleMultiIndex: [22, 3, 0, 0],
    titleAnimate: 'animated fadeInDown slower',
    subTitleMultiIndex: [22, 3, 0, 0],
    subTitleAnimate: 'animated fadeInDown slower',
    contentMultiIndex: [22, 3, 0, 0],
    contentAnimate: 'animated fadeInDown slower',
    buttonMultiIndex: [22, 3, 0, 0],
    buttonAnimate: 'animated fadeInDown slower',
    date: '2018-12-25',
    time: '12:01',
    selectMapLocation: {
      name: '地图选择'
    },
    files: '',
    videoUrl: '',
    videoImg: '',
    pageData: {

    },
    disabled: false
  },
  onLoad(e) {
    console.log(e)
    let type = e.type
    if (!util.checkObject(type) && type === '1') {
      let page = wx.getStorageSync('editPageInfo')
      this.setPageInfo(page)
    }
    this.setData({
      type: type,
      updateIndex: e.index,
      tmpid: e.tmpid
    })

  },
  /** 页面类型选择 */
  PagePickerChange(e) {
    this.setData({
      pageIndex: e.detail.value
    })
  },
  /** 标题颜色选择 */
  TitleColorPickerChange(e) {
    let ColorList = this.data.ColorList
    let colorIndex = e.detail.value
    this.setData({
      titleIndex: colorIndex,
      titleColor: ColorList[colorIndex].name
    })
  },
  SetTitleValue(e) {
    this.setData({
      title: e.detail.value
    })
  },
  /** 子标题颜色选择 */
  SubTitleColorPickerChange(e) {
    let ColorList = this.data.ColorList
    let colorIndex = e.detail.value
    this.setData({
      subTitleIndex: colorIndex,
      subTitleColor: ColorList[colorIndex].name
    })
  },
  SetSubTitleValue(e) {
    this.setData({
      subTitle: e.detail.value
    })
  },
  /** 文案颜色选择 */
  ContentColorPickerChange(e) {
    let ColorList = this.data.ColorList
    let colorIndex = e.detail.value
    this.setData({
      contentIndex: e.detail.value,
      contentColor: ColorList[colorIndex].name
    })
  },
  SetContentValue(e) {
    this.setData({
      content: e.detail.value
    })
  },

  /** 按钮颜色选择 */
  ButtonColorPickerChange(e) {
    let ColorList = this.data.ColorList
    let colorIndex = e.detail.value
    this.setData({
      buttonIndex: e.detail.value,
      buttonColor: ColorList[colorIndex].name
    })
  },
  SetButtonNameValue(e) {
    this.setData({
      buttonName: e.detail.value
    })
  },
  /** 标题动画选择 */
  TitleMultiChange(e) {
    let AnimateArray = this.data.AnimateArray
    let animateArray = e.detail.value
    this.setData({
      titleAnimate: ''
    }, () => {
      this.setData({
        titleMultiIndex: animateArray,
        titleAnimate: 'animated ' + AnimateArray[0][animateArray[0]].code + ' ' + AnimateArray[1][animateArray[1]].code + ' ' + AnimateArray[2][animateArray[2]].code + ' ' + AnimateArray[3][animateArray[3]].code
      })
    })

  },
  /** 子标题动画选择 */
  SubTitleMultiChange(e) {
    let AnimateArray = this.data.AnimateArray
    let animateArray = e.detail.value
    this.setData({
      subTitleAnimate: ''
    }, () => {
      this.setData({
        subTitleMultiIndex: animateArray,
        subTitleAnimate: 'animated ' + AnimateArray[0][animateArray[0]].code + ' ' + AnimateArray[1][animateArray[1]].code + ' ' + AnimateArray[2][animateArray[2]].code + ' ' + AnimateArray[3][animateArray[3]].code
      })
    })

  },
  /** 文案动画选择 */
  ContentMultiChange(e) {
    let AnimateArray = this.data.AnimateArray
    let animateArray = e.detail.value
    this.setData({
      contentAnimate: ''
    }, () => {
      this.setData({
        contentMultiIndex: e.detail.value,
        contentAnimate: 'animated ' + AnimateArray[0][animateArray[0]].code + ' ' + AnimateArray[1][animateArray[1]].code + ' ' + AnimateArray[2][animateArray[2]].code + ' ' + AnimateArray[3][animateArray[3]].code
      })
    })
  },
  /** 按钮动画选择 */
  ButtonMultiChange(e) {
    let AnimateArray = this.data.AnimateArray
    let animateArray = e.detail.value
    this.setData({
      contentAnimate: ''
    }, () => {
      this.setData({
        buttonMultiIndex: e.detail.value,
        buttonAnimate: 'animated ' + AnimateArray[0][animateArray[0]].code + ' ' + AnimateArray[1][animateArray[1]].code + ' ' + AnimateArray[2][animateArray[2]].code + ' ' + AnimateArray[3][animateArray[3]].code
      })
    })
  },

  /** 宴会日期选择器 */
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  /** 宴会地点选择 */
  MapSelect(e) {
    /** 判断是否授权未处理 */
    wx.chooseLocation({
      success: (data) => {
        this.setData({
          selectMapLocation: data
        })
      },
      fail: (data) => {
        wx.showModal({
          title: '需要获取位置权限来选择地址',
          content: '是否打开设置呢？',
          cancelText: '算了',
          confirmText: '好的',
          success: res => {
            if (res.confirm) {
              wx.openSetting()
            }
          } 
        })
      }
    })
  },
  ChooseImage() {
    let that = this
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        let path = 'user/background-' + util.getTimeStamp() + '.png'
        wx.cloud.uploadFile({
          cloudPath: path,
          filePath: res.tempFilePaths[0],
        }).then(res => {
          that.setData({
            files: res.fileID
          })
        })
      }
    });
  },

  ViewImage(e) {
    wx.previewImage({
      current: this.data.files
    });
  },
  DelVideo(e) {
    let d = this.data
    let that = this
    wx.showModal({
      title: '视频删除',
      content: '确定要删除这个视频🐎？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          wx.cloud.deleteFile({
            fileList: [d.videoUrl, d.videoImg]
          }).then(res => {
            if (res.fileList[0].status === 0) {
              wx.showToast({
                title: '删除视频成功',
                icon: 'none'
              })
              that.setData({
                videoUrl: ''
              })
            } else {
              wx.showToast({
                title: '删除视频失败',
                icon: 'none'
              })
            }
          }).catch(error => {
            wx.showToast({
              title: '删除视频失败',
              icon: 'none'
            })
            that.setData({
              videoUrl: '',
              videoImg: ''
            })
          })
        }
      }
    })
  },
  /** 文件上传 最后修改成本地文件 到时候在处理 */
  DelImg(e) {
    let that = this
    wx.showModal({
      title: '背景图片删除',
      content: '确定要删除这张背景🐎？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          wx.cloud.deleteFile({
            fileList: [d.files]
          }).then(res => {
            if (res.fileList[0].status === 0) {
              wx.showToast({
                title: '删除背景图片成功',
                icon: 'none'
              })
              that.setData({
                files: ''
              })
            } else {
              wx.showToast({
                title: '删除背景图片失败',
                icon: 'none'
              })
            }
          }).catch(error => {
            wx.showToast({
              title: '删除背景图片失败',
              icon: 'none'
            })
            that.setData({
              files: ''
            })
          })
        }
      }
    })
  },
  /** 上传视频 */
  ChooseVideo() {
    let d = this.data
    let that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: ['front', 'back'],
      success: function (res) {
        let chooseImg = res
        let file = chooseImg.tempFilePath
        let path = 'user/background-video-' + util.getTimeStamp() + file.substring(file.lastIndexOf("."), file.length)
        wx.cloud.uploadFile({
          cloudPath: path,
          filePath: file,
        }).then(res => {
          that.setData({
            videoUrl: res.fileID
          })
        })
        let imgFile = chooseImg.thumbTempFilePath
        let imgPath = 'user/background-videoImg-' + util.getTimeStamp() + imgFile.substring(imgFile.lastIndexOf("."), imgFile.length)
        wx.cloud.uploadFile({
          cloudPath: imgPath,
          filePath: imgFile,
        }).then(res => {
          that.setData({
            videoImg: res.fileID
          })
        })
      }
    })

  },
  getPageInfo(e) {
    let d = this.data
    let pageData = {}

    if (d.pageIndex === '1' || d.pageIndex === '2' || d.pageIndex === '3') {
      if (util.checkObject(d.files)) {
        wx.showToast({
          title: '背景图片未上传或者正在上传中,看到图片显示即可重试',
          icon: 'none'
        })
        return
      }
    }

    if (d.pageIndex === '4') {
      if (util.checkObject(d.videoUrl) || util.checkObject(d.videoImg)) {
        wx.showToast({
          title: '视频未上传或者正在上传中,看到视频截图显示即可重试',
          icon: 'none'
        })
        return
      }
    }
    /** 选择通用页面 */
    if (d.pageIndex === '1') {
      pageData = {
        type: '1',
        name: '通用页面',
        backgroundImg_url: d.files,
        title: d.title,
        titleIndex: d.titleIndex,
        titleColor: d.titleColor,
        titleMultiIndex: d.titleMultiIndex,
        titleAnimate: d.titleAnimate,
        subTitle: d.subTitle,
        subTitleIndex: d.subTitleIndex,
        subTitleColor: d.subTitleColor,
        subTitleMultiIndex: d.subTitleMultiIndex,
        subTitleAnimate: d.subTitleAnimate,
        content: d.content,
        contentIndex: d.contentIndex,
        contentColor: d.contentColor,
        contentMultiIndex: d.contentMultiIndex,
        contentAnimate: d.contentAnimate
      }
    }

    /** 选择地图页面 */
    if (d.pageIndex === '2') {
      pageData = {
        type: '2',
        name: '地图页面',
        backgroundImg_url: d.files,
        title: d.title,
        titleIndex: d.titleIndex,
        titleColor: d.titleColor,
        titleMultiIndex: d.titleMultiIndex,
        titleAnimate: d.titleAnimate,
        subTitle: d.subTitle,
        subTitleIndex: d.subTitleIndex,
        subTitleColor: d.subTitleColor,
        subTitleMultiIndex: d.subTitleMultiIndex,
        subTitleAnimate: d.subTitleAnimate,
        date: d.date,
        location: d.selectMapLocation
      }
    }

    /** 选择表格页面 */
    if (d.pageIndex === '3') {
      pageData = {
        type: '3',
        name: '填单页面',
        backgroundImg_url: d.files,
        title: d.title,
        titleIndex: d.titleIndex,
        titleColor: d.titleColor,
        titleMultiIndex: d.titleMultiIndex,
        titleAnimate: d.titleAnimate,
        content: d.content,
        contentIndex: d.contentIndex,
        contentColor: d.contentColor,
        contentMultiIndex: d.contentMultiIndex,
        contentAnimate: d.contentAnimate,
        buttonName: d.buttonName,
        buttonIndex: d.buttonIndex,
        buttonColor: d.buttonColor,
        buttonMultiIndex: d.buttonMultiIndex,
        buttonAnimate: d.buttonAnimate
      }
    }

    /** 选择视频页面 */
    if (d.pageIndex === '4') {
      pageData = {
        type: '4',
        name: '视频页面',
        videoUrl: d.videoUrl,
        videoImg: d.videoImg
      }
    }

    return pageData
  },
  /** 编辑初始化 */
  setPageInfo(d) {

    /** 选择通用页面 */
    if (d.type === '1') {
      this.setData({
        pageIndex: d.type,
        files: d.backgroundImg_url,
        title: d.title,
        titleIndex: d.titleIndex,
        titleColor: d.titleColor,
        titleMultiIndex: d.titleMultiIndex,
        titleAnimate: d.titleAnimate,
        subTitle: d.subTitle,
        subTitleIndex: d.subTitleIndex,
        subTitleColor: d.subTitleColor,
        subTitleMultiIndex: d.subTitleMultiIndex,
        subTitleAnimate: d.subTitleAnimate,
        content: d.content,
        contentIndex: d.contentIndex,
        contentColor: d.contentColor,
        contentMultiIndex: d.contentMultiIndex,
        contentAnimate: d.contentAnimate
      })
    }
    /** 选择地图页面 */
    if (d.type === '2') {
      this.setData({
        pageIndex: d.type,
        files: d.backgroundImg_url,
        title: d.title,
        titleIndex: d.titleIndex,
        titleColor: d.titleColor,
        titleMultiIndex: d.titleMultiIndex,
        titleAnimate: d.titleAnimate,
        subTitle: d.subTitle,
        subTitleIndex: d.subTitleIndex,
        subTitleColor: d.subTitleColor,
        subTitleMultiIndex: d.subTitleMultiIndex,
        subTitleAnimate: d.subTitleAnimate,
        date: d.date,
        selectMapLocation: d.location
      })
    }

    /** 选择表格页面 */
    if (d.type === '3') {
      this.setData({
        pageIndex: d.type,
        files: d.backgroundImg_url,
        title: d.title,
        titleIndex: d.titleIndex,
        titleColor: d.titleColor,
        titleMultiIndex: d.titleMultiIndex,
        titleAnimate: d.titleAnimate,
        content: d.content,
        contentIndex: d.contentIndex,
        contentColor: d.contentColor,
        contentMultiIndex: d.contentMultiIndex,
        contentAnimate: d.contentAnimate,
        buttonName: d.buttonName,
        buttonIndex: d.buttonIndex,
        buttonColor: d.buttonColor,
        buttonMultiIndex: d.buttonMultiIndex,
        buttonAnimate: d.buttonAnimate
      })
    }
    /** 选择视频页面 */
    if (d.type === '4') {
      this.setData({
        pageIndex: d.type,
        videoUrl: d.videoUrl,
        videoImg: d.videoImg
      })
    }
  },
  showCreate(e) {
    let pageData = this.getPageInfo()
    if (util.checkObject(pageData)) {
      return
    }
    wx.setStorage({
      key: 'showPageOne',
      data: pageData,
      success: function (res) {
        wx.navigateTo({
          url: '../templateone/templateone?type=1'
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })

  },
  saveCreate(e) {
    let pageData = this.getPageInfo()
    if (util.checkObject(pageData)) {
      return
    }
    let that = this
    that.setData({
      disabled: true
    })

    if (!util.checkObject(that.data.type) && that.data.type === '1') {
      let param = 'pages.' + that.data.updateIndex
      let data = {
        [param]: pageData
      }
      db.updateCreativePage(that.data.tmpid, data).then(res => {
        util.backPage(1)
        wx.showToast({
          title: '修改页面成功',
          icon: 'none'
        })
      })
      that.setData({
        disabled: false
      })
    } else {
      db.addPageInCreative(this.data.tmpid, pageData).then(res => {
        util.backPage(1)
        wx.showToast({
          title: '新建页面成功',
          icon: 'none'
        })
      })
      that.setData({
        disabled: false
      })
    }

  }
})