//index.js
//获取应用实例
var app = getApp();
Page({
  data: {},
  //事件处理函数
  onLoad: function () {
    var that = this
    this.setData({
      userInfo: getApp().globalData.userInfo
    })
    var is_use = getApp().globalData.is_use
    //var is_use = wx.getStorageSync('is_use')
    //console.log('is_use')
    //console.log(is_use)
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
  },
  /*
  home: function(){
    // 请求网络数据
    console.log('start to request home')
    wx.request({
      url: 'https://www.hopee.xyz/home',
      data: { token: wx.getStorageSync("token") },
      method: 'GET',
      success: function(res){
        // 取得信息之后：缓存信息
        //console.log('start to set storage from home')
        //console.log(res)
        if (res.data.todos) {
          wx.setStorageSync('todos', res.data.todos)
        }
        if (res.data.helps) {
          wx.setStorageSync('helps', res.data.helps)
        }
        if (res.data.friendships) {
          wx.setStorageSync('friendships', res.data.friendships)
        }
        if (res.data.groups) {
          wx.setStorageSync('groups', res.data.groups)
        }
        if (res.data.groups_helps) {
          wx.setStorageSync('group_helps', res.data.group_helps)
        }
      },
      fail: function() {},
      complete: function() {console.log('end request home')}
    })
  },
  */
  pay: function(){
    var that = this;
    wx.request({
      url: 'https://www.hopee.xyz/wechat_pay',
      data: {token: wx.getStorageSync("token")},
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
    } else {
      that.setData({is_use: 0}),
      wx.showToast({
        title: '网络出现问题，无法联系服务器',
        icon: 'loading',
        duration: 2000
      })
    }
  }
})
