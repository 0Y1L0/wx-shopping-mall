import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
const app = getApp()

Page({
  data: {
    goodsObj: {},
    isCollect: false
  },
  GoodsInfo: {},

  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const { goods_id } = options;
    this.getGoodsDetail(goods_id);
  },

  async getGoodsDetail(goods_id) {
    const goodsInfo = await request({ url: "/goods/detail", data: { goods_id } });
    this.GoodsInfo = goodsInfo;
    let collect = wx.getStorageSync("collect") || [];

    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    const { goods_name, goods_price, pics, goods_introduce } = goodsInfo
    this.setData({
      goodsObj: {
        goods_name,
        goods_price,
        // iphone部分手机 不识别 webp图片格式 
        goods_introduce: goods_introduce.replace(/\.webp/g, '.jpg'),
        pics
      },
      isCollect
    })
  },
  // 放大预览
  handlePrevewImage(e) {
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });

  },
  // 加入购物车
  handleCartAdd() {
    let cart = wx.getStorageSync("cart") || [];
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      const { goods_id, goods_name, goods_price, goods_small_logo, goods_number } = this.GoodsInfo
      const goodsInfo = {
        num: 1,
        checked: false,
        goods_id,
        goods_name,
        goods_price,
        goods_small_logo,
        goods_number
      }
      cart.push(goodsInfo);
    } else {
      cart[index].num++;
    }
    // wx.setStorageSync("cart", cart);
    wx.cloud.callFunction({
      name: 'addToCard',
      data: {
        cart
      }
    }).then(({ result })=>{
			console.log(result)
    })
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true
    });
  },

  // 商品收藏
  handleCollect() {
    let isCollect = false;
    let collect = wx.getStorageSync("collect") || [];
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id); 
    if (index !== -1) {
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      });
    } else {
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    wx.setStorageSync("collect", collect);
    this.setData({
      isCollect
    })
  }
})