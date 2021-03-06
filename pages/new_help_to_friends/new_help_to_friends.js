// pages/new_help_to_friends/new_help_to_friends.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      friendships: (wx.getStorageSync('friendships') || [])
    })
    wx.showModal({
      title: '提示',
      content: '如果您经常要向这几个朋友发送请求，建议您将这些好友添加到一个小组里面'
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
    if (e.detail.value.content.replace(/\s/g, "")  == "" ){
      wx.showToast({
        title: '不能提交空白请求',
        icon: 'loading',
        duration: 2000
      })
    }else if(e.detail.value.checkbox.length == 0){
      wx.showToast({
        title: '您还没有选择朋友',
        icon: 'loading',
        duration: 2000
      })
    }else{
      wx.showModal({
        title: "统发人数： " + e.detail.value.checkbox.length,
        content:  "内容：" + e.detail.value.content,
        success: function(res) {
          if (res.confirm) {
            var token = getApp().globalData.token;
            wx.request({
              url: 'https://www.hopee.xyz/new_help_to_friends',
              data: {token: token, content: e.detail.value.content, friends_id: e.detail.value.checkbox},
              header:{"Content-Type":"application/json"},
              method: 'POST',
              success: function(res){
                if(res.data.result_code == 't'){
                  getApp().globalData.need_update_helps = true
                  wx.showToast({
                    title: '成功统发',
                    icon: 'success',
                    duration: 2000
                  })
                }else{
                  console.log('fail: request new_help_to_friends res')
                  console.log(res)
                  wx.showToast({
                    title: '服务器无法统发该请求。您可在“请求”页面查看发送情况',
                    icon: 'loading',
                    duration: 2000
                  })
                }
                setTimeout(function(){wx.navigateBack()},2000);  
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
