const db = require('../../../Utils/DbConsole')
const cloud = require('../../../Utils/Cloud')
const util = require('../../../Utils/Util')

const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = new getApp()

Page({
  data: {
    scrollindex: 0, //当前页面的索引值
    totalnum: 1, //总共页面数
    starty: 0, //开始的位置x
    endy: 0, //结束的位置y
    max_move_time: 1000, //触发翻页的临界值 最大值
    min_move_time: 200, //触发翻页的临界值 最小值
    move_max: 100,
    margintop: 0, //滑动下拉距离
    isPlayingMusic: true,
    autoplay: true,
    interval: 2600,
    duration: 1200,
    openid: '',
    loading: true,
    weddingData: {
      page: [],
      music_url: ''
    },
    startTime: 0,
    splash: false,
    appName: 'sdd',
    angle: 0,
    attendance: {

    },
    tel: '',
    name: '',
    tmpid: '',
    type: '',
  },
  initConfig: function(e){
    let that = this
    db.getConfig('max_move_time').then(res => {
      that.setData({
        max_move_time: res.data[0].value
      })
    })
    db.getConfig('min_move_time').then(res => {
      that.setData({
        min_move_time: res.data[0].value
      })
    })
    db.getConfig('move_max').then(res => {
      that.setData({
        move_max: res.data[0].value
      })
    })
  },
  onLoad: function (e) {
    
    console.log(e)
    let that = this
    that.initConfig()
   
    let openid = ''
    let type
    let scene
    if (!util.checkObject(e.type)) {
      type = e.type
      this.setData({
        type
      })
    }
    if (!util.checkObject(e.scene)) {
      scene = e.scene
    }
   
    cloud.getOpendId().then(res => {
      openid = res
      that.setData({
        openid
      })

      if (type === '1') {
        let page = wx.getStorageSync('showPageOne')
        let param = {}
        let str = 'weddingData.pages[0]'
        param[str] = page
        that.setData(param, () => {
          this.setData({
            loading: false,
            totalnum: that.data.weddingData.page.length
          })
        })
      }
      if (type === '2') {
        let weddingData = wx.getStorageSync('weddingData')
        this.setData({
          splash: true,
          loading: false,
          weddingData,
          totalnum: weddingData.pages.length
        })
      }
      if (type === '3') {
        this.setData({
          tmpid: e.tmpid
        }, () => {
          this.queryCreative();
        })
      }
      if (!util.checkObject(scene)) {
        let openid = this.data.openid
        db.getSceneTmp(scene).then(res => {
          that.setData({
            weddingData: res.data[0],
            totalnum: res.data[0].pages.length,
            loading: false,
            splash: true,
            tmpid: res.data[0]._id,
            type: '3'
          }, () => {
            that.musicInit()
          })
          let data = {
            _openid: openid,
            tmpid: res.data[0]._id
          }
          db.queryAttendanceByOpenId(data).then(res => {
            console.log(1111)
            console.log(res)
            let resp = res.data[0]
            console.log(resp)
            if (!util.checkObject(resp)) {
              that.setData({
                attendance: resp,
                name: resp.name,
                tel: resp.tel
              })
            }
          })
        }).catch(err => {
          console.log(err)
        })
      }
      if (type === '4') {
        if (e.token !== undefined && e.token !== '') {
          db.shareTokenQuery(e.token, e.tmpid).then(res => {
            let tokeninfo = res.data[0]
            console.log(res)
            if (tokeninfo === undefined || tokeninfo === null) {
              wx.showToast({
                title: '请柬无效',
                icon: 'none',
                duration: 2000
              })
            } else {
              if (tokeninfo.use !== undefined && tokeninfo.use !== '' && tokeninfo.tmpid === e.tmpid) {
                if (tokeninfo.use === openid) {
                  this.setData({
                    tmpid: e.tmpid
                  }, () => {
                    this.queryCreative();
                  })
                } else {
                  if (tokeninfo._openid !== openid) {
                    wx.showToast({
                      title: '请柬只能一人观看',
                      icon: 'none',
                      duration: 2000
                    })
                  }
                }
              }
              if ((tokeninfo.use === undefined || tokeninfo.use === '') && tokeninfo._openid !== openid) {
                db.tokenUse(e.token, this.data.openid)
                this.setData({
                  tmpid: e.tmpid
                }, () => {
                  this.queryCreative();
                })
              }
              if (tokeninfo._openid === openid) {
                this.setData({
                  tmpid: e.tmpid
                }, () => {
                  this.queryCreative();
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '未找到请柬',
            icon: 'none',
            duration: 2000
          })
        }
      }

    }).catch(err => {
      // wx.showToast({
      //   title: '获取个人信息失败',
      //   icon: 'none'
      // })
      console.log(err)
    });
  },
  queryCreative: function () {
    let tmpid = this.data.tmpid
    let openid = this.data.openid
    let that = this
    db.getCreativesById(tmpid).then(res => {
      console.log(res)
      that.setData({
        weddingData: res.data,
        totalnum: res.data.pages.length,
        loading: false,
        splash: true
      }, () => {
        that.musicInit()
      })
      let data = {
        _openid: openid,
        tmpid
      }
      db.queryAttendanceByOpenId(data).then(res => {
        console.log(1111)
        console.log(res)
        let resp = res.data[0]
        console.log(resp)
        if (!util.checkObject(resp)) {
          that.setData({
            attendance: resp,
            name: resp.name,
            tel: resp.tel
          })
        }
      })
    })
  },
  scrollTouchstart: function (e) {
    let startTime = e.timeStamp
    let py = e.touches[0].pageY;
    this.setData({
      starty: py,
      startTime
    })
  },
  scrollTouchmove: function (e) {
    let py = e.touches[0].pageY;
    let d = this.data;
    this.setData({
      endy: py
    })
    if (py - d.starty < 100 && py - d.starty > -100) {
      this.setData({
        margintop: py - d.starty
      })
    }
  },
  scrollTouchend: function (e) {
    let d = this.data;
    let diffstamp = e.timeStamp - d.startTime
    if (diffstamp < d.max_move_time && diffstamp > d.min_move_time && d.endy - d.starty > d.move_max && d.scrollindex > 0) {
      this.setData({
        scrollindex: d.scrollindex - 1
      })
    } else if (diffstamp < d.max_move_time && diffstamp > d.min_move_time && d.endy - d.starty < -d.move_max && d.scrollindex < this.data.totalnum - 1) {
      this.setData({
        scrollindex: d.scrollindex + 1
      })
    }
    this.setData({
      starty: 0,
      endy: 0,
      margintop: 0
    })
  },
  play: function (event) {
    if (this.data.isPlayingMusic) {
      backgroundAudioManager.pause()
      // wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    } else {
      backgroundAudioManager.play()
      this.setData({
        isPlayingMusic: true
      })
    }
  },
  initmap: function (e) {
    let oi_latitude = Number(e.detail.latitude).toFixed(5)
    let oi_longitude = Number(e.detail.longitude).toFixed(5)
    console.log(oi_latitude, oi_longitude)
    wx.openLocation({
      latitude: Number(oi_latitude),
      longitude: Number(oi_longitude),
      success: function (res) {
        console.log(res)
      }
    })
  },
  getUserInfo(e) {
    if (e.detail.errMsg === 'getUserInfo:ok') {
      app.globalData.userInfo = JSON.parse(e.detail.rawData)
    } else {
      console.log('fail', '获取用户信息失败')
      wx.showModal({
        title: '提示',
        content: '嘻嘻嘻嘻嘻',
        showCancel: false,
        confirmColor: '#e2211c',
        success(res) {

        }
      })
    }
  },
  btnEnter: function () {
    this.setData({
      splash: false
    })
  },

  addAttendance: function (e) {
    let d = this.data
    let type = d.type
    console.log(type)
    if (type === '3' || type === '4') {
      if (d.name === '') {
        wx.showToast({
          title: '名字不能为空',
          icon: 'none'
        })
        return
      }
      if (!util.checkObject(d.attendance)) {
        let param = {
          tmpid: d.tmpid,
          _openid: d.openid
        }
        let data = {
          name: d.name,
          tel: d.tel
        }
        db.updateAttendance(param, data).then(res => {
          console.log(res)
          if (res.stats.updated === 1) {
            wx.showToast({
              title: '更新成功',
              icon: 'none'
            })
          }
        })
      } else {
        let data = {
          userInfo: app.globalData.userInfo,
          name: d.name,
          tel: d.tel,
          tmpid: d.tmpid
        }
        console.log(data)
        db.addAttendance(data).then(res => {
          wx.showToast({
            title: '提交成功',
            icon: 'none'
          })
        })
      }
    }
    if (type === '1' || type === '2') {
      wx.showToast({
        title: '已提交',
        icon: 'none'
      })
    }
  },
  setNameValue: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  setTelValue: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  musicInit: function (e) {
    let d = this.data
    let that = this
    backgroundAudioManager.title = '请柬背景音乐'
    backgroundAudioManager.src = d.weddingData.musicUrl
    backgroundAudioManager.play()
    backgroundAudioManager.onError(err => {
      console.log(err)
      that.setData({
        isPlayingMusic: false
      })
    })
  },
  onShow:function(e){
    backgroundAudioManager.play()
  },
  onHide: function (e) {
    console.log('页面隐藏')
    backgroundAudioManager.pause()
  }
})