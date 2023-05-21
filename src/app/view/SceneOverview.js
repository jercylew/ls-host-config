import React, { Component } from 'react'
import { ProgressBar } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import {
  useLocation, Link
} from "react-router-dom";
import AxiosClient from '../../lib/AxiosClient';
import HomeUrlPrefix from '../HomeUrlPrefix';
import { uuidv4 } from '../../lib/uuid';

const urlPrefix = HomeUrlPrefix();

export class SceneOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scenes: [],
      scene_name: '',
      frp_port: '',
      gateway_id: '',
      user_id: '',
    };

    this.handleBtnAddScene = this.handleBtnAddScene.bind(this);
    this.handleInputSceneNameChange = this.handleInputSceneNameChange.bind(this);
    this.handleInputScenePortChange = this.handleInputScenePortChange.bind(this);
    this.handleInputGatewayIdChange = this.handleInputGatewayIdChange.bind(this);
    this.refreshSceneList = this.refreshSceneList.bind(this);
    this.handleMqttSubscribed = this.handleMqttSubscribed.bind(this);
    this.handleMqttMessage = this.handleMqttMessage.bind(this);
  }

  handleBtnAddScene(event) {
    console.log('Trying to add new scene: ', this.state.scene_name, ', ', this.state.frp_port);
    if (this.state.scene_name === '' || this.state.frp_port === '') {
      return;
    }

    let sceneData = {
      name: this.state.scene_name,
      frp_port: this.state.frp_port,
      gateway_id: this.state.gateway_id,
      address: this.state.address,
      user_id: this.state.user_id
  };

    console.log('Trying to post new scene: ', sceneData);
    AxiosClient.post('/v1/scenes', sceneData).then(resp => {
      console.log(resp);

      let respData = resp.data;
      if (respData.state === 0) {
        this.refreshSceneList();
      }
      else {
        alert('添加场地失败: ' + respData.message);
      }
    })
      .catch(error => {
        alert('添加场地失败: ' + error.message);
      });


    event.preventDefault();
  }

  handleInputSceneNameChange(event) {
    this.setState({ scene_name: event.target.value });
    event.preventDefault();
  }

  handleInputScenePortChange(event) {
    this.setState({ frp_port: event.target.value });
    event.preventDefault();
  }

  handleInputGatewayIdChange(event) {
    this.setState({ gateway_id: event.target.value });
    event.preventDefault();
  }

  handleMqttSubscribed(err) {
    if (!err) {
      console.log('MQTT subscribed heartbeat');
    }
  }

  handleMqttMessage(topic, message) {
    console.log('Received mqtt message: ', message.toString(),
      'Topic:', topic);
    console.log('Current state: ', this.state);
  }

  componentDidMount() {
    this.refreshSceneList();
    this.setState({ user_id: 'jiulong_data_platform_' + uuidv4() });
    }

  componentWillUnmount() {
    this.setState(
      {
        scenes: []
      }
    );
  }

  refreshSceneList = () => {
    AxiosClient.get('/v1/scenes')
        .then(res => {
            console.log('Refresh scene list: ' + JSON.stringify(res));
            let resData = res.data;
            if (resData.state === 0) {
                this.setState({
                  scenes: resData.data
                });
            }
            else {
                console.log('Failed to get scenes: ' + resData.message);
                alert('获取场地失败!');
            }
        }).catch(err => {
            console.log(err);
            alert('获取场地失败!');
        });
};

  render() {
    return (
      <div>
        <div className="page-header">
          <h3 className="page-title"> 场地管理 </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>场地</a></li>
              {/* <li className="breadcrumb-item active" aria-current="page">Basic tables</li> */}
            </ol>
          </nav>
        </div>
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">场地</h4>
                <form className="form-inline">
                  <label className="sr-only" htmlFor="inlineFormSceneName">Name</label>
                  <Form.Control  type="text" className="form-control mb-2 mr-sm-2" id="inlineFormSceneName"
                  onChange={this.handleInputSceneNameChange} placeholder="场地名称" />
                  <label className="sr-only" htmlFor="inlineFormPort">Port</label>
                  <div className="input-group mb-2 mr-sm-2">
                    <Form.Control  type="text" className="form-control" id="inlineFormPort"
                    onChange={this.handleInputScenePortChange} placeholder="端口号" />
                  </div>
                  <label className="sr-only" htmlFor="inlineFormGatewayId">Gateway ID</label>
                  <div className="input-group mb-2 mr-sm-2">
                    <Form.Control  type="text" className="form-control" id="inlineFormGatewayId"
                    onChange={this.handleInputGatewayIdChange} placeholder="主机ID， 如： ddd23cd659-88746c" />
                  </div>
                  <button type="button" className="btn btn-gradient-primary mb-2" onClick={this.handleBtnAddScene}>添加</button>
                </form>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th> 场地名称 </th>
                        <th> 地址 </th>
                        <th> 主机ID </th>
                        <th> 端口 </th>
                        <th> 状态 </th>
                        <th> 控制 </th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.scenes.map((scene, index) => <tr key={`scene-${index}`}>
                          <td>
                            <i className="mdi mdi-city"></i>
                            {scene.name}
                          </td>
                          <td>{scene.address}</td>
                          <td>{scene.gatewayId}</td>
                          <td>{scene.frpPort}</td>
                          <td> <ProgressBar variant="success" now={85} /> </td>
                          <td>
                            <Link to={`/${urlPrefix}/scene/detail?id=${scene._id}&gateway_id=${scene.gatewayId}&name=${scene.name}`}>详细</Link>
                            <span>{` | `}</span>
                            <Link to={`/${urlPrefix}/scene/config?id=${scene._id}&gateway_id=${scene.gatewayId}&name=${scene.name}`}>配置</Link>
                          </td>
                        </tr>)
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SceneOverview
