// miniprogram/pages/template/selecttemplate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    templates:[
      {
        picUrl: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10000.jpg',
        name:'模板一',
        url: '/pages/template/templateone/templateone'
      },
      {
        picUrl: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg',
        name:'待更新'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  /** 选择模板 */
  selectTemplate: (e) => {
    wx.navigateTo({
      url: 'edittemplate'
    })
  }
})