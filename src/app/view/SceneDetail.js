import React, { Component, useEffect, useRef } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import AxiosClient from '../../lib/AxiosClient';
import { Link } from "react-router-dom";
import HomeUrlPrefix from '../HomeUrlPrefix';
import ReactHlsPlayer from 'react-hls-player';


const urlPrefix = HomeUrlPrefix();
const Status = {
  Online: 0,
  Offline: 1,
  Idle: 2,
};
const statusToText = status => {
  if (status === Status.Online) {
    return '在线';
  }
  if (status === Status.Offline) {
    return '离线';
  }
  if (status === Status.Idle) {
    return '休眠';
  }

  return 'NA';
};

const cameraChStreaming = statusText => {
  //ON=${device.ffmpeg_on},RTSP=${device.camera_rtsp_source}
  let searchPairs = statusText.split(',');
  const searchMap = new Map();
  searchPairs.forEach(element => {
    const keyValArray = element.split('=');
    const key = keyValArray[0];
    const value = keyValArray[1];
    searchMap.set(key, value);
  });

  return searchMap.get('ON') === 'true';
};

function VideoPlayModal(props) {
  const videoUrl = `https://live.jiulong-aiot.com:4433/live/${props.channel}.m3u8`

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="modal-80w modal-70h"
      onHide={() => {
        props.onHide();
      }}
      centered
    >
      <Modal.Header closeButton={false}>
        <Modal.Title id="contained-modal-title-vcenter">
          通道视频
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="template-demo text-center">
          <ReactHlsPlayer
            src={videoUrl}
            autoPlay={true}
            controls={true}
            width="100%"
            height="auto"
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => {
          console.log('Close the video player view');
          props.onHide();
        }}>关闭</Button>
      </Modal.Footer>
    </Modal>
  );
}

