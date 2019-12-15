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
    title_index: null,
    sub_title: '',
    sub_title_index: null,
    content: '',
    content_index: null,
    page_index: '0',
    pageArray: [
      {
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
    titleMultiIndex: [0, 0, 0, 0],
    subTitleMultiIndex: [0, 0, 0, 0],
    contentMultiIndex: [0, 0, 0, 0],
    date: '2018-12-25',
    selectMapLocation: {
      name: '地图选择'
    },
    time: '12:01',
    date: '2018-12-25',
    region: ['广东省', '广州市', '海珠区'],
    imgList: [],
    modalName: null,
    textareaAValue: '',
    textareaBValue: ''
  },
  /** 页面类型选择 */
  PagePickerChange(e) {
    console.log(e);
    this.setData({
      page_index: e.detail.value
    })
  },
  /** 标题颜色选择 */
  TitleColorPickerChange(e) {
    console.log(e);
    this.setData({
      title_index: e.detail.value
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
    console.log(e);
    this.setData({
      sub_title_index: e.detail.value
    })
  },
  SetSubTitleValue(e) {
    console.log(e)
    this.setData({
      sub_title: e.detail.value
    })
  },
  /** 文案颜色选择 */
  ContentColorPickerChange(e) {
    console.log(e);
    this.setData({
      content_index: e.detail.value
    })
  },
  SetContentValue(e) {
    console.log(e)
    this.setData({
      content: e.detail.value
    })
  },
  /** 标题动画选择 */
  TitleMultiChange(e) {
    this.setData({
      titleMultiIndex: e.detail.value
    })
  },
  /** 子标题动画选择 */
  SubTitleMultiChange(e) {
    this.setData({
      subTitleMultiIndex: e.detail.value
    })
  },
  /** 文案动画选择 */
  ContentMultiChange(e) {
    this.setData({
      contentMultiIndex: e.detail.value
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
    // this.setData({
    //   date: e.detail.value
    // })
  },
  TimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },

  RegionChange: function (e) {
    this.setData({
      region: e.detail.value
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
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  textareaBInput(e) {
    this.setData({
      textareaBValue: e.detail.value
    })
  },

})