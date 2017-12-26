// pages/friends/friends.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 到网站请求最新信息
    var token = getApp().globalData.token;
    var current_user = getApp().globalData.current_user;
    var that = this;
    if (getApp().globalData.need_update_friends == true){
    wx.request({
      url: 'https://www.hopee.xyz/friends',
      data: { token: token },
      header:{"Content-Type":"application/json"},
      method: 'GET',
      success: function(res){
        if(res.data.friendships){
          getApp().globalData.need_update_friends = false
          var f = res.data.friendships;
          if (f.length < 3){
            wx.showModal({
              title: '提示',
              content: '朋友太少？点击右上角的“更多”，选择“添加朋友”！还可以点击右上角的三点，转发卡片，来增加准朋友。'
            })
          }
          var a = f.map(function(hash, index){return hash.nickname.concat("^^+_-^^", index)})
	        a.sort()
        	var friendships = a.map(function(hash){return f[hash.split('^^+_-^^')[1]]})
          friendships.unshift({friend_id: current_user.id.toString(), nickname: current_user.nickname})
          wx.setStorageSync('friendships', friendships)
          that.setData({
            current_user_id: current_user.id,
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
    } else { 
      //console.log('friends from storage')
      var friendships = wx.getStorageSync('friendships');
      that.setData({
        current_user_id: current_user.id,
        friendships: friendships || [],
        friendships_length: friendships.length || 0
      })
    }
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  showActionSheet:function(event){
    var that = this;
    var token = getApp().globalData.token;
    var current_user = getApp().globalData.current_user;
    var friend_id = event.currentTarget.dataset.friend_id;
    var nickname = event.currentTarget.dataset.nickname;
    var sendto = '发送请求给：' + nickname;
    if(current_user.id == friend_id){
      wx.showActionSheet({
        itemList: ['给自己一个请求', '更改昵称', '已完成的任务', '查看鼓励'],
        success: function(res) {
          if(res.tapIndex == 0){
            wx.navigateTo({
              url: "../new_help_to_friend/new_help_to_friend?friend_id=" + current_user.id + "&nickname=" + current_user.nickname
            })
          }else if(res.tapIndex == 1){
          wx.navigateTo({
            url: "../new_nickname/new_nickname?friend_id=" + current_user.id + "&nickname=" + current_user.nickname
          })
          } else if (res.tapIndex == 2) {
            wx.navigateTo({
              url: "../friend_dones/friend_dones?friend_id=" + friend_id + "&nickname=" + nickname
            })
          } else if (res.tapIndex == 3) {
            wx.navigateTo({
              url: "../awards/awards"
            })
          }
        },
        fail: function(res) {}
      })
    }else{
    wx.showActionSheet({
      itemList: [sendto, '未完成的任务', '未满意的请求', '鼓励好友', '修改昵称', '删除好友'],
      success: function(res) {
        if(res.tapIndex == 0){
          wx.navigateTo({
            url: "../new_help_to_friend/new_help_to_friend?friend_id=" + friend_id + "&nickname=" + nickname
          })
        } else if(res.tapIndex == 1){
            wx.navigateTo({
              url: "../friend/friend?friend_id=" + friend_id + "&nickname=" + nickname
            })
        }else if(res.tapIndex == 2){
            wx.navigateTo({
              url: "../friend_helps/friend_helps?friend_id=" + friend_id + "&nickname=" + nickname
            })
        }else  if(res.tapIndex == 3){
            wx.navigateTo({
              url: "../friend_awards/friend_awards?friend_id= " + friend_id + "&friend_nickname=" + nickname
            })
        }else if(res.tapIndex == 4){
          wx.navigateTo({
            url: "../new_nickname/new_nickname?friend_id=" + friend_id + "&nickname=" + nickname
          })
        }else if(res.tapIndex == 5){
          wx.showModal({
            title: '警告',
            content: "确定将要删除好友 " + nickname + " ？",
            success: function(res) {
              if (res.confirm) {
                wx.request({
                  url: 'https://www.hopee.xyz/delete_friend',
                  data: {token: token, friend_id: friend_id},
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
      },
      fail: function(res) {}
    })
    }
  },
  moreFun: function(){
    wx.showActionSheet({
      itemList: ['添加朋友', '新建小组','发给多个朋友', '添加虚拟用户', '搜索'],
      success: function(res){
        if(res.tapIndex == 0){
          wx.redirectTo({url: '../strangers/strangers'})
        }else if (res.tapIndex == 1){
          wx.navigateTo({url: '../new_group/new_group'})
        }else if (res.tapIndex == 2){
          wx.navigateTo({url: '../new_help_to_friends/new_help_to_friends'})
        }else if (res.tapIndex == 3){
          wx.navigateTo({url: "../new_friend/new_friend?is_fiction=1&nickname=虚拟用户"})
        } else if (res.tapIndex == 4) {
          wx.navigateTo({ url: "../search/search" })
        }
      }
    })
  },
  onShareAppMessage: function () {
    var current_user = getApp().globalData.current_user
    return {
      title: '加我吧，朋友，我需要您的协作',
      path: "/pages/new_friend/new_friend?friend_id=" + current_user.id + "&nickname=" + current_user.nickname
    }
  }
})
