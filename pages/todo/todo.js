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
var just_finished;
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
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
      todo: {user_id: user_id, user_nickname: user_nickname, receiver_nickname: receiver_nickname, created_at: created_at, is_finish: is_finish, content: content},
      current_user: wx.getStorageSync('current_user')
    })
    //console.log(this.data.todo)
    // 到网站请求最新信息
    wx.request({
      url: 'https://www.hopee.xyz/todo',
      data: { token: wx.getStorageSync('token'), todo_id: todo_id },
      method: 'GET',
      success: function(res){
        //console.log('request todo success')
        //console.log(res)
        // 取得信息之后：缓存信息
        if (res.data.discussions) {
          wx.setStorageSync(discussions, res.data.discussions)
          that.setData({
            discussions: res.data.discussions || [],
            discussions_length: res.data.discussions.length || 0
          })
          //console.log('set_storage_sync_discussions')
          // 生成可供筛选的选项
          var discussions_user_nicknames = ["全部"];
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
          that.setData({
            discussions_user_ids: discussions_user_ids,
            discussions_user_nicknames: discussions_user_nicknames,
            is_hidden: is_hidden
          })
        }else{
          console.log('fail: request todo res')
          console.log(res)
        }
      },
      fail: function() {console.log('fail: request todo')},
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
    var that = this;
    wx.showModal({
      title: "注意",
      content: '您确定要关闭这个请求吗？',
      success: function(res){
        if (res.confirm){
          wx.request({
            url: 'https://www.hopee.xyz/close_help',
            data: {token: wx.getStorageSync('token'), todo_id: todo_id},
            method: 'POST',
            success: function(res){
              // success
              if(res.data.result_code == "t"){
                wx.showToast({
                  title: '成功关闭这个请求',
                  icon: 'success',
                  duration: 2000
                })
                //wx.setStorageSync(just_finished, 't')
                var new_todo = that.data.todo;
                new_todo.is_finish = 'true';
                //console.log(new_todo)
                that.setData({todo: new_todo})
              }else{
                console.log('fail: request close_help res')
                console.log(res)
                wx.showToast({
                  title: '服务器拒绝关闭这个请求',
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
            data: {token: wx.getStorageSync('token'), todo_id: todo_id},
            method: 'POST',
            success: function(res){
              // success
              if(res.data.result_code == "t"){
                wx.showToast({
                  title: '成功重启这个请求',
                  icon: 'success',
                  duration: 2000
                })
                //wx.setStorageSync(just_finished, false)
                var new_todo = that.data.todo;
                new_todo.is_finish = false;
                that.setData({todo: new_todo})
              }else{
                console.log('fail: request rehelp res')
                console.log(res)
                wx.showToast({
                  title: '服务器拒绝重启这个请求',
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
              data: {token: wx.getStorageSync('token'), todo_id: todo_id, content: e.detail.value.content},
              method: 'POST',
              success: function(res){
                if(res.data.id >= 0){
                  var nowtime = new Date();
                  var new_discussion = {todo_id: todo.id, user_id: wx.getStorageSync('current_user').id, nickname: wx.getStorageSync('current_user').nickname, content: e.detail.value.content, created_at: nowtime.toLocaleString()};
                  var discussions_obj = wx.getStorageSync(discussions) || []
                  discussions_obj.push(new_discussion)
                  wx.setStorageSync(discussions, discussions_obj)
                  that.setData({
                    discussions: discussions_obj,
                    discussions_length: discussions_obj.length,
                    empty: ""
                  })
                  // 生成可供筛选的选项
    var discussions_user_ids = [0];
    var discussions_user_nicknames = ["全部"];
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
    that.setData({
      discussions_user_ids: discussions_user_ids,
      discussions_user_nicknames: discussions_user_nicknames,
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
    return {
      title: '这事，你看怎么办才好？',
      path: "/todo/todotodo_id={{todo.id}}&user_nickname={{todo.nickname}}&receiver_nickname={{todo.receiver_nickname}}&created_at={{todo.created_at}}&is_finish=t&content={{todo.content}}"
    }
  }
})
