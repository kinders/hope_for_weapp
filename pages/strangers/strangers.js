// pages/strangers/strangers.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    // 到网站请求最新信息
    var that = this
    wx.request({
      url: 'https://www.hopee.xyz/strangers',
      data: { token: wx.getStorageSync('token') },
      header:{"Content-Type":"application/json"},
      method: 'GET',
      success: function(res){
        // 取得信息之后：缓存信息
        if (res.data.strangers) {
          wx.setStorageSync('strangers', res.data.strangers)
          that.setData({
            strangers: res.data.strangers,
            strangers_length: res.data.strangers.length,
            current_user_id: wx.getStorageSync('current_user').id
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
  moreFun: function(){
    wx.showActionSheet({
      itemList: ['朋友(首页)', '群组列表'],
      success: function(res){
        if(res.tapIndex == 0){
          wx.switchTab({url: '../friends/friends'})
        }else if(res.tapIndex == 1){
           wx.redirectTo({url: '../groups/groups'})
        }
      }
  })
  }
})