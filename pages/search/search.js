// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_directions: ["满意的请求", "未满意的请求", "完成的任务","未完成的任务"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showModal({
      title: '提示',
      content: '因为小程序内存限制，每次搜索最多只显示100个结果。'
    })

    var friendships = wx.getStorageSync('friendships');
    var search_user_nicknames = friendships.map(function (hash) { return hash.nickname });
    this.setData({
      search_user_nicknames: search_user_nicknames,
      start_picker_end_day: new Date().toJSON().substring(0, 10),
      end_picker_end_day: new Date().toJSON().substring(0, 10)
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

  UserPick: function (e){
    var friendships = wx.getStorageSync('friendships');
    var search_user_ids = friendships.map(function (hash) { return hash.friend_id });
    this.setData({
      user_index: e.detail.value,
      search_user: search_user_ids[e.detail.value]
    })
  },

  DirectionPick: function (e) {
    this.setData({
      direction_index: e.detail.value,
      search_direction: e.detail.value
    })
  },

  StartDateChange: function (e) {
    this.setData({
      start_date: e.detail.value,
      end_picker_begin_day: e.detail.value,
    })
  },

  EndDateChange: function (e) {
    this.setData({
      end_date: e.detail.value
    })
  },

  SearchInput: function (e) {
    this.setData({
      searchword: e.detail.value
    })
  },

  StartSearch: function () {
    var that = this;
    if (that.data.search_user == undefined){
      wx.showToast({
        title: '请选择一个用户'
      })
    } else if (that.data.search_direction == undefined){
      wx.showToast({
        title: '请选择一个范围'
      })
    } else if (that.data.start_date == undefined) {
      wx.showToast({
        title: '请选择一个开始日期'
      })
    } else if (that.data.end_date == undefined) {
      wx.showToast({
        title: '请选择一个结束日期'
      })
    } else if (that.data.searchword == undefined) {
      wx.showToast({
        title: '请输入一个要搜索的词语'
      })
    } else if (that.data.searchword.replace(/\s/g, "") == "") {
      wx.showToast({
        title: '请输入一个要搜索的词语',
        icon: 'loading',
        duration: 2000
      })
    } else {
      wx.showModal({
        title: '搜索内容',
        content: that.data.searchword,
        success: function (res) {
          var token = getApp().globalData.token;
          if (res.confirm) {
            wx.request({
              url: 'https://www.hopee.xyz/search_todos',
              data: { 
                token: token, 
                user_id: that.data.search_user, 
                scope: that.data.search_direction,
                start_date: that.data.start_date,
                end_date: that.data.end_date,
                searchword: that.data.searchword
              },
              header: { "Content-Type": "application/json" },
              method: 'POST',
              success: function (res) {
                //console.log(res)
                if (res.data.todos) {
                  var todos = res.data.todos
                  that.setData({
                    todos: todos,
                    current_user: getApp().globalData.current_user
                  })
                  if (todos.length == 0) {
                    wx.showToast({
                      title: '没有搜索到您想要的信息， 建议您调整筛选条件',
                    })
                  }
                } else {
                  console.log('fail: request search res')
                  console.log(res)
                  wx.showToast({
                    title: '服务器无法回应这个搜索',
                    icon: 'loading',
                    duration: 2000
                  })
                }
              },
              fail: function () {
                // fail
                console.log('fail: request search')
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
          } else if (res.cancel) {
            console.log('用户取消搜索')
          }
        }

      })
    }
  }
})