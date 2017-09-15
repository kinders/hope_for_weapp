// pages/groups/groups.js
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    // 到网站请求最新信息
    var that = this;
    var token = getApp().globalData.token;
    if (getApp().globalData.need_update_groups == true) {
    wx.request({
      url: 'https://www.hopee.xyz/groups',
      data: { token: token },
      header:{"Content-Type":"application/json"},
      method: 'GET',
      success: function(res){
        if(res.data.groups){
          getApp().globalData.need_update_groups = false
          var g = res.data.groups;
          var a = g.map(function(hash, index){return hash.name.concat("^^+_-^^", index)})
	        a.sort()
        	var groups = a.map(function(hash){return g[hash.split('^^+_-^^')[1]]})
          wx.setStorageSync('groups', groups)
          that.setData({
            groups: groups || [],
            groups_length: groups.length || 0
          })
        }else{
          console.log('fail: request groups res')
          console.log(res)
        }
      },
      fail: function() {console.log('fail: request groups')},
      complete: function() {}
    })
    } else { 
      //console.log('groups from storage')
      var groups = wx.getStorageSync('groups');
      that.setData({
        groups: groups || [],
        groups_length: groups.length || 0
      })
    }
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  showActionSheet:function(event){
    var that=this;
    var token = getApp().globalData.token;
    var group_id = event.currentTarget.dataset.group_id;
    var name = event.currentTarget.dataset.name;
    var gdetail = '“' + name + '”组成员'
    wx.showActionSheet({
      itemList: ['发送组请求', gdetail, '未满意的组请求', '已满意的组请求', '修改组名', '删除小组'],
      success: function(res) {
        if(res.tapIndex == 0){
          wx.navigateTo({
            url: "../new_help_to_group/new_help_to_group?group_id=" + group_id + "&name=" + name
          })
        }else if(res.tapIndex == 1){
          wx.navigateTo({
            url: "../group/group?group_id=" + group_id + "&name=" + name
          })
        } else if (res.tapIndex == 2 ){
          wx.navigateTo({
            url: "../group_helps/group_helps?group_id=" + group_id + "&name=" + name
          })
        } else if (res.tapIndex == 3 ){
          wx.navigateTo({
            url: "../group_helpeds/group_helpeds?group_id=" + group_id + "&name=" + name
          })        
        } else if(res.tapIndex == 4){
          wx.navigateTo({
            url: "../new_groupname/new_groupname?group_id=" + group_id + "&name=" + name
          })
        } else if(res.tapIndex == 5){
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
                      // 将小组从缓存中删除
                      var groups = wx.getStorageSync('groups') || [];
                      var group_index;
                      groups.forEach(function(item, index){
                        if(item.id == group_id){
                          group_index = index
                        }
                      })
                      groups.splice(group_index, 1)
                      wx.setStorageSync('groups', groups)
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
      fail: function(res) {}
    })
  },
  moreFun: function(){
    wx.showActionSheet({
      itemList: ['新建小组'],
      success: function(res){
        if(res.tapIndex == 0){
           wx.navigateTo({url: '../new_group/new_group'})
        }
      }
    })
  }
})
