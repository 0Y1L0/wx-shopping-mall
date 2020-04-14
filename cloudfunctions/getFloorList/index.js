// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
	traceUser: true,
	env: 'test-j7dxf'
})

// 云函数入口函数
exports.main = async (event, context) => {
	const res = await cloud.callFunction({
		name: 'getIndexImages',
		data: {
			openType: 'floor_title'
		}
	})
	const { result } = res
	const floorTitle = result.data

	return await Promise.all(
		floorTitle.map(async floor => {
			const floors = {}
			floors.floor_title = floor

			productList = await cloud.callFunction({
				name: 'getIndexImages',
				data: {
					openType: 'floor_item',
					floor_pid: floor.id
				}
			})

			floors.product_list = productList.result.data
			return floors
		})
	)
}