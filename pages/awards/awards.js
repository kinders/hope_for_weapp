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
    //调用应用实例的方法获取全局数据
    getApp().getUserInfo(function (userInfo) {
      //取出用户
      that.setData({
        userInfo: userInfo
      })
    })
    var current_user = getApp().globalData.current_user;
    var token = getApp().globalData.token;
    wx.request({
      url: 'https://www.hopee.xyz/awards',
      data: { token: token },
      header: { "Content-Type": "application/json" },
      method: 'GET',
      success: function (res) {
        //console.log(res)
        if (res.data.awards) {
          wx.setStorageSync('awards', res.data.awards)
          wx.setStorageSync('count', res.data.count)
          wx.setStorageSync('count_finished', res.data.count_finished)
          wx.setStorageSync('count_unfinish', res.data.count_unfinish)
          that.setData({
            count_finished: res.data.count_finished,
            count_unfinish: res.data.count_unfinish,
            awards: res.data.awards,
            count: res.data.count,
            current_user: current_user
          })
        } else {
          console.log('fail: request awards res')
          console.log(res)
        }
      },
      fail: function () { console.log('fail: request awards') },
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
    this.setData({
      awards: wx.getStorageSync('awards'),
      count: wx.getStorageSync('count'),
      count_unfinish: wx.getStorageSync('count_unfinish'),
      count_finished: wx.getStorageSync('count_finished')
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