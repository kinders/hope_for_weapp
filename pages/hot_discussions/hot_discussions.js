// pages/hot_discussions/hot_discussions.js
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
    // 到网站请求最新信息
    var that = this;
    var token = getApp().globalData.token;
    var current_user = getApp().globalData.current_user;
    wx.request({
      url: 'https://www.hopee.xyz/hot_discussions',
      data: { token: token },
      header: { "Content-Type": "application/json" },
      method: 'GET',
      success: function (res) {
        if (res.data.hot_discussions) {
          wx.setStorageSync('hot_discussions', res.data.hot_discussions)
          that.setData({
            hot_discussions: res.data.hot_discussions,
            hot_discussions_length: res.data.hot_discussions.length,
            current_user: current_user
          })
          // 生成可供筛选的选项
          var hot_discussions_user_ids = [];
          var hot_discussions_user_nicknames = [];
          var is_hidden = [];
          res.data.hot_discussions.map(function (hot_discussion) {
            if (hot_discussions_user_ids.indexOf(hot_discussion.user_id) == -1) {
              hot_discussions_user_ids = hot_discussions_user_ids.concat(hot_discussion.user_id)
            }
            if (hot_discussions_user_nicknames.indexOf(hot_discussion.nickname) == -1) {
              hot_discussions_user_nicknames = hot_discussions_user_nicknames.concat(hot_discussion.nickname)
            }
            is_hidden = is_hidden.concat("item")
          });
          var a = hot_discussions_user_nicknames.map(function (nickname, index) { return nickname.concat("^^+_-^^", index) })
          a.sort()
          var c = a.map(function (hash) { return hash.split('^^+_-^^')[0] })
          var b = a.map(function (hash) { return hot_discussions_user_ids[hash.split('^^+_-^^')[1]] })
          c.unshift("全部")
          b.unshift(0)
          that.setData({
            hot_discussions_user_ids: b,
            hot_discussions_user_nicknames: c,
            is_hidden: is_hidden
          })
        } else {
          console.log('fail: request helps res')
          console.log(res)
        }
      },
      fail: function () { console.log('fail: request helps') },
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

  bindPickerChange: function (e) {
    // 筛选留言
    var that = this;
    this.setData({
      index: e.detail.value
    })
    var is_hidden = [];
    var hot_discussions_length = 0;
    if (e.detail.value == 0) {
      (wx.getStorageSync('hot_discussions') || []).map(function (hot_discussion) {
        is_hidden = is_hidden.concat("item")
        hot_discussions_length = hot_discussions_length + 1
      })
    } else {
      (wx.getStorageSync('hot_discussions') || []).map(function (hot_discussion) {
        if (hot_discussion.user_id == that.data.hot_discussions_user_ids[e.detail.value]) {
          is_hidden = is_hidden.concat("item")
          hot_discussions_length = hot_discussions_length + 1
        } else {
          is_hidden = is_hidden.concat("hidden")
        }
      })
    }
    this.setData({
      is_hidden: is_hidden,
      hot_discussions_length: hot_discussions_length
    })
  }
})