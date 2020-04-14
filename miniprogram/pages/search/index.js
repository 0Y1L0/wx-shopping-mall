import { request } from "../../request/index.js";

const throttle = (fn, delay)=>{
	let timer = null
	return (...args) => {
		clearTimeout(timer)
		timer = setTimeout(() => fn(...args), delay)
	}
}

Page({
	data: {
		goods: [],
		isFocus: false,
		inputValue: ''
	},

	onLoad(){
		this.throttle = throttle(this.qsearch, 1000)
	},

	handleInput(e){
		const { value } = e.detail

		if(!value.trim()){
			this.setData({
				goods: [],
				isFocus: false
			})
			return;
		}

		this.setData({
			isFocus: true
		})

		this.throttle(value)	
	},

	async qsearch(query) {
		console.log('qsearch', 'res', query);

		const res = await request({ url: "/goods/qsearch", data: { query } });
		this.setData({
			goods: res
		})
	},

	handleCancel() {
		this.setData({
			inpValue: "",
			isFocus: false,
			goods: []
		})
	}
})