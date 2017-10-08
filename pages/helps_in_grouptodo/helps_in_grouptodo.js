// pages/helps_in_grouptodo/helps_in_grouptodo.js
var grouptodo_id;
var helps_in_grouptodo;
Page({
  data:{is_checked: false},
  onLoad:function(options){
    var current_user = getApp().globalData.current_user;
    // 页面初始化 options为页面跳转所带来的参数
    var group_id = options.group_id
    var name = options.name
    var time = options.time
    var content = options.content
    grouptodo_id = options.id
    var is_finish = options.is_finish
    helps_in_grouptodo = "helps_in_grouptodo_" + grouptodo_id
    this.setData({
      group: {group_id: group_id, name: name},
      grouptodo: {id: grouptodo_id, time: time, content: content, is_finish: is_finish},
      current_user: current_user
    })

  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    // 到网站请求最新信息
    var that = this;
    var token = getApp().globalData.token;
    wx.request({
      url: 'https://www.hopee.xyz/helps_in_grouptodo',
      data: { token: token, grouptodo_id: grouptodo_id },
      header:{"Content-Type":"application/json"},
      method: 'GET',
      success: function(res){
        if(res.data.helps_in_grouptodo){
          var h = res.data.helps_in_grouptodo;
          var is_hidden = 'hidden';
          var unfinish_count = 0;
          for (var i = 0; i < h.length; i++) {
            if (h[i].is_finish == "false") {
              unfinish_count += 1
            }
          }
          var finish_count = h.length - unfinish_count;
          if (unfinish_count > 0){
            is_hidden = ''
          }
          var a = h.map(function(hash, index){return hash.nickname.concat("^^+_-^^", index)})
	        a.sort()
        	var helps = a.map(function(hash){return h[hash.split('^^+_-^^')[1]]})
          wx.setStorageSync(helps_in_grouptodo, helps)
          that.setData({
            helps_in_grouptodo: helps,
            helps_in_grouptodo_length: helps.length,
            is_hidden: is_hidden,
            unfinish_count: unfinish_count,
            finish_count: finish_count
          })

        }else{
          console.log('fail: request helps_in_grouptodo res')
          console.log(res)
        }
      },
      fail: function() {console.log('fail: request helps_in_grouptodo')},
      complete: function() {}
    })
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  close_grouptodo: function(){
    var that = this;
    var token = getApp().globalData.token;
    wx.showModal({
      title: "注意",
      content: '您确定要关闭这个组请求吗？',
      success: function(res){
        if (res.confirm){
          wx.request({
            url: 'https://www.hopee.xyz/close_grouptodo',
            data: {token: token, grouptodo_id: grouptodo_id},
            header:{"Content-Type":"application/json"},
            method: 'POST',
            success: function(res){
              // success
              if(res.data.result_code == "t"){
                wx.showToast({
                  title: '成功关闭这个请求',
                  icon: 'success',
                  duration: 2000
                })
                getApp().globalData.need_update_helps = true
                getApp().globalData.need_update_groups_helps = true
                var new_grouptodo = that.data.grouptodo;
                new_grouptodo.is_finish = 't';
                that.setData({grouptodo: new_grouptodo})
                wx.navigateBack()
              }else{
                console.log('fail: request close_grouptodo res')
                console.log(res)
                wx.showToast({
                  title: '服务器无法关闭这个请求',
                  icon: 'loading',
                  duration: 2000
                })
              }
            },
            fail: function() {console.log('fail: request close_grouptodo')},
            complete: function() {}
          })
        }
      },
      fail: function(){}
    })
  },
  open_grouptodo: function(){
    var that = this;
    var token = getApp().globalData.token;
    wx.showModal({
      title: "注意",
      content: '您确定要重启这个组请求吗？',
      success: function(res){
        if (res.confirm){
          wx.request({
            url: 'https://www.hopee.xyz/open_grouptodo',
            data: {token: token, grouptodo_id: grouptodo_id},
            header:{"Content-Type":"application/json"},
            method: 'POST',
            success: function(res){
              // success
              if(res.data.result_code == "t"){
                wx.showToast({
                  title: '成功重启这个请求',
                  icon: 'success',
                  duration: 2000
                })
                getApp().globalData.need_update_groups_helps = true
                var new_grouptodo = that.data.grouptodo;
                new_grouptodo.is_finish = 'f';
                that.setData({grouptodo: new_grouptodo})
                wx.navigateBack()
              }else{
                console.log('fail: request open_grouptodo res')
                console.log(res)
                wx.showToast({
                  title: '服务器无法重启这个请求',
                  icon: 'loading',
                  duration: 2000
                })
              }
            },
            fail: function() {console.log('fail: request open_grouptodo')},
            complete: function() {}
          })
        }
      },
      fail: function(){}
    })
  },
  new_group_discussion: function(e){
    if(e.detail.value.content.replace(/\s/g, "")  == ""){
      wx.showToast({
        title: '内容不能为空',
        icon: 'loading',
        duration: 2000
      })
    }else{
    var token = getApp().globalData.token;
      wx.showModal({
        title: "留言内容",
        content:  e.detail.value.content,
        success: function(res) {
          if (res.confirm) {
            wx.request({
              url: 'https://www.hopee.xyz/new_group_discussion',
              data: {token: token, grouptodo_id: grouptodo_id, content: e.detail.value.content},
              header:{"Content-Type":"application/json"},
              method: 'POST',
              success: function(res){
                if(res.data.result_code == 't'){
                  wx.showToast({
                    title: '成功发表一条留言给所有成员',
                    icon: 'success',
                    duration: 2000,
                    //complete: function(){
                      //wx.navigateBack()
                    //}
                  })
                }else{
                console.log('fail: request new_group_discussion res')
                console.log(res)
                  wx.showToast({
                    title: res.data.msg || "留言失败，请稍后重试",
                    icon: 'loading',
                    duration: 2000
                  })
                }
              },
              fail: function() {
                console.log('fail: request new_group_discussion res')
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
  close_helps: function(e){
    var that=this;
    var token = getApp().globalData.token;
    if(e.detail.value.checkbox.length == 0){
      wx.showToast({
        title: '没有选择成员',
        icon: 'loading',
        duration: 2000
      })
    }else{
    wx.showModal({
      title: "批量关闭请求 ",
      content:  "人数：" + e.detail.value.checkbox.length,
      success: function(res) {
        if (res.confirm) {
            wx.request({
              url: 'https://www.hopee.xyz/close_helps',
              data: {token: token, grouptodo_id: grouptodo_id, friends_id: e.detail.value.checkbox.join('_')},
              header:{"Content-Type":"application/json"},
              method: 'POST',
              success: function(res){
                if(res.data.result_code == 't'){
                  wx.showToast({
                    title: '成功关闭指定小组成员的请求',
                    icon: 'success',
                    duration: 2000
                  })
                  that.onShow()
                }else{
                  console.log('fail: request close_helps res')
                  console.log(res)
                  wx.showToast({
                    title: '服务器无法关闭这些请求',
                    icon: 'loading',
                    duration: 2000
                  })
                }
              },
              fail: function() {
                // fail
                console.log('fail: request close_helps')
                wx.showToast({
                  title: '请求失败，请先检查网络，稍后发送。',
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
  selectCheckbox: function(){
    var that = this;
    var is_checked = that.data.is_checked;
    if(is_checked == false){
      that.setData({is_checked: true})
    }else{
      that.setData({is_checked: false})
    }
  },
  setClipboard: function(){
    var clipboraddata = '任务名称： \n';
    clipboraddata = clipboraddata.concat(this.data.grouptodo.content, '\n布置时间：', this.data.grouptodo.time, '\n已完成： ', this.data.finish_count.toString(), ' 人。\n未完成： ', this.data.unfinish_count.toString(), '人。\n')
    var finish_man = '\n已经完成了任务的：\n';
    var unfinish_man = '\n还未完成任务的：\n';
    this.data.helps_in_grouptodo.map(function(help){
      if(help.is_finish == 'true'){
        finish_man = finish_man.concat(help.nickname, '\n')
      }else{
        unfinish_man = unfinish_man.concat(help.nickname, '\n')
      }
    })
    clipboraddata = clipboraddata.concat(unfinish_man, finish_man)
    wx.setClipboardData({
      data: clipboraddata,
      success: function (res) {
        wx.showToast({
          title: '成功将信息复制到剪贴板！'
        })
      }
    })
  }
})
