const musicUrl = 'http://www.ytmp3.cn/down/49676.mp3'

Page({
  data: {
    scrollindex: 0, //当前页面的索引值
    totalnum: 1, //总共页面数
    starty: 0, //开始的位置x
    endy: 0, //结束的位置y
    max_move_time: 800, //触发翻页的临界值 最大值
    min_move_time: 200, //触发翻页的临界值 最小值
    move_max: 120,
    margintop: 0, //滑动下拉距离
    music_url: musicUrl,
    isPlayingMusic: true,
    autoplay: true,
    interval: 2600,
    duration: 1200,

    loading:true,
    weddingData: {
      page:[
      ],
      music_url: ''
    },
    startTime: 0

  },
  onLoad: function(e) {
    console.log(e)
    let page = JSON.parse(e.page)
    this.data.weddingData.page.push(page)

    let that = this
    let param = {}
    let str = 'weddingData.page[0]'
    param[str] = page
    that.setData(param,()=>{
      this.setData({
        loading: false,
        totalnum: that.data.weddingData.page.length
      })
    })
    
    // wx.playBackgroundAudio({
    //   dataUrl: musicUrl,
    //   title: '',
    //   coverImgUrl: ''
    // })
  },
  scrollTouchstart: function(e) {
    let startTime = e.timeStamp
    let py = e.touches[0].pageY;
    this.setData({
      starty: py,
      startTime
    })
  },
  scrollTouchmove: function(e) {
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
  scrollTouchend: function(e) {
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
  play: function(event) {
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
  initmap: function(e) {
    let oi_latitude = Number(e.detail.latitude).toFixed(5)
    let oi_longitude = Number(e.detail.longitude).toFixed(5)
    console.log(oi_latitude, oi_longitude)
    wx.openLocation({ 
      latitude: Number(oi_latitude), 
      longitude: Number(oi_longitude), 
      success: function(res) {
        console.log(res)
      }
    })
  }

})