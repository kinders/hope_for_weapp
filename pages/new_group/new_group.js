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
    var that=this;
    if(e.detail.value.name.replace(/\s/g, "") == ""){
      wx.showToast({
        title: '群名称不能为空',
        icon: 'loading',
        duration: 1000
      })
    }else if(e.detail.value.checkbox.length < 2){
      wx.showToast({
        title: '群里人数不能少于2人',
        icon: 'loading',
        duration: 1000
      })
    }else{
      wx.showModal({
        title: "群名： " + e.detail.value.name,
        content:  "人数：" + e.detail.value.checkbox.length,
        success: function(res) {
          if (res.confirm) {
            var token = getApp().globalData.token;
            wx.request({
              url: 'https://www.hopee.xyz/new_group',
              data: {token: token, name: e.detail.value.name, friends_id: e.detail.value.checkbox.join('_')},
              header:{"Content-Type":"application/json"},
              method: 'POST',
              success: function(res){
                if(res.data.group_id >= 0){
                  getApp().globalData.need_update_groups = true
                  wx.showToast({
                    title: '成功建立新群',
                    icon: 'success',
                    duration: 2000
                  })
                  that.setData({
                    empty: '',
                    is_check: false
                  })
                }else{
                  console.log('fail: request new_group res')
                  console.log(res)
                  wx.showToast({
                    title: '服务器无法添加该群',
                    icon: 'loading',
                    duration: 2000
                  })
                }
              },
              fail: function() {
                // fail
                console.log('fail: request new_group')
                wx.showToast({
                  title: '请求失败，请先检查网络，稍后发送。',
                  icon: 'loading',
                  duration: 2000
                })
              },
              complete: function() {}
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
