// pages/home/home.js
/* 导入腾讯云SDK*/
const qcloud = require("../../vendor/wafer2-client-sdk/index.js")

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

  }
 
})