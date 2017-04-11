// pages/new_help_to_friend/new_help_to_friend.js
var friend_id;
var nickname;
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    friend_id = options.friend_id
    nickname = options.nickname
    var friend = "friend_" + friend_id
    this.setData({
      friend: {friend_id: friend_id, nickname: nickname},
      current_user_id: wx.getStorageSync('current_user').id
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
        title: "向 " + nickname + " 请求：",
        content:  e.detail.value.content,
        success: function(res) {
          if (res.confirm) {
            wx.request({
              url: 'https://www.hopee.xyz/new_help_to_friend',
              data: {token: wx.getStorageSync('token'), receiver_id: friend_id, content: e.detail.value.content},
              header:{"Content-Type":"application/json"},
              method: 'POST',
              success: function(res){
                console.log(res)
                if(res.data.id >= 0){
                  /* 将信息插入helps
                  var new_help = {id: res.data.id, content: e.detail.value.content, receiver: nickname, created_at: res.data.created_at }
                  var helps = wx.getStorageSync('helps') || []
                  helps.unshift(new_help)
                  wx.setStorageSync('helps',helps)
                  */
                  wx.showToast({
                    title: '成功提交请求',
                    icon: 'success',
                    duration: 2000
                  })
                  that.setData({empty: null})
                }else{
                  console.log('fail: request new_help_to_friend res')
                  console.log(res)
                  wx.showToast({
                    title: '请求被服务器拒绝',
                    icon: 'loading',
                    duration: 2000
                  })
                }
              },
              fail: function() {
                // fail
                console.log('fail: request new_help_to_friend')
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
