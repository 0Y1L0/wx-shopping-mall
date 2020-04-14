// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
	traceUser: true,
	env: 'test-j7dxf'
})

const db = cloud.database()
const images = db.collection('index-image')
// 云函数入口函数
exports.main = async (event, context) => {
	const { openType, floor_pid } = event
	const params = {
		open_type: openType,
		floor_pid: floor_pid
	}
	if ((typeof event.floor_pid) !== 'number'){
		delete params.floor_pid
	}

	return await images.where({
		...params
  }).get()
}