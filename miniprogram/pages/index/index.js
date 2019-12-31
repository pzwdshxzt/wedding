const app = getApp()
const util = require('../../Utils/Util.js');
const db = require('../../Utils/DbConsole')
const cloud = require('../../Utils/Cloud')
Page({
  data: {
    openid: '',
    creatives: [

    ],
    openCreative: false,
    mock: true
  },
  initConfig: function (e) {
    let that = this
    db.getConfig('openCreative').then(res => {
      that.setData({
        openCreative: res.data[0].value
      })
    })
    db.getConfig('mock').then(res => {
      that.setData({
        mock: res.data[0].value
      }, () => {
        if (that.data.mock) {
          that.setData({
            openid: 'mock'
          })
          that.queryCreative('mock')
        } else {
          cloud.getOpendId().then(res => {
            let openid = res
            that.setData({
              openid
            })
            that.queryCreative(openid)
          }).catch(err => {
            console.log(err)
          });
        }
      })
    })
  },
  onLoad: function (e) {
    let that = this
    that.initConfig()
  },
  onShow: function (e) {
    this.queryCreative()
  },
  /** 查询自己的 */
  queryCreative: function (o) {
    let openid = o || this.data.openid
    console.log(openid)
    if (!util.checkObject(openid)) {
      db.getCreativesByOpenId(openid).then(res => {
        this.setData({
          creatives: res.data
        })
      })
    }
  },
  /** 用户信息 */
  registerUserInfo: function (e) {
    if (util.checkObject(this.data.userInfo)) {
      util.checkAuthUserInfo().then(res => {
        console.log(res)
        this.setData({
          avatarUrl: res.avatarUrl,
          userInfo: res,
          nickName: res.nickName
        })
      }).catch(err => {
        console.log(err)
        console.log('auth err')
      })
    }
  },
  /** 选择模板 */
  addInvite: () => {
    wx.navigateTo({
      url: '../template/selecttemplate'
    })
  },
  /** 正在建设中 */
  onBuild() {
    wx.showToast({
      icon: 'none',
      title: '正在建设中...'
    })
  },
  /** 修改模板 */
  editCreative(e) {
    console.log(e)
    wx.navigateTo({
      url: '../template/edittemplate?tmpid=' + e.currentTarget.dataset.tmpid
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
  deleteCreativeInfo(e) {
    let id = e.currentTarget.dataset.id
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定删除该请柬',
      success: function (e) {
        if (e.confirm) {
          db.deleteCreative(id)
          that.queryCreative()
        }
      }
    })
    console.log(e)
  }
})