const DB = require('../utils/db')

module.exports = {

  /**
   * 添加评论
   */ 
  add: async ctx => {
    //获取数据，将数据储存在ueseinfo中
    let user = ctx.state.$wxInfo.userinfo.openId
    let username = ctx.state.$wxInfo.userinfo.nickName
    let avatar = ctx.state.$wxInfo.userinfo.avatarUrl

    let productId = +ctx.request.body.product_id
    let content = ctx.request.body.content || null
    //因为是put的请去，所以用.body的方法获取数据
    let images = ctx.request.body.images || []
    images = images.join(';;')
    //不建议在数据库中直接储存一个列表，因此使用双逗号将图像列表中的链接连接起来，构成一个较长的string

    //执行数据库插入语句
    if (!isNaN(productId)) {
      await DB.query('INSERT INTO comment(user, username, avatar, content, images, product_id) VALUES (?, ?, ?, ?, ?, ?)', [user, username, avatar, content, images, productId])
    }
    //返回数据
    ctx.state.data = {}
  },






  /**
   * 获取评论列表
   */
  list: async ctx => {
    let productId = +ctx.request.query.product_id
    //因为是get的请求，所以使用.query来获取数据
    if (!isNaN(productId)) {
      ctx.state.data = await DB.query('select * from comment where comment.product_id = ?', [productId])
    } else {
      ctx.state.data = []
    }
  },
}