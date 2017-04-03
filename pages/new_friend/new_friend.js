// pages/new_friend/new_friend.js
var nickname;
var friend_id;
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    friend_id = options.friend_id
    nickname = options.nickname
    this.setData({
      friend_nickname: nickname
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
      wx.showModal({
        title: "添加新朋友",
        content:  "昵称：" + (e.detail.value.name || nickname),
        success: function(res) {
          if (res.confirm) {
            wx.request({
              url: 'https://www.hopee.xyz/new_friend',
              data: {token: wx.getStorageSync('token'), nickname: (e.detail.value.name || nickname), friend_id: friend_id},
              method: 'POST',
              success: function(res){
                if(res.id >= 0){
                  new_friendship = {id: res.id, nickname: e.detail.value.name || nickname}
                  friendships = wx.getStorageSync('friendships') || []
                  friendships = friendships.unshift(new_friendship)
                  wx.setStorage({
                    key: 'friendships',
                    data: friendships,
                    success: function(res){
                      // success
                    },
                    fail: function() {
                      // fail
                    },
                    complete: function() {
                      // complete
                    }
                  })
                  wx.showToast({
                    title: '成功添加好友',
                    icon: 'success',
                    duration: 2000
                  })
                }else{
                  wx.showToast({
                    title: (res.msg || ""),
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
  },
  formReset: function(){
    wx.navigateBack()
  }
})
