// pages/group_helps/group_helps.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var group_id = options.group_id;
    var name = options.name;
    // 取出缓存信息
    this.setData({
      group: {group_id: group_id, name: name},
      current_user_id: wx.getStorageSync('current_user').id
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    // 到网站请求最新信息
    var that = this;
    var group_id = that.data.group.group_id;
    var group_helps = "group_" + group_id + "_helps";
    wx.request({
      url: 'https://www.hopee.xyz/group_helps',
      data: { token: wx.getStorageSync('token'), group_id: group_id },
      header:{"Content-Type":"application/json"},
      method: 'GET',
      success: function(res){
        // 取得信息之后：缓存信息
        if (res.data.group_helps) {
          wx.setStorageSync(group_helps, res.data.group_helps)
          that.setData({
            group_helps: res.data.group_helps,
            group_helps_length: res.data.group_helps.length,
          })
        } else {
          console.log('fail: request group_helps res')
          console.log(res)
        }
      },
      fail: function() {console.log('fail: request group_helps')},
      complete: function() {}
    })
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  moreFun:function(){
    var that=this;
    var group_id = that.data.group.group_id;
    var name = that.data.group.name;
    var gdetail = '“' + name + '”群成员'
    wx.showActionSheet({
      itemList: [gdetail, '群组已满足的请求', '发送群请求', '修改群称', '删除群组'],
      success: function(res) {
        if(res.tapIndex == 0){
          wx.navigateTo({
            url: "../group/group?group_id=" + group_id + "&name=" + name
          })
        } else if (res.tapIndex == 1 ){
          wx.navigateTo({
            url: "../group_helpeds/group_helpeds?group_id=" + group_id + "&name=" + name
          })        
        } else if(res.tapIndex == 2){
          wx.navigateTo({
            url: "../new_help_to_group/new_help_to_group?group_id=" + group_id + "&name=" + name
          })
        }else if(res.tapIndex == 3){
          wx.navigateTo({
            url: "../new_groupname/new_groupname?group_id=" + group_id + "&name=" + name
          })
        } else if(res.tapIndex == 4){
          wx.showModal({
            title: '警告',
            content: "确定将要删除朋友群 " + name + " ？",
            success: function(res) {
              if (res.confirm) {
                wx.request({
                  url: 'https://www.hopee.xyz/delete_group',
                  data: {token: wx.getStorageSync('token'), group_id: group_id},
                  header:{"Content-Type":"application/json"},
                  method: 'POST',
                  success: function(res){
                    // success
                    if(res.data.result_code == 't'){
                      // 将朋友群从缓存中删除
                      var groups = wx.getStorageSync('groups') || [];
                      var group_index;
                      groups.forEach(function(item, index){
                        if(item.id == group_id){
                          group_index = index
                        }
                      })
                      groups.splice(group_index, 1)
                      //wx.setStorageSync('groups', groups)
                      that.setData({
                        groups: groups || [],
                        groups_length: groups.length || 0
                      })
                      wx.showToast({
                        title: "成功将朋友群" + name + "删去",
                        icon: 'success',
                        duration: 2000
                      })
                    }else{
                      console.log('fail: request delete_group res')
                      console.log(res)
                      wx.showToast({
                        title: "服务器无法删除朋友群" + name,
                        icon: 'loading',
                        duration: 2000
                      })
                    }
                  },
                  fail: function() {console.log('fail: request delete_group')},
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
