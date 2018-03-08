// pages/dones/dones.js
Page({
  data:{},
  onLoad:function(options){
    wx.showModal({
      title: '提示',
      content: '为了节省您的流量，这里默认显示最近完成的100个任务。如需查看更多请求，请选择特定日期进行筛查。'
    })
    // 页面初始化 options为页面跳转所带来的参数
    // 到网站请求最新信息
    var that = this;
    var token = getApp().globalData.token;
    var current_user = getApp().globalData.current_user;
    wx.request({
      url: 'https://www.hopee.xyz/dones',
      data: { token: token },
      header:{"Content-Type":"application/json"},
      method: 'GET',
      success: function(res){
        if(res.data.dones){
          wx.setStorageSync('dones', res.data.dones)
          that.setData({
            dones: res.data.dones,
            dones_length: res.data.dones.length,
            current_user: current_user
          })
          // 生成可供筛选的选项
          var dones_user_ids = [];
          var dones_user_nicknames = [];
          var is_hidden = [];
          (res.data.dones || []).map(function(done){
            if (dones_user_ids.indexOf(done.user_id) == -1 ){
              dones_user_ids = dones_user_ids.concat(done.user_id)
            }
            if (dones_user_nicknames.indexOf(done.nickname) == -1){
              dones_user_nicknames = dones_user_nicknames.concat(done.nickname)
            }   
            is_hidden = is_hidden.concat("item")
          });
          var a = dones_user_nicknames.map(function (nickname, index) { return nickname.concat("^^+_-^^", index) })
          a.sort()
          var c = a.map(function (hash) { return hash.split('^^+_-^^')[0] })
          var b = a.map(function (hash) { return dones_user_ids[hash.split('^^+_-^^')[1]] })
          c.unshift("全部")
          b.unshift(0)
          that.setData({
            dones_user_ids: b,
            dones_user_nicknames: c,
            is_hidden: is_hidden
          })
        }else{
          console.log('fail: request dones res')
          console.log(res)
        }
      },
      fail: function() {console.log('fail: request dones')},
      complete: function() {}
    })
    
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
    var dones_user_ids = this.data.dones_user_ids;
    var is_hidden = [];
    var dones_length = 0;
    if (e.detail.value == 0){
      (wx.getStorageSync('dones') || []).map(function(done){
        is_hidden = is_hidden.concat("item")
        dones_length = dones_length + 1
      })
    }else{
      (wx.getStorageSync('dones') || []).map(function(done){
        if(done.user_id == dones_user_ids[e.detail.value]){
          is_hidden = is_hidden.concat("item")
          dones_length = dones_length + 1
        }else{
          is_hidden = is_hidden.concat("hidden")
        }
      })
    }
    this.setData({
      is_hidden: is_hidden,
      dones_length: dones_length
    })
  },
  bindDateChange: function(e){
    this.setData({
      date: e.detail.value
    })
    var that=this; 
    var token = getApp().globalData.token;
    var current_user = getApp().globalData.current_user;
    wx.request({
      url: 'https://www.hopee.xyz/dones_in_date',
      data: {token: token, date: e.detail.value },
      method: 'GET',
      header: {"Content-Type":"application/json"},
      success: function(res){
         if(res.data.dones){
          wx.setStorageSync('dones', res.data.dones)
          that.setData({
            dones: res.data.dones,
            dones_length: res.data.dones.length,
            current_user: current_user
          })
          // 生成可供筛选的选项
          var dones_user_ids = [];
          var dones_user_nicknames = [];
          var is_hidden = [];
          (res.data.dones || []).map(function(done){
            if (dones_user_ids.indexOf(done.user_id) == -1 ){
              dones_user_ids = dones_user_ids.concat(done.user_id)
            }
            if (dones_user_nicknames.indexOf(done.nickname) == -1){
              dones_user_nicknames = dones_user_nicknames.concat(done.nickname)
            }   
            is_hidden = is_hidden.concat("item")
          });
          var a = dones_user_nicknames.map(function (nickname, index) { return nickname.concat("^^+_-^^", index) })
          a.sort()
          var c = a.map(function (hash) { return hash.split('^^+_-^^')[0] })
          var b = a.map(function (hash) { return dones_user_ids[hash.split('^^+_-^^')[1]] })
          c.unshift("全部")
          b.unshift(0)
          that.setData({
            dones_user_ids: b,
            dones_user_nicknames: c,
            is_hidden: is_hidden,
            index: null
          })
        }else{
          console.log('fail: request dones in date res')
          console.log(res)
        }
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })

  }
})
