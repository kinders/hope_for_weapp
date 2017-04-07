// pages/new_groupname/new_groupname.js
var name;
var group_id;
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
    }else if(e.detail.value.name == name){
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
              url: 'https://www.hopee.xyz/new_groupname',
              data: {token: wx.getStorageSync('token'), name: e.detail.value.name, group_id: group_id},
              method: 'POST',
              success: function(res){
                if(res.data.result_code == 't'){
                  /* 将缓存里面原来的名称更改为新的名称。
                  var groups = wx.getStorageSync('groups') || []
                  var group_index;
                  groups.forEach(function(item, index){
                        if(item.group_id == group_id){
                          group_index = index
                        }
                      })
                  groups.splice(group_index, 1, {id: group_id, name: e.detail.value.name})
                  wx.setStorageSync('groups', groups)
                  */
                  // 提示修改成功。
                  wx.showToast({
                    title: '成功修改群称',
                    icon: 'success',
                    duration: 2000
                  })
                  setTimeout(function(){wx.navigateBack()},2000);
                }else{
                  console.log('fail: request new_groupname res')
                  console.log(res)
                  wx.showToast({
                    title: (res.msg || "服务器拒绝修改"),
                    icon: 'loading',
                    duration: 2000
                  })
                }
              },
              fail: function() {
                // fail
                console.log('fail: request new_groupname')
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
  },
  formReset: function(){
    wx.navigateBack()
  }
})
