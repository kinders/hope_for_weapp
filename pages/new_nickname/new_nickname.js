// pages/new_nickname/new_nickname.js
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
    if(e.detail.value.name.replace(/\s*/, "") == ""){
      wx.showToast({
        title: '昵称不能为空',
        icon: 'loading',
        duration: 2000
      })
    }else if(e.detail.value.name == nickname){
      wx.showToast({
        title: '昵称没有变化',
        icon: 'loading',
        duration: 2000
      })
    }else{
      wx.showModal({
        title: "改为新昵称",
        content:  e.detail.value.name,
        success: function(res) {
          if (res.confirm) {
            wx.request({
              url: 'https://www.hopee.xyz/new_nickname',
              data: {token: wx.getStorageSync('token'), nickname: e.detail.value.name, friend_id: friend_id},
              method: 'POST',
              success: function(res){
                if(res.result_code == 't'){
                  // 将缓存里面原来的名称更改为新的名称。
                  // 如果是朋友
                  friendships = wx.getStorageSync('friendships') || []
                  friendship_index = friendships.indexOf({friend_id: friend_id, nickname: nickname})
                  friendships = friendships.splice(friendship_index, 1, {friend_id: friend_id, nickname: e.detail.value.name})
                  wx.setStorage({
                    key: 'friendships',
                    data: friendships,
                  })      
                  // 如果是自己，还需要更改全局数据
                  if(friend_id == wx.getStorageSync('current_user').id){
                    var me = {id: getStorageSync('current_user').id, nickname: e.detail.value.name, end_time: getStorageSync('current_user').end_time}
                    wx.setStorageSync('current_user', me).nickname = e.detail.value.name
                  }         
                  wx.showToast({
                    title: '成功修改昵称',
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
    }  
  },
  formReset: function(){
    wx.navigateBack()
  }
})
