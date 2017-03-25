// pages/todo/todo.js
var todo_id;
var user_id;
var user_nickname;
var receiver_id;
var receiver_nickname;
var is_finish;
var todo;
var discussions;
var discussions_user_ids = [0];
var token = wx.getStorageSync('token');
var current_user = wx.getStorageSync('current_user');
var just_finished;
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    todo_id = options.todo_id
    user_id = options.user_id
    user_nickname = options.user_nickname
    receiver_id = options.receiver_id
    receiver_nickname = options.receiver_nickname
    var created_at = options.created_at
    var content = options.content
    todo = 'todo_' + todo_id
    discussions = 'discussions_in_todo_' + todo_id
    just_finished = todo + '_is_finish'
    var is_finished = wx.getStorageSync(just_finished) || false
    if(is_finished == 't'){
      is_finish = true
    }else{
      is_finish = options.is_finish
    }
    this.setData({
      todo: {user_id: user_id, user_nickname: user_nickname, receiver_nickname: receiver_nickname, created_at: created_at, is_finish: is_finish, content: content},
    })
    // 到网站请求最新信息
    wx.request({
      url: 'https://www.hopee.xyz/discussions',
      data: { token: token, todo_id: todo_id },
      method: 'GET',
      success: function(res){
        // 取得信息之后：缓存信息
        if (res.data.discussions) {
          wx.setStorage({key: discussions, data: res.data.discussions})
        }
      },
      fail: function() {},
      complete: function() {}
    })
    // 取出缓存信息
    this.setData({
      discussions: (wx.getStorageSync(discussions) || []),
      discussions_length: (wx.getStorageSync(discussions) || []).length,
      current_user: current_user
    })
    // 生成可供筛选的选项
    var discussions_user_nicknames = ["全部"];
    var is_hidden = [];
    (wx.getStorageSync(discussions) || []).map(function(discussion){
      if (discussions_user_ids.indexOf(discussion.user_id) == -1 ){
        discussions_user_ids = discussions_user_ids.concat(discussion.user_id)
      }
      if (discussions_user_nicknames.indexOf(discussion.nickname) == -1){
        discussions_user_nicknames = discussions_user_nicknames.concat(discussion.nickname)
      }   
      is_hidden = is_hidden.concat("item")
    });
    this.setData({
      discussions_user_ids: discussions_user_ids,
      discussions_user_nicknames: discussions_user_nicknames,
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
    // 筛选留言
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
        if(discussion.user_id == discussions_user_ids[e.detail.value]){
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
    wx.showModal({
      title: "注意",
      content: '您确定要关闭这个请求吗？',
      success: function(res){
        if (res.confirm){
          wx.request({
            url: 'https://www.hopee.xyz/close_help',
            data: {token: token, todo_id: todo_id},
            method: 'POST',
            success: function(res){
              // success
              if(res.result_code == "t"){
                wx.showToast({
                  title: '成功关闭这个请求',
                  icon: 'success',
                  duration: 2000
                })
                wx.setStorageSync(just_finished, 't')
                wx.navigateBack()
              }else{
                wx.showToast({
                  title: '无法关闭这个请求',
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
      },
      fail: function(){}
    })
  },
  rehelp: function(){
    wx.showModal({
      title: "注意",
      content: '您确定要重启这个请求吗？',
      success: function(res){
        if (res.confirm){
          wx.request({
            url: 'https://www.hopee.xyz/rehelp',
            data: {token: token, todo_id: todo_id},
            method: 'POST',
            success: function(res){
              // success
              if(res.result_code == "t"){
                wx.showToast({
                  title: '成功重启这个请求',
                  icon: 'success',
                  duration: 2000
                })
                wx.setStorageSync(just_finished, false)
                wx.setData({
                  todo: {user_id: user_id, user_nickname: user_nickname, receiver_nickname: receiver_nickname, created_at: created_at, is_finish: false, content: content}
                })
              }else{
                wx.showToast({
                  title: '无法重启这个请求',
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
      },
      fail: function(){}
    })
  },
  formSubmit: function(e){
    // 用户提交留言
    if(e.detail.value.content.replace(/\s/g, "") 
 == ""){
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
              data: {token: token, todo_id: todo_id, content: e.detail.value.content},
              method: 'POST',
              success: function(res){
                if(res.id >= 0){
                  var nowtime = new Date();
                  var new_discussion = {todo_id: todo.id, user_id: current_user.id, content: e.detail.value.content, created_at: nowtime.toLocaleString()};
                  discussions = discussions.unshift(new_discussion)
                  wx.setStorageSync(discussions, iscussions)
                  this.setData({
                    discussions: wx.getStorageSync(discussions)
                      })
                  wx.showToast({
                    title: '成功发表一条留言',
                    icon: 'success',
                    duration: 2000
                  })
                }else{
                  wx.showToast({
                    title: res.msg || "留言失败，请稍后重试",
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
    return {
      title: '这件事，你看怎么办才好？',
      path: "/todo/todotodo_id={{todo.id}}&user_nickname={{todo.nickname}}&receiver_nickname={{todo.receiver_nickname}}&created_at={{todo.created_at}}&is_finish=t&content={{todo.content}}"
    }
  }
})
