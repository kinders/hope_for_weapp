//app.js
App({
  onLaunch: function () {
    // 模拟本地缓存数据
    wx.setStorage({
      key: "token",
      data: '111'
    })
    wx.setStorage({
      key:"current_user",
      data: {id: 1, nickname: '用户一', end_time: '2018-01-01 00:00:01'}
    })
    wx.setStorage({
      key:"is_use",
      data: true
    })
    wx.setStorage({
      key: "todos",
      data: [{ id: 1, content: '第一个任务', user_id: 1, nickname: '用户一', created_at: '2017-02-20 09:50:14', is_top: false }, { id: 2, content: '用户二给用户一的第一个任务', user_id: 2, nickname: '用户二', created_at: '2017-02-20 09:50:14', is_top: false }, { id: 3, content: '用户二给用户一的第一个任务', user_id: 2, nickname: '用户二', created_at: '2017-02-20 09:50:14', is_top: false }]
    })
    wx.setStorage({
      key: "other_todos",
      data: [{ id: 1, content: '第一个任务', user_id: 4, nickname: '用户4', created_at: '2017-02-20 09:50:14', is_top: false }, { id: 2, content: '用户5给用户一的第一个任务', user_id: 5, nickname: '用户5', created_at: '2017-02-20 09:50:14', is_top: false }, { id: 3, content: '用户5给用户一的第一个任务', user_id: 5, nickname: '用户5', created_at: '2017-02-20 09:50:14', is_top: false }]
    })
    wx.setStorage({
        key: "dones",
        data: [{ id: 1, user_id: 1, nickname: 'test', content: '第一个请求给自己', created_at: '2017-02-17 11:50' }, { id: 3, user_id: 3, nickname: '用户三', content: '第一个请求给自己', created_at: '2017-02-17 11:50' }, { id: 4, user_id: 4, nickname: '用户四', content: '第四个请求给自己', created_at: '2017-02-17 11:50' }, { id: 5, user_id: 4, nickname: '用户四', content: '第四个请求给自己', created_at: '2017-02-17 11:50' }]
    })
    wx.setStorage({
        key: "helps",
        data: [ { id: 3, content: '第一个请求', receiver_id: 2, nickname: '用户二', created_at: '2017-02-25T12:20:20' },{ id: 4, content: '第一个请求', receiver_id: 3, nickname: '用户三', created_at: '2017-02-25T12:20:20' },{ id: 5, content: '第一个请求', receiver_id: 3, nickname: '用户三', created_at: '2017-02-25T12:20:20' } ]
    })
    wx.setStorage({
        key: "helpeds",
        data: [ { id: 3, content: '第一个请求', receiver_id: 2, nickname: '用户二', created_at: '2017-02-25T12:20:20' },{ id: 4, content: '第一个请求', receiver_id: 3, nickname: '用户三', created_at: '2017-02-25T12:20:20' },{ id: 5, content: '第一个请求', receiver_id: 3, nickname: '用户三', created_at: '2017-02-25T12:20:20' } ]
    })
    wx.setStorage({
        key: "groups_helps",
        data: [ { id: 3, content: '第一个群请求', group_id: 2, name: '群二', created_at: '2017-02-25T12:20:20' }, { id: 4, content: '第二个群请求', group_id: 3, name: '群三', created_at: '2017-02-25T12:20:20' }, { id: 5, content: '第二个群请求', group_id: 3, name: '群三', created_at: '2017-02-25T12:20:20' } ]
    })
    wx.setStorage({
      key: "friendships",
      data: [ { friend_id: 1, nickname: '一号' },      { friend_id: 2, nickname: '二号朋友' },  { friend_id: 3, nickname: '三号朋友' } ]
    })
    wx.setStorage({
      key: "friend_2_todos",
      data: [ { id: 1, content: '第一个任务第一个任务第一个任务第一个任务', user_id: 1, nickname: '用户一', created_at: '2017-02-20T09:50:14', is_top: false }, { id: 2, content: '第二个任务', user_id: 1, nickname: '用户一', created_at: '2017-02-20T09:50:14', is_top: false }, { id: 3, content: '第三个任务', user_id: 4, nickname: '用户四', created_at: '2017-02-20T09:50:14', is_top: false } ]
    })
    wx.setStorage({
      key: "friend_2_helps",
      data: [ { id: 1, content: '第一个任务第一个任务第一个任务第一个任务', receiver_id: 1, nickname: '用户一', created_at: '2017-02-20T09:50:14', is_top: false }, { id: 2, content: '第二个任务', receiver_id: 1, nickname: '用户一', created_at: '2017-02-20T09:50:14', is_top: false }, { id: 3, content: '第三个任务', receiver_id: 3, nickname: '用户三', created_at: '2017-02-20T09:50:14', is_top: false } ]
    })
    wx.setStorage({
      key: "groups",
      data: [ { id: 1, name: '第一个友群' }, { id: 2, name: '第二个友群' } ]
    })
    wx.setStorage({
      key: "group_1",
      data: [ { user_id: 1, nickname: '用户一' }, { user_id: 2, nickname: '用户二' }, { user_id: 3, nickname: '用户三' } ]
    })
    wx.setStorage({
      key: "group_1_helps",
      data: [ { id: 1, content: '第7个群请求', created_at: '2017-02-25T12:20:20' },{ id: 2, content: '第8个群请求', created_at: '2017-02-25T12:20:20' },{ id: 3, content: '第9个群请求', created_at: '2017-02-25T12:20:20' } ]
    })
    wx.setStorage({
      key: "group_1_helpeds",
      data: [ { id: 1, content: '第一个群请求', created_at: '2017-02-25T12:20:20' },{ id: 2, content: '第二个群请求', created_at: '2017-02-25T12:20:20' },{ id: 3, content: '第三个群请求', created_at: '2017-02-25T12:20:20' } ]
    })
    wx.setStorage({
      key: "helps_in_grouptodo_1",
      data: [ { id: 1, content: '第一个群任务', receiver_id: 1, nickname: '用户一', is_finish: 't' }, { id: 2, content: '第一个群任务', receiver_id: 2, nickname: '用户二',  is_finish: 'f' }, { id: 2, content: '第一个群任务', receiver_id: 3, nickname: '用户三',  is_finish: 't' } ]
    })
    wx.setStorage({
      key: "discussions_in_todo_1",
      data: [ { todo_id: 1, user_id: 2, nickname: '用户二', content: '这样子满意不？这样子满意不？这样子满意不？这样子满意不？这样子满意不？这样子满意不？这样子满意不？这样子满意不？这样子满意不？这样子满意不？这样子满意不？这样子满意不？', created_at: '2017-02-26T21:21:25' }, { todo_id: 1, user_id: 3, nickname: '用户三', content: '这样子满意不？这样子满意不？这样子满意不？', created_at: '2017-02-26T21:21:25' }, { todo_id: 1, user_id: 2, nickname: '用户二', content: '这样子满意不？', created_at: '2017-02-26T21:21:25' }, { todo_id: 1, user_id: 2, nickname: '用户二', content: '这样子满意不？', created_at: '2017-02-26T21:21:25' }, { todo_id: 1, user_id: 2, nickname: '用户二', content: '这样子满意不？', created_at: '2017-02-26T21:21:25' },{ todo_id: 1, user_id: 2, nickname: '用户二', content: '这样子满意不？', created_at: '2017-02-26T21:21:25' },{ todo_id: 1, user_id: 2, nickname: '用户二', content: '这样子满意不？', created_at: '2017-02-26T21:21:25' }, { todo_id: 1, user_id: 2, nickname: '用户二', content: '这样子满意不？', created_at: '2017-02-26T21:21:25' } ]
    })
  },
  // 获取用户信息，在index.js中调用这个函数
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            wx.request({
              url: 'https://test.com/login',
              data: { code: res.code },
              success: function(res){
                if(res.result_code = "t"){
                  wx.setStorageSync('token', res.token)
                  wx.setStorageSync('current_user', res.current_user)
                  wx.setStorageSync('is_use', true)
                }else if(res.result_code == "expired"){
                  wx.setStorageSync('token', res.token)
                  wx.setStorageSync('current_user', res.current_user)
                  wx.setStorageSync('is_use', false)
                }
              },
              fail: function(res){}
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
          // 获取本地用户信息
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  // 全局数据，可用`getApp().globalData.userInfo`来调用
  globalData:{
    userInfo:null
  }
})
