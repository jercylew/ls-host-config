import React, { useEffect, useState } from 'react';
import {
    useLocation, Link
} from "react-router-dom";
import HomeUrlPrefix from '../HomeUrlPrefix';
import { Form } from 'react-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
import AxiosClient from '../../lib/AxiosClient';
import Toast from 'react-bootstrap/Toast';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ProgressBar } from 'react-bootstrap';
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

    const [warningDialogVisible, setWarningDialogVisible] = useState(false);
    const [cameraChEditDialogVisible, setCameraChEditDialogVisible] = useState(false)

    const [sceneName, setSceneName] = useState('');
    const [frpPort, setFrpPort] = useState('');
    const [sceneAddress, setSceneAddress] = useState('');
    const [gpsCoordinate, setGpsCoordinate] = useState('');
    const [telephone, setTelephone] = useState('');
    const [cameraChannels, setCameraChannels] = useState([]);

    const [rtspSourceType, setRtspSourceType] = useState(RtspSourceType.VideoRecorder);
    const [cameraManufacture, setCameraManufacture] = useState(CameraManufacture.HikVision);
    const [channelName, setChannelName] = useState('');

    const [videoRecorderIP, setVideoRecorderIP] = useState('');
    const [rtspUserName, setRtspUserName] = useState('admin');
    const [rtspPassword, setRtspPassword] = useState('admin123');
    const [rtspChannels, setRtspChannels] = useState('1-8');

    const [cameraIP, setCameraIP] = useState('');
    const [cameraUserName, setCameraUserName] = useState('');
    const [cameraPassword, setCameraPassword] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);


    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    //Edit
    const [editCameraChannelName, setEditCameraChannelName] = useState('');
    const [editCameraIp, setEditCameraIp] = useState('');
    const [editRtspUser, setEditRtspUser] = useState('');
    const [editRtspPassword, setEditRtspPassword] = useState('');
    const [editCameraVendor, setEditCameraVendor] = useState(CameraManufacture.HikVision);
    const [editRtspChannelId, setEditRtspChannelId] = useState(1);

    const closeWarningDialog = () => setWarningDialogVisible(false);
    const showWarningDialog = () => setWarningDialogVisible(true);

    const closeCameraChEditDialog = () => setCameraChEditDialogVisible(false);
    const showCameraChEdiDialog = () => setCameraChEditDialogVisible(true);

    const deleteChannel = (index) => {
        const chName = cameraChannels[index].name;
        closeWarningDialog();

        AxiosClient.delete(`v1/scene-config/cameras/${cameraChannels[index].id}`).then(resp => {
            const respData = resp.data;
            if (respData.is_succeed) {
                setToastMessage(`删除通道 '${chName}' 成功！`);
                setToastVisible(true);
                refreshChannelList();
            }
            else {
                console.log(`删除通道 '${chName}' 失败: ` + respData.message);
                setToastMessage(`删除通道 '${chName}' 失败！`);
                setToastVisible(true);
            }
        })
            .catch(error => {
                console.log(`删除通道 '${chName}' 失败: ` + error.message);
                setToastMessage(`删除通道 '${chName}' 失败！`);
                setToastVisible(true);
            });
    };

    const refreshChannelList = () => {
        AxiosClient.get(`v1/scene-config/cameras`)
            .then(res => {
                const respData = res.data
                if (respData.is_succeed) {
                    setCameraChannels(respData.data.channels);
                }
            }).catch(err => {
                console.log(err);
            });
    };

    const updateChannel = (index) => {
        closeCameraChEditDialog();
        const cameraChannelInfo = {
            name: editCameraChannelName,
            camera_vendor: editCameraVendor,
            rtsp_user: editRtspUser,
            rtsp_password: editRtspPassword,
            rtsp_ip: editCameraIp,
            rtsp_channel_id: editRtspChannelId
        };

        AxiosClient.put(`v1/scene-config/cameras/${cameraChannels[index].id}`, cameraChannelInfo).then(resp => {
            const respData = resp.data;
            if (respData.is_succeed) {
                setToastMessage(`更新摄像头通道成功！`);
                setToastVisible(true);
                refreshChannelList();
            }
            else {
                console.log(`更新摄像头通道失败: ${respData.message}`);
                setToastMessage(`更新摄像头通道失败！`);
                setToastVisible(true);
            }
        })
            .catch(error => {
                console.log(`更新摄像头通道失败: ${error.message}`);
                setToastMessage(`更新摄像头通道失败！`);
                setToastVisible(true);
            });
    };


    const handleRtspSourceChange = event => {
        setRtspSourceType(parseInt(event.target.value));
    };

    const handleCameraManufactureChange = event => {
        setCameraManufacture(parseInt(event.target.value));
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
        const payload = {
            name: sceneName,
            address: sceneAddress,
            port: frpPort,
            tel_number: telephone,
            gps_coordinate: gpsCoordinate
        };

        AxiosClient.post(`v1/scene-config/scene`, payload).then(resp => {
            const respData = resp.data;
            if (respData.is_succeed) {
                setToastMessage(`更新场地成功！`);
                setToastVisible(true);
            }
            else {
                console.log(`更新场地失败: ${respData.message}`);
                setToastMessage(`更新场地失败！`);
                setToastVisible(true);
            }
        })
            .catch(error => {
                console.log(`更新场地失败: ${error.message}`);
                setToastMessage(`更新场地失败！`);
                setToastVisible(true);
            });
    };

    const handleApplyVideoConfig = () => {
        let cameraChannelsToSave = [];

        if (rtspSourceType === RtspSourceType.VideoRecorder) {
            if (rtspChannels === '') {
                alert('请输入通道号！');
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

            const channelNames = channelName.split(",");
            let channelNameIndex = 0;
            const rtspChRanges = rtspChannels.split(",");
            for (let i = 0;i < rtspChRanges.length;i++) {
                const range = rtspChRanges[i];
                if (range.includes("-")) {
                    const startEnd = range.split("-");
                    if (startEnd.length == 2) {
                        if (startEnd[0] < startEnd[1]) {
                            for (let j = parseInt(startEnd[0]);j <= parseInt(startEnd[1]);j++) {
                                const cameraChannelInfo = {
                                    name: (channelNameIndex >= 0 && channelNameIndex < channelNames.length) ?
                                        channelNames[channelNameIndex] : "未命名通道",
                                    camera_vendor: cameraManufacture,
                                    rtsp_user: rtspUserName,
                                    rtsp_password: rtspPassword,
                                    rtsp_ip: videoRecorderIP,
                                    rtsp_channel_id: j
                                };
                                cameraChannelsToSave.push(cameraChannelInfo);
                            }
                        }
                    }
                }
                else {
                    const cameraChannelInfo = {
                        name: (channelNameIndex >= 0 && channelNameIndex < channelNames.length) ?
                            channelNames[channelNameIndex] : "未命名通道",
                        camera_vendor: cameraManufacture,
                        rtsp_user: rtspUserName,
                        rtsp_password: rtspPassword,
                        rtsp_ip: videoRecorderIP,
                        rtsp_channel_id: parseInt(range)
                    };
                    cameraChannelsToSave.push(cameraChannelInfo);
                }
                channelNameIndex++;
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

            const cameraChannelInfo = {
                name: channelName,
                camera_vendor: cameraManufacture,
                rtsp_user: cameraUserName,
                rtsp_password: cameraPassword,
                rtsp_ip: cameraIP,
                rtsp_channel_id: 1
            };
            cameraChannelsToSave.push(cameraChannelInfo);
        }

        let reqPromises = [];
        for (let i = 0;i < cameraChannelsToSave.length;i++) {
            const p = AxiosClient.post(`v1/scene-config/cameras`, cameraChannelsToSave[i]);
            reqPromises.push(p);
        }

        Promise.all(reqPromises).then((resps) => {
            console.log(resps);
            let allSucceed = true;
            let messages = "";

            for (let j = 0;j < resps.length;j++) {
                if (!resps[j].data.is_succeed) {
                    allSucceed = false;
                    messages = messages + "," + resps[j].data.message;
                }
            }

            if (allSucceed) {
                setToastMessage(`添加摄像头通道成功！`);
                setToastVisible(true);
                refreshChannelList();
            }
            else {
                console.log(`添加摄像头通道失败: ${messages}`);
                setToastMessage(`添加摄像头通道失败！`);
                setToastVisible(true);
            }
          }).catch(error => {
            console.log(`添加摄像头通道失败: ${error.message}`);
            setToastMessage(`添加摄像头通道失败！`);
            setToastVisible(true);
        });

        // Send to server
        // cameraChannelsToSave.forEach((channel) => {
        //     AxiosClient.post(`v1/scene-config/cameras`, channel).then(resp => {
        //         const respData = resp.data;
        //         if (respData.is_succeed) {
        //             setToastMessage(`添加摄像头通道成功！`);
        //             setToastVisible(true);
        //         }
        //         else {
        //             console.log(`添加摄像头通道失败: ${respData.message}`);
        //             setToastMessage(`添加摄像头通道失败！`);
        //             setToastVisible(true);
        //         }
        //     })
        //         .catch(error => {
        //             console.log(`添加摄像头通道失败: ${error.message}`);
        //             setToastMessage(`添加摄像头通道失败！`);
        //             setToastVisible(true);
        //         });
        // });
    };

    useEffect(() => {
        bsCustomFileInput.init();
        AxiosClient.get(`v1/scene-config/scene`)
            .then(res => {
                const respData = res.data
                if (respData.is_succeed) {
                    setSceneName(respData.data.scene_name)
                    setSceneAddress(respData.data.scene_address)
                    setGpsCoordinate(respData.data.gps_coordinate)
                    setTelephone(respData.data.tel_number)
                    setFrpPort(respData.data.frp_port)
                }
            }).catch(err => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        bsCustomFileInput.init();
        refreshChannelList();
    }, []);

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Toast onClose={() => setToastVisible(false)} style={{
                    position: 'fixed', zIndex: 3,
                    width: '80%'
                }}
                    show={toastVisible} delay={500000} autohide>
                    <Toast.Header>
                        <strong className="mr-auto">系统配置</strong>
                        <small>1 mins ago</small>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </div>
            <div>
                <div className="page-header">
                    <h3 className="page-title">{`场地配置`}</h3>
                </div>
                <div className="row">
                    <div className="col-md-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title"><i className="mdi mdi-map-marker-multiple"></i>场地</h4>
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
                                                value={sceneAddress} onChange={ (event) => { setSceneAddress(event.target.value); } } />
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
                                                    onChange={handleRtspSourceChange}
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
                                    <label htmlFor="channelName" className="col-sm-3 col-form-label">通道名称</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" className="form-control" id="channelName"
                                            onChange={(event) => {
                                                setChannelName(event.target.value);
                                            }} placeholder="如果是通过录像机添加，则在这里可以输入多个通道名称，以逗号隔开，与后面批量添加通道对应！" value={channelName} />
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
                    <div className="col-lg-12 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">通道列表</h4>
                                <p className="card-description">已添加摄像头通道于以下列表显示
                                </p>
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th> 编号 </th>
                                                <th> 名称 </th>
                                                <th> IP </th>
                                                <th> 录像机品牌 </th>
                                                <th> 用户名 </th>
                                                <th> 密码 </th>
                                                <th> 操作 </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            cameraChannels.length > 0 ? cameraChannels.map(
                                                (chCamera, index) => {
                                                    return (
                                                        <tr key={`ch-${chCamera.id}`}>
                                                            <td className="py-1">{chCamera.id}</td>
                                                            <td> {chCamera.name} </td>
                                                            <td> {chCamera.rtsp_ip} </td>
                                                            <td> {chCamera.camera_vendor == CameraManufacture.HikVision ? '海康' : '大华'} </td>
                                                            <td> {chCamera.rtsp_user} </td>
                                                            <td> {chCamera.rtsp_password} </td>
                                                            <td>
                                                                <div style={{ display: 'flex', alignItems: 'center',
                                                                justifyContent: 'start' }}>
                                                                    <div className="mr-3" onClick={() => {
                                                                        setCurrentIndex(index);
                                                                        showWarningDialog();
                                                                    }} style={{ cursor: 'pointer' }}>
                                                                        <i className="mdi mdi-delete icon-sm text-primary align-middle"></i>
                                                                    </div>
                                                                    <div className="mx-3" onClick={() => {
                                                                        setCurrentIndex(index);
                                                                        setEditCameraChannelName(chCamera.name);
                                                                        setEditCameraIp(chCamera.rtsp_ip);
                                                                        setEditCameraVendor(chCamera.camera_vendor);
                                                                        setEditRtspChannelId(chCamera.rtsp_channel_id);
                                                                        setEditRtspUser(chCamera.rtsp_user);
                                                                        setEditRtspPassword(chCamera.rtsp_password);
                                                                        showCameraChEdiDialog();
                                                                    }} style={{ cursor: 'pointer' }}>
                                                                        <i className="mdi mdi-settings icon-sm text-primary align-middle"></i>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            ) : <tr><td>'没有通道可显示！'</td></tr>
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={warningDialogVisible} onHide={closeWarningDialog}>
                <Modal.Header closeButton>
                    <Modal.Title>警告</Modal.Title>
                </Modal.Header>
                <Modal.Body>{cameraChannels.length > 0 && currentIndex >= 0 && currentIndex < cameraChannels.length ?
                    `即将删除通道：${cameraChannels[currentIndex].name}，是否继续` : ''}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeWarningDialog}>
                        取消
                    </Button>
                    <Button variant="primary" onClick={() => { deleteChannel(currentIndex); }}>
                        确定
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={cameraChEditDialogVisible} onHide={closeCameraChEditDialog}>
                <Modal.Header closeButton>
                    <Modal.Title>通道编辑</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{
                        height: '465px',
                        overflowY: 'scroll'
                    }}>
                    <div className="col-md-12 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <Form.Group className="row">
                                    <label className="col-sm-3 col-form-label">录像机品牌</label>
                                    <div className="col-sm-9">
                                        <select className="form-control" onChange={(event) => {
                                            setEditCameraVendor(parseInt(event.target.value));
                                        }}>
                                            <option value={CameraManufacture.HikVision}
                                                selected={editCameraVendor === CameraManufacture.HikVision}>海康威视</option>
                                            <option value={CameraManufacture.Dahua}
                                                selected={editCameraVendor === CameraManufacture.Dahua}>大华</option>
                                        </select>
                                    </div>
                                </Form.Group>
                                <Form.Group className="row">
                                    <label htmlFor="editCameraChannelName" className="col-sm-3 col-form-label">通道名称</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" className="form-control" id="editCameraChannelName" placeholder="通道名称"
                                            value={editCameraChannelName} onChange={(event) => {
                                                setEditCameraChannelName(event.target.value);
                                            }} />
                                    </div>
                                </Form.Group>
                                <Form.Group className="row">
                                    <label htmlFor="editCameraIP" className="col-sm-3 col-form-label">摄像头IP</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" className="form-control" id="editCameraIP" placeholder="摄像头IP"
                                            value={editCameraIp} onChange={(event) => {
                                                setEditCameraIp(event.target.value);
                                            }} />
                                    </div>
                                </Form.Group>
                                <Form.Group className="row">
                                    <label htmlFor="editCameraUserName" className="col-sm-3 col-form-label">用户名</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" className="form-control" id="editCameraUserName" placeholder="用户名"
                                            value={editRtspUser} onChange={(event) => {
                                                setEditRtspUser(event.target.value);
                                            }} />
                                    </div>
                                </Form.Group>
                                <Form.Group className="row">
                                    <label htmlFor="editCameraPassword" className="col-sm-3 col-form-label">密码</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" className="form-control" id="editCameraPassword" placeholder="密码"
                                            value={editRtspPassword} onChange={(event) => {
                                                setEditRtspPassword(event.target.value);
                                            }} />
                                    </div>
                                </Form.Group>
                                <Form.Group className="row">
                                    <label htmlFor="editCameraChannelId" className="col-sm-3 col-form-label">通道ID</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="number" className="form-control" id="editCameraChannelId" placeholder="密码"
                                            value={editRtspChannelId} onChange={(event) => {
                                                setEditRtspChannelId(parseInt(event.target.value));
                                            }} />
                                    </div>
                                </Form.Group>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeCameraChEditDialog}>
                        取消
                    </Button>
                    <Button variant="primary" onClick={() => { updateChannel(currentIndex); }}>
                        确定
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}