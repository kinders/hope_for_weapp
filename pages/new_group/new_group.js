// pages/new_group/new_group.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      friendships: (wx.getStorageSync('friendships') || [])
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
    if(e.detail.value.name.replace(/\s/g, "") 
 == ""){
      wx.showToast({
        title: '群名称无效',
        icon: 'loading',
        duration: 1000
      })
    }else if(e.detail.value.checkbox.length < 2){
      wx.showToast({
        title: '人数太少',
        icon: 'loading',
        duration: 1000
      })
    }else{
      wx.showModal({
        title: "群名： " + e.detail.value.name,
        content:  "人数：" + e.detail.value.checkbox.length,
        success: function(res) {
          if (res.confirm) {
            wx.request({
              url: 'https://www.hopee.xyz/new_group',
              data: {token: wx.getStorageSync('token'), name: e.detail.value.name, friends_id: e.detail.value.checkbox.join('_')},
              method: 'POST',
              success: function(res){
                if(res.id >= 0){
                  var new_group = {id: res.id, name: e.detail.value.name}
                  groups = wx.getStorageSync('groups') || []
                  groups = groups.unshift(new_group)
                  wx.setStoragesync('groups', groups)
                  // 本来可以接着存储群里的用户信息的。不过群里朋友名字的传递是个问题。以后再说。
                  wx.showToast({
                    title: '成功建立新群',
                    icon: 'success',
                    duration: 2000
                  })
                }else{
                  wx.showToast({
                    title: res.msg,
                    icon: 'loading',
                    duration: 2000
                  })
                }
              },
              fail: function() {
                // fail
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
    wx.navigateBack()
  }
})
