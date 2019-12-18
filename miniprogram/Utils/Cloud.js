const getOpendId = () => {

  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'getOpenContext'
      },
      success: res => {
        resolve(res.result.OPENID)
      },
      fail: err => {
        reject(err)
      }
    })
  })
 
}

module.exports ={
  getOpendId
}