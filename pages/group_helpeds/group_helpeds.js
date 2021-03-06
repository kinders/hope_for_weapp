// pages/group_helpeds/group_helpeds.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var token = getApp().globalData.token;
    var current_user = getApp().globalData.current_user;
    var group_id = options.group_id;
    var name = options.name;
    // 取出缓存信息
    this.setData({
      group: {group_id: group_id, name: name},
      current_user_id: current_user.id
    })
    // 到网站请求最新信息
    var that = this;
    var group_helpeds = "group_" + group_id + "_helpeds";
    wx.request({
      url: 'https://www.hopee.xyz/group_helpeds',
      data: { token: token, group_id: group_id },
      header:{"Content-Type":"application/json"},
      method: 'GET',
      success: function(res){
        // 取得信息之后：缓存信息
        if (res.data.group_helpeds) {
          wx.setStorageSync(group_helpeds, res.data.group_helpeds)
          that.setData({
            group_helpeds: res.data.group_helpeds,
            group_helpeds_length: res.data.group_helpeds.length,
          })
        } else {
          console.log('fail: request group_helpeds res')
          console.log(res) 
        }
      },
      fail: function() {console.log('fail: request group_helpeds')},
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
  moreFun:function(){
    var that=this;
    var token = getApp().globalData.token;
    var group_id = that.data.group.group_id;
    var name = that.data.group.name;
    wx.showActionSheet({
      itemList: ['发送请求', '小组成员', '未满意的请求', '修改名称', '删除小组'],
      success: function(res) {
        if(res.tapIndex == 0){
          wx.redirectTo({
            url: "../new_help_to_group/new_help_to_group?group_id=" + group_id + "&name=" + name
          })
        }else if(res.tapIndex == 1){
          wx.redirectTo({
            url: "../group/group?group_id=" + group_id + "&name=" + name
          })
        } else if (res.tapIndex == 2 ){
          wx.redirectTo({
            url: "../group_helps/group_helps?group_id=" + group_id + "&name=" + name
          })
        } else if(res.tapIndex == 3){
          wx.redirectTo({
            url: "../new_groupname/new_groupname?group_id=" + group_id + "&name=" + name
          })
        } else if(res.tapIndex == 4){
          wx.showModal({
            title: '警告',
            content: "确定将要删除小组 " + name + " ？",
            success: function(res) {
              if (res.confirm) {
                wx.request({
                  url: 'https://www.hopee.xyz/delete_group',
                  data: {token: token, group_id: group_id},
                  header:{"Content-Type":"application/json"},
                  method: 'POST',
                  success: function(res){
                    // success
                    if(res.data.result_code == 't'){
                      // 将朋友小组从缓存中删除
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
                        title: "成功将小组" + name + "删去",
                        icon: 'success',
                        duration: 2000
                      })
                    }else{
                      console.log('fail: request delete_group res')
                      console.log(res)
                      wx.showToast({
                        title: "服务器无法删除小组" + name,
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
  },
  search_lists: function (e) {
    var that = this;
    var is_hidden = [];
    var group_helpeds_length = 0;
    var group_id = that.data.group.group_id;
    var group_helpeds = "group_" + group_id + "_helpeds";
    (wx.getStorageSync(group_helpeds) || []).map(function (help) {
      if (help.content.indexOf(e.detail.value) >= 0) {
        is_hidden = is_hidden.concat("item"),
          group_helpeds_length = group_helpeds_length + 1
      } else {
        is_hidden = is_hidden.concat("hidden")
      }
      that.setData({
        is_hidden: is_hidden,
        index: 0,
        group_helpeds_length: group_helpeds_length
      })
      //console.log("search done")
    })
  }
})
