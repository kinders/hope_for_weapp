// pages/group_helpeds/group_helpeds.js
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
    var group_helpeds = "group_" + group_id + "_helpeds";
    wx.request({
      url: 'https://www.hopee.xyz/group_helpeds',
      data: { token: wx.getStorageSync('token'), group_id: group_id },
      method: 'GET',
      success: function(res){
        // 取得信息之后：缓存信息
        if (res.data.group_helpeds) {
          wx.setStorageSync(group_helpeds, res.data.group_helpeds)
          that.setData({
            group_helpeds: res.data.group_helpeds,
            group_helpeds_length: res.data.group_helpeds.length,
          })
        } else {
          console.log('fail: request group_helpeds res')
          console.log(res) 
        }
      },
      fail: function() {console.log('fail: request group_helpeds')},
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
