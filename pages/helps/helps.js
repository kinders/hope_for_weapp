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
    var that = this
    wx.request({
      url: 'https://www.hopee.xyz/helps',
      data: { token: wx.getStorageSync('token') },
      header:{"Content-Type":"application/json"},
      method: 'GET',
      success: function(res){
        if(res.data.helps){
          wx.setStorageSync('helps', res.data.helps)
          that.setData({
            helps: res.data.helps,
            helps_length: res.data.helps.length,
            current_user: wx.getStorageSync('current_user')
          })
          // 生成可供筛选的选项
          var helps_receiver_nicknames = ["全部"];
          var helps_receiver_ids = [0];
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
          that.setData({
            helps_receiver_ids: helps_receiver_ids,
            helps_receiver_nicknames: helps_receiver_nicknames,
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
    return {
      title: '或许您可以帮我……',
      path: "/pages/new_friend/new_friend?friend_id=" + wx.getStorageSync('current_user').id + "&nickname=" + wx.getStorageSync('current_user').nickname
    }
  },
  moreFun: function(){
    wx.showActionSheet({
      itemList: ['我未满意的群请求', '我满意的请求'],
      success: function(res){
        if(res.tapIndex == 0){
          wx.navigateTo({url: '../groups_helps/groups_helps'})
        }else if(res.tapIndex == 1){
           wx.navigateTo({url: '../helpeds/helpeds'})
        }
      }
  })
  }
})