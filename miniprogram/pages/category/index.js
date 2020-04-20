import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
	data: {
		// 左侧的菜单数据
		leftMenuList: [],
		// 右侧的商品数据
		rightContent: [],
		// 被点击的左侧的菜单
		currentIndex: 0,
		// 右侧内容的滚动条距离顶部的距离
		scrollTop: 0
	},
	// 接口的返回数据
	Cates: [],

	onLoad: function (options) {
		const Cates = wx.getStorageSync("cates");
		if (!Cates) {
			this.getCates();
		} else {
			if (Date.now() - Cates.time > 1000 * 60 * 5) {
				this.getCates();
			} else {
				this.Cates = Cates.data;
				let leftMenuList = this.Cates.map(v => v.cat_name);
				let rightContent = this.Cates[0].children;
				this.setData({
					leftMenuList,
					rightContent
				})
			}
		}
	},

	async getCates() {
		wx.cloud.callFunction({
			name: 'getCategory'
		}).then(({result})=>{
			this.Cates = result;
			wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
			let leftMenuList = this.Cates.map(v => v.cat_name);
			let rightContent = this.Cates[0].children;
			this.setData({
				leftMenuList,
				rightContent
			})
		})
	},

	handleItemTap(e) {
		const { index } = e.currentTarget.dataset;

		let rightContent = this.Cates[index].children;
		this.setData({
			currentIndex: index,
			rightContent,
			scrollTop: 0
		})

	}
})