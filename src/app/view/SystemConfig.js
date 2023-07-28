import React, { useEffect, useState } from 'react';
import {
    useLocation, Link
} from "react-router-dom";
import HomeUrlPrefix from '../HomeUrlPrefix';
import { Form } from 'react-bootstrap';
import bsCustomFileInput from 'bs-custom-file-input';
import AxiosClient from '../../lib/AxiosClient';
import Toast from 'react-bootstrap/Toast';
import { uuidv4 } from '../../lib/uuid';

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const urlPrefix = HomeUrlPrefix();
export default function SystemConfig() {
    const [hostName, setHostName] = useState('');
    const [hostId, setHostId] = useState('');
    const [hostKey, setHostKey] = useState('');
    const [loginUserName, setLoginUserName] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [hostIP, setHostIP] = useState('');
    const [systemRebootIntervalHour, setSystemRebootIntervalHour] = useState(24);
    const [defaultGateway, setDefaultGateway] = useState('');
    const [mask, setMask] = useState('255.255.255.0');
    const [dns, setDns] = useState('114.114.114.114,8.8.8.8');

    const [shellCmd, setShellCmd] = useState('');
    const [cmdOutput, setCmdOutput] = useState('');

    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleHostNameChange = event => {
        setHostName(event.target.value);
    };

    const handleApplyHostConfig = () => {
        const payload = {
            host_name: hostName,
            // login_user_name: loginUserName,
            // login_password: loginPassword,
            host_id: hostId,
            host_key: hostKey,
            system_reboot_interval_hours: systemRebootIntervalHour,
        };

        AxiosClient.post(`v1/system-config/host`, payload).then(resp => {
            const respData = resp.data;
            if (respData.is_succeed) {
                setToastMessage(`更新主机配置成功！`);
                setToastVisible(true);
            }
            else {
                console.log(`更新主机配置失败: ${respData.message}`);
                setToastMessage(`更新主机配置失败！`);
                setToastVisible(true);
            }
        })
            .catch(error => {
                console.log(`更新主机配置失败: ${error.message}`);
                setToastMessage(`更新主机配置失败！`);
                setToastVisible(true);
            });
    };

    const handleApplyNetworkConfig = () => {
        if (hostIP === '' || defaultGateway === '') {
            alert('请输入要配的IP和网关！');
            return;
        }

        const payload = {
            method: 'static',
            ip: hostIP,
            mask: mask,
            dns: dns,
            gateway: defaultGateway,
        };

        AxiosClient.post(`v1/system-config/network`, payload).then(resp => {
            const respData = resp.data;
            if (respData.is_succeed) {
                setToastMessage(`配置网络成功！`);
                setToastVisible(true);
            }
            else {
                console.log(`配置网络失败: ${respData.message}`);
                setToastMessage(`配置网络失败！`);
                setToastVisible(true);
            }
        })
            .catch(error => {
                console.log(`配置网络失败: ${error.message}`);
                setToastMessage(`配置网络失败！`);
                setToastVisible(true);
            });
    };

    const handleRestoreNetworkToDHCP = () => {
        const payload = {
            method: 'dhcp',
        };

        AxiosClient.post(`v1/system-config/network`, payload).then(resp => {
            const respData = resp.data;
            if (respData.is_succeed) {
                setToastMessage(`重置网络成功！`);
                setToastVisible(true);
            }
            else {
                console.log(`重置网络失败: ${respData.message}`);
                setToastMessage(`重置网络失败！`);
                setToastVisible(true);
            }
        })
            .catch(error => {
                console.log(`重置网络失败: ${error.message}`);
                setToastMessage(`重置网络失败！`);
                setToastVisible(true);
            });
    };

    const handleExecShellCmd = () => {
        if (shellCmd === '') {
            return;
        }

        const payload = {
            cmd: shellCmd,
        };

        AxiosClient.post(`v1/system-config/shell-cmd`, payload).then(resp => {
            const respData = resp.data;
            if (respData.is_succeed) {
                console.log('Cmd result:', respData.data);
                setCmdOutput(respData.data.cmd_result);
            }
            else {
                console.log(`执行命令失败: ${respData.message}`);
                setCmdOutput(`执行命令失败: ${respData.message}`);
            }
        })
            .catch(error => {
                console.log(`执行命令失败: ${error.message}`);
                setCmdOutput(`执行命令失败: ${error.message}`);
            });
    };


    useEffect(() => {
        bsCustomFileInput.init();
        AxiosClient.get(`v1/system-config/host`)
            .then(res => {
                const respData = res.data
                if (respData.is_succeed) {
                    setHostName(respData.data.host_name);
                    // setLoginUserName(respData.data.login_user);
                    // setLoginPassword(respData.data.login_password);
                    setHostId(respData.data.host_id);
                    setHostKey(respData.data.host_key);
                    setSystemRebootIntervalHour(respData.data.auto_reboot_interval_hours);
                }
            }).catch(err => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        bsCustomFileInput.init();
        AxiosClient.get(`v1/system-config/network`)
            .then(res => {
                const respData = res.data
                if (respData.is_succeed) {
                    setHostIP(respData.data.host_ip);
                    setMask(respData.data.mask);
                    setDefaultGateway(respData.data.default_gateway);
                    setDns(respData.data.dns);
                }
            }).catch(err => {
                console.log(err);
            });
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
                    <h3 className="page-title">{`系统设置`}</h3>
                </div>
                <div className="row">
                    <div className="col-md-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title"><i className="mdi mdi-laptop"></i>主机信息</h4>
                                <form className="forms-sample">
                                    <Form.Group className="row">
                                        <label htmlFor="hostName" className="col-sm-3 col-form-label">主机名</label>
                                        <div className="col-sm-9">
                                            <Form.Control type="text" className="form-control" id="hostName" placeholder="主机名， 如： ls-host-23280"
                                                value={hostName} onChange={handleHostNameChange} />
                                        </div>
                                    </Form.Group>
                                    {/* <Form.Group className="row">
                                        <label htmlFor="loginUserName" className="col-sm-3 col-form-label">登录用户名</label>
                                        <div className="col-sm-9">
                                            <Form.Control type="text" className="form-control" id="loginUserName"
                                                onChange={(event) => { setLoginUserName(event.target.value) }} placeholder="登录用户名" value={loginUserName} />
                                        </div>
                                    </Form.Group>
                                    <Form.Group className="row">
                                        <label htmlFor="loginPassword" className="col-sm-3 col-form-label">登录密码</label>
                                        <div className="col-sm-9">
                                            <Form.Control type="password" className="form-control" id="loginPassword"
                                                onChange={(event) => { setLoginPassword(event.target.value); }} placeholder="登录密码" value={loginPassword} />
                                        </div>
                                    </Form.Group> */}
                                    <Form.Group className="row">
                                        <label htmlFor="hostId" className="col-sm-3 col-form-label">Host Id</label>
                                        <div className="col-sm-9">
                                            <Form.Control type="text" className="form-control" id="hostId"
                                                onChange={(event) => { setHostId(event.target.value); }} placeholder="Host Id" value={hostId} />
                                        </div>
                                    </Form.Group>
                                    <Form.Group className="row">
                                        <label htmlFor="hostKey" className="col-sm-3 col-form-label">Host Key</label>
                                        <div className="col-sm-9">
                                            <Form.Control type="text" className="form-control" id="hostKey"
                                                onChange={(event) => { setHostKey(event.target.value); }} placeholder="Host Key" value={hostKey} />
                                        </div>
                                    </Form.Group>
                                    <Form.Group className="row">
                                        <label htmlFor="systemRebootIntervalHour" className="col-sm-3 col-form-label">定时重启（小时）</label>
                                        <div className="col-sm-9">
                                            <Form.Control type="number" className="form-control" id="systemRebootIntervalHour"
                                                value={systemRebootIntervalHour}
                                                onChange={(event) => { setSystemRebootIntervalHour(parseInt(event.target.value)); }}
                                                placeholder="设置自动重启时间间隔" />
                                        </div>
                                    </Form.Group>
                                    <button type="button" className="btn btn-gradient-primary mr-2" onClick={handleApplyHostConfig}>确定</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title"><i className="mdi mdi-ethernet"></i>网络配置</h4>
                                <form className="forms-sample">
                                    <Form.Group className="row">
                                        <label htmlFor="hostIP" className="col-sm-3 col-form-label">IP</label>
                                        <div className="col-sm-9">
                                            <Form.Control type="text" className="form-control" id="hostIP" placeholder="IP地址, 如： 192.168.2.100"
                                                value={hostIP} onChange={(event) => { setHostIP(event.target.value); }} />
                                        </div>
                                    </Form.Group>
                                    <Form.Group className="row">
                                        <label htmlFor="defaultGateway" className="col-sm-3 col-form-label">默认网关</label>
                                        <div className="col-sm-9">
                                            <Form.Control type="text" className="form-control" id="defaultGateway" placeholder="默认网关，如： 192.168.2.1"
                                                value={defaultGateway} onChange={(event) => { setDefaultGateway(event.target.value); }} />
                                        </div>
                                    </Form.Group>
                                    <Form.Group className="row">
                                        <label htmlFor="mask" className="col-sm-3 col-form-label">子网掩码</label>
                                        <div className="col-sm-9">
                                            <Form.Control type="text" className="form-control" id="mask" placeholder="子网掩码，如： 255.255.255.0"
                                                value={mask} onChange={(event) => { setMask(event.target.value); }} />
                                        </div>
                                    </Form.Group>
                                    <Form.Group className="row">
                                        <label htmlFor="dns" className="col-sm-3 col-form-label">DNS(逗号隔开)</label>
                                        <div className="col-sm-9">
                                            <Form.Control type="text" value={dns} className="form-control" id="dns"
                                                onChange={(event) => { setDns(event.target.value); }} placeholder="DNS, 如： 114.114.114.114,8.8.8.8" />
                                        </div>
                                    </Form.Group>
                                    <Form.Group className="row">
                                        <button type="button" className="btn btn-gradient-primary col-sm-6 col-md-3 col-lg-3 mt-2" onClick={handleApplyNetworkConfig}>确定</button>
                                        <button type="button" className="btn btn-gradient-danger col-sm-6 col-md-3 col-lg-3 mt-2" onClick={handleRestoreNetworkToDHCP}>重置</button>
                                    </Form.Group>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title"><i className="mdi mdi-video"></i>执行Shell命令</h4>
                                <p className="card-description">注： 输入框中输入Linux Shell命令， 点击确认发送命令执行， 执行结果将于下面方框区显示
                                </p>
                                <Form.Group className="row">
                                    <label htmlFor="shellCmd" className="col-sm-3 col-form-label">命令</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" className="form-control" id="shellCmd"
                                            value={shellCmd} onChange={(event) => { setShellCmd(event.target.value); }}
                                            placeholder="输入Linux Shell命令, 如ps aux | grep TKTMesh" />
                                    </div>
                                </Form.Group>
                                <button type="button" className="btn btn-gradient-primary mr-2" onClick={handleExecShellCmd}>执行</button>
                                <Form.Group className="row">
                                    <div className='mt-4'>{`命令执行结果:`}</div>
                                    <textarea cols='90' value={cmdOutput}
                                        maxLength='999999' id='cmdResult'
                                        className='col-sm-12'
                                        style={{ border: 'dashed 1px #CFCFCF',
                                        resize: 'both', height: '280px',overflowY: 'scroll',
                                        width: '100%', fontSize: '12px' }} />
                                </Form.Group>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
