import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import bsCustomFileInput from 'bs-custom-file-input';
import AxiosClient from '../../lib/AxiosClient';

export default function ElectricMonitorConfig() {
    const [show, setShow] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

    //The value trigger expression format supported,
    // 'a-b': value between a and b
    // '>a': value is greater than a
    // '<a': value is smaller than a
    // Otherwise: invalid format
    const [channelSettings, setChannelSettings] = useState([
        {
            id: 0,
            ch_name: '通道0',
            ch_temp_read_address: 2000,
            ch_leakcurrent_read_address: 3000,
            ch_current_read_address: 3000,
            current_allowed_range_max: 20,
            current_info_trigger_range: '10-20',
            current_info_trigger_duration: 30,
            current_alarm_trigger_range: '>20',
            current_alarm_trigger_duration: 30,
            temp_info_trigger_range: '32-40',
            temp_info_trigger_duration: 30,
            temp_alarm_trigger_range: '>40',
            temp_alarm_trigger_duration: 30
        },
        {
            id: 1,
            ch_name: '通道1',
            ch_temp_read_address: 2001,
            ch_leakcurrent_read_address: 3001,
            ch_current_read_address: 3001,
            current_allowed_range_max: 20,
            current_info_trigger_range: '10-20',
            current_info_trigger_duration: 30,
            current_alarm_trigger_range: '>20',
            current_alarm_trigger_duration: 30,
            temp_info_trigger_range: '32-40',
            temp_info_trigger_duration: 30,
            temp_alarm_trigger_range: '>40',
            temp_alarm_trigger_duration: 30
        },
        {
            id: 2,
            ch_name: '通道2',
            ch_temp_read_address: 2002,
            ch_leakcurrent_read_address: 3002,
            ch_current_read_address: 3002,
            current_allowed_range_max: 20,
            current_info_trigger_range: '10-20',
            current_info_trigger_duration: 30,
            current_alarm_trigger_range: '>20',
            current_alarm_trigger_duration: 30,
            temp_info_trigger_range: '32-40',
            temp_info_trigger_duration: 30,
            temp_alarm_trigger_range: '>40',
            temp_alarm_trigger_duration: 30
        },
        {
            id: 3,
            ch_name: '通道3',
            ch_temp_read_address: 2003,
            ch_leakcurrent_read_address: 3003,
            ch_current_read_address: 3003,
            current_allowed_range_max: 20,
            current_info_trigger_range: '10-20',
            current_info_trigger_duration: 30,
            current_alarm_trigger_range: '>20',
            current_alarm_trigger_duration: 30,
            temp_info_trigger_range: '32-40',
            temp_info_trigger_duration: 30,
            temp_alarm_trigger_range: '>40',
            temp_alarm_trigger_duration: 30
        },
        {
            id: 4,
            ch_name: '通道4',
            ch_temp_read_address: 2004,
            ch_leakcurrent_read_address: 3004,
            ch_current_read_address: 3004,
            current_allowed_range_max: 20,
            current_info_trigger_range: '10-20',
            current_info_trigger_duration: 30,
            current_alarm_trigger_range: '>20',
            current_alarm_trigger_duration: 30,
            temp_info_trigger_range: '32-40',
            temp_info_trigger_duration: 30,
            temp_alarm_trigger_range: '>40',
            temp_alarm_trigger_duration: 30
        }
    ]);

    const [advancedSettings, setAdvancedSettings] = useState([
        false, false, false, false, false
    ]);

    const handleApplyConfig = () => {
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
    });

    return (
        <>
            <div>
                <div className="page-header">
                    <h3 className="page-title">{`电箱配置`}</h3>
                    {/* <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to={`/${urlPrefix}/scene`}>场地</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">配置</li>
                    </ol>
                </nav> */}
                </div>
                <div className="row">
                    {
                        channelSettings.map((chSetting, index) => {
                            return (
                                <div className="col-md-6 grid-margin stretch-card" key={`ch-${chSetting.id}`}>
                                    <div className="card">
                                        <div className="card-body">
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                                                onClick={() => {
                                                    console.log('To remove channel: ', chSetting.ch_name);
                                                    setCurrentIndex(index);
                                                    handleShow();
                                                }}>
                                                <h4 className="card-title"><i className="mdi mdi-flash-auto"></i>{`通道${chSetting.id}`}</h4>
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
                                                    <label htmlFor={`currentRange${chSetting.id}`} className="col-sm-3 col-form-label">量程</label>
                                                    <div className="col-sm-9">
                                                        <Form.Control type="text" className="form-control" id={`currentRange${chSetting.id}`} placeholder=""
                                                            value={chSetting.current_allowed_range_max} readOnly />
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
                                                        </>) : null
                                                }
                                                <button type="button" className="btn btn-gradient-primary mr-2" onClick={handleApplyConfig}>确定</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>)
                        })
                    }
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>警告</Modal.Title>
                </Modal.Header>
                <Modal.Body>{`即将删除通道：${channelSettings[currentIndex].ch_name}，是否继续`}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        取消
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        确定
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
