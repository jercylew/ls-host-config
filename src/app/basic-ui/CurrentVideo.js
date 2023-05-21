import React, { useEffect, useRef } from 'react';
import {
    useLocation, Link
} from "react-router-dom";
import flvJs from 'flv.js';
import AxiosClient from '../../lib/AxiosClient';
import HomeUrlPrefix from '../HomeUrlPrefix';

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const startVideoStream = (sceneId, devId, startTime, endTime) => {
    console.log(`Scene: ${sceneId}, devId: ${devId}, startTime: ${startTime}, endTime: ${endTime}`);

    let data = {
        scene_id: sceneId,
        dev_id: devId,
        start_time: startTime,
        end_time: endTime,
    };

    AxiosClient.post('/v1/test/current/start-video', data).then(resp => {
        console.log('startVideoStream: ' + JSON.stringify(resp));
    })
        .catch(error => {
            alert('视频启动失败: ' + error.message);
        });
};

const getHumanReadableTime = (datetime) => {
    const words = datetime.split('T');
    const time = words[1];
    return `${time.substring(0, 2)}:${time.substring(2, 4)}:${time.substring(4, 6)}`;
};

const urlPrefix = HomeUrlPrefix();
export default function CurrentVideo() {
    const [videoUrl, setVideoUrl] = React.useState('http://192.168.0.54/live?port=1935&app=tkt_test&stream=jiulongdczb_ch0');
    const query = useQuery();
    const sceneId = query.get("scene");
    const devId = query.get("id");
    const startTime = query.get("start-time");
    const endTime = query.get("end-time");
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoUrl === '') {
            // const sceneId = query.get("scene");
            // const devId = query.get("id");
            // const startTime = query.get("start-time");
            // const endTime = query.get("end-time");

            // startVideoStream(sceneId, devId, startTime, endTime);
        }
        startVideoStream(sceneId, devId, startTime, endTime);
        setTimeout(() => {
            if (flvJs.isSupported()) {
                const player = flvJs.createPlayer({
                    type: 'flv',
                    isLive: true,
                    cors: true,
                    hasVideo: true,
                    url: videoUrl,
                });
                if (player) {
                    console.log("Now load and play the video ...");
                    player.attachMediaElement(videoRef.current);
                    player.load();
                    player.play();
                }
            }
        }, 2500);
    });

    return (
        <div>
            <div className="page-header">
                <h3 className="page-title">
                    电流监测
                </h3>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>演示</a></li>
                        <li className="breadcrumb-item" aria-current="page">
                            <Link to={`/${urlPrefix}/demo/current`}>电流数据</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">回放视频</li>
                    </ol>
                </nav>
            </div>
            <div className="row">
                <div className="col-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">视频回放</h4>
                            <p className="card-description"> <code>{getHumanReadableTime(startTime)}</code> - <code>{getHumanReadableTime(endTime)}</code></p>
                            <div className="template-demo">
                                <video ref={videoRef} autoPlay={true} muted={true}>
                                    {`Your browser is too old which doesn't support HTML5 video.`}
                                </video>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}