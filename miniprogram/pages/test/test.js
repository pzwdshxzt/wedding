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
      rowHeight: 100,
      scrollHeight: 100,
      startIndex: null,
      scrollY: true,
      readyPlaceIndex: null,
      startY: 0,
      selectedIndex: null,
    },
    creative:{
      pages: [{
        "name": "通用页面",
        "backgroundImg_url": "cloud://dev-p.6465-dev-p-1300251472/user/background-1576657040000.png",
        "subTitle": "Cyq",
        "type": "1",
        "title": "人生若只如初见",
        "contentColor": "mauve",
        "titleAnimate": "animated fadeInDown slower",
        "subTitleAnimate": "animated fadeInDown slower",
        "content": "我摸摸摸摸哦",
        "contentAnimate": "animated fadeInDown slower",
        "titleColor": "cyan",
        "subTitleColor": "grey"
      }, {
        "title": "哈哈哈哈",
        "titleAnimate": "animated fadeInDown slower",
        "subTitleColor": "mauve",
        "type": "2",
        "date": "2019-01-30",
        "name": "地图页面",
        "backgroundImg_url": "cloud://dev-p.6465-dev-p-1300251472/user/background-1576657353000.png",
        "titleColor": "white",
        "subTitle": "，哈哈哈哈哈",
        "location": {
          "longitude": 114.11736760172886,
          "address": "广东省深圳市罗湖区3038 Shennan East Rd",
          "errMsg": "chooseLocation:ok",
          "poiid": "City",
          "latitude": 22.543478304800427,
          "name": "合作金融大厦(深南东路3038-1)"
        },
        "subTitleAnimate": "animated fadeInDown slower"
      }, {
        "contentColor": "white",
        "title": "哈哈哈哈",
        "buttonName": "提交",
        "buttonAnimate": "animated fadeInDown slower",
        "titleColor": "white",
        "name": "填单页面",
        "titleAnimate": "animated fadeInDown slower",
        "contentAnimate": "animated fadeInDown slower",
        "backgroundImg_url": "cloud://dev-p.6465-dev-p-1300251472/user/background-1576657404000.png",
        "content": "哈哈哈哈哈哈哈",
        "buttonColor": "white",
        "type": "3"
      }, {
        "name": "视频页面",
        "videoUrl": "cloud://dev-p.6465-dev-p-1300251472/user/background-video-1576657477000.mp4",
        "type": "4"
      }, {
        "type": "4",
        "name": "视频页面",
        "videoUrl": "cloud://dev-p.6465-dev-p-1300251472/user/background-video-1576657697000.mp4"
      }]
    }
  },

  dragStartTwo: function (event) {
    var startIndex = event.target.dataset.index
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
    this.setData(param,() =>{
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },


})