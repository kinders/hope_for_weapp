//other_todos.js
var todos_user_ids = [0];
var token = wx.getStorageSync('token');
var current_user = wx.getStorageSync('current_user');
Page({
  data: {},
  //事件处理函数
  onLoad: function () {
    // 请求网络数据
    wx.request({
      url: 'https://test.com/other_todos',
      data: { token: token },
      method: 'GET',
      success: function(res){
        // 取得信息之后：缓存信息
        if (res.data.todos) {
          wx.setStorage({key: 'other_todos', data: res.data.other_todos})
        }
      },
      fail: function() {},
      complete: function() {}
    })
    // 取出缓存信息
    this.setData({
      todos: (wx.getStorageSync('other_todos') || []),
      todos_length: (wx.getStorageSync('other_todos') || []).length,
      current_user: current_user
    })
    // 生成可供筛选的选项
    var todos_user_nicknames = ["全部"];
    var is_hidden = [];
    (wx.getStorageSync('other_todos') || []).map(function(todo){
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
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
    var is_hidden = [];
    var todos_length = 0
    if (e.detail.value == 0){
      (wx.getStorageSync('other_todos') || []).map(function(todo){
        is_hidden = is_hidden.concat("item")
        todos_length = todos_length + 1
      })
    }else{
      (wx.getStorageSync('other_todos') || []).map(function(todo){
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
})