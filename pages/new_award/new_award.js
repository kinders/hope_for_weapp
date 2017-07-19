// pages/new_award/new_award.js
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
    this.setData({
      friend: { friend_id: options.friend_id, nickname: options.nickname },
      current_user_id: current_user.id
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
   * 用户提交鼓励
   */
  formSubmit: function (e) {
    var that = this;
    if (e.detail.value.content.replace(/\s/g,  "")
      == "") {
      wx.showToast({
        title: '不能提交空白的励志辞',
        icon: 'loading',
        duration: 2000
      })
    } else {
      wx.showModal({
        title: "鼓励 " + that.data.friend.nickname + " ：",
        content: e.detail.value.content,
        success: function (res) {
          if (res.confirm) {
            var token = getApp().globalData.token;
            wx.request({
              url: 'https://www.hopee.xyz/new_award',
              data: { token: token, receiver_id: that.data.friend.friend_id, content: e.detail.value.content },
              header: { "Content-Type": "application/json" },
              method: 'POST',
              success: function (res) {
                //console.log(res)
                if (res.data.id >= 0) {
                  wx.showToast({
                    title: '成功发送鼓励',
                    icon: 'success',
                    duration: 2000
                  })
                  that.setData({ empty: null })
                } else {
                  console.log('fail: request new_award res')
                  console.log(res)
                  wx.showToast({
                    title: '服务器无法发送这个鼓励',
                    icon: 'loading',
                    duration: 2000
                  })
                }
              },
              fail: function () {
                // fail
                console.log('fail: request new_award')
                wx.showToast({
                  title: '请求失败，请先检查网络，稍后发送。',
                  icon: 'loading',
                  duration: 2000
                })
              },
              complete: function () {
                // complete
              }
            })
          }
        }
      })
    }
  }
})