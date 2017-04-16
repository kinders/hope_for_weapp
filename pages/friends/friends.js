// pages/friends/friends.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // 取出缓存信息
    this.setData({current_user_id: wx.getStorageSync('current_user').id})
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 到网站请求最新信息
    var that = this
    wx.request({
      url: 'https://www.hopee.xyz/friends',
      data: { token: wx.getStorageSync('token') },
      header:{"Content-Type":"application/json"},
      method: 'GET',
      success: function(res){
        if(res.data.friendships){
          var friendships = res.data.friendships;
          var a = friendships.map(function(hash){return hash.nickname.concat("^", hash.friend_id)})
	        a.sort()
        	friendships = a.map(function(hash){return {"friend_id": hash.split('^')[1], "nickname": hash.split('^')[0]}})
          var current_user = wx.getStorageSync('current_user')
          friendships.unshift({friend_id: current_user.id.toString(), nickname: current_user.nickname})
          wx.setStorageSync('friendships', friendships)
          that.setData({
            friendships: friendships || [],
            friendships_length: friendships.length || 0
          })
        }else{
          console.log('fail: request friends res')
          console.log(res)
        }
      },
      fail: function() {console.log('fail: request friend')},
      complete: function() {}
    })
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  showActionSheet:function(event){
    var that = this;
    var friend_id = event.currentTarget.dataset.friend_id;
    var nickname = event.currentTarget.dataset.nickname;
    var ftodos = nickname.concat("的任务")
    var fhelps = nickname.concat("的请求")
    wx.showActionSheet({
      itemList: ['发送请求', ftodos, fhelps, '修改昵称', '删除好友'],
      success: function(res) {
        if(res.tapIndex == 0){
          wx.navigateTo({
            url: "../new_help_to_friend/new_help_to_friend?friend_id=" + friend_id + "&nickname=" + nickname
          })
        } else if(res.tapIndex == 1){
          if(friend_id == wx.getStorageSync('current_user').id){
            wx.switchTab({ url: '../todos/todos' })
          }else{
            wx.navigateTo({
              url: "../friend/friend?friend_id=" + friend_id + "&nickname=" + nickname
            })
          }
        }else if(res.tapIndex == 2){
          if(friend_id == wx.getStorageSync('current_user').id){
            wx.switchTab({ url: '../helps/helps' })
          }else{
            wx.navigateTo({
              url: "../friend_helps/friend_helps?friend_id=" + friend_id + "&nickname=" + nickname
            })
          }
        }else if(res.tapIndex == 3){
          wx.navigateTo({
            url: "../new_nickname/new_nickname?friend_id=" + friend_id + "&nickname=" + nickname
          })
        }else if(res.tapIndex == 4){
          if(friend_id == wx.getStorageSync('current_user').id){
            wx.showToast({
              title: '无法删除自己',
              icon: 'loading',
              time: 2000
            })
          }else{
          wx.showModal({
            title: '警告',
            content: "确定将要删除好友 " + nickname + " ？",
            success: function(res) {
              if (res.confirm) {
                wx.request({
                  url: 'https://www.hopee.xyz/delete_friend',
                  data: {token: wx.getStorageSync('token'), friend_id: friend_id},
                  header:{"Content-Type":"application/json"},
                  method: 'POST',
                  success: function(res){
                    // success
                    if(res.data.result_code == 't'){
                      // 将好友从缓存中删除
                      var friendships = wx.getStorageSync('friendships') || []
                      var friendship_index;
                      friendships.map(function(hash, index){
                        if(hash.friend_id == friend_id){
                          friendship_index = index
                        }
                      })
                      friendships.splice(friendship_index, 1)
                      wx.setStorageSync('friendships', friendships)
                      that.setData({
                        friendships: friendships || [],
                        friendships_length: friendships.length || 0
                      })
                      wx.showToast({
                        title: "成功将好友" + nickname + "删去",
                        icon: 'success',
                        duration: 2000
                      })
                    }else{
                      wx.showToast({
                        title: "服务器无法删除好友" + nickname,
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
      },
      fail: function(res) {}
    })
  },
  moreFun: function(){
    wx.showActionSheet({
      itemList: ['添加朋友', '新建群组','临时群发'],
      success: function(res){
        if(res.tapIndex == 0){
          wx.redirectTo({url: '../strangers/strangers'})
        }else if (res.tapIndex == 1){
          console.log('navigate to new group')
          wx.navigateTo({url: '../new_group/new_group'})
        }else if (res.tapIndex == 2){
          wx.navigateTo({url: '../new_help_to_friends/new_help_to_friends'})
        }
      }
    })
  }
})