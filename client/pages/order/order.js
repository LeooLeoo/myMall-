//引入别的页面的函数数据
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [
      // {
      //   id: 0,
      //   list: [{
      //     count: 1,
      //     image: '/images/user-sel.png ',
      //     name: '商品1',
      //     price: 50.5,
      //   }]
      // },
      // {
      //   id: 1,
      //   list: [{
      //     count: 1,
      //     image: '/images/user-sel.png ',
      //     name: '商品1',
      //     price: 50.5,
      //   },
      //   {
      //     count: 1,
      //     image: '/images/user-sel.png ',
      //     name: '商品2',
      //     price: 50.5,
      //   }
      //   ]
      // },
      // {
      //   id: 2,
      //   list: [{
      //     count: 1,
      //     image: '/images/user-sel.png',
      //     name: '商品2',
      //     price: 50.5,
      //   }]
      // }
    ], // 订单列表静态数据
  },

  onTapLogin() {
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
      }
    })

    this.getOrder()
  },

  getOrder() {
    wx.showLoading({
      title: '刷新订单数据...',
    })

    qcloud.request({
      url: config.service.orderList,
      login: true,
      success: result => {
        wx.hideLoading()

        let data = result.data
        console.log(data)
        if (!data.code) {
          this.setData({
            orderList: data.data
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '刷新订单数据失败',
          })
        }
      },
      fail: () => {
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '刷新订单数据失败',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  //检查会话
  onShow: function () {
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
        //调用getorder函数
        this.getOrder()
      }
    })
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