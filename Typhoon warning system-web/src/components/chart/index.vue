<template>
  <div class="chart-panel" v-show="tfbh">
    <div class="title">
      气压图
    </div>
    <div class="chart" ref="chart1"></div>
    <div class="title">
      风速图
    </div>
    <div class="chart" ref="chart2"></div>
    <div class="title">
      城市测距
    </div>
    <div class="chart table">
      <el-table
          :data="cityDistance"
          height="250"
          style="width: 100%"
      >
        <el-table-column prop="city" label="城市"  width="180" />
        <el-table-column label="距离">
          <template #default="scope">
            {{ scope.row.dis + 'km' }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import cityDistance from '../../data/city-distance.json'

let chart1 = null, chart2 = null

Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,                 //月份
    "d+": this.getDate(),                    //日
    "h+": this.getHours(),                   //小时
    "m+": this.getMinutes(),                 //分
    "s+": this.getSeconds(),                 //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
};

export default {
  name: "ChartPanel",
  props: {
    tfbh: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      typhoonData: [],
      cityDistance: cityDistance
    }
  },
  mounted() {
    chart1 = echarts.init(this.$refs.chart1);
    chart2 = echarts.init(this.$refs.chart2);
    this.getTyphoonData()
    // this.getCityDistance()
  },
  methods: {
    // getCityDistance() {
    //   const url = '../../data/city-distance.json'
    //   fetch(url).then(res => res.json()).then(res => {
    //     this.cityDistance = res
    //   })
    // },
    getTyphoonData() {
      const url = `https://lzugis.cn/v2/data/complex/${this.tfbh}.json`
      fetch(url).then(res => res.json()).then(res => {
        this.typhoonData = res[0].points
        let times = [], ws = [], prs = []
        this.typhoonData.forEach(d => {
          times.push(new Date(d.time).format('yyyy-MM-dd hh:mm'))
          ws.push(d.speed)
          prs.push(d.pressure)
        })

        chart1.setOption(this.getChartOption({
          name: '气压',
          unit: 'mPa'
        }, times, prs));
        chart2.setOption(this.getChartOption({
          name: '风速',
          unit: 'm/s'
        }, times, ws));
      })
    },
    getChartOption(option, times, datas) {
      return {
        grid: {
          left: "5%",
          right: "5%",
          top: "15",
          bottom: "2%",
          containLabel: true,
        },
        tooltip: {
          show: true,
          trigger: "axis",
          transitionDuration: 0,
          axisPointer: {
            type: "line",
            lineStyle: {
              color: "rgba(50, 216, 205, 1)",
            },
          },
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: 0,
            axisLine: {
              show: false,
            },
            axisLabel: {
              color: "#A1A7B3",
              formatter:function(value) {
                return new Date(value).format('hh:ss')
              }
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            data: times
          },
        ],
        yAxis: [
          {
            type: "value",
            name: `单位(${option.unit})`,
            nameTextStyle: {
              color: "#fff",
              align: "right"
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: "#A1A7B3",
                type: "dashed",
              },
            },
            axisLine: {
              show: false,
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#A1A7B3",
              },
            },
            axisTick: {
              show: false
            },
          },
        ],
        series: [
          {
            name: option.name,
            type: "line",
            smooth: true,
            symbolSize: 5,
            showSymbol: false,
            itemStyle: {
              normal: {
                color: "#23D0C4",
                lineStyle: {
                  color: '#38cf8f',
                  width: 2
                },
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [
                      {
                        offset: 0,
                        color: 'rgba(51, 192, 132, 1)',
                      },
                      {
                        offset: 0.5,
                        color: 'rgba(51, 192, 132, .5)',
                      },
                      {
                        offset: 1,
                        color: 'rgba(51, 192, 132, .1)',
                      },
                    ],
                    false
                ),
              },
            },
            data: datas
          },
        ]
      }
    }
  }
}
</script>

<style scoped lang="scss">
.chart-panel {
  width: 20rem;
  overflow: hidden;
  position: absolute;
  top: 2rem;
  left: 2rem;
  background-color: white;
  padding: 1rem;
  font-size: 14px;
  .title {
    font-weight: bold;
    padding: 0.4rem 0;
    &:first-child {
      padding-top: 0;
    }
  }
  .chart {
    width: 100%;
    height: 7rem;
    &.table {
      height: auto;
    }
  }
}
</style>