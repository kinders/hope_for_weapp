// pages/todo/todo.js
var todo_id;
var user_id;
var user_nickname;
var receiver_id;
var receiver_nickname;
var is_finish;
var todo;
var discussions;
var scene=0;
var from_discussion = 0;
Page({
  data:{},
  onLoad:function(options){
    // 从分享界面登录,讨论页面允许无需检查服务时限
    var that = this;
    var token = getApp().globalData.token;
    if (token == undefined || token == '' ){
      scene = 1;
      getApp().getUserInfo()
    }
    // 页面初始化 options为页面跳转所带来的参数
    from_discussion = options.discussion_id;
    todo_id = options.todo_id;
    user_id = options.user_id;
    user_nickname = options.user_nickname;
    receiver_id = options.receiver_id;
    receiver_nickname = options.receiver_nickname;
    var created_at = options.created_at;
    var content = options.content;
    todo = 'todo_' + todo_id;
    discussions = 'discussions_in_todo_' + todo_id;
    is_finish = options.is_finish;
    this.setData({
      todo: {id: todo_id, user_id: user_id, user_nickname: user_nickname, receiver_nickname: receiver_nickname, created_at: created_at, is_finish: is_finish, content: content},
      current_user: getApp().globalData.current_user
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    var that = this;
    var token = getApp().globalData.token;
    if (token == undefined || token == ''  ){
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
  getInfo: function(){
    // 到网站请求最新信息
    var that = this;
    var token = getApp().globalData.token;
    var todo_id = that.data.todo.id
    wx.request({
      url: 'https://www.hopee.xyz/todo',
      data: { token: token, todo_id: todo_id },
      header:{"Content-Type":"application/json"},
      method: 'GET',
      success: function(res){
        // 取得信息之后：缓存信息
        if (res.data.todo) {
          if(that.data.todo.content == null){
            that.setData({
              todo: { id: todo_id, user_id: user_id, user_nickname: user_nickname, receiver_nickname: res.data.todo.receiver_nickname, created_at: res.data.todo.created_at, is_finish: res.data.todo.is_finish, content: res.data.todo.content }
            })
          }

        } else {
          console.log('fail: request todo res')
          console.log(res)
        }
        if (res.data.discussions) {
          wx.setStorageSync(discussions, res.data.discussions)
          that.setData({
            discussions: res.data.discussions || [],
            discussions_length: res.data.discussions.length || 0
          })
          // 生成可供筛选的选项
          var discussions_user_ids = [];
          var discussions_user_nicknames = [];
          var is_hidden = [];
          res.data.discussions.map(function(discussion){
            if (discussions_user_ids.indexOf(discussion.user_id) == -1 ){
              discussions_user_ids = discussions_user_ids.concat(discussion.user_id)
            }
            if (discussions_user_nicknames.indexOf(discussion.nickname) == -1){
              discussions_user_nicknames = discussions_user_nicknames.concat(discussion.nickname)
            }   
            is_hidden = is_hidden.concat("item")
          });
          var a = discussions_user_nicknames.map(function (nickname, index) { return nickname.concat("^^+_-^^", index) })
          a.sort()
          var c = a.map(function (hash) { return hash.split('^^+_-^^')[0] })
          var b = a.map(function (hash) { return discussions_user_ids[hash.split('^^+_-^^')[1]] })
          c.unshift("全部")
          b.unshift(0)
          that.setData({
            discussions_user_ids: b,
            discussions_user_nicknames: c,
            is_hidden: is_hidden
          })
        }else{
          console.log('fail: request discussions res')
          console.log(res)
        }
      },
      fail: function() {console.log('fail: request todo')},
      complete: function() {}
    })
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  bindPickerChange: function(e) {
    // 筛选留言
    var that = this;
    this.setData({
      index: e.detail.value
    })
    var is_hidden = [];
    var discussions_length = 0;
    if (e.detail.value == 0){
      (wx.getStorageSync(discussions) || []).map(function(discussion){
        is_hidden = is_hidden.concat("item")
        discussions_length = discussions_length + 1
      })
    }else{
      (wx.getStorageSync(discussions) || []).map(function(discussion){
        if(discussion.user_id == that.data.discussions_user_ids[e.detail.value]){
          is_hidden = is_hidden.concat("item")
          discussions_length = discussions_length + 1
        }else{
          is_hidden = is_hidden.concat("hidden")
        }
      })
    }
    this.setData({
      is_hidden: is_hidden,
      discussions_length: discussions_length
    })
  },
  close_help: function(){
    var that = this;
    wx.showModal({
      title: "注意",
      content: '您确定要关闭这个请求吗？',
      success: function(res){
        if (res.confirm){
          wx.request({
            url: 'https://www.hopee.xyz/close_help',
            data: {token: getApp().globalData.token, todo_id: todo_id},
            header:{"Content-Type":"application/json"},
            method: 'POST',
            success: function(res){
              // success
              if(res.data.result_code == "t"){
                wx.showToast({
                  title: '成功关闭这个请求',
                  icon: 'success',
                  duration: 2000
                })
                // 更新任务的结束状态
                var new_todo = that.data.todo;
                new_todo.is_finish = 'true';
                that.setData({todo: new_todo})
                //如果页面来自留言，则删去所有这个todo的留言
                if (from_discussion > 0){
                  var hot_discussions = wx.getStorageSync('hot_discussions') || [];
                  for (var i = 0; i < hot_discussions.length; i++){
                    if (hot_discussions[i].todo_id == todo_id){
                      hot_discussions.splice(i, 1);
                      i--;
                    }
                  }
                  wx.setStorageSync('hot_discussions', hot_discussions)
                }
                // 指示其他页面更新信息
                getApp().globalData.need_update_helps = true
                getApp().globalData.need_update_groups_helps = true
              }else{
                console.log('fail: request close_help res')
                console.log(res)
                wx.showToast({
                  title: '服务器无法关闭这个请求',
                  icon: 'loading',
                  duration: 2000
                })
              }
            },
            fail: function() {console.log('fail: request close_help')},
            complete: function() {}
          })
        }
      },
      fail: function(){}
    })
  },
  rehelp: function(){
    var that=this;
    wx.showModal({
      title: "注意",
      content: '您确定要重启这个请求吗？',
      success: function(res){
        if (res.confirm){
          wx.request({
            url: 'https://www.hopee.xyz/rehelp',
            data: {token: getApp().globalData.token, todo_id: todo_id},
            header:{"Content-Type":"application/json"},
            method: 'POST',
            success: function(res){
              // success
              if(res.data.result_code == "t"){
                wx.showToast({
                  title: '成功重启这个请求',
                  icon: 'success',
                  duration: 2000
                })
                var new_todo = that.data.todo;
                new_todo.is_finish = false;
                that.setData({todo: new_todo})
                getApp().globalData.need_update_helps = true
                getApp().globalData.need_update_groups_helps = true
              }else{
                console.log('fail: request rehelp res')
                console.log(res)
                wx.showToast({
                  title: '服务器无法重启这个请求',
                  icon: 'loading',
                  duration: 2000
                })
              }
            },
            fail: function() {console.log('fail: request rehelp')},
            complete: function() {
              // complete
            }
          })
        }
      },
      fail: function(){}
    })
  },
  formSubmit: function(e){
    var that = this;
    var current_user = getApp().globalData.current_user;
    // 用户提交留言
    if(e.detail.value.content.replace(/\s/g, "")  == ""){
      wx.showToast({
        title: '内容不能为空',
        icon: 'loading',
        duration: 2000
      })
    }else{
      wx.showModal({
        title: "留言内容",
        content:  e.detail.value.content,
        success: function(res) {
          if (res.confirm) {
            wx.request({
              url: 'https://www.hopee.xyz/new_discussion',
              data: {token: getApp().globalData.token, todo_id: todo_id, content: e.detail.value.content},
              header:{"Content-Type":"application/json"},
              method: 'POST',
              success: function(res){
                if(res.data.id >= 0){
                  var nowtime = new Date();
                  var new_discussion = {todo_id: todo.id, user_id: current_user.id, nickname: current_user.nickname, content: e.detail.value.content, created_at: nowtime.toLocaleString()};
                  var discussions_obj = wx.getStorageSync(discussions) || []
                  discussions_obj.unshift(new_discussion)
                  wx.setStorageSync(discussions, discussions_obj)
                  that.setData({
                    discussions: discussions_obj,
                    discussions_length: discussions_obj.length,
                    empty: ""
                  })
                  // 生成可供筛选的选项
                  var discussions_user_ids = [];
                  var discussions_user_nicknames = [];
                  var is_hidden = [];
                  discussions_obj.map(function(discussion){
                    if (discussions_user_ids.indexOf(discussion.user_id) == -1 ){
                      discussions_user_ids = discussions_user_ids.concat(discussion.user_id)
                    }
                    if (discussions_user_nicknames.indexOf(discussion.nickname) == -1){
                     discussions_user_nicknames = discussions_user_nicknames.concat(discussion.nickname)
                    }   
                    is_hidden = is_hidden.concat("item")
                  });
                  var a = discussions_user_nicknames.map(function (nickname, index) { return nickname.concat("^^+_-^^", index) })
                  a.sort()
                  var c = a.map(function (hash) { return hash.split('^^+_-^^')[0] })
                  var b = a.map(function (hash) { return discussions_user_ids[hash.split('^^+_-^^')[1]] })
                  c.unshift("全部")
                  b.unshift(0)
                  that.setData({
                    discussions_user_ids: b,
                    discussions_user_nicknames: c,
                    is_hidden: is_hidden
                  })
                  wx.showToast({
                    title: '成功发表一条留言',
                    icon: 'success',
                    duration: 2000,
                    //complete: function(){
                      //wx.navigateBack()
                    //}
                  })
                  
                }else{
                  wx.showToast({
                    title: res.data.msg || "留言失败，请稍后重试",
                    icon: 'loading',
                    duration: 2000
                  })
                }
              },
              fail: function() {
                // fail
                wx.showToast({
                  title: '请求失败，请先检查网络，稍后发送。',
                  icon: 'loading',
                  duration: 2000
                })
              },
              complete: function() {
                // complete
              }
            })
          }
        }
      })     
    }
 //}
  },
  onShareAppMessage: function () {
    var todo = this.data.todo;
    return {
      title: '您看，这事怎么办才好？',
      path: "/pages/todo/todo?todo_id=" + todo.id + "&user_nickname=" + todo.user_nickname + "&receiver_nickname=" + todo.receiver_nickname + "&created_at=" + todo.created_at + "&is_finish=" + todo.if_finish + "&content=" + todo.content
    }
  },
  turnBack: function(){
    if(scene == 1){
      scene = 0
      wx.redirectTo({url: '../index/index'})
    }else{
      wx.navigateBack()
    }
  }
})
