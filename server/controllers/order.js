const DB = require("../utils/db.js")
//导入数据库操作代码

//输入对外业务逻辑接口
module.exports ={
//创建订单
add: async ctx=>{
  //获取用户的唯一标识openId
  let user = ctx.state.$wxInfo.userinfo.openId
  //操作订单商品表
  let productList = ctx.request.body.list || []


  //插入订单至 order_user 表
  let order = await DB.query('insert into order_user(user) values (?)', [user])
  //从/插入订单用户表中返回的数据获得orderId
  let orderId = order.insertId

  //构建插入订单商品表的sql代码
  let sql = 'INSERT INTO order_product (order_id, product_id, count) VALUES '
  let param = []
  //使用循环便利的方式添加多个商品
  let query = []
  productList.forEach(product=>{
    query.push("(?, ?, ?)")
    param.push(orderId)
    param.push(product.id)
    param.push(product.count || 1)

  })
  
  await DB.query(sql + query.join(', '), param)

}


}
