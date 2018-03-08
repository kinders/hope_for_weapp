// pages/add_friends_to_grouptodo/add_friends_to_grouptodo.js
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
    // 页面初始化 options为页面跳转所带来的参数
    var group_id = options.group_id
    var name = options.name
    var time = options.time
    var content = options.content
    var grouptodo_id = options.id
    var is_finish = options.is_finish
    var helps_in_grouptodo = "helps_in_grouptodo_" + grouptodo_id
    var group = "group_" + group_id;
    var grouptodo_members = wx.getStorageSync(helps_in_grouptodo);
    var g_m_id = grouptodo_members.map(function (hash) { return hash.receiver_id })
    //console.log(g_m_id)
    var friends = wx.getStorageSync('friendships');
    var others = [];
    others = friends.filter(function (hash) {
      return g_m_id.indexOf(hash.friend_id) == -1
    })
    this.setData({
      group: { group_id: group_id, name: name },
      grouptodo: { id: grouptodo_id, time: time, content: content, is_finish: is_finish },
      current_user: current_user,
      others: others
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

  formSubmit: function (e) {
    var that = this;
    if (e.detail.value.checkbox.length < 1) {
      wx.showToast({
        title: '没有选择成员',
        icon: 'loading',
        duration: 1000
      })
    } else {
      wx.showModal({
        title: "添加成员",
        content: e.detail.value.checkbox.length.toString() + '人',
        success: function (res) {
          if (res.confirm) {
            var token = getApp().globalData.token;
            wx.request({
              url: 'https://www.hopee.xyz/add_friends_to_grouptodo',
              data: { token: token, friends_id: e.detail.value.checkbox, grouptodo_id: that.data.grouptodo.id },
              header: { "Content-Type": "application/json" },
              method: 'POST',
              success: function (res) {
                if (res.data.result_code == 't') {
                  wx.showToast({
                    title: '成功添加成员',
                    icon: 'success',
                    duration: 2000
                  })
                  setTimeout(function () { wx.navigateBack() }, 2000);
                } else {
                  console.log('fail: request new_member res')
                  console.log(res)
                  wx.showToast({
                    title: "服务器无法添加",
                    icon: 'loading',
                    duration: 2000
                  })
                }
              },
              fail: function () {
                // fail
                console.log('fail: request new_member')
                wx.showToast({
                  title: '请求失败，请先检查网络，稍后提交修改。',
                  icon: 'loading',
                  duration: 2000
                })
              },
              complete: function () { }
            })
          }
        }
      })
    }
  }
})