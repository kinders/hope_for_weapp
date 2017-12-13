// pages/helps/helps.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    // 到网站请求最新信息
    var that = this;
    var token = getApp().globalData.token;
    var current_user = getApp().globalData.current_user;
    if (getApp().globalData.need_update_helps == true){
    wx.request({
      url: 'https://www.hopee.xyz/helps',
      data: { token: token },
      header:{"Content-Type":"application/json"},
      method: 'GET',
      success: function(res){
        if(res.data.helps){
          wx.setStorageSync('helps', res.data.helps)
          getApp().globalData.need_update_helps = false
          that.setData({
            helps: res.data.helps,
            helps_length: res.data.helps.length,
            current_user: current_user
          })
          // 生成可供筛选的选项
          var helps_receiver_nicknames = [];
          var helps_receiver_ids = [];
          var is_hidden = [];
          (res.data.helps || []).map(function(help){
            if (helps_receiver_ids.indexOf(help.receiver_id) == -1 ){
              helps_receiver_ids = helps_receiver_ids.concat(help.receiver_id)
            }
            if (helps_receiver_nicknames.indexOf(help.nickname) == -1){
              helps_receiver_nicknames = helps_receiver_nicknames.concat(help.nickname)
            }   
            is_hidden = is_hidden.concat("item")
          });
          var a = helps_receiver_nicknames.map(function (nickname, index) { return nickname.concat("^^+_-^^", index) })
          a.sort()
          var c = a.map(function (hash) { return hash.split('^^+_-^^')[0] })
          var b = a.map(function (hash) { return helps_receiver_ids[hash.split('^^+_-^^')[1]] })
          c.unshift("全部")
          b.unshift(0)
          that.setData({
            helps_receiver_ids: b,
            helps_receiver_nicknames: c,
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

    } else {
      //console.log('helps from storage')
      var helps_in_storage = wx.getStorageSync('helps')
      that.setData({
        helps: helps_in_storage,
        helps_length: helps_in_storage.length,
        current_user: current_user
      })
      // 生成可供筛选的选项
      var helps_receiver_nicknames = [];
      var helps_receiver_ids = [];
      var is_hidden = [];
      (helps_in_storage || []).map(function (help) {
        if (helps_receiver_ids.indexOf(help.receiver_id) == -1) {
          helps_receiver_ids = helps_receiver_ids.concat(help.receiver_id)
        }
        if (helps_receiver_nicknames.indexOf(help.nickname) == -1) {
          helps_receiver_nicknames = helps_receiver_nicknames.concat(help.nickname)
        }
        is_hidden = is_hidden.concat("item")
      });
      var a = helps_receiver_nicknames.map(function (nickname, index) { return nickname.concat("^^+_-^^", index) })
      a.sort()
      var c = a.map(function (hash) { return hash.split('^^+_-^^')[0] })
      var b = a.map(function (hash) { return helps_receiver_ids[hash.split('^^+_-^^')[1]] })
      c.unshift("全部")
      b.unshift(0)
      that.setData({
        helps_receiver_ids: b,
        helps_receiver_nicknames: c,
        is_hidden: is_hidden,
        index: null
      })
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
    var is_hidden = [];
    var helps_length = 0;
    var helps_receiver_ids = this.data.helps_receiver_ids;
    if (e.detail.value == 0){
      (wx.getStorageSync('helps') || []).map(function(help){
        is_hidden = is_hidden.concat("item"),
        helps_length = helps_length + 1
      })
    }else{
      (wx.getStorageSync('helps') || []).map(function(help){
        if(help.receiver_id == helps_receiver_ids[e.detail.value]){
          is_hidden = is_hidden.concat("item"),
          helps_length = helps_length + 1
        }else{
          is_hidden = is_hidden.concat("hidden")
        }
      })
    }
    this.setData({
      is_hidden: is_hidden,
      helps_length: helps_length
    })
  },
  onShareAppMessage: function () {
    var current_user = getApp().globalData.current_user;
    return {
      title: '或许您可以帮我……',
      path: "/pages/new_friend/new_friend?friend_id=" + current_user.id + "&nickname=" + current_user.nickname
    }
  },
  close_help: function (event) {
    var that = this;
    var todo_id = event.currentTarget.dataset.todo_id;
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
                var helps = wx.getStorageSync('helps') || []
                var todo_index;
                helps.map(function (hash, index) {
                  if (hash.id == todo_id) {
                    todo_index = index
                  }
                })
                helps.splice(todo_index, 1)
                wx.setStorageSync('helps', helps)
                that.setData({
                  helps: helps || [],
                  helps_length: helps.length || 0
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
