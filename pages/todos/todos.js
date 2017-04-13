//todos.js
//获取应用实例
var todos_user_ids = [0];
Page({
  data: {},
  //事件处理函数
  onLoad: function () {
    /*
    // 取出缓存信息
    this.setData({
      todos: (wx.getStorageSync('todos') || []),
      todos_length: (wx.getStorageSync('todos') || []).length,
      current_user: wx.getStorageSync('current_user'),
    })
    // 生成可供筛选的选项
    var todos_user_nicknames = ["全部"];
    var is_hidden = [];
    (wx.getStorageSync('todos') || []).map(function(todo){
      if (todos_user_ids.indexOf(todo.user_id) == -1 ){
        todos_user_ids = todos_user_ids.concat(todo.user_id)
      }
      if (todos_user_nicknames.indexOf(todo.nickname) == -1){
        todos_user_nicknames = todos_user_nicknames.concat(todo.nickname)
      }   
      is_hidden = is_hidden.concat("item")
    });
    this.setData({
      todos_user_ids: todos_user_ids,
      todos_user_nicknames: todos_user_nicknames,
      is_hidden: is_hidden
    })
    */
  },
  onShow: function(){
    // 到网站请求最新信息
    var that = this
    wx.request({
      url: 'https://www.hopee.xyz/todos',
      data: { token: wx.getStorageSync('token') },
      header:{"Content-Type":"application/json"},
      method: 'GET',
      success: function(res){
        //console.log(res)
        if(res.data.todos){
          wx.setStorageSync('todos', res.data.todos)
          that.setData({
            todos: res.data.todos,
            todos_length: res.data.todos.length,
            current_user: wx.getStorageSync('current_user')
          })
          // 生成可供筛选的选项
          var todos_user_nicknames = ["全部"];
          var is_hidden = [];
          (wx.getStorageSync('todos') || []).map(function(todo){
            if (todos_user_ids.indexOf(todo.user_id) == -1 ){
              todos_user_ids = todos_user_ids.concat(todo.user_id)
            }
            if (todos_user_nicknames.indexOf(todo.nickname) == -1){
              todos_user_nicknames = todos_user_nicknames.concat(todo.nickname)
            }   
            is_hidden = is_hidden.concat("item")
          });
          that.setData({
            todos_user_ids: todos_user_ids,
            todos_user_nicknames: todos_user_nicknames,
            is_hidden: is_hidden
          })
        }else{
          console.log('fail: request helps res')
          console.log(res)
        }
      },
      fail: function() {console.log('fail: request helps')},
      complete: function() {}
    })
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
    var is_hidden = [];
    var todos_length = 0
    if (e.detail.value == 0){
      (wx.getStorageSync('todos') || []).map(function(todo){
        is_hidden = is_hidden.concat("item")
        todos_length = todos_length + 1
      })
    }else{
      (wx.getStorageSync('todos') || []).map(function(todo){
        if(todo.user_id == todos_user_ids[e.detail.value]){
          is_hidden = is_hidden.concat("item")
          todos_length = todos_length + 1
        }else{
          is_hidden = is_hidden.concat("hidden")
        }
      })
    }
    this.setData({
      is_hidden: is_hidden,
      todos_length: todos_length
    })
  },
  moreFun: function(){
    wx.showActionSheet({
      itemList: ['陌生人给我的任务', '我已完成的任务'],
      success: function(res){
        if(res.tapIndex == 0){
          wx.navigateTo({url: '../other_todos/other_todos'})
        }else if(res.tapIndex == 1){
           wx.navigateTo({url: '../dones/dones'})
        }
      }
  })
  }
})
