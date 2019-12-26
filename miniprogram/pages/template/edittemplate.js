const db = require('../../Utils/DbConsole')
const dbq = wx.cloud.database()
const util = require('../../Utils/Util')
import Poster from '../../components/poster/poster';



Page({

  /**
   * 页面的初始数据
   */
  data: {
    posterConfig: {},
    movableViewInfo: {
      y: 0,
      showClass: 'none',
      data: {}
    },
    pageInfo: {
      rowHeight: 80,
      scrollHeight: 85,
      startIndex: null,
      scrollY: true,
      readyPlaceIndex: null,
      startY: 0,
      selectedIndex: null,
    },
    creative: {

    },
    tmpid: '',
    loading: true
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
  queryCreative: function () {
    db.getCreativesById(this.data.tmpid).then(res => {
      console.log(res)
      this.setData({
        creative: res.data,
        loading: false
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.queryCreative()
  },

  AddPage(e) {
    wx.navigateTo({
      url: 'templateone/create?tmpid=' + this.data.creative._id
    })
  },
  /** 左滑开始 */
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  /** 左滑 */
  ListTouchMove(e) {
    let d = this.data
    let diff = e.touches[0].pageX - d.ListTouchStart

    let t = 'none'
    if (diff > 100) {
      t = 'right'
    }
    if (diff < -100) {
      t = 'left'
    }
    this.setData({
      ListTouchDirection: t
    })
  },
  /** 左滑结束 */
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    }
    if (this.data.ListTouchDirection == 'right') {
      this.setData({
        modalName: null
      })
    }

    this.setData({
      ListTouchDirection: null
    })
  },
  deleteCardInfo(e) {
    let index = e.currentTarget.dataset.id
    console.log(index)
    let d = this.data
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定删除该页面',
      success: function (e) {
        if (e.confirm) {
          let pages = d.creative.pages
          pages.splice(index, 1);
          console.log(pages)
          let param = {
            'creative.pages': pages
          }
          db.saveSortList(d.tmpid, pages).then(res => {
            if (res.stats.updated === 1) {
              that.setData(param)
              wx.showToast({
                title: '删除页面成功',
                icon: 'none'
              })
            } else {
              wx.showToast({
                title: '删除页面失败',
                icon: 'none'
              })
            }
          })
        }
      }
    })
    console.log(e)
  },
  showOnePage(e) {
    let page = this.data.creative.pages[e.currentTarget.dataset.id]
    console.log(page)
    wx.setStorage({
      key: 'showPageOne',
      data: page,
      success: function (res) {
        wx.navigateTo({
          url: './templateone/templateone?type=1'
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  showPage(e) {
    if (this.data.creative.pages !== undefined && this.data.creative.pages.length >= 1) {
      wx.setStorage({
        key: 'weddingData',
        data: this.data.creative,
        success: function (res) {
          wx.navigateTo({
            url: './templateone/templateone?type=2'
          })
        }
      })
    } else {
      wx.showToast({
        title: '没有页面不能预览',
        icon: 'none'
      })
    }
  },
  dragMoveTwo: function (event) {
    var optionList = this.data.creative.pages
    var pageInfo = this.data.pageInfo
    // 计算拖拽距离
    var movableViewInfo = this.data.movableViewInfo
    var movedDistance = event.touches[0].clientY - pageInfo.startY
    movableViewInfo.y = pageInfo.startY - (pageInfo.rowHeight / 2) + movedDistance
    console.log('移动的距离为', movedDistance)

    // 修改预计放置位置
    var movedIndex = parseInt(movedDistance / pageInfo.rowHeight)
    var readyPlaceIndex = pageInfo.startIndex + movedIndex
    if (readyPlaceIndex < 0) {
      readyPlaceIndex = 0
    } else if (readyPlaceIndex >= optionList.length) {
      readyPlaceIndex = optionList.length - 1
    }

    if (readyPlaceIndex != pageInfo.selectedIndex) {
      var selectedData = optionList[pageInfo.selectedIndex]

      optionList.splice(pageInfo.selectedIndex, 1)
      optionList.splice(readyPlaceIndex, 0, selectedData)
      pageInfo.selectedIndex = readyPlaceIndex
    }
    // 移动movableView
    pageInfo.readyPlaceIndex = readyPlaceIndex
    // console.log('移动到了索引', readyPlaceIndex, '选项为', optionList[readyPlaceIndex])

    let param = {}
    let str = 'creative.pages'
    param[str] = optionList
    this.setData(param, () => {
      this.setData({
        movableViewInfo: movableViewInfo,
        pageInfo: pageInfo
      })
    })

  },
  dragEndTwo: function (event) {
    // 重置页面数据
    var pageInfo = this.data.pageInfo
    pageInfo.readyPlaceIndex = null
    pageInfo.startY = null
    pageInfo.selectedIndex = null
    pageInfo.startIndex = null
    pageInfo.scrollY = true
    // 隐藏movableView
    var movableViewInfo = this.data.movableViewInfo
    movableViewInfo.showClass = 'none'

    this.setData({
      pageInfo: pageInfo,
      movableViewInfo: movableViewInfo
    })
  },
  ListSort: function () {
    if (this.data.creative.pages !== undefined && this.data.creative.pages.length > 1) {
      wx.navigateTo({
        url: 'sortList?tmpid=' + this.data.tmpid
      })
    } else {
      wx.showToast({
        title: '页面太少无需修改顺序',
        icon: 'none'
      })
    }
  },
  shareApp: function (e) {
    let l = this.data.creative.pages.length
    if (util.checkObject(l) || l <= 0) {
      wx.showToast({
        title: '没有页面分享无意义',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '通过此页面调用的的分享页面只能给第一个人看，通过右上角胶囊',
        icon: 'none'
      })
    }

  },
  /** imageUrl: this.data.shareImg[util.getRandInt(0, 4)], */
  onShareAppMessage: function (e) {
    let uuid = util.uuid()
    db.newShareToken(this.data.tmpid, uuid)
    return {
      path: '/pages/template/templateone/templateone?type=4&tmpid=' + this.data.tmpid + '&token=' + uuid,
      imageUrl: this.data.creative.sharePicUrl,
      title: this.data.creative.title,
      success: function (res) {
        console.log('转发成功', res)
      }
    }
  },
  /**
   * 查看填单人
   * @param {} e 
   */
  acceptData: function (e) {
    wx.navigateTo({
      url: 'attendance?tmpid=' + this.data.tmpid
    })
  },
  /** 修改请柬信息 */
  editTemplate: function (e) {
    wx.navigateTo({
      url: './selecttemplateedit?type=99&id=' + this.data.tmpid,
    })
  },
  /** 修改页面信息 */
  EditPage: function (e) {
    console.log(e)
    let that = this
    wx.setStorage({
      key: 'editPageInfo',
      data: that.data.creative.pages[e.currentTarget.dataset.index],
      success: function (res) {
        wx.navigateTo({
          url: './templateone/create?type=1&index=' + e.currentTarget.dataset.index + '&tmpid=' + that.data.tmpid,
        })
      }
    })

  },
  onPosterSuccess(e) {
    const {
      detail
    } = e;
    wx.previewImage({
      current: detail,
      urls: [detail]
    })
  },
  onPosterFail(err) {
    console.error(err);
  },
  /** 分享图片二维码 */
  sharePicApp: function (e) {
    let that = this
    /** 判断是否获取过 当前页面二维码 */
    if (util.checkObject(that.data.creative.codeImg)) {
      var path = 'pages/template/templateone/templateone'
      var width = '430';
      that.getCreateImgData().then(res => {
        console.log(res)
        let scene = res
        dbq.collection('ShortCode').add({
          data: {
            tmpid: that.data.tmpid,
            scene
          }
        }).then(res => {
          console.log(res)
          wx.cloud.callFunction({
            name: 'openapi',
            data: {
              action: 'getShareAppCode',
              page: path,
              width,
              scene
            },
            success: res => {
              let data = {
                codeImg: res.result
              }
              db.updateCreativePage(that.data.tmpid, data).then(res => {
                console.log(res)
              })
              that.setData({
                ['creative.codeImg']: res.result
              },() => {
                that.showCodeImg()
              })
            },
            fail: error => {
              console.log(JSON.stringify(error))
            }
          });
        }).catch(err => {
          console.log(err)
        })
      })
    } else {
      that.showCodeImg()
    }
  },
  /** 跳转显示图片 */
  showCodeImg: function(){
    let that = this
    that.getCreateImgData().then(res => {
      console.log(res)
      that.setData({
        posterConfig: res.jdConfig
      }, () => {
        Poster.create(true); // 入参：true为抹掉重新生成 
      });
    })
  },
  /** 获取生成分享图片信息 */
  getCreateImgData: function () {
    let d = this.data
    return new Promise((resolve, reject) => {
      wx.cloud.getTempFileURL({
        fileList: [{
          fileID: d.creative.sharePicUrl,
          maxAge: 60 * 10, 
        },{
          fileID: d.creative.codeImg,
          maxAge: 60 * 10, 
        }]
      }).then(res => {
        console.log(res.fileList)
        let posterConfig = {
          jdConfig: {
            width: 750,
            height: 980,
            backgroundColor: '#fff',
            debug: false,
            pixelRatio: 1,
            blocks: [{
              width: 690,
              height: 920,
              x: 30,
              y: 30,
              borderWidth: 2,
              borderColor: '#f0c2a0',
              borderRadius: 20,
            }],
            texts: [{
                x: 100,
                y: 790,
                baseLine: 'middle',
                text: [{
                  text: d.creative.title,
                  fontSize: 36,
                  color: '#ec1731',
                }]
              },
    
              {
                x: 100,
                y: 850,
                baseLine: 'middle',
                text: [{
                  text: '长按识别小程序码',
                  fontSize: 28,
                  color: '#929292',
                }]
              }
            ],
            images: [{
                width: 634,
                height: 634,
                x: 59,
                y: 60,
                url: res.fileList[0].tempFileURL,
              },
              {
                width: 220,
                height: 220,
                x: 420,
                y: 710,
                url: res.fileList[1].tempFileURL,
              }
            ]
    
          }
        }
        resolve(posterConfig)
      }).catch(error => {
        reject(error)
      })
    })
  },
  /** 获取当前页面二维码 */
  getCreateImgData: function () {
    let d = this.data
    return new Promise((resolve, reject) => {
      db.getMaxValue().then(res => {
        if (res.list.length >= 1) {
          resolve(res.list[0].max + 1)
        } else {
          reject(100001)
        }
      })
    })
  }
})