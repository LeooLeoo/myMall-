// client/pages/add-comment/add-comment.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    product:{},
    commentValue: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //onLoad之后就讲评价按钮上传入等数据设定product,再见product作为数据当中data中
    let product = {
      id: options.id,
      name: options.name,
      price: options.price,
      image: options.image
    }
    this.setData({
      product: product
    })
  },


  //评价框事件
  onInput(event){
    this.setData({
      //trim是取消文字前后等空格
      commentValue: event.detail.value.trim()
    })
    console.log(this.data.commentValue)
  },

  //添加评论 
  addComment(event) {
    let content = this.data.commentValue
    if (!content) return

    wx.showLoading({
      title: '正在发表评论'
    })

    // this.uploadImage(images => {
      qcloud.request({
        url: config.service.addComment,
        
         //需要登录
        login: true,
        method: 'PUT',
        data: {
         //images,
          content: content,
          product_id: this.data.product.id
          
        },
        
        success: result => {
          wx.hideLoading()
          
          let data = result.data
          if (!data.code) {
            wx.showToast({
              title: '发表评论成功'
            })

            setTimeout(() => {
              wx.navigateBack()
            }, 1500)
            //评论成功则自动返回上一个页面，失败时则停留在当前页面
          } else {
           
            wx.showToast({
              icon: 'none',
              title: '发表评论失败'
            })
          }
        },
        fail: () => {
          wx.hideLoading()
          console.log(this.data)
          wx.showToast({
            icon: 'none',
            title: '发表评论失败'
          })
        }
      })
    // })
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