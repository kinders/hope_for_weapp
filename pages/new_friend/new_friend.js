// pages/new_friend/new_friend.js
var nickname;
var friend_id;
var scene=0;
Page({
  data:{},
  onLoad:function(options){
    // 分享界面登录
    var token = wx.getStorageSync('token');
    if (token == '' ){
      getApp().getUserInfo()
      scene = 1
    }
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
  onShow:function(options){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  formSubmit:function(e){
    if (friend_id == getApp().globalData.current_user.id){
      wx.showToast({
        title: '你是自己最好的朋友！',
        icon: 'success',
        duration: 2000
      })
    }else{
      wx.showModal({
        title: "添加新朋友",
        content:  "昵称：" + (e.detail.value.nickname || nickname),
        success: function(res) {
          if (res.confirm) {
            wx.request({
              url: 'https://www.hopee.xyz/new_friend',
              data: {token: wx.getStorageSync('token'), nickname: (e.detail.value.nickname || nickname), friend_id: friend_id},
              header:{"Content-Type":"application/json"},
              method: 'POST',
              success: function(res){
                if(res.data.id >= 0){
                  /*
                  var friendships = wx.getStorageSync('friendships') || []
                  friendships.unshift({id: res.data.id, nickname: (e.detail.value.name || nickname)})
                  wx.setStorageSync('friendships', friendships)
                  */
                  wx.showToast({
                    title: '成功添加好友',
                    icon: 'success',
                    duration: 2000
                  })
                  setTimeout(function(){wx.navigateBack()},2000);
                }else{
                  console.log('fail: request new_friend res')
                  console.log(res)
                  wx.showToast({
                    title: (res.data.msg || "服务器拒绝添加该好友"),
                    icon: 'loading',
                    duration: 2000
                  })
                }
              },
              fail: function() {
                // fail
                console.log('fail: request new_friend')
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
    if(scene == 1){
      scene = 0
      wx.redirectTo({url: '../index/index'})
    }else{
      wx.navigateBack()
    }
  }
})
