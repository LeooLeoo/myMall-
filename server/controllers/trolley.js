//api的设置顺序：trolley.js设置异步函数，路由设置，在客户端调用api即设置函数即在相关地方调用，在客户端的config.js中设置url

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



//更新商品购物车列表
update: async ctx=>{
  //先获取用户信息
  let user = ctx.state.$wxInfo.userinfo.openId
  //productList等于列表或空集
  let productList = ctx.request.body.list || []

  // 购物车旧数据全部删除
  await DB.query('DELETE FROM trolley_user WHERE trolley_user.user = ?', [user])

  //重新插入数据
  let sql = 'INSERT INTO trolley_user(id, count, user) VALUES '
  let query = []
  let param = []

  productList.forEach(product => {
    query.push('(?, ?, ?)')

    param.push(product.id)
    param.push(product.count || 1)
    param.push(user)
  })

  await DB.query(sql + query.join(', '), param)

  ctx.state.data = {}



},


}


