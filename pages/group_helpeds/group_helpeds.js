// pages/group_helpeds/group_helpeds.js
var token = wx.getStorageSync('token');
var current_user = wx.getStorageSync('current_user');
Page({
  data:{
    group_helpeds: [ { id: 3, content: '第一个群请求', group_id: 2, name: '群一', created_at: '2017-02-25T12:20:20' } ]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var group_id = options.group_id
    var name = options.name
    // 到网站请求最新信息
    var group_helpeds = "group_" + group_id + "_helpeds"
    wx.request({
      url: 'https://www.hopee.xyz/group_helpeds',
      data: { token: token, group_id: group_id },
      method: 'GET',
      success: function(res){
        // 取得信息之后：缓存信息
        if (res.data.group) {
          wx.setStorage({key: group_helpeds, data: res.data.group_helpeds})
        }
      },
      fail: function() {},
      complete: function() {}
    }),
    // 取出缓存信息
    this.setData({
      group: {group_id: group_id, name: name},
      group_helpeds: (wx.getStorageSync(group_helpeds) || []),
      group_helpeds_length:(wx.getStorageSync(group_helpeds) || []).length,
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
