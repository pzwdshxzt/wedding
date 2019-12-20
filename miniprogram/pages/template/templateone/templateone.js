const musicUrl = 'http://www.ytmp3.cn/down/49676.mp3'
const db = require('../../../Utils/DbConsole')
const cloud = require('../../../Utils/Cloud')
const util = require('../../../Utils/Util')
const app = new getApp()
  Page({
    data: {
      scrollindex: 0, //当前页面的索引值
      totalnum: 1, //总共页面数
      starty: 0, //开始的位置x
      endy: 0, //结束的位置y
      max_move_time: 800, //触发翻页的临界值 最大值
      min_move_time: 150, //触发翻页的临界值 最小值
      move_max: 100,
      margintop: 0, //滑动下拉距离
      music_url: musicUrl,
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
      appName: 'Marry',
      angle: 0,
      attendance: {

      },
      tel: '',
      name: ''
    },
    onLoad: function (e) {
      let that = this
      let openid = ''
      cloud.getOpendId().then(res => {
        openid = res
        that.setData({
          openid
        })
        let type = e.type
        if (type === '1') {
          let page = wx.getStorageSync('showPageOne')
          let param = {}
          let str = 'weddingData.pages[0]'
          param[str] = page
          that.setData(param, () => {
            this.setData({
              loading: false,
              splash: true,
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

        if (type === '4') {
          if (e.token !== undefined && e.token !== '') {
            db.shareTokenQuery(e.token, e.tmpid).then(res => {
              let tokeninfo = res.data[0]
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
              title: '请柬发送失败',
              icon: 'none',
              duration: 2000
            })
          }
        }
      }).catch(err => {
        wx.showToast({
          title: '获取个人信息失败',
          icon: 'none'
        })
      });
      // wx.playBackgroundAudio({
      //   dataUrl: musicUrl,
      //   title: '',
      //   coverImgUrl: ''
      // })
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
        })
        let data = {
          _openid: openid,
          tmpid
        }
        db.queryAttendanceByOpenId(data).then(res => {
          console.log(res)
          let resp = res.data[0]
          if (!util.checkObject(res)) {
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
        wx.pauseBackgroundAudio();
        this.setData({
          isPlayingMusic: false
        })
      } else {
        console.log('this.data.music_url', this.data.music_url)
        wx.playBackgroundAudio({
          dataUrl: this.data.music_url,
          title: '',
          coverImgUrl: ''
        })
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
      console.log('getUserInfo')
      var that = this
      if (e.detail.errMsg === 'getUserInfo:ok') {
        app.globalData.userInfo = e.detail.rawData
      } else {
        console.log('fail', '获取用户信息失败')
        wx.showModal({
          title: '提示',
          content: '获取用户信息失败',
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
      console.log(d.tel)
      if (d.name === '') {
        wx.showToast({
          title: '名字不能为空',
          icon: 'none'
        })
        return
      }

      if (!util.checkObject(d.attendance)) {
        let param = {
          tmpid : d.tmpid,
          _openid: d.openid
        }
        let data = {
          name: d.name,
          tel: d.tel
        }
        db.updateAttendance(param,data).then(res=>{
          if(res.stats.updated === 1){
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
    }
  })