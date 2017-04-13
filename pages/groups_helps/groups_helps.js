// pages/groups_groups_helps/groups_groups_helps.js
var groups_helps_group_ids = [0];
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
        var that = this
    wx.request({
      url: 'https://www.hopee.xyz/groups_helps',
      data: { token: wx.getStorageSync('token') },
      header:{"Content-Type":"application/json"},
      method: 'GET',
      success: function(res){
        if(res.data.groups_helps){
          wx.setStorageSync('groups_helps', res.data.groups_helps)
          that.setData({
            groups_helps: res.data.groups_helps,
            groups_helps_length: res.data.groups_helps.length,
          })
          // 生成可供筛选的选项
          var groups_helps_group_names = ["全部"];
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
          that.setData({
            groups_helps_group_ids: groups_helps_group_ids,
            groups_helps_group_names: groups_helps_group_names,
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
    var groups_helps_length = 0;
    if (e.detail.value == 0){
      (wx.getStorageSync('groups_helps') || []).map(function(groups_help){
        is_hidden = is_hidden.concat("item")
        groups_helps_length = groups_helps_length + 1
      })
    }else{
      (wx.getStorageSync('groups_helps') || []).map(function(groups_help){
        if(groups_help.group_id == groups_helps_group_ids[e.detail.value]){
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
  moreFun: function(){
    wx.showActionSheet({
      itemList: ['我未满意的请求(首页)', '我满意的请求'],
      success: function(res){
        if(res.tapIndex == 0){
          wx.switchTab({url: '../helps/helps'})
        }else if(res.tapIndex == 1){
           wx.redirectTo({url: '../helpeds/helpeds'})
        }
      }
  })
  }
})