// pages/home/home.js
/* 导入腾讯云SDK*/
const qcloud = require("../../vendor/wafer2-client-sdk/index.js")
//导入config.js中的函数
const config = require("../../config")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: [], // 商品列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("进入onLoad状态，准备抓起数据")
    this.getProductList(); /* 代码重构*/
    console.log(this.data)
  },


  // 从数据库中获取商品列表
  getProductList(){
    wx.showLoading({
      title: '商品列表加载中',
    })

    qcloud.request({
      url: 'https://zqa2dq2k.qcloud.la/weapp/product',
      success: result => {
        wx.hideLoading()

        console.log(result);
        if (!result.data.code) { /* 正常获取数据*/
          this.setData({
            productList: result.data.data
            /* 删除原来静态的数据后，导入api数据，注意有2个data(注意返回来数据的格式）*/
          })
        } else {
          wx.showToast({
            title: '商品加载失败'
        })
        }
      },
      fail: result => {
        wx.hideLoading()
        wx.showToast({
          title: '商品加载失败',
        })
      }
    });

  },

  //绑定在加号+上的事件，传回的信息可以在event.currentTarget.dataset看到
  addToTrolley(event){
    let productId = event.currentTarget.dataset.id
    let productList = this.data.productList
    let product


    //利用遍历的方法找到product
    for (let i = 0, len = productList.length; i<len; i++ ){
      if (productList[i].id === productId){
        product = productList[i]
        break
      } 
    }

    console.log(product)
    //在用类似详情页面添加购物车的方式
      if (product){
        
        qcloud.request({
          url: config.service.addTrolley,
          login: true,
          method: 'PUT',
          data: product,
          success: result => {
            wx.hideLoading()
            console.log(result)
            let data = result.data
            console.log(data)
            if (!data.code) {
              wx.showToast({
                title: '已添加到购物车',
              })
            } else {
              wx.showToast({
                icon: 'none',
                title: '添加到购物车失败',
              })
            }
          },
          fail: () => {
            wx.hideLoading()

            wx.showToast({
              icon: 'none',
              title: '添加到购物车失败',
            })
          }
        })
      }

  },
 
})