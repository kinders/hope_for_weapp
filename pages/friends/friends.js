// pages/friends/friends.js
var current_user = wx.getStorageSync('current_user');
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // 取出缓存信息
    this.setData({
      friendships: (wx.getStorageSync('friendships') || []),
      friendships_length: (wx.getStorageSync('friendships') || []).length,
      current_user_id: current_user.id
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