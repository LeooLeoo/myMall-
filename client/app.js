//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
let userInfo

App({
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl)
    },



  login({ success, error }) {
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"] === false) {
          //已经拒绝授权
          wx.showModal({
            title: '提示',
            content: '请授权我们获取您的用户信息',
            showCancel: false,
            success: res => {
              wx.openSetting({
                success: res => {
                  if (res.authSetting["scope.userInfo"] === true) {
                    this.doQcloudLogin({ success, error })
                  }
                }
              })
            }
          })
        } else {
          this.doQcloudLogin({ success, error })
        }


      }
    })
  },

  doQcloudLogin({ success, error }) {
    // 调用 qcloud 登陆接口
    qcloud.login({
      success: result => {
        if(result){
          userInfo = result

          success && success({
            userInfo
          })
        console.log("success")
        console.log(userInfo)
        }
        
         else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          this.getUserInfo({ success, error })
        }
      },
      fail: result => {
        // console.log("fail")
        // console.log(result)
        error && error()
      }
    })
  },


  getUserInfo({ success, error }) {
    //返回获取的数据信息
    if (userInfo) return userInfo

    qcloud.request({
      url: config.service.requestUrl,
      login: true,
      success: result => {
        let data = result.data

        if (!data.code) {
          let userInfo = data.data

          success && success({
            userInfo
          })
        } else {
          error && error()
        }
      },
      fail: () => {
        error && error()
      }
    })
  },

  //检查回话，自动加载用户数据并展示
  checkSession({ success, error }) {
    if(userInfo){
      return success && success({
        userInfo
      })
    }


    wx.checkSession({
      success: () => {
        this.getUserInfo({ 
          success: res=>{
            userInfo= res.userInfo
            success && success({
              userInfo
            })
          },
          fail: () => {
            error && error()
          }
        })
      },
      fail: () => {
        error && error()
      }
    })
  }



  
})

