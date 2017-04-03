// pages/group/group.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var group_id = options.group_id
    var name = options.name
    // 到网站请求最新信息
    var group = "group_" + group_id
    wx.request({
      url: 'https://www.hopee.xyz/group',
      data: { token: wx.getStorageSync('token'), group_id: group_id },
      method: 'GET',
      success: function(res){
        // 取得信息之后：缓存信息
        // [group: {user_id: , nickname: group.nickname}]
        if (res.data.group) {
          wx.setStorage({key: group, data: res.data.group})
        }
      },
      fail: function() {},
      complete: function() {}
    }),
    // 取出缓存信息
    this.setData({
      group: {group_id: group_id, name: name},
      group_friends: (wx.getStorageSync(group) || []),
      group_friends_length:(wx.getStorageSync(group) || []).length,
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
