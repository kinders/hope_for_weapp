// pages/friend/friend.js
var friend_id;

Page({
  data:{},
  onLoad:function(options){
    // 从分享界面登录，需要检查服务时限
    var that = this;
    var token = getApp().globalData.token;
    if (token == undefined || token == '' ){
      that.relogin()
    }
    // 页面初始化 options为页面跳转所带来的参数
    var friend_nickname = options.nickname;
    friend_id = options.friend_id;
    var is_friendship = '';
    //判断该朋友是否好友
    var current_user = getApp().globalData.current_user;
    if (friend_id == current_user.id) {
      wx.redirectTo({url: '../helpeds/helpeds'})
    }
    (wx.getStorageSync("friendships") || []).map(function(friendship){
      if(friendship.friend_id == friend_id){
         is_friendship = 't'
      }
    })
    this.setData({
      is_friendship: is_friendship,
      friend: {friend_id: friend_id, nickname: friend_nickname},
      current_user_id: getApp().globalData.current_user.id
    })

  },
  relogin:function(){
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: 'https://www.hopee.xyz/login',
              data: { js_code: res.code },
              header:{"Content-Type":"application/json"},
              method: 'POST',
              success: function(res){
                //console.log(res)
                if(res.data.result_code == "t"){
                  getApp().globalData.token = res.data.token
                  getApp().globalData.current_user = res.data.current_user
                }else{
                  wx.redirectTo({url: '../index/index'})
                }
              }
            })
          }
        }
      })
  },
  getInfo:function(){
    // 到网站请求最新信息
    var that = this;
    var friend_id = that.data.friend.friend_id;
    var friend_todos = "friend_" + friend_id +"_todos";
    var friend = "friend_" + friend_id;
    var friend_todos_user_ids = [];
    var token = getApp().globalData.token;
    wx.request({
      url: 'https://www.hopee.xyz/friend',
      data: { token: token, friend_id: friend_id },
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
          var friend_todos_user_nicknames = [];
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
          var a = friend_todos_user_nicknames.map(function (nickname, index) { return nickname.concat("^^+_-^^", index) })
          a.sort()
          var c = a.map(function (hash) { return hash.split('^^+_-^^')[0] })
          var b = a.map(function (hash) { return friend_todos_user_ids[hash.split('^^+_-^^')[1]] })
          c.unshift("全部")
          b.unshift(0)
          that.setData({
            friend_todos_user_ids: b,
            friend_todos_user_nicknames: c,
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
    var that = this;
    var token = getApp().globalData.token;
    if (token == undefined || token == '' ){
      wx.showToast({
        title: '正在载入...',
        icon: 'loading',
        duration: 3000
      })
      setTimeout(function(){that.getInfo()}, 3000)
    } else {
      that.getInfo()
    }
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
    var friend_todos = "friend_" + friend_id +"_todos";
    var friend_todos_length = 0;
    var friend_todos_user_ids = this.data.friend_todos_user_ids;
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
    var nickname = friend.nickname;
    var sendto = '发送请求给：' + nickname;
    var is_friend = that.data.is_friendship;
    if(is_friend == 't'){
      wx.showActionSheet({
        itemList: [sendto, '未完请求', '已完任务', '修改昵称', '删除好友'],
        success: function(res){
          if(res.tapIndex == 0){
             wx.redirectTo({url: "../new_help_to_friend/new_help_to_friend?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname})
          }else if(res.tapIndex == 1){
            wx.redirectTo({url: "../friend_helps/friend_helps?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname})
          }else if(res.tapIndex == 2){
            wx.redirectTo({
              url: "../friend_dones/friend_dones?friend_id=" + friend_id + "&nickname=" + nickname
            })
          }else if(res.tapIndex == 3){
             wx.redirectTo({url: "../new_nickname/new_nickname?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname })
          }else if(res.tapIndex == 4){
            wx.showModal({
            title: '警告',
            content: "确定将要删除好友 " + friend.nickname + " ？",
            success: function(res) {
              if (res.confirm) {
                wx.request({
                  url: 'https://www.hopee.xyz/delete_friend',
                  data: {token: getApp().globalData.token, friend_id: friend.friend_id},
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
        itemList: [sendto, '未完请求', '已完任务', '加为好友'],
        success: function(res){
          if(res.tapIndex == 0){
             wx.redirectTo({url: "../new_help_to_friend/new_help_to_friend?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname})
          }else if(res.tapIndex == 1){
            wx.redirectTo({url: "../friend_helps/friend_helps?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname})
          }else if(res.tapIndex == 2){
            wx.navigateTo({
              url: "../friend_dones/friend_dones?friend_id=" + friend_id + "&nickname=" + nickname
            })
          }else if(res.tapIndex == 3){
             wx.redirectTo({url: "../new_friend/new_friend?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname})
          }
        }
      })
    }
  },
  onShareAppMessage: function () {
    var that=this;
    var friend = that.data.friend;
    return {
      title: '嗨，我要向您推荐这个朋友……',
      path: "/pages/friend/friend?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname
    }
  },
  close_help: function (event) {
    var that = this;
    var todo_id = event.currentTarget.dataset.todo_id;
    var friend_id = that.data.friend.friend_id;
    var friend_todos_name = "friend_" + friend_id + "_todos";
    wx.showModal({
      title: "注意",
      content: '您确定要关闭这个请求吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://www.hopee.xyz/close_help',
            data: { token: getApp().globalData.token, todo_id: todo_id },
            header: { "Content-Type": "application/json" },
            method: 'POST',
            success: function (res) {
              // success
              if (res.data.result_code == "t") {
                // 将请求从缓存中删除
                var friend_todos = wx.getStorageSync(friend_todos_name) || []
                var todo_index;
                friend_todos.map(function (hash, index) {
                  if (hash.id == todo_id) {
                    todo_index = index
                  }
                })
                friend_todos.splice(todo_index, 1)
                wx.setStorageSync(friend_todos_name, friend_todos)
                that.setData({
                  friend_todos: friend_todos || [],
                  friend_todos_length: friend_todos.length || 0
                })
                wx.showToast({
                  title: '成功关闭这个请求',
                  icon: 'success',
                  duration: 2000
                })
              } else {
                console.log('fail: request close_help res')
                console.log(res)
                wx.showToast({
                  title: '服务器无法关闭这个请求',
                  icon: 'loading',
                  duration: 2000
                })
              }
            },
            fail: function () { console.log('fail: request close_help') },
            complete: function () { }
          })
        }
      },
      fail: function () { }
    })
  }
})