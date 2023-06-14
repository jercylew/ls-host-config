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

const urlPrefix = HomeUrlPrefix();
export default function SystemConfig() {
    // const query = useQuery();

    const [hostName, setHostName] = useState('');
    const [loginUserName, setLoginUserName] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [hostIP, setHostIP] = useState('');
    const [systemRebootIntervalHour, setSystemRebootIntervalHour] = useState(24);
    const [defaultGateway, setDefaultGateway] = useState('');
    const [mask, setMask] = useState('255.255.255.0');
    const [dns, setDns] = useState('114.114.114.114,8.8.8.8');

    const [shellCmd, setShellCmd] = useState('');
    const [cmdOutput, setCmdOutput] = useState('');

    const handleHostNameChange = event => {
        setHostName(event.target.value);
    };

    const handleApplyHostConfig = () => {
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

        // let cmdData = {
        //     user_id: userId,
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

    const handleExecShellCmd = () => {
        setCmdOutput('Darwin appledeMacBook-Pro.local 19.6.0 Darwin Kernel Version 19.6.0: Tue Jun 21 21:18:39 PDT 2022; root:xnu-6153.141.66~1/RELEASE_X86_64 x86_64');
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
                <h3 className="page-title">{`系统设置`}</h3>
            </div>
            <div className="row">
                <div className="col-md-6 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title"><i className="mdi mdi-bluetooth-settings"></i>主机信息</h4>
                            <form className="forms-sample">
                                <Form.Group className="row">
                                    <label htmlFor="hostName" className="col-sm-3 col-form-label">主机名</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" className="form-control" id="hostName" placeholder="主机名， 如： ls-host-23280"
                                            value={hostName} onChange={handleHostNameChange} />
                                    </div>
                                </Form.Group>
                                <Form.Group className="row">
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
                                            onChange={ (event) => { setLoginPassword(event.target.value); } } placeholder="登录密码" value={loginPassword} />
                                    </div>
                                </Form.Group>
                                <Form.Group className="row">
                                    <label htmlFor="systemRebootIntervalHour" className="col-sm-3 col-form-label">定时重启（小时）</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="number" className="form-control" id="systemRebootIntervalHour"
                                            value={systemRebootIntervalHour}
                                            onChange={(event) => { setSystemRebootIntervalHour(parseInt(event.target.value)); } }
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
                                            value={hostIP} onChange={ (event) => { setHostIP(event.target.value); } } />
                                    </div>
                                </Form.Group>
                                <Form.Group className="row">
                                    <label htmlFor="defaultGateway" className="col-sm-3 col-form-label">默认网关</label>
                                    <div className="col-sm-9">
                                        <Form.Control type="text" className="form-control" id="defaultGateway" placeholder="默认网关，如： 192.168.2.1"
                                            value={defaultGateway} onChange={ (event) => { setDefaultGateway(event.target.value); }} />
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
                                            onChange={ (event) => { setDns(event.target.value); } } placeholder="DNS, 如： 114.114.114.114,8.8.8.8" />
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
                            <h4 className="card-title"><i className="mdi mdi-video"></i>执行Shell命令</h4>
                            <p className="card-description">注： 输入框中输入Linux Shell命令， 点击确认发送命令执行， 执行结果将于下面方框区显示
                            </p>
                            <Form.Group className="row">
                                <label htmlFor="shellCmd" className="col-sm-3 col-form-label">命令</label>
                                <div className="col-sm-9">
                                    <Form.Control type="text" className="form-control" id="shellCmd"
                                        value={shellCmd} onChange={ (event) => { setShellCmd(event.target.value); }}
                                        placeholder="输入Linux Shell命令, 如ps aux | grep TKTMesh" />
                                </div>
                            </Form.Group>
                            <button type="button" className="btn btn-gradient-primary mr-2" onClick={handleExecShellCmd}>执行</button>
                            <Form.Group className="row">
                                <div className='mt-4'>{`命令执行结果:`}</div>
                                <div className="col-sm-12" style={{ border: 'dashed 1px #CFCFCF', resize: 'both', height: '145px' }}>
                                    {cmdOutput}
                                </div>
                            </Form.Group>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}