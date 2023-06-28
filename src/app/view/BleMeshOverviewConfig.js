import React, { useEffect, useState } from 'react';
import {
    useLocation, Link
} from "react-router-dom";
import HomeUrlPrefix from '../HomeUrlPrefix';
import { Form } from 'react-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
import AxiosClient from '../../lib/AxiosClient';
import { uuidv4 } from '../../lib/uuid';

const urlPrefix = HomeUrlPrefix();
export default function BleMeshOverviewConfig() {
    const [gatewayTtyName, setGatewayTtyName] = useState('/dev/ttyUSB0');
    const [gatewayOnline, setGatewayOnline] = useState(true);
    const [autoSchedule, setAutoSchedule] = useState(false);

    const [timeShieldCmdMS, setTimeShieldCmdMS] = useState(500);
    const [timeIntervalDataReportS, setTimeIntervalDataReportS] = useState(10);
    const [dataLogKeepDays, setDataLogKeepDays] = useState(10);
    const [mqttLogKeepDays, setMqttLogKeepDays] = useState(7);
    const [autoRebootWhenGatewayOff, setAutoRebootWhenGatewayOff] = useState(true);

    const [cloudServerAddress, setCloudServerAddress] = useState('www.lengshuotech.com');
    const [cloudServerPort, setCloudServerPort] = useState(6200);
    const [mqttServerAddress, setMqttServerAddress] = useState('www.lengshuotech.com');
    const [mqttServerPort, setMqttServerPort] = useState(1883);
    const [mqttDataReportTopic, setMqttDataReportTopic] = useState('device/report/notify');
    const [mqttCmdDownTopic, setMqttCmdDownTopic] = useState('/host/cmd');

    const handleApplyGatewayConfig = () => {
        //TODO: MQTT publish /host/cmd/xxxxxxxxxxxx-yyyyyy
        /*
        {
            cmd: 'set',
            category: 'ble',
            params: {
                port: '/dev/ttyUSB0',
                autoRebootWhenGatewayOff: true,
                commandShieldTimeMS: 3000,
                dataReportIntervalMS: 1000,
                dataLogKeepDays: 7,
                mqttLogKeepDays: 10,
                gateway_id: 200,
                gateway_mesh_name: 'JLZN',
                gateway_mesh_password: '1qaz',
            }
        }
        */
    };

    const handleApplyDataLogConfig = () => {
        // if (hostIP === '' || defaultGateway === '') {
        //     alert('请输入要配的IP和网关！');
        //     return;
        // }

        // let cmdData = {
        //     user_id: userId,
        //     // gateway_id: gatewayId,
        //     cmd: 'set',
        //     category: 'network',
        //     params: {
        //         method: 'static',
        //         ip: hostIP,
        //         mask: mask,
        //         gateway: defaultGateway,
        //         dns: dns
        //     }
        // };

        // console.log('Trying to save network settings: ', cmdData);
        // AxiosClient.post(`/v1/scenes/${id}`, cmdData).then(resp => {
        //     console.log(resp);

        //     let respData = resp.data;
        //     if (respData.state === 0) {
        //         alert('设置网络成功');
        //     }
        //     else {
        //         alert('设置网络失败: ' + respData.message);
        //     }
        // })
        //     .catch(error => {
        //         alert('设置网络失败: ' + error.message);
        //     });
    };

    const handleApplyCloudServerConfig = () => {
        //TODO: MQTT publish /host/cmd/xxxxxxxxxxx-yyyyyy
        /*
        {
            cmd: 'set',
            category: 'video',
            params: {
                rtsp_src: 'recorder',
                vendor: 'hkvision',
                id_prefix: 'hangzhou_liuzhong',
                recorder_ip: 'xxx.xxx.xxx.xxx',
                user_name: 'admin',
                password: 'admin123',
                channels: '1-5, 8, 11-12',
            } or
            params: {
                rtsp_src: 'camera',
                vendor: 'hkvision',
                id_prefix: 'hangzhou_liuzhong',
                camera_ip: 'xxx.xxx.xxx.xxx',
                user_name: 'admin',
                password: 'admin123'
            }
        }
        */
    //    if (rtspSourceType === RtspSourceType.VideoRecorder)
    //    {
    //     if (channelIDPrefix === '' || rtspChannels === '') {
    //         alert('请输入通道ID前缀和通道号！');
    //         return;
    //     }

    //     if (rtspUserName === '' || rtspPassword === '') {
    //         alert('请输入录像机用户名和密码！');
    //         return;
    //     }

    //     if (videoRecorderIP == '') {
    //         alert('请输入录像机IP！');
    //         return;
    //     }
    //    }
    //    else {
    //     if (cameraIP == '') {
    //         alert('请输入摄像头IP！');
    //         return;
    //     }

    //     if (cameraUserName === '' || cameraPassword === '') {
    //         alert('请输入摄像头用户名和密码！');
    //         return;
    //     }
    //    }

    //     let cmdData = {
    //         user_id: userId,
    //         // gateway_id: gatewayId,
    //         cmd: 'set',
    //         category: 'video',
    //         params: {
    //             rtsp_src: rtspSrcTypeToText(rtspSourceType),
    //             vendor: cameraManufactureToText(cameraManufacture),
    //             id_prefix: channelIDPrefix,
    //             recorder_ip: videoRecorderIP,
    //             camera_ip: cameraIP,
    //             user_name: (rtspSourceType === RtspSourceType.VideoRecorder) ? rtspUserName : cameraUserName,
    //             password: (rtspSourceType === RtspSourceType.VideoRecorder) ? rtspPassword : cameraPassword,
    //             channels: (rtspSourceType === RtspSourceType.VideoRecorder) ? rtspChannels : '',
    //         }
    //     };

    //     console.log('Trying to save video settings: ', cmdData);
    //     AxiosClient.post(`/v1/scenes/${id}`, cmdData).then(resp => {
    //         console.log(resp);

    //         let respData = resp.data;
    //         if (respData.state === 0) {
    //             alert('添加视频通道成功');
    //         }
    //         else {
    //             alert('添加视频通道失败: ' + respData.message);
    //         }
    //     })
    //         .catch(error => {
    //             alert('添加视频通道失败: ' + error.message);
    //         });
    };

    useEffect(() => {
        bsCustomFileInput.init();
        setTimeout(() => {
            // setUserId('jiulong_data_platform_' + uuidv4());
        }, 500);
    });

    return (
        <div>
            <div className="page-header">
                <h3 className="page-title">{`基本配置`}</h3>
            </div>
            <div className="row">
                <div className="col-md-6 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title"><i className="mdi mdi-bluetooth-settings"></i>{`网关`}</h4>
                            <form className="forms-sample">
                                <Form.Group className="row">
                                    <label htmlFor="gatewayTtyName" className="col-sm-3 col-form-label">网关串口</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" className="form-control" id="gatewayTtyName" placeholder="250"
                                            value={gatewayTtyName} onChange={(event) => { setGatewayTtyName(event.target.value); }} />
                                    </div>
                                </Form.Group>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input type="checkbox" className="form-check-input" checked={gatewayOnline}
                                            onChange={() => { setGatewayOnline(!gatewayOnline) }} disabled />
                                        <i className="input-helper"></i>
                                        串口状态
                                    </label>
                                </div>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input type="checkbox" className="form-check-input" checked={autoSchedule}
                                            onChange={() => { setAutoSchedule(!autoSchedule) }} />
                                        <i className="input-helper"></i>
                                        自动调度状态
                                    </label>
                                </div>
                                <button type="button" className="btn btn-gradient-primary mr-2" onClick={handleApplyGatewayConfig}>确定</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title"><i className="mdi mdi-bluetooth-settings"></i>{`数据与日志`}</h4>
                            <form className="forms-sample">
                                <Form.Group className="row">
                                    <label htmlFor="timeShieldCmdMS" className="col-sm-3 col-form-label">命令接收间隔(毫秒)</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="number" className="form-control" id="timeShieldCmdMS" placeholder="250"
                                            value={timeShieldCmdMS} onChange={(event) => { setTimeShieldCmdMS(parseInt(event.target.value)); }} />
                                    </div>
                                </Form.Group>
                                <Form.Group className="row">
                                    <label htmlFor="timeIntervalDataReportS" className="col-sm-3 col-form-label">数据上报间隔(秒)</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="number" className="form-control" id="timeIntervalDataReportS"
                                            value={timeIntervalDataReportS}
                                            onChange={(event) => { setTimeIntervalDataReportS(parseInt(event.target.value)); } } placeholder="10" />
                                    </div>
                                </Form.Group>
                                <Form.Group className="row">
                                    <label htmlFor="dataLogKeepDays" className="col-sm-3 col-form-label">数据日志缓存时间(天)</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="number" className="form-control" id="dataLogKeepDays"
                                            value={dataLogKeepDays} onChange={ (event) => { setDataLogKeepDays(parseInt(event.target.value)); } } placeholder="10" />
                                    </div>
                                </Form.Group>
                                <Form.Group className="row">
                                    <label htmlFor="mqttLogKeepDays" className="col-sm-3 col-form-label">MQTT日志缓存时间(天)</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="number" className="form-control" id="mqttLogKeepDays"
                                            value={mqttLogKeepDays} onChange={ (event) => { setMqttLogKeepDays(parseInt(event.target.value)); } } placeholder="7" />
                                    </div>
                                </Form.Group>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input type="checkbox" className="form-check-input" checked={autoRebootWhenGatewayOff}
                                            onChange={ (event) => { setAutoRebootWhenGatewayOff(event.target.checked); }} />
                                        <i className="input-helper"></i>
                                        网关断线时自动重启工控机
                                    </label>
                                </div>
                                <button type="button" className="btn btn-gradient-primary mr-2" onClick={handleApplyDataLogConfig}>确定</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title"><i className="mdi mdi-bluetooth-settings"></i>{`云服务`}</h4>
                            <form className="forms-sample">
                                <Form.Group className="row">
                                    <label htmlFor="cloudServerAddress" className="col-sm-3 col-form-label">云服务器地址</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" className="form-control" id="cloudServerAddress" placeholder="云服务器地址"
                                            value={cloudServerAddress} onChange={(event) => { setCloudServerAddress(event.target.value); }} />
                                    </div>
                                </Form.Group>
                                <Form.Group className="row">
                                    <label htmlFor="cloudServerPort" className="col-sm-3 col-form-label">云服务端口</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="number" className="form-control" id="cloudServerPort"
                                            value={cloudServerPort} onChange={(event) => { setCloudServerPort(parseInt(event.target.value)); }}
                                            placeholder="10" />
                                    </div>
                                </Form.Group>
                                <Form.Group className="row">
                                    <label htmlFor="mqttServerAddress" className="col-sm-3 col-form-label">MQTT服务器地址</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" className="form-control" id="mqttServerAddress"
                                            value={mqttServerAddress} onChange={ (event) => { setMqttServerAddress(event.target.value); } }
                                            placeholder="MQTT服务器地址" />
                                    </div>
                                </Form.Group>
                                <Form.Group className="row">
                                    <label htmlFor="mqttServerPort" className="col-sm-3 col-form-label">MQTT服务端口</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="number" className="form-control" id="mqttServerPort"
                                            value={mqttServerPort} onChange={ (event) => { setMqttServerPort(parseInt(event.target.value)); } }
                                            placeholder="MQTT服务器端口" />
                                    </div>
                                </Form.Group>
                                <Form.Group className="row">
                                    <label htmlFor="mqttDataReportTopic" className="col-sm-3 col-form-label">MQTT数据上报主题</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" className="form-control" id="mqttDataReportTopic"
                                            value={mqttDataReportTopic} onChange={ (event) => { setMqttDataReportTopic(event.target.value); } }
                                            placeholder="MQTT数据上报主题" />
                                    </div>
                                </Form.Group>
                                <Form.Group className="row">
                                    <label htmlFor="mqttCmdDownTopic" className="col-sm-3 col-form-label">MQTT命令下发主题</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" className="form-control" id="mqttCmdDownTopic"
                                            value={mqttCmdDownTopic} onChange={ (event) => { setMqttCmdDownTopic(event.target.value); } }
                                            placeholder="MQTT命令下发主题" />
                                    </div>
                                </Form.Group>
                                <button type="button" className="btn btn-gradient-primary mr-2" onClick={handleApplyCloudServerConfig}>确定</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}