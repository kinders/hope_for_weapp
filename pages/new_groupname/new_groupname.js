// pages/new_groupname/new_groupname.js
var name;
var group_id;
var token = wx.getStorageSync('token');
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    group_id = options.group_id
    name = options.name
    this.setData({
      group_name: name
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
    if(e.detail.value.name.replace(/\s*/, "") == ""){
      wx.showToast({
        title: '名称不能为空',
        icon: 'loading',
        duration: 2000
      })
    }else if(e.detail.value.name == nickname){
      wx.showToast({
        title: '名称没有变化',
        icon: 'loading',
        duration: 2000
      })
    }else{
      wx.showModal({
        title: "改为新群称",
        content:  e.detail.value.name,
        success: function(res) {
          if (res.confirm) {
            wx.request({
              url: 'https://test.com/new_groupname',
              data: {token: token, nickname: e.detail.value.name, group_id: group_id},
              method: 'POST',
              success: function(res){
                if(res.result_code == 't'){
                  // 将缓存里面原来的名称更改为新的名称。
                  groups = wx.getStorageSync('groups') || []
                  group_index = groups.indexOf({id: group_id, name: name})
                  new_groups = groups.splice(group_index, 1, {id: group_id, name: e.detail.value.name})
                  wx.setStorage({
                    key: 'groups',
                    data: new_groups,
                    success: function(res){
                      // success
                    },
                    fail: function() {
                      // fail
                    },
                    complete: function() {
                      // complete
                    }
                  })

                  // 提示修改成功。
                  wx.showToast({
                    title: '成功修改昵称',
                    icon: 'success',
                    duration: 2000
                  })
                }else{
                  wx.showToast({
                    title: (res.msg || "没有修改"),
                    icon: 'loading',
                    duration: 2000
                  })
                }
              },
              fail: function() {
                // fail
                wx.showToast({
                  title: '请求失败，请先检查网络，稍后发送。',
                  icon: 'loading',
                  duration: 2000
                })
              },
              complete: function() {
                // complete
              }
            })
          }
        }
      })
    }  
  },
  formReset: function(){
    wx.navigateBack()
  }
})