export class SceneDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      sensors: [],
      executors: [],
      videoChannels: [],
      logFiles: [],

      isVideoDialogOpen: false,
      channelToPreview: ''
    };

    this.onlineSensorsCount = this.onlineSensorsCount.bind(this);
    this.onlineExecutorsCount = this.onlineExecutorsCount.bind(this);
    this.onlineChannelsCount = this.onlineChannelsCount.bind(this);
    this.handlePreviewChannelVideo = this.handlePreviewChannelVideo.bind(this);
    this.openVideoDialog = this.openVideoDialog.bind(this);
    this.handleVideoDialogClose = this.handleVideoDialogClose.bind(this);
  }

  componentDidMount() {
    //TODO: MQTT subscribe /host/device/report
    let search = this.props.location.search;
    search = search.substring(1);

    let searchPairs = search.split('&');
    const searchMap = new Map();
    searchPairs.forEach(element => {
      const keyValArray = element.split('=');
      const key = keyValArray[0];
      const value = keyValArray[1];
      searchMap.set(key, value);
    });

    console.log(searchMap.get('id'), searchMap.get('gateway_id'));
    this.setState({
      name: searchMap.get('name')
    });

    AxiosClient.get(`/v1/scenes/${searchMap.get('id')}`)
      .then(res => {
        console.log('Refresh scene list: ' + JSON.stringify(res));
        let resData = res.data;

        if (resData.state === 0) {
          const scene = resData.data;
          this.setState({
            logFiles: scene.logFiles,
            sensors: scene.devices.filter(dev => dev.devKind === 'sensor'),
            executors: scene.devices.filter(dev => dev.devKind === 'executer'),
            videoChannels: scene.devices.filter(dev => dev.devKind === 'camera')
          });
        }
        else {
          console.log('Failed to get scenes: ' + resData.message);
          alert('获取设备列表失败!');
        }
      }).catch(err => {
        console.log(err);
        alert('获取设备列表失败!');
      });
  }

  openVideoDialog = () => this.setState({ isVideoDialogOpen: true })
  handleVideoDialogClose = () => this.setState({ isVideoDialogOpen: false })

  onlineSensorsCount = () => {
    return this.state.sensors.filter((item, index) => item.status === Status.Online).length;
  };

  onlineExecutorsCount = () => {
    return this.state.executors.filter((item, index) => item.status === Status.Online).length;
  };

  onlineChannelsCount = () => {
    return this.state.videoChannels.filter((item, index) => item.is_ok === true).length;
  };

  handlePreviewChannelVideo = (id) => {
    console.log('To preview channel video: ', id);
    this.setState({
      channelToPreview: id,
      });
    setTimeout(this.openVideoDialog, 200);
  };

  render() {
    return (
      <div>
        <div className="page-header">
          <h3 className="page-title"> {`场地信息: ${this.state.name}`} </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to={`/${urlPrefix}/scene`}>场地</Link></li>
              <li className="breadcrumb-item active" aria-current="page">详细信息</li>
            </ol>
          </nav>
        </div>
        <div className="row">
          <div className="col-lg-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">执行器</h4>
                <p className="card-description"> 总计: <code>{this.state.executors.length}</code>, 在线: <code>{this.onlineExecutorsCount()}</code>
                </p>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>类型</th>
                        <th>状态</th>
                        <th>数据</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.executors.map((executor, index) => <tr key={`executor-${index}`}>
                          <td>
                            <i className="mdi mdi-city"></i>
                            {executor.devId}
                          </td>
                          <td>{executor.devType}</td>
                          <td className={executor.status === Status.Online ? "text-success" : "text-danger"}>
                            {statusToText(executor.status)}
                          </td>
                          <td>{executor.dataInfo}</td>
                        </tr>)
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">传感器</h4>
                <p className="card-description"> 总计: <code>{this.state.sensors.length}</code>, 在线: <code>{this.onlineSensorsCount()}</code>
                </p>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>类型</th>
                        <th>状态</th>
                        <th>数据</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.sensors.map((sensor, index) => <tr key={`sensor-${index}`}>
                          <td>
                            <i className="mdi mdi-city"></i>
                            {sensor.devId}
                          </td>
                          <td>{sensor.devType}</td>
                          <td className={sensor.status === Status.Online ? "text-success" : "text-danger"}>
                            {statusToText(sensor.status)}
                          </td>
                          <td align='left'>{sensor.dataInfo}</td>
                        </tr>)
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">摄像头</h4>
                <p className="card-description"> 总计: <code>{this.state.videoChannels.length}</code>, 在线: <code>{this.onlineChannelsCount()}</code>
                </p>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>状态</th>
                        <th>推流</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                    {
                      this.state.videoChannels.map((channel, index) => <tr key={`channel-${index}`}>
                        <td><i className="mdi mdi-camcorder"></i>{channel.devId}</td>
                        <td className={cameraChStreaming(channel.dataInfo) ? "text-success" : "text-danger"}> {/* TODO: use actual state instead */}
                            {cameraChStreaming(channel.dataInfo) ? '正常' : '异常'}
                          </td>
                        <td>{cameraChStreaming(channel.dataInfo) ? '正在推流' : '未推流'}</td>
                        <td className={cameraChStreaming(channel.dataInfo) ? 'btn-link cursor-pointer' : undefined} onClick={() => {
                          if (!cameraChStreaming(channel.dataInfo)) {
                            return ;
                          }

                          this.handlePreviewChannelVideo(channel.id);
                        }}>预览</td>
                        </tr>)
                    }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">日志</h4>
                <p className="card-description"> 总计: <code>{this.state.logFiles.length}</code>
                </p>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>文件名</th>
                        <th>大小</th>
                        <th>最近更新时间</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                    {
                      this.state.logFiles.map((file, index) => <tr key={`file-${index}`}>
                        <td><i className="mdi mdi-file"></i>{file.name}</td>
                        <td>{file.size}</td>
                        <td>{file.lastUpdated}</td>
                        <td className='btn-link cursor-pointer' onClick={() => {
                        }}>下载</td>
                        </tr>)
                    }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">系统</h4>
                <div className="template-demo">
                  <button type="button" className="btn btn-gradient-primary btn-icon-text">
                    <i className="mdi  mdi-rotate-right btn-icon-prepend"></i>
                    重启后台服务
                  </button>
                  <button type="button" className="btn btn-gradient-dark btn-icon-text">
                    <i className="mdi mdi-sync btn-icon-append"></i>
                    升级后台服务
                  </button>
                  <button type="button" className="btn btn-gradient-danger btn-fw btn-icon-text">
                    <i className="mdi  mdi-reload btn-icon-prepend"></i>
                    {`重启工控机  `}
                  </button>
                  <button type="button" className="btn btn-gradient-success btn-icon-text">
                    <i className="mdi mdi-console btn-icon-prepend"></i>
                    {`工控机控制台`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {
          this.state.isVideoDialogOpen ? <VideoPlayModal
          show={true}
          onHide={() => {
            console.log('To close the video player ...');
            this.handleVideoDialogClose();
          }}
          channel={this.state.channelToPreview}
        /> : undefined
        }
      </div>
    )
  }
}

export default SceneDetail
