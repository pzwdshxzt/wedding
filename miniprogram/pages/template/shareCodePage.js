const posterConfig = {
  jdConfig: {
    width: 750,
    height: 980,
    backgroundColor: '#fff',
    debug: false,
    pixelRatio: 1,
    blocks: [{
      width: 690,
      height: 920,
      x: 30,
      y: 30,
      borderWidth: 2,
      borderColor: '#f0c2a0',
      borderRadius: 20,
    }],
    texts: [{
        x: 100,
        y: 790,
        baseLine: 'middle',
        text: [{
          text: '春风不解风情',
          fontSize: 36,
          color: '#ec1731',
        }]
      },

      {
        x: 100,
        y: 850,
        baseLine: 'middle',
        text: [{
          text: '长按识别小程序码',
          fontSize: 28,
          color: '#929292',
        }]
      }
    ],
    images: [{
        width: 634,
        height: 634,
        x: 59,
        y: 60,
        url: 'https://6465-dev-p-1300251472.tcb.qcloud.la/user/background-1576554792000.png?sign=ed9b587b17e202660ab996af6ce60f95&t=1577323601',
      },
      {
        width: 220,
        height: 220,
        x: 420,
        y: 710,
        url: 'https://6465-dev-p-1300251472.tcb.qcloud.la/user/code/100005.jpg?sign=7e0145337c05a75c3253949b8cbc5caa&t=1577323531',
      }
    ]

  }
}
Page({
  data: {
    posterConfig: posterConfig.jdConfig
  },
  onPosterSuccess(e) {
    const {
      detail
    } = e;
    wx.previewImage({
      current: detail,
      urls: [detail]
    })
  },
  onPosterFail(err) {
    console.error(err);
  },
  onLoad: function () {
  
  },

})