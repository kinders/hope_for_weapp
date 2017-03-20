// pages/friend_helps/friend_helps.js
var friend_id;
var friend_helps_receiver_ids = [0];
var token = wx.getStorageSync('token');
var current_user = wx.getStorageSync('current_user');
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    friend_id = options.friend_id
    var friend_nickname = options.nickname
    // 到网站请求最新信息
    var friend_helps = "friend_" + friend_id +"_helps"
    var friend = "friend_" + friend_id
    var is_friendship = ''
    var that = this
    wx.request({
      url: 'https://test.com/friend_helps',
      data: { token: token, friend_id: friend_id },
      method: 'GET',
      success: function(res){
        // 取得信息之后：缓存信息
        if (res.data.friend_helps) {
          wx.setStorage({key: friend_helps, data: res.data.friend_helps})
        }
      },
      fail: function() {},
      complete: function() {}
    }),
    // 取出缓存信息
    (wx.getStorageSync("friendships") || []).map(function(friendship){
      if(friendship.friend_id == friend_id){
         is_friendship = 't'
      }
    })
    this.setData({
      friend_helps: (wx.getStorageSync(friend_helps) || []),
      friend_helps_length: (wx.getStorageSync(friend_helps) || []).length,
      is_friendship: is_friendship,
      friend: {friend_id: friend_id, nickname: friend_nickname},
      current_user_id: current_user.id
    })
    // 生成可供筛选的选项
    var friend_helps_receiver_nicknames = ["全部"];
    var is_hidden = [];
    (wx.getStorageSync(friend_helps) || []).map(function(help){
      if (friend_helps_receiver_ids.indexOf(help.receiver_id) == -1 ){
        friend_helps_receiver_ids = friend_helps_receiver_ids.concat(help.receiver_id)
      }
      if (friend_helps_receiver_nicknames.indexOf(help.nickname) == -1){
        friend_helps_receiver_nicknames = friend_helps_receiver_nicknames.concat(help.nickname)
      }   
      is_hidden = is_hidden.concat("item")
    });
    this.setData({
      friend_helps_receiver_ids: friend_helps_receiver_ids,
      friend_helps_receiver_nicknames: friend_helps_receiver_nicknames,
      is_hidden: is_hidden
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
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
    console.log(e.detail.value)
    var is_hidden = [];
    var friend_helps = "friend_" + friend_id +"_helps"
    var friend_helps_length = 0
    if (e.detail.value == 0){
      (wx.getStorageSync(friend_helps) || []).map(function(help){
        is_hidden = is_hidden.concat("item")
        friend_helps_length = friend_helps_length + 1
      })
    }else{
      (wx.getStorageSync(friend_helps) || []).map(function(help){
        if(help.receiver_id == friend_helps_receiver_ids[e.detail.value]){
          is_hidden = is_hidden.concat("item")
          friend_helps_length = friend_helps_length + 1
        }else{
          is_hidden = is_hidden.concat("hidden")
        }
      })
    }
    this.setData({
      is_hidden: is_hidden,
      friend_helps_length: friend_helps_length
    })
  },
})