//index.js
//获取应用实例
var app = getApp();
Page({
  data: {},
  //事件处理函数
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //取出用户
      that.setData({
        userInfo:userInfo
      })
    })
    wx.showToast({
        title: '正在启动',
        icon: 'loading',
        duration: 3000
    })
    var that=this;
    setTimeout(function(){
      var is_use = getApp().globalData.is_use
      if(is_use == 1){
        wx.switchTab({url: '../helps/helps'})
      }else if (is_use == 2){
        that.setData({
          current_user: wx.getStorageSync("current_user"),
          is_use: 2
        })
      } else {
        that.setData({is_use: 0})
      }     
    },3000);
  },
  pay: function(){
    var that = this;
    wx.request({
      url: 'https://www.hopee.xyz/wechat_pay',
      data: {token: wx.getStorageSync("token")},
      header:{"Content-Type":"application/json"},
      method: 'POST',
      success: function(res){
        // success
        if(res){
          var p = res
          //console.log('start to request payment')
          wx.requestPayment({
            timeStamp: p.data.timeStamp,
            nonceStr: p.data.nonceStr,
            package: p.data.package,
            signType: 'MD5',
            paySign: p.data.paySign,
            success: function(res){
              //console.log("支付成功")
              //that.home()
              wx.switchTab({url: '../helps/helps'})
            },
            fail: function() {
              console.log("fail: requestPayment")
              console.log(res.data)
              wx.showToast({
                title: '支付失败，请重新续费',
                icon: 'loading',
                duration: 1000
              })
            },
            complete: function() {
              // complete
            }
          })
        }
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  reconnect: function(){
    var that=this;
    var is_use = getApp().globalData.is_use
    if(is_use == 1){
      // 请求网络数据
      wx.switchTab({url: '../helps/helps'})
    }else if (is_use == 2){
      wx.showToast({
        title: '需要续费',
        icon: 'loading',
        duration: 2000
      }),
      that.setData({
        current_user: wx.getStorageSync("current_user"),
      })
    } else if (is_use == 3){
      wx.showToast({
        title: '服务端出错',
        icon: 'loading',
        duration: 2000
      })
    } else {
      app.getUserInfo()
      wx.showToast({
        title: '网络故障。可先退出小程序，稍后重新进入',
        icon: 'loading',
        duration: 2000
      })
    }
  }
})
