const db = require('../../Utils/DbConsole')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    creative:{

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
  queryCreative:function () {
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

  AddPage(e){
    wx.navigateTo({
      url: 'templateone/create?tmpid=' + this.data.creative._id
    })
  },
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  deleteCardInfo(e) {
    let id = e.currentTarget.dataset.id
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定删除该页面',
      success: function(e) {
        if (e.confirm) {

          /** 移除页面 数组 */
          // db.collection('CardInfos').doc(id).remove().then(res => {
          //   if (res.stats.removed === 1) {
          //     wx.showToast({
          //       title: '删除成功',
          //     })
          //     that.onShow()
          //   } else {
          //     wx.showToast({
          //       icon: 'none',
          //       title: '删除失败'
          //     })
          //   }
          // })
        }
      }
    })
    console.log(e)
  },
  showPage(e){
     wx.setStorage({
        key: 'weddingData',
        data: this.data.creative,
        success: function(res){
          wx.navigateTo({
            url: './templateone/templateone?type=2'
          })
        }
      })
  }
})