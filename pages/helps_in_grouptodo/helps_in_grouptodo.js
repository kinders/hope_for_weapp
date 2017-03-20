// pages/helps_in_grouptodo/helps_in_grouptodo.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var group_id = options.group_id
    var name = options.name
    var time = options.time
    var content = options.content
    var grouptodo_id = options.id
    var is_finish = options.is_finish
    var helps_in_grouptodo = "helps_in_grouptodo_" + grouptodo_id
    this.setData({
      group: {group_id: group_id, name: name},
      grouptodo: {time: time, content: content, is_finish: is_finish},
      helps_in_grouptodo: (wx.getStorageSync(helps_in_grouptodo) || [])
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
  }
})