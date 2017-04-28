// pages/friend_helps/friend_helps.js
var friend_id;
var friend_helps_receiver_ids = [0];
Page({
  data:{},
  onLoad:function(options){
    // 从分享界面登录
    var that = this;
    var token = getApp().globalData.token
    if (token == ''){
      that.relogin()
    }
    // 页面初始化 options为页面跳转所带来的参数
    friend_id = options.friend_id;
    var friend_nickname = options.nickname;
    var is_friendship = '';
    // 取出缓存信息
    (wx.getStorageSync("friendships") || []).map(function(friendship){
      if(friendship.friend_id == friend_id){
         is_friendship = 't'
      }
    })
    this.setData({
      is_friendship: is_friendship,
      friend: {friend_id: friend_id, nickname: friend_nickname},
      current_user_id: getApp().globalData.current_user.id
    })
  },
  relogin:function(){
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: 'https://www.hopee.xyz/login',
              data: { js_code: res.code },
              header:{"Content-Type":"application/json"},
              method: 'POST',
              success: function(res){
                //console.log(res)
                if(res.data.result_code == "t"){
                  getApp().globalData.token = res.data.token
                  getApp().globalData.current_user = res.data.current_user
                }else{
                  wx.navigateTo({url: '../index/index'})
                }
              }
            })
          }
        }
      })
  },
  getInfo:function(){
    // 到网站请求最新信息
    var that = this;
    var friend_id = that.data.friend.friend_id
    var friend_helps = "friend_" + friend_id +"_helps";
    var friend = "friend_" + friend_id;
    var friend_helps_receiver_ids = [0];
    var token = getApp().globalData.token;
    wx.request({
      url: 'https://www.hopee.xyz/friend_helps',
      data: { token: token, friend_id: friend_id},
      header:{"Content-Type":"application/json"},
      method: 'GET',
      success: function(res){
        // 取得信息之后：缓存信息
        if(res.data.friend_helps){
          wx.setStorageSync(friend_helps, res.data.friend_helps)
          that.setData({
            friend_helps: res.data.friend_helps,
            friend_helps_length: res.data.friend_helps.length,
          })
          // 生成可供筛选的选项
          var friend_helps_receiver_nicknames = ["全部"];
          var is_hidden = [];
          (res.data.friend_helps|| []).map(function(help){
            if (friend_helps_receiver_ids.indexOf(help.receiver_id) == -1 ){
              friend_helps_receiver_ids = friend_helps_receiver_ids.concat(help.receiver_id)
            }
            if (friend_helps_receiver_nicknames.indexOf(help.nickname) == -1){
              friend_helps_receiver_nicknames = friend_helps_receiver_nicknames.concat(help.nickname)
            }
            is_hidden = is_hidden.concat("item")
          });
          that.setData({
            friend_helps_receiver_ids: friend_helps_receiver_ids,
            friend_helps_receiver_nicknames: friend_helps_receiver_nicknames,
            is_hidden: is_hidden
          })
        }else{
          console.log('fail: request friend_helps res')
          console.log(res) 
        }
      },
      fail: function() {console.log('fail: request friend_helps')},
      complete: function() {}
    })
  },
  onReady:function(){
    // 页面渲染完成
    this.getInfo()
  },
  onShow:function(){
    // 页面显示
    var that = this;
    var token = getApp().globalData.token;
    if (token == ''){
      wx.showToast({
        title: '正在载入...',
        icon: 'loading',
        duration: 3000
      })
      setTimeout(function(){that.getInfo()}, 3000)
    } else {
      that.getInfo()
    }
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
    //console.log(e.detail.value)
    var is_hidden = [];
    var friend_helps = "friend_" + friend_id +"_helps"
    var friend_helps_length = 0
    if (e.detail.value == 0){
      (wx.getStorageSync(friend_helps) || []).map(function(help){
        is_hidden = is_hidden.concat("item")
        friend_helps_length = friend_helps_length + 1
      })
    }else{
      (wx.getStorageSync(friend_helps) || []).map(function(help){
        if(help.receiver_id == friend_helps_receiver_ids[e.detail.value]){
          is_hidden = is_hidden.concat("item")
          friend_helps_length = friend_helps_length + 1
        }else{
          is_hidden = is_hidden.concat("hidden")
        }
      })
    }
    this.setData({
      is_hidden: is_hidden,
      friend_helps_length: friend_helps_length
    })
  },
  moreFun: function(){
    var that=this;
    var friend = that.data.friend;
    var nickname = friend.nickname;
    var sendto = '发送请求给：' + nickname;
    var is_friend = that.data.is_friendship;
    if(is_friend == 't'){
      wx.showActionSheet({
        itemList: [sendto, '未完任务', '已完任务', '修改昵称', '删除好友'],
        success: function(res){
          if(res.tapIndex == 0){
             wx.redirectTo({url: "../new_help_to_friend/new_help_to_friend?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname})
          }else if(res.tapIndex == 1){
            wx.redirectTo({url: "../friend/friend?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname})
          }else if(res.tapIndex == 2){
            wx.redirectTo({
              url: "../friend_dones/friend_dones?friend_id=" + friend_id + "&nickname=" + nickname
            })
          }else if(res.tapIndex == 3){
             wx.redirectTo({url: "../new_nickname/new_nickname?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname })
          }else if(res.tapIndex == 4){
            wx.showModal({
            title: '警告',
            content: "确定将要删除好友 " + friend.nickname + " ？",
            success: function(res) {
              if (res.confirm) {
                wx.request({
                  url: 'https://www.hopee.xyz/delete_friend',
                  data: {token: getApp().globalData.token, friend_id: friend.friend_id},
                  header:{"Content-Type":"application/json"},
                  method: 'POST',
                  success: function(res){
                    // success
                    if(res.data.result_code == 't'){
                      wx.showToast({
                        title: "成功将好友" + friend.nickname + "删去",
                        icon: 'success',
                        duration: 2000
                      })
                      setTimeout(function(){wx.navigateBack()},2000);
                    }else{
                      wx.showToast({
                        title: "服务器无法删除好友" + friend.nickname,
                        icon: 'loading',
                        duration: 2000
                      })
                    }
                  },
                  fail: function() {
                    // fail
                  },
                  complete: function() {
                    // complete
                  }
                })
              }
            }
          })
          }
        }
      })
    }else{
      wx.showActionSheet({
        itemList: [sendto, '未完任务', '已完任务', '加为好友'],
        success: function(res){
          if(res.tapIndex == 0){
             wx.redirectTo({url: "../new_help_to_friend/new_help_to_friend?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname})
          }else if(res.tapIndex == 1){
            wx.redirectTo({url: "../friend/friend?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname})
          }else if(res.tapIndex == 2){
            wx.redirectTo({
              url: "../friend_dones/friend_dones?friend_id=" + friend_id + "&nickname=" + nickname
            })
          }else if(res.tapIndex == 3){
             wx.redirectTo({url: "../new_friend/new_friend?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname})
          }
        }
      })
    }
  },
  onShareAppMessage: function () {
    var that=this;
    var friend = that.data.friend;
    return {
      title: '嗨，我要向您推荐这个朋友……',
      path: "/pages/friend_helps/friend_helps?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname
    }
  }
})
