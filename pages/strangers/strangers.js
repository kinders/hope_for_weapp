// pages/strangers/strangers.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    wx.showModal({
      title: '提示',
      content: '点击右上角的三点，可以转发卡片，增加准朋友。'
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    // 到网站请求最新信息
    var that = this;
    var token = getApp().globalData.token;
    var current_user = getApp().globalData.current_user;
    wx.request({
      url: 'https://www.hopee.xyz/strangers',
      data: { token: token },
      header:{"Content-Type":"application/json"},
      method: 'GET',
      success: function(res){
        // 取得信息之后：缓存信息
        if (res.data.strangers) {
          wx.setStorageSync('strangers', res.data.strangers)
          that.setData({
            strangers: res.data.strangers,
            strangers_length: res.data.strangers.length,
            current_user_id: current_user.id
          })
        }
      },
      fail: function() {},
      complete: function() {}
    })
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  onShareAppMessage: function () {
    var current_user = getApp().globalData.current_user
    return {
      title: current_user.nickname + "：朋友，加我吧，我需要您的协作",
      path: "/pages/new_friend/new_friend?friend_id=" + current_user.id + "&nickname=" + current_user.nickname,
      imageUrl: "../../icons/shake_hands.jpg"
    }
  }
})
