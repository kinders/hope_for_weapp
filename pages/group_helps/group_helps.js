// pages/group_helps/group_helps.js
var token = wx.getStorageSync('token');
var current_user = wx.getStorageSync('current_user');
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var group_id = options.group_id
    var name = options.name
    // 到网站请求最新信息
    var group_helps = "group_" + group_id + "_helps"
    wx.request({
      url: 'https://www.hopee.xyz/group_helps',
      data: { token: token, group_id: group_id },
      method: 'GET',
      success: function(res){
        // 取得信息之后：缓存信息
        if (res.data.group) {
          wx.setStorage({key: group_helps, data: res.data.group_helps})
        }
      },
      fail: function() {},
      complete: function() {}
    }),
    // 取出缓存信息
    this.setData({
      group: {group_id: group_id, name: name},
      group_helps: (wx.getStorageSync(group_helps) || []),
      group_helps_length:(wx.getStorageSync(group_helps) || []).length,
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
