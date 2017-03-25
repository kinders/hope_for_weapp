// pages/friend/friend.js
var friend_id;
var friend_todos_user_ids = [0];
var token = wx.getStorageSync('token');
var current_user = wx.getStorageSync('current_user');

Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var friend_nickname = options.nickname
    friend_id = options.friend_id
    // 到网站请求最新信息
    var that = this
    var friend_todos = "friend_" + friend_id +"_todos"
    var friend = "friend_" + friend_id
    var is_friendship = ''
    wx.request({
      url: 'https://www.hopee.xyz/friend',
      data: { token: token, friend_id: friend_id },
      method: 'GET',
      success: function(res){
        // 取得信息之后：缓存信息
        if (res.data.friend_todos) {
          wx.setStorage({key: friend_todos, data: res.data.friend_todos})
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
      friend_todos: (wx.getStorageSync(friend_todos) || []),
      friend_todos_length:(wx.getStorageSync(friend_todos) || []).length,
      is_friendship: is_friendship,
      friend: {friend_id: friend_id, nickname: friend_nickname},
      current_user_id: current_user.id
    })
    // 生成可供筛选的选项
    var friend_todos_user_nicknames = ["全部"];
    var is_hidden = [];
    (wx.getStorageSync(friend_todos) || []).map(function(todo){
      if (friend_todos_user_ids.indexOf(todo.user_id) == -1 ){
        friend_todos_user_ids = friend_todos_user_ids.concat(todo.user_id)
      }
      if (friend_todos_user_nicknames.indexOf(todo.nickname) == -1){
        friend_todos_user_nicknames = friend_todos_user_nicknames.concat(todo.nickname)
      }   
      is_hidden = is_hidden.concat("item")
    });
    this.setData({
      friend_todos_user_ids: friend_todos_user_ids,
      friend_todos_user_nicknames: friend_todos_user_nicknames,
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
    var friend_todos = "friend_" + friend_id +"_todos"
    var friend_todos_length = 0
    if (e.detail.value == 0){
      (wx.getStorageSync(friend_todos) || []).map(function(todo){
        is_hidden = is_hidden.concat("item")
        friend_todos_length = friend_todos_length + 1
      })
    }else{
      (wx.getStorageSync(friend_todos) || []).map(function(todo){
        if(todo.user_id == friend_todos_user_ids[e.detail.value]){
          is_hidden = is_hidden.concat("item")
          friend_todos_length = friend_todos_length + 1
        }else{
          is_hidden = is_hidden.concat("hidden")
        }
      })
    }
    this.setData({
      is_hidden: is_hidden,
      friend_todos_length: friend_todos_length
    })
  },
})
