// pages/helpededs/helpededs.js

Page({
  data:{
    helpeds_receiver_ids: [0]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    // 到网站请求最新信息
    var that = this
    wx.request({
      url: 'https://www.hopee.xyz/helpeds',
      data: { token: wx.getStorageSync('token') },
      header:{"Content-Type":"application/json"},
      method: 'GET',
      success: function(res){
        // 取得信息之后：缓存信息
        if (res.data.helpeds) {
          wx.setStorageSync('helpeds', res.data.helpeds)
          that.setData({
            helpeds: res.data.helpeds,
            helpeds_length: res.data.helpeds.length,
            current_user: wx.getStorageSync('current_user')
          })
          // 生成可供筛选的选项
          var helpeds_receiver_nicknames = ["全部"];
          var helpeds_receiver_ids = that.data.helpeds_receiver_ids;
          var is_hidden = [];
          (res.data.helpeds || []).map(function(helped){
            if (helpeds_receiver_ids.indexOf(helped.receiver_id) == -1 ){
              helpeds_receiver_ids = helpeds_receiver_ids.concat(helped.receiver_id)
            }
            if (helpeds_receiver_nicknames.indexOf(helped.nickname) == -1){
              helpeds_receiver_nicknames = helpeds_receiver_nicknames.concat(helped.nickname)
            }   
            is_hidden = is_hidden.concat("item")
          });
          that.setData({
            helpeds_receiver_ids: helpeds_receiver_ids,
            helpeds_receiver_nicknames: helpeds_receiver_nicknames,
            is_hidden: is_hidden
          })
        } else {
          console.log('fail: request helpeds res')
          console.log(res)
        }
      },
      fail: function() {console.log('fail: request helpeds')},
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
    var helpeds_length = 0;
    var helpeds_receiver_ids = this.data.helpeds_receiver_ids;
    if (e.detail.value == 0){
      (wx.getStorageSync('helpeds') || []).map(function(helped){
        is_hidden = is_hidden.concat("item")
        helpeds_length = helpeds_length + 1
      })
    }else{
      (wx.getStorageSync('helpeds') || []).map(function(helped){
        if(helped.receiver_id == helpeds_receiver_ids[e.detail.value]){
          is_hidden = is_hidden.concat("item")
          helpeds_length = helpeds_length + 1
        }else{
          is_hidden = is_hidden.concat("hidden")
        }
      })
    }
    this.setData({
      is_hidden: is_hidden,
      helpeds_length: helpeds_length
    })
  },
  moreFun: function(){
    wx.showActionSheet({
      itemList: ['我未满意的请求(首页)', '我未满意的群请求'],
      success: function(res){
        if(res.tapIndex == 0){
          wx.switchTab({url: '../helps/helps'})
        }else if(res.tapIndex == 1){
           wx.redirectTo({url: '../groups_helps/groups_helps'})
        }
      }
  })
  },
  bindDateChange: function(e){
    this.setData({
      date: e.detail.value
    })
    var that=this;
    wx.request({
      url: 'https://www.hopee.xyz/helpeds_in_date',
      data: { token: wx.getStorageSync('token'), date: e.detail.value },
      header:{"Content-Type":"application/json"},
      method: 'GET',
      success: function(res){
        // 取得信息之后：缓存信息
        if (res.data.helpeds) {
          console.log(res)
          wx.setStorageSync('helpeds', res.data.helpeds)
          that.setData({
            helpeds: res.data.helpeds,
            helpeds_length: res.data.helpeds.length,
            current_user: wx.getStorageSync('current_user')
          })
          // 生成可供筛选的选项
          var helpeds_receiver_nicknames = ["全部"];
          var helpeds_receiver_ids = [0];
          var is_hidden = [];
          (res.data.helpeds || []).map(function(helped){
            if (helpeds_receiver_ids.indexOf(helped.receiver_id) == -1 ){
              helpeds_receiver_ids = helpeds_receiver_ids.concat(helped.receiver_id)
            }
            if (helpeds_receiver_nicknames.indexOf(helped.nickname) == -1){
              helpeds_receiver_nicknames = helpeds_receiver_nicknames.concat(helped.nickname)
            }   
            is_hidden = is_hidden.concat("item")
          });
          that.setData({
            helpeds_receiver_ids: helpeds_receiver_ids,
            helpeds_receiver_nicknames: helpeds_receiver_nicknames,
            is_hidden: is_hidden
          })
        } else {
          console.log('fail: request helpeds in date res')
          console.log(res)
        }
      },
      fail: function() {console.log('fail: request helpeds in date')},
      complete: function() {}
    })

  }
})
