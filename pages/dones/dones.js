// pages/dones/dones.js
var dones_user_ids = [0];
Page({
  data:{},
    onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // 到网站请求最新信息
    var that = this
    wx.request({
      url: 'https://www.hopee.xyz/dones',
      data: { token: wx.getStorageSync('token') },
      header:{"Content-Type":"application/json"},
      method: 'GET',
      success: function(res){
        if(res.data.dones){
          wx.setStorageSync('dones', res.data.dones)
          that.setData({
            dones: res.data.dones,
            dones_length: res.data.dones.length,
            current_user: wx.getStorageSync('current_user')
          })
          // 生成可供筛选的选项
          var dones_user_nicknames = ["全部"];
          var is_hidden = [];
          (res.data.dones || []).map(function(done){
            if (dones_user_ids.indexOf(done.user_id) == -1 ){
              dones_user_ids = dones_user_ids.concat(done.user_id)
            }
            if (dones_user_nicknames.indexOf(done.nickname) == -1){
              dones_user_nicknames = dones_user_nicknames.concat(done.nickname)
            }   
            is_hidden = is_hidden.concat("item")
          });
          that.setData({
            dones_user_ids: dones_user_ids,
            dones_user_nicknames: dones_user_nicknames,
            is_hidden: is_hidden
          })
        }else{
          console.log('fail: request dones res')
          console.log(res)
        }
      },
      fail: function() {console.log('fail: request dones')},
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
    this.setData({
      index: e.detail.value
    })
    var is_hidden = [];
    var dones_length = 0;
    if (e.detail.value == 0){
      (wx.getStorageSync('dones') || []).map(function(done){
        is_hidden = is_hidden.concat("item")
        dones_length = dones_length + 1
      })
    }else{
      (wx.getStorageSync('dones') || []).map(function(done){
        if(done.user_id == dones_user_ids[e.detail.value]){
          is_hidden = is_hidden.concat("item")
          dones_length = dones_length + 1
        }else{
          is_hidden = is_hidden.concat("hidden")
        }
      })
    }
    this.setData({
      is_hidden: is_hidden,
      dones_length: dones_length
    })
  },
  moreFun: function(){
    wx.showActionSheet({
      itemList: ['未完成的任务(首页)', '陌生人给我的任务'],
      success: function(res){
        if(res.tapIndex == 0){
          wx.switchTab({url: '../todos/todos'})
        }else if(res.tapIndex == 1){
           wx.navigateTo({url: '../other_todos/other_todos'})
        }
      }
  })
  }
})
