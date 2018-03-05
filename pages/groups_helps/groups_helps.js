// pages/groups_groups_helps/groups_groups_helps.js

Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    var that = this;
    var token = getApp().globalData.token;
    var groups_helps_group_ids = [];
    if (getApp().globalData.need_update_groups_helps == true) {
    wx.request({
      url: 'https://www.hopee.xyz/groups_helps',
      data: { token: token },
      header:{"Content-Type":"application/json"},
      method: 'GET',
      success: function(res){
        if(res.data.groups_helps){
          wx.setStorageSync('groups_helps', res.data.groups_helps)
          getApp().globalData.need_update_groups_helps = false
          that.setData({
            groups_helps: res.data.groups_helps,
            groups_helps_length: res.data.groups_helps.length,
          })
          // 生成可供筛选的选项
          var groups_helps_group_names = [];
          var is_hidden = [];
          (res.data.groups_helps || []).map(function(groups_help){
            if (groups_helps_group_ids.indexOf(groups_help.group_id) == -1 ){
              groups_helps_group_ids = groups_helps_group_ids.concat(groups_help.group_id)
      }
            if (groups_helps_group_names.indexOf(groups_help.name) == -1){
              groups_helps_group_names = groups_helps_group_names.concat(groups_help.name)
            }   
            is_hidden = is_hidden.concat("item")
          });
          var a = groups_helps_group_names.map(function (nickname, index) { return nickname.concat("^^+_-^^", index) })
          a.sort()
          var c = a.map(function (hash) { return hash.split('^^+_-^^')[0] })
          var b = a.map(function (hash) { return groups_helps_group_ids[hash.split('^^+_-^^')[1]] })
          c.unshift("全部")
          b.unshift(0)
          that.setData({
            groups_helps_group_ids: b,
            groups_helps_group_names: c,
            is_hidden: is_hidden
          })
        }else{
          console.log('fail: request groups_helps res')
          console.log(res)
        }
      },
      fail: function() {console.log('fail: request groups_helps')},
      complete: function() {}
    }) 
    } else {
      //console.log('groups_helps from storage')
      var groups_helps_in_storage = wx.getStorageSync('groups_helps');
      that.setData({
        groups_helps: groups_helps_in_storage,
        groups_helps_length: groups_helps_in_storage.length,
      })
      // 生成可供筛选的选项
      var groups_helps_group_names = [];
      var is_hidden = [];
      (groups_helps_in_storage || []).map(function (groups_help) {
        if (groups_helps_group_ids.indexOf(groups_help.group_id) == -1) {
          groups_helps_group_ids = groups_helps_group_ids.concat(groups_help.group_id)
        }
        if (groups_helps_group_names.indexOf(groups_help.name) == -1) {
          groups_helps_group_names = groups_helps_group_names.concat(groups_help.name)
        }
        is_hidden = is_hidden.concat("item")
      });
      var a = groups_helps_group_names.map(function (nickname, index) { return nickname.concat("^^+_-^^", index) })
      a.sort()
      var c = a.map(function (hash) { return hash.split('^^+_-^^')[0] })
      var b = a.map(function (hash) { return groups_helps_group_ids[hash.split('^^+_-^^')[1]] })
      c.unshift("全部")
      b.unshift(0)
      that.setData({
        groups_helps_group_ids: b,
        groups_helps_group_names: c,
        is_hidden: is_hidden
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
    var that = this;
    this.setData({
      index: e.detail.value
    })
    var is_hidden = [];
    var groups_helps_length = 0;
    if (e.detail.value == 0){
      (wx.getStorageSync('groups_helps') || []).map(function(groups_help){
        is_hidden = is_hidden.concat("item")
        groups_helps_length = groups_helps_length + 1
      })
    }else{
      (wx.getStorageSync('groups_helps') || []).map(function(groups_help){
        if(groups_help.group_id == that.data.groups_helps_group_ids[e.detail.value]){
          is_hidden = is_hidden.concat("item")
          groups_helps_length = groups_helps_length + 1
        }else{
          is_hidden = is_hidden.concat("hidden")
        }
      })
    }
    this.setData({
      is_hidden: is_hidden,
      groups_helps_length: groups_helps_length
    })
  },
  search_lists: function (e) {
    var that = this;
    var is_hidden = [];
    var groups_helps_length = 0;
    (wx.getStorageSync('groups_helps') || []).map(function (help) {
      if (help.content.indexOf(e.detail.value) >= 0) {
        is_hidden = is_hidden.concat("item")
        groups_helps_length = groups_helps_length + 1
      } else {
        is_hidden = is_hidden.concat("hidden")
      }
      that.setData({
        is_hidden: is_hidden,
        index: 0,
        groups_helps_length: groups_helps_length
      })
      //console.log("search done")
    })
  }
})
