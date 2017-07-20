// pages/new_help_to_group/new_help_to_group.js
var group_id;
var name;
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    group_id = options.group_id
    name = options.name
    this.setData({
      group: {group_id: group_id, name: name},
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
  formSubmit:function(e){
    var that=this;
    if(e.detail.value.content.replace(/\s/g, "") 
 == ""){
      wx.showToast({
        title: '不能提交空白请求',
        icon: 'loading',
        duration: 2000
      })
    }else {
      wx.showModal({
        title: "向 " + name + " 类请求：",
        content:  e.detail.value.content,
        success: function(res) {
          if (res.confirm) {
            var token = getApp().globalData.token;
            wx.request({
              url: 'https://www.hopee.xyz/new_help_to_group',
              data: {token: token, group_id: that.data.group.group_id, content: e.detail.value.content},
              header:{"Content-Type":"application/json"},
              method: 'POST',
              success: function(res){
                if(res.data.id >= 0){
                  /* 将新的类请求加入缓存。
                  var groups_helps = wx.getStorageSync('groups_helps') || []
                  groups_helps.unshift({id: res.data.id, content: e.detail.value.content, group_id: group_id, group_name: name, created_at: res.data.time})
                  wx.setStorageSync('groups_helps', groups_helps)
                  */
                  getApp().globalData.need_update_groups_helps = true
                  wx.showToast({
                    title: '成功提交请求',
                    icon: 'success',
                    duration: 2000
                  })
                  that.setData({empty: null})
                }else{
                  console.log('fail: request new_help_to_group res')
                  console.log(res)
                }
              },
              fail: function() {
                console.log('fail: request new_help_to_group')
                wx.showToast({
                  title: '请求失败，请先检查网络，稍后发送。',
                  icon: 'loading',
                  duration: 2000
                })
              },
              complete: function() {
                // complete
              }
            })
          }
        }
      })
    }
  },
  formReset: function(){
    wx.redirectTo({url: "../groups/groups" })
  }
})
