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
    tooker: '',
    flag: true,
    index: 0,
    url: '',
    ec: {
      lazyLoad: true
    },
    h2s: [],
    flax: true
    //data中配置
  },
  bindDateChange(e) {
    // console.log(e.detail.value)
    this.setData({
      date: e.detail.value,
    })
    this.hphist()
  },
  bindDateChange2(e) {
    this.setData({
      date2: e.detail.value,
    })
    this.hphist()
  },
  bindDateChange3(){
    console.log(1);
    
  },
  fresh() {
    wx.request({
      url: app.globalData.request_url + '/osdDeviceController/queryOsdDeviceByNumber?equipmentNumber=' + this.data.list.equipmentNumber,
      method: 'GET',
      success: (res) => {
        this.setData({
          list: res.data.data,
        })
        wx.showToast({
          title: '成功',
          duration: 2000
        })
      }
    })
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
        wx.showToast({
          title: '成功',
          duration: 2000
        })
      })
    })

  },
  hphist() {
    wx.request({
      url: app.globalData.request_url + 'osdDeviceHistoryController/queryOsdDeviceHistory?equipmentNumber=' + this.data.list.equipmentNumber + '&updateStart=' + this.data.date + '&updateDown=' + this.data.date2+'23:59:59',
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
      num: 3,
    })
  },
  gettookin() {
    wx.request({
      url: 'https://open.ys7.com/api/lapp/token/get',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      data: {
        appKey: "d1d839e1eee04b63908b1807a5bdba1a",
        'appSecret': "11b435ed63f8e5d47ead170a480c4d33"
      },
      success: (res) => {
        wx.setStorage({
          data: res.data.data.accessToken,
          key: 'token',
        })
      }
    })
  },
  getli() {
    wx.request({
      url: 'https://open.ys7.com/api/lapp/live/address/limited',
      method: 'POST',
      data: {
        accessToken: wx.getStorageSync('token'),
        deviceSerial: this.data.list.serial,
        channelNo: 1
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        this.setData({
          url: res.data.data.liveAddress
        })
        console.log(res);
      }
    })
  },
  onLoad: function (options) {
    if (!wx.getStorageSync('token')) {
      this.gettookin()
    } else {
    }
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
          var tooker = wx.getStorageSync('token')
          this.setData({
            url: 'http://hls01open.ys7.com/' + res.data.data.serial + '/1.hd.live&autoplay=1&accessToken=' + tooker + '&begin=20200421&end=20200421'
          })
        }
        // console.log(res.data.data);

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
        if (this.data.list.serial != null) {
          this.getli()
        }

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
    var liulist = []
    for (var i = 0; i < this.data.histlist.length; i++) {
      liulist.push({ value: [this.data.histlist[i].updateTime, this.data.histlist[i].h2s] })
    }
    
    var that = this
    // 前台配置折线线条表示属性
    // 使用for in 遍历对象拿出name,并配置icon和textStyle，最后放入新建的legendList数组中
    var option = {
      // 折线图线条的颜色
      dataZoom: [{
        type: 'slider',
        show: true, // flase直接隐藏图形
        xAxisIndex: [0],

        bottom: -5,
        start: 70, // 滚动条的起始位置
        end: 100 // 滚动条的截止位置（按比例分割你的柱状图x轴长度）
      },
      {
        type: 'inside'
      }
      ],
      xAxis: {
        type: 'time',
        axisLabel: {
          textStyle: {
            color: '#ffffff'
          }
        },

        // splitNumber:12
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
        data: liulist,
        type: 'line'
      }],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          },
        },
      },
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