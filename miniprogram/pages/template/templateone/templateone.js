const musicUrl = 'http://www.ytmp3.cn/down/49676.mp3'
Page({
  data: {
    scrollindex: 0, //当前页面的索引值
    totalnum: 4, //总共页面数
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
    weddingData: {
      groom: 'hjx',
      bride: 'cyq',
      page:[{
          type: 1,
          backgroundImg_url: 'https://6465-dev-p-1300251472.tcb.qcloud.la/template/IMG_9968IMG_9968.png?sign=e0a76b7c7c33090ee72d66ad6968f173&t=1576030567',
          title: '人生若只如初见',
          title_color: 'cyan',
          title_animate: 'animated fadeInDown slower',
          sub_title: 'hjx&cyq',
          sub_title_color: 'cyan',
          sub_title_animate: 'animated fadeInDown slower',
          content: '期间卡斯卡死的坑点卡手机卡',
          content_color: 'cyan',
          content_animate: 'animated fadeInDown slower delay-2s'
        },
        {
          type: 1,
          backgroundImg_url: 'https://6465-dev-p-1300251472.tcb.qcloud.la/template/IMG_9968IMG_9968.png?sign=e0a76b7c7c33090ee72d66ad6968f173&t=1576030567',
          title: '人生若只如初见111',
          title_color: 'cyan',
          title_animate: 'animated shake fadeInDown slower',
          sub_title: 'hjx&cyq',
          sub_title_color: 'cyan',
          sub_title_animate: 'animated fadeInDown slower',
          content: '期间卡斯卡死的坑点卡手机卡111',
          content_color: 'cyan',
          content_animate: 'animated fadeInDown slower delay-2s'
        },
        {
          type: 2,
          backgroundImg_url: 'https://6465-dev-p-1300251472.tcb.qcloud.la/template/IMG_9852IMG_9852.png?sign=b19f6a938cb3f5b583d83c4cf3490cd6&t=1576206399',
          title: '宴会地点',
          title_color: 'cyan',
          date: '2019年12月3日',
          location: '福建省莆田市仙游县鲤南镇象坂村后湖18号',
          latitude: 23.099994,
          longitude: 113.324520,
          map_animate: 'animated bounceInDown slower',
          markers: [{
            id: 1,
            latitude: 23.099994,
            longitude: 113.324520,
            name: 'T.I.T 创意园'
          }]
        }, {
          type: 3,
          backgroundImg_url: 'https://6465-dev-p-1300251472.tcb.qcloud.la/template/IMG_9852IMG_9852-1.png?sign=b5ccfef9142f4f6cb86d7a46d5691d1e&t=1576206852',
          title: '人生若只如初见',
          title_color: 'cyan',
          sub_title: 'hjx&cyq',
          sub_title_color: 'cyan',
          titles: '欢迎大火来参加！',
          button_color: 'cyan',
          button_name: '提交',
          content_color: 'cyan',
          content: '欢迎大伙来参加'
        }
      ],
      music_url: ''
    },
    startTime: 0

  },
  onLoad: function() {
    var that = this
    this.setData({
      totalnum: that.data.weddingData.page.length
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