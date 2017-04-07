//app.js
App({
  onLaunch: function () {
    // 先清理缓存
    wx.clearStorageSync()
    var that = this
      //调用登录接口
      wx.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            //console.log('start to request login')
            wx.request({
              url: 'https://www.hopee.xyz/login',
              data: { js_code: res.code },
              method: 'POST',
              success: function(res){
                //console.log(res)
                if(res.data.result_code == "t"){
                  //console.log('获取用户登录态成功！')
                  wx.setStorageSync('token', res.data.token)
                  wx.setStorageSync('current_user', res.data.current_user)
                  that.globalData.is_use = 1
                  //wx.setStorageSync('is_use', 1)
                }else if(res.data.result_code == "expired"){
                  console.log('获取用户登录态过期！')
                  wx.setStorageSync('token', res.data.token)
                  wx.setStorageSync('current_user', res.data.current_user)
                  that.globalData.is_use = 2
                  //wx.setStorageSync('is_use', 2)              
                }else{
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
              fail: function(res){console.log('request login fail')}
            })
          } else {
            console.log('获取用户登录态失败！')
            console.log(res)
          }
        }
      })
 },
 globalData: {
   userInfo:null,
   is_use: 0
}
})
