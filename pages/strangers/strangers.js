// pages/strangers/strangers.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // 到网站请求最新信息
    var that = this
    wx.request({
      url: 'https://www.hopee.xyz/strangers',
      data: { token: wx.getStorageSync('token') },
      method: 'GET',
      success: function(res){
        // 取得信息之后：缓存信息
        if (res.data.strangers) {
          wx.setStorage({key: 'strangers', data: res.data.strangers})
        }
      },
      fail: function() {},
      complete: function() {}
    })
    // 取出缓存信息
    this.setData({
      strangers: (wx.getStorageSync('strangers') || []),
      strangers_length: (wx.getStorageSync('strangers') || []).length,
      current_user_id: wx.getStorageSync('current_user').id
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})