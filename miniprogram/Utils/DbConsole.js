const db = wx.cloud.database()
const _ = db.command
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
const addCreavite = (templateId, name) => {
  return db.collection('Creative').add({
    data:{
      templateId,
      name
    },
    success: res =>{
      console.log('add creative success')
      console.log(res)
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





module.exports = {
  getTemplate,
  getCreativesByOpenId,
  getCreativesById,
  addPageInCreative,
  addCreavite,
  saveSortList
}