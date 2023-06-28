import React, { useEffect, useState } from 'react';
import {
    useLocation, Link
} from "react-router-dom";
import HomeUrlPrefix from '../HomeUrlPrefix';
import { Form } from 'react-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
import AxiosClient from '../../lib/AxiosClient';
import { uuidv4 } from '../../lib/uuid';

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const RtspSourceType = {
    VideoRecorder: 0,
    DirectCamera: 1,
};

const CameraManufacture = {
    HikVision: 0,
    Dahua: 1,
};

const rtspSrcTypeToText = type => {
    if (type === RtspSourceType.VideoRecorder) {
        return 'recorder';
    }
    else if (type === RtspSourceType.DirectCamera) {
        return 'camera';
    }
    else {
        return '';
    }
};

const cameraManufactureToText = manufacture => {
    if (manufacture === CameraManufacture.HikVision) {
        return 'hkvision';
    }
    else if (manufacture === CameraManufacture.Dahua) {
        return 'dahua';
    }
    else {
        return '';
    }
};

const urlPrefix = HomeUrlPrefix();
export default function SceneConfig() {
    const query = useQuery();

    const [sceneName, setSceneName] = useState('');
    const [frpPort, setFrpPort] = useState('');
    const [sceneAddress, setSceneAddress] = useState('');
    const [gpsCoordinate, setGpsCoordinate] = useState('');
    const [telephone, setTelephone] = useState('');

    const [rtspSourceType, setRtspSourceType] = useState(RtspSourceType.VideoRecorder);
    const [cameraManufacture, setCameraManufacture] = useState(CameraManufacture.HikVision);
    const [channelIDPrefix, setChannelIDPrefix] = useState('jiulong_scene');
    const [videoRecorderIP, setVideoRecorderIP] = useState('');
    const [rtspUserName, setRtspUserName] = useState('admin');
    const [rtspPassword, setRtspPassword] = useState('admin123');
    const [rtspChannels, setRtspChannels] = useState('');
    const [cameraIP, setCameraIP] = useState('');
    const [cameraUserName, setCameraUserName] = useState('');
    const [cameraPassword, setCameraPassword] = useState('');


    const handleRtspSourceChange = event => {
        setRtspSourceType(parseInt(event.target.value));
    };

    const handleCameraManufactureChange = event => {
        setCameraManufacture(parseInt(event.target.value));
    };

    const handleChannelIDPrefixChange = event => {
        setChannelIDPrefix(event.target.value);
    };

    const handleVideoRecorderIPChange = event => {
        setVideoRecorderIP(event.target.value);
    };

    const handleRtspUserNameChange = event => {
        setRtspUserName(event.target.value);
    };

    const handleRtspPasswordChange = event => {
        setRtspPassword(event.target.value);
    };

    const handleRtspChannelsChange = event => {
        setRtspChannels(event.target.value);
    };

    const handleCameraIPChange = event => {
        setCameraIP(event.target.value);
    };

    const handleCameraUserNameChange = event => {
        setCameraUserName(event.target.value);
    };

    const handleCameraPasswordChange = event => {
        setCameraPassword(event.target.value);
    };

    const handleApplySceneConfig = () => {
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

    const handleApplyVideoConfig = () => {
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
       if (rtspSourceType === RtspSourceType.VideoRecorder)
       {
        if (channelIDPrefix === '' || rtspChannels === '') {
            alert('请输入通道ID前缀和通道号！');
            return;
        }

        if (rtspUserName === '' || rtspPassword === '') {
            alert('请输入录像机用户名和密码！');
            return;
        }

        if (videoRecorderIP === '') {
            alert('请输入录像机IP！');
            return;
        }
       }
       else {
        if (cameraIP === '') {
            alert('请输入摄像头IP！');
            return;
        }

        if (cameraUserName === '' || cameraPassword === '') {
            alert('请输入摄像头用户名和密码！');
            return;
        }
       }

        let cmdData = {
            cmd: 'set',
            category: 'video',
            params: {
                rtsp_src: rtspSrcTypeToText(rtspSourceType),
                vendor: cameraManufactureToText(cameraManufacture),
                id_prefix: channelIDPrefix,
                recorder_ip: videoRecorderIP,
                camera_ip: cameraIP,
                user_name: (rtspSourceType === RtspSourceType.VideoRecorder) ? rtspUserName : cameraUserName,
                password: (rtspSourceType === RtspSourceType.VideoRecorder) ? rtspPassword : cameraPassword,
                channels: (rtspSourceType === RtspSourceType.VideoRecorder) ? rtspChannels : '',
            }
        };

        // console.log('Trying to save video settings: ', cmdData);
        // AxiosClient.post(`/v1/scenes/${id}`, cmdData).then(resp => {
        //     console.log(resp);

        //     let respData = resp.data;
        //     if (respData.state === 0) {
        //         alert('添加视频通道成功');
        //     }
        //     else {
        //         alert('添加视频通道失败: ' + respData.message);
        //     }
        // })
        //     .catch(error => {
        //         alert('添加视频通道失败: ' + error.message);
        //     });
    };

    useEffect(() => {
        bsCustomFileInput.init();
        // setTimeout(() => {
        //     setId(query.get('id'));
        //     setGatewayId(query.get('gateway_id'));
        //     setUserId('jiulong_data_platform_' + uuidv4());
        // }, 500);
    });

    return (
        <div>
            <div className="page-header">
                <h3 className="page-title">{`场地配置`}</h3>
                {/* <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to={`/${urlPrefix}/scene`}>场地</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">配置</li>
                    </ol>
                </nav> */}
            </div>
            <div className="row">
                <div className="col-md-6 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title"><i className="mdi mdi-ethernet"></i>场地</h4>
                            <form className="forms-sample">
                                <Form.Group className="row">
                                    <label htmlFor="sceneName" className="col-sm-3 col-form-label">场地名称</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" className="form-control" id="sceneName" placeholder="场地名称, 如： XXX中学高二三班"
                                            value={sceneName} onChange={ (event) => { setSceneName(event.target.value); } } />
                                    </div>
                                </Form.Group>
                                <Form.Group className="row">
                                    <label htmlFor="frpPort" className="col-sm-3 col-form-label">端口</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" className="form-control" id="frpPort" placeholder="远程配置端口，如： 23280"
                                            value={frpPort} onChange={ (event) => { setFrpPort(event.target.value); } } />
                                    </div>
                                </Form.Group>
                                <Form.Group className="row">
                                    <label htmlFor="sceneAddress" className="col-sm-3 col-form-label">地址</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" className="form-control" id="sceneAddress" placeholder="地址"
                                            value={sceneAddress} onChange={ (event) => { setSceneAddress(sceneAddress); } } />
                                    </div>
                                </Form.Group>
                                <Form.Group className="row">
                                    <label htmlFor="gpsCoordinate" className="col-sm-3 col-form-label">GPS坐标</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" value={gpsCoordinate} className="form-control" id="gpsCoordinate"
                                            onChange={(event) => { setGpsCoordinate(event.target.value); }} placeholder="如： 2450.334, 3351.34" />
                                    </div>
                                </Form.Group>
                                <Form.Group className="row">
                                    <label htmlFor="telephone" className="col-sm-3 col-form-label">联系电话</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" value={telephone} className="form-control" id="telephone"
                                            onChange={ (event) => { setTelephone(event.target.value); } } placeholder="座机或手机号码，如： 0755-28964567, 13954324569" />
                                    </div>
                                </Form.Group>
                                <button type="button" className="btn btn-gradient-primary mr-2" onClick={handleApplySceneConfig}>确定</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title"><i className="mdi mdi-video"></i>视频配置</h4>
                            <p className="card-description">注： 通过录像机可以一次性添加多个通道，但通过摄像头添加时需一个一个单独添加，因为每个摄像头IP都不一样
                            </p>
                            <Form.Group className="row">
                                <label className="col-sm-3 col-form-label">取流方式</label>
                                <div className="col-sm-4">
                                    <div className="form-check">
                                        <label className="form-check-label">
                                            <input type="radio" className="form-check-input"
                                                name="rtspSourceRecorder" id="rtspSourceRecorder"
                                                value={RtspSourceType.VideoRecorder}
                                                defaultChecked onChange={handleRtspSourceChange}
                                                checked={rtspSourceType === RtspSourceType.VideoRecorder} /> 通过录像机
                                            <i className="input-helper"></i>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-sm-5">
                                    <div className="form-check">
                                        <label className="form-check-label">
                                            <input type="radio" className="form-check-input"
                                                name="rtspSourceCamera" id="rtspSourceCamera"
                                                value={RtspSourceType.DirectCamera}
                                                onChange={handleRtspSourceChange}
                                                checked={rtspSourceType === RtspSourceType.DirectCamera} /> 通过摄像头
                                            <i className="input-helper"></i>
                                        </label>
                                    </div>
                                </div>
                            </Form.Group>
                            <Form.Group className="row">
                                <label className="col-sm-3 col-form-label">录像机品牌</label>
                                <div className="col-sm-9">
                                    <select className="form-control" onChange={handleCameraManufactureChange}>
                                        <option value={CameraManufacture.HikVision}
                                            selected={cameraManufacture === CameraManufacture.HikVision}>海康威视</option>
                                        <option value={CameraManufacture.Dahua}
                                            selected={cameraManufacture === CameraManufacture.Dahua}>大华</option>
                                    </select>
                                </div>
                            </Form.Group>
                            <Form.Group className="row">
                                <label htmlFor="channelIDPrefix" className="col-sm-3 col-form-label">ID前缀</label>
                                <div className="col-sm-9">
                                    <Form.Control type="text" className="form-control" id="channelIDPrefix"
                                        value={channelIDPrefix} onChange={handleChannelIDPrefixChange}
                                        placeholder="如jiulong_test, 则将映射成: jiulong_test_ch0, jiulong_test_ch1, jiulong_test_ch2 ..." />
                                </div>
                            </Form.Group>
                            {
                                rtspSourceType === RtspSourceType.VideoRecorder ?
                                    <div className="forms-sample">
                                        <Form.Group className="row">
                                            <label htmlFor="videoRecorderIP" className="col-sm-3 col-form-label">录像机IP</label>
                                            <div className="col-sm-9">
                                                <Form.Control type="text" className="form-control" id="videoRecorderIP"
                                                    placeholder="录像机IP" value={videoRecorderIP} onChange={handleVideoRecorderIPChange} />
                                            </div>
                                        </Form.Group>
                                        <Form.Group className="row">
                                            <label htmlFor="rtspUserName" className="col-sm-3 col-form-label">用户名</label>
                                            <div className="col-sm-9">
                                                <Form.Control type="text" className="form-control" id="rtspUserName"
                                                    onChange={handleRtspUserNameChange} placeholder="用户名" value={rtspUserName} />
                                            </div>
                                        </Form.Group>
                                        <Form.Group className="row">
                                            <label htmlFor="rtspPassword" className="col-sm-3 col-form-label">密码</label>
                                            <div className="col-sm-9">
                                                <Form.Control type="text" className="form-control" id="rtspPassword"
                                                    onChange={handleRtspPasswordChange} placeholder="密码" value={rtspPassword} />
                                            </div>
                                        </Form.Group>
                                        <Form.Group className="row">
                                            <label htmlFor="rtspChannels" className="col-sm-3 col-form-label">通道</label>
                                            <div className="col-sm-9">
                                                <Form.Control type="text" className="form-control" id="rtspChannels" placeholder="支持逗号隔开(1,3,5)和范围指定(1-8)两种格式"
                                                    value={rtspChannels} onChange={handleRtspChannelsChange} />
                                            </div>
                                        </Form.Group>
                                    </div> :
                                    <div className="forms-sample">
                                        <Form.Group className="row">
                                            <label htmlFor="cameraIP" className="col-sm-3 col-form-label">摄像头IP</label>
                                            <div className="col-sm-9">
                                                <Form.Control type="text" className="form-control" id="cameraIP" placeholder="摄像头IP"
                                                    value={cameraIP} onChange={handleCameraIPChange} />
                                            </div>
                                        </Form.Group>
                                        <Form.Group className="row">
                                            <label htmlFor="cameraUserName" className="col-sm-3 col-form-label">用户名</label>
                                            <div className="col-sm-9">
                                                <Form.Control type="text" className="form-control" id="cameraUserName" placeholder="用户名"
                                                    value={cameraUserName} onChange={handleCameraUserNameChange} />
                                            </div>
                                        </Form.Group>
                                        <Form.Group className="row">
                                            <label htmlFor="cameraPassword" className="col-sm-3 col-form-label">密码</label>
                                            <div className="col-sm-9">
                                                <Form.Control type="text" className="form-control" id="cameraPassword" placeholder="密码"
                                                    value={cameraPassword} onChange={handleCameraPasswordChange} />
                                            </div>
                                        </Form.Group>
                                    </div>
                            }
                            <button type="button" className="btn btn-gradient-primary mr-2" onClick={handleApplyVideoConfig}>添加</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}