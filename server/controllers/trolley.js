//导入数据库操作代码
const DB = require("../utils/db.js")

module.exports = {
//添加至购物车列表
add: async ctx =>{
  //获取用户信息及商品信息
  let user = ctx.state.$wxInfo.userinfo.openId
  let product = ctx.request.body

  //从数据库中基于用户id和产品id来查找商品是否以及加入在购物车中
  let list = await DB.query('SELECT * FROM trolley_user WHERE trolley_user.id = ? AND trolley_user.user = ?', [product.id, user])

  //返回数据为0，说明商品还未添加到购物车
  if (!list.length) {
    //将商品信息直接插入到数据库中，数量默认1
    await DB.query('INSERT INTO trolley_user(id, count, user) VALUES (?, ?, ?)', [product.id, 1, user])
  } else {
    // 商品之前已经添加到购物车
    // 更新已有数据中的count
    let count = list[0].count + 1
    await DB.query('UPDATE trolley_user SET count = ? WHERE trolley_user.id = ? AND trolley_user.user = ?', [count, product.id, user])
  }

  ctx.state.data = {}


},

//拉取购物车商品列表，构建api
list: async ctx =>{
  //通过用户id获取用户信息
  let user = ctx.state.$wxInfo.userinfo.openId
  //跨列表融合，将trolley_user和product两张表融合在一起，根据user名字。
  //接着请去设置路由！获取商品列表
  //赋值！不然没有数据返回过来，这个api就没有意义！
  ctx.state.data = await DB.query('SELECT * FROM trolley_user LEFT JOIN product ON trolley_user.id = product.id WHERE trolley_user.user = ?', [user])

},


}


