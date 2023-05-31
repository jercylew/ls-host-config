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
    else if (type === RtspSourceType.VideoRecorder) {
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
export default function BleMeshAdvancedConfig() {
    const query = useQuery();

    const [userId, setUserId] = useState('');

    const [id, setId] = useState('');
    const [gatewayId, setGatewayId] = useState(200);
    const [name, setName] = useState('');

    const [timeShieldCmdMS, setTimeShieldCmdMS] = useState(500);
    const [timeIntervalDataReportS, setTimeIntervalDataReportS] = useState(10);
    const [dataLogKeepDays, setDataLogKeepDays] = useState(10);
    const [mqttLogKeepDays, setMqttLogKeepDays] = useState(7);
    const [autoRebootWhenGatewayOff, setAutoRebootWhenGatewayOff] = useState(true);

    const [hostIP, setHostIP] = useState('');
    const [defaultGateway, setDefaultGateway] = useState('');
    const [mask, setMask] = useState('255.255.255.0');
    const [dns, setDns] = useState('114.114.114.114,8.8.8.8');

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

    const [meshCmd, setMeshCmd] = useState('');

    const handleTimeShieldCmdMSChange = event => {
        setTimeShieldCmdMS(parseInt(event.target.value));
    };

    const handleTimeIntervalDataReportSChange = event => {
        setTimeIntervalDataReportS(parseInt(event.target.value));
    };

    const handleDataLogKeepDaysChange = event => {
        setDataLogKeepDays(parseInt(event.target.value));
    };

    const handleMqttLogKeepDaysChange = event => {
        setMqttLogKeepDays(parseInt(event.target.value));
    };

    const handleAutoRebootWhenGatewayOffChange = event => {
        console.log('AutoRebootWhenGatewayOff: prev', autoRebootWhenGatewayOff);
        setAutoRebootWhenGatewayOff(event.target.checked);
    };

    const handlehostIPChange = event => {
        setHostIP(event.target.value);
    };

    const handleDefaultGatewayChange = event => {
        setDefaultGateway(event.target.value);
    };

    const handleMaskChange = event => {
        setMask(event.target.value);
    };

    const handleDNSChange = event => {
        setDns(event.target.value);
    };

    const handleRtspSourceChange = event => {
        console.log('RTSP source: ', event.target.value);
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

    const handleMeshCmdChange = event => {
        setMeshCmd(event.target.value);
    };

    const handleApplyBleConfig = () => {
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

    const handleApplyNetworkConfig = () => {
        //TODO: MQTT publish /host/cmd/xxxxxxxxxxxx-yyyyyy
        /*
        {
            cmd: 'set',
            category: 'network',
            params: {
                method: 'static'，
                ip: 'xxx.xxx.xxx.xxx',
                mask: '255.244.255.0',
                gateway: '192.168.1.1',
                dns: '114.114.114.114,8.8.8.8'
            }
        } Or
        {
            method: 'dhcp'
        }
        */

        if (hostIP === '' || defaultGateway === '') {
            alert('请输入要配的IP和网关！');
            return;
        }

        let cmdData = {
            user_id: userId,
            gateway_id: gatewayId,
            cmd: 'set',
            category: 'network',
            params: {
                method: 'static',
                ip: hostIP,
                mask: mask,
                gateway: defaultGateway,
                dns: dns
            }
        };

        console.log('Trying to save network settings: ', cmdData);
        AxiosClient.post(`/v1/scenes/${id}`, cmdData).then(resp => {
            console.log(resp);

            let respData = resp.data;
            if (respData.state === 0) {
                alert('设置网络成功');
            }
            else {
                alert('设置网络失败: ' + respData.message);
            }
        })
            .catch(error => {
                alert('设置网络失败: ' + error.message);
            });
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
            user_id: userId,
            gateway_id: gatewayId,
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

        console.log('Trying to save video settings: ', cmdData);
        AxiosClient.post(`/v1/scenes/${id}`, cmdData).then(resp => {
            console.log(resp);

            let respData = resp.data;
            if (respData.state === 0) {
                alert('添加视频通道成功');
            }
            else {
                alert('添加视频通道失败: ' + respData.message);
            }
        })
            .catch(error => {
                alert('添加视频通道失败: ' + error.message);
            });
    };

    useEffect(() => {
        bsCustomFileInput.init();
        setTimeout(() => {
            setId(query.get('id'));
            setGatewayId(query.get('gateway_id'));
            setName(query.get('name'));
            setUserId('jiulong_data_platform_' + uuidv4());
        }, 500);
    });

    return (
        <div>
            <div className="page-header">
                <h3 className="page-title">{`高级配置`}</h3>
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
                            <h4 className="card-title"><i className="mdi mdi-ethernet"></i>网关设置</h4>
                            <form className="forms-sample">
                                <Form.Group className="row">
                                    <label htmlFor="hostIP" className="col-sm-3 col-form-label">网关Mesh名</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" className="form-control" id="hostIP" placeholder="网关Mesh名, 如： TKT_MESH"
                                            value={hostIP} onChange={handlehostIPChange} />
                                    </div>
                                </Form.Group>
                                <Form.Group className="row">
                                    <label htmlFor="defaultGateway" className="col-sm-3 col-form-label">网关Mesh密码</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" className="form-control" id="defaultGateway" placeholder="网关密码(4位),  如： 1qaz"
                                            value={defaultGateway} onChange={handleDefaultGatewayChange} />
                                    </div>
                                </Form.Group>
                                <Form.Group className="row">
                                    <label htmlFor="gatewayId" className="col-sm-3 col-form-label">网关ID</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" className="form-control" id="gatewayId" placeholder="网关ID, 0~255之间的数值"
                                            value={gatewayId} onChange={handleMaskChange} />
                                    </div>
                                </Form.Group>
                                <button type="button" className="btn btn-gradient-primary mr-2" onClick={handleApplyNetworkConfig}>确定</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title"><i className="mdi mdi-video"></i>执行Mesh命令</h4>
                            <p className="card-description">注： 输入框中输入Mesh命令, 点击确认发送命令执行， 执行结果将于下面方框区显示
                            </p>
                            <Form.Group className="row">
                                <textarea cols='90' placeholder='命令, 如：{"command":"get_port_name_to_mesh_name_mapping","topic":"request"}' value={meshCmd}
                                        maxLength='420' id='cmdResult'
                                        className='col-sm-12' onChange={handleMeshCmdChange}
                                        style={{ border: 'dashed 1px #CFCFCF', resize: 'both', height: '145px', width: '100%' }} />
                            </Form.Group>
                            <button type="button" className="btn btn-gradient-primary mr-2" onClick={handleApplyVideoConfig}>执行</button>
                            <Form.Group className="row">
                                <div className="col-sm-12 mt-4" style={{ border: 'dashed 1px #CFCFCF', resize: 'both', height: '145px' }}>
                                </div>
                            </Form.Group>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}