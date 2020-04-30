// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
	traceUser: true,
	env: 'test-j7dxf'
})

const db = cloud.database()
const cart = db.collection('cart')
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { cartGoods } = event
  const { OPENID: openid } = wxContext
  
  return cart.add({
  	data: {
      _id: openid,
  		...cartGoods
  	}
  })
	// return cart.add({
	// 	data: {
  //     _id: openid,
	// 		...cartGoods
	// 	}
	// })
}