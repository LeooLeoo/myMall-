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

},

//从服务器中设立一个自己的API调出订单信息
list: async ctx =>{
  let user = ctx.state.$wxInfo.userinfo.openId
  let list = await DB.query('SELECT order_user.id AS `id`, order_user.user AS `user`, order_user.create_time AS `create_time`, order_product.product_id AS `product_id`, order_product.count AS `count`, product.name AS `name`, product.image AS `image`, product.price AS `price` FROM order_user LEFT JOIN order_product ON order_user.id = order_product.order_id LEFT JOIN product ON order_product.product_id = product.id WHERE order_user.user = ? ORDER BY order_product.order_id', [user])

  // //封装返回
  // ctx.state.data =list
  
  // 将数据库返回的数据组装成页面呈现所需的格式
  //ret是最后返回的变量
  let ret = []
  //cacheMap 是判断一个订单是否被遍历过的标志
  let cacheMap = {}
  //block是一个中间变量，用来存放订单信息
  let block = []
  let id = 0
  //以下代码是list的每一项进行了遍历，记每个项为order
  list.forEach(order => {
    //如果这个项未被遍历过，返回数据，记录信息
    if (!cacheMap[order.id]) {
      block = []
      ret.push({
        id: ++id,
        list: block
      })

      cacheMap[order.id] = true
    }
    //向block传入对应的商品信息
    block.push(order)
  })
  ctx.state.data = ret
},

}
