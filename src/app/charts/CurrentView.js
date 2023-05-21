import React, { Component, useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AxiosClient from '../../lib/AxiosClient';
import HomeUrlPrefix from '../HomeUrlPrefix';
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

const startVideoStream = async (sceneId, devType, startTime, endTime) => {
  console.log(`Scene: ${sceneId}, devId: ${devType}, startTime: ${startTime}, endTime: ${endTime}`);

  let data = {
      scene_id: sceneId,
      dev_type: devType,
      start_time: startTime,
      end_time: endTime,
  };

  try {
    let resp = await AxiosClient.post('/v1/test/current/start-video', data);
    if (resp) {
      console.log('Start video stream: ', resp);
    }
  }
  catch (ex) {
    console.log('startVideoStream: Failed to start video streaming, ', ex);
  }
  
  // .then(resp => {
  //     console.log('startVideoStream: ' + JSON.stringify(resp));
  // })
  //     .catch(error => {
  //         alert('视频启动失败: ' + error.message);
  //     });
};

const getHumanReadableTime = (datetime) => {
  try {
    const words = datetime.split('T');
    const time = words[1];
    return `${time.substring(0, 2)}:${time.substring(2, 4)}:${time.substring(4, 6)}`;
  }
  catch (ex) {
    return '';
  }
};

function CurrentVideoModal(props) {
  const [videoUrl, setVideoUrl] = React.useState('http://192.168.0.54/live?port=1935&app=tkt_test&stream=jiulongdczb_ch0');
  const videoRef = useRef(null);
  const [chartFullWidth, setChartFullWidth] = React.useState(false);

  let xData = [];
  let yData = [];

  for (let x of props.linedatax) {
    xData.push(x.substring(11));
  }
  for (let y of props.linedatay) {
    yData.push(y);
  }
  let chartOption = {
    title: {
      text: `${props.starttime} - ${props.endtime}`,
      // subtext: `${props.starttime} - ${props.endtime}`,
    },
    xAxis: {
      type: 'category',
      data: xData
    },
    yAxis: {
      type: 'value',
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
    series: [
      {
        data: yData,
        type: 'line',
        color: props.clusterColor,
      },
    ],
  };

  useEffect(() => {
    setTimeout(() => {
      if (!props.show) {
        return;
      }
      setChartFullWidth(true);
    }, 500);
  });

  useEffect(() => {
    console.log('CurrentVideoModal: ', props);
    setTimeout(() => {
      if (!props.show) {
        return;
      }
      if (!videoRef.current) {
        return;
      }

      // if (flvJs.isSupported()) {
      //   const player = flvJs.createPlayer({
      //     type: 'flv',
      //     isLive: true,
      //     cors: true,
      //     hasVideo: true,
      //     url: videoUrl,
      //   });
      //   if (player) {
      //     console.log("Now load and play the video ...");
      //     player.attachMediaElement(videoRef.current);
      //     player.load();
      //     player.play();
      //   }
      // }
      // alert(props.videoUrl);
    }, 2500);
  });

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="modal-80w modal-70h"
      onHide={() => {
        setChartFullWidth(false);
        props.onHide();
      }}
      centered
    >
      <Modal.Header closeButton={false}>
        <Modal.Title id="contained-modal-title-vcenter">
          视频回放
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="template-demo text-center">
          <video ref={videoRef} autoPlay={true} muted={true} width={'50%'} height={'30%'} controls>
            <source src={props.videoUrl}
              type="video/mp4"></source>
            {`Your browser is too old which doesn't support HTML5 video.`}
          </video>
        </div>
        <ReactECharts
          option={chartOption}
          notMerge={true}
          lazyUpdate={true}
          style={{ marginTop: '0px', width: chartFullWidth ? '100%' : '0px' }}
          opts={{ renderer: 'svg' }}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => {
          setChartFullWidth(false);
          props.onHide();
        }}>关闭</Button>
      </Modal.Footer>
    </Modal>
  );
}

