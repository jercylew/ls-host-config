import React, { Component } from 'react';
import ReactECharts from 'echarts-for-react';
import { Form } from 'react-bootstrap';
import AxiosClient from '../../lib/AxiosClient';
import HomeUrlPrefix from '../HomeUrlPrefix';
import { Link } from 'react-router-dom';
import { CSVLink } from "react-csv";

//ECharts
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);

const numToPaddedText = (num) => {
  return num > 9 ? num.toString() : ('0' + num);
};

const mean = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
const colorPriority = ['#00ff00', '#ffbf00', '#ff0000', '#db7d2a', '#2adbd5', '#2a36db', '#c42adb'];
const getISODateTime = (date, time) => {
  return `${date.replace(/-/g, '')}T${time.replace(/:/g, '')}Z`;
};

const urlPrefix = HomeUrlPrefix();

export class VoltameterView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current_data: {
        categoryData: [],
        valueData: [],
        changePoints: [],
        clusterPoints: [],
        clusterResult: [],
        maxValue: 0.0,
      },
    };

    this.loadData = this.loadData.bind(this);
  }

  loadData() {
    // let payload = {
    //   scene_id: this.state.sceneId,
    //   id: this.state.devId,
    //   type: parseInt(this.state.devType),
    //   date: this.state.date,
    //   cluster: parseInt(this.state.clusterNum),
    // };
    // console.log(payload);
    // AxiosClient.post('/v1/test/current/seg-data', payload)
    //   .then(res => {
    //     console.log('Got current data:' + res.data);
    //     let resData = res.data;
    //     if (resData.state === 0) {
    //       let currentData = resData.data;

    //       if (currentData.is_succeed) {
    //         //category data
    //         let categoryData = [];
    //         for (let sampleTime of currentData.time) {
    //           categoryData.push(`${this.state.date} ${sampleTime}`);
    //         }

    //         this.updateClusterColors(currentData.cluster_result);
    //         this.setState({
    //           current_data: {
    //             categoryData: categoryData,
    //             valueData: currentData.signal,
    //             changePoints: currentData.change_points,
    //             clusterPoints: currentData.cluster_pts,
    //             clusterResult: currentData.cluster_result,
    //             maxValue: Math.max(...currentData.signal)
    //           }
    //         });
    //         this.fillCSVData(currentData.cluster_pts, categoryData, currentData.signal,
    //           currentData.cluster_result);
    //       }
    //       else {
    //         alert('暂无数据');
    //       }
    //     }
    //     else {
    //       console.log('Failed to get current seg data: ' + resData.message);
    //       alert('获取电流数据失败!');
    //     }
    //   }).catch(err => {
    //     console.log(err);
    //     alert('获取电流数据失败!');
    //   });
  }

  componentDidMount() {
    setTimeout(() => {
      this.loadData();
    }, 1000);
  }

  componentWillUnmount() {
  }

  render() {
    let series_color = ['#5470C6'];
    let series_data = [{
      type: 'line',
      data: this.state.current_data.valueData,
      // Set `large` for large data amount
      large: true
    }];

    let seg_color1 = '#D9E6FC';
    let seg_color2 = '#FCD9E3';
    let pre = this.state.current_data.categoryData[0];
    let color_use_1 = true;
    for (let pts of this.state.current_data.changePoints) {
      let seg_series = {
        name: '',
        type: 'line',
        smooth: true,
        itemStyle: {
          normal: {
            areaStyle: {
              type: 'default'
            }
          }
        },
        data: [
          [pre, this.state.current_data.maxValue],
          [this.state.current_data.categoryData[pts], this.state.current_data.maxValue]
        ]
      };
      series_data.push(seg_series);

      let seg_color = color_use_1 ? seg_color1 : seg_color2;
      series_color.push(seg_color);

      color_use_1 = !color_use_1;
      pre = this.state.current_data.categoryData[pts];
    }

    let tableRecords = [];
    let clusterSummary = {};
    for (let i = 0; i < this.state.current_data.clusterPoints.length; i++) {
      let point = this.state.current_data.clusterPoints[i];
      let prePoint = (i > 0) ? this.state.current_data.clusterPoints[i - 1] : null;
      let seg_series = {
        name: '',
        type: 'line',
        smooth: true,
        itemStyle: {
          normal: {
            areaStyle: {
              type: 'default'
            }
          }
        },
        data: [
          [this.state.current_data.categoryData[point[0]], this.state.current_data.maxValue],
          [this.state.current_data.categoryData[point[1]], this.state.current_data.maxValue]
        ]
      };
      series_data.push(seg_series);
      let seg_color = this.state.clusterColors[this.state.current_data.clusterResult[i] - 1];
      series_color.push(seg_color);

      let dtStart = new Date(this.state.current_data.categoryData[point[0]]);
      let dtEnd = new Date(this.state.current_data.categoryData[point[1]]);
      let timeDiffSec = parseInt(((dtEnd - dtStart) / 1000.0).toFixed());

      let timeIntervalSec = 0;
      if (prePoint !== null) {
        dtStart = new Date(this.state.current_data.categoryData[prePoint[1]]);
        dtEnd = new Date(this.state.current_data.categoryData[point[0]]);
        timeIntervalSec = parseInt(((dtEnd - dtStart) / 1000.0).toFixed());
      }

      let clstVal = this.state.current_data.clusterResult[i];
      let tableRecord = {
        startTime: this.state.current_data.categoryData[point[0]].substring(11, 19),
        endTime: this.state.current_data.categoryData[point[1]].substring(11, 19),
        cluster: clstVal,
        timeSpan: timeDiffSec,
        dataMean: mean(this.state.current_data.valueData.slice(point[0], point[1])).toFixed(3),
        dataMax: Math.max(...this.state.current_data.valueData.slice(point[0], point[1])),
        timeInterval: timeIntervalSec
      }
      tableRecords.push(tableRecord);


      if (clusterSummary[clstVal]) {
        clusterSummary[clstVal].time += timeDiffSec;
        clusterSummary[clstVal].count += 1;
      } else {
        clusterSummary[clstVal] = {
          time: timeDiffSec,
          count: 1
        }
      }
    }

    let clusterSummaries = Object.entries(clusterSummary);
    let tableSummaries = [];
    for (let s of clusterSummaries) {
      let record = {
        cluster: s[0],
        count: s[1].count,
        meanTime: (s[1].time / s[1].count).toFixed(),
        totalTime: s[1].time
      }
      tableSummaries.push(record);
    }

    let chart_option = {
      color: series_color,
      title: {
        text: echarts.format.addCommas(this.state.current_data.categoryData.length.toString()) + ' Points',
        left: 10
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: false
          },
          saveAsImage: {
            pixelRatio: 2
          }
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        bottom: 90
      },
      dataZoom: [
        {
          type: 'inside'
        },
        {
          type: 'slider'
        }
      ],
      xAxis: {
        data: this.state.current_data.categoryData,
        silent: false,
        splitLine: {
          show: false
        },
        splitArea: {
          show: false
        }
      },
      yAxis: {
        splitArea: {
          show: false
        }
      },
      series: series_data
    };

    return (
      <div>
        <div className="page-header">
          <h3 className="page-title">
            电流监测
          </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>演示</a></li>
              <li className="breadcrumb-item active" aria-current="page">智能电量仪数据</li>
            </ol>
          </nav>
        </div>
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title"> 电参量曲线 </h4>
                
              </div>
              <div className="card-body">
                <ReactECharts
                  option={chart_option}
                  notMerge={true}
                  lazyUpdate={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default VoltameterView
