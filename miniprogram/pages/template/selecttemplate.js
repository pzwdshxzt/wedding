

const db = require('../../Utils/DbConsole')
const util = require('../../Utils/Util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    templates:[
    ]
  },
  onLoad:function(e){
  /** 查询可用模板 */
  db.getTemplate().then(res =>{
    this.setData({
      templates: res.data
      })
  })
  },
  /** 选择模板 */
  selectTemplate: (e) => {
    console.log(e)
    wx.navigateTo({
      url: './selecttemplateedit?tmpid=' + e.currentTarget.dataset.tmpid,
    })
  }
})