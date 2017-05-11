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
    var current_user = getApp().globalData.current_user
    if (friend_id == current_user.id){
      wx.showToast({
        title: '下面将为自己设置昵称',
        icon: 'loading',
        duration: 5000
      })
    }
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
    var token = getApp().globalData.token;
    var current_user = getApp().globalData.current_user;
    var is_num = /^\d+$/;
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
    }else if(is_num.test(e.detail.value.name)){
      wx.showToast({
        title: '昵称不能是纯数字',
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
              data: {token: token, nickname: e.detail.value.name, friend_id: friend_id},
              header:{"Content-Type":"application/json"},
              method: 'POST',
              success: function(res){
                //console.log('new_nickname res')
                //console.log(res)
                if(res.data.result_code == 't'){
                  getApp().globalData.need_update_friends = true
                  //* 将缓存里面原来的名称更改为新的名称。
                  // 如果是自己
                  if(friend_id == current_user.id){
                    getApp().globalData.current_user.nickname = e.detail.value.name 
                    //var me = {id: wx.getStorageSync('current_user').id, nickname: e.detail.value.name, end_time: wx.getStorageSync('current_user').end_time}
                    //wx.setStorageSync('current_user', me)
                  }else{
                 // 如果是朋友
                  var friendships = wx.getStorageSync('friendships') || [];
                  var friendship_index;
                  friendships.forEach(function(item, index){
                    if(item.friend_id == friend_id){
                      friend_id = index
                    }
                  })
                  friendships.splice(friendship_index, 1, {friend_id: friend_id, nickname: e.detail.value.name})
                  wx.setStorageSync('friendships', friendships)
                  }
                  //*/
                  getApp().globalData.need_update_helps = true
                  wx.showToast({
                    title: '成功修改昵称',
                    icon: 'success',
                    duration: 2000
                  })
                  setTimeout(function(){
                    wx.navigateBack()
                  },2000);
                }else{
                  console.log('fail: request new_nickname res')
                  console.log(res)
                  wx.showToast({
                    title: "服务器无法修改昵称",
                    icon: 'loading',
                    duration: 2000
                  })
                }
              },
              fail: function() {
                // fail
                console.log('fail: request new_nickname')
                wx.showToast({
                  title: '请求失败，请先检查网络，稍后修改。',
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
