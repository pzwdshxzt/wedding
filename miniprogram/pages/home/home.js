const app = getApp()
const util = require('../../Utils/Util.js');
const db = require('../../Utils/DbConsole')
const cloud = require('../../Utils/Cloud')
const regeneratorRuntime = require('../../Utils/runtime.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    cloud.getOpendId().then(res => {
      let openid = res
      that.setData({
        openid
      }, () => {
        that.queryTokenByUser()
      })
    }).catch(err => {
      wx.showToast({
        title: '获取个人信息失败',
        icon: 'none'
      })
    });
  },
  async queryTokenByUser(e) {
    let that = this
    await db.queryTokenByUse(that.data.openid).then(res => {
      this.setData({
        creatives: res.data
      })
    }).catch(err => {
      console.log(err)
    })
    await that.queryInvite(this.data.creatives).then(res => {
      console.log(res)
    })
    that.setData({
      loading: false
    })
  },
  queryInvite(data) {
    let that = this
    return new Promise((resolve, reject) => {
      try {
        data.map((item, index) => {
          db.getCreativesById(item.tmpid).then(res => {
            let param = {};
            let str = "creatives[" + index + "].creative";
            param[str] = res.data;
            that.setData(param);

          })
          
        })
        resolve('success')
      } catch (error) {
        console.log(error)
        reject(error)
      }

    })
  },
  showInvite: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../template/templateone/templateone?tmpid='+e.currentTarget.dataset.id + '&type=4&token=' + e.currentTarget.dataset.token,
    })
  }
})