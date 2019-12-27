const db = wx.cloud.database()
const _ = db.command
const $ = db.command.aggregate
/**
 * 获取时间戳
 */
const getTimeStamp = () => {
  return Date.parse(new Date())
}

/** 获取模板 */
const getTemplate = () =>{
  return db.collection('Template').get()
}


/** 
 * 获取创建的模板
 * @param openId 用户id
 * @returns 查询返回
 */
const getCreativesByOpenId = (openId) =>{
  return db.collection('Creative').where({
    _openid: openId
  }).get()
}

/** 
 * 获取创建的模板 
 * @param id 创建的模板id
 * @returns 查询返回
 */
const getCreativesById = (id) =>{
  return db.collection('Creative').doc(id).get()
}

/** 选择模板后 创建当前 */
const addCreavite = (data) => {
  return db.collection('Creative').add({
    data
  })
}

/** 选择模板后 创建当前 */
const updateCreavite = (id,data) => {
  return db.collection('Creative').doc(id).update({
    data,
    success: res =>{
      wx.showToast({
        title: '修改请柬成功'
       
      })
      console.log(res)
    }
  })
}

/** 
 * 删除请柬
 * @param id 模板id
 * @returns 
 */
const deleteCreative = (id) =>{
  return db.collection('Creative').doc(id).remove({
    success: function(e){
      
      wx.showToast({
        title: '删除页面成功',
        icon: 'none'
      })
    } 
  })
}
/** 
 * 插入页面
 * @param id 模板id
 * @param page 页面信息
 * @returns 
 */
const addPageInCreative = (id,page) =>{
  return db.collection('Creative').doc(id).update({
    data:{
      pages:_.push(page)
    }
  })
}
/** 
 * 保存修改页面顺序
 * @param id 模板id
 * @param page 页面信息
 * @returns 
 */
const saveSortList = (id,pages) =>{
  return db.collection('Creative').doc(id).update({
    data:{
      pages: pages
    }
  })
}


/** 
 * 查询token 信息
 * @param token 
 * @returns 
 */
const shareTokenQuery = (token, tmpid) =>{
  return db.collection('ShareToken').where({
    uuid: token,
    tmpid: tmpid
  }).get()
}

/** 
 * 插入token 用户
 * @param id 模板id
 * @param page 页面信息
 * @returns 
 */
const tokenUse = (token,openid) =>{
  console.log(token)
  return db.collection('ShareToken').where({
    uuid: token
  }).update({
    data:{
      use: _.set(openid)
    }
  })
}

/** 查询阅读过的请柬 */
const queryTokenByUse = (openid) => {
  return db.collection('ShareToken').where({
    use: openid
  })
  .get()
}

/** 
 * 新增转发token
 * @param id 模板id
 * @param page 页面信息
 * @returns 
 */
const newShareToken = (tmpid,uuid) =>{
  return db.collection('ShareToken').add({
    data:{
      tmpid,
      uuid
    }
  }).then(res => {
    console.log(res)
  }).catch(err =>{
    console.log(err)
  })
}


/**
 * 新增宴会名单
 * @param {} data 
 */
const addAttendance = (data) => {
  return db.collection('Attendance').add({ data })
}

/**
 * 查询宴会名单 openid
 * @param {*} data 
 */
const queryAttendanceByOpenId = (data) => {
  return db.collection('Attendance').where(data).get()
}

/**
 * 查询所有宴会名单 
 * @param {*} data 
 */
const queryAttendance = (param) => {
  return db.collection('Attendance').where(param).get()
}


/** 
 * 修改参会信息
 * @param id 模板id
 * @param page 页面信息
 * @returns 
 */
const updateAttendance = (param,data) =>{
  return db.collection('Attendance').where(param).update({data})
}

/** 
 * 修改请柬中页面信息
 * @param id 模板id
 * @param page 页面信息
 * @returns 
 */
const updateCreativePage = (id,data) =>{
  return db.collection('Creative').doc(id).update({
    data
  })
}

/** 
 * 获取最大值
 * @param id 模板id
 * @param page 页面信息
 * @returns 
 */
const getMaxValue = () =>{
  return db.collection('Creative')
  .aggregate()
  .group({
    _id: '$_id',
    max: $.max('$scene')
  })
  .end()
}

const getSceneTmp = (scene) =>{
  return db.collection('Creative').where({
      scene
  }).get()
}


module.exports = {
  getTemplate,
  getCreativesByOpenId,
  getCreativesById,
  addPageInCreative,
  addCreavite,
  deleteCreative,
  saveSortList,
  newShareToken,
  shareTokenQuery,
  queryTokenByUse,
  tokenUse,
  addAttendance,
  updateAttendance,
  queryAttendance,
  queryAttendanceByOpenId,
  updateCreavite,
  updateCreativePage,
  getMaxValue,
  getSceneTmp
}