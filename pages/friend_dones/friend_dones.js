// pages/friend_dones/friend_dones.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var friend_id = options.friend_id;
    var friend_nickname = options.nickname;
    var is_friendship = '';
    // 取出缓存信息
    (wx.getStorageSync("friendships") || []).map(function(friendship){
      if(friendship.friend_id == friend_id){
         is_friendship = 't'
      }
    })
    var d = new Date();
    var picker_end_day = d.toJSON().substring(0, 10); 
    this.setData({
      is_friendship: is_friendship,
      friend: {friend_id: friend_id, nickname: friend_nickname},
      picker_end_day: picker_end_day
    })
    wx.showModal({
      title: '提示',
      content: '为了节省您的流量，这里默认显示最近完成的50个任务。如需查看更多，请选择特定日期进行筛查。',
    })
    // 到网站请求最新信息
    var that = this;
    var token = getApp().globalData.token;
    var current_user = getApp().globalData.current_user;
    wx.request({
      url: 'https://www.hopee.xyz/friend_dones',
      data: { token: token, friend_id: friend_id },
      header:{"Content-Type":"application/json"},
      method: 'GET',
      success: function(res){
        if(res.data.friend_dones){
          wx.setStorageSync('friend_dones', res.data.friend_dones)
          that.setData({
            dones: res.data.friend_dones,
            dones_length: res.data.friend_dones.length,
            current_user: current_user
          })
        }else{
          console.log('fail: request friend_dones res')
          console.log(res)
        }
      },
      fail: function() {console.log('fail: request friend_dones')},
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
  bindStartDateChange: function(e){
    var end_picker_end_day = '';
    var end_date_value = new Date(e.detail.value).valueOf() + 864000000

    var end_date = new Date(end_date_value).toJSON().substring(0, 10);
    var today = new Date().toJSON().substring(0, 10)
    if (end_date > today){
      end_picker_end_day = today
    }else{
      end_picker_end_day = end_date
    }
    this.setData({
      start_date: e.detail.value,
      end_picker_begin_day: e.detail.value,
      end_picker_end_day: end_picker_end_day
    })
  },
  bindDateChange: function(e){
    var that=this; 
    var start_date = that.data.start_date;
    var end_date = e.detail.value;
    if (start_date == undefined ){
      start_date = end_date
    }
    if (start_date > end_date){
      end_date = start_date
    }
    that.setData({
      date: e.detail.value
    })
    var token = getApp().globalData.token;
    wx.request({
      url: 'https://www.hopee.xyz/friend_dones_in_date',
      data: { token: token, friend_id: that.data.friend.friend_id, date: end_date, start_date: start_date },
      method: 'GET',
      header: {"Content-Type":"application/json"},
      success: function(res){
         if(res.data.friend_dones){
          wx.setStorageSync('friend_dones', res.data.friend_dones)
          that.setData({
            dones: res.data.friend_dones,
            dones_length: res.data.friend_dones.length
          })
        }else{
          console.log('fail: request friend_dones in date res')
          console.log(res)
        }
      },
      fail: function(res) {console.log('fail: request friend_dones_in_date')},
      complete: function(res) {
        // complete
      }
    })

  },
  moreFun: function(){
    var that=this;
    var friend = that.data.friend;
    var nickname = friend.nickname;
    var sendto = "发送请求给： " + nickname;
    var is_friend = that.data.is_friendship;
    if(is_friend == 't'){
      wx.showActionSheet({
        itemList: [sendto, '未完成的任务', '未满意的请求', '修改昵称', '删除好友'],
        success: function(res){
          if(res.tapIndex == 0){
             wx.redirectTo({url: "../new_help_to_friend/new_help_to_friend?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname})
          }else if(res.tapIndex == 1){
            wx.redirectTo({
              url: "../friend/friend?friend_id=" + friend.friend_id + "&nickname=" + nickname
            })
          }else if(res.tapIndex == 2){
            wx.redirectTo({url: "../friend_helps/friend_helps?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname})
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
        itemList: [sendto, '未完成的任务', '未满意的请求', '加为好友'],
        success: function(res){
          if(res.tapIndex == 0){
             wx.redirectTo({url: "../new_help_to_friend/new_help_to_friend?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname})
          }else if(res.tapIndex == 1){
            wx.navigateTo({
              url: "../friend/friend?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname
            })
          }else if(res.tapIndex == 2){
            wx.redirectTo({url: "../friend_helps/friend_helps?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname})
          }else if(res.tapIndex == 3){
             wx.redirectTo({url: "../new_friend/new_friend?friend_id=" + friend.friend_id + "&nickname=" + friend.nickname})
          }
        }
      })
    }
  },
})
