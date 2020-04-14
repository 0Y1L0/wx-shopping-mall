import { request } from "../../request/index.js";
Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航 数组
    catesList:[],
    // 楼层数据
    floorList:[]
  },

  onLoad: function (options) {
    // 1 发送异步请求获取轮播图数据  优化的手段可以通过es6的 promise来解决这个问题 
    // wx.request({
    //   url: 'https://api.zbztb.cn/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   }
    // });
    
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
      
  },

  // 获取轮播图数据
  getSwiperList(){
		wx.cloud.callFunction({
			name: 'getIndexImages',
			data: {
				openType: 'swiper'
			}
		}).then(({ result })=>{
			this.setData({
				swiperList: result.data
			})
		})
  },
  // 获取 分类导航数据
  getCateList(){
		wx.cloud.callFunction({
			name: 'getIndexImages',
			data: {
				openType: 'switchTab'
			}
		}).then(({ result })=>{
			this.setData({
				catesList: result.data
			})
    })
  },
  // 获取 楼层数据
  getFloorList(){
		wx.cloud.callFunction({
			name: 'getFloorList'
		}).then(res => {
			this.setData({
				floorList: res.result
			})
		})
			// const floorTitle = result.map((res, index)=>{
			// 	res.floor_title.open_type = 'floor_title'
			// 	res.floor_title.id = index
			// 	return res.floor_title
			// })

			// const floorItem = result.map((res, index) => {
			// 	const floorItem = res.product_list.map(item => {
			// 		item.open_type = 'floor_item'
			// 		item.floor_pid = index
			// 		return item
			// 	})
			// 	return floorItem
			// })
			// console.log(floorTitle, floorItem)
    // })
  },
})
