const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
	traceUser: true,
	env: 'test-j7dxf'
})

exports.main = (event, context) => {
  console.log(event)
  console.log(context)

  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    env: wxContext.ENV,
  }
}

