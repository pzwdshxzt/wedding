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
    loading: true,
    mock: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    db.getConfig('mock').then(res => {
      that.setData({
        mock: res.data[0].value
      },() =>{
        if(that.data.mock){
          db.getCreativesByOpenId('mock').then(res => {
            this.setData({
              ['creatives[0].creative']: res.data[0],
              loading: false
            })
          })
        } else {
          cloud.getOpendId().then(res => {
            let openid = res
            that.setData({
              openid
            }, () => {
              that.queryTokenByUser()
            })
          }).catch(err => {
            wx.showToast({
              title: '加载失败... 请重新再试!',
              icon: 'none'
            })
          });
        }
      })
    })
    
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
    if(this.data.mock){
      wx.setStorage({
        key: 'weddingData',
        data: this.data.creatives[0].creative,
        success: function (res) {
          wx.navigateTo({
            url: '../template/templateone/templateone?type=2'
          })
        }
      })
    } else {
      wx.navigateTo({
        url: '../template/templateone/templateone?tmpid='+e.currentTarget.dataset.id + '&type=4&token=' + e.currentTarget.dataset.token,
      })
    }
    
  }
})