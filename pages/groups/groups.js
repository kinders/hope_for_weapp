// pages/groups/groups.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // 取出缓存信息
    this.setData({
      groups: (wx.getStorageSync('groups') || [])
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
  showActionSheet:function(event){
    var group_id = event.currentTarget.dataset.group_id
    var name = event.currentTarget.dataset.name
    wx.showActionSheet({
      itemList: ['友群详情', '发送请求', '修改群称', '删除友群'],
      success: function(res) {
        if(res.tapIndex == 0){
          wx.navigateTo({
            url: "../group/group?group_id=" + group_id + "&name=" + name
          })
        }
        if(res.tapIndex == 1){
          wx.navigateTo({
            url: "../new_help_to_group/new_help_to_group?group_id=" + group_id + "&name=" + name
          })
        }
        if(res.tapIndex == 2){
          wx.navigateTo({
            url: "../new_groupname/new_groupname?group_id=" + group_id + "&name=" + name
          })
        }
        if(res.tapIndex == 3){
          wx.showModal({
            title: '警告',
            content: "确定将要删除朋友群 " + name + " ？",
            success: function(res) {
              if (res.confirm) {
                wx.request({
                  url: 'https://www.hopee.xyz/delete_group',
                  data: {token: wx.getStorageSync('token'), group_id: group_id},
                  method: 'POST',
                  success: function(res){
                    // success
                    if(res.result_code == 't'){
                      // 将朋友群从缓存中删除
                      groups = wx.getStorageSync('groups') || []
                      group_index = groups.indexOf({group_id: group_id, name: name})
                      groups = groups.splice(group_index, 1)
                      wx.setStoragesync('groups', groups)
                      wx.showToast({
                        title: "成功将朋友群" + name + "删去",
                        icon: 'success',
                        duration: 2000
                      })
                    }else{
                      wx.showToast({
                        title: "无法删除朋友群" + nickname,
                        icon: 'loading',
                        duration: 2000
                      })
                    }
                  },
                  fail: function() {
                    // fail
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
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  }
})