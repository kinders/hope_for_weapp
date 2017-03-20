// pages/new_help_to_friend/new_help_to_friend.js
var friend_id;
var nickname;
var token = wx.getStorageSync('token');
var current_user = wx.getStorageSync('current_user');
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    friend_id = options.friend_id
    nickname = options.nickname
    var friend = "friend_" + friend_id
    this.setData({
      friend: {friend_id: friend_id, nickname: nickname},
      current_user_id: current_user.id
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
              url: 'https://test.com/new_help_to_friend',
              data: {token: token, friend_id: friend_id, content: content},
              method: 'POST',
              success: function(res){
                if(res.id >= 0){
                  // 将信息插入helps
                  var time = new Date()
                  var new_help = {id: res.id, content: e.detail.value.content, receiver: nickname, created_at: time}
                  helps = wx.getStorageSync('helps') || []
                  helps = helps.push(new_help)
                  wx.setStorage({
                    key: 'helps',
                    data: helps,
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
                    title: '成功提交请求',
                    icon: 'success',
                    duration: 2000
                  })
                }else{

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