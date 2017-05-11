// pages/new_friend/new_friend.js
var nickname;
var friend_id;
var scene=0;
Page({
  data:{},
  onLoad:function(options){
    // 分享界面登录,添加朋友页面允许无需检查服务时限
    var token = getApp().globalData.token;
    if (token ==  undefined  || token == '' ){
      getApp().getUserInfo()
      scene = 1
    }
    // 页面初始化 options为页面跳转所带来的参数
    friend_id = options.friend_id
    nickname = options.nickname
    var is_fiction = options.is_fiction
    this.setData({
      friend_nickname: nickname,
      is_fiction: is_fiction
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
    var that=this;
    var token = getApp().globalData.token;
    var current_user = getApp().globalData.current_user;
    if (token == undefined || token == '' ){
      wx.showToast({
        title: '网络繁忙，请稍等几秒',
        icon: 'success',
        duration: 2000
      })
    }else if (friend_id == current_user.id){
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
              data: {token: token, nickname: (e.detail.value.nickname || nickname), friend_id: friend_id, is_fiction: that.data.is_fiction},
              header:{"Content-Type":"application/json"},
              method: 'POST',
              success: function(res){
                if(res.data.id >= 0){
                  getApp().globalData.need_update_friends = true
                  wx.showToast({
                    title: '成功添加好友',
                    icon: 'success',
                    duration: 2000
                  })
                  // 如果当前用户昵称为数字，则要求修改昵称，否则返回
                  var is_num = /^\d+$/
                  var current_user = getApp().globalData.current_user
                  setTimeout(function(){
                    if (is_num.test(current_user.nickname)) {
                      wx.redirectTo({url: '../new_nickname/new_nickname?friend_id=' + current_user.id + '&nickname=' + current_user.nickname})
                    } else {
                      wx.navigateBack()
                    }
                  },2000);
                }else{
                  console.log('fail: request new_friend res')
                  console.log(res)
                  wx.showToast({
                    title: "服务器无法添加该好友",
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
