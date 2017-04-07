// pages/group_helps/group_helps.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var group_id = options.group_id;
    var name = options.name;
    // 取出缓存信息
    this.setData({
      group: {group_id: group_id, name: name},
      current_user_id: wx.getStorageSync('current_user').id
    })
    // 到网站请求最新信息
    var that = this;
    var group_helps = "group_" + group_id + "_helps";
    wx.request({
      url: 'https://www.hopee.xyz/group_helps',
      data: { token: wx.getStorageSync('token'), group_id: group_id },
      method: 'GET',
      success: function(res){
        // 取得信息之后：缓存信息
        if (res.data.group_helps) {
          wx.setStorageSync(group_helps, res.data.group_helps)
          that.setData({
            group_helps: res.data.group_helps,
            group_helps_length: res.data.group_helps.length,
          })
        } else {
          console.log('fail: request group_helps res')
          console.log(res)
        }
      },
      fail: function() {console.log('fail: request group_helps')},
      complete: function() {}
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
