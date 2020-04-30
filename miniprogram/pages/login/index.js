//index.js
//获取应用实例
const app = getApp()

Page({
	data: {
		motto: 'Hello World',
		userInfo: {},
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo')
	},
	//事件处理函数
	bindViewTap() {
		wx.navigateTo({
			url: '../logs/logs'
		})
	},
	/**

  * 生命周期函数--监听页面加载

  */
  async onLoad(options) {
    await this.onGetOpenid()
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          wx.switchTab({url: '../index/index' })
        } else {
          //用户没有授权
          console.log("用户没有授权");
        }
      }
    });
   },
  
  async bindGetUserInfo(res) {
    if (res.detail.userInfo) {
      console.log("用户的信息如下：");
      app.globalData.userInfo = res.detail.userInfo
      wx.switchTab({url: '../index/index' })
     } else {
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法查看个人信息，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: res=> {
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
   },

  onGetOpenid() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
})
