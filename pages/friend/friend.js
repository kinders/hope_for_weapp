// pages/friend/friend.js
var friend_id;
var friend_todos_user_ids = [0];
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var friend_nickname = options.nickname;
    friend_id = options.friend_id;
    var friend_todos = "friend_" + friend_id +"_todos";
    var friend = "friend_" + friend_id;
    var is_friendship = '';
    //判断该朋友是否好友
    (wx.getStorageSync("friendships") || []).map(function(friendship){
      if(friendship.friend_id == friend_id){
         is_friendship = 't'
      }
    })
    this.setData({
      is_friendship: is_friendship,
      friend: {friend_id: friend_id, nickname: friend_nickname},
      current_user_id: wx.getStorageSync('current_user').id
    })
    // 到网站请求最新信息
    var that = this
    wx.request({
      url: 'https://www.hopee.xyz/friend',
      data: { token: wx.getStorageSync('token'), friend_id: friend_id },
      method: 'GET',
      success: function(res){
        // 取得信息
        if(res.data.friend_todos){
          wx.setStorageSync(friend_todos, res.data.friend_todos)
          that.setData({
            friend_todos: res.data.friend_todos || [],
            friend_todos_length: res.data.friend_todos.length || 0,
          })
          // 生成可供筛选的选项
          var friend_todos_user_nicknames = ["全部"];
          var is_hidden = [];
          (res.data.friend_todos || []).map(function(todo){
            if (friend_todos_user_ids.indexOf(todo.user_id) == -1 ){
              friend_todos_user_ids = friend_todos_user_ids.concat(todo.user_id)
            }
            if (friend_todos_user_nicknames.indexOf(todo.nickname) == -1){
              friend_todos_user_nicknames = friend_todos_user_nicknames.concat(todo.nickname)
            }   
            is_hidden = is_hidden.concat("item")
          });
          that.setData({
            friend_todos_user_ids: friend_todos_user_ids,
            friend_todos_user_nicknames: friend_todos_user_nicknames,
            is_hidden: is_hidden
          })
        }else{
          console.log('fail: request friend res')
          console.log(res)
        }
      },
      fail: function() {console.log('fail: request friend')},
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
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
    //console.log(e.detail.value)
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
  moreFun: function(){
    var that=this;
    var friend = that.data.friend;
    var is_friend = that.data.is_friendship;
    if(is_friend == 't'){
      wx.showActionSheet({
        itemList: ['朋友的请求', '发送请求', '修改昵称', '删除好友'],
        success: function(res){
          if(res.tapIndex == 0){
            wx.redirectTo({url: "../friend_helps/friend_helps?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname})
          }else if(res.tapIndex == 1){
             wx.redirectTo({url: "../new_help_to_friend/new_help_to_friend?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname})
          }else if(res.tapIndex == 2){
             wx.redirectTo({url: "../new_nickname/new_nickname?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname })
          }else if(res.tapIndex == 3){
            wx.showModal({
            title: '警告',
            content: "确定将要删除好友 " + friend.nickname + " ？",
            success: function(res) {
              if (res.confirm) {
                wx.request({
                  url: 'https://www.hopee.xyz/delete_friend',
                  data: {token: wx.getStorageSync('token'), friend_id: friend.friend_id},
                  header:{"Content-Type":"application/json"},
                  method: 'POST',
                  success: function(res){
                    // success
                    if(res.data.result_code == 't'){
                      wx.showToast({
                        title: "成功将好友" + friend.nickname + "删去",
                        icon: 'success',
                        duration: 2000
                      })
                      setTimeout(function(){wx.navigateBack()},2000);
                    }else{
                      wx.showToast({
                        title: "服务器无法删除好友" + friend.nickname,
                        icon: 'loading',
                        duration: 2000
                      })
                    }
                  },
                  fail: function() {
                    // fail
                  },
                  complete: function() {
                    // complete
                  }
                })
              }
            }
          })
          }
        }
      })
    }else{
      wx.showActionSheet({
        itemList: ['查看请求', '发送请求', '加为好友'],
        success: function(res){
          if(res.tapIndex == 0){
            wx.redirectTo({url: "../friend_helps/friend_helps?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname})
          }else if(res.tapIndex == 1){
             wx.redirectTo({url: "../new_help_to_friend/new_help_to_friend?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname})
          }else if(res.tapIndex == 2){
             wx.redirectTo({url: "../new_friend/new_friend?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname})
          }
        }
      })
    }
  }
})