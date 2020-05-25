// pages/tabOne/tabOne.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    markers:[]
  },
  // getHospitalMarkers(res) {
  //   let markers = [];
  //   console.log(res.data.data);
    
  //   for (let item of res.data.data) {
  //     let marker = this.createMarker(item);
  //     markers.push(marker)
  //   }
  //   console.log(markers);
    
  //   return markers;
  // },
  // createMarker(point) {
  //   let latitude = point.latitude;
  //   let longitude = point.longitude;
  //   let marker = {
  //     iconPath: "/image/location.png",
  //     id: point.id || 0,
  //     name: point.name || '',
  //     latitude: latitude,
  //     longitude: longitude,
  //     width: 25,
  //     height: 48
  //   };
  //   return marker;
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.request({
    //   url: app.globalData.request_url +'osdDeviceController/queryOsdDevice',
    //   method: 'GET',
    //   success:(res)=>{
    //     this.setData({
    //       list:res.data.data,
    //       markers: this.getHospitalMarkers(res)
    //     })
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})