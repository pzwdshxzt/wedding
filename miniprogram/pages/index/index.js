const app = getApp()
const util = require('../../Utils/Util.js');
const db = require('../../Utils/DbConsole')
const cloud = require('../../Utils/Cloud')
Page({
  data: {
    openid: '',
    creatives: [

    ]
  },

  onLoad: function (e) {
    let that = this
    cloud.getOpendId().then(res => {
      let openid = res
      that.setData({
        openid
      })
      this.queryCreative(openid)
    }).catch(err => {
      wx.showToast({
        title: '获取个人信息失败',
        icon: 'none'
      })
    });
   
  },
  onShow: function (e) {
    this.queryCreative()
  },
  /** 查询自己的 */
  queryCreative: function (o) {
    let openid = o || this.data.openid
    console.log(openid)
    if(!util.checkObject(openid)){
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
  /** 移动 */
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
  deleteCreativeInfo(e) {
    let id = e.currentTarget.dataset.id
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定删除该请柬信息',
      success: function (e) {
        if (e.confirm) {
          /** 请柬删除 */
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
  onReachBottom: function () {
    this.setData({
      isloadmore: true
    })
    let that = this;
    if (this.data.list.length < this.data.cardInfosTotalCount) {
      db.collection('CardInfos')
        .skip(this.data.list.length)
        .orderBy('timestamp', 'desc').limit(10)
        .get().then(res => {
          if (res.data.length > 0) {
            let cardInfos = {};
            res.data.map(res => {
              if (res.type === 1) {
                res.number = res.number.replace(/(.{4})/g, "$1 ")
              }
            })
            cardInfos = that.data.list.concat(res.data);
            that.setData({
              list: cardInfos,
            })
          }
          this.setData({
            isloadmore: false
          })
        }).catch(res => {
          console.log("======" + res);
        })
    } else {
      this.setData({
        isloadmore: false
      })
    }
  }
})