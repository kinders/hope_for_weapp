//index.js
Page({
  data: {},
  //事件处理函数
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    getApp().getUserInfo(function(userInfo){
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
      var is_use = getApp().globalData.is_use;
      var current_user = getApp().globalData.current_user;
      if(is_use == 1){
        var is_num = /^\d+$/;
        if(is_num.test(current_user.nickname)){
          wx.navigateTo({url: '../new_nickname/new_nickname?friend_id=' + current_user.id + '&nickname=' + current_user.nickname})
        }else{
          wx.redirectTo({ url: '../awards/awards'})
        }
      }else if (is_use == 2){
        that.setData({
          current_user: current_user,
          is_use: 2,
          msg: getApp().globalData.msg
        })
      } else {
        that.setData({is_use: 0})
      }     
    },3000);
  },
  onShow: function(){
    var that = this;
    setTimeout(function () {
      var is_use = this.data.is_use;
      if(is_use == undefined){
        that.setData({
          is_use: getApp().globalData.is_use
        })
      }
    }, 3000);
  },
  pay: function(){
    var that = this;
    var token = getApp().globalData.token;
    if(token == undefined){
      wx.showToast({
        title: '请您重试',
        icon: 'loading',
        duration: 5000
      })
    }else{
      wx.request({
        url: 'https://www.hopee.xyz/wechat_pay',
        data: {token: token},
        header:{"Content-Type":"application/json"},
        method: 'POST',
        success: function(res){
          // success
          if(res){
            var p = res
            //console.log('start to request payment')
            //console.log(res.data)
            wx.requestPayment({
              timeStamp: p.data.timeStamp,
              nonceStr: p.data.nonceStr,
              package: p.data.package,
              signType: 'MD5',
              paySign: p.data.paySign,
              success: function(res){
                //console.log("支付成功")
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
    }
  },
  reconnect: function(){
    var that=this;
    var is_use = getApp().globalData.is_use
    var current_user = getApp().globalData.current_user;
    if(is_use == 1){
      var is_num = /^\d+$/;
      if(is_num.test(current_user.nickname)){
        wx.navigateTo({url: '../new_nickname/new_nickname?friend_id=' + current_user.id + '&nickname=' + current_user.nickname})
      }else{
        wx.redirectTo({ url: '../awards/awards'})
      }
    }else if (is_use == 2){
      wx.showToast({
        title: '需要续费',
        icon: 'loading',
        duration: 2000
      }),
      that.setData({
        current_user: current_user,
        is_use: 2
      })
    } else if (is_use == 3){
      wx.showModal({
        title: '提示',
        content: '服务端无法让用户登录。可先退出小程序，等服务端恢复正常，再重新进入'
      })
    } else {
      getApp().getUserInfo()
      wx.showModal({
        title: '提示',
        content: '网络故障。可先退出小程序，连接网络之后重新进入'
      })
    }
  }
})
