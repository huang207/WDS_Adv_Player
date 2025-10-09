import { getUrlParams } from "./utils/UrlParams";
import { AdvPlayer } from "./AdvPlayer";
import { createApp } from "./utils/createApp";

const { id, tl, at, sv, renderer } = getUrlParams();

const app = await createApp(<'webgl' | 'webgpu'> renderer);
// const iFrameDetection = (window === window.parent);

//create Adv Player
const advplayer = await AdvPlayer.create(app.stage);
(globalThis as any).advplayer = advplayer;

// advplayer.loadAndPlay('2006008');
// advplayer.loadAndPlay('1010110', 'zhcn');

let _id = id ?? prompt("Please enter the story Id", "1000000");

if (sv && sv.toLowerCase() === 'true') {
  const stream = app.canvas.captureStream(30); // 每秒30帧
  let captureStream;
  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia({ audio: true });
    captureStream.getAudioTracks().forEach(element => {
      stream.addTrack(element);
    });
  } catch (error) {
    alert("Failed to capture audio: " + (error instanceof Error ? error.message : error));
  }
  const recorder = new MediaRecorder(stream);

  recorder.ondataavailable = (e) => {
    const videoBlob = new Blob([e.data], { type: 'video/webm' });
    const videoURL = URL.createObjectURL(videoBlob);
    console.log(videoURL); // 视频文件URL，可用于下载或播放
    const fileName = `wds_adv_record_${_id}${tl ? `_${tl}` : ''}_${new Date().valueOf()}.mkv`;
    const link = document.createElement('a');
    link.href = videoURL;
    link.download = fileName;
    link.click();
  };

  advplayer.setRecorder(recorder);
}

_id && advplayer.loadAndPlay(_id, tl, at, sv);
