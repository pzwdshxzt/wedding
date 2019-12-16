const app = getApp();
Page({
  data: {
    AnimateArray: [
      app.globalData.AnimateList,
      app.globalData.AnimateSpeed,
      app.globalData.AnimateDelay,
      app.globalData.AnimateInfinite
    ],
    ColorList: app.globalData.ColorList,
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    title: '',
    titleColor: '',
    titleIndex: null,
    subTitle: '',
    subTitleColor: '',
    subTitleIndex: null,
    content: '',
    contentColor: '',
    contentIndex: null,
    pageIndex: '0',
    pageArray: [{
        name: '选择页面',
        type: '99'
      },
      {
        name: '通用',
        type: '1'
      },
      {
        name: '地点',
        type: '2'
      },
      {
        name: '联系方式',
        type: '3'
      },
    ],
    titleMultiIndex: [22, 3, 0, 0],
    titleAnimate: '',
    subTitleMultiIndex: [22, 3, 0, 0],
    subTitleAnimate: '',
    contentMultiIndex: [22, 3, 0, 0],
    contentAnimate: '',
    date: '2018-12-25',
    selectMapLocation: {
      name: '地图选择'
    },
    time: '12:01',
    date: '2018-12-25',
    imgList: [],
    pageData:{

    }
  },

  /** 页面类型选择 */
  PagePickerChange(e) {
    console.log(e);
    this.setData({
      pageIndex: e.detail.value
    })
  },
  /** 标题颜色选择 */
  TitleColorPickerChange(e) {
    let ColorList = this.data.ColorList
    let colorIndex = e.detail.value
    this.setData({
      titleIndex: colorIndex,
      titleColor: ColorList[colorIndex].name
    })
  },
  SetTitleValue(e) {
    console.log(e)
    this.setData({
      title: e.detail.value
    })
  },
  /** 子标题颜色选择 */
  SubTitleColorPickerChange(e) {
    let ColorList = this.data.ColorList
    let colorIndex = e.detail.value
    this.setData({
      subTitleIndex: colorIndex,
      subTitleColor: ColorList[colorIndex].name
    })
  },
  SetSubTitleValue(e) {
    console.log(e)
    this.setData({
      subTitle: e.detail.value
    })
  },
  /** 文案颜色选择 */
  ContentColorPickerChange(e) {
    let ColorList = this.data.ColorList
    let colorIndex = e.detail.value
    this.setData({
      contentIndex: e.detail.value,
      contentColor:  ColorList[colorIndex].name
    })
  },
  SetContentValue(e) {
    this.setData({
      content: e.detail.value
    })
  },
  /** 标题动画选择 */
  TitleMultiChange(e) {
    let AnimateArray = this.data.AnimateArray
    let animateArray = e.detail.value
    this.setData({
      titleAnimate: ''
    }, () => {
      this.setData({
        titleMultiIndex: animateArray,
        titleAnimate: 'animated ' + AnimateArray[0][animateArray[0]].code + ' ' + AnimateArray[1][animateArray[1]].code + ' ' + AnimateArray[2][animateArray[2]].code + ' ' + AnimateArray[3][animateArray[3]].code
      })
    })

  },
  /** 子标题动画选择 */
  SubTitleMultiChange(e) {
    let AnimateArray = this.data.AnimateArray
    let animateArray = e.detail.value
    this.setData({
      subTitleAnimate: ''
    }, () => {
      this.setData({
        subTitleMultiIndex: animateArray,
        subTitleAnimate: 'animated ' + AnimateArray[0][animateArray[0]].code + ' ' + AnimateArray[1][animateArray[1]].code + ' ' + AnimateArray[2][animateArray[2]].code + ' ' + AnimateArray[3][animateArray[3]].code
      })
    })

  },
  /** 文案动画选择 */
  ContentMultiChange(e) {
    let AnimateArray = this.data.AnimateArray
    let animateArray = e.detail.value
    this.setData({
      contentAnimate: ''
    }, () => {
      this.setData({
        contentMultiIndex: e.detail.value,
        contentAnimate: 'animated ' + AnimateArray[0][animateArray[0]].code + ' ' + AnimateArray[1][animateArray[1]].code + ' ' + AnimateArray[2][animateArray[2]].code + ' ' + AnimateArray[3][animateArray[3]].code
      })
    })

  },
  /** 宴会日期选择器 */
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  /** 宴会地点选择 */
  MapSelect(e) {
    console.log(e)
    wx.chooseLocation({
      success: (data) => {
        console.log(data);
        this.setData({
          selectMapLocation: data
        })
      }
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '召唤师',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  saveToView(e){
    let d = this.data
    let pageData = {}

    /** 选择通用页面 */
    if(d.pageIndex === '1'){
      pageData = {
        type: 1,
        backgroundImg_url: d.imgList[0],
        title: d.title,
        titleColor: d.titleColor,
        titleAnimate: d.titleAnimate,
        subTitle: d.subTitle,
        subTitleColor: d.subTitleColor,
        subTitleAnimate: d.subTitleAnimate,
        content: d.content,
        contentColor: d.contentColor,
        contentAnimate: d.contentAnimate
      }
    }
    wx.navigateTo({
      url: 'templateone?type=1&page='+ JSON.stringify(pageData)
    })
  }
})