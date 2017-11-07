// pages/awards/awards.js
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
    var that = this;
    var token = getApp().globalData.token;
    // 页面初始化 options为页面跳转所带来的参数
    var friend_nickname = options.friend_nickname;
    var friend_id = options.friend_id;
    wx.request({
      url: 'https://www.hopee.xyz/friend_awards',
      data: { token: token, friend_id: friend_id },
      header: { "Content-Type": "application/json" },
      method: 'GET',
      success: function (res) {
        //console.log(res)
        if (res.data.awards) {
          wx.setStorageSync('friend_awards', res.data.awards)
          wx.setStorageSync('friend_count', res.data.count)
          that.setData({
            awards: res.data.awards,
            count: res.data.count,
            current_user: getApp().globalData.current_user,
            friend_nickname: friend_nickname,
            friend_id: friend_id
          })
        } else {
          console.log('fail: request friend_awards res')
          console.log(res)
        }
      },
      fail: function () { console.log('fail: request friend_awards') },
      complete: function () { }
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
    var that = this;
    that.setData({
      awards: wx.getStorageSync('friend_awards'),
      count: wx.getStorageSync('friend_count'),
      current_user: getApp().globalData.current_user,
      friend_nickname: this.data.friend_nickname,
      friend_id: this.data.friend_id
    })
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

  }
})