import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
	data: {
		address: {},
		cart: [],
		allChecked: false,
		totalPrice: 0,
		totalNum: 0
	},
	onShow() {
		const address = wx.getStorageSync("address");
		const cart = wx.getStorageSync("cart") || [];

		this.setData({ address });
		this.setCart(cart);

	},
	// 点击 收货地址
	async handleChooseAddress() {
		try {
			const res1 = await getSetting();
			const scopeAddress = res1.authSetting["scope.address"];
			if (scopeAddress === false) {
				await openSetting();
			}
			// let address = await chooseAddress();
			wx.chooseLocation({
				success(res) {
				  const latitude = res.latitude
          const longitude = res.longitude
          const speed = res.speed
          const accuracy = res.accuracy
			  }
			})

			// address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;

			// wx.setStorageSync("address", address);

		} catch (error) {
			console.log(error);
		}
	},

	// 商品选中
	handeItemChange(e) {
		const goods_id = e.currentTarget.dataset.id;
		let { cart } = this.data;
		let index = cart.findIndex(v => v.goods_id === goods_id);
		cart[index].checked = !cart[index].checked;

		this.setCart(cart);

	},
	// 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
	setCart(cart) {
		let allChecked = true;
		let totalPrice = 0;
		let totalNum = 0;
		cart.forEach(v => {
			if (v.checked) {
				totalPrice += v.num * v.goods_price;
				totalNum += v.num;
			} else {
				allChecked = false;
			}
		})
		allChecked = cart.length != 0 ? allChecked : false;
		this.setData({
			cart,
			totalPrice, totalNum, allChecked
		});
		wx.setStorageSync("cart", cart);
	},

	// 商品全选
	handleItemAllCheck() {
		let { cart, allChecked } = this.data;
		allChecked = !allChecked;
		cart.forEach(v => v.checked = allChecked);
		this.setCart(cart);
	},

	// 商品数量的编辑
	async handleItemNumEdit(e) {
		const { operation, id } = e.currentTarget.dataset;
		let { cart } = this.data;
		const index = cart.findIndex(v => v.goods_id === id);
		if (cart[index].num === 1 && operation === -1) {
			const res = await showModal({ content: "您是否要删除？" });
			if (res.confirm) {
				cart.splice(index, 1);
				this.setCart(cart);
			}
		} else {
			cart[index].num += operation;
			this.setCart(cart);
		}
	},

	// 结算 
	async handlePay() {
		const { address, totalNum } = this.data;
		if (!address.userName) {
			await showToast({ title: "您还没有选择收货地址" });
			return;
		}
		if (totalNum === 0) {
			await showToast({ title: "您还没有选购商品" });
			return;
		}

		wx.navigateTo({
			url: '/pages/pay/index'
		});

	}
})