const db = require('../../Utils/DbConsole')
const util = require('../../Utils/Util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
  shareApp: function (e){
    let l = this.data.creative.pages.length
    if(util.checkObject(l) || l <= 0){
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
    db.newShareToken(this.data.tmpid,uuid)
    return {
      path: '/pages/template/templateone/templateone?type=4&tmpid=' + this.data.tmpid + '&token=' + uuid,
      imageUrl: this.data.creative.sharePicUrl,
      desc: '邀请你来!!!',
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
  }
})