export class CurrentView extends Component {
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
      devId: '',
      devType: '0',
      sceneId: '',
      date: '',
      meshName: '',
      avaiDevIDs: [],
      avaiDevTypes: [],
      avaiScenes: [],
      avaiMeshes: [],
      clusterColors: [],
      clusterNum: '0',
      csvData: [
        ["起始时间", "结束时间", "类型", "时长(秒)", "均值", "最大值", "平均间隔(秒)"],
      ],
      isVideoDialogOpen: false,
      videoStartTime: '',
      videoEndTime: '',
      videoLoc: [0, 0],
      videoUrl: '',
      clusterColor: '#c0ffc0',
    };

    this.handleBtnUpdateCurrentChart = this.handleBtnUpdateCurrentChart.bind(this);
    this.handleInputDateChange = this.handleInputDateChange.bind(this);
    this.handleInputDevIdChange = this.handleInputDevIdChange.bind(this);
    this.handleInputMeshChange = this.handleInputMeshChange.bind(this);
    this.handleInputSceneChange = this.handleInputSceneChange.bind(this);
    this.handleInputDevTypeChange = this.handleInputDevTypeChange.bind(this);
    this.handleInputClusterNumChange = this.handleInputClusterNumChange.bind(this);
    this.updateClusterColors = this.updateClusterColors.bind(this);
    this.loadData = this.loadData.bind(this);
    this.loadDevs = this.loadDevs.bind(this);
    this.fillCSVData = this.fillCSVData.bind(this);
    this.openVideoDialog = this.openVideoDialog.bind(this);
    this.handleVideoDialogClose = this.handleVideoDialogClose.bind(this);
    this.getVideoUrl = this.getVideoUrl.bind(this);
  }

  fillCSVData(clusterPoints, categoryData, valueData, clusterResult) {
    let csvRecords = [];

    for (let i = 0; i < clusterPoints.length; i++) {
      let point = clusterPoints[i];
      let prePoint = (i > 0) ? clusterPoints[i - 1] : null;

      let dtStart = new Date(categoryData[point[0]]);
      let dtEnd = new Date(categoryData[point[1]]);
      let timeDiffSec = parseInt(((dtEnd - dtStart) / 1000.0).toFixed());

      let timeIntervalSec = 0;
      if (prePoint !== null) {
        dtStart = new Date(categoryData[prePoint[1]]);
        dtEnd = new Date(categoryData[point[0]]);
        timeIntervalSec = parseInt(((dtEnd - dtStart) / 1000.0).toFixed());
      }

      let clstVal = clusterResult[i];
      let startTime = categoryData[point[0]].substring(11, 19);
      let endTime = categoryData[point[1]].substring(11, 19);
      let cluster = clstVal;
      let timeSpan = timeDiffSec;
      let dataMean = mean(valueData.slice(point[0], point[1])).toFixed(3);
      let dataMax = Math.max(...valueData.slice(point[0], point[1]));
      let timeInterval = timeIntervalSec;
      csvRecords.push([startTime, endTime, cluster, timeSpan, dataMean, dataMax, timeInterval]);
    }
    csvRecords.unshift(["起始时间", "结束时间", "类型", "时长(秒)", "均值", "最大值", "平均间隔(秒)"]);
    this.setState({
      csvData: csvRecords,
    });
  }

  loadDevs() {
    AxiosClient.get(`/v1/test/current/dev-types/${this.state.sceneId}`)
      .then(res => {
        console.log('Got list devices:' + res.data);
        let resData = res.data;
        if (resData.state === 0) {
          let deviceListData = resData.data;
          let avaiDevs = [];
          for (let dev of deviceListData) {
            avaiDevs.push({ name: dev.name, type: dev.type, id: dev.id});
          }
          this.setState({ avaiDevTypes: avaiDevs, devType: avaiDevs[0].type });
        }
        else {
          console.log('Failed to get current device list: ' + resData.message);
          alert('获取电流设备列表失败!');
        }
      }).catch(err => {
        console.log(err);
        alert('获取电流设备列表失败!');
      });
  }

  loadData() {
    let payload = {
      scene_id: this.state.sceneId,
      mesh_name: this.state.meshName,
      type: parseInt(this.state.devType),
      date: this.state.date,
      cluster: parseInt(this.state.clusterNum),
    };
    console.log(payload);
    AxiosClient.post('/v1/test/current/seg-data', payload)
      .then(res => {
        console.log('Got current data:' + res.data);
        let resData = res.data;
        if (resData.state === 0) {
          let currentData = resData.data;

          if (currentData.is_succeed) {
            //category data
            let categoryData = [];
            for (let sampleTime of currentData.time) {
              categoryData.push(`${this.state.date} ${sampleTime}`);
            }

            this.updateClusterColors(currentData.cluster_result);
            this.setState({
              current_data: {
                categoryData: categoryData,
                valueData: currentData.signal,
                changePoints: currentData.change_points,
                clusterPoints: currentData.cluster_pts,
                clusterResult: currentData.cluster_result,
                maxValue: Math.max(...currentData.signal)
              }
            });
            this.fillCSVData(currentData.cluster_pts, categoryData, currentData.signal,
              currentData.cluster_result);
          }
          else {
            alert('暂无数据');
          }
        }
        else {
          console.log('Failed to get current seg data: ' + resData.message);
          alert('获取电流数据失败!');
        }
      }).catch(err => {
        console.log(err);
        alert('获取电流数据失败!');
      });
  }

  componentDidMount() {
    //Get the today's current data
    let dtNow = new Date();
    let y = dtNow.getFullYear();
    let m = (dtNow.getMonth() + 1);
    let d = dtNow.getDate();
    let dateStr = `${numToPaddedText(y)}-${numToPaddedText(m)}-${numToPaddedText(d)}`;
    this.setState({
      date: dateStr
    });

    // TODO: fetch from server
    /*
    axios.get('/api/v1/scenes')  //populate scenes
      .then ((resp) => {setAvaiScenes(resp.data); setScene(resp.data[0]);} )
    axios.get('/api/v1/scenes/<id>/devices)
      .then ((resp) => {setAvaiDevices(resp.data); setDevice(resp.data[0]);} )
    axios.get('/api/v1/test/bebebus/current/device-types')
      .then ((resp) => {setAvaiDevTypes(resp.data); setDeviceType(resp.data[0]);} )
    */
    this.setState({
      // avaiDevIDs: ['102', '103', '104', '111', '116', '117', '118', '119',
      //   '120', '66', '63', '231'], //66, 63, 108, 109, 231, Jiulong site
      avaiDevIDs: ['102', '101', '31', '32', '33', '107', '104', '111', '116', '117', '118', '119',
        '120', '66', '63', '231', '230', '105', '109','160', '105', '106', '107', '163'],
      devId: '102',
      devType: '1',
      sceneId: '1d31753b05-b5a103',
      meshName: 'JLZN',
      avaiScenes: [
        { name: '九龙戴村总部', id: '1d31753b05-b5a103' },
        { name: '冷硕办公司测试', id: '86592b25f0-192255' },
      ],
      avaiMeshes: ['JLZN', 'JLZN2', 'JLZN3', 'JLZN4']
    });

    //Cluster colors
    this.setState({
      clusterColors: ['#a7aba8', '#a7aba8', '#a7aba8', '#a7aba8', '#a7aba8', '#a7aba8', '#a7aba8'],
      clusterNum: 2,
    });

    setTimeout(() => {
      this.loadDevs();
    }, 1000);
  }

  componentWillUnmount() {
  }

  updateClusterColors(clusters) {
    const countObj = {};

    for (const ele of clusters) {
      if (countObj[ele]) {
        countObj[ele] += 1;
      } else {
        countObj[ele] = 1;
      }
    }

    console.log('Count clusters: ' + JSON.stringify(countObj));

    let counts = Object.entries(countObj);
    let newClusterColors = this.state.clusterColors;
    let allocateIndex = 0;
    counts.sort((first, second) => { return (second[1] - first[1]); });
    for (let c of counts) {
      let cluster = c[0];
      newClusterColors[cluster - 1] = colorPriority[allocateIndex++];
    }
    this.setState({
      clusterColors: newClusterColors
    });
  }

  handleBtnUpdateCurrentChart(event) {
    this.loadData();

    let newClusterColors = this.state.clusterColors;
    for (let i = this.state.clusterNum; i < newClusterColors.length; i++) {
      newClusterColors[i] = '#a7aba8';
    }

    this.setState({
      clusterColors: newClusterColors
    });
    event.preventDefault();
  }

  handleInputDateChange(event) {
    this.setState({ date: event.target.value });
  }

  handleInputDevIdChange(event) {
    this.setState({ devId: event.target.value });
  }

  handleInputMeshChange(event) {
    this.setState({ meshName: event.target.value });
  }

  handleInputDevTypeChange(event) {
    console.log('Handle device type change:', JSON.stringify(event.target.value));
    this.setState({ devType: event.target.value });
  }

  handleInputSceneChange(event) {
    this.setState({ sceneId: event.target.value });
  }

  handleInputClusterNumChange(event) {
    let num = event.target.value;

    this.setState({
      clusterNum: num
    });
  }

  openVideoDialog = () => this.setState({ isVideoDialogOpen: true })
  handleVideoDialogClose = () => this.setState({ isVideoDialogOpen: false })

  getVideoUrl(item) {
    let regex = /:/ig;
    const startTimeText = item.startTime.replace(regex, '');
    const endTimeText = item.endTime.replace(regex, '');
    regex = /-/ig;
    const dateText = this.state.date.replace(regex, '');

    let devId = '';
    for (let devInfo of this.state.avaiDevTypes) {
      if (devInfo.type === this.state.devType) {
        devId = devInfo.id;
        break;
      }
    }

    return `http://192.168.0.54:3000/res/${this.state.sceneId}/current_track_${devId}_${dateText}${startTimeText}_${dateText}${endTimeText}.mp4`;
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
    let totalOperatingTime = 0;
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
      totalOperatingTime += timeDiffSec;

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
        timeInterval: timeIntervalSec,
        loc: [point[0], point[1]],
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

    let dtTotalStart = new Date(this.state.current_data.categoryData[0]);
    let dtTotalEnd = new Date(this.state.current_data.categoryData[this.state.current_data.categoryData.length-1]);
    let timeTotalDiffSec = parseInt(((dtTotalEnd - dtTotalStart) / 1000.0).toFixed());
    let totalIdleTime = timeTotalDiffSec - totalOperatingTime;

    return (
      <div>
        <div className="page-header">
          <h3 className="page-title">
            电流监测
          </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>演示</a></li>
              <li className="breadcrumb-item active" aria-current="page">电流数据</li>
            </ol>
          </nav>
        </div>
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title"> 电流曲线 </h4>
                <form className="forms-sample">
                  <Form.Group className="row">
                    <label className="col-sm-1 col-form-label" htmlFor="inputScene">场地</label>
                    <select name='inputScene' id='inputScene' className=" col-sm-2 form-control"
                      onChange={this.handleInputSceneChange}>
                      {
                        this.state.avaiScenes.map((item, index) => {
                          return (
                            <option value={item.id} key={`option-scene-${item.id}`}>{item.name}</option>
                          );
                        })
                      }
                    </select>
                    {/* <label className="col-sm-1 col-form-label" htmlFor="inputDevId">设备</label>
                    <select name='inputDevId' id='inputDevId' className=" col-sm-1 form-control"
                      onChange={this.handleInputDevIdChange}>
                      {
                        this.state.avaiDevIDs.map((item, index) => {
                          return (
                            <option value={item.id} key={`option-dev-id-${index}`}>{item}</option>
                          );
                        })
                      }
                    </select> */}
                    <label className="col-sm-1 col-form-label" htmlFor="inputMeshName">Mesh</label>
                    <select name='inputMeshName' id='inputMeshName' className=" col-sm-2 form-control"
                      onChange={this.handleInputMeshChange}>
                      {
                        this.state.avaiMeshes.map((item, index) => {
                          return (
                            <option value={item.id} key={`option-mesh-${item.id}`}>{item}</option>
                          );
                        })
                      }
                    </select>
                    <label className="col-sm-1 col-form-label" htmlFor="inputDevType">类型</label>
                    <select name='inputDevType' id='inputDevType' className=" col-sm-2 form-control"
                      onChange={this.handleInputDevTypeChange}>
                      {
                        this.state.avaiDevTypes.map((item, index) => {
                          return (
                            <option value={item.type} key={`option-dev-type-${item.id}`}>{item.name}</option>
                          );
                        })
                      }
                    </select>
                    <label className="col-sm-1 col-form-label" htmlFor="inputDate">日期</label>
                    <Form.Control type="date" className="form-control col-sm-2" id="inputDate"
                      value={this.state.date} min="2000-01-01" onChange={this.handleInputDateChange} />
                  </Form.Group>
                  <Form.Group className="row">
                    <label className="col-sm-1 col-form-label" htmlFor="inputColor">分类</label>
                    <div className="col-sm-2">
                      <select name='inputClusterNum' id='inputClusterNum' className="form-control mb-2 mr-sm-2"
                        onChange={this.handleInputClusterNumChange}>
                        <option value={'2'} key={`option-cluster-${2}`}>2</option>
                        <option value={'3'} key={`option-cluster-${3}`}>3</option>
                        <option value={'4'} key={`option-cluster-${4}`}>4</option>
                        <option value={'5'} key={`option-cluster-${5}`}>5</option>
                        <option value={'6'} key={`option-cluster-${6}`}>6</option>
                        <option value={'7'} key={`option-cluster-${7}`}>7</option>
                      </select>
                    </div>
                    <div className="col-sm-3">
                      <Form.Control type="color" className="form-control mb-2 mr-sm-2" style={{ width: '100%' }}
                        value={this.state.clusterColors[0]} datatoggle="tooltip" dataplacement="top" title="类型1颜色"
                        onChange={(event) => {
                          let color = event.target.value;
                          let updatedClusterColors = this.state.clusterColors;
                          updatedClusterColors[0] = color;
                          this.setState({
                            clusterColors: updatedClusterColors
                          });
                        }} />
                    </div>
                    <div className="col-sm-3">
                      <Form.Control type="color" className="form-control mb-2 mr-sm-2" style={{ width: '100%' }}
                        value={this.state.clusterColors[1]} datatoggle="tooltip" dataplacement="top" title="类型2颜色"
                        onChange={(event) => {
                          let color = event.target.value;
                          let updatedClusterColors = this.state.clusterColors;
                          updatedClusterColors[1] = color;
                          this.setState({
                            clusterColors: updatedClusterColors
                          });
                        }} />
                    </div>
                    <div className="col-sm-3">
                      <Form.Control type="color" className="form-control mb-2 mr-sm-2" style={{ width: '100%' }}
                        value={this.state.clusterColors[2]} datatoggle="tooltip" dataplacement="top" title="类型3颜色"
                        onChange={(event) => {
                          let color = event.target.value;
                          let updatedClusterColors = this.state.clusterColors;
                          updatedClusterColors[2] = color;
                          this.setState({
                            clusterColors: updatedClusterColors
                          });
                        }} />
                    </div>
                  </Form.Group>
                  <Form.Group className="row" style={{ display: this.state.clusterNum > 3 ? 'flex' : 'none' }}>
                    <div className="col-sm-3">
                      <Form.Control type="color" className="form-control mb-2 mr-sm-2" style={{ width: '100%' }}
                        value={this.state.clusterColors[3]} datatoggle="tooltip" dataplacement="top" title="类型4颜色"
                        onChange={(event) => {
                          let color = event.target.value;
                          let updatedClusterColors = this.state.clusterColors;
                          updatedClusterColors[3] = color;
                          this.setState({
                            clusterColors: updatedClusterColors
                          });
                        }} />
                    </div>
                    <div className="col-sm-3">
                      <Form.Control type="color" className="form-control mb-2 mr-sm-2" style={{ width: '100%' }}
                        value={this.state.clusterColors[4]} datatoggle="tooltip" dataplacement="top" title="类型5颜色"
                        onChange={(event) => {
                          let color = event.target.value;
                          let updatedClusterColors = this.state.clusterColors;
                          updatedClusterColors[4] = color;
                          this.setState({
                            clusterColors: updatedClusterColors
                          });
                        }} />
                    </div>
                    <div className="col-sm-3">
                      <Form.Control type="color" className="form-control mb-2 mr-sm-2" style={{ width: '100%' }}
                        value={this.state.clusterColors[5]} datatoggle="tooltip" dataplacement="top" title="类型6颜色"
                        onChange={(event) => {
                          let color = event.target.value;
                          let updatedClusterColors = this.state.clusterColors;
                          updatedClusterColors[5] = color;
                          this.setState({
                            clusterColors: updatedClusterColors
                          });
                        }} />
                    </div>
                    <div className="col-sm-3">
                      <Form.Control type="color" className="form-control mb-2 mr-sm-2" style={{ width: '100%' }}
                        value={this.state.clusterColors[6]} datatoggle="tooltip" dataplacement="top" title="类型7颜色"
                        onChange={(event) => {
                          let color = event.target.value;
                          let updatedClusterColors = this.state.clusterColors;
                          updatedClusterColors[6] = color;
                          this.setState({
                            clusterColors: updatedClusterColors
                          });
                        }} />
                    </div>
                  </Form.Group>
                  {
                    //More colors
                  }
                  <button type="submit" className="btn btn-gradient-primary mb-2"
                    onClick={this.handleBtnUpdateCurrentChart} id="inlineFormInputUpdate">更新</button>
                </form>
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
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">分类</h4>
                <p className="card-description"> 统计 </p>
                <p>{`开机时间： ${totalOperatingTime}秒,     待机时间： ${totalIdleTime}秒`}</p>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th> 类型 </th>
                        <th> 数量 </th>
                        <th> 平均时长(秒) </th>
                        <th> 总时长(秒) </th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        tableSummaries.map((item, index) => {
                          return (
                            <tr key={`table-row-${index}`}>
                              <td><div style={{
                                backgroundColor: this.state.clusterColors[item.cluster - 1],
                                borderRadius: '5px 5px', height: '10px'
                              }} title={`类型${item.cluster}`}></div></td>
                              <td>{item.count}</td>
                              <td> {item.meanTime} </td>
                              <td> {item.totalTime} </td>
                            </tr>
                          );
                        })
                      }
                    </tbody>
                  </table>
                </div>
                <p className="card-description"> 记录 </p>
                <div className="table-responsive">
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <CSVLink data={this.state.csvData} style={{fontWeight: 'normal', fontSize: '12px'}}>导出CSV文件</CSVLink>
                  </div>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th> 起始时间 </th>
                        <th> 结束时间 </th>
                        <th> 类型 </th>
                        <th> 时长(秒) </th>
                        <th> 均值 </th>
                        <th> 最大值 </th>
                        <th> 平均间隔(秒) </th>
                        <th> 视频回放</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        tableRecords.map((item, index) => {
                          return (
                            <tr key={`table-row-${index}`}>
                              <td>{item.startTime}</td>
                              <td>{item.endTime}</td>
                              <td>
                                <div style={{
                                  backgroundColor: this.state.clusterColors[item.cluster - 1],
                                  borderRadius: '5px 5px', height: '10px'
                                }} title={`类型${item.cluster}`}></div>
                              </td>
                              <td> {item.timeSpan} </td>
                              <td> {item.dataMean} </td>
                              <td> {item.dataMax} </td>
                              <td> {item.timeInterval} </td>
                              <td>
                                <div style={{cursor: 'pointer'}} onClick={() => {
                                  let regex = /:/ig;
                                  const startTimeText = item.startTime.replace(regex, '');
                                  const endTimeText = item.endTime.replace(regex, '');
                                  regex = /-/ig;
                                  const dateText = this.state.date.replace(regex, '');
                                  // startVideoStream(this.state.sceneId, this.state.devType,
                                  //   `${dateText}T${startTimeText}Z`, `${dateText}T${endTimeText}Z`);
                                  this.setState({
                                    videoStartTime: item.startTime,
                                    videoEndTime: item.endTime,
                                    videoLoc: item.loc,
                                    videoUrl: this.getVideoUrl(item),
                                    clusterColor: this.state.clusterColors[item.cluster - 1],
                                    });
                                  setTimeout(this.openVideoDialog, 200);
                                }}>
                                  <i className="mdi mdi-video"></i>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CurrentVideoModal
          show={this.state.isVideoDialogOpen}
          onHide={() => this.handleVideoDialogClose()}
          starttime={this.state.videoStartTime}
          endtime={this.state.videoEndTime}
          linedatax={this.state.current_data.categoryData.slice(this.state.videoLoc[0], this.state.videoLoc[1])}
          linedatay={this.state.current_data.valueData.slice(this.state.videoLoc[0], this.state.videoLoc[1])}
          videoUrl={this.state.videoUrl}
          clusterColor={this.state.clusterColor}
        />
      </div>
    )
  }
}

export default CurrentView
