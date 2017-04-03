// pages/helps/helps.js
var helps_receiver_ids = [0];
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化
    // 取出缓存信息
    this.setData({
      helps: (wx.getStorageSync('helps') || []),
      helps_length: (wx.getStorageSync('helps') || []).length,
      current_user: wx.getStorageSync('current_user')
    })
    // 生成可供筛选的选项
    var helps_receiver_nicknames = ["全部"];
    var is_hidden = [];
    (wx.getStorageSync('helps') || []).map(function(help){
      if (helps_receiver_ids.indexOf(help.receiver_id) == -1 ){
        helps_receiver_ids = helps_receiver_ids.concat(help.receiver_id)
      }
      if (helps_receiver_nicknames.indexOf(help.nickname) == -1){
        helps_receiver_nicknames = helps_receiver_nicknames.concat(help.nickname)
      }   
      is_hidden = is_hidden.concat("item")
    });
    this.setData({
      helps_receiver_ids: helps_receiver_ids,
      helps_receiver_nicknames: helps_receiver_nicknames,
      is_hidden: is_hidden
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
    var helps_length = 0;
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
})