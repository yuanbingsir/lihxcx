// pages/details/details.js
const app = getApp();
import * as echarts from '../../ec-canvas/echarts';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    list: [],
    longitude: '',
    latitude: '',
    markers: [],
    date: '',//默认起始时间  
    date2: '',//默认结束时间 
    histlist: [],
    time: [],
    flag: true,
    index:0,
    ec: {
      lazyLoad: true
    },
    h2s: [],
    flax: true
    //data中配置
  },
  bindDateChange(e) {
    let that = this;
    console.log(e.detail.value)
    that.setData({
      date: e.detail.value,
    })
  },
  bindDateChange2(e) {
    let that = this;
    that.setData({
      date2: e.detail.value,
    })
    this.hphist()
  },
  fresh(){
    this._success()
  },
  conversion1() {
    this.setData({
      num: 1
    })
  },
  Manual() {
    this.setData({
      flag: false
    })
  },
  _error() {
    this.setData({
      flag: true
    })
  },
  _success() {
    wx.request({
      url: app.globalData.request_url + '/osdTaskController/handGather?equipmentNumber=' + this.data.list.equipmentNumber,
      method: 'GET',
      success: (res => {
        this.setData({
          flag: true
        })
      })
    })

  },
  hphist() {
    wx.request({
      url: app.globalData.request_url + 'osdDeviceHistoryController/queryOsdDeviceHistory?equipmentNumber=' + this.data.list.equipmentNumber + '&updateStart=' + this.data.date + '&updateDown=' + this.data.date2,
      method: 'GET',
      success: (res) => {
        this.setData({
          histlist: res.data.data
        })
        var h2s = []
        var time = []
        for (var i = 0; i < this.data.histlist.length; i++) {
          h2s.push(parseFloat(this.data.histlist[i].h2s));
          time.push(this.data.histlist[i].updateTime)
        }
        this.setData({
          h2s: h2s,
          time: time
        })
        this.echartsComponnet = this.selectComponent('#mychart');
        this.init_echarts()
      }
    })
  },
  conversion2() {
    this.setData({
      num: 2
    }),
      this.hphist()

  },
  conversion3() {
    this.setData({
      num: 3
    })
  },
  gettookin() {
    wx.request({
      url: 'https://open.ys7.com/api/lapp/token/get',
      method: 'POST',
      data: {
        'appKey': "d1d839e1eee04b63908b1807a5bdba1a",
        'appSecret': "f863ca7459997202bfa7b4083dc2b1d5"
      },
      success: (res) => {

      }
    })
  },
  onLoad: function (options) {
    this.gettookin()
    let data1 = options.data1;
    wx.request({
      url: app.globalData.request_url + '/osdDeviceController/queryOsdDeviceByNumber?equipmentNumber=' + data1,
      method: 'GET',
      success: (res) => {
        if (res.data.data.serial === null) {
          this.setData({
            flax: false
          })
        } else {

        }
        console.log(res.data.data);

        var timestamp = Date.parse(new Date());
        var date = new Date(timestamp);
        //获取年份  
        var Y = date.getFullYear();
        //获取月份  
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        //获取当日日期 
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        var E = D - 7
        var data4 = Y + '-' + M + '-' + D
        var data5 = Y + '-' + M + '-' + E
        this.setData({
          list: res.data.data,

          date: data5,
          date2: data4,
          longitude: res.data.data.longitude,
          latitude: res.data.data.latitude,
          markers: [{
            longitude: res.data.data.latitude,
            latitude: res.data.data.longitude,
          }]
        })
      }
    })
  },
  init_echarts: function () {
    this.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      const Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      Chart.setOption(this.getOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return Chart;
    });

  },
  getOption: function () {
    var that = this
    // 前台配置折线线条表示属性
    // 使用for in 遍历对象拿出name,并配置icon和textStyle，最后放入新建的legendList数组中
    var option = {
      // 折线图线条的颜色
      xAxis: {
        type: 'category',
        data: that.data.time.reverse(),
        axisLabel: {
          textStyle: {
            color: '#ffffff'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          textStyle: {
            color: '#ffffff'
          }
        }
      },
      series: [{
        data: that.data.h2s.reverse(),
        type: 'line',
        smooth: true
      }]
    }
    return option
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