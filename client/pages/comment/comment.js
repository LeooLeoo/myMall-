const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')
const _ = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList: [{
      avatar: '/images/user.png',
      username: 'test1',
      createTime: '2018年01月01日',
      content: '测试评论',
    },
    {
      avatar: '/images/user.png',
      username: 'test2',
      createTime: '2018年02月01日',
      content: '测试评论',
    }], // 评论列表
  },

  previewImg(event) {
    let target = event.currentTarget
    let src = target.dataset.src
    let urls = target.dataset.urls

    wx.previewImage({
      current: src,
      urls: urls
    })
  },

  getCommentList(id) {
    //get请求中传入商品id
    qcloud.request({
      url: config.service.commentList,
      data: {
        product_id: id
      },
      success: result => {
        let data = result.data
        console.log(data)
        console.log(data.data)
        if (!data.code) {
          this.setData({
            commentList: data.data.map(item => {
              let itemDate = new Date(item.create_time)
              //根据返回的数据创建一个新的时间对象
              item.createTime = _.formatTime(itemDate)
              //将这个时间对象传入到util.js的 时间处理函数中
              item.images = item.images ? item.images.split(';;') : []
              return item
            })
          })
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let product = {
      id: options.id,
      name: options.name,
      price: options.price,
      image: options.image
    }
    this.setData({
      product: product
    })
    this.getCommentList(product.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})