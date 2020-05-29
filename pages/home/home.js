// pages/home/home.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: [],//下拉列表的数据
    index: 0,//选择的下拉列表下标
    list1: null,
    freshStatus: 'more', // 当前刷新的状态
    showRefresh: false   // 是否显示下拉刷新组件
  },
  myChange() {
    if (this.data.selectData[this.data.index] == '全部') {
      this.setData({ list1: this.data.list })
    } else {
      var list1 = this.data.list.filter(item => {
        return (
          item.workArea.includes(this.data.selectData[this.data.index])
        )
      })
      this.setData({ list1: list1 })
    }

  },
  myChange11(e) {
    var list1 = this.data.list.filter(item => {
      if (item.equipmentName !== null) {
        return (
          item.equipmentNumber.includes(e.detail.value) ||
          item.equipmentName.includes(e.detail.value)
        )
      }
    })
    this.setData({
      list1: list1
    })
  },
  xiangqing(e) {
    wx.navigateTo({
      url: '/pages/details/details?data1=' + e.currentTarget.dataset.location
    })
  },
  touchStart(e) {
    this.setData({
      startY: e.changedTouches[0].pageY,
      freshStatus: 'more'
    })
  },
  // 触摸移动
  touchMove(e) {
    let endY = e.changedTouches[0].pageY;
    let startY = this.data.startY;
    let dis = endY - startY;
    // 判断是否下拉
    if (dis <= 0) {
      return;
    }
    let offsetTop = e.currentTarget.offsetTop;
    if (dis > 20) {
      this.setData({
        showRefresh: true
      }, () => {
        if (dis > 50) {
          this.setData({
            freshStatus: 'end'
          })
        } else {
          this.setData({
            freshStatus: 'more'
          })
        }
      })
    } else {
      this.setData({
        showRefresh: false
      })
    }
  },
  // 触摸结束
  touchEnd(e) {
    if (this.data.freshStatus == 'end') {
      // 延迟 500 毫秒，显示 “刷新中”，防止请求速度过快不显示
      setTimeout(() => {
        wx.request({
          url: app.globalData.request_url + 'osdDeviceController/queryOsdDevice',
          method: 'GET',
          success: (res) => {
            this.setData({
              list: res.data.data
            })
            var all = []

            all.push('全部')
            this.data.list.forEach(item => {
              all.push(item.workArea);
              if (item.equipmentStatus === "1") {
                item.state = true;
              } else if (item.equipmentStatus === "0") {
                item.state = false;
              }
            })
            var selectData = [...new Set(all)]
            this.setData({
              selectData: selectData
            })
            this.myChange()
            this.setData({
              showRefresh: false
            })
          }
        })
      }, 500);
    } else {
      this.setData({
        showRefresh: false
      })
    }
  },
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show
    });
    this.myChange()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: app.globalData.request_url + 'osdDeviceController/queryOsdDevice',
      method: 'GET',
      success: (res) => {
        res.data.data.forEach(item=>{
          if(item.equipmentName==null){
            item.equipmentName = ''
          }
        })
        this.setData({
          list: res.data.data
        })
        var all = []
        all.push('全部')
        this.data.list.forEach(item => {
          all.push(item.workArea);
          if (item.equipmentStatus === "1") {
            item.state = true;
          } else if (item.equipmentStatus === "0") {
            item.state = false;
          }
        })
        var selectData = [...new Set(all)]
        this.setData({
          selectData: selectData
        })
        this.myChange()
      }
    })
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