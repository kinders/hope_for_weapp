// pages/new_members/new_members.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var group_id = options.group_id
    var name = options.name
    this.setData({
      group_id: group_id,
      group_name: name
    })
    var group = "group_" + group_id;
    var group_members = wx.getStorageSync(group);
    var g_m_id = group_members.map(function(hash){return hash.user_id})
    //console.log(g_m_id)
    var friends = wx.getStorageSync('friendships');
    var others = [];
    others = friends.filter(function(hash){
      return g_m_id.indexOf(hash.friend_id) == -1
    })
    //console.log(others)
    this.setData({
      group_members: group_members,
      others: others,
      g_m_id: g_m_id
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
  formSubmit:function(e){
    var that = this;
    if(e.detail.value.checkbox.length < 2){
      wx.showToast({
        title: '群里人数不能少于2人',
        icon: 'loading',
        duration: 1000
      })
    }else if(e.detail.value.checkbox ==  that.data.g_m_id){
      wx.showToast({
        title: '群成员没有变动',
        icon: 'loading',
        duration: 1000
      })
    }else{
      wx.showModal({
        title: "修改群成员",
        content:  e.detail.value.checkbox.length.toString() + '人',
        success: function(res) {
          if (res.confirm) {
            wx.request({
              url: 'https://www.hopee.xyz/new_members',
              data: {token: wx.getStorageSync('token'), friends_id: e.detail.value.checkbox, group_id: that.data.group_id},
              header:{"Content-Type":"application/json"},
              method: 'POST',            
              success: function(res){
                if(res.data.result_code == 't'){
                  wx.showToast({
                    title: '成功修改群成员',
                    icon: 'success',
                    duration: 2000
                  })
                  setTimeout(function(){wx.navigateBack()},2000);
                }else{
                  console.log('fail: request new_member res')
                  console.log(res)
                  wx.showToast({
                    title: "服务器无法修改群成员",
                    icon: 'loading',
                    duration: 2000
                  })
                }
              },
              fail: function() {
                // fail
                console.log('fail: request new_member')
                wx.showToast({
                  title: '请求失败，请先检查网络，稍后提交修改。',
                  icon: 'loading',
                  duration: 2000
                })
              },
              complete: function() {}
            })
          }
        }
      })
    }  
  }
})