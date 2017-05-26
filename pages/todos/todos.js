//todos.js
//获取应用实例

Page({
  data: {},
  //事件处理函数
  onLoad: function () {
  },
  onShow: function(){
    // 到网站请求最新信息
    var that = this;
    var token = getApp().globalData.token;
    var current_user = getApp().globalData.current_user;
    wx.request({
      url: 'https://www.hopee.xyz/todos',
      data: { token: token },
      header:{"Content-Type":"application/json"},
      method: 'GET',
      success: function(res){
        //console.log(res)
        if(res.data.todos){
          wx.setStorageSync('todos', res.data.todos)
          that.setData({
            todos: res.data.todos,
            todos_length: res.data.todos.length,
            current_user: current_user
          })
          // 生成可供筛选的选项
          var todos_user_ids = [];
          var todos_user_nicknames = [];
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
          var a = todos_user_nicknames.map(function (nickname, index) { return nickname.concat("^^+_-^^", index) })
          a.sort()
          var c = a.map(function (hash) { return hash.split('^^+_-^^')[0] })
          var b = a.map(function (hash) { return todos_user_ids[hash.split('^^+_-^^')[1]] })
          c.unshift("全部")
          b.unshift(0)
          that.setData({
            todos_user_ids: b,
            todos_user_nicknames: c,
            is_hidden: is_hidden,
            index: null
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
    var that = this;
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
        if(todo.user_id == that.data.todos_user_ids[e.detail.value]){
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
  }
})
