// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
	traceUser: true,
	env: 'test-j7dxf'
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
	const { dataBaseName, record} = event
	// return db.collection("category").add({
	// 	data: {
	// 		...record
	// 	}
	// })
}