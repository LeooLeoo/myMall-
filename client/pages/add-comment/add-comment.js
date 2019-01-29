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
    commentImages: [],

  },

  //上传图片
  uploadImage(cb) {
    let commentImages = this.data.commentImages
    let images = []

    if (commentImages.length) {
      let length = commentImages.length
      for (let i = 0; i < length; i++) {
        //采用了循环当方式对列表进行处理
        wx.uploadFile({
          url: config.service.uploadUrl,
          //上传路径
          filePath: commentImages[i],
          //需要储存的图片路径
          name: 'file',
          //文件的key
          success: res => {
            let data = JSON.parse(res.data)
            length--

            if (!data.code) {
              images.push(data.data.imgUrl)
            }
            //当上传成功时，获取图片的url并添加到images这个列表中

            if (length <= 0) {
              cb && cb(images)
              //将图片当列表返回给回调函数
            }
          },
          fail: () => {
            length--
          }
        })
      }
    } else {
      cb && cb(images)
    }
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

    this.uploadImage(images => {
      //调用upLoadImage函数上传照片
      qcloud.request({
        url: config.service.addComment,
        
         //需要登录
        login: true,
        method: 'PUT',
        data: {
          images,
          content,
          product_id: this.data.product.id
          //将返回的图片链接列表上添加到了上传的数据当中
          //下一步不要忘记修改服务器中的api//controllers.comment.js
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
    })
  },

  //选择图片
  chooseImage() {
    wx.chooseImage({
      count: 3,
      //最多只能上传3张图片
      sizeType: ['compressed'],
      //图片大小是压缩过的
      sourceType: ['album', 'camera'],
      //图片来源是相册或者相机
      success: res => {
        let commentImages = res.tempFilePaths

        this.setData({
          commentImages
        })
      },
    })

  },

  //预览图片
  previewImg(event) {
    let target = event.currentTarget
    let src = target.dataset.src

    wx.previewImage({
      current: src,
      urls: this.data.commentImages
    })
  },

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