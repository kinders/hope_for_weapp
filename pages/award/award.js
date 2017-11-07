// pages/award/award.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var current_user = getApp().globalData.current_user;
    var candelete = false;
    var date = new Date(options.created_at);
    var today = new Date();
    if (current_user.id == options.user_id){ 
      candelete = true
    } else if (today - date < 259200000){
      candelete = true
    }
    var is_from_friend = options.is_from_friend
    this.setData({
      award: { id: options.id, content: options.content, user_id: options.user_id, user_nickname: options.user_nickname, sender_id: options.sender_id, nickname: options.sender_nickname, date: options.created_at.substr(0, 10), time: options.created_at.substr(11, 8)},
      current_user: current_user,
      candelete: candelete,
      is_from_friend: is_from_friend
    })
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 删除鼓励
   */
  deleteAward: function () {
    var that = this;
    var token = getApp().globalData.token;
    var award_id = this.data.award.id;
    wx.showModal({
      title: '警告',
      content: "确定将要拒绝这个鼓励？该操作将无法撤回！",
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://www.hopee.xyz/delete_award',
            data: { token: token, award_id: award_id },
            header: { "Content-Type": "application/json" },
            method: 'POST',
            success: function (res) {
              // success
              if (res.data.result_code == 't') {
                // 从缓存中删除这个鼓励
                if(that.data.is_from_friend == "true"){
                  var friend_awards = wx.getStorageSync('friend_awards') || []
                  var friend_award_index;
                  friend_awards.map(function (hash, index) {
                    if (hash.id == award_id) {
                      friend_award_index = index
                    }
                  })
                  friend_awards.splice(friend_award_index, 1)
                  wx.setStorageSync('friend_awards', friend_awards)
                  var friend_count = wx.getStorageSync('friend_count') || 0
                  friend_count = friend_count - 1
                  wx.setStorageSync('friend_count', friend_count)
                }else{
                  var awards = wx.getStorageSync('awards') || []
                  var award_index;
                  awards.map(function (hash, index) {
                    if (hash.id == award_id) {
                      award_index = index
                    }
                  })
                  awards.splice(award_index, 1)
                  wx.setStorageSync('awards', awards)
                  var count = wx.getStorageSync('count') || 0
                  count = count - 1
                  wx.setStorageSync('count', count)
                }
                wx.showToast({
                  title: "删除成功",
                  icon: 'success',
                  duration: 2000
                })
                wx.navigateBack()
              } else {
                wx.showToast({
                  title: "服务器无法拒绝这个鼓励，请您稍后再试",
                  icon: 'loading',
                  duration: 2000
                })
              }
            },
            fail: function () {
              // fail
            },
            complete: function () {
              // complete
            }
          })
        }
      }
    })
  }
})