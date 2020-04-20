// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
	traceUser: true,
	env: 'test-j7dxf'
})

const db = cloud.database()
const category = db.collection('category')
// 云函数入口函数
exports.main = async (event, context) => {
	const {data: categoty} = await category.where({
		cat_pid: 0
	}).get()

	const returnData = await Promise.all(categoty.map(async item=>{
		let {data: children} = await category.where({
			cat_pid: item.cat_id
		}).get()
		item.children = children

		children = await Promise.all(children.map(async item => {
		  let { data: deepChildren } = await category.where({
		  	cat_pid: item.cat_id
		  }).get()
		  item.children = deepChildren
		  return item
		}))
		return item
	}))
 
	return returnData
}