const  musicUrl = 'http://www.ytmp3.cn/down/49676.mp3'
Page({
  data: {
    scrollindex:0,  //当前页面的索引值
    totalnum:4,  //总共页面数
    starty:0,  //开始的位置x
    endy:0, //结束的位置y
    critical: 100, //触发翻页的临界值
    margintop:0,  //滑动下拉距离
    music_url: musicUrl,
    isPlayingMusic: true,
    autoplay: true,
    interval: 2600,
    duration: 1200
    
  },
  onLoad: function () {
    console.log("onLoad")
    var that = this
    // wx.playBackgroundAudio({
    //   dataUrl: musicUrl,
    //   title: '',
    //   coverImgUrl: ''
    // })
  },
  scrollTouchstart:function(e){
    let py = e.touches[0].pageY;
    this.setData({
      starty: py
    })
  },
  scrollTouchmove:function(e){
    let py = e.touches[0].pageY;
    let d = this.data;
    this.setData({
      endy: py,
    })
    if(py-d.starty<100 && py-d.starty>-100){    
      this.setData({
        margintop: py - d.starty
      })
    }
  },
  scrollTouchend:function(e){
    let d = this.data;
    if(d.endy-d.starty >100 && d.scrollindex>0){
      this.setData({
        scrollindex: d.scrollindex-1
      })
    }else if(d.endy-d.starty <-100 && d.scrollindex<this.data.totalnum-1){
      this.setData({
        scrollindex: d.scrollindex+1
      })
    }
    this.setData({
        starty:0,
        endy:0,
        margintop:0
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
  initmap: function (e){
   

      let that = this

    let oi_latitude = Number(37.895525).toFixed(5)

    let oi_longitude = Number(117.398193).toFixed(5)

      console.log(oi_latitude, oi_longitude)

      wx.openLocation({ //所以这里会显示你当前的位置

        latitude: Number(oi_latitude), // 纬度，范围为-90~90，负数表示南纬

        longitude: Number(oi_longitude), // 经度，范围为-180~180，负数表示西经

        success: function (res) {

          console.log(res)

        }

      })

    
  }
  
})
