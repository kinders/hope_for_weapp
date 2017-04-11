// pages/friend_helps/friend_helps.js
var friend_id;
var friend_helps_receiver_ids = [0];
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    friend_id = options.friend_id;
    var friend_nickname = options.nickname;
    var friend_helps = "friend_" + friend_id +"_helps";
    var friend = "friend_" + friend_id;
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
      current_user_id: wx.getStorageSync('current_user').id
    })
    // 到网站请求最新信息
    var that = this
    wx.request({
      url: 'https://www.hopee.xyz/friend_helps',
      data: { token: wx.getStorageSync('token'), friend_id: friend_id },
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
    var is_friend = that.data.is_friendship;
    if(is_friend == 't'){
      wx.showActionSheet({
        itemList: ['查看任务', '发送请求', '修改昵称', '删除好友'],
        success: function(res){
          if(res.tapIndex == 0){
            wx.redirectTo({url: "../friend/friend?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname})
          }else if(res.tapIndex == 1){
             wx.redirectTo({url: "../new_help_to_friend/new_help_to_friend?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname})
          }else if(res.tapIndex == 2){
             wx.redirectTo({url: "../new_nickname/new_nickname?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname })
          }else if(res.tapIndex == 3){
            wx.showModal({
            title: '警告',
            content: "确定将要删除好友 " + friend.nickname + " ？",
            success: function(res) {
              if (res.confirm) {
                wx.request({
                  url: 'https://www.hopee.xyz/delete_friend',
                  data: {token: wx.getStorageSync('token'), friend_id: friend.friend_id},
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
        itemList: ['查看任务', '发送请求', '加为好友'],
        success: function(res){
          if(res.tapIndex == 0){
            wx.redirectTo({url: "../friend/friend?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname})
          }else if(res.tapIndex == 1){
             wx.redirectTo({url: "../new_help_to_friend/new_help_to_friend?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname})
          }else if(res.tapIndex == 2){
             wx.redirectTo({url: "../new_friend/new_friend?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname})
          }
        }
      })
    }
  }
})
