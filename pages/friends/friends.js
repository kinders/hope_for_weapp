// pages/friends/friends.js
var token = wx.getStorageSync('token');
var current_user = wx.getStorageSync('current_user');
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // 取出缓存信息
    this.setData({
      friendships: (wx.getStorageSync('friendships') || []),
      friendships_length: (wx.getStorageSync('friendships') || []).length,
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
  showActionSheet:function(event){
    var friend_id = event.currentTarget.dataset.friend_id
    var nickname = event.currentTarget.dataset.nickname
    wx.showActionSheet({
      itemList: ['好友详情', '发送请求', '修改昵称', '删除好友'],
      success: function(res) {
        if(res.tapIndex == 0){
          if(friend_id == current_user.id){
            wx.switchTab({ url: '../todos/todos' })
          }else{
            wx.navigateTo({
              url: "../friend/friend?friend_id=" + friend_id + "&nickname=" + nickname
            })
          }
        }
        if(res.tapIndex == 1){
          wx.navigateTo({
            url: "../new_help_to_friend/new_help_to_friend?friend_id=" + friend_id + "&nickname=" + nickname
          })
        }
        if(res.tapIndex == 2){
          wx.navigateTo({
            url: "../new_nickname/new_nickname?friend_id=" + friend_id + "&nickname=" + nickname
          })
        }
        if(res.tapIndex == 3){
          if(friend_id == current_user.id){
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
                  data: {token: token, friend_id: friend_id},
                  method: 'POST',
                  success: function(res){
                    // success
                    if(res.result_code == 't'){
                      // 将好友从缓存中删除
                      friendships = wx.getStorageSync('friendships') || []
                      friendship_index = friendships.indexOf({friend_id: friend_id, nickname: nickname})
                      friendships = friendships.splice(friendship_index, 1)
                      wx.setStoragesync('friendships', friendships)
                      wx.showToast({
                        title: "成功将好友{{nickname}}删去",
                        icon: 'success',
                        duration: 2000
                      })
                    }else{
                      wx.showToast({
                        title: "无法删除好友{{nickname}}",
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
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  }
})