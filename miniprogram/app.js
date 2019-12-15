//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })

  },
  globalData: {
    ColorList: [{
        title: '嫣红',
        name: 'red',
        color: '#e54d42'
      },
      {
        title: '桔橙',
        name: 'orange',
        color: '#f37b1d'
      },
      {
        title: '明黄',
        name: 'yellow',
        color: '#fbbd08'
      },
      {
        title: '橄榄',
        name: 'olive',
        color: '#8dc63f'
      },
      {
        title: '森绿',
        name: 'green',
        color: '#39b54a'
      },
      {
        title: '天青',
        name: 'cyan',
        color: '#1cbbb4'
      },
      {
        title: '海蓝',
        name: 'blue',
        color: '#0081ff'
      },
      {
        title: '姹紫',
        name: 'purple',
        color: '#6739b6'
      },
      {
        title: '木槿',
        name: 'mauve',
        color: '#9c26b0'
      },
      {
        title: '桃粉',
        name: 'pink',
        color: '#e03997'
      },
      {
        title: '棕褐',
        name: 'brown',
        color: '#a5673f'
      },
      {
        title: '玄灰',
        name: 'grey',
        color: '#8799a3'
      },
      {
        title: '草灰',
        name: 'gray',
        color: '#aaaaaa'
      },
      {
        title: '墨黑',
        name: 'black',
        color: '#333333'
      },
      {
        title: '雅白',
        name: 'white',
        color: '#ffffff'
      },
    ],
    AnimateList: [{
        name: '弹跳',
        code: 'bounce'
      },
      {
        name: '闪光',
        code: 'flash'
      },
      {
        name: '脉冲',
        code: 'pulse'
      },
      {
        name: '橡胶带',
        code: 'rubberBand'
      },
      {
        name: '摇',
        code: 'shake'
      },
      {
        name: '摇头',
        code: 'headShake'
      },
      {
        name: '摆动',
        code: 'swing'
      },
      {
        name: '多田',
        code: 'tada'
      },
      {
        name: '晃动',
        code: 'wobble'
      },
      {
        name: '果冻',
        code: 'jello'
      },
      {
        name: '心跳',
        code: 'heartBeat'
      },
      {
        name: '弹跳进入',
        code: 'bounceIn'
      },
      {
        name: '弹跳向下进入',
        code: 'bounceInDown'
      },
      {
        name: '弹跳向左进入',
        code: 'bounceInLeft'
      },
      {
        name: '弹跳向右进入',
        code: 'bounceInRight'
      },
      {
        name: '弹跳向上进入',
        code: 'bounceInUp'
      },
      {
        name: '弹跳离开',
        code: 'bounceOut'
      },
      {
        name: '弹跳向下离开',
        code: 'bounceOutDown'
      },
      {
        name: '弹跳向左离开',
        code: 'bounceOutLeft'
      },
      {
        name: '弹跳向右离开',
        code: 'bounceOutRight'
      },
      {
        name: '弹跳向上离开',
        code: 'bounceOutUp'
      },
      {
        name: '淡入',
        code: 'fadeIn'
      },
      {
        name: '向下淡入',
        code: 'fadeInDown'
      },
      {
        name: '长距离向下淡入',
        code: 'fadeInDownBig'
      },
      {
        name: '向左淡入',
        code: 'fadeInLeft'
      },
      {
        name: '长距离向左淡入',
        code: 'fadeInLeftBig'
      },
      {
        name: '向右淡入',
        code: 'fadeInRight'
      },
      {
        name: '长距离向右淡入',
        code: 'fadeInRightBig'
      },
      {
        name: '向上淡入',
        code: 'fadeInUp'
      },
      {
        name: '长距离向上淡入',
        code: 'fadeInUpBig'
      },
      {
        name: '淡出',
        code: 'fadeOut'
      },
      {
        name: '向下淡出',
        code: 'fadeOutDown'
      },
      {
        name: '长距离向下淡出',
        code: 'fadeOutDownBig'
      },
      {
        name: '向左淡出',
        code: 'fadeOutLeft'
      },
      {
        name: '长距离向左淡出',
        code: 'fadeOutLeftBig'
      },
      {
        name: '向右淡出',
        code: 'fadeOutRight'
      },
      {
        name: '长距离向右淡出',
        code: 'fadeOutRightBig'
      },
      {
        name: '向上淡出',
        code: 'fadeOutUp'
      },
      {
        name: '长距离向上淡出',
        code: 'fadeOutUpBig'
      },
      {
        name: 'X轴翻转进入',
        code: 'flipInX'
      },
      {
        name: 'Y轴翻转进入',
        code: 'flipInY'
      },
      {
        name: 'X轴翻转离开',
        code: 'flipOutX'
      },
      {
        name: 'Y轴翻转离开',
        code: 'flipOutY'
      },
      {
        name: '闪进',
        code: 'lightSpeedIn'
      },
      {
        name: '闪出',
        code: 'lightSpeedOut'
      },
      {
        name: '旋转进入',
        code: 'rotateIn'
      },
      {
        name: '左下旋转进入',
        code: 'rotateInDownLeft'
      },
      {
        name: '右下旋转进入',
        code: 'rotateInDownRight'
      },
      {
        name: '左上旋转进入',
        code: 'rotateInUpLeft'
      },
      {
        name: '右上旋转进入',
        code: 'rotateInUpRight'
      },
      {
        name: '旋转离开',
        code: 'rotateOut'
      },
      {
        name: '左下旋转离开',
        code: 'rotateOutDownLeft'
      },
      {
        name: '右下旋转离开',
        code: 'rotateOutDownRight'
      },
      {
        name: '左上旋转离开',
        code: 'rotateOutUpLeft'
      },
      {
        name: '右上旋转离开',
        code: 'rotateOutUpRight'
      },
      {
        name: '铰链',
        code: 'hinge'
      },
      {
        name: 'jackInTheBox',
        code: 'jackInTheBox'
      },
      {
        name: '滚进',
        code: 'rollIn'
      },
      {
        name: '滚出',
        code: 'rollOut'
      },
      {
        name: '放大进入',
        code: 'zoomIn'
      },
      {
        name: '向下放大进入',
        code: 'zoomInDown'
      },
      {
        name: '向左放大进入',
        code: 'zoomInLeft'
      },
      {
        name: '向右放大进入',
        code: 'zoomInRight'
      },
      {
        name: '向上放大进入',
        code: 'zoomInUp'
      },
      {
        name: '缩小离开',
        code: 'zoomOut'
      },
      {
        name: '向下缩小离开',
        code: 'zoomOutDown'
      },
      {
        name: '向左缩小离开',
        code: 'zoomOutLeft'
      },
      {
        name: '向右缩小离开',
        code: 'zoomOutRight'
      },
      {
        name: '向上缩小离开',
        code: 'zoomOutUp'
      },
      {
        name: '向下滑进',
        code: 'slideInDown'
      },
      {
        name: '向左滑进',
        code: 'slideInLeft'
      },
      {
        name: '向右滑进',
        code: 'slideInRight'
      },
      {
        name: '向上滑进',
        code: 'slideInUp'
      },
      {
        name: '向下滑出',
        code: 'slideOutDown'
      },
      {
        name: '向左滑出',
        code: 'slideOutLeft'
      },
      {
        name: '向右滑出',
        code: 'slideOutRight'
      },
      {
        name: '向上滑出',
        code: 'slideOutUp'
      }
    ],
    AnimateSpeed: [{
        name: '快',
        code: 'fast'
      },
      {
        name: '超快',
        code: 'faster'
      },
      {
        name: '慢',
        code: 'slow'
      },
      {
        name: '超慢',
        code: 'slower'
      }
    ],
    AnimateDelay: [{
        name: '不延迟',
        code: ''
      },
      {
        name: '延迟1s',
        code: 'delay-1s'
      },
      {
        name: '延迟2s',
        code: 'delay-2s'
      },
      {
        name: '延迟3s',
        code: 'delay-3s'
      },
      {
        name: '延迟4s',
        code: 'delay-4s'
      },
      {
        name: '延迟5s',
        code: 'delay-5s'
      }
    ],
    AnimateInfinite: [{
        name: '不循环',
        code: ''
      },
      {
        name: '循环',
        code: 'infinite'
      }
    ]
  }
})