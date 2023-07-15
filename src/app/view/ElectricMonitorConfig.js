import React, { useEffect, useState } from 'react';
// import { Form } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import bsCustomFileInput from 'bs-custom-file-input';
import AxiosClient from '../../lib/AxiosClient';

export default function ElectricMonitorConfig() {
    const [warningDialogVisible, setWarningDialogVisible] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [newChName, setNewChName] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [operatingSucceed, setOperatingSucceed] = useState(true);

    const closeWarningDialog = () => setWarningDialogVisible(false);
    const showWarningDialog = () => setWarningDialogVisible(true);
    const deleteChannel = (index) => {
        closeWarningDialog();
        AxiosClient.delete(`v1/electric-configs/channels/${channelSettings[index].id}`).then(resp => {
            const respData = resp.data;
            if (respData.is_succeed) {
                setToastMessage(`删除通道 '${channelSettings[index].ch_name}' 成功！`);
                setToastVisible(true);
                refreshChannelList();
            }
            else {
                console.log(`删除通道 '${channelSettings[index].ch_name}' 失败: ` + respData.message);
                setToastMessage(`删除通道 '${channelSettings[index].ch_name}' 失败！`);
                setToastVisible(true);
            }
        })
            .catch(error => {
                console.log(`删除通道 '${channelSettings[index].ch_name}' 失败: ` + error.message);
                setToastMessage(`删除通道 '${channelSettings[index].ch_name}' 失败！`);
                setToastVisible(true);
            });
    };

    const refreshChannelList = () => {
        AxiosClient.get(`v1/electric-configs/channels`)
            .then(res => {
                const respData = res.data
                if (respData.is_succeed) {
                    setChannelSettings(respData.data.channels);
                }
            }).catch(err => {
                console.log(err);
            });
    };

    const showAlertSucceed = (message) => {
        setOperatingSucceed(true);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const showAlertFailed = (message) => {
        setOperatingSucceed(false);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const updateChannel = (index) => {
        const chPayload = channelSettings[index];

        console.log('Trying to update channel: ', chPayload);
        AxiosClient.put(`v1/electric-configs/channels/${chPayload.id}`, chPayload).then(resp => {
            const respData = resp.data;
            if (respData.is_succeed) {
                refreshChannelList();
                setToastMessage(`更新通道 '${chPayload.ch_name}' 成功！`);
                setToastVisible(true);
            }
            else {
                setToastMessage(`更新通道 '${chPayload.ch_name}' 失败！`);
                setToastVisible(true);
            }
        })
            .catch(error => {
                setToastMessage(`更新通道 '${chPayload.ch_name}' 失败！`);
                setToastVisible(true);
            });
    };

    const addNewChannel = (chName) => {
        if (chName === '') {
            showAlertFailed('添加通道失败，通道名不能为空！');
            return;
        }
        const chPayload = {
            ch_name: chName,
            ch_temp_read_address: 0,
            ch_leakcurrent_read_address: 0,
            ch_current_read_address: 0,
            current_allowed_range_max: 20,
            current_info_trigger_range: '10-20',
            current_info_trigger_duration: 30,
            current_alarm_trigger_range: '>20',
            current_alarm_trigger_duration: 30,
            temp_info_trigger_range: '32-40',
            temp_info_trigger_duration: 30,
            temp_alarm_trigger_range: '>40',
            temp_alarm_trigger_duration: 30,
            leakcurrent_info_trigger_range: '32-40',
            leakcurrent_info_trigger_duration: 30,
            leakcurrent_alarm_trigger_range: '>40',
            leakcurrent_alarm_trigger_duration: 30
        };

        console.log('Trying to add new channel: ', chPayload);
        AxiosClient.post(`v1/electric-configs/channels`, chPayload).then(resp => {
            const respData = resp.data;
            if (respData.is_succeed) {
                showAlertSucceed(`添加通道 '${chPayload.ch_name}' 成功！`);
                refreshChannelList();
            }
            else {
                showAlertFailed(`添加通道 '${chPayload.ch_name}' 失败: ` + respData.message);
            }
        })
            .catch(error => {
                showAlertFailed(`添加通道 '${chPayload.ch_name}' 失败: ` + error.message)
            });
    };

    //The value trigger expression format supported,
    // 'a-b': value between a and b
    // '>a': value is greater than a
    // '<a': value is smaller than a
    // Otherwise: invalid format
    const [channelSettings, setChannelSettings] = useState([]);

    const [advancedSettings, setAdvancedSettings] = useState([
        false, false, false, false, false
    ]);

    const handleUpdateChStringSetting = (e, index, field) => {
        const newSettings = [...channelSettings.slice(0, index),
        { ...channelSettings[index], [field]: e.target.value },
        ...channelSettings.slice(index + 1)];
        setChannelSettings(newSettings);
    };

    const handleUpdateChIntSetting = (e, index, field) => {
        const newSettings = [...channelSettings.slice(0, index),
        { ...channelSettings[index], [field]: parseInt(e.target.value) },
        ...channelSettings.slice(index + 1)];
        setChannelSettings(newSettings);
    };

    useEffect(() => {
        bsCustomFileInput.init();
        refreshChannelList();
    }, []);

    return (
        <>
            <Alert show={alertVisible} variant={operatingSucceed ? "success" : "danger"}
                onClose={() => setAlertVisible(false)} dismissible>
                <Alert.Heading>{operatingSucceed ? "操作成功" : "操作失败"}</Alert.Heading>
                <p>{alertMessage}</p>
            </Alert>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Toast onClose={() => setToastVisible(false)} style={{
                    position: 'fixed', zIndex: 3,
                    width: '80%'
                }}
                    show={toastVisible} delay={500000} autohide>
                    <Toast.Header>
                        <strong className="mr-auto">电箱配置</strong>
                        <small>1 mins ago</small>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </div>
            <div>
                <div className="page-header">
                    <h3 className="page-title">{`电箱配置`}</h3>
                </div>
                <form className="form-inline">
                    <label className="sr-only" htmlFor="inlineFormChannelName">Name</label>
                    <Form.Control type="text" className="form-control mb-2 mr-sm-2" id="inlineFormChannelName"
                        value={newChName} onChange={(event) => { setNewChName(event.target.value); }}
                        placeholder="通道名称" />
                    {/* <label className="sr-only" htmlFor="inlineFormPort">Port</label>
                    <div className="input-group mb-2 mr-sm-2">
                        <Form.Control type="text" className="form-control" id="inlineFormPort"
                            onChange={this.handleInputScenePortChange} placeholder="端口号" />
                    </div> */}
                    <button type="button" className="btn btn-gradient-primary mb-2"
                        onClick={() => {
                            addNewChannel(newChName);
                        }}>添加新通道</button>
                </form>
                <div className="row mt-5" style={{
                    height: '465px',
                    overflowY: 'scroll'
                }}>
                    {
                        channelSettings.length > 0 ? channelSettings.map((chSetting, index) => {
                            return (
                                <div className="col-md-6 grid-margin stretch-card" key={`ch-${chSetting.id}`}>
                                    <div className="card">
                                        <div className="card-body">
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                                                onClick={() => {
                                                    console.log('To remove channel: ', chSetting.ch_name);
                                                    setCurrentIndex(index);
                                                    showWarningDialog();
                                                }}>
                                                <h4 className="card-title"><i className="mdi mdi-flash-auto"></i>{`通道${index}`}</h4>
                                                <i className="mdi mdi-delete icon-sm text-primary align-middle"></i>
                                            </div>

                                            <form className="forms-sample">
                                                <Form.Group className="row">
                                                    <label htmlFor={`chId${chSetting.id}`} className="col-sm-3 col-form-label">ID</label>
                                                    <div className="col-sm-9">
                                                        <Form.Control type="text" className="form-control" id={`chId-${chSetting.id}`} placeholder=""
                                                            value={chSetting.id} readOnly />
                                                    </div>
                                                </Form.Group>
                                                <Form.Group className="row">
                                                    <label htmlFor={`currentRangeMax${chSetting.id}`} className="col-sm-3 col-form-label">量程</label>
                                                    <div className="col-sm-9">
                                                        {/* <Form.Control type="text" className="form-control" id={`currentRange${chSetting.id}`} placeholder=""
                                                            value={chSetting.current_allowed_range_max} readOnly /> */}
                                                        <Form.Control as="select"
                                                            id={`currentRangeMax${chSetting.id}`}
                                                            className="mt-2"
                                                            onChange={(event) => handleUpdateChIntSetting(event, index, 'current_allowed_range_max')}
                                                        >
                                                            {[
                                                                '10',
                                                                '15',
                                                                '20',
                                                                '25',
                                                            ].map((p) => (
                                                                <option key={p} value={p} selected={parseInt(p) === chSetting.current_allowed_range_max}>
                                                                    {p}
                                                                </option>
                                                            ))}
                                                        </Form.Control>
                                                    </div>
                                                </Form.Group>
                                                <Form.Group className="row">
                                                    <label htmlFor={`chName${chSetting.id}`} className="col-sm-3 col-form-label">通道名</label>
                                                    <div className="col-sm-9">
                                                        <Form.Control type="text" className="form-control" id={`chName${chSetting.id}`} placeholder=""
                                                            value={chSetting.ch_name} onChange={(event) => {
                                                                handleUpdateChStringSetting(event, index, 'ch_name');
                                                            }} />
                                                    </div>
                                                </Form.Group>
                                                <Form.Group className="row">
                                                    <button type="button" className="btn btn-inverse-danger btn-icon" onClick={() => {
                                                        let updated = [...advancedSettings];
                                                        updated[index] = !updated[index];
                                                        setAdvancedSettings(updated);
                                                    }}>
                                                        <i className={advancedSettings[index] ? "mdi mdi-chevron-double-up" : "mdi mdi-chevron-double-down"}></i>
                                                    </button>
                                                </Form.Group>
                                                {
                                                    advancedSettings[index] ? (
                                                        <>
                                                            <Form.Group className="row">
                                                                <label htmlFor={`chTempReadAddress${chSetting.id}`} className="col-sm-3 col-form-label">温度读取地址</label>
                                                                <div className="col-sm-9">
                                                                    <Form.Control type="text" className="form-control" id={`chTempReadAddress${chSetting.id}`} placeholder=""
                                                                        value={chSetting.ch_temp_read_address} onChange={(event) => {
                                                                            handleUpdateChStringSetting(event, index, 'ch_temp_read_address');
                                                                        }} />
                                                                </div>
                                                            </Form.Group>
                                                            <Form.Group className="row">
                                                                <label htmlFor={`chLeakCurrentReadAddress${chSetting.id}`} className="col-sm-3 col-form-label">漏电流读取地址</label>
                                                                <div className="col-sm-9">
                                                                    <Form.Control type="text" className="form-control" id={`chLeakCurrentReadAddress${chSetting.id}`} placeholder=""
                                                                        value={chSetting.ch_leakcurrent_read_address} onChange={(event) => {
                                                                            handleUpdateChStringSetting(event, index, 'ch_leakcurrent_read_address');
                                                                        }} />
                                                                </div>
                                                            </Form.Group>
                                                            <Form.Group className="row">
                                                                <label htmlFor={`chCurrentReadAddress${chSetting.id}`} className="col-sm-3 col-form-label">电流读取地址</label>
                                                                <div className="col-sm-9">
                                                                    <Form.Control type="text" className="form-control" id={`chCurrentReadAddress${chSetting.id}`} placeholder=""
                                                                        value={chSetting.ch_current_read_address} onChange={(event) => {
                                                                            handleUpdateChStringSetting(event, index, 'ch_current_read_address');
                                                                        }} />
                                                                </div>
                                                            </Form.Group>
                                                            <div className='mt-1 mb-1' style={{ width: '100%', height: '1px', backgroundColor: '#78BDF5' }}></div>
                                                            <Form.Group className="row">
                                                                <label htmlFor={`chOverTempInfo${chSetting.id}`} className="col-sm-3 col-form-label">过热触发（提示）</label>
                                                                <div className="col-sm-9">
                                                                    <Form.Control type="text" className="form-control" id={`chOverTempInfo${chSetting.id}`} placeholder=""
                                                                        value={chSetting.temp_info_trigger_range} onChange={(event) => {
                                                                            handleUpdateChStringSetting(event, index, 'temp_info_trigger_range');
                                                                        }} />
                                                                </div>
                                                            </Form.Group>
                                                            <Form.Group className="row">
                                                                <label htmlFor={`chOverTempInfoDuration${chSetting.id}`} className="col-sm-3 col-form-label">触发时间（秒）</label>
                                                                <div className="col-sm-9">
                                                                    <Form.Control type="number" className="form-control" id={`chOverTempInfoDuration${chSetting.id}`} placeholder="250"
                                                                        value={chSetting.temp_info_trigger_duration} onChange={(event) => {
                                                                            handleUpdateChIntSetting(event, index, 'temp_info_trigger_duration');
                                                                        }} />
                                                                </div>
                                                            </Form.Group>
                                                            <div className='mt-1 mb-1' style={{ width: '100%', height: '1px', backgroundColor: '#78BDF5' }}></div>
                                                            <Form.Group className="row">
                                                                <label htmlFor={`chOverTempAlarm${chSetting.id}`} className="col-sm-3 col-form-label">过热触发(告警)</label>
                                                                <div className="col-sm-9">
                                                                    <Form.Control type="text" className="form-control" id={`chOverTempAlarm${chSetting.id}`} placeholder=""
                                                                        value={chSetting.temp_alarm_trigger_range} onChange={(event) => {
                                                                            handleUpdateChStringSetting(event, index, 'temp_alarm_trigger_range');
                                                                        }} />
                                                                </div>
                                                            </Form.Group>
                                                            <Form.Group className="row">
                                                                <label htmlFor={`chOverTempAlarmDuration${chSetting.id}`} className="col-sm-3 col-form-label">触发时间(秒)</label>
                                                                <div className="col-sm-9">
                                                                    <Form.Control type="number" className="form-control" id={`chOverTempAlarmDuration${chSetting.id}`} placeholder="250"
                                                                        value={chSetting.temp_alarm_trigger_duration} onChange={(event) => {
                                                                            handleUpdateChIntSetting(event, index, 'temp_alarm_trigger_duration');
                                                                        }} />
                                                                </div>
                                                            </Form.Group>
                                                            <div className='mt-1 mb-1' style={{ width: '100%', height: '1px', backgroundColor: '#78BDF5' }}></div>
                                                            <Form.Group className="row">
                                                                <label htmlFor={`chOverCurrentInfo${chSetting.id}`} className="col-sm-3 col-form-label">过流触发（提示）</label>
                                                                <div className="col-sm-9">
                                                                    <Form.Control type="text" className="form-control" id={`chOverCurrentInfo${chSetting.id}`} placeholder=""
                                                                        value={chSetting.current_info_trigger_range} onChange={(event) => {
                                                                            handleUpdateChStringSetting(event, index, 'current_info_trigger_range');
                                                                        }} />
                                                                </div>
                                                            </Form.Group>
                                                            <Form.Group className="row">
                                                                <label htmlFor={`chOverCurrentInfoDuration${chSetting.id}`} className="col-sm-3 col-form-label">触发时间（秒）</label>
                                                                <div className="col-sm-9">
                                                                    <Form.Control type="number" className="form-control" id={`chOverCurrentInfoDuration${chSetting.id}`} placeholder="250"
                                                                        value={chSetting.current_info_trigger_duration} onChange={(event) => {
                                                                            handleUpdateChIntSetting(event, index, 'current_info_trigger_duration');
                                                                        }} />
                                                                </div>
                                                            </Form.Group>
                                                            <div className='mt-1 mb-1' style={{ width: '100%', height: '1px', backgroundColor: '#78BDF5' }}></div>
                                                            <Form.Group className="row">
                                                                <label htmlFor={`chOverCurrentAlarm${chSetting.id}`} className="col-sm-3 col-form-label">过流触发（告警）</label>
                                                                <div className="col-sm-9">
                                                                    <Form.Control type="text" className="form-control" id={`chOverCurrentAlarm${chSetting.id}`} placeholder=""
                                                                        value={chSetting.current_alarm_trigger_range} onChange={(event) => {
                                                                            handleUpdateChStringSetting(event, index, 'current_alarm_trigger_range');
                                                                        }} />
                                                                </div>
                                                            </Form.Group>
                                                            <Form.Group className="row">
                                                                <label htmlFor={`chOverCurrentAlarmDuration${chSetting.id}`} className="col-sm-3 col-form-label">触发时间（秒）</label>
                                                                <div className="col-sm-9">
                                                                    <Form.Control type="number" className="form-control" id={`chOverCurrentAlarmDuration${chSetting.id}`} placeholder="250"
                                                                        value={chSetting.current_alarm_trigger_duration} onChange={(event) => {
                                                                            handleUpdateChIntSetting(event, index, 'current_alarm_trigger_duration');
                                                                        }} />
                                                                </div>
                                                            </Form.Group>
                                                            <div className='mt-1 mb-1' style={{ width: '100%', height: '1px', backgroundColor: '#78BDF5' }}></div>
                                                            <Form.Group className="row">
                                                                <label htmlFor={`chOverLeakCurrentInfo${chSetting.id}`} className="col-sm-3 col-form-label">漏电流（提示）</label>
                                                                <div className="col-sm-9">
                                                                    <Form.Control type="text" className="form-control" id={`chOverLeakCurrentInfo${chSetting.id}`} placeholder="250"
                                                                        value={chSetting.leakcurrent_info_trigger_range} onChange={(event) => {
                                                                            handleUpdateChStringSetting(event, index, 'leakcurrent_info_trigger_range');
                                                                        }} />
                                                                </div>
                                                            </Form.Group>
                                                            <Form.Group className="row">
                                                                <label htmlFor={`chOverLeakCurrentInfoDuration${chSetting.id}`} className="col-sm-3 col-form-label">触发时间（秒）</label>
                                                                <div className="col-sm-9">
                                                                    <Form.Control type="number" className="form-control" id={`chOverLeakCurrentInfoDuration${chSetting.id}`} placeholder="250"
                                                                        value={chSetting.leakcurrent_info_trigger_duration} onChange={(event) => {
                                                                            handleUpdateChIntSetting(event, index, 'leakcurrent_info_trigger_duration');
                                                                        }} />
                                                                </div>
                                                            </Form.Group>
                                                            <div className='mt-1 mb-1' style={{ width: '100%', height: '1px', backgroundColor: '#78BDF5' }}></div>
                                                            <Form.Group className="row">
                                                                <label htmlFor={`chOverLeakCurrentAlarm${chSetting.id}`} className="col-sm-3 col-form-label">漏电流（告警）</label>
                                                                <div className="col-sm-9">
                                                                    <Form.Control type="text" className="form-control" id={`chOverLeakCurrentAlarm${chSetting.id}`} placeholder="250"
                                                                        value={chSetting.leakcurrent_alarm_trigger_range} onChange={(event) => {
                                                                            handleUpdateChStringSetting(event, index, 'leakcurrent_alarm_trigger_range');
                                                                        }} />
                                                                </div>
                                                            </Form.Group>
                                                            <Form.Group className="row">
                                                                <label htmlFor={`chOverLeakCurrentAlarmDuration${chSetting.id}`} className="col-sm-3 col-form-label">触发时间（秒）</label>
                                                                <div className="col-sm-9">
                                                                    <Form.Control type="number" className="form-control" id={`chOverLeakCurrentAlarmDuration${chSetting.id}`} placeholder="250"
                                                                        value={chSetting.leakcurrent_alarm_trigger_duration} onChange={(event) => {
                                                                            handleUpdateChIntSetting(event, index, 'leakcurrent_alarm_trigger_duration');
                                                                        }} />
                                                                </div>
                                                            </Form.Group>
                                                        </>) : null
                                                }
                                                <button type="button" className="btn btn-gradient-primary mr-2" onClick={() => {
                                                    updateChannel(index);
                                                }}>确定</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>)
                        }) : '没有通道可显示！'
                    }
                </div>
            </div>
            <Modal show={warningDialogVisible} onHide={closeWarningDialog}>
                <Modal.Header closeButton>
                    <Modal.Title>警告</Modal.Title>
                </Modal.Header>
                <Modal.Body>{channelSettings.length > 0 && currentIndex >= 0 && currentIndex < channelSettings.length ?
                    `即将删除通道：${channelSettings[currentIndex].ch_name}，是否继续` : ''}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeWarningDialog}>
                        取消
                    </Button>
                    <Button variant="primary" onClick={() => { deleteChannel(currentIndex); }}>
                        确定
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
