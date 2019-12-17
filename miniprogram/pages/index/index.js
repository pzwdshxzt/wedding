const app = getApp()
const util = require('../../Utils/Util.js');
Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: app.globalData.userInfo,
    logged: false,
    takeSession: false,
    nickName: '',
    workTime: '',
    restTime: ''
  },

  onLoad: function() {
    this.setData({
      workTime: wx.getStorageSync('workTime'),
      restTime: wx.getStorageSync('restTime')
    })

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
  addInvite: ()=>{
    wx.navigateTo({
      url: '../template/selecttemplate'
    })
  },
  onBuild(){
    wx.showToast({
      icon: 'none',
      title: '正在建设中...'
    })
  }
})