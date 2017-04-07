// pages/group/group.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var group_id = options.group_id;
    var name = options.name;
    var group = "group_" + group_id;
    this.setData({
      group: {group_id: group_id, name: name},
      current_user_id: wx.getStorageSync('current_user').id
    })
    // 到网站请求最新信息
    var that = this;
    wx.request({
      url: 'https://www.hopee.xyz/group',
      data: { token: wx.getStorageSync('token'), group_id: group_id },
      method: 'GET',
      success: function(res){
        // 取得信息之后：缓存信息
        // [group: {user_id: , nickname: group.nickname}]
        if (res.data.group) {
          var group_friends = res.data.group;
          var a = group_friends.map(function(hash){return hash.nickname.concat("^", hash.user_id)})
	        a.sort()
        	group_friends = a.map(function(hash){return {"user_id": hash.split('^')[1], "nickname": hash.split('^')[0]}})
          wx.setStorageSync(group, group_friends)
          that.setData({
            group_friends: group_friends,
            group_friends_length: res.data.group.length
          })
        } else {
          console.log('fail: request group res')
          console.log(res)
        }
      },
      fail: function() {console.log('fail: request group')},
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
