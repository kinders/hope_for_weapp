//app.js
App({
  onLaunch: function () {
    // 先清理缓存
    wx.clearStorageSync()
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
            //console.log('start to request login')
            wx.request({
              url: 'https://www.hopee.xyz/login',
              data: { js_code: res.code },
              header:{"Content-Type":"application/json"},
              method: 'POST',
              success: function(res){
                //console.log(res)
                if(res.data.result_code == "t"){
                  //console.log('获取用户登录态成功！')
                  that.globalData.is_use = 1
                  that.globalData.token = res.data.token
                  that.globalData.current_user = res.data.current_user
                  wx.setStorageSync('token', res.data.token)
                  wx.setStorageSync('current_user', res.data.current_user)
                }else if(res.data.result_code == "expired"){
                  console.log('获取用户登录态过期！')
                  that.globalData.is_use = 2
                  that.globalData.token = res.data.token
                  that.globalData.current_user = res.data.current_user
                  wx.setStorageSync('token', res.data.token)
                  wx.setStorageSync('current_user', res.data.current_user)
                }else{
                  that.globalData.is_use = 3
                  console.log('服务器未知用户登录态！')
                  console.log(res)
                }
                // 获取本地用户信息
                wx.getUserInfo({
                  success: function (res) {
                    that.globalData.userInfo = res.userInfo
                     typeof cb == "function" && cb(that.globalData.userInfo)
                  }
                })
              },
              fail: function(res){
                console.log('fail: request login ')
                console.log(res)
              }
            })
          } else {
            console.log('fail: could not get login res code')
            console.log(res)
          }
        }
      })
    }
  },
  globalData: {
   userInfo:null,
   is_use: 0,
   token: '',
   current_user: {}
  }
})
