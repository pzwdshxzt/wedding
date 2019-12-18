const app = getApp()
const util = require('../../Utils/Util.js');
Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: app.globalData.userInfo,
    logged: false,
    takeSession: false,
    nickName: '',
  },

  onLoad: function() {
    if (util.checkObject(this.data.userInfo)) {
      util.getUserInfo().then(res => {
        this.setData({
          avatarUrl: res.avatarUrl,
          userInfo: res,
          nickName: res.nickName
        })
      }).catch(err => {
        console.log('auth err')
      })
    }
  },
  registerUserInfo: function(e) {
    if (util.checkObject(this.data.userInfo)) {
      util.checkAuthUserInfo().then(res => {
        console.log(res)
        this.setData({
          avatarUrl: res.avatarUrl,
          userInfo: res,
          nickName: res.nickName
        })
      }).catch(err => {
        console.log('auth err')
      })
    }
  },
  onShow:function(){
    if (util.checkObject(this.data.userInfo)) {
      util.getUserInfo().then(res => {
        this.setData({
          avatarUrl: res.avatarUrl,
          userInfo: res,
          nickName: res.nickName
        })
      }).catch(err => {
        console.log('auth err')
      })
    }
  },
  onBuild(){
    wx.showToast({
      icon: 'none',
      title: '正在建设中...'
    })
  }
})