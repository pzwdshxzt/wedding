
const db = require('../../Utils/DbConsole')
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
      rowHeight: 83,
      scrollHeight: 100,
      startIndex: null,
      scrollY: true,
      readyPlaceIndex: null,
      startY: 0,
      selectedIndex: null,
    },
    loading: true,
    creative: {
      
    }
  },

  dragStartTwo: function (event) {
    console.log(event)
    var startIndex = event.currentTarget.dataset.index
    console.log(startIndex)
    console.log('获取到的元素为', this.data.creative.pages[startIndex])
    // 初始化页面数据
    var pageInfo = this.data.pageInfo
    pageInfo.startY = event.touches[0].clientY
    pageInfo.readyPlaceIndex = startIndex
    pageInfo.selectedIndex = startIndex
    pageInfo.scrollY = false
    pageInfo.startIndex = startIndex

    this.setData({
      'movableViewInfo.y': pageInfo.startY - (pageInfo.rowHeight / 2)
    })
    // 初始化拖动控件数据
    var movableViewInfo = this.data.movableViewInfo
    movableViewInfo.data = this.data.creative.pages[startIndex]
    movableViewInfo.showClass = "inline"

    this.setData({
      movableViewInfo: movableViewInfo,
      pageInfo: pageInfo
    })
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

  onLoad: function (options) {
    console.log(options)
    this.setData({
      tmpid: options.tmpid
    })
   
  },
  onShow: function(e){
    this.queryCreative();
    wx.showToast({
      title: '按住页面滑动修改顺序',
      icon: 'none'
    })
  },
  queryCreative:function () {
    db.getCreativesById(this.data.tmpid).then(res => {
      console.log(res)
      this.setData({
        creative: res.data,
        loading: false
      })
    })
  },
  SaveSortList:function (){
    let d = this.data
    db.saveSortList(d.tmpid,d.creative.pages).then(res => {
      console.log(res)
      if(res.stats.updated === 1){
        wx.showToast({
          title: '修改成功',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '修改失败',
          icon: 'none'
        })
      }
    })
  }
})