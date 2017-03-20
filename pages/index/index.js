//index.js
//获取应用实例
var app = getApp();
Page({
  data: {},
  //事件处理函数
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //取出用户
      that.setData({
        userInfo:userInfo
      })
    })
    var token = wx.getStorageSync("token")
    var current_user = wx.getStorageSync("current_user")
    var is_use = wx.getStorageSync("is_use")
    if(is_use == true){
    // 请求网络数据
    wx.request({
      url: 'https://test.com/home',
      data: { token: token },
      method: 'GET',
      success: function(res){
        // 取得信息之后：缓存信息
        if (res.data.todos) {
          wx.setStorage({key: 'todos', data: res.data.todos})
        }
        if (res.data.helps) {
          wx.setStorage({key: 'helps', data: res.data.helps})
        }
        if (res.data.friendships) {
          wx.setStorage({key: 'friendships', data: res.data.friendships})
        }
        if (res.data.groups) {
          wx.setStorage({key: 'groups', data: res.data.groups})
        }
        if (res.data.groups_helps) {
          wx.setStorage({key: 'group_helps', data: res.data.group_helps})
        }
      },
      fail: function() {},
      complete: function() {}
    })
    // 
    wx.switchTab({url: '../todos/todos'})
    }else{
      this.setData({
        current_user: current_user
      })
    }
  },
  pay: function(){
    wx.request({
      url: 'https://text.com/wechat_pay',
      data: {token: token},
      method: 'POST',
      success: function(res){
        // success
        if(res){
          wx.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: 'MD5',
            paySign: res.data.paySign,
            success: function(res){
              console.log("支付成功")
              wx.switchTab({url: '../todos/todos'})
            },
            fail: function() {
              console.log("支付失败")
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
})
